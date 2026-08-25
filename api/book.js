// Updated logic to run Sheet save and SlickPay invoice creation in parallel for speed!
import { parseBooking, sheetSafe } from './_shared.js';

async function createSlickPayInvoice({ publicKey, sandbox, amount, planName, customerName, customerPhone, backUrl, webhookUrl }) {
  const base = sandbox
    ? 'https://devapi.slick-pay.com/api/v2'
    : 'https://prodapi.slick-pay.com/api/v2';

  const nameParts = (customerName || 'Client').trim().split(' ');
  const firstname = nameParts[0] || 'Client';
  const lastname  = nameParts.slice(1).join(' ') || 'Equinox';

  const payload = {
    amount,
    firstname,
    lastname,
    address:     'Algérie',
    phone:       customerPhone || '0000000000',
    email:       'client@equinoxsportclub.com',
    url:         backUrl,
    webhook_url: webhookUrl,
    items: [{ name: planName, price: amount, quantity: 1 }],
  };

  const res = await fetch(`${base}/users/invoices`, {
    method: 'POST',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${publicKey}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`SlickPay API error (${res.status}): ${text}`);
  let json;
  try { json = JSON.parse(text); } catch { json = {}; }
  return json;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const parsed = parseBooking(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  let booking = parsed.booking;

  const scriptUrl = process.env.APPS_SCRIPT_URL ||
    'https://script.google.com/macros/s/AKfycbwebJUzCgPul04E6z3NqZj9_EYVIH9SyGCEFa2NN9_gXqdsT_CcGaP-JEVcs_gD0PGx/exec';

  try {
    let discountRowIdx = null;
    
    // 1. Discount Validation (Must remain sequential as it alters the price)
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

    const rowData = {
      action:        'book',
      Date:          new Date().toLocaleDateString('fr-FR'),
      Nom:           sheetSafe(booking.fullName),
      Téléphone:     "'" + sheetSafe(booking.phone),
      Sexe:          sheetSafe(booking.gender),
      GroupeSanguin: sheetSafe(booking.bloodGroup  || ''),
      DateNaissance: sheetSafe(booking.birthdate   || ''),
      Abonnement:    sheetSafe(booking.planName),
      Durée:         sheetSafe(`${booking.planFrequency} - ${booking.months} mois`),
      Séances:       sheetSafe(booking.planSessions),
      Tarif:         `${booking.total} DA`,
      Statut:        'Réservé (Non Payé)',
    };

    const slickPayKey = process.env.SLICKPAY_PUBLIC_KEY;
    const sandbox     = process.env.SLICKPAY_SANDBOX === 'true';
    const origin      = process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`;

    // 2. PARALLEL EXECUTION: Fire both Sheets Save and SlickPay Invoice simultaneously!
    const sheetPromise = fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rowData),
    }).catch(e => console.error('Sheet save failed:', e.message));

    // If discount was used, run the increment in parallel too
    const incrementPromise = discountRowIdx 
      ? fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'incrementUse', rowIdx: discountRowIdx }),
        }).catch(e => console.error('incrementUse failed:', e.message))
      : Promise.resolve();

    if (slickPayKey) {
      // Start SlickPay request
      const slickPromise = createSlickPayInvoice({
        publicKey:      slickPayKey,
        sandbox,
        amount:         booking.total,
        planName:       `Équinox - ${booking.planName}`,
        customerName:   booking.fullName,
        customerPhone:  booking.phone,
        backUrl:        `${origin}/success`,
        webhookUrl:     `${origin}/api/slickpay-webhook`,
      });

      // Await ONLY what we must (SlickPay invoice). Google Sheets runs silently in background!
      const invoice = await slickPromise;
      if (!invoice.url && !invoice.link) {
        throw new Error(`SlickPay did not return a payment URL. Response: ${JSON.stringify(invoice)}`);
      }
      
      return res.status(200).json({ url: invoice.url || invoice.link, type: 'slickpay' });
      
    } else {
      // Direct booking mode (wait for Sheets to finish just to be safe if no payment gateway)
      await Promise.all([sheetPromise, incrementPromise]);
      return res.status(200).json({ success: true, type: 'direct' });
    }
  } catch (error) {
    console.error('Booking Error:', error);
    return res.status(500).json({ error: 'An error occurred while processing the booking.' });
  }
}
