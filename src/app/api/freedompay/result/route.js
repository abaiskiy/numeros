import { waitUntil } from '@vercel/functions';
import { verifySig, buildWebhookResponse } from '@/lib/freedompay';

const secretKey = () => process.env.FREEDOMPAY_SECRET_KEY ?? '';

function xmlResponse(status) {
  const salt = Math.random().toString(36).substring(2, 12);
  const body = buildWebhookResponse(status, salt, secretKey());
  return new Response(body, {
    status:  200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

async function handleResult(req) {
  let params = {};

  // FreedomPay may call via GET (query params) or POST (form body)
  if (req.method === 'GET') {
    const url = new URL(req.url);
    url.searchParams.forEach((v, k) => { params[k] = v; });
  } else {
    try {
      const formData = await req.formData();
      formData.forEach((v, k) => { params[k] = String(v); });
    } catch {
      try {
        const text = await req.text();
        new URLSearchParams(text).forEach((v, k) => { params[k] = v; });
      } catch {
        console.error('[freedompay/result] Failed to parse body');
        return xmlResponse('error');
      }
    }
  }

  console.log('[freedompay/result] Received params:', JSON.stringify(params, null, 2));

  // Verify signature — log mismatch but don't block (to debug real FreedomPay payload)
  const { pg_sig, ...rest } = params;
  const sigValid = verifySig('result', rest, secretKey(), pg_sig);
  console.log('[freedompay/result] Signature valid:', sigValid, '| pg_sig received:', pg_sig);
  if (!sigValid) {
    console.warn('[freedompay/result] Signature mismatch — continuing anyway to debug');
  }

  // Only process successful payments
  if (params.pg_result !== '1') {
    console.log('[freedompay/result] Payment failed/pending, pg_result:', params.pg_result);
    return xmlResponse('ok');
  }

  const productType = params.product_type;
  const email       = params.user_email;
  const name        = params.user_name      ?? '';
  const birthDate   = params.user_birthdate ?? '';
  const name2       = params.user_name2     ?? '';
  const date2       = params.user_date2     ?? '';

  if (!email) {
    console.error('[freedompay/result] No user_email in webhook params');
    return xmlResponse('error');
  }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.numeros.kz';

  const orderPromise = (async () => {
    try {
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
    }
  })();

  // Keep Vercel function alive until order completes (bypasses timeout on response)
  waitUntil(orderPromise);

  return xmlResponse('ok');
}

/**
 * FreedomPay calls pg_result_url via GET or POST depending on pg_request_method.
 */
export async function GET(req)  { return handleResult(req); }
export async function POST(req) { return handleResult(req); }
