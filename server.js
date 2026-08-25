import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

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

// In-Memory Rate Limiter Map: IP -> { count, resetTime }
const rateLimitMap = new Map();

function rateLimit(req, res) {
  // Ignore static files, only limit API
  if (!req.url.startsWith('/api/')) return true;

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 20; // Max 20 API requests per minute per IP

  let record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    rateLimitMap.set(ip, record);
    return true;
  }

  record.count += 1;
  if (record.count > maxRequests) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Trop de requêtes. Veuillez patienter une minute.' }));
    return false;
  }
  return true;
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { 
      data += chunk;
      // Prevent massive payloads (e.g. 1MB max)
      if (data.length > 1e6) req.connection.destroy();
    });
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
  
  // Content Security Policy (Prevents XSS Injection Attacks)
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
}

(async () => {
  const handlers = {};
  for (const [route, file] of Object.entries(API_FILES)) {
    try {
      const mod = await import(file);
      handlers[route] = mod.default;
    } catch (err) {}
  }

  // Clean rate limit map every 5 minutes to avoid memory leaks
  setInterval(() => rateLimitMap.clear(), 5 * 60 * 1000);

  const server = http.createServer(async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    if (protocol === 'http' && !req.headers.host.includes('localhost')) {
      res.writeHead(301, { "Location": "https://" + req.headers.host + req.url });
      return res.end();
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    setSecHeaders(res);
    attachHelpers(res);

    // Rate Limiting execution
    if (!rateLimit(req, res)) return;

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
    
    // Directory Traversal Prevention (Though URL parsing mostly handles this naturally)
    if (!filePath.startsWith(path.join(__dirname, 'dist'))) {
       return res.status(403).end('Forbidden');
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(__dirname, 'dist', 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    
    if (ext !== '.html') {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }

    const acceptEncoding = req.headers['accept-encoding'] || '';
    const isCompressible = ['.html', '.js', '.css', '.json', '.svg'].includes(ext);

    let stream = fs.createReadStream(filePath);
    stream.on('error', () => res.status(404).end('Not found'));

    if (isCompressible) {
      if (acceptEncoding.includes('br')) {
        res.setHeader('Content-Encoding', 'br');
        stream.pipe(zlib.createBrotliCompress()).pipe(res);
      } else if (acceptEncoding.includes('gzip')) {
        res.setHeader('Content-Encoding', 'gzip');
        stream.pipe(zlib.createGzip()).pipe(res);
      } else {
        stream.pipe(res);
      }
    } else {
      stream.pipe(res);
    }
  });

  server.listen(PORT, () => {
    console.log('Equinox secure server ready on port', PORT);
  });
})();
