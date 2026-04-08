import { createHash } from 'crypto';

/**
 * FreedomPay signature algorithm:
 * MD5( scriptName ; ALL_sorted_param_values... ; secretKey )
 *
 * ALL parameters (including custom non-pg_ ones) participate in the
 * signature, sorted alphabetically by key name. Only pg_sig is excluded.
 */
export function computeSig(scriptName, params, secretKey) {
  const sortedValues = Object.keys(params)
    .filter((k) => k !== 'pg_sig')
    .sort()
    .map((k) => String(params[k] ?? ''));

  const str = [scriptName, ...sortedValues, secretKey].join(';');
  console.log('[FreedomPay] Sig string:', str);
  return createHash('md5').update(str).digest('hex');
}

export function verifySig(scriptName, params, secretKey, expectedSig) {
  return computeSig(scriptName, params, secretKey) === expectedSig;
}

/**
 * Builds a FreedomPay payment.php redirect URL.
 * No server-to-server request — the user's browser is redirected directly.
 */
export function buildFreedomPayUrl({
  orderId,
  amount,
  currency = 'KZT',
  description,
  successUrl,
  failureUrl,
  resultUrl,
  userEmail,
  customParams = {},
}) {
  const merchantId = process.env.FREEDOMPAY_MERCHANT_ID;
  const secretKey  = process.env.FREEDOMPAY_SECRET_KEY;

  if (!merchantId || !secretKey) {
    throw new Error('FreedomPay credentials not configured in environment');
  }

  const salt = Math.random().toString(36).substring(2, 14);

  const params = {
    pg_merchant_id:    merchantId,
    pg_order_id:       String(orderId),
    pg_amount:         String(amount),
    pg_currency:       currency,
    pg_description:    description,
    pg_salt:           salt,
    pg_language:       'ru',
    ...(successUrl && { pg_success_url: successUrl }),
    ...(failureUrl && { pg_failure_url: failureUrl }),
    ...(resultUrl  && { pg_result_url:  resultUrl  }),
    ...(userEmail  && { pg_user_contact_email: userEmail }),
    ...customParams,
  };

  params.pg_sig = computeSig('payment.php', params, secretKey);

  console.log('[FreedomPay] Redirect params:', JSON.stringify(params, null, 2));

  const query = new URLSearchParams(params).toString();
  return `https://api.freedompay.kz/payment.php?${query}`;
}

/**
 * Builds the XML response body that FreedomPay expects from our webhook.
 */
export function buildWebhookResponse(status, salt, secretKey) {
  const params = { pg_salt: salt, pg_status: status };
  const sig = computeSig('payment_page', params, secretKey);
  return `<?xml version="1.0" encoding="utf-8"?>\n<response>\n  <pg_status>${status}</pg_status>\n  <pg_salt>${salt}</pg_salt>\n  <pg_sig>${sig}</pg_sig>\n</response>`;
}
