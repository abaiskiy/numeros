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
    counts: cnt,
    destiny : A,
    soul    : B,
    karma   : C,
    hidden  : D, // UI label: «Потенциал»
    char    : { digit: 1, v: val(1), s: status(1), h: hl(1) },
    health  : { digit: 4, v: val(4), s: status(4), h: hl(4) },
    luck    : { digit: 7, v: val(7), s: status(7), h: hl(7) },
    energy  : { digit: 2, v: val(2), s: status(2), h: hl(2) },
    logic   : { digit: 5, v: val(5), s: status(5), h: hl(5) },
    duty    : { digit: 8, v: val(8), s: status(8), h: hl(8) },
    interest: { digit: 3, v: val(3), s: status(3), h: hl(3) },
    labor   : { digit: 6, v: val(6), s: status(6), h: hl(6) },
    memory  : { digit: 9, v: val(9), s: status(9), h: hl(9) },
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

export function countKey(n) {
  if (n >= 5) return '5+';
  return String(n);
}

const DIGIT_CELL_NAME = {
  1: 'Характер', 2: 'Энергия', 3: 'Интерес к жизни',
  4: 'Здоровье', 5: 'Логика', 6: 'Труд',
  7: 'Удача', 8: 'Долг', 9: 'Память',
};

const MATRIX_LINES = [
  { name: 'Самооценки',       cells: [1,2,3], key: '1-2-3' },
  { name: 'Быта',             cells: [4,5,6], key: '4-5-6' },
  { name: 'Таланта',          cells: [7,8,9], key: '7-8-9' },
  { name: 'Целеустремлённости', cells: [1,4,7], key: '1-4-7' },
  { name: 'Семьи',            cells: [2,5,8], key: '2-5-8' },
  { name: 'Стабильности',     cells: [3,6,9], key: '3-6-9' },
  { name: 'Духовности',       cells: [1,5,9], key: '1-5-9' },
  { name: 'Темперамента',     cells: [3,5,7], key: '3-5-7' },
];

/**
 * Finds ALL meaningful combinations actually present in the matrix,
 * enriched with book descriptions where available.
 *
 * Priority order: strong repeats (3–4+) → pairs → complete lines → missing digits → empty lines
 * Capped at 8 to keep the GPT prompt manageable.
 *
 * Returns an array of { label, digits, bookDesc } for use in the GPT prompt.
 */
export function detectCombinations(matrix, book) {
  const { counts } = matrix;
  const quantitative = book.quantitative ?? {};
  const specials     = book.transitions?.specials ?? {};
  const linesBook    = book.lines ?? {};

  const strongRepeats = []; // 3+ of same digit
  const pairs         = []; // exactly 2 of same digit
  const complete      = []; // line where all 3 cells are non-zero
  const missing       = []; // digit count = 0
  const emptyLines    = []; // line where all 3 cells are zero

  // ── 1. Per-digit analysis ──────────────────────────────────────────────────
  for (let d = 1; d <= 9; d++) {
    const c        = counts[d] || 0;
    const cellName = DIGIT_CELL_NAME[d];
    const qData    = quantitative[String(d)];

    if (c === 0) {
      const bookDesc = qData?.counts?.['0'] ?? null;
      missing.push({
        label: `Отсутствие цифры ${d} — ${cellName}`,
        digits: `нет ${d}`,
        bookDesc,
      });
    } else if (c >= 3) {
      const pattern   = String(d).repeat(c);
      const typeLabel = c >= 4 ? 'Мощная группа' : 'Тройка';
      const bookDesc  = specials[pattern] ?? qData?.counts?.[countKey(c)] ?? null;
      strongRepeats.push({
        label: `${typeLabel} ${pattern} — ${cellName}`,
        digits: pattern,
        bookDesc,
      });
    } else if (c === 2) {
      const pattern  = String(d).repeat(2);
      const bookDesc = specials[pattern] ?? qData?.counts?.['2'] ?? null;
      pairs.push({
        label: `Пара ${pattern} — ${cellName}`,
        digits: pattern,
        bookDesc,
      });
    }
  }

  // ── 2. Line analysis ────────────────────────────────────────────────────────
  const allRowsCols = [
    ...(Object.values(linesBook.rows      ?? {})),
    ...(Object.values(linesBook.columns   ?? {})),
    ...(Object.values(linesBook.diagonals ?? {})),
  ];

  for (const line of MATRIX_LINES) {
    const allFilled = line.cells.every(d => (counts[d] || 0) > 0);
    const allEmpty  = line.cells.every(d => (counts[d] || 0) === 0);

    if (allFilled) {
      const bookEntry = allRowsCols.find(r => r.name?.includes(line.name));
      complete.push({
        label: `Полная линия ${line.name} (${line.key})`,
        digits: line.key,
        bookDesc: bookEntry?.meaning ?? null,
      });
    } else if (allEmpty) {
      emptyLines.push({
        label: `Пустая линия ${line.name} (${line.key})`,
        digits: line.key,
        bookDesc: null,
      });
    }
  }

  // ── 3. Merge by priority and cap at 8 ──────────────────────────────────────
  const ordered = [...strongRepeats, ...pairs, ...complete, ...missing, ...emptyLines];
  return ordered.slice(0, 8);
}

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

  if (lines?.rows) {
    ctx += `=== ЛИНИИ ПСИХОМАТРИЦЫ ===\n`;
    for (const [, row] of Object.entries(lines.rows)) {
      ctx += `${row.name}: ${row.meaning}\n`;
    }
  }

  return ctx;
}

