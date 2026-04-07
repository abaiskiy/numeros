import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { calculateMatrix, buildBookContext } from '@/lib/matrixCalc';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function generateAnalysis(name, birthDate, matrix, book) {
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const bookContext = buildBookContext(matrix, book);
  const dateFormatted = new Date(birthDate + 'T00:00:00')
    .toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Compute current year personal year number for forecast
  const [y, m, d] = birthDate.split('-').map(Number);
  const currentYear = new Date().getFullYear();
  const personalYearSum = d + m + currentYear;
  const personalYear = String(personalYearSum).split('').reduce((s, x) => s + +x, 0);

  const prompt = `Ты — профессиональный нумеролог. Составь подробный персональный нумерологический разбор для ${name} (дата рождения: ${dateFormatted}).

МАТРИЦА ПИФАГОРА:
- Характер (1): ${matrix.char.v} [${matrix.char.s}]
- Энергия (2): ${matrix.energy.v} [${matrix.energy.s}]
- Самооценка (3): ${matrix.interest.v} [${matrix.interest.s}]
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
- Скрытое число: ${matrix.hidden}
- Личный год (${currentYear}): ${personalYear}

ЛИНИИ:
- Целеустремлённость (1-4-7): ${matrix.goal}
- Семья (2-5-8): ${matrix.family}
- Стабильность (3-6-9): ${matrix.stability}
- Самооценка (1-2-3): ${matrix.selfEsteem}
- Быт (4-5-6): ${matrix.household}
- Талант (7-8-9): ${matrix.talent}
- Духовность (1-5-9): ${matrix.spirituality}

${bookContext}

Составь разбор строго в формате JSON (только JSON, без markdown):
{
  "intro": "2-3 предложения — что такое психоматрица Пифагора и чему посвящён этот разбор для ${name}",
  "cells": [
    {
      "digit": 1,
      "title": "Характер и воля",
      "value": "${matrix.char.v}",
      "status": "${matrix.char.s}",
      "content": "80-120 слов, обращение на Вы, конкретный личный анализ"
    },
    { "digit": 2, "title": "Энергия и биополе", "value": "${matrix.energy.v}", "status": "${matrix.energy.s}", "content": "..." },
    { "digit": 3, "title": "Самооценка и интерес к жизни", "value": "${matrix.interest.v}", "status": "${matrix.interest.s}", "content": "..." },
    { "digit": 4, "title": "Здоровье и тело", "value": "${matrix.health.v}", "status": "${matrix.health.s}", "content": "..." },
    { "digit": 5, "title": "Логика и интуиция", "value": "${matrix.logic.v}", "status": "${matrix.logic.s}", "content": "..." },
    { "digit": 6, "title": "Труд и материальный мир", "value": "${matrix.labor.v}", "status": "${matrix.labor.s}", "content": "..." },
    { "digit": 7, "title": "Удача и везение", "value": "${matrix.luck.v}", "status": "${matrix.luck.s}", "content": "..." },
    { "digit": 8, "title": "Чувство долга и ответственность", "value": "${matrix.duty.v}", "status": "${matrix.duty.s}", "content": "..." },
    { "digit": 9, "title": "Память и интеллект", "value": "${matrix.memory.v}", "status": "${matrix.memory.s}", "content": "..." }
  ],
  "combinations": [
    {
      "title": "название значимой комбинации цифр",
      "digits": "например: 111 + 66",
      "content": "50-80 слов о том что означает эта комбинация конкретно для ${name}"
    }
  ],
  "money": {
    "score": <число от 1 до 10 — денежный потенциал>,
    "title": "Денежный потенциал",
    "content": "100-150 слов: финансовые таланты, путь к деньгам, предупреждения, советы. Обращение на Вы."
  },
  "relationships": {
    "title": "Код отношений",
    "content": "100-150 слов: характер в отношениях, идеальный партнёр, сильные и слабые стороны в любви. Обращение на Вы."
  },
  "forecast": {
    "year": ${currentYear},
    "personalYear": ${personalYear},
    "title": "Прогноз на ${currentYear} год",
    "content": "100-150 слов: что несёт личный год ${personalYear} для ${name}, на что обратить внимание, благоприятные периоды. Обращение на Вы."
  },
  "conclusion": "150-200 слов: главные выводы, сильные стороны, рекомендации и вдохновляющее напутствие для ${name}. Обращение на Вы."
}

ВАЖНО: Пиши на русском. Обращайся на Вы. Будь конкретным и вдохновляющим. Избегай шаблонных фраз.`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.75,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
  });

  return JSON.parse(resp.choices[0].message.content);
}

async function buildPDF(name, birthDate, matrix, analysis) {
  const { createElement } = await import('react');
  const { renderToBuffer } = await import('@react-pdf/renderer');
  const { NumerologyPDF } = await import('@/lib/NumerologyPDF');

  const doc = createElement(NumerologyPDF, { name, birthDate, matrix, analysis });
  const buffer = await renderToBuffer(doc);
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
    console.log('[order] 1. Calculating matrix for', birthDate);
    const matrix = calculateMatrix(birthDate);

    // 2. Load book data
    console.log('[order] 2. Loading book data');
    const bookPath = join(process.cwd(), 'src/data/numerology-book.json');
    const book = JSON.parse(readFileSync(bookPath, 'utf-8'));

    // 3. Generate GPT analysis
    console.log('[order] 3. Calling GPT...');
    const analysis = await generateAnalysis(name, birthDate, matrix, book);
    console.log('[order] 3. GPT done, sections:', analysis?.sections?.length);

    // 4. Build PDF
    console.log('[order] 4. Building PDF...');
    const pdfBuffer = await buildPDF(name, birthDate, matrix, analysis);
    console.log('[order] 4. PDF built, size:', pdfBuffer?.length);

    // 5. Send email
    console.log('[order] 5. Sending email to', email);
    await sendEmail(name, email, pdfBuffer);
    console.log('[order] 5. Email sent');

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
