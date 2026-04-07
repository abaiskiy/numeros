/**
 * Pythagorean psychomatrix calculation.
 * Works in both browser (NumerosApp.jsx) and server (API route).
 *
 * Input:  dateStr = "YYYY-MM-DD"
 * Output: matrix object with all cells, key numbers, and digit counts
 */

function sumDigits(n) {
  return String(Math.abs(n))
    .split('')
    .reduce((s, d) => s + Number(d), 0);
}

export function calculateMatrix(dateStr) {
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
    if (c === 0) return '—';
    if (c === 1) return 'База';
    if (c === 2) return 'Усилено';
    if (c === 3) return 'Импульс';
    return 'Экстра';
  };
  const hl      = (d) => cnt[d] >= 3;
  const lineSum = (...ds) => ds.reduce((s, d) => s + cnt[d], 0);
  const derived = (n) => n === 0 ? '—' : String(n);

  return {
    // Raw counts for server-side book lookup
    counts: cnt,

    // Four key numbers
    destiny : A,
    soul    : B,
    karma   : C,
    hidden  : D,

    // 3×3 cells
    char    : { digit: 1, v: val(1), s: status(1), h: hl(1) },
    health  : { digit: 4, v: val(4), s: status(4), h: hl(4) },
    luck    : { digit: 7, v: val(7), s: status(7), h: hl(7) },
    energy  : { digit: 2, v: val(2), s: status(2), h: hl(2) },
    logic   : { digit: 5, v: val(5), s: status(5), h: hl(5) },
    duty    : { digit: 8, v: val(8), s: status(8), h: hl(8) },
    interest: { digit: 3, v: val(3), s: status(3), h: hl(3) },
    labor   : { digit: 6, v: val(6), s: status(6), h: hl(6) },
    memory  : { digit: 9, v: val(9), s: status(9), h: hl(9) },

    // Row/column potentials
    temperament : derived(lineSum(3, 5, 7)),
    goal        : derived(lineSum(1, 4, 7)),
    family      : derived(lineSum(2, 5, 8)),
    stability   : derived(lineSum(3, 6, 9)),
    selfEsteem  : derived(lineSum(1, 2, 3)),
    household   : derived(lineSum(4, 5, 6)),
    talent      : derived(lineSum(7, 8, 9)),
    spirituality: derived(lineSum(1, 5, 9)),
  };
}

/**
 * Maps digit count to the key used in numerology-book.json
 * e.g., count=3 → "3", count=5 → "5+"
 */
export function countKey(n) {
  if (n >= 5) return '5+';
  return String(n);
}

/**
 * Builds the context string for GPT prompt from book data + matrix.
 */
export function buildBookContext(matrix, book) {
  const { quantitative, transitions, lines } = book;
  const { counts } = matrix;

  const CELLS = [
    { key: 'char',     digit: 1 },
    { key: 'energy',   digit: 2 },
    { key: 'interest', digit: 3 },
    { key: 'health',   digit: 4 },
    { key: 'logic',    digit: 5 },
    { key: 'labor',    digit: 6 },
    { key: 'luck',     digit: 7 },
    { key: 'duty',     digit: 8 },
    { key: 'memory',   digit: 9 },
  ];

  let ctx = '=== ИНТЕРПРЕТАЦИИ ИЗ КНИГИ ===\n\n';

  for (const { digit } of CELLS) {
    const q = quantitative[String(digit)];
    if (!q) continue;
    const c = counts[digit];
    const interpretation = q.counts[countKey(c)] ?? q.counts['0'];
    ctx += `Цифра ${digit} — ${q.cellName} (количество: ${c}):\n${interpretation}\n\n`;
  }

  // Check for notable combinations
  const specials = transitions?.specials ?? {};
  const matchedSpecials = [];
  for (const [pattern, desc] of Object.entries(specials)) {
    const digits = pattern.replace(/\D/g, '');
    if (digits.length > 0) {
      const digit = Number(digits[0]);
      const count = digits.length;
      if (counts[digit] >= count) {
        matchedSpecials.push(`${pattern}: ${desc}`);
      }
    }
  }
  if (matchedSpecials.length > 0) {
    ctx += `=== ОСОБЫЕ КОМБИНАЦИИ ===\n${matchedSpecials.join('\n')}\n\n`;
  }

  // Lines context
  if (lines?.rows) {
    ctx += `=== ЛИНИИ ПСИХОМАТРИЦЫ ===\n`;
    for (const [, row] of Object.entries(lines.rows)) {
      ctx += `${row.name}: ${row.meaning}\n`;
    }
  }

  return ctx;
}