// ─── Extended calculations ────────────────────────────────────────────────────

function reduceToSingle(n) {
  let num = Math.abs(n);
  while (num > 9) {
    num = String(num).split('').reduce((s, d) => s + Number(d), 0);
  }
  return num;
}

// Pythagorean Russian: letters in alphabetical order cycling 1-9
const RU_NUM = {
  А:1, Б:2, В:3, Г:4, Д:5, Е:6, Ё:7, Ж:8, З:9,
  И:1, Й:2, К:3, Л:4, М:5, Н:6, О:7, П:8, Р:9,
  С:1, Т:2, У:3, Ф:4, Х:5, Ц:6, Ч:7, Ш:8, Щ:9,
  Ъ:1, Ы:2, Ь:3, Э:4, Ю:5, Я:6,
};
const RU_VOWELS = new Set(['А','Е','Ё','И','О','У','Ы','Э','Ю','Я']);

export function calculateNameNumerology(name) {
  const upper = name.toUpperCase().replace(/[^А-ЯЁ]/g, '');
  if (!upper.length) return null;
  let expr = 0, soulN = 0, personality = 0;
  for (const ch of upper) {
    const num = RU_NUM[ch] || 0;
    expr += num;
    if (RU_VOWELS.has(ch)) soulN += num;
    else personality += num;
  }
  return {
    expression:  reduceToSingle(expr),
    soulUrge:    reduceToSingle(soulN),
    personality: reduceToSingle(personality),
  };
}

export function calculatePinnacles(birthDate) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const rd = reduceToSingle;
  const yearReduced = rd([...String(year)].reduce((s, d) => s + Number(d), 0));

  const p1 = rd(month + day);
  const p2 = rd(day + yearReduced);
  const p3 = rd(p1 + p2);
  const p4 = rd(month + yearReduced);

  const lifePath = rd(
    (String(day).padStart(2, '0') + String(month).padStart(2, '0') + String(year))
      .split('').reduce((s, d) => s + Number(d), 0)
  );
  const end1 = 36 - lifePath;

  return [
    { number: p1, from: 0,       to: end1,       label: 'Первый пинакль'     },
    { number: p2, from: end1+1,  to: end1+9,     label: 'Второй пинакль'    },
    { number: p3, from: end1+10, to: end1+18,    label: 'Третий пинакль'    },
    { number: p4, from: end1+19, to: 99,         label: 'Четвёртый пинакль' },
  ];
}

