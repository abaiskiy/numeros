import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  calculateMatrix, buildBookContext, detectCombinations,
  calculatePinnacles, getPersonalYears, getKarmicLessons,
  calculateNameNumerology, getFamousByDestiny,
} from '@/lib/matrixCalc';

// ─── GPT analysis ─────────────────────────────────────────────────────────────

async function generateAnalysis(name, birthDate, matrix, book, nameNumerology, karmicLessons, foundCombinations) {
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const bookContext = buildBookContext(matrix, book);
  const dateFormatted = new Date(birthDate + 'T00:00:00')
    .toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const [y, m, d] = birthDate.split('-').map(Number);
  const currentYear = new Date().getFullYear();
  const personalYear = String(d + m + currentYear).split('').reduce((s, x) => s + +x, 0);

  // ── Fixed talismans from book (based on reduced destiny number) ────────────
  const reduceSingle = (n) => {
    let num = Math.abs(n);
    while (num > 9) num = String(num).split('').reduce((s, x) => s + +x, 0);
    return num;
  };
  const destinyKey  = String(reduceSingle(matrix.destiny));
  const talismanRow = book.talismans?.[destinyKey] ?? null;
  const fixedTalismans = talismanRow
    ? { colors: talismanRow.colors, stones: talismanRow.stones, day: talismanRow.day, numbers: talismanRow.luckyNumbers, planet: talismanRow.planet }
    : null;

  const nameCtx = nameNumerology
    ? `\nЧИСЛА ИМЕНИ «${name}»:\n- Число выражения: ${nameNumerology.expression}\n- Число души (гласные): ${nameNumerology.soulUrge}\n- Число личности (согласные): ${nameNumerology.personality}`
    : '';

  const karmicCtx = karmicLessons.length > 0
    ? `\nКАРМИЧЕСКИЕ УРОКИ (отсутствующие цифры): ${karmicLessons.map(l => l.digit).join(', ')}`
    : '\nКАРМИЧЕСКИЕ УРОКИ: все цифры присутствуют — кармических долгов нет';

  const prompt = `Ты — профессиональный нумеролог. Составь подробный персональный нумерологический разбор для ${name} (дата рождения: ${dateFormatted}).

МАТРИЦА ПИФАГОРА:
- Характер (1): ${matrix.char.v} [${matrix.char.s}]
- Энергия (2): ${matrix.energy.v} [${matrix.energy.s}]
- Интерес к жизни (3): ${matrix.interest.v} [${matrix.interest.s}]
- Здоровье (4): ${matrix.health.v} [${matrix.health.s}]
- Логика (5): ${matrix.logic.v} [${matrix.logic.s}]
- Труд и деньги (6): ${matrix.labor.v} [${matrix.labor.s}]
- Удача (7): ${matrix.luck.v} [${matrix.luck.s}]
- Чувство долга (8): ${matrix.duty.v} [${matrix.duty.s}]
- Память и интеллект (9): ${matrix.memory.v} [${matrix.memory.s}]

КЛЮЧЕВЫЕ ЧИСЛА:
- Число судьбы: ${matrix.destiny}
- Число души: ${matrix.soul}
- Число кармы: ${matrix.karma}
- Потенциал: ${matrix.hidden}
- Личный год (${currentYear}): ${personalYear}

ЛИНИИ МАТРИЦЫ (сумма цифр в линии):
- Самооценка (1-2-3): ${matrix.selfEsteem}
- Быт (4-5-6): ${matrix.household}
- Талант (7-8-9): ${matrix.talent}
- Целеустремлённость/Цель (1-4-7): ${matrix.goal}
- Семья (2-5-8): ${matrix.family}
- Стабильность (3-6-9): ${matrix.stability}
- Духовность (1-5-9): ${matrix.spirituality}
- Темперамент (3-5-7): ${matrix.temperament}
${nameCtx}
${karmicCtx}

${bookContext}

Составь разбор строго в формате JSON (только JSON, без markdown):
{
  "intro": "2-3 предложения — что такое психоматрица Пифагора и чему посвящён этот разбор для ${name}",
  "keyNumbers": {
    "destiny": "80-100 слов: что означает число судьбы ${matrix.destiny} конкретно для ${name} — жизненный путь, предназначение, какие задачи судьба ставит перед этим числом. Обращение на Вы.",
    "soul": "80-100 слов: что означает число души ${matrix.soul} — внутренние желания, истинные ценности, чего Вы ищете в глубине души. Обращение на Вы.",
    "karma": "80-100 слов: что означает число кармы ${matrix.karma} — уроки прошлых воплощений, какие ситуации будут повторяться пока урок не усвоен. Обращение на Вы.",
    "potential": "80-100 слов: что означает число потенциала ${matrix.hidden} — скрытые таланты и возможности, которые раскрываются со временем. Обращение на Вы."
  },
  "cells": [
    {
      "digit": 1,
      "title": "Характер и воля",
      "value": "${matrix.char.v}",
      "status": "${matrix.char.s}",
      "content": "80-120 слов, обращение на Вы, конкретный личный анализ"
    },
    { "digit": 2, "title": "Энергия и биополе", "value": "${matrix.energy.v}", "status": "${matrix.energy.s}", "content": "80-120 слов" },
    { "digit": 3, "title": "Интерес к жизни", "value": "${matrix.interest.v}", "status": "${matrix.interest.s}", "content": "80-120 слов" },
    { "digit": 4, "title": "Здоровье и тело", "value": "${matrix.health.v}", "status": "${matrix.health.s}", "content": "80-120 слов" },
    { "digit": 5, "title": "Логика и интуиция", "value": "${matrix.logic.v}", "status": "${matrix.logic.s}", "content": "80-120 слов" },
    { "digit": 6, "title": "Труд и материальный мир", "value": "${matrix.labor.v}", "status": "${matrix.labor.s}", "content": "80-120 слов" },
    { "digit": 7, "title": "Удача и везение", "value": "${matrix.luck.v}", "status": "${matrix.luck.s}", "content": "80-120 слов" },
    { "digit": 8, "title": "Чувство долга и ответственность", "value": "${matrix.duty.v}", "status": "${matrix.duty.s}", "content": "80-120 слов" },
    { "digit": 9, "title": "Память и интеллект", "value": "${matrix.memory.v}", "status": "${matrix.memory.s}", "content": "80-120 слов" }
  ],
  "combinations": [
    ВНИМАНИЕ: оставь поля title и digits точно как указано ниже. Напиши только поле content.
    ${foundCombinations.length === 0 ? '' : foundCombinations.map(c => `{
      "title": "${c.label}",
      "digits": "${c.digits}",
      "content": "80-120 слов: персональный разбор значения этой комбинации конкретно для ${name} — жизненные проявления, сильные стороны или зоны роста, практические советы. ${c.bookDesc ? 'Книжный контекст: ' + c.bookDesc.replace(/"/g, "'") : 'Опирайся на нумерологические знания по данной комбинации.'}. Обращение на Вы."
    }`).join(',\n    ')}
  ],
  "money": {
    "score": <число от 1 до 10>,
    "title": "Денежный потенциал",
    "content": "100-150 слов: финансовые таланты, путь к деньгам, советы. Обращение на Вы."
  },
  "relationships": {
    "title": "Код отношений",
    "content": "100-150 слов: характер в отношениях, идеальный партнёр, советы. Обращение на Вы."
  },
  "forecast": {
    "year": ${currentYear},
    "personalYear": ${personalYear},
    "title": "Прогноз на ${currentYear} год",
    "content": "100-150 слов: что несёт личный год ${personalYear} для ${name}. Обращение на Вы."
  },
  "strengths": [
    "конкретная сильная сторона 1 (15-20 слов)",
    "сильная сторона 2",
    "сильная сторона 3",
    "сильная сторона 4",
    "сильная сторона 5"
  ],
  "weaknesses": [
    "зона роста 1 — что развивать и как (15-20 слов)",
    "зона роста 2",
    "зона роста 3"
  ],
  "lines": {
    "selfEsteem":   "60-80 слов: что означает линия Самооценки (1-2-3) со значением ${matrix.selfEsteem} конкретно для ${name} — как вы воспринимаете себя, ваша самооценка и самовыражение. Обращение на Вы.",
    "household":    "60-80 слов: что означает линия Быта (4-5-6) со значением ${matrix.household} — как вы справляетесь с бытовыми задачами, отношение к дому и комфорту. Обращение на Вы.",
    "talent":       "60-80 слов: что означает линия Таланта (7-8-9) со значением ${matrix.talent} — ваши природные дарования, творческий потенциал и реализация. Обращение на Вы.",
    "goal":         "60-80 слов: что означает линия Целеустремлённости (1-4-7) со значением ${matrix.goal} — насколько сильна ваша воля к цели, напористость и достижение результата. Обращение на Вы.",
    "family":       "60-80 слов: что означает линия Семьи (2-5-8) со значением ${matrix.family} — ваша роль в семье, отношение к родным и близким, семейные ценности. Обращение на Вы.",
    "stability":    "60-80 слов: что означает линия Стабильности (3-6-9) со значением ${matrix.stability} — ваше умение создавать устойчивость, постоянство в жизни. Обращение на Вы.",
    "spirituality": "60-80 слов: что означает линия Духовности (1-5-9) со значением ${matrix.spirituality} — ваша связь с высшим, интуиция, смысл жизни и внутренний поиск. Обращение на Вы.",
    "temperament":  "60-80 слов: что означает линия Темперамента (3-5-7) со значением ${matrix.temperament} — ваш тип темперамента, эмоциональность, реакции и жизненная скорость. Обращение на Вы."
  },
  "karmicSummary": "60-80 слов: что означают кармические уроки для ${name}, как работать с ними. Обращение на Вы.",
  "nameAnalysis": "${nameNumerology ? `60-80 слов о том, что число выражения ${nameNumerology.expression} и число души имени ${nameNumerology.soulUrge} говорят об имени «${name}»` : 'пустая строка'}",
  "archetype": {
    "name": "Одно слово — архетип личности (Творец / Лидер / Целитель / Мудрец / Искатель / Хранитель / Вдохновитель / Строитель / Мистик)",
    "tagline": "Одна сильная фраза-девиз этого архетипа (до 8 слов)",
    "description": "70-90 слов: в чём суть этого архетипа применительно к ${name}, как он проявляется в жизни. Обращение на Вы.",
    "traits": ["качество 1 (1-2 слова)", "качество 2", "качество 3", "качество 4", "качество 5"]
  },
  "affirmations": [
    "Аффирмация 1 — личная, конкретная, в настоящем времени, на Я (до 12 слов)",
    "Аффирмация 2",
    "Аффирмация 3",
    "Аффирмация 4",
    "Аффирмация 5"
  ],
  "talismans": {
    "colors": ${fixedTalismans ? JSON.stringify(fixedTalismans.colors) : '["Цвет 1", "Цвет 2", "Цвет 3"]'},
    "stones": ${fixedTalismans ? JSON.stringify(fixedTalismans.stones) : '["Камень 1", "Камень 2", "Камень 3"]'},
    "numbers": ${fixedTalismans ? JSON.stringify(fixedTalismans.numbers) : '[1, 2, 3]'},
    "day": "${fixedTalismans ? fixedTalismans.day : 'Воскресенье'}",
    "note": "35-45 слов: объясни, почему эти цвета (${fixedTalismans ? fixedTalismans.colors.join(', ') : ''}), камни (${fixedTalismans ? fixedTalismans.stones.join(', ') : ''}) и день (${fixedTalismans ? fixedTalismans.day : ''}) связаны с планетой ${fixedTalismans ? fixedTalismans.planet : ''} — покровителем числа судьбы ${destinyKey}. Обращение на Вы."
  },
  "tips": {
    "money": "2-3 конкретных практических совета по финансам и деньгам (35-45 слов). Обращение на Вы.",
    "relationships": "2-3 конкретных совета по отношениям и партнёрству (35-45 слов). Обращение на Вы.",
    "health": "2-3 конкретных совета по здоровью и энергии (35-45 слов). Обращение на Вы.",
    "career": "2-3 конкретных совета по карьере и реализации (35-45 слов). Обращение на Вы."
  },
  "conclusion": "150-200 слов: главные выводы, сильные стороны, рекомендации, вдохновляющее напутствие. Обращение на Вы."
}

ВАЖНО: Пиши на русском. Обращайся на Вы. Будь конкретным и вдохновляющим.`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.75,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
  });

  const analysis = JSON.parse(resp.choices[0].message.content);

  // Always override talismans with fixed book values — GPT must not change them
  if (fixedTalismans && analysis.talismans) {
    analysis.talismans.colors  = fixedTalismans.colors;
    analysis.talismans.stones  = fixedTalismans.stones;
    analysis.talismans.numbers = fixedTalismans.numbers;
    analysis.talismans.day     = fixedTalismans.day;
  }

  return analysis;
}

