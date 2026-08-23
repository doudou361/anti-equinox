import crypto from 'crypto';

export default async function handler(req, res) {
  // Strict auth check via cryptographically signed session token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [payload, signature] = decoded.split('|');
    const [email, expires] = payload.split(':');
    
    if (Date.now() > Number(expires)) {
      return res.status(401).json({ error: 'Session expirée' });
    }

    const secret = process.env.SLICKPAY_SECRET_KEY || 'equinox-secure-fallback';
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    
    if (expectedSig !== signature) {
      return res.status(401).json({ error: 'Signature invalide' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Jeton invalide' });
  }

  const scriptUrl = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbwebJUzCgPul04E6z3NqZj9_EYVIH9SyGCEFa2NN9_gXqdsT_CcGaP-JEVcs_gD0PGx/exec';

  try {
    if (req.method === 'GET') {
      // Fetch all codes
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getCodes' })
      });
      const data = await response.json();
      return res.status(200).json(data);
    } 
    
    if (req.method === 'POST') {
      // Create a code
      const { code, discount, maxUses, expiry } = req.body;
      if (!code || !discount) return res.status(400).json({ error: 'Code et réduction requis' });

      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createCode', code, discount, maxUses, expiry })
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      // Toggle a code's status
      const { rowIdx } = req.body;
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleCode', rowIdx })
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      // Delete a code
      const { rowIdx } = req.body;
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteCode', rowIdx })
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin codes error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
