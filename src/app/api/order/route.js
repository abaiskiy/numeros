import { NextResponse } from 'next/server';
import { calculateMatrix, buildBookContext } from '@/lib/matrixCalc';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function generateAnalysis(name, birthDate, matrix, book) {
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const bookContext = buildBookContext(matrix, book);
  const dateFormatted = new Date(birthDate + 'T00:00:00')
    .toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const prompt = `Ты — профессиональный нумеролог. Составь персональный нумерологический разбор для ${name} (дата рождения: ${dateFormatted}).

Матрица Пифагора:
- Характер (1): ${matrix.char.v} [${matrix.char.s}]
- Энергия (2): ${matrix.energy.v} [${matrix.energy.s}]
- Самооценка (3): ${matrix.interest.v} [${matrix.interest.s}]
- Здоровье (4): ${matrix.health.v} [${matrix.health.s}]
- Логика (5): ${matrix.logic.v} [${matrix.logic.s}]
- Труд (6): ${matrix.labor.v} [${matrix.labor.s}]
- Удача (7): ${matrix.luck.v} [${matrix.luck.s}]
- Чувство долга (8): ${matrix.duty.v} [${matrix.duty.s}]
- Память (9): ${matrix.memory.v} [${matrix.memory.s}]

Ключевые числа:
- Число судьбы: ${matrix.destiny}
- Число души: ${matrix.soul}
- Число кармы: ${matrix.karma}
- Скрытое число: ${matrix.hidden}

${bookContext}

Составь разбор в формате JSON:
{
  "sections": [
    {
      "title": "Характер и воля",
      "highlight": true,
      "content": "..."
    },
    {
      "title": "Энергия и жизненная сила",
      "highlight": false,
      "content": "..."
    },
    ... (по каждой ячейке и ключевым числам, 6-8 разделов)
  ],
  "conclusion": "Итоговый абзац с главными выводами и рекомендациями для ${name}"
}

Пиши на русском языке. Обращайся по имени (${name}). Каждый раздел 80-120 слов. Будь конкретным, содержательным и вдохновляющим. Не повторяй числа механически — интерпретируй их.`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
  });

  return JSON.parse(resp.choices[0].message.content);
}

async function buildPDF(name, birthDate, matrix, analysis) {
  const { renderToBuffer } = await import('@react-pdf/renderer');
  const { createElement } = await import('react');
  const { NumerologyPDF } = await import('@/lib/NumerologyPDF');

  const element = createElement(NumerologyPDF, { name, birthDate, matrix, analysis });
  const buffer = await renderToBuffer(element);
  return buffer;
}

async function sendEmail(name, email, pdfBuffer) {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const dateStr = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  await resend.emails.send({
    from: 'Numeros <razbor@numeros.kz>',
    to: email,
    subject: `Ваш нумерологический разбор, ${name}`,
    html: `
      <div style="background:#0D0E14;color:#fff;font-family:Inter,sans-serif;padding:40px;max-width:560px;margin:auto;border-radius:16px;">
        <h1 style="color:#C9A84C;font-size:24px;margin:0 0 8px;">NUMEROS</h1>
        <p style="color:#888;font-size:14px;margin:0 0 24px;">numeros.kz</p>

        <h2 style="font-size:20px;margin:0 0 8px;">Привет, ${name}!</h2>
        <p style="color:#aaa;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Ваш персональный нумерологический разбор готов. Он составлен на основе системы Александрова с применением психоматрицы Пифагора.
        </p>

        <div style="background:#14151C;border:1px solid #2A2B35;border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="color:#C9A84C;font-size:13px;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">
            📎 Разбор во вложении
          </p>
          <p style="color:#aaa;font-size:14px;margin:0;">
            В приложенном PDF-файле вы найдёте полный анализ вашей матрицы — каждая ячейка, ключевые числа и персональные рекомендации.
          </p>
        </div>

        <p style="color:#666;font-size:12px;margin:0;">
          Составлено ${dateStr} · Система нумерологии Александрова
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `numeros-razbor-${name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req) {
  try {
    const { name, email, birthDate } = await req.json();

    if (!name || !email || !birthDate) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }

    // 1. Calculate matrix
    const matrix = calculateMatrix(birthDate);

    // 2. Load book data
    const book = (await import('@/data/numerology-book.json')).default;

    // 3. Generate GPT analysis
    const analysis = await generateAnalysis(name, birthDate, matrix, book);

    // 4. Build PDF
    const pdfBuffer = await buildPDF(name, birthDate, matrix, analysis);

    // 5. Send email
    await sendEmail(name, email, pdfBuffer);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[/api/order]', err);
    return NextResponse.json({ error: 'Произошла ошибка. Попробуйте позже.' }, { status: 500 });
  }
}
