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

  // 3. Issue a securely signed session token
  const payload = `${email.toLowerCase()}:${Date.now() + 24 * 60 * 60 * 1000}`; // 24 hours expiry
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const token = Buffer.from(`${payload}|${signature}`).toString('base64');

  return res.status(200).json({ success: true, token });
}
