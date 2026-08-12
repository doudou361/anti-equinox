import { GoogleSpreadsheet } from 'google-spreadsheet';
import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData, planData, selectedDate, selectedTime } = req.body;

    // Ensure we have Google credentials configured
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      console.warn("Missing Google Sheets credentials in environment variables. Simulating success for UI testing.");
      
      // Simulate network delay for realistic UI loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return res.status(200).json({ success: true, type: 'simulated' });
    }

    // Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (stripeKey) {
      // ── STRIPE PIPELINE ──
      const stripe = new Stripe(stripeKey);
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'dzd',
              product_data: {
                name: `Abonnement Équinox: ${planData.name}`,
                description: `${planData.frequency} - ${planData.sessions}`,
              },
              unit_amount: planData.monthlyRate * 100, // Stripe expects amounts in the smallest currency unit
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel`,
        metadata: {
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerGender: formData.gender,
          planName: planData.name,
          planFrequency: planData.frequency,
          planSessions: planData.sessions,
          amountPaid: planData.monthlyRate.toString(),
          date: selectedDate || '',
          time: selectedTime || '',
        }
      });

      // Tell frontend to redirect to Stripe
      return res.status(200).json({ url: session.url, type: 'stripe' });

    } else {
      // ── DIRECT GOOGLE SHEETS PIPELINE (No Stripe) ──
      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
      
      await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        // Fix newline issues in private keys passed via env vars
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });

      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0]; // Assume first tab

      // Append row
      await sheet.addRow({
        Date: new Date().toLocaleDateString('fr-FR'),
        Nom: formData.fullName,
        Téléphone: formData.phone,
        Sexe: formData.gender,
        Abonnement: planData.name,
        Durée: planData.frequency,
        Séances: planData.sessions,
        Tarif: `${planData.monthlyRate} DA`,
        Statut: 'Réservé (Non Payé)'
      });

      // Tell frontend booking was successful directly
      return res.status(200).json({ success: true, type: 'direct' });
    }

  } catch (error) {
    console.error('Booking Error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred while processing the booking.' });
  }
}
