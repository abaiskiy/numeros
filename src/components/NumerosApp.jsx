'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

function MatrixItem({ label, value, status, highlight = false }) {
  return (
    <div
      className={`relative group aspect-square flex flex-col items-center justify-center gap-1 md:gap-2 rounded-2xl md:rounded-[20px] border transition-all duration-300 hover:-translate-y-0.5 ${
        highlight
          ? 'bg-gradient-to-br from-[#D4AF37]/25 to-[#D4AF37]/5 border-[#D4AF37]/50 shadow-[0_8px_24px_-8px_rgba(212,175,55,0.2)]'
          : 'bg-white/[0.06] border-white/20 hover:border-white/35 hover:bg-white/[0.09]'
      }`}
    >
      <span className={`text-[5px] md:text-[7px] uppercase tracking-[0.1em] md:tracking-[0.15em] font-black leading-none ${highlight ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
        {label}
      </span>
      <span className={`text-base md:text-2xl font-black leading-none ${highlight ? 'text-white' : 'text-gray-100'}`}>
        {value || '—'}
      </span>
      {status && (
        <span className="text-[4px] md:text-[6px] uppercase font-bold tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors leading-none">
          {status}
        </span>
      )}
    </div>
  );
}

// ─── SideCell (правая колонка) ────────────────────────────────────────────────

function SideCell({ label, value, icon }) {
  return (
    <div className="aspect-square flex flex-col items-center justify-center gap-1 md:gap-1.5 rounded-2xl md:rounded-[20px] bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-default">
      <div className="text-gray-500 leading-none scale-75 md:scale-100">{icon}</div>
      <p className="text-sm md:text-xl font-black text-gray-200 leading-none">{value}</p>
      <p className="text-[4px] md:text-[6px] uppercase font-black text-gray-600 tracking-wide leading-none text-center px-1">{label}</p>
    </div>
  );
}

// ─── BottomCell (нижний ряд) ──────────────────────────────────────────────────

function BottomCell({ label, value, icon }) {
  return (
    <div className="aspect-square flex flex-col items-center justify-center gap-1 md:gap-1.5 rounded-2xl md:rounded-[20px] bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-default">
      <div className="text-gray-500 leading-none scale-75 md:scale-100">{icon}</div>
      <p className="text-sm md:text-xl font-black text-gray-200 leading-none">{value}</p>
      <p className="text-[4px] md:text-[6px] uppercase font-black text-gray-600 tracking-wide leading-none text-center px-1">{label}</p>
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

// ─── PDFButton ───────────────────────────────────────────────────────────────

function PDFButton({ birthDate, name }) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [inputName, setInputName] = useState(name || '');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!inputName.trim() || !birthDate) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: inputName.trim(), birthDate }),
      });
      if (!res.ok) throw new Error('Ошибка генерации');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `numeros-${inputName.trim().replace(/\s+/g, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setShowForm(false);
    } catch (err) {
      alert('Не удалось создать PDF. Попробуй ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <div className="w-full max-w-md mx-auto lg:mx-0 mt-3">
        <form onSubmit={handleGenerate} className="glass-card border border-[#D4AF37]/20 rounded-2xl p-5 flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#D4AF37]">Введите своё имя для разбора</p>
          <input
            type="text"
            value={inputName}
            onChange={e => setInputName(e.target.value)}
            placeholder="Например: Айгерим"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-[#D4AF37]/50 transition-all"
            required
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 ${BTN_PRIMARY} py-3 text-[9px] ${loading ? 'opacity-50 cursor-wait' : ''}`}
            >
              {loading ? 'Генерирую PDF...' : 'Создать PDF'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors text-sm"
            >
              ✕
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[9px] uppercase tracking-[0.2em] font-black hover:bg-[#D4AF37]/15 transition-all"
    >
      <Lock size={11} /> Получить PDF разбор
    </button>
  );
}

// ─── ShareButton ─────────────────────────────────────────────────────────────

function ShareButton({ birthDate, matrixData, formatDate }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://numeros.app';
  const shareText = `Моя матрица Пифагора (${formatDate(birthDate)}): Характер ${matrixData.char.v}, Удача ${matrixData.luck.v}, Долг ${matrixData.duty.v}, Интерес ${matrixData.interest.v}. Рассчитайте свою на Numeros!`;

  // Захватить скриншот матрицы
  const captureMatrix = async () => {
    setCapturing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const el = document.getElementById('matrix-capture-zone');
      if (!el) throw new Error('Элемент не найден');

      const canvas = await html2canvas(el, {
        backgroundColor: '#08090D',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      return canvas;
    } finally {
      setCapturing(false);
    }
  };

  // Скачать как изображение
  const handleDownload = async () => {
    setOpen(false);
    const canvas = await captureMatrix();
    const link = document.createElement('a');
    link.download = `numeros-matrix-${formatDate(birthDate)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Поделиться через Web Share API с изображением (мобильные)
  const handleShareImage = async () => {
    setOpen(false);
    const canvas = await captureMatrix();
    canvas.toBlob(async (blob) => {
      const file = new File([blob], `numeros-${formatDate(birthDate)}.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Моя матрица Пифагора', text: shareText });
          return;
        } catch { /* отменено */ }
      }
      // fallback — скачать
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `numeros-${formatDate(birthDate)}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  const networks = [
    {
      label: 'Telegram',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.43 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.718.942z"/></svg>,
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      label: 'WhatsApp',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.85L.057 23.428a.5.5 0 0 0 .614.614l5.579-1.464A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.886 9.886 0 0 1-5.031-1.371l-.36-.214-3.733.979.997-3.645-.234-.374A9.863 9.863 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1S21.9 6.533 21.9 12 17.467 21.9 12 21.9z"/></svg>,
      href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        disabled={capturing}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-[9px] uppercase tracking-[0.25em] font-black transition-all disabled:opacity-50"
      >
        <Share2 size={11} />
        {capturing ? 'Захват...' : 'Поделиться'}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-[#0D0E14] border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50 min-w-[180px]">

            {/* Поделиться картинкой */}
            <button
              onClick={handleShareImage}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-gray-300 hover:text-white text-sm font-bold"
            >
              <Share2 size={15} className="text-[#D4AF37]" />
              Поделиться картинкой
            </button>

            {/* Скачать */}
            <button
              onClick={handleDownload}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-gray-300 hover:text-white text-sm font-bold"
            >
              <Copy size={15} />
              Сохранить в галерею
            </button>

            {/* Разделитель */}
            <div className="border-t border-white/5 my-1" />

            {/* Соцсети */}
            {networks.map((n) => (
              <a key={n.label} href={n.href} target="_blank" rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-gray-300 hover:text-white text-sm font-bold"
              >
                {n.icon} {n.label}
              </a>
            ))}

            {/* Копировать ссылку */}
            <div className="border-t border-white/5 mt-1 pt-1">
              <button onClick={handleCopy}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-gray-300 hover:text-white text-sm font-bold"
              >
                {copied ? <Check size={15} className="text-[#D4AF37]" /> : <Copy size={15} />}
                {copied ? 'Скопировано!' : 'Копировать ссылку'}
              </button>
            </div>
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
          <Link href="/compatibility" className="hover:text-[#D4AF37] transition-colors normal-case">
            Совместимость
          </Link>
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
          <Link
            href="/compatibility"
            onClick={() => setIsMenuOpen(false)}
            className="text-left text-sm uppercase tracking-[0.2em] font-bold text-gray-300 hover:text-[#D4AF37] transition-colors"
          >
            Совместимость
          </Link>
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

export default function NumerosApp() {
  const [view, setView] = useState('landing');
  const [birthDate, setBirthDate] = useState('');
  const [matrixData, setMatrixData] = useState(null);
  const [dateError, setDateError] = useState(false);
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
    </div>
  );
}
