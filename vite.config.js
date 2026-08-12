import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Simple Vite plugin to mock Vercel serverless functions locally
function vercelApiMock() {
  return {
    name: 'vercel-api-mock',
    configureServer(server) {
      server.middlewares.use('/api/book', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end('Method not allowed');
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        await new Promise(resolve => req.on('end', resolve));
        
        req.body = body ? JSON.parse(body) : {};
        
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        try {
          // Use ssrLoadModule so it processes the ES module correctly
          const module = await server.ssrLoadModule('/api/book.js');
          await module.default(req, res);
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: e.message });
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env variables into process.env so our backend code can see them locally
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env }

  return {
    plugins: [react(), vercelApiMock()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.js',
      include: ['src/**/*.test.{js,jsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{js,jsx}'],
        exclude: ['src/main.jsx', 'src/test/**', 'src/**/*.test.{js,jsx}'],
      },
    },
  }
})
