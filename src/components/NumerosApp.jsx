'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import {
  ArrowRight,
  TrendingUp,
  Heart,
  Zap,
  Target,
  Sparkles,
  Quote,
  Menu,
  X,
  ShieldCheck,
  Coins,
  Gem,
  Plus,
  Minus,
  Crown,
  Eye,
  Activity,
  Flame,
  Home,
  Anchor,
  Crosshair,
  Share2,
  Copy,
  Check,
} from 'lucide-react';

// ─── Pythagorean square calculation ──────────────────────────────────────────

function sumDigits(n) {
  return String(Math.abs(n)).split('').reduce((s, d) => s + Number(d), 0);
}

function calculateMatrix(dateStr) {
  // dateStr = "YYYY-MM-DD" (from <input type="date">)
  const [year, month, day] = dateStr.split('-').map(Number);
  const dd   = String(day).padStart(2, '0');
  const mm   = String(month).padStart(2, '0');
  const yyyy = String(year).padStart(4, '0');

  // All digits from the date string
  const dateDigits = (dd + mm + yyyy).split('').map(Number);

  // Four working numbers
  // A: сумма всех цифр даты (с ведущими нулями: ДД.ММ.ГГГГ)
  const A = dateDigits.reduce((s, d) => s + d, 0);
  const B = sumDigits(A);
  // C: A минус удвоенная ПЕРВАЯ ЦИФРА ДНЯ (без ведущего нуля: для дня 1 → цифра 1, а не 0)
  const C = A - Number(String(day)[0]) * 2;
  const D = sumDigits(Math.abs(C));

  // Collect every digit (date + A + B + C + D), drop zeros
  const allDigits = [
    ...dateDigits,
    ...String(A).split('').map(Number),
    ...String(B).split('').map(Number),
    ...String(C).split('').map(Number),
    ...String(D).split('').map(Number),
  ].filter(d => d >= 1 && d <= 9);

  // Count how many times each digit 1–9 appears
  const cnt = Array(10).fill(0);
  allDigits.forEach(d => cnt[d]++);

  // Helpers
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
    // Four key numbers (top banner)
    destiny : A,
    soul    : B,
    karma   : C,
    hidden  : D,

    // Main 3×3 cells — digit mapping:
    //   1=Характер  4=Здоровье  7=Удача
    //   2=Энергия   5=Логика    8=Долг
    //   3=Интерес   6=Труд      9=Память
    char    : { v: val(1), s: status(1), h: hl(1) },
    health  : { v: val(4), s: status(4), h: hl(4) },
    luck    : { v: val(7), s: status(7), h: hl(7) },
    energy  : { v: val(2), s: status(2), h: hl(2) },
    logic   : { v: val(5), s: status(5), h: hl(5) },
    duty    : { v: val(8), s: status(8), h: hl(8) },
    interest: { v: val(3), s: status(3), h: hl(3) },
    labor   : { v: val(6), s: status(6), h: hl(6) },
    memory  : { v: val(9), s: status(9), h: hl(9) },

    // Right column — row potentials
    temperament: derived(lineSum(3, 5, 7)), // anti-diagonal
    goal       : derived(lineSum(1, 4, 7)), // row 1
    family     : derived(lineSum(2, 5, 8)), // row 2
    stability  : derived(lineSum(3, 6, 9)), // row 3

    // Bottom row — column potentials
    selfEsteem  : derived(lineSum(1, 2, 3)), // col 1
    household   : derived(lineSum(4, 5, 6)), // col 2
    talent      : derived(lineSum(7, 8, 9)), // col 3
    spirituality: derived(lineSum(1, 5, 9)), // main diagonal
  };
}

// Герой — Брэд Питт, 18.12.1963
const DEMO_DATA = calculateMatrix('1963-12-18');
// Пример в секции Insights — Анджелина Джоли, 04.06.1975
const JOLIE_DATA = calculateMatrix('1975-06-04');

// ─── Shared button classes ────────────────────────────────────────────────────

const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-black hover:bg-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.25em] transition-all duration-300 cursor-pointer';

const BTN_NAV =
  'inline-flex items-center justify-center bg-[#D4AF37] text-black hover:bg-white px-7 py-3.5 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300 cursor-pointer';

// ─── MatrixItem (основная 3×3) ───────────────────────────────────────────────

const STATUS_STYLE = {
  '—':        'bg-white/5 text-gray-600',
  'База':     'bg-blue-500/15 text-blue-400',
  'Усилено':  'bg-teal-500/15 text-teal-400',
  'Импульс':  'bg-orange-400/15 text-orange-400',
  'Экстра':   'bg-[#D4AF37]/20 text-[#D4AF37]',
};

