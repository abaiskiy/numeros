import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { calculateMatrix, getPersonalYears } from '@/lib/matrixCalc';

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

// ─── GPT analysis ─────────────────────────────────────────────────────────────
async function generateCompatibilityAnalysis(name1, date1, m1, name2, date2, m2, score, book, py1, py2) {
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const py1Ctx = py1.map(p => `${p.year}: ЛГ-${p.personalYear}`).join(', ');
  const py2Ctx = py2.map(p => `${p.year}: ЛГ-${p.personalYear}`).join(', ');

  const prompt = `Ты — профессиональный нумеролог. Составь детальный разбор совместимости двух людей.

ЧЕЛОВЕК 1: ${name1 || 'Первый'} (${fmt(date1)})
- Число судьбы: ${m1.destiny}, Число души: ${m1.soul}, Карма: ${m1.karma}, Потенциал: ${m1.hidden}
- Матрица: Характер(1)=${m1.char.v}[${m1.char.s}], Энергия(2)=${m1.energy.v}[${m1.energy.s}], Здоровье(4)=${m1.health.v}[${m1.health.s}], Логика(5)=${m1.logic.v}[${m1.logic.s}], Труд(6)=${m1.labor.v}[${m1.labor.s}], Удача(7)=${m1.luck.v}[${m1.luck.s}], Долг(8)=${m1.duty.v}[${m1.duty.s}], Память(9)=${m1.memory.v}[${m1.memory.s}]
- Личные годы: ${py1Ctx}

ЧЕЛОВЕК 2: ${name2 || 'Второй'} (${fmt(date2)})
- Число судьбы: ${m2.destiny}, Число души: ${m2.soul}, Карма: ${m2.karma}, Потенциал: ${m2.hidden}
- Матрица: Характер(1)=${m2.char.v}[${m2.char.s}], Энергия(2)=${m2.energy.v}[${m2.energy.s}], Здоровье(4)=${m2.health.v}[${m2.health.s}], Логика(5)=${m2.logic.v}[${m2.logic.s}], Труд(6)=${m2.labor.v}[${m2.labor.s}], Удача(7)=${m2.luck.v}[${m2.luck.s}], Долг(8)=${m2.duty.v}[${m2.duty.s}], Память(9)=${m2.memory.v}[${m2.memory.s}]
- Личные годы: ${py2Ctx}

ОБЩИЙ БАЛЛ СОВМЕСТИМОСТИ: ${score}/99

Составь разбор строго в формате JSON:
{
  "intro": "2-3 предложения — общее впечатление о союзе ${name1 || 'первого'} и ${name2 || 'второго'}",
  "overallLevel": "${score >= 85 ? 'Исключительная' : score >= 70 ? 'Высокая' : score >= 55 ? 'Хорошая' : 'Требует работы'}",
  "overallDesc": "2-3 предложения — что означает этот уровень именно для них. Обращение на Вы к обоим.",
  "spheres": [
    { "title": "Романтика и страсть", "icon": "♡", "score": <0-100>, "color": "rose", "content": "60-80 слов" },
    { "title": "Семья и быт", "icon": "⌂", "score": <0-100>, "color": "amber", "content": "60-80 слов" },
    { "title": "Интеллект и общение", "icon": "◇", "score": <0-100>, "color": "blue", "content": "60-80 слов" },
    { "title": "Финансы и цели", "icon": "◈", "score": <0-100>, "color": "green", "content": "60-80 слов" },
    { "title": "Доверие и поддержка", "icon": "◎", "score": <0-100>, "color": "purple", "content": "60-80 слов" },
    { "title": "Духовный рост", "icon": "★", "score": <0-100>, "color": "teal", "content": "60-80 слов" }
  ],
  "keyNumbers": {
    "destiny": { "v1": ${m1.destiny}, "v2": ${m2.destiny}, "match": ${m1.destiny === m2.destiny}, "content": "40-60 слов — как взаимодействуют числа судьбы" },
    "soul":    { "v1": ${m1.soul},    "v2": ${m2.soul},    "match": ${m1.soul === m2.soul},       "content": "40-60 слов — внутренняя гармония" },
    "karma":   { "v1": ${m1.karma},   "v2": ${m2.karma},   "match": ${m1.karma === m2.karma},     "content": "40-60 слов — общие кармические уроки" }
  },
  "loveLanguages": {
    "person1": {
      "primary": "язык любви ${name1 || 'первого'} (слова, прикосновения, время, подарки или помощь)",
      "description": "50 слов — как ${name1 || 'первый'} выражает и воспринимает любовь"
    },
    "person2": {
      "primary": "язык любви ${name2 || 'второго'}",
      "description": "50 слов — как ${name2 || 'второй'} выражает и воспринимает любовь"
    },
    "compatibility": "40-50 слов — насколько совместимы их языки любви и как выстраивать гармонию"
  },
  "strengths": ["что пара усиливает друг в друге (4-5 пунктов, 15-25 слов каждый)"],
  "tensions": ["точки напряжения (3-4 пункта, 15-25 слов) с советом как преодолеть"],
  "greenFlags": [
    "зелёный флаг союза 1 (10-15 слов)",
    "зелёный флаг 2",
    "зелёный флаг 3",
    "зелёный флаг 4"
  ],
  "dangerSignals": [
    "сигнал внимания 1 — что отслеживать (10-15 слов)",
    "сигнал 2",
    "сигнал 3"
  ],
  "bestYears": {
    "content": "60-80 слов — благоприятные периоды для совместных решений на основе чисел"
  },
  "personalYearNote": "60-70 слов: как совпадают или контрастируют их личные годы сейчас и что это значит для отношений",
  "recommendations": ["конкретный совет паре (4-5 пунктов, 20-30 слов)"],
  "conclusion": "150-200 слов — итоговый вывод о союзе. Вдохновляющий, честный. Обращение на Вы."
}

ВАЖНО: Пиши на русском. Обращайся на Вы. Упоминай имена. Будь конкретным.`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.75,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
  });

  return JSON.parse(resp.choices[0].message.content);
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
async function sendEmail(name1, name2, email, pdfBuffer) {
  const { Resend } = await import('resend');
  const apiKey = process.env.RESEND_API_KEY;
  console.log('[sendEmail-compat] RESEND_API_KEY present:', !!apiKey, '| first 8 chars:', apiKey?.slice(0, 8));

  const resend = new Resend(apiKey);
  const dateStr = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  for (let attempt = 1; attempt <= 3; attempt++) {
    const { data, error } = await resend.emails.send({
      from: 'Numeros <razbor@numeros.kz>',
      to: email,
      subject: `Разбор совместимости: ${name1 || 'Первый'} & ${name2 || 'Второй'}`,
      html: `
        <div style="background:#0D0E14;color:#fff;font-family:Inter,sans-serif;padding:40px;max-width:560px;margin:auto;border-radius:16px;">
          <h1 style="color:#C9A84C;font-size:24px;margin:0 0 8px;">NUMEROS</h1>
          <p style="color:#888;font-size:14px;margin:0 0 24px;">numeros.kz</p>
          <h2 style="font-size:20px;margin:0 0 8px;">Разбор готов!</h2>
          <p style="color:#aaa;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Нумерологический разбор совместимости <strong style="color:#fff;">${name1 || 'первого'}</strong> и <strong style="color:#fff;">${name2 || 'второго'}</strong> прикреплён к этому письму.
          </p>
          <div style="background:#14151C;border:1px solid #2A2B35;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="color:#C9A84C;font-size:13px;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">📎 PDF разбор во вложении</p>
            <p style="color:#aaa;font-size:14px;margin:0;">6 сфер совместимости, языки любви, зелёные флаги и сигналы, личные годы и итоговый прогноз.</p>
          </div>
          <p style="color:#666;font-size:12px;margin:0;">Составлено ${dateStr} · Система нумерологии Александрова</p>
        </div>
      `,
      attachments: [{ filename: `numeros-sovmestimost.pdf`, content: Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer) }],
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

    const extras = { personalYears1: py1, personalYears2: py2, qrDataUrl };

    console.log('[order-compatibility] 4. Loading book');
    const book = JSON.parse(readFileSync(join(process.cwd(), 'src/data/numerology-book.json'), 'utf-8'));

    console.log('[order-compatibility] 5. GPT analysis...');
    const analysis = await generateCompatibilityAnalysis(name1, date1, m1, name2, date2, m2, score, book, py1, py2);
    console.log('[order-compatibility] 5. GPT done');

    console.log('[order-compatibility] 6. Building PDF...');
    const pdfBuffer = await buildPDF(name1, date1, m1, name2, date2, m2, score, analysis, extras);
    console.log('[order-compatibility] 6. PDF built:', pdfBuffer?.length);

    console.log('[order-compatibility] 7. Sending email to', email);
    await sendEmail(name1, name2, email, pdfBuffer);
    console.log('[order-compatibility] 7. Done');

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[order-compatibility] ERROR:', err?.message);
    console.error('[order-compatibility] STACK:', err?.stack);
    return NextResponse.json({ error: err?.message || 'Произошла ошибка. Попробуйте позже.' }, { status: 500 });
  }
}