const PERSONAL_YEAR_MEANINGS = {
  1: 'Новые начала. Время запускать проекты и строить планы.',
  2: 'Партнёрство и терпение. Год для сотрудничества.',
  3: 'Творчество и общение. Рост социальных связей.',
  4: 'Дисциплина и труд. Закладка прочных основ.',
  5: 'Перемены и свобода. Время движения и нового опыта.',
  6: 'Семья и гармония. Ответственность и забота.',
  7: 'Самопознание. Уединение и духовный поиск.',
  8: 'Карьера и достижения. Год финансового роста.',
  9: 'Завершение цикла. Отпустить прошлое, подготовка.',
};

export function getPersonalYears(birthDate, count = 5) {
  const [, month, day] = birthDate.split('-').map(Number);
  const curYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const year = curYear + i;
    const py   = reduceToSingle(day + month + year);
    return { year, personalYear: py, meaning: PERSONAL_YEAR_MEANINGS[py] ?? '' };
  });
}

const KARMIC_LESSONS = {
  1: 'Учитесь принимать самостоятельные решения. Развивайте волю, уверенность и независимость.',
  2: 'Осваивайте терпение и дипломатию. Важно слышать других и находить компромисс.',
  3: 'Раскрывайте самовыражение. Говорите о чувствах и делитесь своим творчеством.',
  4: 'Развивайте дисциплину. Систематический труд и доведение дел до конца — ваши уроки.',
  5: 'Принимайте перемены. Научитесь адаптироваться и видеть в переменах возможности.',
  6: 'Берите ответственность за близких. Ищите баланс между заботой о других и о себе.',
  7: 'Доверяйте интуиции. Развивайте внутренний голос и духовную глубину.',
  8: 'Работайте с материальным миром открыто. Цените труд и не бойтесь брать заработанное.',
  9: 'Развивайте сострадание. Учитесь видеть жизнь за пределами личных интересов.',
};

export function getKarmicLessons(counts) {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .filter(d => counts[d] === 0)
    .map(d => ({ digit: d, lesson: KARMIC_LESSONS[d] }));
}

const FAMOUS_BY_DIGIT = {
  1: [{ name: 'Стив Джобс',       field: 'Технологии' }, { name: 'Наполеон Бонапарт', field: 'История'    }],
  2: [{ name: 'Барак Обама',       field: 'Политика'   }, { name: 'Мать Тереза',       field: 'Гуманизм'   }],
  3: [{ name: 'Уолт Дисней',       field: 'Творчество' }, { name: 'Дж. К. Роулинг',    field: 'Литература' }],
  4: [{ name: 'Альберт Эйнштейн',  field: 'Наука'      }, { name: 'Билл Гейтс',        field: 'Технологии' }],
  5: [{ name: 'Авраам Линкольн',   field: 'Политика'   }, { name: 'Мерилин Монро',     field: 'Кино'       }],
  6: [{ name: 'Леонардо да Винчи', field: 'Искусство'  }, { name: 'Майкл Джексон',     field: 'Музыка'     }],
  7: [{ name: 'Никола Тесла',      field: 'Наука'      }, { name: 'Стивен Хокинг',     field: 'Физика'     }],
  8: [{ name: 'Пабло Пикассо',     field: 'Искусство'  }, { name: 'Элвис Пресли',      field: 'Музыка'     }],
  9: [{ name: 'Махатма Ганди',     field: 'Философия'  }, { name: 'Лев Толстой',       field: 'Литература' }],
};

export function getFamousByDestiny(destiny) {
  const n = reduceToSingle(Math.abs(destiny));
  return FAMOUS_BY_DIGIT[n] ?? FAMOUS_BY_DIGIT[1];
}

// ─── Personal Month ───────────────────────────────────────────────────────────

