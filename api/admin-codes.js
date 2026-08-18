export default async function handler(req, res) {
  // Simple auth check via header (the frontend sends the token we generated)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  const scriptUrl = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzBWQDjQaCv5Ux0cr2nYaV-Cx-HzDm3wZRJKQJhY7FDcHH1GsCg6j90IE3meRNURXjpCw/exec';

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
