// Temporary debug endpoint — remove after testing
export default async function handler(req, res) {
  const publicKey = process.env.SLICKPAY_PUBLIC_KEY;
  const sandbox   = process.env.SLICKPAY_SANDBOX === 'true';

  if (!publicKey) {
    return res.status(200).json({ error: 'SLICKPAY_PUBLIC_KEY not set', env: Object.keys(process.env).filter(k => k.includes('SLICK')) });
  }

  const base = sandbox
    ? 'https://devapi.slick-pay.com/api/v2'
    : 'https://prodapi.slick-pay.com/api/v2';

  // Try the users/invoices endpoint
  try {
    const r1 = await fetch(`${base}/users/invoices`, {
      method: 'POST',
      headers: {
        'Accept':        'application/json',
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${publicKey}`,
      },
      body: JSON.stringify({
        amount: 500,
        url:    'https://anti-equinox.vercel.app/success',
        items:  [{ name: 'Test', price: 500, quantity: 1 }],
      }),
    });
    const text1 = await r1.text();
    return res.status(200).json({
      endpoint: `${base}/users/invoices`,
      status:   r1.status,
      response: text1,
      keyPreview: publicKey.slice(0, 12) + '...',
      sandbox,
    });
  } catch (e) {
    return res.status(200).json({ error: e.message });
  }
}
