import { parseBooking, sheetSafe } from './_shared.js';

// ── SlickPay REST API helper ───────────────────────────────────────────────────
// Using plain fetch — no extra SDK needed.
// Docs: https://prodapi.slick-pay.com/api/v2/merchants/invoices  (live)
//       https://devapi.slick-pay.com/api/v2/merchants/invoices   (sandbox)

async function createSlickPayInvoice({ publicKey, sandbox, amount, planName, customerName, customerPhone, backUrl, webhookUrl }) {
  const base = sandbox
    ? 'https://devapi.slick-pay.com/api/v2'
    : 'https://prodapi.slick-pay.com/api/v2';

  const payload = {
    name:        customerName,   // required: customer full name
    phone:       customerPhone,  // required: customer phone (or email)
    address:     'Algérie',      // required: address (using default)
    amount,
    url:         backUrl,
    webhook_url: webhookUrl,
    items: [
      {
        name:     planName,
        price:    amount,
        quantity: 1,
      }
    ],
  };

  console.log('SlickPay request →', `${base}/merchants/invoices`, JSON.stringify(payload));

  const res = await fetch(`${base}/merchants/invoices`, {
    method: 'POST',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${publicKey}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log('SlickPay response ←', res.status, text);

  if (!res.ok) {
    throw new Error(`SlickPay API error (${res.status}): ${text}`);
  }

  let json;
  try { json = JSON.parse(text); } catch { json = {}; }

  // SlickPay returns { ..., url: "https://slick-pay.com/pay/xxx" }
  return json;
}

// ── Main handler ──────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = parseBooking(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  let booking = parsed.booking;

  const scriptUrl = process.env.APPS_SCRIPT_URL ||
    'https://script.google.com/macros/s/AKfycbzBWQDjQaCv5Ux0cr2nYaV-Cx-HzDm3wZRJKQJhY7FDcHH1GsCg6j90IE3meRNURXjpCw/exec';

  try {
    // ── 1. DISCOUNT VALIDATION ──────────────────────────────────────────────
    let discountRowIdx = null;
    if (booking.discountCode) {
      const getCodesRes = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getCodes' }),
      });

      if (getCodesRes.ok) {
        const data = await getCodesRes.json();
        if (data.success && data.codes) {
          const match = data.codes.find(c => c.code.toUpperCase() === booking.discountCode);
          if (match && match.active === 'YES' && Number(match.timesUsed) < Number(match.maxUses)) {
            let isValid = true;
            if (match.expiry) {
              const parts = match.expiry.split('/');
              if (parts.length === 3) {
                const expiryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T23:59:59`);
                if (new Date() > expiryDate) isValid = false;
              }
            }
            if (isValid) {
              const discountPercent = Number(match.discount) || 0;
              booking.total = Math.round(booking.total * (1 - (discountPercent / 100)));
              booking.planName = `${booking.planName} (-${discountPercent}%)`;
              discountRowIdx = match.rowIdx;
            }
          }
        }
      }
    }

    // ── 2. PRE-SAVE to Google Sheets (captures the lead even if user doesn't pay) ──
    const rowData = {
      action:        'book',
      Date:          new Date().toLocaleDateString('fr-FR'),
      Nom:           sheetSafe(booking.fullName),
      Téléphone:     sheetSafe(booking.phone),
      Sexe:          sheetSafe(booking.gender),
      GroupeSanguin: sheetSafe(booking.bloodGroup  || ''),
      DateNaissance: sheetSafe(booking.birthdate   || ''),
      Abonnement:    sheetSafe(booking.planName),
      Durée:         sheetSafe(`${booking.planFrequency} - ${booking.months} mois`),
      Séances:       sheetSafe(booking.planSessions),
      Tarif:         `${booking.total} DA`,
      Statut:        '⏳ En attente de paiement',
    };

    try {
      await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData),
      });
    } catch (sheetErr) {
      console.error('Pre-save to sheet failed:', sheetErr.message);
      // Don't block — still proceed to payment
    }

    // ── 3. PAYMENT GATEWAY ──────────────────────────────────────────────────
    const slickPayKey = process.env.SLICKPAY_PUBLIC_KEY;
    const sandbox     = process.env.SLICKPAY_SANDBOX === 'true';
    const origin      = process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`;

    if (slickPayKey) {
      // ── SlickPay pipeline ──
      const invoice = await createSlickPayInvoice({
        publicKey:      slickPayKey,
        sandbox,
        amount:         booking.total,
        planName:       `Équinox — ${booking.planName}`,
        customerName:   booking.fullName,
        customerPhone:  booking.phone,
        backUrl:        `${origin}/success`,
        webhookUrl:     `${origin}/api/slickpay-webhook`,
      });

      if (!invoice.url && !invoice.link) {
        throw new Error(`SlickPay did not return a payment URL. Response: ${JSON.stringify(invoice)}`);
      }

      const paymentUrl = invoice.url || invoice.link;

      // Increment discount usage immediately
      if (discountRowIdx) {
        await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'incrementUse', rowIdx: discountRowIdx }),
        }).catch(e => console.error('incrementUse failed:', e.message));
      }

      // Redirect user to SlickPay hosted payment page
      return res.status(200).json({ url: paymentUrl, type: 'slickpay' });

    } else {
      // ── Direct Google Sheets pipeline (no payment gateway configured) ──
      if (discountRowIdx) {
        await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'incrementUse', rowIdx: discountRowIdx }),
        }).catch(e => console.error('incrementUse failed:', e.message));
      }

      return res.status(200).json({ success: true, type: 'direct' });
    }

  } catch (error) {
    console.error('Booking Error:', error);
    return res.status(500).json({ error: 'An error occurred while processing the booking.' });
  }
}