function StatusDots({ value }) {
  const count = value === '—' ? 0 : value?.length ?? 0;
  const max = 5;
  return (
    <div className="flex gap-[3px] items-center">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={`w-[4px] h-[4px] md:w-[5px] md:h-[5px] rounded-full transition-all ${
          i < count ? 'bg-[#D4AF37] shadow-[0_0_4px_#D4AF37]' : 'bg-white/10'
        }`} />
      ))}
    </div>
  );
}

function MatrixItem({ label, value, status, highlight = false }) {
  const badgeClass = STATUS_STYLE[status] ?? 'bg-white/5 text-gray-600';
  return (
    <div
      className={`relative group aspect-square flex flex-col items-center justify-center gap-1 md:gap-1.5 rounded-2xl md:rounded-[20px] border transition-all duration-300 hover:-translate-y-0.5 overflow-hidden ${
        highlight
          ? 'bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border-[#D4AF37]/60'
          : 'bg-white/[0.05] border-white/[0.12] hover:border-white/25 hover:bg-white/[0.08]'
      }`}
    >
      {highlight && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0" />}
      <span className={`text-[5px] md:text-[7px] uppercase tracking-[0.1em] font-black leading-none ${highlight ? 'text-[#D4AF37]/80' : 'text-gray-500'}`}>
        {label}
      </span>
      <span className={`text-base md:text-[22px] font-black leading-none tracking-tight ${highlight ? 'text-white' : 'text-gray-100'}`}>
        {value || '—'}
      </span>
      <StatusDots value={value} />
      {status && status !== '—' && (
        <span className={`text-[4px] md:text-[6px] font-black tracking-wider leading-none px-1.5 py-0.5 rounded-full ${badgeClass}`}>
          {status}
        </span>
      )}
    </div>
  );
}

// ─── SideCell (правая колонка) ────────────────────────────────────────────────

function SideCell({ label, value, icon }) {
  return (
    <div className="aspect-square flex flex-col items-center justify-center gap-1 md:gap-1.5 rounded-2xl md:rounded-[20px] bg-blue-500/[0.04] border border-blue-500/20 hover:bg-blue-500/[0.08] hover:border-blue-400/30 transition-all cursor-default overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-400/40 to-blue-500/0" />
      <div className="text-blue-400/60 leading-none scale-75 md:scale-100">{icon}</div>
      <p className="text-sm md:text-xl font-black text-gray-100 leading-none">{value}</p>
      <p className="text-[4px] md:text-[6px] uppercase font-black text-blue-400/50 tracking-wide leading-none text-center px-1">{label}</p>
    </div>
  );
}

// ─── BottomCell (нижний ряд) ──────────────────────────────────────────────────

function BottomCell({ label, value, icon }) {
  return (
    <div className="aspect-square flex flex-col items-center justify-center gap-1 md:gap-1.5 rounded-2xl md:rounded-[20px] bg-purple-500/[0.04] border border-purple-500/20 hover:bg-purple-500/[0.08] hover:border-purple-400/30 transition-all cursor-default overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/0 via-purple-400/40 to-purple-500/0" />
      <div className="text-purple-400/60 leading-none scale-75 md:scale-100">{icon}</div>
      <p className="text-sm md:text-xl font-black text-gray-100 leading-none">{value}</p>
      <p className="text-[4px] md:text-[6px] uppercase font-black text-purple-400/50 tracking-wide leading-none text-center px-1">{label}</p>
    </div>
  );
}

// ─── ModernMatrixGrid ─────────────────────────────────────────────────────────

function ModernMatrixGrid({ blurred = false, size = 'normal', data = DEMO_DATA }) {
  const d = data;
  return (
    <div
      className={`relative w-full ${
        size === 'large' ? 'max-w-[700px]' : 'max-w-[580px]'
      } mx-auto overflow-hidden ${
        blurred ? 'blur-2xl opacity-40 pointer-events-none' : ''
      }`}
    >

      <div className="relative z-10 p-[1px] md:p-1 bg-gradient-to-br from-white/10 to-transparent rounded-3xl md:rounded-[40px]">
        <div className="bg-[#0D0E14] rounded-[28px] md:rounded-[36px] p-3 md:p-6">
          <div className="grid grid-cols-4 gap-1.5 md:gap-2.5">

            {/* ── Строка 1: Ключевые числа + Темперамент ── */}
            <div className="col-span-3 rounded-2xl md:rounded-[20px] bg-white/[0.03] border border-white/10 p-2 md:p-2.5 flex flex-col gap-1.5 md:gap-2">
              <p className="text-[5px] md:text-[7px] uppercase tracking-[0.2em] font-black text-gray-600 px-1">
                Доп. числа
              </p>
              <div className="grid grid-cols-4 gap-1 md:gap-2 flex-1">
                {[
                  { l: 'Судьба',  v: d.destiny },
                  { l: 'Душа',    v: d.soul    },
                  { l: 'Карма',   v: d.karma   },
                  { l: 'Скрытое', v: d.hidden  },
                ].map((k) => (
                  <div key={k.l} className="flex flex-col items-center justify-center rounded-xl md:rounded-[14px] bg-[#D4AF37]/10 border border-[#D4AF37]/20 gap-0.5 md:gap-1 py-2 md:py-3">
                    <span className="text-base md:text-2xl font-black text-white leading-none">{k.v}</span>
                    <span className="text-[5px] md:text-[7px] uppercase font-black text-[#D4AF37]/60 tracking-wide">{k.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <SideCell label="Темперамент" value={d.temperament} icon={<Flame size={11} />} />

            {/* ── Строки 2–4: матрица 3×3 + правая колонка ── */}
            <MatrixItem label="Характер" value={d.char.v}     status={d.char.s}     highlight={d.char.h} />
            <MatrixItem label="Здоровье" value={d.health.v}   status={d.health.s}   highlight={d.health.h} />
            <MatrixItem label="Удача"    value={d.luck.v}     status={d.luck.s}     highlight={d.luck.h} />
            <SideCell label="Цель"           value={d.goal}       icon={<Crosshair size={11} />} />

            <MatrixItem label="Энергия"  value={d.energy.v}   status={d.energy.s}   highlight={d.energy.h} />
            <MatrixItem label="Логика"   value={d.logic.v}    status={d.logic.s}    highlight={d.logic.h} />
            <MatrixItem label="Долг"     value={d.duty.v}     status={d.duty.s}     highlight={d.duty.h} />
            <SideCell label="Семья"          value={d.family}     icon={<Home size={11} />} />

            <MatrixItem label="Интерес"  value={d.interest.v} status={d.interest.s} highlight={d.interest.h} />
            <MatrixItem label="Труд"     value={d.labor.v}    status={d.labor.s}    highlight={d.labor.h} />
            <MatrixItem label="Память"   value={d.memory.v}   status={d.memory.s}   highlight={d.memory.h} />
            <SideCell label="Стабильность"   value={d.stability}  icon={<Anchor size={11} />} />

            {/* ── Строка 5: нижний ряд ── */}
            <BottomCell label="Самооценка" value={d.selfEsteem}   icon={<Sparkles size={11} />} />
            <BottomCell label="Быт"        value={d.household}    icon={<Activity size={11} />} />
            <BottomCell label="Талант"     value={d.talent}       icon={<Target   size={11} />} />
            <BottomCell label="Духовность" value={d.spirituality} icon={<Zap      size={11} />} />

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ShareButton ─────────────────────────────────────────────────────────────

function ShareButton({ birthDate, matrixData, formatDate }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | capturing | done | error

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://numeros.app';
  const shareText = `Вот моя матрица Пифагора — проверь бесплатно свою 👇\n${shareUrl}`;

  const captureMatrix = async () => {
    const { toPng } = await import('html-to-image');
    const el = document.getElementById('matrix-capture-zone');
    if (!el) throw new Error('Элемент не найден');
    const dataUrl = await toPng(el, {
      backgroundColor: '#08090D',
      pixelRatio: 2,
      skipFonts: false,
    });
    return dataUrl;
  };

  const withCapture = async (fn) => {
    setOpen(false);
    setStatus('capturing');
    try {
      const canvas = await captureMatrix();
      await fn(canvas);
      setStatus('done');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error('Share error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
    }
  };

  const handleDownload = () => withCapture(async (dataUrl) => {
    const link = document.createElement('a');
    link.download = `numeros-${formatDate(birthDate)}.png`;
    link.href = dataUrl;
    link.click();
  });


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus('done');
      setTimeout(() => setStatus('idle'), 2000);
    } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 2000); }
    setOpen(false);
  };

  // Конвертирует dataUrl в File
  const dataUrlToFile = async (dataUrl, name) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], name, { type: 'image/png' });
  };

  const handleShareTo = (appName) => withCapture(async (dataUrl) => {
    const file = await dataUrlToFile(dataUrl, `numeros-${formatDate(birthDate)}.png`);
    // Нативный шаринг с картинкой (мобильные iOS/Android)
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Моя матрица Пифагора', text: shareText });
      return;
    }
    // Десктоп — скачиваем картинку
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url; a.download = file.name; a.click();
    URL.revokeObjectURL(url);
  });

  const TgIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.43 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.718.942z"/></svg>
  );
  const WaIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.85L.057 23.428a.5.5 0 0 0 .614.614l5.579-1.464A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.886 9.886 0 0 1-5.031-1.371l-.36-.214-3.733.979.997-3.645-.234-.374A9.863 9.863 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1S21.9 6.533 21.9 12 17.467 21.9 12 21.9z"/></svg>
  );

  const btnLabel = status === 'capturing' ? 'Захват...' : status === 'done' ? 'Готово!' : status === 'error' ? 'Ошибка' : 'Поделиться';
  const btnColor = status === 'done' ? 'text-green-400 border-green-400/30' : status === 'error' ? 'text-red-400 border-red-400/30' : 'text-white/60 border-white/20 hover:text-white hover:border-white/40';

  return (
    <div className="relative">
      <button
        onClick={() => status === 'idle' && setOpen(v => !v)}
        disabled={status === 'capturing'}
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border text-[9px] uppercase tracking-[0.25em] font-black transition-all disabled:opacity-50 ${btnColor}`}
      >
        <Share2 size={11} />
        {btnLabel}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-[#0D0E14] border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50 min-w-[190px]">

            {/* Telegram с картинкой */}
            <button onClick={() => handleShareTo('telegram')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-gray-300 hover:text-white text-sm font-bold">
              <TgIcon /> Telegram
            </button>

            {/* WhatsApp с картинкой */}
            <button onClick={() => handleShareTo('whatsapp')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-gray-300 hover:text-white text-sm font-bold">
              <WaIcon /> WhatsApp
            </button>

            <div className="border-t border-white/5 my-1" />

            {/* Скачать */}
            <button onClick={handleDownload}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-gray-300 hover:text-white text-sm font-bold">
              <Copy size={15} /> Сохранить картинку
            </button>

            <div className="border-t border-white/5 mt-1 pt-1">
              <button onClick={handleCopy}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-gray-300 hover:text-white text-sm font-bold">
                <Copy size={15} /> Копировать ссылку
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const benefits = [
  {
    title: 'Ваш Характер',
    desc: 'Раскроем структуру личности: лидерские качества, воля и скрытые резервы психики.',
    icon: <Crown className="text-[#D4AF37]" size={32} />,
    shadow: 'shadow-[#D4AF37]/20',
  },
  {
    title: 'Сильные стороны',
    desc: 'То, в чем вы уникальны от рождения. Как использовать свои таланты для успеха.',
    icon: <Zap className="text-amber-400" size={32} />,
    shadow: 'shadow-amber-500/20',
  },
  {
    title: 'Точки роста',
    desc: 'Анализ дефицитных качеств и подробная инструкция по их проработке.',
    icon: <TrendingUp className="text-blue-400" size={32} />,
    shadow: 'shadow-blue-500/20',
  },
  {
    title: 'Код Отношений',
    desc: 'Как вы проявляетесь в любви, какой партнер вам нужен и как избежать конфликтов.',
    icon: <Heart className="text-rose-400" size={32} />,
    shadow: 'shadow-rose-500/20',
  },
  {
    title: 'Денежный поток',
    desc: 'Сферы реализации, где вас ждет максимальный финансовый рост согласно матрице.',
    icon: <Coins className="text-emerald-400" size={32} />,
    shadow: 'shadow-emerald-500/20',
  },
  {
    title: 'Миссия',
    desc: 'Ваше главное предназначение в этом воплощении и путь к истинному счастью.',
    icon: <Eye className="text-purple-400" size={32} />,
    shadow: 'shadow-purple-500/20',
  },
];

const insights = [
  {
    title: 'Здоровье 44',
    text: 'Двойная четвёрка — физическая выносливость и внутренняя сила. Джоли готовится к ролям месяцами, трансформирует тело и разум. Эта энергия даёт способность преодолевать то, что ломает других.',
    icon: <Target className="text-[#D4AF37]" size={20} />,
  },
  {
    title: 'Труд 66',
    text: 'Двойная шестёрка — символ заботы и ответственности. Шестеро детей, гуманитарные миссии в 30+ странах. Цифры матрицы объясняют, почему служение другим — не поступок, а часть её природы.',
    icon: <TrendingUp className="text-[#D4AF37]" size={20} />,
  },
  {
    title: 'Душа 5',
    text: 'Число Души равно пяти — жажда свободы, перемен и острых ощущений. Экстремальные роли, смена стран, неожиданные решения — всё это не хаос, а внутренняя потребность жить на полную.',
    icon: <ShieldCheck className="text-[#D4AF37]" size={20} />,
  },
];

const faqs = [
  {
    q: 'Насколько точен метод Квадрата Пифагора?',
    a: 'Квадрат Пифагора — одна из старейших систем нумерологии, основанная на математических закономерностях. Метод не предсказывает будущее, но точно описывает врождённые качества, сильные стороны и зоны роста личности. Тысячи людей отмечают высокую точность совпадений с реальным характером и жизненными сценариями.',
  },
  {
    q: 'Что означают пустые клетки в матрице?',
    a: 'Пустая клетка (отсутствие цифры) — не недостаток, а зона для развития. Например, пустое «Здоровье» говорит о том, что человеку важно осознанно уделять внимание телу. Пустая «Логика» — сигнал развивать аналитическое мышление. Зная свои пробелы, вы можете целенаправленно их прорабатывать.',
  },
  {
    q: 'Нужно ли знать точное время рождения?',
    a: 'Нет. Для расчёта Квадрата Пифагора достаточно только даты рождения — день, месяц и год. Время рождения используется в других системах, например в астрологии. Здесь вся информация извлекается исключительно из числовой структуры даты.',
  },
  {
    q: 'Что я получу в платном разборе?',
    a: 'Полный PDF-отчёт объёмом более 25 страниц: детальный анализ каждого из 9 секторов матрицы, расшифровка ключевых чисел (Судьба, Душа, Карма, Скрытое), описание денежного кода, рекомендации по отношениям и совместимости, а также числовой прогноз на ближайшие 3 года.',
  },
  {
    q: 'Можно ли рассчитать матрицу для другого человека?',
    a: 'Да, вы можете ввести любую дату рождения — партнёра, ребёнка, коллеги или друга. Многие используют метод для анализа совместимости в паре или понимания мотивации близких. Важно помнить, что матрица описывает потенциал, а не жёсткий приговор — человек всегда может осознанно работать над собой.',
  },
];

const testimonials = [
  {
    name: 'Айгерим О.',
    text: 'Это не просто расчет, это инструкция к жизни. Узнала о себе то, что чувствовала интуитивно.',
    role: 'Психолог',
    avatar: '/avatar-aigerim.jpg',
  },
  {
    name: 'Оксана Б.',
    text: 'Использую матрицу для анализа кандидатов. Помогает понять мотивацию человека.',
    role: 'HR Директор',
    avatar: '/avatar-oksana.jpg',
  },
  {
    name: 'Динара К.',
    text: 'Интерфейс очень красивый, а содержание разбора еще лучше. Рахмет за глубину!',
    role: 'Маркетолог',
    avatar: '/avatar-dinara.jpg',
  },
];

// ─── Date Select ──────────────────────────────────────────────────────────────

const MONTHS = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
];

function DateSelect({ value, onChange, showError }) {
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

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const missingDay   = showError && !day;
  const missingMonth = showError && !month;
  const missingYear  = showError && !year;

  const selectClass = (missing) =>
    `flex-1 bg-white/[0.04] border rounded-2xl px-3 py-4 text-white text-base font-semibold outline-none transition-all appearance-none text-center cursor-pointer ${
      missing
        ? 'border-red-500/70 bg-red-500/5'
        : 'border-white/10 focus:border-[#D4AF37]/50'
    }`;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2">
        <select value={day} onChange={e => setDay(e.target.value)} className={selectClass(missingDay)} style={{ colorScheme: 'dark' }}>
          <option value="" disabled>День</option>
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={month} onChange={e => setMonth(e.target.value)} className={selectClass(missingMonth)} style={{ colorScheme: 'dark' }}>
          <option value="" disabled>Месяц</option>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={year} onChange={e => setYear(e.target.value)} className={selectClass(missingYear)} style={{ colorScheme: 'dark' }}>
          <option value="" disabled>Год</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      {showError && (!day || !month || !year) && (
        <p className="text-red-400 text-xs font-semibold px-1 flex items-center gap-1.5">
          <span>⚠</span> Пожалуйста, выберите день, месяц и год рождения
        </p>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

// ─── OrderModal ───────────────────────────────────────────────────────────────

function OrderModal({ onClose, initialDate }) {
  const [step, setStep] = useState('form'); // form | success
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(initialDate || '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = true;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = true;
    if (!date) e.date = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStep('success');
  };

  const MONTHS_SHORT = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
  const days   = Array.from({ length: 31 }, (_, i) => i + 1);
  const years  = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const [dd, mm, yy] = date ? date.split('-').reverse() : ['','',''];

  const inputCls = (err) =>
    `w-full bg-white/[0.04] border rounded-2xl px-4 py-3.5 text-white text-sm font-semibold outline-none transition-all placeholder:text-gray-600 ${
      err ? 'border-red-500/60 bg-red-500/5 focus:border-red-400' : 'border-white/10 focus:border-[#D4AF37]/50'
    }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Панель */}
      <div className="relative w-full sm:max-w-md bg-[#0D0E14] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[92dvh] sm:max-h-[90dvh] mt-auto sm:my-auto">

        {/* Шапка */}
        <div className="relative px-6 pt-6 pb-5 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
              <Sparkles size={16} className="text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] font-black text-[#D4AF37]">Персональный разбор</p>
              <p className="text-white font-black text-base leading-tight">Глубокий анализ матрицы</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
            <p className="text-gray-400 text-sm leading-relaxed -mt-1">
              Заполните форму — нумеролог подготовит ваш личный разбор и пришлёт на почту.
            </p>

            {/* Имя */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] font-black text-gray-500">Ваше имя</label>
              <input
                value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: false })); }}
                placeholder="Например: Айгерим"
                className={inputCls(errors.name)}
              />
              {errors.name && <p className="text-red-400 text-xs font-semibold">Введите ваше имя</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] font-black text-gray-500">Email для получения</label>
              <input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: false })); }}
                placeholder="your@email.com"
                className={inputCls(errors.email)}
              />
              {errors.email && <p className="text-red-400 text-xs font-semibold">Введите корректный email</p>}
            </div>

            {/* Дата рождения */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] font-black text-gray-500">Дата рождения</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { placeholder: 'День',   options: days,                 current: dd, field: 'day'   },
                  { placeholder: 'Месяц',  options: MONTHS_SHORT,         current: mm ? MONTHS_SHORT[Number(mm)-1] : '', field: 'month' },
                  { placeholder: 'Год',    options: years,                current: yy, field: 'year'  },
                ].map(({ placeholder, options, current, field }) => (
                  <select
                    key={field}
                    value={field === 'month' ? mm : field === 'day' ? dd : yy}
                    onChange={e => {
                      const val = e.target.value;
                      const parts = date ? date.split('-') : ['','',''];
                      if (field === 'year')  { setDate(`${val}-${parts[1]||''}-${parts[2]||''}`); }
                      if (field === 'month') { setDate(`${parts[0]||''}-${String(val).padStart(2,'0')}-${parts[2]||''}`); }
                      if (field === 'day')   { setDate(`${parts[0]||''}-${parts[1]||''}-${String(val).padStart(2,'0')}`); }
                      setErrors(p => ({ ...p, date: false }));
                    }}
                    style={{ colorScheme: 'dark' }}
                    className={`bg-white/[0.04] border rounded-2xl px-2 py-3.5 text-white text-sm font-semibold outline-none transition-all appearance-none text-center cursor-pointer ${
                      errors.date ? 'border-red-500/60' : 'border-white/10 focus:border-[#D4AF37]/50'
                    }`}
                  >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((o, i) => (
                      <option key={i} value={field === 'month' ? i + 1 : o}>{field === 'month' ? o : o}</option>
                    ))}
                  </select>
                ))}
              </div>
              {errors.date && <p className="text-red-400 text-xs font-semibold">Выберите дату рождения</p>}
            </div>

            {/* Что входит */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-2">
              {['Анализ всех 9 секторов матрицы', 'Числа Судьбы, Души, Кармы и Скрытого', 'Денежный код и финансовый потенциал', 'Совет по отношениям и совместимости'].map(t => (
                <div key={t} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                  {t}
                </div>
              ))}
            </div>

            {/* Цена */}
            <div className="flex items-center justify-between bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl px-5 py-4">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Стоимость разбора</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-600 text-sm line-through">9 990 ₸</span>
                  <span className="text-white text-xl font-black">4 990 ₸</span>
                </div>
              </div>
              <div className="bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-xl px-3 py-1.5 text-[#D4AF37] text-[10px] font-black uppercase tracking-wide">
                −50%
              </div>
            </div>

            <button type="submit" className={`${BTN_PRIMARY} w-full py-4 justify-center text-sm`}>
              Оплатить и получить разбор <ArrowRight size={16} />
            </button>
            <p className="text-center text-gray-600 text-[10px]">Безопасная оплата · Готово за 5 минут</p>
          </form>
        ) : (
          /* Успех */
          <div className="px-6 py-12 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
              <Sparkles size={28} className="text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-white text-2xl font-black tracking-tight mb-2">Спасибо, {name}!</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ваш персональный разбор готовится.<br />
                Отправим на <span className="text-white font-semibold">{email}</span><br className="hidden sm:block" /> в течение <span className="text-[#D4AF37] font-black">5 минут</span>.
              </p>
            </div>
            <div className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-5 py-4 text-sm text-gray-400 leading-relaxed">
              Пока ждёте — можете поделиться своей матрицей с друзьями 🙂
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-sm font-semibold transition-colors">
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NumerosApp() {
  const [view, setView] = useState('landing');
  const [birthDate, setBirthDate] = useState('');
  const [matrixData, setMatrixData] = useState(null);
  const [dateError, setDateError] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(null);

  // Скроллим к нужной секции после того как view обновился и DOM перерисовался
  useEffect(() => {
    if (pendingScroll && view === 'landing') {
      const el = document.getElementById(pendingScroll);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => setPendingScroll(null), 0);
    }
  }, [view, pendingScroll]);

  const scrollTo = (sectionId) => {
    if (view !== 'landing') {
      setView('landing');
      setPendingScroll(sectionId);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!birthDate) {
      setDateError(true);
      return;
    }
    setDateError(false);
    setMatrixData(calculateMatrix(birthDate));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-white overflow-x-hidden">
      <NavBar activePage="home" />

      {(
        <div className="relative z-10">
          {/* ── Hero ── */}
          <section className="pt-28 md:pt-48 pb-12 md:pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 md:mb-10 font-black">
                <Sparkles size={12} /> Профессиональный расчет судьбы
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-[86px] font-extrabold tracking-[-0.03em] md:tracking-[-0.04em] mb-5 md:mb-10 leading-[1.05] md:leading-[0.95] text-white">
                Ваш путь в{' '}
                <span className="italic font-light text-[#D4AF37]">цифрах</span>
              </h1>
              <p className="max-w-xl text-gray-400 text-base md:text-xl font-medium mb-8 md:mb-14 mx-auto lg:mx-0 leading-relaxed">
                Раскройте свой потенциал через сакральную геометрию Квадрата
                Пифагора. Узнайте свои сильные стороны за несколько секунд.
              </p>
              <form
                onSubmit={handleCalculate}
                className="w-full max-w-md flex flex-col gap-3 md:gap-5 mx-auto lg:mx-0"
              >
                <DateSelect value={birthDate} onChange={(v) => { setBirthDate(v); if (v) setDateError(false); }} showError={dateError} />
                <button className={`w-full group ${BTN_PRIMARY} py-4 md:py-6 shadow-2xl shadow-[#D4AF37]/10`}>
                  Рассчитать матрицу
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </form>
            </div>
            <div className="flex-1 w-full animate-float" id="matrix-capture-zone">
              {matrixData && (
                <div className="flex justify-center gap-3 mb-4">
                  {/* Дата */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] uppercase tracking-[0.25em] font-black">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
                    {formatDate(birthDate)}
                  </div>
                  {/* Поделиться */}
                  <ShareButton birthDate={birthDate} matrixData={matrixData} formatDate={formatDate} />
                </div>
              )}
              <ModernMatrixGrid data={matrixData ?? DEMO_DATA} />
            </div>
          </section>

          {/* ── CTA — Персональный разбор ── */}
          <section className="py-10 md:py-16 px-6">
            <div className="max-w-2xl mx-auto">
              <div className="relative rounded-3xl overflow-hidden p-[1px] bg-gradient-to-br from-[#D4AF37]/50 via-[#D4AF37]/15 to-transparent">
                <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#08090D] rounded-3xl px-6 md:px-10 py-8 md:py-10">

                  {/* Бейдж срочности */}
                  <div className="flex justify-center md:justify-start mb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[9px] uppercase tracking-[0.2em] font-black">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      Специальная цена · Ограничено
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-7">
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">
                        Узнайте всё о себе —<br />
                        <span className="text-[#D4AF37]">полный разбор матрицы</span>
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-5">
                        Нумеролог вручную интерпретирует вашу матрицу: характер, таланты, денежный код, отношения и ключевые периоды жизни.
                      </p>
                      <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto md:mx-0">
                        {['25+ страниц разбора', 'Денежный потенциал', 'Код отношений', 'Прогноз на 3 года'].map(t => (
                          <div key={t} className="flex items-center gap-2 text-xs text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" /> {t}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Цена + кнопка */}
                    <div className="shrink-0 flex flex-col items-center gap-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl px-7 py-6 text-center">
                      <p className="text-gray-500 text-xs font-semibold">Стоимость разбора</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-600 text-base font-semibold line-through">9 990 ₸</span>
                        <span className="text-white text-3xl font-black">4 990 ₸</span>
                      </div>
                      <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-wide">Скидка 50%</p>
                      <button
                        onClick={() => setShowOrderModal(true)}
                        className={`${BTN_PRIMARY} w-full py-3.5 justify-center text-sm shadow-xl shadow-[#D4AF37]/20`}
                      >
                        Заказать разбор <ArrowRight size={15} />
                      </button>
                      <p className="text-gray-600 text-[10px]">Готово за 5 минут · На email</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Benefits ── */}
          <section className="py-16 md:py-32 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-10 md:mb-20">
              <h2 className="text-4xl md:text-7xl font-extrabold tracking-tighter text-white">
                Что откроет вам разбор
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
              {benefits.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card border border-white/5 rounded-3xl md:rounded-[56px] group hover:border-white/20 transition-all duration-700 overflow-hidden flex flex-row md:flex-col items-center md:items-start p-5 md:p-10 gap-4 md:gap-0"
                >
                  <div
                    className={`w-14 h-14 md:w-24 md:h-24 shrink-0 rounded-2xl md:rounded-[32px] bg-[#111218] border border-white/10 flex items-center justify-center md:mb-10 shadow-xl ${item.shadow}`}
                  >
                    <span className="scale-75 md:scale-100">{item.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg md:text-3xl font-black mb-1 md:mb-6 leading-tight tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-lg leading-relaxed font-medium opacity-80">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Insights ── */}
          <section className="py-16 md:py-32 px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-7xl font-extrabold tracking-tighter mb-8 md:mb-16 text-center">
              Как читать свои цифры?
            </h2>
            <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-16">
              {/* Матрица-пример */}
              <div className="flex-1 w-full relative">
                {/* Фото + подпись — выровнено по левому краю матрицы */}
                <div className="flex items-center gap-4 mb-6 md:mb-8 pl-[15%]">
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden border border-[#D4AF37]/30 shrink-0 shadow-lg shadow-[#D4AF37]/10">
                    <Image src="/avatar-angelina.jpg" alt="Анджелина Джоли" fill className="object-cover" sizes="64px" />
                  </div>
                  <div>
                    <p className="font-black text-white text-base md:text-lg leading-tight">Анджелина Джоли</p>
                    <p className="text-[#D4AF37] text-xs uppercase tracking-widest mt-0.5 font-bold">04.06.1975 · Пример разбора</p>
                  </div>
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 hidden">
                  Анджелина Джоли · 04.06.1975
                </div>
                <div className="origin-top scale-[0.7] w-full" style={{marginBottom: 'calc((0.7 - 1) * 100%)'}}>
                  <ModernMatrixGrid size="large" data={JOLIE_DATA} />
                </div>
              </div>
              {/* Карточки */}
              <div className="flex-1 w-full space-y-4 md:space-y-6">
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 hover:border-[#D4AF37]/30 transition-all flex gap-4 md:gap-5"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                      {insight.icon}
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-black mb-1 md:mb-2">{insight.title}</h4>
                      <p className="text-gray-400 text-sm italic leading-relaxed">{insight.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section
            id="faq-section"
            className="py-16 md:py-32 px-4 md:px-6 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-10 md:mb-20">
              Часто задаваемые вопросы
            </h2>
            <div className="space-y-3 md:space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-2xl md:rounded-3xl border border-white/5 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setActiveFaq(activeFaq === idx ? null : idx)
                    }
                    className="w-full px-5 py-4 md:px-8 md:py-7 flex items-center justify-between text-left gap-3"
                  >
                    <span className="text-sm md:text-lg font-bold leading-snug">{faq.q}</span>
                    <span className="shrink-0 text-gray-400">
                      {activeFaq === idx ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  {activeFaq === idx && (
                    <div className="px-5 pb-5 md:px-8 md:pb-8 text-gray-400 text-sm md:text-base font-medium leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Testimonials ── */}
          <section id="testimonials-section" className="py-16 md:py-32">
            <div className="px-6 max-w-7xl mx-auto mb-8 md:mb-12">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white text-center">
                Отзывы
              </h2>
            </div>
            {/* Mobile: horizontal swipe scroll */}
            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none px-6 md:max-w-7xl md:mx-auto scrollbar-none pb-4 md:pb-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="glass-card p-6 md:p-10 rounded-3xl md:rounded-[48px] flex flex-col shrink-0 w-[80vw] sm:w-[60vw] md:w-auto snap-start"
                >
                  <Quote className="text-[#D4AF37]/20 mb-4 md:mb-8" size={24} />
                  <p className="text-gray-300 text-base md:text-lg italic mb-6 md:mb-10 grow leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 shrink-0">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="font-black text-white text-sm md:text-base">{t.name}</div>
                      <div className="text-[10px] text-[#D4AF37] uppercase tracking-widest mt-0.5">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Final CTA ── */}
          <section className="py-20 md:py-40 px-6 text-center relative overflow-hidden">
            <h2 className="text-3xl md:text-7xl font-extrabold mb-6 md:mb-10">
              Узнайте свою судьбу
            </h2>
            <form
              onSubmit={handleCalculate}
              className="max-w-md mx-auto flex flex-col gap-3 md:gap-5"
            >
              <DateSelect value={birthDate} onChange={(v) => { setBirthDate(v); if (v) setDateError(false); }} showError={dateError} />
              <button className={`w-full ${BTN_PRIMARY} py-4 md:py-7`}>
                Рассчитать матрицу
              </button>
            </form>
          </section>
        </div>
      )}

      <footer className="py-20 text-center border-t border-white/5 opacity-40 text-[10px] uppercase tracking-[0.4em] font-black">
        © 2026 NUMEROS • Премиальный нумерологический сервис
      </footer>

      {/* ── Модал заказа разбора ── */}
      {showOrderModal && (
        <OrderModal onClose={() => setShowOrderModal(false)} initialDate={birthDate} />
      )}
    </div>
  );
}
