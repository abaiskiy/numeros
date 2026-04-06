'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { ArrowRight, ArrowLeft, Heart, Sparkles, Users, Zap, Target, TrendingUp, Shield } from 'lucide-react';
import { Manrope } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], weight: ['400','600','700','800'] });

// ─── Расчёт матрицы ───────────────────────────────────────────────────────────
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

  const val = (d) => cnt[d] === 0 ? '—' : String(d).repeat(cnt[d]);
  const hl  = (d) => cnt[d] >= 3;
  const lineSum = (...ds) => ds.reduce((s, d) => s + cnt[d], 0);
  const derived = (n) => n === 0 ? '—' : String(n);

  return {
    destiny: A, soul: B, karma: C, hidden: D, cnt,
    char    : { v: val(1), h: hl(1) },
    health  : { v: val(4), h: hl(4) },
    luck    : { v: val(7), h: hl(7) },
    energy  : { v: val(2), h: hl(2) },
    logic   : { v: val(5), h: hl(5) },
    duty    : { v: val(8), h: hl(8) },
    interest: { v: val(3), h: hl(3) },
    labor   : { v: val(6), h: hl(6) },
    memory  : { v: val(9), h: hl(9) },
    goal    : derived(lineSum(1, 4, 7)),
    family  : derived(lineSum(2, 5, 8)),
    talent  : derived(lineSum(7, 8, 9)),
    spirituality: derived(lineSum(1, 5, 9)),
  };
}

// ─── Расчёт совместимости ─────────────────────────────────────────────────────
function calculateCompatibility(m1, m2) {
  // Совпадение ключевых чисел
  const destinyMatch = m1.destiny === m2.destiny;
  const soulMatch    = m1.soul === m2.soul;
  const karmaMatch   = m1.karma === m2.karma;

  // Схожесть по секторам (1–9): считаем насколько близки counts
  let sectorScore = 0;
  for (let d = 1; d <= 9; d++) {
    const diff = Math.abs(m1.cnt[d] - m2.cnt[d]);
    sectorScore += diff === 0 ? 10 : diff === 1 ? 7 : diff === 2 ? 4 : 1;
  }
  const sectorPct = Math.round((sectorScore / 90) * 100);

  // Энергетическая совместимость (Душа + Темперамент)
  const energyScore = Math.max(0, 100 - Math.abs(m1.soul - m2.soul) * 12 - Math.abs((m1.cnt[2] || 0) - (m2.cnt[2] || 0)) * 8);

  // Общий балл
  const total = Math.round(
    sectorPct * 0.4 +
    energyScore * 0.3 +
    (destinyMatch ? 100 : 60) * 0.15 +
    (soulMatch ? 100 : 55) * 0.15
  );

  const score = Math.min(99, Math.max(40, total));

  const level =
    score >= 85 ? { label: 'Исключительная', color: '#D4AF37', desc: 'Редкое сочетание — вы дополняете друг друга на всех уровнях.' } :
    score >= 70 ? { label: 'Высокая',         color: '#86efac', desc: 'Крепкая основа для отношений с большим потенциалом роста.' } :
    score >= 55 ? { label: 'Хорошая',         color: '#93c5fd', desc: 'Есть точки притяжения и зоны для развития вместе.' } :
                  { label: 'Требует работы',  color: '#fca5a5', desc: 'Различия велики, но осознанность помогает их преодолеть.' };

  const aspects = [
    {
      title: 'Характер и воля',
      icon: <Target size={16} />,
      score: Math.min(99, Math.max(30, 100 - Math.abs(m1.cnt[1] - m2.cnt[1]) * 15)),
      desc: destinyMatch ? 'Одинаковый вектор судьбы создаёт глубокое взаимопонимание.' : 'Разные подходы к целям, но это источник роста.',
    },
    {
      title: 'Энергия и эмоции',
      icon: <Zap size={16} />,
      score: Math.min(99, Math.max(30, energyScore)),
      desc: soulMatch ? 'Души настроены на одну волну — редкая гармония.' : 'Эмоциональные ритмы отличаются, важно давать друг другу пространство.',
    },
    {
      title: 'Совместный быт',
      icon: <Shield size={16} />,
      score: Math.min(99, Math.max(30, 100 - Math.abs(m1.cnt[6] - m2.cnt[6]) * 12 - Math.abs(m1.cnt[4] - m2.cnt[4]) * 8)),
      desc: 'Бытовые ценности и уклад жизни.',
    },
    {
      title: 'Финансы и цели',
      icon: <TrendingUp size={16} />,
      score: Math.min(99, Math.max(30, 100 - Math.abs(m1.cnt[8] - m2.cnt[8]) * 12)),
      desc: 'Схожесть в отношении к деньгам и материальным целям.',
    },
  ];

  return { score, level, aspects, destinyMatch, soulMatch, karmaMatch };
}

