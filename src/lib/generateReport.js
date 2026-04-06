import OpenAI from 'openai';
import { BOOK, PDF_SECTIONS } from '@/data/numerology-book.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Получить интерпретацию из книги по полю и количеству цифр
function getBookInterpretation(field, count) {
  const entry = BOOK[field];
  if (!entry) return '';
  if (!entry.interpretations) return entry.description || '';
  const key = count >= 4 ? 4 : count;
  return entry.interpretations[key] ?? entry.interpretations['default'] ?? entry.description ?? '';
}

// Собрать контекст матрицы для промпта
function buildMatrixContext(matrixData) {
  const fields = [
    { key: 'char',     label: 'Характер (1)',           count: (matrixData.char?.v?.length || 0) },
    { key: 'health',   label: 'Здоровье (4)',            count: (matrixData.health?.v?.length || 0) },
    { key: 'luck',     label: 'Удача (7)',               count: (matrixData.luck?.v?.length || 0) },
    { key: 'energy',   label: 'Энергетика (2)',          count: (matrixData.energy?.v?.length || 0) },
    { key: 'logic',    label: 'Логика (5)',              count: (matrixData.logic?.v?.length || 0) },
    { key: 'duty',     label: 'Долг/Ответственность (8)',count: (matrixData.duty?.v?.length || 0) },
    { key: 'interest', label: 'Интерес к жизни (3)',     count: (matrixData.interest?.v?.length || 0) },
    { key: 'labor',    label: 'Трудолюбие (6)',          count: (matrixData.labor?.v?.length || 0) },
    { key: 'memory',   label: 'Память (9)',              count: (matrixData.memory?.v?.length || 0) },
  ];

  return fields.map(({ key, label, count }) => {
    const bookText = getBookInterpretation(key, count);
    const value = matrixData[key]?.v || '—';
    const status = matrixData[key]?.s || '';
    return `• ${label}: ${value} (${status})\n  Знание из книги: ${bookText}`;
  }).join('\n\n');
}

// Генерировать текст одной секции через GPT
async function generateSection(section, matrixData, name, birthDate, bookRawText = '') {
  const fields = section.fields.map(key => {
    const entry = BOOK[key];
    const isMainCell = matrixData[key]?.v !== undefined;
    const value = isMainCell ? matrixData[key].v : (matrixData[key] || '—');
    const status = isMainCell ? (matrixData[key].s || '') : '';
    const bookText = getBookInterpretation(key, isMainCell ? (matrixData[key]?.v?.length || 0) : 0);
    return `${entry?.title || key}: ${value}${status ? ` (${status})` : ''}\nКнига: ${bookText}`;
  }).join('\n\n');

  const systemPrompt = `Ты профессиональный нумеролог, пишешь персональный разбор матрицы Пифагора. 
Стиль: тёплый, глубокий, конкретный. Не используй общие фразы. Обращайся к человеку по имени.
Язык: русский. Объём: 3-5 предложений на секцию. Без заголовков, без markdown.
${bookRawText ? `\nДополнительный контекст из книги:\n${bookRawText.slice(0, 3000)}` : ''}`;

  const userPrompt = `Имя: ${name}
Дата рождения: ${birthDate}
Раздел: ${section.title}

Данные матрицы для этого раздела:
${fields}

${section.prompt}
Напиши персональный текст для ${name}, обращаясь напрямую к ней/нему.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 400,
    temperature: 0.75,
  });

  return response.choices[0].message.content.trim();
}

// Генерировать краткое резюме/рекомендации
async function generateSummary(matrixData, name, birthDate) {
  const context = buildMatrixContext(matrixData);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Ты нумеролог. Напиши краткое вдохновляющее резюме разбора и 3 конкретные рекомендации для человека. Тёплый, поддерживающий тон. На русском языке.',
      },
      {
        role: 'user',
        content: `Имя: ${name}, дата рождения: ${birthDate}\n\nМатрица:\n${context}\n\nНапиши итоговое резюме (2-3 предложения) и три конкретные рекомендации в формате "1. ... 2. ... 3. ..."`,
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
}

// Основная функция — генерирует все секции
export async function generateFullReport(matrixData, name, birthDate, bookRawText = '') {
  const sections = await Promise.all(
    PDF_SECTIONS.map(section =>
      generateSection(section, matrixData, name, birthDate, bookRawText)
        .then(text => ({ ...section, text }))
    )
  );

  const summary = await generateSummary(matrixData, name, birthDate);

  return { sections, summary };
}
