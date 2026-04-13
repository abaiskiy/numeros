import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { calculateMatrix, getPersonalYears, getFavorableDates } from '@/lib/matrixCalc';

// ─── Compatibility score (same logic as frontend) ─────────────────────────────
function calculateCompatibility(m1, m2) {
  let sectorScore = 0;
  for (let d = 1; d <= 9; d++) {
    const diff = Math.abs(m1.counts[d] - m2.counts[d]);
    sectorScore += diff === 0 ? 10 : diff === 1 ? 7 : diff === 2 ? 4 : 1;
  }
  const sectorPct = Math.round((sectorScore / 90) * 100);
  const energyScore = Math.max(0, 100 - Math.abs(m1.soul - m2.soul) * 12 - Math.abs((m1.counts[2] || 0) - (m2.counts[2] || 0)) * 8);
  const total = Math.round(
    sectorPct * 0.4 + energyScore * 0.3 +
    (m1.destiny === m2.destiny ? 100 : 60) * 0.15 +
    (m1.soul === m2.soul ? 100 : 55) * 0.15
  );
  return Math.min(99, Math.max(40, total));
}

// Sphere configs — fixed icons (safe ASCII/Cyrillic abbreviations) so PDF renders correctly
const SPHERE_CONFIGS = [
  { title: 'Романтика и страсть',    icon: 'Ро', color: 'rose'   },
  { title: 'Семья и быт',            icon: 'Сб', color: 'amber'  },
  { title: 'Интеллект и общение',    icon: 'Ин', color: 'blue'   },
  { title: 'Финансы и цели',         icon: 'Фн', color: 'green'  },
  { title: 'Доверие и поддержка',    icon: 'Дв', color: 'purple' },
  { title: 'Духовный рост',          icon: 'Дх', color: 'teal'   },
];

