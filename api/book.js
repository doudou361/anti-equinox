import Stripe from 'stripe';
import { parseBooking, sheetSafe } from './_shared.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = parseBooking(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  const booking = parsed.booking;

  try {
    // In production, we don't need Google credentials here anymore since we use Apps Script webhook
    // We just check APPS_SCRIPT_URL in the branch below.

    // Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (stripeKey) {
      // ── STRIPE PIPELINE ──
      const stripe = new Stripe(stripeKey);

      const origin = process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'dzd',
              product_data: {
                name: `Abonnement Équinox: ${booking.planName}`,
                description: `${booking.planFrequency} - ${booking.planSessions} - ${booking.months} mois`,
              },
              unit_amount: booking.total * 100, // Stripe expects amounts in the smallest currency unit
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/success`,
        cancel_url: `${origin}/cancel`,
        metadata: {
          customerName: booking.fullName,
          customerPhone: booking.phone,
          customerGender: booking.gender,
          planName: booking.planName,
          planFrequency: booking.planFrequency,
          planSessions: booking.planSessions,
          months: String(booking.months),
          amountPaid: String(booking.total),
          date: booking.selectedDate,
          time: booking.selectedTime,
        }
      });

      // Tell frontend to redirect to Stripe
      return res.status(200).json({ url: session.url, type: 'stripe' });

    } else {
      // ── DIRECT GOOGLE SHEETS PIPELINE (Via Apps Script) ──
      const scriptUrl = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzBWQDjQaCv5Ux0cr2nYaV-Cx-HzDm3wZRJKQJhY7FDcHH1GsCg6j90IE3meRNURXjpCw/exec';

      if (!scriptUrl) {
        console.warn("Missing APPS_SCRIPT_URL. Simulating success.");
        await new Promise(resolve => setTimeout(resolve, 800));
        return res.status(200).json({ success: true, type: 'simulated' });
      }

      const rowData = {
        Date: new Date().toLocaleDateString('fr-FR'),
        Nom: sheetSafe(booking.fullName),
        Téléphone: sheetSafe(booking.phone),
        Sexe: sheetSafe(booking.gender),
        GroupeSanguin: sheetSafe(booking.bloodGroup),
        DateNaissance: sheetSafe(booking.birthdate),
        Abonnement: sheetSafe(booking.planName),
        Durée: sheetSafe(`${booking.planFrequency} - ${booking.months} mois`),
        Séances: sheetSafe(booking.planSessions),
        Tarif: `${booking.total} DA`,
        Statut: 'Réservé (Non Payé)'
      };

      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData)
      });

      if (!response.ok) {
        throw new Error('Apps Script returned an error status.');
      }

      // Tell frontend booking was successful directly
      return res.status(200).json({ success: true, type: 'direct' });
    }

  } catch (error) {
    console.error('Booking Error:', error);
    return res.status(500).json({ error: 'An error occurred while processing the booking.' });
  }
}
