'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Lock,
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
  const A = dateDigits.reduce((s, d) => s + d, 0);           // sum of all date digits
  const B = sumDigits(A);                                      // sum of digits of A
  const C = A - Number(dd[0]) * 2;                            // A minus (first digit of day × 2)
  const D = sumDigits(C);                                      // sum of digits of C

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

// Demo data — shown on the landing page (date 28.10.1988)
const DEMO_DATA = calculateMatrix('1988-10-28');

// ─── Shared button classes ────────────────────────────────────────────────────

const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-black hover:bg-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.25em] transition-all duration-300 cursor-pointer';

const BTN_NAV =
  'inline-flex items-center justify-center bg-[#D4AF37] text-black hover:bg-white px-7 py-3.5 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300 cursor-pointer';

// ─── MatrixItem (основная 3×3) ───────────────────────────────────────────────

function MatrixItem({ label, value, status, highlight = false }) {
  return (
    <div
      className={`relative group aspect-square flex flex-col items-center justify-center gap-2 rounded-[20px] border transition-all duration-300 hover:-translate-y-0.5 ${
        highlight
          ? 'bg-gradient-to-br from-[#D4AF37]/25 to-[#D4AF37]/5 border-[#D4AF37]/50 shadow-[0_8px_24px_-8px_rgba(212,175,55,0.2)]'
          : 'bg-white/[0.06] border-white/20 hover:border-white/35 hover:bg-white/[0.09]'
      }`}
    >
      <span className={`text-[7px] uppercase tracking-[0.15em] font-black leading-none ${highlight ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
        {label}
      </span>
      <span className={`text-2xl font-black leading-none ${highlight ? 'text-white' : 'text-gray-100'}`}>
        {value || '—'}
      </span>
      {status && (
        <span className="text-[6px] uppercase font-bold tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors leading-none">
          {status}
        </span>
      )}
    </div>
  );
}

// ─── SideCell (правая колонка) ────────────────────────────────────────────────

function SideCell({ label, value, icon }) {
  return (
    <div className="aspect-square flex flex-col items-center justify-center gap-1.5 rounded-[20px] bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-default">
      <div className="text-gray-500 leading-none">{icon}</div>
      <p className="text-xl font-black text-gray-200 leading-none">{value}</p>
      <p className="text-[6px] uppercase font-black text-gray-600 tracking-wide leading-none text-center px-1">{label}</p>
    </div>
  );
}

// ─── BottomCell (нижний ряд) ──────────────────────────────────────────────────

function BottomCell({ label, value, icon }) {
  return (
    <div className="aspect-square flex flex-col items-center justify-center gap-1.5 rounded-[20px] bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-default">
      <div className="text-gray-500 leading-none">{icon}</div>
      <p className="text-xl font-black text-gray-200 leading-none">{value}</p>
      <p className="text-[6px] uppercase font-black text-gray-600 tracking-wide leading-none text-center px-1">{label}</p>
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
      } mx-auto overflow-visible ${
        blurred ? 'blur-2xl opacity-40 pointer-events-none' : ''
      }`}
    >
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#D4AF37]/10 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />

      <div className="relative z-10 p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[40px]">
        <div className="bg-[#0D0E14] rounded-[36px] p-5 md:p-6">
          <div className="grid grid-cols-4 gap-2.5">

            {/* ── Строка 1: Ключевые числа + Темперамент ── */}
            <div className="col-span-3 rounded-[20px] bg-white/[0.03] border border-white/10 p-2.5 flex flex-col gap-2">
              <p className="text-[7px] uppercase tracking-[0.25em] font-black text-gray-600 px-1">
                Дополнительные числа
              </p>
              <div className="grid grid-cols-4 gap-2 flex-1">
                {[
                  { l: 'Судьба',  v: d.destiny },
                  { l: 'Душа',    v: d.soul    },
                  { l: 'Карма',   v: d.karma   },
                  { l: 'Скрытое', v: d.hidden  },
                ].map((k) => (
                  <div key={k.l} className="flex flex-col items-center justify-center rounded-[14px] bg-[#D4AF37]/10 border border-[#D4AF37]/20 gap-1 py-3">
                    <span className="text-2xl font-black text-white leading-none">{k.v}</span>
                    <span className="text-[7px] uppercase font-black text-[#D4AF37]/60 tracking-wide">{k.l}</span>
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
  const [copied, setCopied] = useState(false);

  const shareText = `Моя матрица Пифагора (${formatDate(birthDate)}): Характер ${matrixData.char.v}, Удача ${matrixData.luck.v}, Долг ${matrixData.duty.v}, Интерес ${matrixData.interest.v}. Рассчитай свою на Numeros!`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://numeros.app';

  const networks = [
    {
      label: 'Telegram',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.43 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.718.942z"/></svg>
      ),
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      label: 'WhatsApp',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.85L.057 23.428a.5.5 0 0 0 .614.614l5.579-1.464A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.886 9.886 0 0 1-5.031-1.371l-.36-.214-3.733.979.997-3.645-.234-.374A9.863 9.863 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1S21.9 6.533 21.9 12 17.467 21.9 12 21.9z"/></svg>
      ),
      href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    },
    {
      label: 'ВКонтакте',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.713-1.033-1.01-1.49-.1149-1.49.667v1.566c0 .334-.106.534-1.235.534-1.822 0-3.845-1.104-5.263-3.164C5.98 12.72 5.4 10.507 5.4 9.456c0-.209.065-.4.47-.4H7.6c.39 0 .533.173.686.583.752 2.17 2.01 4.072 2.528 4.072.194 0 .283-.09.283-.581v-2.26c-.064-1.047-.61-1.135-.61-1.508 0-.187.154-.374.4-.374h2.743c.33 0 .448.175.448.55v3.047c0 .334.148.448.24.448.194 0 .357-.114.712-.47 1.104-1.237 1.889-3.143 1.889-3.143.104-.211.282-.411.668-.411h1.744c.524 0 .637.268.524.632-.22.994-2.353 4.04-2.353 4.04-.185.299-.252.432 0 .766.187.251.798.773 1.205 1.237.747.855 1.32 1.572 1.477 2.067.163.482-.086.727-.568.727z"/></svg>
      ),
      href: `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Моя матрица Пифагора', text: shareText, url: shareUrl });
        return;
      } catch { /* user cancelled */ }
    }
    setOpen((v) => !v);
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-[9px] uppercase tracking-[0.25em] font-black transition-all"
      >
        <Share2 size={11} />
        Поделиться
      </button>

      {open && (
        <>
          {/* overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* dropdown */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-[#0D0E14] border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50 min-w-[160px]">
            {networks.map((n) => (
              <a
                key={n.label}
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-gray-300 hover:text-white text-sm font-bold"
              >
                {n.icon}
                {n.label}
              </a>
            ))}
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-gray-300 hover:text-white text-sm font-bold border-t border-white/5 mt-1 pt-3"
            >
              {copied ? <Check size={16} className="text-[#D4AF37]" /> : <Copy size={16} />}
              {copied ? 'Скопировано!' : 'Копировать ссылку'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ scrolled, isMenuOpen, setIsMenuOpen, setView, scrollTo }) {
  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'py-4 bg-[#08090D]/90 backdrop-blur-md border-b border-white/10'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => { setView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-gradient-to-tr from-[#D4AF37]/20 to-transparent group-hover:rotate-180 transition-transform duration-700">
            <Gem size={18} className="text-[#D4AF37]" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#D4AF37] uppercase font-black text-xl tracking-[0.1em]">
            Numeros
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex gap-10 text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400">
          <button
            onClick={() => { setView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hover:text-[#D4AF37] transition-colors"
          >
            Личная матрица
          </button>
          <button className="hover:text-[#D4AF37] transition-colors opacity-40 cursor-not-allowed">
            Совместимость
          </button>
          <button
            onClick={() => scrollTo('testimonials-section')}
            className="hover:text-[#D4AF37] transition-colors"
          >
            Отзывы
          </button>
          <button
            onClick={() => scrollTo('faq-section')}
            className="hover:text-[#D4AF37] transition-colors"
          >
            FAQ
          </button>
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <button onClick={() => { setView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={BTN_NAV}>
            Получить разбор
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#08090D]/95 backdrop-blur-md border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          <button
            onClick={() => { setIsMenuOpen(false); setView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left text-sm uppercase tracking-[0.2em] font-bold text-gray-300 hover:text-[#D4AF37] transition-colors"
          >
            Личная матрица
          </button>
          <button
            className="text-left text-sm uppercase tracking-[0.2em] font-bold text-gray-500 cursor-not-allowed"
            disabled
          >
            Совместимость
          </button>
          <button
            onClick={() => { setIsMenuOpen(false); scrollTo('testimonials-section'); }}
            className="text-left text-sm uppercase tracking-[0.2em] font-bold text-gray-300 hover:text-[#D4AF37] transition-colors"
          >
            Отзывы
          </button>
          <button
            onClick={() => { setIsMenuOpen(false); scrollTo('faq-section'); }}
            className="text-left text-sm uppercase tracking-[0.2em] font-bold text-gray-300 hover:text-[#D4AF37] transition-colors"
          >
            FAQ
          </button>
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => { setIsMenuOpen(false); setView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`${BTN_NAV} w-full justify-center`}
            >
              Получить разбор
            </button>
          </div>
        </div>
      )}
    </nav>
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
    title: 'Характер 111',
    text: 'Три единицы — максимальная сила воли и харизма. Такой человек рождён вести за собой, его мнение весомо, а решения — твёрдые.',
    icon: <Target className="text-[#D4AF37]" size={20} />,
  },
  {
    title: 'Долг 888',
    text: 'Тройные восьмёрки указывают на мощную связь с материальным миром. Высокое чувство ответственности, склонность к системному мышлению и управлению ресурсами.',
    icon: <TrendingUp className="text-[#D4AF37]" size={20} />,
  },
  {
    title: 'Интерес 333',
    text: 'Три тройки — редкий творческий дар. Богатый внутренний мир, тяга к искусству, общению и саморазвитию. Источник вдохновения для окружающих.',
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

function DateSelect({ value, onChange }) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (day && month && year) {
      const mm = String(month).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      onChange(`${year}-${mm}-${dd}`);
    }
  }, [day, month, year]);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const selectClass = "flex-1 bg-white/[0.04] border border-white/10 rounded-2xl px-3 py-4 text-white text-base font-semibold outline-none focus:border-[#D4AF37]/50 transition-all appearance-none text-center cursor-pointer";

  return (
    <div className="flex gap-2 w-full">
      <select value={day} onChange={e => setDay(e.target.value)} className={selectClass} style={{ colorScheme: 'dark' }}>
        <option value="" disabled>День</option>
        {days.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <select value={month} onChange={e => setMonth(e.target.value)} className={selectClass} style={{ colorScheme: 'dark' }}>
        <option value="" disabled>Месяц</option>
        {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
      </select>
      <select value={year} onChange={e => setYear(e.target.value)} className={selectClass} style={{ colorScheme: 'dark' }}>
        <option value="" disabled>Год</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function NumerosApp() {
  const [view, setView] = useState('landing');
  const [birthDate, setBirthDate] = useState('');
  const [matrixData, setMatrixData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [pendingScroll, setPendingScroll] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Скроллим к нужной секции после того как view обновился и DOM перерисовался
  useEffect(() => {
    if (pendingScroll && view === 'landing') {
      const el = document.getElementById(pendingScroll);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setPendingScroll(null);
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
    if (birthDate) {
      setMatrixData(calculateMatrix(birthDate));
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-white overflow-x-hidden">
      <Nav
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setView={setView}
        scrollTo={scrollTo}
      />

      {(
        <div className="relative z-10">
          {/* ── Hero ── */}
          <section className="pt-48 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[9px] uppercase tracking-[0.3em] mb-10 font-black">
                <Sparkles size={14} /> Профессиональный расчет судьбы
              </div>
              <h1 className="text-6xl md:text-[86px] font-extrabold tracking-[-0.04em] mb-10 leading-[0.95] text-white">
                Твой путь в{' '}
                <span className="italic font-light text-[#D4AF37]">цифрах</span>
              </h1>
              <p className="max-w-xl text-gray-400 text-xl font-medium mb-14 mx-auto lg:mx-0 leading-relaxed">
                Раскрой свой потенциал через сакральную геометрию Квадрата
                Пифагора. Узнай свои сильные стороны за несколько секунд.
              </p>
              <form
                onSubmit={handleCalculate}
                className="w-full max-w-md flex flex-col gap-5 mx-auto lg:mx-0"
              >
                <DateSelect value={birthDate} onChange={setBirthDate} />
                <button className={`w-full group ${BTN_PRIMARY} py-6 shadow-2xl shadow-[#D4AF37]/10`}>
                  Рассчитать матрицу
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </form>
            </div>
            <div className="flex-1 w-full animate-float">
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

          {/* ── Benefits ── */}
          <section className="py-32 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
                Что откроет вам разбор
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {benefits.map((item, idx) => (
                <div
                  key={idx}
                  className={`glass-card p-10 rounded-[56px] group hover:border-white/20 transition-all duration-700 relative overflow-hidden flex flex-col border border-white/5`}
                >
                  <div
                    className={`w-24 h-24 rounded-[32px] bg-[#111218] border border-white/10 flex items-center justify-center mb-10 shadow-2xl ${item.shadow}`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-3xl font-black mb-6 leading-tight tracking-tighter">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-medium opacity-80 mb-10">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Insights ── */}
          <section className="py-32 px-6 max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-16 text-center">
              Как читать свои цифры?
            </h2>
            <div className="flex flex-col lg:flex-row items-start gap-16">
              {/* Матрица — выровнена по верху карточек */}
              <div className="flex-1 w-full relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-[9px] uppercase tracking-[0.25em] font-black text-white/50">
                  Пример
                </div>
                <div className="origin-top scale-[0.7] w-full" style={{marginBottom: 'calc((0.7 - 1) * 100%)'}}>
                  <ModernMatrixGrid size="large" />
                </div>
              </div>
              {/* Карточки — на том же уровне */}
              <div className="flex-1 space-y-6">
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="glass-card p-6 rounded-3xl border border-white/5 hover:border-[#D4AF37]/30 transition-all flex gap-5"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                      {insight.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-black mb-2">{insight.title}</h4>
                      <p className="text-gray-400 text-sm italic">{insight.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section
            id="faq-section"
            className="py-32 px-6 max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-20">
              Часто задаваемые вопросы
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-3xl border border-white/5 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setActiveFaq(activeFaq === idx ? null : idx)
                    }
                    className="w-full px-8 py-7 flex items-center justify-between text-left"
                  >
                    <span className="text-lg font-bold">{faq.q}</span>
                    {activeFaq === idx ? (
                      <Minus size={16} />
                    ) : (
                      <Plus size={16} />
                    )}
                  </button>
                  {activeFaq === idx && (
                    <div className="px-8 pb-8 text-gray-400 font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Testimonials ── */}
          <section id="testimonials-section" className="py-32 px-6 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-10">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="glass-card p-10 rounded-[48px] flex flex-col"
                >
                  <Quote className="text-[#D4AF37]/20 mb-8" size={32} />
                  <p className="text-gray-300 text-lg italic mb-10 grow">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 shrink-0">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="font-black text-white">{t.name}</div>
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
          <section className="py-40 px-6 text-center relative overflow-hidden">
            <h2 className="text-5xl md:text-7xl font-extrabold mb-10">
              Узнай свою судьбу
            </h2>
            <form
              onSubmit={handleCalculate}
              className="max-w-md mx-auto flex flex-col gap-5"
            >
              <DateSelect value={birthDate} onChange={setBirthDate} />
              <button className={`w-full ${BTN_PRIMARY} py-7`}>
                Рассчитать матрицу
              </button>
            </form>
          </section>
        </div>
      )}

      <footer className="py-20 text-center border-t border-white/5 opacity-40 text-[10px] uppercase tracking-[0.4em] font-black">
        © 2024 NUMEROS • PREMIUM NUMEROLOGY SERVICE
      </footer>
    </div>
  );
}
