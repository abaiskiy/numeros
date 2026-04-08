'use client';

/**
 * Футер сайта: способы оплаты (Visa / Mastercard) + копирайт.
 * SVG в /public/payments/ можно заменить на официальные файлы от эквайера или с brand-центров карт.
 */
export default function SiteFooter({ separator = '•' }) {
  return (
    <footer className="py-16 md:py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
          <img
            src="/payments/visa.svg"
            alt="Принимаем к оплате Visa"
            className="h-5 md:h-6 w-auto opacity-75 hover:opacity-100 transition-opacity"
            width={72}
            height={22}
            loading="lazy"
          />
          <img
            src="/payments/mastercard.svg"
            alt="Принимаем к оплате Mastercard"
            className="h-7 md:h-8 w-auto opacity-90 hover:opacity-100 transition-opacity"
            width={48}
            height={32}
            loading="lazy"
          />
        </div>
        <p className="text-center text-[10px] uppercase tracking-[0.35em] font-black text-gray-500 max-w-md">
          © 2026 NUMEROS {separator} Премиальный нумерологический сервис
        </p>
      </div>
    </footer>
  );
}
