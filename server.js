import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Headers (replaces vercel.json headers)
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob:; " +
    "media-src 'self' blob:; " +
    "connect-src 'self' https://prodapi.slick-pay.com https://devapi.slick-pay.com https://script.google.com; " +
    "frame-src 'self' https://www.google.com https://maps.google.com https://slick-pay.com; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self' https://slick-pay.com; " +
    "object-src 'none'; " +
    "upgrade-insecure-requests"
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// API Routes — dynamically import each handler (Vercel-style handler functions)
const apiRoutes = [
  { path: '/api/book',              file: './api/book.js' },
  { path: '/api/slickpay-webhook',  file: './api/slickpay-webhook.js' },
  { path: '/api/admin-login',       file: './api/admin-login.js' },
  { path: '/api/admin-codes',       file: './api/admin-codes.js' },
  { path: '/api/validate-discount', file: './api/validate-discount.js' },
];

for (const route of apiRoutes) {
  const mod = await import(route.file);
  app.all(route.path, (req, res) => mod.default(req, res));
}

// Static files (built React app)
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: all non-API routes go to index.html (React handles routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Equinox Sports Club server running on port ${PORT}`);
  console.log(`Public URL: ${process.env.PUBLIC_BASE_URL || 'not set'}`);
});
