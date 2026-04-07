import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  calculateMatrix, buildBookContext,
  calculatePinnacles, getPersonalYears, getKarmicLessons,
  calculateNameNumerology, getFamousByDestiny,
} from '@/lib/matrixCalc';

// ─── GPT analysis ─────────────────────────────────────────────────────────────

async function generateAnalysis(name, birthDate, matrix, book, nameNumerology, karmicLessons) {
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const bookContext = buildBookContext(matrix, book);
  const dateFormatted = new Date(birthDate + 'T00:00:00')
    .toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const [y, m, d] = birthDate.split('-').map(Number);
  const currentYear = new Date().getFullYear();
  const personalYear = String(d + m + currentYear).split('').reduce((s, x) => s + +x, 0);

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
- Потенциал: ${matrix.hidden}
- Личный год (${currentYear}): ${personalYear}

ЛИНИИ:
- Целеустремлённость (1-4-7): ${matrix.goal}
- Семья (2-5-8): ${matrix.family}
- Стабильность (3-6-9): ${matrix.stability}
- Самооценка (1-2-3): ${matrix.selfEsteem}
- Быт (4-5-6): ${matrix.household}
- Талант (7-8-9): ${matrix.talent}
- Духовность (1-5-9): ${matrix.spirituality}
${nameCtx}
${karmicCtx}

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
    { "digit": 2, "title": "Энергия и биополе", "value": "${matrix.energy.v}", "status": "${matrix.energy.s}", "content": "80-120 слов" },
    { "digit": 3, "title": "Самооценка и интерес к жизни", "value": "${matrix.interest.v}", "status": "${matrix.interest.s}", "content": "80-120 слов" },
    { "digit": 4, "title": "Здоровье и тело", "value": "${matrix.health.v}", "status": "${matrix.health.s}", "content": "80-120 слов" },
    { "digit": 5, "title": "Логика и интуиция", "value": "${matrix.logic.v}", "status": "${matrix.logic.s}", "content": "80-120 слов" },
    { "digit": 6, "title": "Труд и материальный мир", "value": "${matrix.labor.v}", "status": "${matrix.labor.s}", "content": "80-120 слов" },
    { "digit": 7, "title": "Удача и везение", "value": "${matrix.luck.v}", "status": "${matrix.luck.s}", "content": "80-120 слов" },
    { "digit": 8, "title": "Чувство долга и ответственность", "value": "${matrix.duty.v}", "status": "${matrix.duty.s}", "content": "80-120 слов" },
    { "digit": 9, "title": "Память и интеллект", "value": "${matrix.memory.v}", "status": "${matrix.memory.s}", "content": "80-120 слов" }
  ],
  "combinations": [
    {
      "title": "название значимой комбинации",
      "digits": "например: 111 + 66",
      "content": "50-80 слов о том что означает эта комбинация для ${name}"
    }
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
  "karmicSummary": "60-80 слов: что означают кармические уроки для ${name}, как работать с ними. Обращение на Вы.",
  "nameAnalysis": "${nameNumerology ? `60-80 слов о том, что число выражения ${nameNumerology.expression} и число души имени ${nameNumerology.soulUrge} говорят об имени «${name}»` : 'пустая строка'}",
  "conclusion": "150-200 слов: главные выводы, сильные стороны, рекомендации, вдохновляющее напутствие. Обращение на Вы."
}

ВАЖНО: Пиши на русском. Обращайся на Вы. Будь конкретным и вдохновляющим.`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.75,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
  });

  return JSON.parse(resp.choices[0].message.content);
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

async function sendEmail(name, email, pdfBuffer) {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const dateStr = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const { data, error } = await resend.emails.send({
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
          <p style="color:#C9A84C;font-size:13px;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">📎 Разбор во вложении</p>
          <p style="color:#aaa;font-size:14px;margin:0;">В PDF вы найдёте: матрицу, разбор секторов, денежный потенциал, прогноз, пинаклы жизни, личные годы и кармические уроки.</p>
        </div>
        <p style="color:#666;font-size:12px;margin:0;">Составлено ${dateStr} · Система нумерологии Александрова</p>
      </div>
    `,
    attachments: [{
      filename: `numeros-razbor-${name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      content: Buffer.isBuffer(pdfBuffer) ? pdfBuffer.toString('base64') : pdfBuffer,
    }],
  });

  if (error) {
    console.error('[sendEmail] Resend error:', JSON.stringify(error));
    throw new Error(`Resend: ${error.message ?? JSON.stringify(error)}`);
  }
  console.log('[sendEmail] Resend OK, id:', data?.id);
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

    console.log('[order] 5. Calling GPT...');
    const analysis = await generateAnalysis(name, birthDate, matrix, book, nameNumerology, karmicLessons);
    console.log('[order] 5. GPT done');

    console.log('[order] 6. Building PDF...');
    const pdfBuffer = await buildPDF(name, birthDate, matrix, analysis, extras);
    console.log('[order] 6. PDF built, size:', pdfBuffer?.length);

    console.log('[order] 7. Sending email to', email);
    await sendEmail(name, email, pdfBuffer);
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
