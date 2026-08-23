import { sheetSafe } from './_shared.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // ── 1. Parse the incoming webhook payload from SlickPay ──────────────────
  let event;
  try {
    event = typeof req.body === 'object' ? req.body : JSON.parse(req.body.toString());
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // ── 2. Signature verification using our Secret Key ──────────────
  const secretKey = process.env.SLICKPAY_SECRET_KEY;
  if (secretKey) {
    // If a secret key is configured, it MUST be present and match exactly.
    // (This prevents an attacker from bypassing the check by simply omitting the field)
    if (!event.secret || event.secret !== secretKey) {
      console.warn('SlickPay webhook: secret key missing or mismatch — forgery attempt blocked');
      return res.status(403).json({ error: 'Invalid secret or signature' });
    }
  }

  console.log('SlickPay webhook received:', JSON.stringify(event));

  // ── 3. Only act on confirmed payments ─────────────────────────────────────
  // SlickPay sends status: "paid" or "cancelled" etc.
  const status = (event.status || event.payment_status || '').toLowerCase();
  if (status !== 'paid' && status !== 'payment_confirmed') {
    console.log('SlickPay webhook: payment not confirmed yet, status:', status);
    return res.status(200).json({ received: true });
  }

  // ── 4. Update the Google Sheet row from ⏳ to ✅ ─────────────────────────
  // We find the matching booking by phone + amount and update the status.
  const scriptUrl = process.env.APPS_SCRIPT_URL ||
    'https://script.google.com/macros/s/AKfycbwebJUzCgPul04E6z3NqZj9_EYVIH9SyGCEFa2NN9_gXqdsT_CcGaP-JEVcs_gD0PGx/exec';

  try {
    // Update the most recent pending booking to "Payé"
    // SlickPay webhook sends: order_id, amount, invoice_id, etc.
    const updatePayload = {
      action:   'updateStatus',
      orderId:  event.order_id   || event.invoice_id || '',
      amount:   event.amount     || '',
      statut:   'Réservé (Payé)',
    };

    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    });

    console.log('SlickPay payment confirmed and sheet updated:', event.order_id);
  } catch (err) {
    console.error('Failed to update sheet after SlickPay payment:', err.message);
    // Still return 200 so SlickPay doesn't keep retrying
  }

  return res.status(200).json({ received: true });
}