// ─── GPT analysis ─────────────────────────────────────────────────────────────
async function generateCompatibilityAnalysis(name1, date1, m1, name2, date2, m2, score, book, py1, py2) {
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const curYear = new Date().getFullYear();

  const py1Ctx = py1.map(p => `${p.year}: ЛГ-${p.personalYear}`).join(', ');
  const py2Ctx = py2.map(p => `${p.year}: ЛГ-${p.personalYear}`).join(', ');

  // Build context from book for each person's digit strengths/weaknesses
  const digitCtx = (m, name) => {
    const q = book.quantitative ?? {};
    return [1,2,3,4,5,6,7,8,9].map(d => {
      const c = m.counts[d] || 0;
      const cellData = q[String(d)];
      if (!cellData) return null;
      const { countKey } = { countKey: (n) => n >= 5 ? '5+' : String(n) };
      return `${cellData.cellName}(${d}): ${c} шт. [${m[Object.keys(m).find(k => m[k]?.digit === d)]?.s ?? '—'}]`;
    }).filter(Boolean).join(', ');
  };

  const destinyMatch = m1.destiny === m2.destiny;
  const soulMatch    = m1.soul    === m2.soul;
  const karmaMatch   = m1.karma   === m2.karma;

  // Common digits (both have > 0)
  const commonDigits = [1,2,3,4,5,6,7,8,9].filter(d => (m1.counts[d]||0) > 0 && (m2.counts[d]||0) > 0);
  // Digits one has and other lacks
  const only1 = [1,2,3,4,5,6,7,8,9].filter(d => (m1.counts[d]||0) > 0 && (m2.counts[d]||0) === 0);
  const only2 = [1,2,3,4,5,6,7,8,9].filter(d => (m1.counts[d]||0) === 0 && (m2.counts[d]||0) > 0);

  const prompt = `Ты — профессиональный нумеролог. Составь глубокий персонализированный разбор совместимости двух людей на основе их психоматриц Пифагора.

ЧЕЛОВЕК 1: ${name1 || 'Первый'} (${fmt(date1)})
- Число судьбы: ${m1.destiny}, Число души: ${m1.soul}, Карма: ${m1.karma}, Потенциал: ${m1.hidden}
- Матрица: Характер(1)=${m1.char.v}[${m1.char.s}], Энергия(2)=${m1.energy.v}[${m1.energy.s}], Интерес(3)=${m1.interest.v}[${m1.interest.s}], Здоровье(4)=${m1.health.v}[${m1.health.s}], Логика(5)=${m1.logic.v}[${m1.logic.s}], Труд(6)=${m1.labor.v}[${m1.labor.s}], Удача(7)=${m1.luck.v}[${m1.luck.s}], Долг(8)=${m1.duty.v}[${m1.duty.s}], Память(9)=${m1.memory.v}[${m1.memory.s}]
- Линии: Самооценка=${m1.selfEsteem}, Быт=${m1.household}, Талант=${m1.talent}, Цель=${m1.goal}, Семья=${m1.family}, Стабильность=${m1.stability}, Духовность=${m1.spirituality}, Темперамент=${m1.temperament}
- Личные годы: ${py1Ctx}

ЧЕЛОВЕК 2: ${name2 || 'Второй'} (${fmt(date2)})
- Число судьбы: ${m2.destiny}, Число души: ${m2.soul}, Карма: ${m2.karma}, Потенциал: ${m2.hidden}
- Матрица: Характер(1)=${m2.char.v}[${m2.char.s}], Энергия(2)=${m2.energy.v}[${m2.energy.s}], Интерес(3)=${m2.interest.v}[${m2.interest.s}], Здоровье(4)=${m2.health.v}[${m2.health.s}], Логика(5)=${m2.logic.v}[${m2.logic.s}], Труд(6)=${m2.labor.v}[${m2.labor.s}], Удача(7)=${m2.luck.v}[${m2.luck.s}], Долг(8)=${m2.duty.v}[${m2.duty.s}], Память(9)=${m2.memory.v}[${m2.memory.s}]
- Линии: Самооценка=${m2.selfEsteem}, Быт=${m2.household}, Талант=${m2.talent}, Цель=${m2.goal}, Семья=${m2.family}, Стабильность=${m2.stability}, Духовность=${m2.spirituality}, Темперамент=${m2.temperament}
- Личные годы: ${py2Ctx}

СРАВНЕНИЕ МАТРИЦ:
- Общий балл совместимости: ${score}/99
- Совпадение числа судьбы: ${destinyMatch ? 'ДА' : 'НЕТ'} (${m1.destiny} и ${m2.destiny})
- Совпадение числа души: ${soulMatch ? 'ДА' : 'НЕТ'} (${m1.soul} и ${m2.soul})
- Совпадение кармы: ${karmaMatch ? 'ДА' : 'НЕТ'} (${m1.karma} и ${m2.karma})
- Цифры у обоих: ${commonDigits.length > 0 ? commonDigits.join(', ') : 'нет общих'}
- Только у ${name1 || 'первого'}: ${only1.length > 0 ? only1.join(', ') : 'нет уникальных'}
- Только у ${name2 || 'второго'}: ${only2.length > 0 ? only2.join(', ') : 'нет уникальных'}
- Текущий ${curYear}: ${name1} ЛГ-${py1[0]?.personalYear ?? '?'}, ${name2} ЛГ-${py2[0]?.personalYear ?? '?'}

Составь разбор строго в формате JSON. Поля title, icon, color в spheres — оставь точно как указано, заполни только score и content.
{
  "intro": "2-3 предложения — общее впечатление о союзе, упомяни конкретные числа. Обращение к обоим на Вы.",
  "overallLevel": "${score >= 85 ? 'Исключительная' : score >= 70 ? 'Высокая' : score >= 55 ? 'Хорошая' : 'Требует работы'}",
  "overallDesc": "2-3 предложения — что означает балл ${score} именно для ${name1 || 'первого'} и ${name2 || 'второго'}, конкретно. Обращение на Вы.",
  "spheres": [
    { "title": "Романтика и страсть",  "icon": "Ро", "color": "rose",   "score": <0-100>, "content": "70-90 слов — опирайся на числа энергии(2) и темперамента. Конкретно об этой паре." },
    { "title": "Семья и быт",          "icon": "Сб", "color": "amber",  "score": <0-100>, "content": "70-90 слов — опирайся на линию Быта и поле Долга(8). Конкретно." },
    { "title": "Интеллект и общение",  "icon": "Ин", "color": "blue",   "score": <0-100>, "content": "70-90 слов — опирайся на Логику(5) и Память(9). Конкретно." },
    { "title": "Финансы и цели",       "icon": "Фн", "color": "green",  "score": <0-100>, "content": "70-90 слов — опирайся на Труд(6) и Целеустремлённость. Конкретно." },
    { "title": "Доверие и поддержка",  "icon": "Дв", "color": "purple", "score": <0-100>, "content": "70-90 слов — опирайся на Долг(8) и Духовность. Конкретно." },
    { "title": "Духовный рост",        "icon": "Дх", "color": "teal",   "score": <0-100>, "content": "70-90 слов — опирайся на Духовность и линию Таланта. Конкретно." }
  ],
  "keyNumbers": {
    "destiny": { "v1": ${m1.destiny}, "v2": ${m2.destiny}, "match": ${destinyMatch}, "content": "50-65 слов — как взаимодействуют именно эти числа судьбы, какая динамика в паре" },
    "soul":    { "v1": ${m1.soul},    "v2": ${m2.soul},    "match": ${soulMatch},    "content": "50-65 слов — внутренняя эмоциональная гармония, совпадают ли глубинные ценности" },
    "karma":   { "v1": ${m1.karma},   "v2": ${m2.karma},   "match": ${karmaMatch},   "content": "50-65 слов — общие кармические уроки и задачи в этом союзе" }
  },
  "loveLanguages": {
    "person1": {
      "primary": "язык любви ${name1 || 'первого'} — одно из: Слова признания / Прикосновения / Время / Подарки / Помощь",
      "description": "55-65 слов — как ${name1 || 'первый'} выражает любовь, что для него важно, опирайся на число души ${m1.soul} и энергию(2)"
    },
    "person2": {
      "primary": "язык любви ${name2 || 'второго'} — одно из: Слова признания / Прикосновения / Время / Подарки / Помощь",
      "description": "55-65 слов — как ${name2 || 'второй'} выражает любовь, опирайся на число души ${m2.soul} и энергию(2)"
    },
    "compatibility": "45-55 слов — совместимость их языков любви, практический совет как создать гармонию"
  },
  "strengths": [
    "Сила 1: что конкретно усиливают друг в друге, ссылаясь на числа (20-30 слов)",
    "Сила 2 (20-30 слов)",
    "Сила 3 (20-30 слов)",
    "Сила 4 (20-30 слов)",
    "Сила 5 (20-30 слов)"
  ],
  "tensions": [
    "Напряжение 1 + конкретный совет как проработать (20-30 слов)",
    "Напряжение 2 + совет (20-30 слов)",
    "Напряжение 3 + совет (20-30 слов)"
  ],
  "greenFlags": [
    "Зелёный флаг 1 — конкретное преимущество союза (12-18 слов)",
    "Зелёный флаг 2 (12-18 слов)",
    "Зелёный флаг 3 (12-18 слов)",
    "Зелёный флаг 4 (12-18 слов)"
  ],
  "dangerSignals": [
    "Сигнал 1 — что может разрушить, как предотвратить (12-18 слов)",
    "Сигнал 2 (12-18 слов)",
    "Сигнал 3 (12-18 слов)"
  ],
  "bestYears": {
    "content": "70-90 слов — когда пике совместных возможностей с учётом личных лет ${py1[0]?.year ?? curYear}–${(py1[py1.length-1]?.year) ?? curYear+2}. Конкретные годы и что делать в эти периоды."
  },
  "personalYearNote": "65-80 слов: ${name1} в ЛГ-${py1[0]?.personalYear ?? '?'}, ${name2} в ЛГ-${py2[0]?.personalYear ?? '?'} — что это значит для пары в ${curYear} году, конкретные рекомендации",
  "recommendations": [
    "Рекомендация 1 — конкретный практический совет (25-35 слов)",
    "Рекомендация 2 (25-35 слов)",
    "Рекомендация 3 (25-35 слов)",
    "Рекомендация 4 (25-35 слов)",
    "Рекомендация 5 (25-35 слов)"
  ],
  "conclusion": "160-200 слов — итоговый вывод о союзе ${name1 || 'первого'} и ${name2 || 'второго'}. Честный, вдохновляющий, конкретный. Упомяни числа. Обращение на Вы."
}

ВАЖНО: Пиши ТОЛЬКО на русском. Обращайся к паре на Вы. Упоминай имена и конкретные числа из матриц. Никаких placeholder-ов — только реальный анализ.`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.75,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
  });

  const analysis = JSON.parse(resp.choices[0].message.content);

  // Always override sphere icons & colors with fixed configs — GPT must not generate unicode
  if (Array.isArray(analysis.spheres)) {
    analysis.spheres = analysis.spheres.map((sphere, i) => ({
      ...sphere,
      title: SPHERE_CONFIGS[i]?.title ?? sphere.title,
      icon:  SPHERE_CONFIGS[i]?.icon  ?? sphere.icon,
      color: SPHERE_CONFIGS[i]?.color ?? sphere.color,
    }));
  }

  return analysis;
}

