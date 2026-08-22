export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });

  const scriptUrl = process.env.APPS_SCRIPT_URL || 
    'https://script.google.com/macros/s/AKfycbwebJUzCgPul04E6z3NqZj9_EYVIH9SyGCEFa2NN9_gXqdsT_CcGaP-JEVcs_gD0PGx/exec';
  
  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getCodes' })
    });
    
    if (!response.ok) throw new Error('Failed to fetch codes');
    
    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    const match = data.codes.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!match) return res.status(404).json({ error: 'Code invalide' });
    if (match.active !== 'YES') return res.status(400).json({ error: 'Code expiré ou inactif' });
    if (Number(match.timesUsed) >= Number(match.maxUses)) return res.status(400).json({ error: 'Limite d\'utilisation atteinte' });
    
    // Check expiry
    if (match.expiry) {
      // Expects DD/MM/YYYY
      const parts = match.expiry.split('/');
      if (parts.length === 3) {
        const expiryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T23:59:59`);
        if (new Date() > expiryDate) {
          return res.status(400).json({ error: 'Code expiré' });
        }
      }
    }

    return res.status(200).json({ success: true, discount: match.discount, rowIdx: match.rowIdx });

  } catch (error) {
    console.error('Validate discount error:', error);
    return res.status(500).json({ error: 'Erreur de validation' });
  }
}
