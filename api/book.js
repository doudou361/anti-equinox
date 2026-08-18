import { ChargilyClient } from '@chargily/chargily-pay';
import { parseBooking, sheetSafe } from './_shared.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = parseBooking(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  let booking = parsed.booking;

  const scriptUrl = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzBWQDjQaCv5Ux0cr2nYaV-Cx-HzDm3wZRJKQJhY7FDcHH1GsCg6j90IE3meRNURXjpCw/exec';

  try {
    // ── DISCOUNT VALIDATION ──
    let discountRowIdx = null;
    if (booking.discountCode) {
      const getCodesRes = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getCodes' })
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

    const chargilyKey = process.env.CHARGILY_SECRET_KEY;

    if (chargilyKey) {
      // ── CHARGILY PAY PIPELINE ──
      const client = new ChargilyClient({
        api_key: chargilyKey,
        mode: chargilyKey.startsWith('test_') ? 'test' : 'live',
      });

      const origin = process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`;

      const checkout = await client.createCheckout({
        amount: booking.total,
        currency: 'dzd',
        payment_method: 'edahabia', // supports CIB + Dahabia + BaridiMob
        success_url: `${origin}/success`,
        failure_url: `${origin}/cancel`,
        webhook_endpoint: `${origin}/api/chargily-webhook`,
        description: `Abonnement Équinox: ${booking.planName}`,
        locale: 'fr',
        metadata: {
          customerName:   booking.fullName,
          customerPhone:  booking.phone,
          customerGender: booking.gender,
          bloodGroup:     booking.bloodGroup     || '',
          birthdate:      booking.birthdate      || '',
          planName:       booking.planName,
          planFrequency:  booking.planFrequency,
          planSessions:   booking.planSessions,
          months:         String(booking.months),
          amountPaid:     String(booking.total),
          discountRowIdx: discountRowIdx ? String(discountRowIdx) : '',
        }
      });

      // ── Save booking to Google Sheets IMMEDIATELY with pending status ──
      // This ensures no lead is lost even if the user doesn't complete payment.
      const rowData = {
        action: 'book',
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
        Statut:        '⏳ En attente de paiement'
      };

      try {
        await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rowData)
        });
      } catch (sheetErr) {
        console.error('Failed to pre-save booking to sheet:', sheetErr.message);
        // Don't block — still redirect to Chargily
      }

      // Tell the frontend to redirect to Chargily's payment page
      return res.status(200).json({ url: checkout.checkout_url, type: 'chargily' });

    } else {
      // ── DIRECT GOOGLE SHEETS PIPELINE (no payment gateway configured) ──
      if (!scriptUrl) {
        console.warn('Missing APPS_SCRIPT_URL. Simulating success.');
        await new Promise(resolve => setTimeout(resolve, 800));
        return res.status(200).json({ success: true, type: 'simulated' });
      }

      const rowData = {
        action: 'book',
        Date:          new Date().toLocaleDateString('fr-FR'),
        Nom:           sheetSafe(booking.fullName),
        Téléphone:     sheetSafe(booking.phone),
        Sexe:          sheetSafe(booking.gender),
        GroupeSanguin: sheetSafe(booking.bloodGroup),
        DateNaissance: sheetSafe(booking.birthdate),
        Abonnement:    sheetSafe(booking.planName),
        Durée:         sheetSafe(`${booking.planFrequency} - ${booking.months} mois`),
        Séances:       sheetSafe(booking.planSessions),
        Tarif:         `${booking.total} DA`,
        Statut:        'Réservé (Non Payé)'
      };

      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData)
      });

      if (!response.ok) throw new Error('Apps Script returned an error status.');

      if (discountRowIdx) {
        await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'incrementUse', rowIdx: discountRowIdx })
        });
      }

      return res.status(200).json({ success: true, type: 'direct' });
    }

  } catch (error) {
    console.error('Booking Error:', error);
    return res.status(500).json({ error: 'An error occurred while processing the booking.' });
  }
}
