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

const API_FILES = {
  '/api/book':              './api/book.js',
  '/api/slickpay-webhook':  './api/slickpay-webhook.js',
  '/api/admin-login':       './api/admin-login.js',
  '/api/admin-codes':       './api/admin-codes.js',
  '/api/validate-discount': './api/validate-discount.js',
};

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

function attachHelpers(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json   = (obj)  => {
    if (!res.headersSent) res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
  };
  res.send   = (body) => res.end(body);
  return res;
}

function setSecHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
}

(async () => {
  const handlers = {};
  for (const [route, file] of Object.entries(API_FILES)) {
    try {
      const mod = await import(file);
      handlers[route] = mod.default;
    } catch (err) {}
  }

  const server = http.createServer(async (req, res) => {
    // 1. Force HTTPS Redirect (if coming from load balancer as http)
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    if (protocol === 'http' && !req.headers.host.includes('localhost')) {
      res.writeHead(301, { "Location": "https://" + req.headers.host + req.url });
      return res.end();
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    setSecHeaders(res);
    attachHelpers(res);

    if (pathname.startsWith('/api/')) {
      const handler = handlers[pathname];
      if (!handler) return res.status(404).json({ error: 'API route not found' });
      
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        req.body = await readBody(req);
      } else { req.body = {}; }
      
      try { await handler(req, res); } 
      catch (err) { res.status(500).json({ error: 'Internal server error' }); }
      return;
    }

    let filePath = path.join(__dirname, 'dist', pathname === '/' ? 'index.html' : pathname);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(__dirname, 'dist', 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    
    // 2. Add ultra-fast caching for static assets (images, videos, js, css)
    if (ext !== '.html') {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => res.status(404).end('Not found'));
    stream.pipe(res);
  });

  server.listen(PORT, () => {
    console.log('Equinox server ready on port', PORT);
  });
})();
