/**
 * Reads book-raw.txt, extracts key sections, sends to GPT,
 * and builds src/data/numerology-book.json
 *
 * Run once: node scripts/structure-book.js
 */

const fs = require('fs');
const path = require('path');
// Read .env.local manually (avoid dotenv dependency)
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const m = line.match(/^([^#=]+)=(.+)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const OpenAI = require('openai').default;
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── helpers ──────────────────────────────────────────────────────────────────

function getPages(rawText, from, to) {
  const lines = rawText.split('\n');
  const result = [];
  let inRange = false;
  let currentPage = 0;

  for (const line of lines) {
    const match = line.match(/^--- PAGE (\d+) ---/);
    if (match) {
      currentPage = parseInt(match[1]);
      inRange = currentPage >= from && currentPage <= to;
    } else if (inRange) {
      result.push(line);
    }
  }
  return result.join('\n').replace(/\s+/g, ' ').trim();
}

async function askGPT(systemPrompt, userContent, label) {
  console.log(`\n⏳ Processing: ${label} ...`);
  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
  });
  const text = resp.choices[0].message.content;
  console.log(`✅ Done: ${label} (${text.length} chars)`);
  return JSON.parse(text);
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const rawText = fs.readFileSync(path.join(__dirname, 'book-raw.txt'), 'utf-8');

  // Section page ranges (from TOC)
  const sections = {
    basicMeanings:    getPages(rawText, 65,  93),   // Значения цифр 1-9, 0
    quantitative:     getPages(rawText, 94,  175),  // Количественные характеристики
    transitions:      getPages(rawText, 176, 202),  // Переходы цифр (комбинации)
    lines:            getPages(rawText, 28,  64),   // Строки, столбцы, диагонали
  };

  console.log('Section sizes (chars):');
  for (const [k, v] of Object.entries(sections)) {
    console.log(`  ${k}: ${v.length}`);
  }

  // ── 1. Basic digit meanings ──────────────────────────────────────────────────
  const basicMeanings = await askGPT(
    `You are a numerology book parser. Extract the meaning of each digit from the Russian text below.
Return a JSON object with this shape:
{
  "1": { "name": "...", "essence": "...", "keywords": ["...", "..."] },
  "2": { ... },
  ...
  "0": { ... }
}
Keep each "essence" under 200 words. Extract only the most important insights.`,
    sections.basicMeanings,
    'Basic digit meanings (1-9, 0)'
  );

  // ── 2. Quantitative characteristics (per-cell counts) ───────────────────────
  const quantitative = await askGPT(
    `You are a numerology book parser. This Russian text describes what it means to have 0, 1, 2, 3, 4, 5+ occurrences of each digit in the Pythagorean matrix.
Return a JSON object with this shape:
{
  "1": {
    "cellName": "Характер",
    "counts": {
      "0": "interpretation when digit 1 is absent...",
      "1": "interpretation for one occurrence...",
      "2": "interpretation for two occurrences...",
      "3": "interpretation for three occurrences...",
      "4": "interpretation for four occurrences...",
      "5+": "interpretation for five or more occurrences..."
    }
  },
  "2": { "cellName": "Энергия", "counts": { ... } },
  "3": { "cellName": "Интерес/Самооценка", ... },
  "4": { "cellName": "Здоровье", ... },
  "5": { "cellName": "Логика", ... },
  "6": { "cellName": "Труд/Заземление", ... },
  "7": { "cellName": "Удача", ... },
  "8": { "cellName": "Чувство долга", ... },
  "9": { "cellName": "Память/Интеллект", ... }
}
Each count interpretation should be 50-150 words. Be specific and direct.`,
    sections.quantitative,
    'Quantitative characteristics'
  );

  // ── 3. Transitions / combinations ───────────────────────────────────────────
  const transitions = await askGPT(
    `You are a numerology book parser. This Russian text describes special combinations and transitions between digits in the psychomatrix.
Return a JSON object:
{
  "description": "brief intro about transitions...",
  "pairs": {
    "1-2": "interpretation when both 1 and 2 are present...",
    "1-4": "...",
    "2-3": "...",
    ... (extract all pairs mentioned)
  },
  "specials": {
    "111": "three 1s meaning...",
    "222": "...",
    "1111": "...",
    ... (all special repetition patterns mentioned)
  }
}
Keep each value under 100 words.`,
    sections.transitions,
    'Transitions/combinations'
  );

  // ── 4. Lines (rows, columns, diagonals) ─────────────────────────────────────
  const lines = await askGPT(
    `You are a numerology book parser. This Russian text describes the meaning of rows, columns, and diagonals of the psychomatrix.
Return a JSON object:
{
  "rows": {
    "123": { "name": "...", "meaning": "..." },
    "456": { "name": "...", "meaning": "..." },
    "789": { "name": "...", "meaning": "..." }
  },
  "columns": {
    "147": { "name": "...", "meaning": "..." },
    "258": { "name": "...", "meaning": "..." },
    "369": { "name": "...", "meaning": "..." }
  },
  "diagonals": {
    "159": { "name": "...", "meaning": "..." },
    "357": { "name": "...", "meaning": "..." }
  }
}
Keep each "meaning" under 100 words. Extract from Russian text.`,
    sections.lines,
    'Lines (rows/columns/diagonals)'
  );

  // ── Assemble and save ────────────────────────────────────────────────────────
  const book = {
    _meta: {
      source: 'Александров А.Ф. — Нумерология. Полный курс.',
      generated: new Date().toISOString(),
    },
    basicMeanings,
    quantitative,
    transitions,
    lines,
  };

  const outPath = path.join(__dirname, '../src/data/numerology-book.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(book, null, 2), 'utf-8');

  console.log(`\n✅ numerology-book.json saved (${JSON.stringify(book).length} chars)`);
  console.log(`Path: ${outPath}`);
}

main().catch(console.error);