// ─── Месяцы ───────────────────────────────────────────────────────────────────
const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

// ─── DateSelect ───────────────────────────────────────────────────────────────
function DateSelect({ onChange, showError }) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (day && month && year) {
      const mm = String(month).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      onChange(`${year}-${mm}-${dd}`);
    } else {
      onChange('');
    }
  }, [day, month, year]);

  const days  = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const cls = (missing) =>
    `flex-1 bg-white/[0.04] border rounded-2xl px-2 py-3 md:py-4 text-white text-sm font-semibold outline-none transition-all appearance-none text-center cursor-pointer ${
      missing ? 'border-red-500/70 bg-red-500/5' : 'border-white/10 focus:border-[#D4AF37]/50'
    }`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <select value={day}   onChange={e => setDay(e.target.value)}   className={cls(showError && !day)}   style={{ colorScheme: 'dark' }}>
          <option value="" disabled>День</option>
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={month} onChange={e => setMonth(e.target.value)} className={cls(showError && !month)} style={{ colorScheme: 'dark' }}>
          <option value="" disabled>Месяц</option>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={year}  onChange={e => setYear(e.target.value)}  className={cls(showError && !year)}  style={{ colorScheme: 'dark' }}>
          <option value="" disabled>Год</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      {showError && (!day || !month || !year) && (
        <p className="text-red-400 text-xs font-semibold px-1">⚠ Выберите дату</p>
      )}
    </div>
  );
}

