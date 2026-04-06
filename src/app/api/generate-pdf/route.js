import { NextResponse } from 'next/server';

// Дублируем расчёт матрицы на сервере (без импорта клиентского компонента)
function sumDigits(n) {
  return String(Math.abs(n)).split('').reduce((s, d) => s + Number(d), 0);
}

function calculateMatrix(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dd   = String(day).padStart(2, '0');
  const mm   = String(month).padStart(2, '0');
  const yyyy = String(year).padStart(4, '0');
  const dateDigits = (dd + mm + yyyy).split('').map(Number);
  const A = dateDigits.reduce((s, d) => s + d, 0);
  const B = sumDigits(A);
  const C = A - Number(String(day)[0]) * 2;
  const D = sumDigits(Math.abs(C));

  const allDigits = [
    ...dateDigits,
    ...String(A).split('').map(Number),
    ...String(B).split('').map(Number),
    ...String(C).split('').map(Number),
    ...String(D).split('').map(Number),
  ].filter(d => d >= 1 && d <= 9);

  const cnt = Array(10).fill(0);
  allDigits.forEach(d => cnt[d]++);

  const val    = (d) => cnt[d] === 0 ? '—' : String(d).repeat(cnt[d]);
  const status = (d) => {
    const c = cnt[d];
    if (c === 0) return 'Пусто';
    if (c === 1) return 'Слабо';
    if (c === 2) return 'Норма';
    if (c === 3) return 'Сильно';
    return 'Мощно';
  };
  const hl      = (d) => cnt[d] >= 3;
  const lineSum = (...ds) => ds.reduce((s, d) => s + cnt[d], 0);
  const derived = (n) => n === 0 ? '—' : String(n);

  return {
    destiny: A, soul: B, karma: C, hidden: D,
    char    : { v: val(1), s: status(1), h: hl(1) },
    health  : { v: val(4), s: status(4), h: hl(4) },
    luck    : { v: val(7), s: status(7), h: hl(7) },
    energy  : { v: val(2), s: status(2), h: hl(2) },
    logic   : { v: val(5), s: status(5), h: hl(5) },
    duty    : { v: val(8), s: status(8), h: hl(8) },
    interest: { v: val(3), s: status(3), h: hl(3) },
    labor   : { v: val(6), s: status(6), h: hl(6) },
    memory  : { v: val(9), s: status(9), h: hl(9) },
    temperament: derived(lineSum(3, 5, 7)),
    goal       : derived(lineSum(1, 4, 7)),
    family     : derived(lineSum(2, 5, 8)),
    stability  : derived(lineSum(3, 6, 9)),
    selfEsteem : derived(lineSum(1, 2, 3)),
    household  : derived(lineSum(4, 5, 6)),
    talent     : derived(lineSum(7, 8, 9)),
    spirituality: derived(lineSum(1, 5, 9)),
  };
}

export async function POST(req) {
  try {
    const { name, birthDate } = await req.json();

    if (!name || !birthDate) {
      return NextResponse.json({ error: 'Укажи имя и дату рождения' }, { status: 400 });
    }

    // 1. Рассчитываем матрицу
    const matrixData = calculateMatrix(birthDate);

    // 2. Форматируем дату для отображения
    const [y, m, d] = birthDate.split('-');
    const formattedDate = `${d}.${m}.${y}`;

    // 3. Генерируем AI-текст для каждой секции
    let report = { sections: [], summary: '' };
    if (process.env.OPENAI_API_KEY) {
      const { generateFullReport } = await import('@/lib/generateReport.js');
      report = await generateFullReport(matrixData, name, formattedDate);
    }

    // 4. Рендерим PDF
    const { renderToBuffer } = await import('@react-pdf/renderer');
    const { NumerologyPDF } = await import('@/lib/NumerologyPDF.jsx');
    const pdfBuffer = await renderToBuffer(
      NumerologyPDF({
        matrixData,
        name,
        birthDate: formattedDate,
        reportSections: report.sections,
        summary: report.summary,
      })
    );

    // 5. Отдаём PDF файл
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="numeros-${name.replace(/\s+/g, '-')}.pdf"`,
      },
    });

  } catch (err) {
    console.error('PDF generation error:', err);
    return NextResponse.json(
      { error: 'Ошибка генерации PDF', details: err.message },
      { status: 500 }
    );
  }
}
