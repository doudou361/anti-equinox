// Temporary debug endpoint — remove after testing
export default async function handler(req, res) {
  const publicKey = process.env.SLICKPAY_PUBLIC_KEY;
  const secretKey = process.env.SLICKPAY_SECRET_KEY;
  const sandbox   = process.env.SLICKPAY_SANDBOX === 'true';
  const base      = sandbox
    ? 'https://devapi.slick-pay.com/api/v2'
    : 'https://prodapi.slick-pay.com/api/v2';

  const testPayload = JSON.stringify({
    amount: 500,
    url:    'https://anti-equinox.vercel.app/success',
    items:  [{ name: 'Test', price: 500, quantity: 1 }],
  });

  const results = {};

  // Try all 4 combinations of key + endpoint
  const combos = [
    { label: 'publicKey + users/invoices',     key: publicKey, endpoint: `${base}/users/invoices` },
    { label: 'secretKey + users/invoices',     key: secretKey, endpoint: `${base}/users/invoices` },
    { label: 'publicKey + merchants/invoices', key: publicKey, endpoint: `${base}/merchants/invoices` },
    { label: 'secretKey + merchants/invoices', key: secretKey, endpoint: `${base}/merchants/invoices` },
  ];

  for (const combo of combos) {
    try {
      const r = await fetch(combo.endpoint, {
        method: 'POST',
        headers: {
          'Accept':        'application/json',
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${combo.key}`,
        },
        body: testPayload,
      });
      results[combo.label] = { status: r.status, body: await r.text() };
    } catch (e) {
      results[combo.label] = { error: e.message };
    }
  }

  return res.status(200).json({
    sandbox,
    publicKeyPreview: publicKey ? publicKey.slice(0, 14) + '...' : 'NOT SET',
    secretKeyPreview: secretKey ? secretKey.slice(0, 14) + '...' : 'NOT SET',
    results,
  });
}
