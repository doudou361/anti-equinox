import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, code, hash, expires } = req.body;
  if (!email || !code || !hash || !expires) {
    return res.status(400).json({ error: 'Données manquantes (Email, code, ou signature)' });
  }

  // 1. Check expiration
  if (Date.now() > Number(expires)) {
    return res.status(400).json({ error: 'Le code a expiré' });
  }

  // 2. Reconstruct the hash and compare it
  const secret = process.env.SLICKPAY_SECRET_KEY || 'equinox-secure-fallback';
  const expectedHash = crypto.createHmac('sha256', secret)
                             .update(`${email.toLowerCase()}:${code}:${expires}`)
                             .digest('hex');

  if (expectedHash !== hash) {
    return res.status(400).json({ error: 'Code incorrect' });
  }

  // 3. Issue a simple session token
  // In a full app we'd use JWTs, but for this simple admin panel proxying to Sheets, this is sufficient.
  const token = Buffer.from(`${email}:${Date.now()}:admin-session`).toString('base64');

  return res.status(200).json({ success: true, token });
}