// ─── Build PDF ────────────────────────────────────────────────────────────────
async function buildPDF(name1, date1, m1, name2, date2, m2, score, analysis, extras) {
  const { createElement } = await import('react');
  const { renderToBuffer } = await import('@react-pdf/renderer');
  const { CompatibilityPDF } = await import('@/lib/CompatibilityPDF');

  const doc = createElement(CompatibilityPDF, { name1, date1, m1, name2, date2, m2, score, analysis, extras });
  return await renderToBuffer(doc);
}

// ─── Send email ───────────────────────────────────────────────────────────────
async function sendEmail(name1, name2, email, pdfBuffer, score, analysis, coupleNum, nextDate) {
  const { Resend } = await import('resend');
  const apiKey = process.env.RESEND_API_KEY;
  console.log('[sendEmail-compat] RESEND_API_KEY present:', !!apiKey, '| first 8 chars:', apiKey?.slice(0, 8));

  const resend = new Resend(apiKey);
  const dateStr = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const n1 = name1 || 'Первый';
  const n2 = name2 || 'Второй';

  const levelLabel = score >= 85 ? 'Исключительная' : score >= 70 ? 'Высокая' : score >= 55 ? 'Хорошая' : 'Требует работы';
  const levelColor = score >= 85 ? '#C9A84C' : score >= 70 ? '#86efac' : score >= 55 ? '#5B9BD5' : '#fca5a5';

  const topStrength = analysis?.strengths?.[0] ?? '';
  const topGreenFlag = analysis?.greenFlags?.[0] ?? '';

  for (let attempt = 1; attempt <= 3; attempt++) {
    const { data, error } = await resend.emails.send({
      from: 'Numeros <razbor@numeros.kz>',
      to: email,
      subject: `Разбор совместимости ${n1} & ${n2} готов`,
      html: `
        <div style="background:#0D0E14;color:#fff;font-family:Inter,sans-serif;padding:0;max-width:560px;margin:auto;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <div style="background:linear-gradient(135deg,#12080F,#0D0E14);padding:32px 32px 24px;border-bottom:1px solid #2A1025;">
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
            <h1 style="margin:0 0 6px;font-size:20px;color:#fff;">${n1} & ${n2}</h1>
            <p style="margin:0;font-size:14px;color:#888;">Нумерологический разбор совместимости · ${dateStr}</p>
          </div>

          <!-- Score block -->
          <div style="padding:24px 32px;">
            <div style="background:#100A10;border:1px solid #2A1028;border-radius:14px;padding:20px;margin-bottom:20px;">
              <table cellpadding="0" cellspacing="0" style="width:100%;">
                <tr>
                  <td style="width:80px;vertical-align:middle;">
                    <table cellpadding="0" cellspacing="0" style="width:72px;height:72px;border-radius:50%;border:3px solid ${levelColor};background:#08090D;">
                      <tr><td style="text-align:center;vertical-align:middle;font-size:26px;font-weight:700;color:#fff;font-family:Inter,sans-serif;">${score}</td></tr>
                    </table>
                  </td>
                  <td style="vertical-align:middle;padding-left:16px;">
                    <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:${levelColor};font-family:Inter,sans-serif;">${levelLabel} совместимость</p>
                    <p style="margin:0;font-size:12px;color:#aaa;font-family:Inter,sans-serif;">Число пары: ${coupleNum ?? '—'}</p>
                  </td>
                </tr>
              </table>
            </div>

            ${topGreenFlag ? `
            <div style="background:#0A100A;border:1px solid #1E2A12;border-left:3px solid #8ABF5A;border-radius:10px;padding:14px 16px;margin-bottom:14px;">
              <p style="margin:0 0 4px;font-size:11px;color:#8ABF5A;text-transform:uppercase;letter-spacing:1px;">Сила вашего союза</p>
              <p style="margin:0;font-size:13px;color:#B0D090;line-height:1.6;">${topGreenFlag}</p>
            </div>` : ''}

            ${nextDate ? `
            <div style="background:#1C1A10;border:1px solid #3A3218;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
              <p style="margin:0 0 4px;font-size:11px;color:#C9A84C;text-transform:uppercase;letter-spacing:1px;">Ближайшая благоприятная дата</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#fff;">${nextDate.date} <span style="font-size:12px;font-weight:400;color:#C9A84C;">— ${nextDate.label}</span></p>
              <p style="margin:4px 0 0;font-size:12px;color:#888;">${nextDate.tip}</p>
            </div>` : ''}

            <!-- PDF notice -->
            <div style="background:#14151C;border:1px solid #2A2B35;border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="color:#C9A84C;font-size:13px;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">📎 Полный разбор во вложении</p>
              <p style="color:#aaa;font-size:13px;margin:0;line-height:1.6;">6 сфер совместимости, языки любви, зелёные флаги и сигналы внимания, сравнение ключевых чисел, личные годы пары и все благоприятные даты на 90 дней.</p>
            </div>

            <p style="color:#555;font-size:11px;margin:0;text-align:center;">numeros.kz · Психоматрица Пифагора · ${dateStr}</p>
          </div>
        </div>
      `,
      attachments: [{ filename: `numeros-sovmestimost-${n1.toLowerCase()}-${n2.toLowerCase()}.pdf`, content: Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer) }],
    });

    if (error) {
      console.error(`[sendEmail-compat] Attempt ${attempt} failed:`, JSON.stringify(error, null, 2));
      if (attempt === 3) throw new Error(`Resend: ${error.message ?? JSON.stringify(error)}`);
      await new Promise(r => setTimeout(r, 2000 * attempt));
      continue;
    }

    console.log('[sendEmail-compat] Resend OK, id:', data?.id);
    return;
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { name1, date1, name2, date2, email } = await req.json();

    if (!date1 || !date2 || !email) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }

    console.log('[order-compatibility] 1. Calculating matrices');
    const m1 = calculateMatrix(date1);
    const m2 = calculateMatrix(date2);
    const score = calculateCompatibility(m1, m2);

    console.log('[order-compatibility] 2. Computing personal years');
    const py1 = getPersonalYears(date1, 3);
    const py2 = getPersonalYears(date2, 3);

    console.log('[order-compatibility] 3. Generating QR code');
    const QRCode = (await import('qrcode')).default;
    const qrDataUrl = await QRCode.toDataURL('https://numeros.kz', {
      width: 110, margin: 1,
      color: { dark: '#C9A84C', light: '#0D0E14' },
    });

    // Compute favorable dates and couple number
    const reduceSingle = (n) => { let x = Math.abs(n); while (x > 9) x = String(x).split('').reduce((s,d)=>s+ +d,0); return x; };
    const favorableDates = getFavorableDates(date1, date2, m1, m2, 90, 12);
    const coupleNum = reduceSingle(reduceSingle(m1.destiny) + reduceSingle(m2.destiny));

    const extras = { personalYears1: py1, personalYears2: py2, qrDataUrl, favorableDates, coupleNum };

    console.log('[order-compatibility] 4. Loading book');
    const book = JSON.parse(readFileSync(join(process.cwd(), 'src/data/numerology-book.json'), 'utf-8'));

    console.log('[order-compatibility] 5. GPT analysis...');
    const analysis = await generateCompatibilityAnalysis(name1, date1, m1, name2, date2, m2, score, book, py1, py2);
    console.log('[order-compatibility] 5. GPT done');

    console.log('[order-compatibility] 6. Building PDF...');
    const pdfBuffer = await buildPDF(name1, date1, m1, name2, date2, m2, score, analysis, extras);
    console.log('[order-compatibility] 6. PDF built:', pdfBuffer?.length);

    console.log('[order-compatibility] 7. Sending email to', email);
    const nextDate = favorableDates[0] ?? null;
    await sendEmail(name1, name2, email, pdfBuffer, score, analysis, coupleNum, nextDate);
    console.log('[order-compatibility] 7. Done');

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[order-compatibility] ERROR:', err?.message);
    console.error('[order-compatibility] STACK:', err?.stack);
    return NextResponse.json({ error: err?.message || 'Произошла ошибка. Попробуйте позже.' }, { status: 500 });
  }
}
