import { ChargilyClient, verifySignature } from '@chargily/chargily-pay';
import { sheetSafe } from './_shared.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = process.env.CHARGILY_SECRET_KEY;
  if (!secret) {
    console.error('CHARGILY_SECRET_KEY is not set');
    return res.status(500).end();
  }

  // ── 1. Verify the signature so we know this is really from Chargily ──
  const signature = req.headers['signature'] || '';
  
  // We need the raw body as a Buffer for signature verification
  let rawBody;
  if (Buffer.isBuffer(req.body)) {
    rawBody = req.body;
  } else if (typeof req.body === 'string') {
    rawBody = Buffer.from(req.body);
  } else {
    rawBody = Buffer.from(JSON.stringify(req.body));
  }

  try {
    if (!verifySignature(rawBody, signature, secret)) {
      console.warn('Invalid Chargily webhook signature');
      return res.status(403).json({ error: 'Invalid signature' });
    }
  } catch (e) {
    console.error('Signature verification error:', e.message);
    return res.status(403).json({ error: 'Signature error' });
  }

  // ── 2. Parse the event ──
  let event;
  try {
    event = typeof req.body === 'object' ? req.body : JSON.parse(req.body.toString());
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  console.log('Chargily webhook event type:', event.type);

  // ── 3. Only act on successful payments ──
  if (event.type !== 'checkout.paid') {
    return res.status(200).json({ received: true });
  }

  const checkout = event.data;
  const meta = checkout.metadata || {};

  // ── 4. Save the confirmed booking to Google Sheets ──
  const scriptUrl = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzBWQDjQaCv5Ux0cr2nYaV-Cx-HzDm3wZRJKQJhY7FDcHH1GsCg6j90IE3meRNURXjpCw/exec';

  const rowData = {
    action: 'book',
    Date: new Date().toLocaleDateString('fr-FR'),
    Nom:          sheetSafe(meta.customerName  || ''),
    Téléphone:    sheetSafe(meta.customerPhone || ''),
    Sexe:         sheetSafe(meta.customerGender || ''),
    GroupeSanguin:sheetSafe(meta.bloodGroup    || ''),
    DateNaissance:sheetSafe(meta.birthdate     || ''),
    Abonnement:   sheetSafe(meta.planName      || ''),
    Durée:        sheetSafe(meta.planFrequency ? `${meta.planFrequency} - ${meta.months} mois` : ''),
    Séances:      sheetSafe(meta.planSessions  || ''),
    Tarif:        `${meta.amountPaid || checkout.amount} DA`,
    Statut:       '✅ Payé via Chargily'
  };

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rowData)
    });

    if (!response.ok) {
      throw new Error(`Apps Script error: ${response.status}`);
    }

    console.log('Booking saved to Google Sheet after Chargily payment:', meta.customerName);

    // Increment discount code usage if one was applied
    if (meta.discountRowIdx) {
      await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'incrementUse', rowIdx: Number(meta.discountRowIdx) })
      });
    }

  } catch (err) {
    console.error('Failed to save booking to Google Sheet:', err.message);
    // Still return 200 so Chargily doesn't keep retrying
  }

  return res.status(200).json({ received: true });
}