// ─── Мини-матрица ─────────────────────────────────────────────────────────────
function MiniMatrix({ data, name }) {
  const cells = [
    { label: 'Хар', v: data.char.v,     h: data.char.h },
    { label: 'Здор', v: data.health.v,  h: data.health.h },
    { label: 'Удача', v: data.luck.v,   h: data.luck.h },
    { label: 'Энерг', v: data.energy.v, h: data.energy.h },
    { label: 'Логика', v: data.logic.v, h: data.logic.h },
    { label: 'Долг', v: data.duty.v,    h: data.duty.h },
    { label: 'Интер', v: data.interest.v,h:data.interest.h},
    { label: 'Труд', v: data.labor.v,   h: data.labor.h },
    { label: 'Память', v: data.memory.v,h: data.memory.h },
  ];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-center text-sm font-black text-white mb-1">{name}</p>
      <div className="grid grid-cols-3 gap-1.5">
        {cells.map((c, i) => (
          <div key={i} className={`aspect-square flex flex-col items-center justify-center rounded-xl border p-1 ${
            c.h ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40' : 'bg-white/[0.04] border-white/10'
          }`}>
            <span className={`text-[9px] uppercase tracking-wide font-bold ${c.h ? 'text-[#D4AF37]' : 'text-gray-500'}`}>{c.label}</span>
            <span className={`text-sm font-black leading-none mt-0.5 ${c.h ? 'text-white' : 'text-gray-200'}`}>{c.v || '—'}</span>
          </div>
        ))}
      </div>
      {/* Ключевые числа */}
      <div className="grid grid-cols-4 gap-1 mt-1">
        {[
          { l: 'Суд', v: data.destiny },
          { l: 'Душа', v: data.soul },
          { l: 'Карма', v: data.karma },
          { l: 'Скр', v: data.hidden },
        ].map((k, i) => (
          <div key={i} className="flex flex-col items-center bg-[#D4AF37]/8 border border-[#D4AF37]/20 rounded-lg py-1.5">
            <span className="text-base font-black text-white">{k.v}</span>
            <span className="text-[7px] uppercase text-[#D4AF37]/60 font-bold tracking-wide">{k.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Шкала совместимости ──────────────────────────────────────────────────────
function ScoreBar({ score, color }) {
  return (
    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Главный компонент ────────────────────────────────────────────────────────
export default function CompatibilityApp() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!date1 || !date2) { setShowError(true); return; }
    setShowError(false);
    const m1 = calculateMatrix(date1);
    const m2 = calculateMatrix(date2);
    const compat = calculateCompatibility(m1, m2);
    setResult({ m1, m2, compat });
    setTimeout(() => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const formatDate = (d) => { const [y,m,dd] = d.split('-'); return `${dd}.${m}.${y}`; };

  return (
    <div className={`min-h-screen bg-[#08090D] text-white overflow-x-hidden ${manrope.className}`}>

      <NavBar activePage="compatibility" />

      {/* ── Hero ── */}
      <section className="pt-28 md:pt-40 pb-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[8px] uppercase tracking-[0.25em] mb-6 font-black">
          <Heart size={12} /> Нумерологическая совместимость
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-5 leading-tight">
          Совместимость{' '}
          <span className="italic font-light text-[#D4AF37]">двух людей</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          Введите даты рождения двух людей и узнайте, насколько вы совместимы на уровне характера, энергии и жизненных целей.
        </p>

        {/* ── Форма ── */}
        <form onSubmit={handleCalculate} className="glass-card border border-white/8 rounded-3xl p-6 md:p-10 max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">

            {/* Человек 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] text-xs font-black">1</div>
                <span className="text-sm font-bold text-gray-300">Первый человек</span>
              </div>
              <input
                type="text"
                value={name1}
                onChange={e => setName1(e.target.value)}
                placeholder="Имя (необязательно)"
                className="bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-[#D4AF37]/50 transition-all"
              />
              <DateSelect onChange={setDate1} showError={showError && !date1} />
            </div>

            {/* Разделитель */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 mt-8">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                <Heart size={16} className="text-[#D4AF37]" />
              </div>
            </div>

            {/* Человек 2 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs font-black">2</div>
                <span className="text-sm font-bold text-gray-300">Второй человек</span>
              </div>
              <input
                type="text"
                value={name2}
                onChange={e => setName2(e.target.value)}
                placeholder="Имя (необязательно)"
                className="bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-[#D4AF37]/50 transition-all"
              />
              <DateSelect onChange={setDate2} showError={showError && !date2} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-black hover:bg-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.25em] transition-all duration-300"
          >
            Рассчитать совместимость
            <ArrowRight size={16} />
          </button>
        </form>
      </section>

      {/* ── Пример ── */}
      {!result && (
        <section className="py-12 md:py-20 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-black mb-3">Пример расчёта</p>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter">Как это работает</h2>
            <p className="text-gray-400 text-sm md:text-base mt-3 max-w-lg mx-auto leading-relaxed">
              Возьмём двух известных людей и покажем, что именно анализирует наш метод.
            </p>
          </div>

          {/* Пара — Брэд Питт и Анджелина Джоли */}
          <div className="glass-card border border-white/8 rounded-3xl p-6 md:p-10 mb-6">

            {/* Два человека + балл */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-8">
              {/* Человек 1 */}
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-3">
                  <span className="text-2xl font-black text-[#D4AF37]">БП</span>
                </div>
                <p className="font-black text-white">Брэд Питт</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">18.12.1963</p>
                <div className="flex gap-2 mt-3 flex-wrap justify-center">
                  {[{l:'Судьба',v:31},{l:'Душа',v:4},{l:'Карма',v:29}].map((k,i)=>(
                    <div key={i} className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg px-2.5 py-1 text-center">
                      <span className="text-xs font-black text-white block">{k.v}</span>
                      <span className="text-[8px] text-[#D4AF37]/60 uppercase tracking-wide">{k.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Балл */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full border-4 border-[#93c5fd] flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-3xl font-black text-white">69</span>
                </div>
                <span className="text-sm font-black text-[#93c5fd]">Хорошая</span>
                <p className="text-[10px] text-gray-500 text-center max-w-[140px]">Сильное притяжение при ярких различиях</p>
              </div>

              {/* Человек 2 */}
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-3">
                  <span className="text-2xl font-black text-blue-400">АД</span>
                </div>
                <p className="font-black text-white">Анджелина Джоли</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">04.06.1975</p>
                <div className="flex gap-2 mt-3 flex-wrap justify-center">
                  {[{l:'Судьба',v:32},{l:'Душа',v:5},{l:'Карма',v:24}].map((k,i)=>(
                    <div key={i} className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-2.5 py-1 text-center">
                      <span className="text-xs font-black text-white block">{k.v}</span>
                      <span className="text-[8px] text-blue-400/60 uppercase tracking-wide">{k.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Аспекты с реальными баллами */}
            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {[
                { title: 'Характер и воля',   score: 30, color: '#fca5a5', desc: 'У Питта — 6 единиц (доминирующая воля), у Джоли — 1. Очень разные характеры: именно это создавало напряжение и притяжение одновременно.' },
                { title: 'Энергия и эмоции', score: 88, color: '#D4AF37', desc: 'Душа 4 и Душа 5 — практически резонируют. Оба чувствуют людей тонко. Именно поэтому их эмоциональный контакт был таким мощным.' },
                { title: 'Совместный быт',   score: 80, color: '#86efac', desc: 'Схожее отношение к труду и семье: оба ставят близких на первое место, ценят уют и стабильность.' },
                { title: 'Финансы и цели',   score: 88, color: '#D4AF37', desc: 'Финансовые ценности и отношение к ресурсам почти идентичны — редкое совпадение для столь разных характеров.' },
              ].map((a, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/6 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-white">{a.title}</span>
                    <span className="font-black text-sm" style={{ color: a.color }}>{a.score}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-3 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${a.score}%`, backgroundColor: a.color }} />
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>

            {/* Вывод */}
            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-4 flex gap-3">
              <Sparkles size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
              <p className="text-gray-300 text-xs leading-relaxed">
                <span className="text-white font-bold">Вывод:</span> Классический пример притяжения противоположностей — 
                характеры диаметрально разные, но энергетика и финансовые ценности почти совпадают. 
                Такой союз требует осознанности, но даёт мощный импульс для роста обоих.
              </p>
            </div>
          </div>

          {/* Что показывает результат */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <Heart size={16} className="text-[#D4AF37]" />,
                title: 'Общий балл совместимости',
                desc: 'Число от 40 до 99 — интегральная оценка по всем параметрам. Чем выше, тем больше точек соприкосновения.',
              },
              {
                icon: <Sparkles size={16} className="text-[#D4AF37]" />,
                title: 'Совпадение ключевых чисел',
                desc: 'Если числа Судьбы или Души совпадают — это редкость. Такие пары чувствуют глубинное взаимопонимание.',
              },
              {
                icon: <Zap size={16} className="text-[#D4AF37]" />,
                title: 'Разбор по 4 аспектам',
                desc: 'Характер, эмоции, быт и финансы — каждый аспект показывает, где пара сильна, а где стоит уделить внимание.',
              },
              {
                icon: <Users size={16} className="text-[#D4AF37]" />,
                title: 'Матрицы рядом',
                desc: 'Видите оба квадрата Пифагора — сразу понятно, в чём вы похожи, а в чём дополняете друг друга.',
              },
            ].map((c, i) => (
              <div key={i} className="flex gap-4 glass-card border border-white/5 rounded-2xl p-5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                  {c.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white mb-1">{c.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Результат ── */}
      {result && (
        <section id="result" className="py-16 px-6 max-w-5xl mx-auto">

          {/* Общий балл */}
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-4">Результат</p>
            <div className="inline-flex flex-col items-center gap-3">
              <div
                className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 flex items-center justify-center shadow-2xl"
                style={{ borderColor: result.compat.level.color, boxShadow: `0 0 40px ${result.compat.level.color}30` }}
              >
                <span className="text-4xl md:text-5xl font-black text-white">{result.compat.score}</span>
              </div>
              <span className="text-lg font-black" style={{ color: result.compat.level.color }}>
                {result.compat.level.label}
              </span>
              <p className="text-gray-400 text-sm max-w-sm text-center leading-relaxed">
                {result.compat.level.desc}
              </p>
            </div>

            {/* Совпадения ключевых чисел */}
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              {[
                { label: 'Судьба', match: result.compat.destinyMatch, v1: result.m1.destiny, v2: result.m2.destiny },
                { label: 'Душа',   match: result.compat.soulMatch,    v1: result.m1.soul,    v2: result.m2.soul },
                { label: 'Карма',  match: result.compat.karmaMatch,   v1: result.m1.karma,   v2: result.m2.karma },
              ].map((k, i) => (
                <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold ${
                  k.match ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]' : 'bg-white/[0.03] border-white/10 text-gray-400'
                }`}>
                  {k.match && <Sparkles size={10} />}
                  {k.label}: {k.v1} {k.match ? '= ' : '/ '}{k.v2}
                  {k.match && ' — совпадение!'}
                </div>
              ))}
            </div>
          </div>

          {/* Аспекты */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {result.compat.aspects.map((a, i) => (
              <div key={i} className="glass-card border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                    {a.icon}
                  </div>
                  <span className="font-black text-sm text-white">{a.title}</span>
                  <span className="ml-auto font-black text-base" style={{ color: a.score >= 75 ? '#D4AF37' : a.score >= 55 ? '#93c5fd' : '#fca5a5' }}>
                    {a.score}%
                  </span>
                </div>
                <ScoreBar score={a.score} color={a.score >= 75 ? '#D4AF37' : a.score >= 55 ? '#93c5fd' : '#fca5a5'} />
                <p className="text-gray-400 text-xs mt-3 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>

          {/* Матрицы двух людей */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tighter text-center mb-8">
              Матрицы участников
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card border border-[#D4AF37]/15 rounded-3xl p-6">
                <MiniMatrix data={result.m1} name={name1 || 'Первый'} />
                {date1 && <p className="text-center text-gray-500 text-xs mt-3 uppercase tracking-widest">{formatDate(date1)}</p>}
              </div>
              <div className="glass-card border border-blue-500/15 rounded-3xl p-6">
                <MiniMatrix data={result.m2} name={name2 || 'Второй'} />
                {date2 && <p className="text-center text-gray-500 text-xs mt-3 uppercase tracking-widest">{formatDate(date2)}</p>}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-bold hover:bg-[#D4AF37]/20 transition-all">
              <ArrowLeft size={14} /> Рассчитать личную матрицу
            </Link>
          </div>
        </section>
      )}

      <footer className="py-16 text-center border-t border-white/5 opacity-40 text-[10px] uppercase tracking-[0.4em] font-black">
        © 2026 NUMEROS · Премиальный нумерологический сервис
      </footer>
    </div>
  );
}
