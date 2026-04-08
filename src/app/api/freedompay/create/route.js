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

    // Custom params forwarded by FreedomPay to pg_result_url webhook
    const customParams = {
      product_type:   type,
      user_email:     email,
      user_name:      name      ?? '',
      user_birthdate: birthDate ?? '',
      ...(type === 'compatibility' && {
        user_name2: name2 ?? '',
        user_date2: date2 ?? '',
      }),
    };

    const redirectUrl = buildFreedomPayUrl({
      orderId,
      amount,
      currency:    'KZT',
      description,
      successUrl:  `${successBase}?payment=ok`,
      failureUrl:  `${successBase}?payment=fail`,
      resultUrl:   `${siteUrl}/api/freedompay/result`,
      userEmail:   email,
      customParams,
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
