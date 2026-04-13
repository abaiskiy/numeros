'use client';

import { Lock, ShieldCheck } from 'lucide-react';

/**
 * Trust row under pay CTA: FreedomPay redirect + SSL + card brands (text labels).
 */
export default function PaymentTrustBadges({ accent = 'gold' }) {
  const accentColor = accent === 'rose' ? 'text-rose-400/90' : 'text-[#D4AF37]/90';
  const borderGlow = accent === 'rose' ? 'border-rose-500/15' : 'border-[#D4AF37]/12';

  return (
    <div
      className={`mt-3 rounded-xl border ${borderGlow} bg-white/[0.02] px-3 py-3 space-y-2.5`}
      role="note"
    >
      <div className="flex items-start justify-center gap-2 text-center">
        <Lock size={13} className={`shrink-0 mt-0.5 ${accentColor}`} aria-hidden />
        <p className="text-[10px] text-gray-400 leading-snug">
          Оплата проходит на{' '}
          <span className="text-gray-300 font-semibold">защищённой странице FreedomPay</span>
          {' '}— данные карты не хранятся на numeros.kz
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase tracking-wide">
          <ShieldCheck size={12} className={accentColor} aria-hidden />
          SSL · 256-bit
        </span>
        <div className="hidden sm:block h-3 w-px bg-white/10" aria-hidden />
        <div className="flex items-center gap-1.5" aria-label="Принимаемые карты">
          {['Visa', 'Mastercard'].map((brand) => (
            <span
              key={brand}
              className="rounded-md border border-white/[0.08] bg-white/[0.05] px-2 py-0.5 text-[8px] font-black tracking-[0.12em] text-gray-400 uppercase"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
