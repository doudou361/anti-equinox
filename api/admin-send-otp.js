import { Resend } from 'resend';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@equinoxsportclub.com'; // fallback for testing
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // Verify it's the admin
  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    // Return success to prevent email enumeration, but don't send email
    return res.status(200).json({ success: true });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Create a secure cryptographic signature of the OTP so we don't need to store it in memory
  // This solves the Vercel serverless memory loss issue securely!
  const secret = process.env.SLICKPAY_SECRET_KEY || 'equinox-secure-fallback';
  const hash = crypto.createHmac('sha256', secret)
                     .update(`${email.toLowerCase()}:${otp}:${expires}`)
                     .digest('hex');

  // If no Resend key (e.g. local testing), just print to console
  if (!RESEND_API_KEY) {
    console.log(`[TEST MODE] OTP for ${email} is: ${otp}`);
    return res.status(200).json({ success: true, testMode: true, hash, expires });
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: 'Equinox Admin <onboarding@resend.dev>', // Resend test domain
      to: email,
      subject: 'Code de connexion - Equinox Admin',
      html: `<div style="font-family:sans-serif;padding:20px;">
        <h2>Connexion Admin Equinox</h2>
        <p>Voici votre code d'accès à usage unique :</p>
        <h1 style="font-size:32px;letter-spacing:4px;color:#D8B06B;">${otp}</h1>
        <p>Ce code expire dans 10 minutes.</p>
      </div>`
    });

    // We send back the hash and expiry to the client. The client will send them back with the user's typed code.
    return res.status(200).json({ success: true, hash, expires });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
