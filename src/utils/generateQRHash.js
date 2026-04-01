import crypto from "crypto";

/**
 * Generate the HMAC SHA512 hash required by ABA's generate-qr endpoint.
 *
 * ABA uses this hash to verify that the request came from a legitimate merchant
 * and that the payload was not tampered with in transit.
 *
 * Hash input: all fields concatenated in the exact order required by ABA docs.
 * The api_key (your ABA public key) is used as the HMAC secret — it is never
 * included in the final payload sent to ABA.
 *
 * @param {Object} params - Full params object required by ABA including api_key
 * @returns {string} Base64-encoded HMAC SHA512 hash
 */

export function generateAbaHash(params) {
  const safe = (v) => (v === null || v === undefined ? "" : v);

  // Destructure parameters
  const {
    req_time,
    merchant_id,
    tran_id,
    amount,
    items,
    first_name,
    last_name,
    email,
    phone,
    purchase_type,
    payment_option,
    callback_url,
    return_deeplink,
    currency,
    custom_fields,
    return_params,
    payout,
    lifetime,
    qr_image_template,
    api_key,
  } = params;

  // Concatenate all fields in the exact order required by ABA
  const data =
    safe(req_time) +
    safe(merchant_id) +
    safe(tran_id) +
    safe(amount) +
    safe(items) +
    safe(first_name) +
    safe(last_name) +
    safe(email) +
    safe(phone) +
    safe(purchase_type) +
    safe(payment_option) +
    safe(callback_url) +
    safe(return_deeplink) +
    safe(currency) +
    safe(custom_fields) +
    safe(return_params) +
    safe(payout) +
    safe(lifetime) +
    safe(qr_image_template);

  // Generate HMAC SHA512 and encode in Base64
  return crypto.createHmac("sha512", api_key).update(data).digest("base64");
}
