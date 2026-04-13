'use client';

import SocialProofCounter from './SocialProofCounter';

/** Личный разбор */
export const PERSONAL_TESTIMONIALS = [
  {
    name: 'Айгерим О.',
    role: 'Психолог, Алматы',
    destiny: 7,
    rating: 5,
    text: 'Описание числа характера — будто списано с меня. Разбор теневой стороны поразил честностью, не ожидала такой глубины. Теперь понимаю, почему некоторые паттерны повторяются годами.',
  },
  {
    name: 'Оксана Б.',
    role: 'HR-директор, Астана',
    destiny: 4,
    rating: 5,
    text: 'Использую матрицу для анализа кандидатов уже 3 месяца. Точность попаданий в характер — 9 из 10. Раздел «Карьера и предназначение» показал такие профессии, которые я сама давно рассматривала.',
  },
  {
    name: 'Динара К.',
    role: 'Маркетолог, Алматы',
    destiny: 3,
    rating: 5,
    text: 'Раздел совместимости с мужем открыл глаза на наши конфликты. Теперь я понимаю его реакции — это просто его число, не злой умысел. Отношения стали намного мягче.',
  },
  {
    name: 'Жанар М.',
    role: 'Предприниматель, Шымкент',
    destiny: 8,
    rating: 5,
    text: 'Денежный блок описан настолько точно — я не могла поверить. Стратегию из раздела «Рост дохода» взяла как руководство к действию. Рекомендую каждой женщине.',
  },
];

/** Разбор совместимости (пары). */
export const COMPATIBILITY_TESTIMONIALS = [
  {
    name: 'Алия & Нурсултан',
    role: 'Алматы · вместе 6 лет',
    pairScore: 76,
    rating: 5,
    text: 'Бесплатный расчёт показал «хорошую» совместимость, а в PDF — почему мы спорим про быт и деньги. Раздел про конфликтные зоны прямо попал. Стало легче разговаривать без обид.',
  },
  {
    name: 'Елена В.',
    role: 'Астана',
    pairScore: 82,
    rating: 5,
    text: 'Заказала разбор дочери с женихом в подарок на помолвку. Они оба перечитали PDF дважды — особенно языки любви и личные месяцы. Говорят, многое встало на места.',
  },
  {
    name: 'Марина & Олег',
    role: 'Караганда',
    pairScore: 71,
    rating: 5,
    text: 'Думали, что несовместимы по характеру. В отчёте увидели, где мы дополняем друг друга, а где нужны правила. Благоприятные даты использовали для разговора о свадьбе — сработало.',
  },
  {
    name: 'Гульнара С.',
    role: 'Актобе',
    pairScore: 88,
    rating: 5,
    text: 'Подруга подарила нам с мужем разбор на годовщину. Совпало с тем, что нумеролог написал про «энергию и быт» — мы как раз планировали ремонт. Советую всем парам.',
  },
];

export default function TestimonialsSection({
  eyebrow = 'Реальные результаты',
  title = 'Что говорят после разбора',
  items,
  accent = 'gold',
  counterLabel = 'разборов уже выдано',
  counterInitials = ['А', 'О', 'Д', 'Ж'],
  trustLine = [
    'Реальные покупатели',
    'Казахстан и СНГ',
    'PDF на почту за 5 минут',
  ],
}) {
  const starColor = accent === 'rose' ? 'text-rose-400' : 'text-[#D4AF37]';
  const avatarBg =
    accent === 'rose'
      ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
      : 'bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37]';
  const badgeNum = accent === 'rose' ? 'text-rose-400' : 'text-[#D4AF37]';
  const eyebrowCls =
    accent === 'rose'
      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
      : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]';

  return (
    <section id="testimonials-section" className="py-16 md:py-28 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10 md:mb-16">
        <span
          className={`inline-block ${eyebrowCls} text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4`}
        >
          {eyebrow}
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">{title}</h2>
        <SocialProofCounter
          accent={accent}
          label={counterLabel}
          initials={counterInitials}
        />
      </div>

      <div
        className="flex md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-none pb-4 md:pb-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((t, idx) => (
          <div
            key={idx}
            className="glass-card p-6 md:p-8 rounded-2xl md:rounded-3xl flex flex-col shrink-0 w-[85vw] sm:w-[70vw] md:w-auto snap-start border border-white/[0.07]"
          >
            <div className="flex gap-0.5 mb-3">
              {[...Array(t.rating || 5)].map((_, i) => (
                <span key={i} className={`${starColor} text-sm`}>
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-5 grow">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.07]">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-black shrink-0 ${avatarBg}`}
                >
                  {t.name.replace(/[^А-Яа-яA-Za-z]/g, '')[0] || '?'}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white text-sm truncate">{t.name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{t.role}</div>
                </div>
              </div>
              <div className="flex flex-col items-center bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-1.5 shrink-0 ml-2">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">
                  {t.pairScore != null ? 'Балл пары' : 'Судьба'}
                </span>
                <span className={`${badgeNum} font-black text-base leading-none`}>
                  {t.pairScore != null ? t.pairScore : t.destiny}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 md:mt-10 flex flex-wrap justify-center items-center gap-4 md:gap-8 text-gray-500 text-xs">
        {trustLine.map((line) => (
          <div key={line} className="flex items-center gap-1.5">
            <span className={accent === 'rose' ? 'text-rose-400' : 'text-[#D4AF37]'}>✓</span>
            {line}
          </div>
        ))}
      </div>
    </section>
  );
}
