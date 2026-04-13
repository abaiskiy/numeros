'use client';

import { useEffect, useRef } from 'react';

export const PERSONAL_PDF_PAGES = [
  { title: 'Обложка разбора', tag: 'Персональный', color: '#C9A84C', content: 'cover' },
  { title: 'Ключевые числа', tag: 'Судьба · Душа · Карма', color: '#9B7FCA', content: 'numbers' },
  { title: 'Психоматрица', tag: '9 секторов', color: '#C9A84C', content: 'matrix' },
  { title: 'Характер и личность', tag: 'Глубокий анализ', color: '#5B9BD5', content: 'lines' },
  { title: 'Денежный потенциал', tag: 'Финансовый код', color: '#8ABF5A', content: 'lines' },
  { title: 'Личный месяц', tag: 'Что делать сейчас', color: '#3ABFB3', content: 'lines' },
  { title: 'Архетип личности', tag: 'Творец · Лидер · Мудрец', color: '#9B7FCA', content: 'lines' },
  { title: 'Теневая сторона', tag: 'Честный разбор', color: '#D48EC0', content: 'lines' },
  { title: 'Карьера', tag: 'Предназначение', color: '#8ABF5A', content: 'lines' },
  { title: 'Аффирмации', tag: '5 личных аффирмаций', color: '#C9A84C', content: 'affirm' },
];

/** Страницы превью для PDF совместимости (соответствуют реальному отчёту). */
export const COMPATIBILITY_PDF_PAGES = [
  { title: 'Обложка пары', tag: 'Совместимость', color: '#D48EC0', content: 'cover' },
  { title: 'Балл союза', tag: 'Уровень 40–99', color: '#93c5fd', content: 'numbers' },
  { title: 'Две матрицы', tag: 'Пифагор × 2', color: '#D4AF37', content: 'matrix' },
  { title: '6 сфер жизни', tag: 'Романтика, быт…', color: '#D48EC0', content: 'lines' },
  { title: 'Языки любви', tag: 'Он и она', color: '#9B7FCA', content: 'lines' },
  { title: 'Конфликтные зоны', tag: 'Триггеры пары', color: '#fca5a5', content: 'lines' },
  { title: 'Личные месяцы', tag: 'Сейчас у каждого', color: '#3ABFB3', content: 'lines' },
  { title: 'Бизнес вдвоём', tag: 'Совместный проект', color: '#8ABF5A', content: 'lines' },
  { title: 'Благоприятные даты', tag: '90 дней вперёд', color: '#C9A84C', content: 'affirm' },
  { title: 'Рекомендации', tag: 'Итог для пары', color: '#D4AF37', content: 'lines' },
];

export default function PDFPreviewStrip({ pages = PERSONAL_PDF_PAGES }) {
  const stripRef = useRef(null);
  const baseLen = pages.length;

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    let running = true;
    let pos = 0;
    const speed = 0.6;
    const tick = () => {
      if (!running) return;
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    const pause = () => {
      running = false;
    };
    const resume = () => {
      running = true;
      requestAnimationFrame(tick);
    };
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
    };
  }, []);

  const doubled = [...pages, ...pages];

  return (
    <div
      ref={stripRef}
      className="flex gap-4 overflow-x-auto pb-2 select-none"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
    >
      {doubled.map((page, i) => (
        <div
          key={i}
          className="shrink-0 w-44 md:w-52 bg-[#12131A] border border-white/[0.07] rounded-2xl overflow-hidden"
          style={{ aspectRatio: '210/297' }}
        >
          <div
            className="px-3 py-2.5 flex items-center justify-between border-b border-white/[0.06]"
            style={{ background: `${page.color}12` }}
          >
            <div>
              <div
                className="text-[7px] font-black uppercase tracking-widest mb-0.5"
                style={{ color: page.color }}
              >
                NUMEROS
              </div>
              <div className="text-white text-[10px] font-bold leading-tight">{page.title}</div>
            </div>
            <div
              className="text-[8px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ color: page.color, background: `${page.color}20` }}
            >
              {(i % baseLen) + 1}
            </div>
          </div>

          <div className="p-3 flex flex-col gap-2 pointer-events-none">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="h-2.5 rounded-sm w-1" style={{ background: page.color }} />
              <div className="h-1.5 rounded-full w-16 opacity-50" style={{ background: page.color }} />
            </div>

            {page.content === 'matrix' ? (
              <div className="grid grid-cols-3 gap-1">
                {[3, 1, 2, 8, 5, 4, 7, 6, 9].map((n, j) => (
                  <div
                    key={j}
                    className="aspect-square rounded bg-white/[0.06] border border-white/[0.06] flex items-center justify-center"
                  >
                    <span
                      className="text-[10px] font-black blur-[2px]"
                      style={{ color: `${page.color}CC` }}
                    >
                      {n}
                    </span>
                  </div>
                ))}
              </div>
            ) : page.content === 'numbers' ? (
              <div className="grid grid-cols-2 gap-1.5">
                {['Судьба', 'Душа', 'Карма', 'Потенциал'].map((l, j) => (
                  <div
                    key={j}
                    className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-2 text-center"
                  >
                    <div
                      className="text-[14px] font-black blur-[3px]"
                      style={{ color: page.color }}
                    >
                      {j + 3}
                    </div>
                    <div className="text-[7px] text-gray-600 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            ) : page.content === 'cover' ? (
              <div className="flex flex-col gap-2">
                <div className="h-2 rounded-full w-3/4 bg-white/20" />
                <div className="h-1.5 rounded-full w-1/2 bg-white/10" />
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {[65, 80, 70, 90].map((_, j) => (
                    <div
                      key={j}
                      className="h-5 rounded bg-white/[0.05] border border-white/[0.06]"
                    />
                  ))}
                </div>
              </div>
            ) : page.content === 'affirm' ? (
              <div className="flex flex-col gap-1.5">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full shrink-0" style={{ background: page.color }} />
                    <div className="h-1.5 rounded-full bg-white/10 blur-[1px] flex-1" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {[75, 55, 85, 45, 70, 60].map((w, j) => (
                  <div key={j} className="flex flex-col gap-0.5">
                    {j % 3 === 0 && (
                      <div
                        className="h-1.5 rounded-full w-2/3 mb-0.5 opacity-60"
                        style={{ background: page.color }}
                      />
                    )}
                    <div
                      className="h-1.5 rounded-full bg-white/10 blur-[1px]"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                ))}
              </div>
            )}

            {i % 3 === 2 && (
              <div className="mt-1 flex items-center justify-center gap-1 opacity-40">
                <span className="text-[8px] text-gray-500">🔒 только для вас</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