// ─── Build PDF ────────────────────────────────────────────────────────────────

async function buildPDF(name, birthDate, matrix, analysis, extras) {
  const { createElement } = await import('react');
  const { renderToBuffer } = await import('@react-pdf/renderer');
  const { NumerologyPDF } = await import('@/lib/NumerologyPDF');

  const doc = createElement(NumerologyPDF, { name, birthDate, matrix, analysis, extras });
  return await renderToBuffer(doc);
}

// ─── Send email ───────────────────────────────────────────────────────────────

async function sendEmail(name, email, pdfBuffer, matrix, analysis) {
  const { Resend } = await import('resend');
  const apiKey = process.env.RESEND_API_KEY;
  console.log('[sendEmail] RESEND_API_KEY present:', !!apiKey, '| first 8 chars:', apiKey?.slice(0, 8));

  const resend = new Resend(apiKey);
  const dateStr = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const archetype  = analysis?.archetype?.name ?? '';
  const topStrength = analysis?.strengths?.[0] ?? '';
  const numCell = (label, val, color) =>
    `<div style="flex:1;background:#14151C;border:1px solid #2A2B35;border-radius:10px;padding:12px 8px;text-align:center;min-width:80px;">
      <div style="font-size:22px;font-weight:700;color:${color};margin-bottom:4px;">${val}</div>
      <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">${label}</div>
    </div>`;

  // Retry up to 3 times on failure
  for (let attempt = 1; attempt <= 3; attempt++) {
    const { data, error } = await resend.emails.send({
      from: 'Numeros <razbor@numeros.kz>',
      to: email,
      subject: `Ваш нумерологический разбор готов, ${name}`,
      html: `
        <div style="background:#0D0E14;color:#fff;font-family:Inter,sans-serif;padding:0;max-width:560px;margin:auto;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <div style="background:linear-gradient(135deg,#1C1A10,#0D0E14);padding:32px 32px 24px;border-bottom:1px solid #2A2B35;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
              <div style="width:36px;height:36px;border-radius:50%;border:1px solid #C9A84C;background:#1C1A10;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#C9A84C;text-align:center;line-height:36px;">N</div>
              <span style="font-size:18px;font-weight:700;color:#C9A84C;letter-spacing:3px;">NUMEROS</span>
            </div>
            <h1 style="margin:0 0 8px;font-size:22px;color:#fff;">${name}, ваш разбор готов!</h1>
            <p style="margin:0;font-size:14px;color:#888;">Персональный нумерологический разбор · ${dateStr}</p>
          </div>

          <!-- Key numbers -->
          <div style="padding:24px 32px;">
            <p style="margin:0 0 16px;font-size:13px;color:#C9A84C;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Ваши ключевые числа</p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px;">
              ${numCell('Судьба',    matrix.destiny, '#C9A84C')}
              ${numCell('Душа',      matrix.soul,    '#C9A84C')}
              ${numCell('Карма',     matrix.karma,   '#9B7FCA')}
              ${numCell('Потенциал', matrix.hidden,  '#5B9BD5')}
            </div>

            ${archetype ? `
            <div style="background:#0F0C1C;border:1px solid #3A2A50;border-left:3px solid #9B7FCA;border-radius:10px;padding:14px 16px;margin-bottom:16px;">
              <p style="margin:0 0 4px;font-size:11px;color:#9B7FCA;text-transform:uppercase;letter-spacing:1px;">Ваш архетип</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#C4A8E8;">${archetype}</p>
            </div>` : ''}

            ${topStrength ? `
            <div style="background:#0A100A;border:1px solid #1E2A12;border-left:3px solid #8ABF5A;border-radius:10px;padding:14px 16px;margin-bottom:24px;">
              <p style="margin:0 0 4px;font-size:11px;color:#8ABF5A;text-transform:uppercase;letter-spacing:1px;">Главная сила</p>
              <p style="margin:0;font-size:13px;color:#B0D090;line-height:1.6;">${topStrength}</p>
            </div>` : ''}

            <!-- PDF attachment notice -->
            <div style="background:#14151C;border:1px solid #2A2B35;border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="color:#C9A84C;font-size:13px;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">📎 Полный разбор во вложении</p>
              <p style="color:#aaa;font-size:13px;margin:0;line-height:1.6;">В PDF: матрица Пифагора, разбор всех 9 секторов, значимые комбинации, денежный потенциал, код отношений, прогноз, пиннаклы, личные годы, архетип, аффирмации и талисманы.</p>
            </div>

            <p style="color:#555;font-size:11px;margin:0;text-align:center;">numeros.kz · Психоматрица Пифагора · ${dateStr}</p>
          </div>
        </div>
      `,
      attachments: [{
        filename: `numeros-razbor-${name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        content: Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer),
      }],
    });

    if (error) {
      console.error(`[sendEmail] Attempt ${attempt} failed:`, JSON.stringify(error, null, 2));
      if (attempt === 3) throw new Error(`Resend: ${error.message ?? JSON.stringify(error)}`);
      await new Promise(r => setTimeout(r, 2000 * attempt));
      continue;
    }

    console.log('[sendEmail] Resend OK, id:', data?.id);
    return;
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req) {
  try {
    const { name, email, birthDate } = await req.json();

    if (!name || !email || !birthDate) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }

    console.log('[order] 1. Calculating matrix for', birthDate);
    const matrix = calculateMatrix(birthDate);

    console.log('[order] 2. Computing extras...');
    const pinnacles      = calculatePinnacles(birthDate);
    const personalYears  = getPersonalYears(birthDate, 5);
    const karmicLessons  = getKarmicLessons(matrix.counts);
    const nameNumerology = calculateNameNumerology(name);
    const famous         = getFamousByDestiny(matrix.destiny);

    console.log('[order] 3. Generating QR code...');
    const QRCode   = (await import('qrcode')).default;
    const qrDataUrl = await QRCode.toDataURL('https://numeros.kz', {
      width: 110, margin: 1,
      color: { dark: '#C9A84C', light: '#0D0E14' },
    });

    const extras = { pinnacles, personalYears, karmicLessons, nameNumerology, famous, qrDataUrl };

    console.log('[order] 4. Loading book data');
    const bookPath = join(process.cwd(), 'src/data/numerology-book.json');
    const book = JSON.parse(readFileSync(bookPath, 'utf-8'));

    const foundCombinations = detectCombinations(matrix, book);
    console.log('[order] 4a. Detected combinations:', foundCombinations.map(c => c.label).join('; '));

    console.log('[order] 5. Calling GPT...');
    const analysis = await generateAnalysis(name, birthDate, matrix, book, nameNumerology, karmicLessons, foundCombinations);
    console.log('[order] 5. GPT done');

    console.log('[order] 6. Building PDF...');
    const pdfBuffer = await buildPDF(name, birthDate, matrix, analysis, extras);
    console.log('[order] 6. PDF built, size:', pdfBuffer?.length);

    console.log('[order] 7. Sending email to', email);
    await sendEmail(name, email, pdfBuffer, matrix, analysis);
    console.log('[order] 7. Done');

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[/api/order] ERROR:', err?.message ?? err);
    console.error('[/api/order] STACK:', err?.stack);
    return NextResponse.json(
      { error: err?.message || 'Произошла ошибка. Попробуйте позже.' },
      { status: 500 }
    );
  }
}
