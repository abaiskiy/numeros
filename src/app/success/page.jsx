'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const GA4_ID = 'G-LZ9BTNENXY';

const PRODUCTS = {
  numerology: {
    name: 'Персональный нумерологический разбор',
    value: 3990,
    home: '/',
  },
  compatibility: {
    name: 'Разбор совместимости',
    value: 2990,
    home: '/compatibility',
  },
};

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const type = params.get('type') ?? 'numerology';
  const product = PRODUCTS[type] ?? PRODUCTS.numerology;

  useEffect(() => {
    const payload = {
      transaction_id: `fp-${Date.now()}`,
      value: product.value,
      currency: 'KZT',
      items: [{ item_id: type, item_name: product.name, price: product.value, quantity: 1 }],
    };

    const fireEvent = () => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'purchase', payload);
      } else {
        // gtag ещё не загрузился — пушим напрямую в dataLayer
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'purchase', ...payload });
      }
    };

    // Даём gtag ~800ms на загрузку, затем стреляем в любом случае
    const timer = setTimeout(fireEvent, 800);
    return () => clearTimeout(timer);
  }, [type, product]);

  return (
    <div className="min-h-screen bg-[#0D0E14] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✓</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold mb-3">Оплата прошла успешно</h1>
        <p className="text-gray-400 text-sm mb-2">
          Ваш PDF-разбор уже готовится. Это займёт около 2–5 минут.
        </p>
        <p className="text-gray-500 text-xs mb-10">
          Мы отправим его на вашу почту — проверьте входящие и папку «Спам».
        </p>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-8 text-left">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Ваш заказ</p>
          <p className="text-white font-bold text-sm">{product.name}</p>
          <p className="text-[#D4AF37] font-black mt-1">{product.value.toLocaleString('ru-RU')} ₸</p>
        </div>

        <Link
          href={product.home}
          className="inline-flex items-center justify-center bg-[#D4AF37] text-black font-black uppercase text-[11px] tracking-[0.2em] px-8 py-4 rounded-2xl hover:bg-white transition-colors"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