const PERSONAL_MONTH_MEANING = {
  1: { label: 'Новые начала',        theme: 'Время запускать проекты, принимать решения и делать первые шаги.' },
  2: { label: 'Союзы и терпение',    theme: 'Месяц для партнёрства, переговоров и укрепления связей. Не торопите события.' },
  3: { label: 'Творчество и общение',theme: 'Расцветают идеи, социальная активность и самовыражение.' },
  4: { label: 'Труд и фундамент',    theme: 'Месяц строить, планировать и закладывать основы.' },
  5: { label: 'Перемены и свобода',  theme: 'Ожидайте неожиданного. Время для изменений, путешествий и новых знакомств.' },
  6: { label: 'Дом и ответственность',theme: 'Фокус на семье, отношениях, заботе о близких.' },
  7: { label: 'Анализ и внутренний поиск', theme: 'Месяц для рефлексии, учёбы, уединения и духовного роста.' },
  8: { label: 'Власть и финансы',    theme: 'Лучший месяц для деловых решений, переговоров о деньгах и карьерных шагов.' },
  9: { label: 'Завершение и отпускание', theme: 'Время закрывать циклы, прощаться с лишним и готовиться к обновлению.' },
};

/**
 * Returns current personal month number and its meaning.
 * personalMonth = reduce(personalYear + currentCalendarMonth)
 */
export function getPersonalMonth(birthDate, referenceDate = new Date()) {
  const [y, mo, d] = birthDate.split('-').map(Number);
  const currentYear  = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1;

  const pyRaw = d + mo + currentYear;
  const personalYear = String(pyRaw).split('').reduce((s, x) => s + +x, 0);
  const pyReduced    = reduceToSingle(personalYear);

  const pmRaw     = pyReduced + currentMonth;
  const pmReduced = reduceToSingle(pmRaw);

  const meaning = PERSONAL_MONTH_MEANING[pmReduced] ?? PERSONAL_MONTH_MEANING[1];
  return { number: pmReduced, personalYear: pyReduced, currentMonth, ...meaning };
}

// ─── Favorable dates for a couple ────────────────────────────────────────────

const DAY_NUM_MEANING = {
  1: { label: 'Новые начала',        tip: 'Идеально для важных решений, первого шага, старта совместных проектов' },
  2: { label: 'Гармония и союз',     tip: 'Лучший день для разговоров по душам, признаний и договорённостей' },
  3: { label: 'Радость и творчество',tip: 'Для свиданий, путешествий, совместного творчества и праздников' },
  4: { label: 'Стабильность',        tip: 'Для планирования, серьёзных договорённостей, финансовых решений' },
  5: { label: 'Перемены и свобода',  tip: 'Для новых впечатлений, путешествий, неожиданных шагов' },
  6: { label: 'Любовь и забота',     tip: 'Для укрепления отношений, романтики, разговоров о семье' },
  7: { label: 'Духовность',          tip: 'Для глубоких бесед, совместной медитации, рефлексии об отношениях' },
  8: { label: 'Сила и успех',        tip: 'Для важных совместных решений, достижений, публичных шагов' },
  9: { label: 'Завершение',          tip: 'Для прощения, подведения итогов, перехода на новый уровень' },
};

/**
 * Returns up to `limit` favorable dates for a couple in the next `daysAhead` days.
 * A date is "favorable" when its universal day number matches any of the couple's
 * power numbers (reduced destiny, soul of either person).
 */
export function getFavorableDates(date1, date2, m1, m2, daysAhead = 90, limit = 12) {
  const r = (n) => reduceToSingle(Math.abs(n));

  // Couple's "power numbers" — unique reduced values
  const powerNums = new Set([
    r(m1.destiny), r(m2.destiny),
    r(m1.soul),    r(m2.soul),
  ]);

  // Also add the sum of both destinies reduced (couple number)
  const coupleNum = r(r(m1.destiny) + r(m2.destiny));
  powerNums.add(coupleNum);

  const results = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= daysAhead && results.length < limit; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yy = date.getFullYear();
    const dayNum = r(dd + mm + yy);

    if (powerNums.has(dayNum)) {
      const meaning = DAY_NUM_MEANING[dayNum];
      results.push({
        date:    date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        dateISO: date.toISOString().slice(0, 10),
        dayNum,
        label:   meaning?.label ?? '',
        tip:     meaning?.tip   ?? '',
        // mark couple number dates as extra special
        special: dayNum === coupleNum,
      });
    }
  }

  return results;
}
