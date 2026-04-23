import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  calculateMatrix, buildBookContext, detectCombinations,
  calculatePinnacles, getPersonalYears, getKarmicLessons,
  calculateNameNumerology, getFamousByDestiny, getPersonalMonth,
} from '@/lib/matrixCalc';

// ─── GPT analysis ─────────────────────────────────────────────────────────────

async function generateAnalysis(name, birthDate, matrix, book, nameNumerology, karmicLessons, foundCombinations, gender = 'female') {
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const bookContext = buildBookContext(matrix, book);
  const dateFormatted = new Date(birthDate + 'T00:00:00')
    .toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const [y, m, d] = birthDate.split('-').map(Number);
  const currentYear = new Date().getFullYear();
  const personalYear = String(d + m + currentYear).split('').reduce((s, x) => s + +x, 0);
  const personalMonthData = getPersonalMonth(birthDate);
  const genderLabel = gender === 'male' ? 'мужчина' : 'женщина';
  const genderTone  = gender === 'male'
    ? 'Пиши в мужском роде. Акцент на действии, достижениях, карьере, статусе, логике.'
    : 'Пиши в женском роде. Акцент на интуиции, отношениях, самореализации, внутреннем мире, семье.';

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

  const prompt = `Ты — профессиональный нумеролог. Составь подробный персональный нумерологический разбор для ${name} (дата рождения: ${dateFormatted}, ${genderLabel}).
${genderTone}

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
- Личный месяц (${personalMonthData.currentMonth}/${currentYear}): ${personalMonthData.number} — «${personalMonthData.label}». ${personalMonthData.theme}

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
  "intro": "3-4 предложения — что такое психоматрица Пифагора и чему посвящён этот разбор для ${name}. Упомяни конкретные числа судьбы и души.",
  "keyNumbers": {
    "destiny": "150-180 слов: глубокий разбор числа судьбы ${matrix.destiny} для ${name} — жизненный путь, главное предназначение, какие задачи судьба ставит, как это число проявляется в характере и выборах. Конкретные жизненные ситуации и паттерны. Обращение на Вы.",
    "soul": "120-150 слов: число души ${matrix.soul} — глубинные желания, истинные ценности, что питает энергию ${name} изнутри, чего Вы ищете в жизни и отношениях. Что происходит когда эти потребности не удовлетворены. Обращение на Вы.",
    "karma": "100-130 слов: число кармы ${matrix.karma} — уроки и задачи этого воплощения, какие ситуации будут повторяться пока урок не усвоен, как это влияет на жизнь ${name}. Обращение на Вы.",
    "potential": "100-120 слов: число потенциала ${matrix.hidden} — скрытые таланты и возможности, которые раскрываются со временем и опытом, как ${name} может их развить. Обращение на Вы."
  },
  "cells": [
    {
      "digit": 1,
      "title": "Характер и воля",
      "value": "${matrix.char.v}",
      "status": "${matrix.char.s}",
      "content": "130-160 слов: детальный анализ характера и волевых качеств ${name} на основе значения ${matrix.char.v} — как это проявляется в поведении, решениях, отношениях с людьми. Сильные стороны и слабые места. Конкретные жизненные ситуации. Обращение на Вы."
    },
    { "digit": 2, "title": "Энергия и биополе", "value": "${matrix.energy.v}", "status": "${matrix.energy.s}", "content": "100-130 слов: энергетический потенциал ${name}, как восполняется и расходуется энергия, влияние на здоровье и взаимодействие с людьми. Обращение на Вы." },
    { "digit": 3, "title": "Интерес к жизни", "value": "${matrix.interest.v}", "status": "${matrix.interest.s}", "content": "90-110 слов: любопытство, увлечения, как ${name} находит смысл и радость в жизни. Обращение на Вы." },
    { "digit": 4, "title": "Здоровье и тело", "value": "${matrix.health.v}", "status": "${matrix.health.s}", "content": "90-110 слов: отношение к телу и здоровью, уязвимые места, на что обратить внимание. Обращение на Вы." },
    { "digit": 5, "title": "Логика и интуиция", "value": "${matrix.logic.v}", "status": "${matrix.logic.s}", "content": "90-110 слов: как работает мышление ${name} — аналитика vs интуиция, принятие решений. Обращение на Вы." },
    { "digit": 6, "title": "Труд и материальный мир", "value": "${matrix.labor.v}", "status": "${matrix.labor.s}", "content": "100-130 слов: отношение к труду, деньгам, материальным благам — что помогает и что мешает в создании достатка. Обращение на Вы." },
    { "digit": 7, "title": "Удача и везение", "value": "${matrix.luck.v}", "status": "${matrix.luck.s}", "content": "100-120 слов: как проявляется удача в жизни ${name}, в каких сферах везёт чаще, как активировать этот ресурс. Обращение на Вы." },
    { "digit": 8, "title": "Чувство долга и ответственность", "value": "${matrix.duty.v}", "status": "${matrix.duty.s}", "content": "90-110 слов: отношение к обязательствам, ответственности, как это влияет на отношения и карьеру. Обращение на Вы." },
    { "digit": 9, "title": "Память и интеллект", "value": "${matrix.memory.v}", "status": "${matrix.memory.s}", "content": "90-110 слов: интеллектуальный потенциал, память, способность к обучению и накоплению опыта. Обращение на Вы." }
  ],
  "combinations": [
    ВНИМАНИЕ: оставь поля title и digits точно как указано ниже. Напиши только поле content.
    ${foundCombinations.length === 0 ? '' : foundCombinations.map(c => `{
      "title": "${c.label}",
      "digits": "${c.digits}",
      "content": "130-160 слов: персональный разбор этой комбинации для ${name} — как она проявляется в реальной жизни, какие ситуации создаёт, в чём сила и в чём ловушка этого сочетания, конкретные практические советы как использовать или проработать. ${c.bookDesc ? 'Книжный контекст: ' + c.bookDesc.replace(/"/g, "'") : 'Опирайся на нумерологические знания по данной комбинации.'}. Обращение на Вы."
    }`).join(',\n    ')}
  ],
  "money": {
    "score": <число от 1 до 10>,
    "title": "Денежный потенциал",
    "content": "160-200 слов: подробный анализ финансового потенциала ${name} — природные таланты в зарабатывании, в каких сферах деньги приходят легче всего, какой стиль работы наиболее прибылен для этого числа, конкретные примеры как реализуется денежный код. Обращение на Вы.",
    "blocks": "80-100 слов: глубокий разбор денежных блоков ${name} — конкретные убеждения, страхи и паттерны которые мешают зарабатывать больше, откуда они берутся, как проявляются в поведении. Честно и без прикрас. Обращение на Вы.",
    "strategy": "80-100 слов: конкретная персональная стратегия роста дохода под число судьбы ${matrix.destiny} — 3-4 практических шага которые подходят именно этому типу личности. Обращение на Вы."
  },
  "relationships": {
    "title": "Код отношений",
    "content": "160-200 слов: подробный анализ ${name} в отношениях — как Вы любите, чего ждёте от партнёра, какие паттерны повторяются в отношениях, идеальный партнёр по числам, типичные ошибки в любви и как их избежать. Обращение на Вы."
  },
  "forecast": {
    "year": ${currentYear},
    "personalYear": ${personalYear},
    "title": "Прогноз на ${currentYear} год",
    "content": "150-180 слов: подробный прогноз — что несёт личный год ${personalYear} для ${name}, какие темы будут главными, что открывается, что закрывается, на что сделать акцент в карьере, отношениях и личном развитии. Конкретные рекомендации по кварталам. Обращение на Вы."
  },
  "personalMonth": {
    "number": ${personalMonthData.number},
    "label": "${personalMonthData.label}",
    "content": "100-130 слов: что означает личный месяц ${personalMonthData.number} («${personalMonthData.label}») для ${name} прямо сейчас — конкретные темы и события этого периода, что использовать как возможность, чего избегать, на чём сосредоточить энергию. Обращение на Вы."
  },
  "career": {
    "title": "Карьера и предназначение",
    "professions": ["профессия/сфера 1", "профессия/сфера 2", "профессия/сфера 3", "профессия/сфера 4", "профессия/сфера 5"],
    "content": "160-200 слов: детальный разбор карьерного пути ${name} — в каких сферах реализуется максимально, что даётся природно, идеальный формат работы (своё дело / найм / творчество), стиль управления, отношения с коллегами, как проявляется лидерство. Конкретные рекомендации. Обращение на Вы.",
    "anticareer": "60-80 слов: в каких сферах, ролях или форматах работы ${name} будет чувствовать себя не на месте — и почему это происходит с точки зрения чисел. Обращение на Вы."
  },
  "shadow": {
    "title": "Теневая сторона",
    "content": "130-160 слов: честный и глубокий разбор теневой стороны ${name} — деструктивные паттерны, внутренние страхи, слабости и самосаботаж. Откуда это берётся, как проявляется в жизни, в каких ситуациях тень выходит наружу. Без осуждения — это обратная сторона сильных качеств. Обращение на Вы.",
    "fears": ["конкретный страх или паттерн 1 (6-10 слов)", "страх/паттерн 2", "страх/паттерн 3", "страх/паттерн 4"],
    "growth": "60-80 слов: как работать с тенью — конкретные практические инструменты именно для этого типа личности. Обращение на Вы."
  },
  "strengths": [
    "конкретная сильная сторона 1 с пояснением как она проявляется (20-25 слов)",
    "сильная сторона 2 (20-25 слов)",
    "сильная сторона 3 (20-25 слов)",
    "сильная сторона 4 (20-25 слов)",
    "сильная сторона 5 (20-25 слов)"
  ],
  "weaknesses": [
    "зона роста 1 — что конкретно развивать и как (20-25 слов)",
    "зона роста 2 (20-25 слов)",
    "зона роста 3 (20-25 слов)"
  ],
  "lines": {
    "selfEsteem":   "70-90 слов: линия Самооценки (1-2-3) со значением ${matrix.selfEsteem} — как ${name} воспринимает себя, самооценка, самовыражение, отношение к критике. Обращение на Вы.",
    "household":    "70-90 слов: линия Быта (4-5-6) со значением ${matrix.household} — как справляется с бытом, отношение к дому, комфорту, рутинным задачам. Обращение на Вы.",
    "talent":       "70-90 слов: линия Таланта (7-8-9) со значением ${matrix.talent} — природные дарования, творческий потенциал, как реализует себя. Обращение на Вы.",
    "goal":         "70-90 слов: линия Целеустремлённости (1-4-7) со значением ${matrix.goal} — воля к цели, напористость, как достигает результатов. Обращение на Вы.",
    "family":       "70-90 слов: линия Семьи (2-5-8) со значением ${matrix.family} — роль в семье, отношение к близким, семейные ценности. Обращение на Вы.",
    "stability":    "70-90 слов: линия Стабильности (3-6-9) со значением ${matrix.stability} — умение создавать устойчивость, постоянство, отношение к переменам. Обращение на Вы.",
    "spirituality": "70-90 слов: линия Духовности (1-5-9) со значением ${matrix.spirituality} — связь с высшим, интуиция, поиск смысла. Обращение на Вы.",
    "temperament":  "70-90 слов: линия Темперамента (3-5-7) со значением ${matrix.temperament} — тип темперамента, эмоциональность, жизненная скорость. Обращение на Вы."
  },
  "karmicSummary": "70-90 слов: что означают кармические уроки для ${name}, как с ними работать. Обращение на Вы.",
  "nameAnalysis": "${nameNumerology ? `70-90 слов о том, что число выражения ${nameNumerology.expression} и число души имени ${nameNumerology.soulUrge} говорят об имени «${name}» и его влиянии на жизнь` : 'пустая строка'}",
  "archetype": {
    "name": "Одно слово — архетип личности (Творец / Лидер / Целитель / Мудрец / Искатель / Хранитель / Вдохновитель / Строитель / Мистик)",
    "tagline": "Одна сильная фраза-девиз этого архетипа (до 10 слов)",
    "description": "100-130 слов: суть архетипа применительно к ${name} — как он проявляется в жизни, решениях, отношениях, чём миссия этого архетипа. Обращение на Вы.",
    "traits": ["качество 1 (2-3 слова)", "качество 2", "качество 3", "качество 4", "качество 5"]
  },
  "affirmations": [
    "Аффирмация 1 — личная, конкретная, мощная, в настоящем времени, на Я (до 15 слов)",
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
    "note": "45-60 слов: объясни почему эти цвета (${fixedTalismans ? fixedTalismans.colors.join(', ') : ''}), камни (${fixedTalismans ? fixedTalismans.stones.join(', ') : ''}) и день (${fixedTalismans ? fixedTalismans.day : ''}) связаны с планетой ${fixedTalismans ? fixedTalismans.planet : ''} — покровителем числа судьбы ${destinyKey}. Обращение на Вы."
  },
  "tips": {
    "money": "3-4 конкретных практических совета по финансам (50-60 слов). Обращение на Вы.",
    "relationships": "3-4 конкретных совета по отношениям (50-60 слов). Обращение на Вы.",
    "health": "3-4 конкретных совета по здоровью и энергии (50-60 слов). Обращение на Вы.",
    "career": "3-4 конкретных совета по карьере (50-60 слов). Обращение на Вы."
  },
  "conclusion": "200-250 слов: глубокое заключение — главные инсайты разбора, уникальность ${name} как личности, ключевые рекомендации на ближайший год, вдохновляющее напутствие. Обращение на Вы."
}

ВАЖНО: Пиши на русском. Обращайся на Вы. ${genderTone} Будь честным и конкретным — используй имя ${name} и реальные числа из матрицы в тексте. Избегай шаблонных фраз, пиши как опытный нумеролог который лично знает человека. Разные поля должны дополнять друг друга, а не повторяться.`;

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
    `<td style="width:25%;padding:0 4px;">
      <div style="background:#14151C;border:1px solid #2A2B35;border-radius:10px;padding:12px 6px;text-align:center;">
        <div style="font-size:22px;font-weight:700;color:${color};margin-bottom:4px;font-family:Inter,sans-serif;">${val}</div>
        <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;font-family:Inter,sans-serif;">${label}</div>
      </div>
    </td>`;

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
            <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td style="vertical-align:middle;padding-right:12px;">
                  <table cellpadding="0" cellspacing="0" style="width:38px;height:38px;border-radius:50%;border:1px solid #C9A84C;background:#1C1A10;">
                    <tr><td style="text-align:center;vertical-align:middle;font-size:17px;font-weight:700;color:#C9A84C;font-family:Inter,sans-serif;">N</td></tr>
                  </table>
                </td>
                <td style="vertical-align:middle;font-size:18px;font-weight:700;color:#C9A84C;letter-spacing:3px;font-family:Inter,sans-serif;">NUMEROS</td>
              </tr>
            </table>
            <h1 style="margin:0 0 8px;font-size:22px;color:#fff;">${name}, ваш разбор готов!</h1>
            <p style="margin:0;font-size:14px;color:#888;">Персональный нумерологический разбор · ${dateStr}</p>
          </div>

          <!-- Key numbers -->
          <div style="padding:24px 32px;">
            <p style="margin:0 0 16px;font-size:13px;color:#C9A84C;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Ваши ключевые числа</p>
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
              <tr>
                ${numCell('Судьба',    matrix.destiny, '#C9A84C')}
                ${numCell('Душа',      matrix.soul,    '#C9A84C')}
                ${numCell('Карма',     matrix.karma,   '#9B7FCA')}
                ${numCell('Потенциал', matrix.hidden,  '#5B9BD5')}
              </tr>
            </table>

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
    const { name, email, birthDate, gender = 'female' } = await req.json();

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
    const personalMonth  = getPersonalMonth(birthDate);

    console.log('[order] 3. Generating QR code...');
    const QRCode   = (await import('qrcode')).default;
    const qrDataUrl = await QRCode.toDataURL('https://numeros.kz', {
      width: 110, margin: 1,
      color: { dark: '#C9A84C', light: '#0D0E14' },
    });

    const extras = { pinnacles, personalYears, karmicLessons, nameNumerology, famous, qrDataUrl, personalMonth, gender };

    console.log('[order] 4. Loading book data');
    const bookPath = join(process.cwd(), 'src/data/numerology-book.json');
    const book = JSON.parse(readFileSync(bookPath, 'utf-8'));

    const foundCombinations = detectCombinations(matrix, book);
    console.log('[order] 4a. Detected combinations:', foundCombinations.map(c => c.label).join('; '));

    console.log('[order] 5. Calling GPT...');
    const analysis = await generateAnalysis(name, birthDate, matrix, book, nameNumerology, karmicLessons, foundCombinations, gender);
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
