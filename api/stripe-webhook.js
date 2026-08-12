import Stripe from 'stripe';
import { GoogleSpreadsheet } from 'google-spreadsheet';

// Stripe requires the raw body to construct the event, so we disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to read raw body
async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.error("Missing Stripe keys.");
    return res.status(500).send('Webhook Error: Missing Stripe configuration');
  }

  const stripe = new Stripe(stripeKey);
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Retrieve metadata we passed during checkout creation
    const { 
      customerName, customerPhone, customerGender, 
      planName, planFrequency, planSessions, amountPaid,
      date, time
    } = session.metadata || {};

    try {
      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
      
      await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });

      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];

      await sheet.addRow({
        Date: new Date().toLocaleDateString('fr-FR'),
        Nom: customerName || 'Inconnu',
        Téléphone: customerPhone || 'Inconnu',
        Sexe: customerGender || 'Inconnu',
        Abonnement: planName || 'Inconnu',
        Durée: planFrequency || '-',
        Séances: planSessions || '-',
        Tarif: `${amountPaid || 0} DA`,
        Statut: 'Payé (Stripe)',
        StripeID: session.id
      });
      
      console.log('Successfully recorded paid booking in Google Sheets.');
    } catch (err) {
      console.error('Error saving to Google Sheets:', err);
      // Return 200 anyway so Stripe doesn't retry, or return 500 if we want retries.
      // We will return 500 to trigger a retry if Sheets API fails.
      return res.status(500).send('Sheets error');
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({received: true});
}
