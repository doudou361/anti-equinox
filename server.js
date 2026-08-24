import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4':  'video/mp4',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ico':  'image/x-icon',
  '.webm': 'video/webm',
};

// -- API handler registry --
const API_FILES = {
  '/api/book':              './api/book.js',
  '/api/slickpay-webhook':  './api/slickpay-webhook.js',
  '/api/admin-login':       './api/admin-login.js',
  '/api/admin-codes':       './api/admin-codes.js',
  '/api/validate-discount': './api/validate-discount.js',
};

// Parse JSON body from request
function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { resolve({}); }
    });
  });
}

// Attach Express-compatible helpers to native res object
function attachHelpers(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json   = (obj)  => {
    if (!res.headersSent) res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
  };
  res.send   = (body) => res.end(body);
  return res;
}

// Set security headers
function setSecHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
}

// Boot: import all API handlers, then start server
(async () => {
  const handlers = {};
  for (const [route, file] of Object.entries(API_FILES)) {
    try {
      const mod = await import(file);
      handlers[route] = mod.default;
      console.log('Loaded handler:', route);
    } catch (err) {
      console.error('Failed to load handler', route, err.message);
    }
  }

  const server = http.createServer(async (req, res) => {
    const url   = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    setSecHeaders(res);
    attachHelpers(res);

    // -- API routing --
    if (pathname.startsWith('/api/')) {
      const handler = handlers[pathname];
      if (!handler) {
        res.statusCode = 404;
        return res.json({ error: 'API route not found' });
      }
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        req.body = await readBody(req);
      } else {
        req.body = {};
      }
      try {
        await handler(req, res);
      } catch (err) {
        console.error('Handler error:', err);
        res.statusCode = 500;
        res.json({ error: 'Internal server error' });
      }
      return;
    }

    // -- Static files from dist/ --
    let filePath = path.join(__dirname, 'dist', pathname === '/' ? 'index.html' : pathname);

    // SPA fallback: non-existent paths -> index.html
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(__dirname, 'dist', 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      res.statusCode = 404;
      res.end('Not found');
    });
    stream.pipe(res);
  });

  server.listen(PORT, () => {
    console.log('Equinox Sports Club server running on port', PORT);
    console.log('Public URL:', process.env.PUBLIC_BASE_URL || 'not set');
  });
})();
