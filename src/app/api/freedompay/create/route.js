import { NextResponse } from 'next/server';
import { buildFreedomPayUrl } from '@/lib/freedompay';
import { saveOrder } from '@/lib/orders-store';

const PRICES = {
  numerology:    3990,
  compatibility: 2990,
};

const DESCRIPTIONS = {
  numerology:    'Персональный нумерологический разбор (NUMEROS)',
  compatibility: 'Разбор совместимости (NUMEROS)',
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { type = 'numerology', name, email, birthDate, name2, date2 } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email обязателен' }, { status: 400 });
    }

    const amount      = PRICES[type] ?? PRICES.numerology;
    const description = DESCRIPTIONS[type] ?? DESCRIPTIONS.numerology;
    // Use a short numeric order ID (FreedomPay may cap at 32-bit int)
    const orderId     = String(Math.floor(Math.random() * 9000000) + 1000000);
    const siteUrl     = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://numeros.kz';
    const isLocal     = siteUrl.includes('localhost');
    const isTest      = process.env.NODE_ENV !== 'production';

    const successBase = type === 'compatibility' ? `${siteUrl}/compatibility` : siteUrl;

    // Store order data server-side — NOT passed in URL to avoid FreedomPay issues
    saveOrder(orderId, { type, email, name: name ?? '', birthDate: birthDate ?? '', name2: name2 ?? '', date2: date2 ?? '' });

    // Build payment.php redirect URL — only pg_* params, no custom params
    const redirectUrl = buildFreedomPayUrl({
      orderId,
      amount,
      currency:    'KZT',
      description,
      successUrl:  isLocal ? undefined : `${successBase}?payment=ok`,
      failureUrl:  isLocal ? undefined : `${successBase}?payment=fail`,
      resultUrl:   isLocal ? undefined : `${siteUrl}/api/freedompay/result`,
      userEmail:   email,
    });

    console.log('[freedompay/create] orderId:', orderId, 'redirectUrl built');
    return NextResponse.json({ redirectUrl, orderId });
  } catch (err) {
    console.error('[freedompay/create] ERROR:', err?.message);
    return NextResponse.json(
      { error: err?.message || 'Не удалось создать платёж. Попробуйте позже.' },
      { status: 500 },
    );
  }
}
