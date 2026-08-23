import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { password } = req.body;
  
  // The actual password should be set in Vercel as ADMIN_PASSWORD. 
  // If not set, it defaults to 'EquinoxAdmin2024'
  const correctPassword = process.env.ADMIN_PASSWORD || 'EquinoxAdmin2024';

  if (!password || password !== correctPassword) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }

  // Issue a securely signed session token
  const secret = process.env.SLICKPAY_SECRET_KEY || 'equinox-secure-fallback';
  const payload = `admin:${Date.now() + 24 * 60 * 60 * 1000}`; // 24 hours expiry
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const token = Buffer.from(`${payload}|${signature}`).toString('base64');

  return res.status(200).json({ success: true, token });
}
