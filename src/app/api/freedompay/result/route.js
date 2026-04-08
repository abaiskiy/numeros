import { NextResponse } from 'next/server';
import { verifySig, buildWebhookResponse } from '@/lib/freedompay';
import { getOrder } from '@/lib/orders-store';

const secretKey = () => process.env.FREEDOMPAY_SECRET_KEY ?? '';

function xmlResponse(status) {
  const salt = Math.random().toString(36).substring(2, 12);
  const body = buildWebhookResponse(status, salt, secretKey());
  return new Response(body, {
    status:  200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

/**
 * FreedomPay calls this URL (pg_result_url) after every payment attempt.
 * pg_result = '1' means success, '0' means failure.
 */
export async function POST(req) {
  let params = {};

  try {
    // FreedomPay sends application/x-www-form-urlencoded
    const formData = await req.formData();
    formData.forEach((v, k) => { params[k] = String(v); });
  } catch {
    console.error('[freedompay/result] Failed to parse body');
    return xmlResponse('error');
  }

  console.log('[freedompay/result] Received params:', JSON.stringify(params));

  // Verify signature
  const { pg_sig, ...rest } = params;
  if (!verifySig('payment_page', rest, secretKey(), pg_sig)) {
    console.warn('[freedompay/result] Invalid signature, ignoring');
    return xmlResponse('error');
  }

  // Only process successful payments
  if (params.pg_result !== '1') {
    console.log('[freedompay/result] Payment failed/pending, pg_result:', params.pg_result);
    return xmlResponse('ok');
  }

  const order = getOrder(params.pg_order_id);
  if (!order) {
    console.error('[freedompay/result] Order not found for pg_order_id:', params.pg_order_id);
    return xmlResponse('error');
  }

  const { type: productType, email, name, birthDate, name2, date2 } = order;

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://numeros.kz';

    if (productType === 'compatibility') {
      await fetch(`${siteUrl}/api/order-compatibility`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name1: name, date1: birthDate, name2, date2, email }),
      });
    } else {
      await fetch(`${siteUrl}/api/order`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, birthDate }),
      });
    }

    console.log('[freedompay/result] Order triggered for', email);
  } catch (err) {
    console.error('[freedompay/result] Order error:', err?.message);
    // Still return ok — FreedomPay should not retry infinitely
  }

  return xmlResponse('ok');
}
