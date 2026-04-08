'use client';

/**
 * Футер сайта: способы оплаты (Visa / Mastercard) + юридические документы + копирайт.
 * Логотипы в /public/payments/ (PNG с brand-гайдов / эквайера).
 */
const FOOTER_DOCS = {
  privacy:
    'https://drive.google.com/file/d/1AJXG0JNeG_q09ZNE4Q9CTlQawKgRtkWw/view', // Политика конфиденциальности
  offer:
    'https://drive.google.com/file/d/1FgsbI3OpL6HZtgl6oCFvPt6cJxR3nfMd/view', // Публичная оферта
  payment:
    'https://drive.google.com/file/d/1ue04Z5yARVH9_snQpWMsEaUBcsE2pxhM/view', // Описание процедуры оплаты
};

function docLinkProps(href) {
  const external = /^https?:\/\//i.test(href);
  return external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};
}

export default function SiteFooter({ separator = '•' }) {
  const linkSep = (
    <span className="text-gray-600 select-none" aria-hidden>
      {separator}
    </span>
  );

  return (
    <footer className="py-16 md:py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
          <img
            src="/payments/visa.png"
            alt="Принимаем к оплате Visa"
            className="h-6 md:h-7 w-auto opacity-85 hover:opacity-100 transition-opacity"
            loading="lazy"
            decoding="async"
          />
          <span className="inline-flex items-center justify-center rounded-md bg-white px-2.5 py-1.5">
            <img
              src="/payments/mastercard.png"
              alt="Принимаем к оплате Mastercard"
              className="h-8 md:h-9 w-auto"
              loading="lazy"
              decoding="async"
            />
          </span>
        </div>
        <nav
          aria-label="Юридические документы"
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center max-w-2xl text-xs sm:text-sm font-semibold text-gray-500"
        >
          <a
            href={FOOTER_DOCS.privacy}
            {...docLinkProps(FOOTER_DOCS.privacy)}
            className="hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            Политика конфиденциальности
          </a>
          {linkSep}
          <a
            href={FOOTER_DOCS.offer}
            {...docLinkProps(FOOTER_DOCS.offer)}
            className="hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            Публичная оферта
          </a>
          {linkSep}
          <a
            href={FOOTER_DOCS.payment}
            {...docLinkProps(FOOTER_DOCS.payment)}
            className="hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            Описание процедуры оплаты
          </a>
        </nav>
        <p className="text-center text-[10px] uppercase tracking-[0.35em] font-black text-gray-500 max-w-md">
          © 2026 NUMEROS {separator} Премиальный нумерологический сервис
        </p>
      </div>
    </footer>
  );
}
