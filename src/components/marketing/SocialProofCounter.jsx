'use client';

import { useCountUp } from './useCountUp';

export default function SocialProofCounter({
  target = 2140,
  accent = 'gold',
  label = 'разборов уже выдано',
  initials = ['А', 'О', 'Д', 'Ж'],
}) {
  const [count, ref] = useCountUp(target);
  const isRose = accent === 'rose';
  const from = isRose ? 'from-rose-400/35' : 'from-[#D4AF37]/30';
  const to = isRose ? 'to-rose-400/10' : 'to-[#D4AF37]/10';
  const text = isRose ? 'text-rose-400' : 'text-[#D4AF37]';
  const border = isRose ? 'border-rose-500/20' : 'border-white/[0.08]';

  return (
    <div
      ref={ref}
      className={`inline-flex items-center gap-3 bg-white/[0.04] border ${border} rounded-2xl px-5 py-3 mx-auto mt-2`}
    >
      <div className="flex -space-x-2">
        {initials.map((l, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-full bg-gradient-to-br ${from} ${to} border-2 border-[#0D0E14] flex items-center justify-center text-[10px] font-black ${text}`}
          >
            {l}
          </div>
        ))}
      </div>
      <div className="text-left">
        <span className="text-white font-black text-sm">{count.toLocaleString('ru-RU')}+</span>
        <span className="text-gray-400 text-xs ml-1.5">{label}</span>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
    </div>
  );
}
