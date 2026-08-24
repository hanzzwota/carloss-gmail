import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

// Server persistence middleware plugin for cross-device synchronization
function serverPersistencePlugin(): Plugin {
  const DATA_DIR = path.resolve(__dirname, 'data');
  const STATE_FILE = path.resolve(DATA_DIR, 'app_state.json');

  const ensureFileExists = () => {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (!fs.existsSync(STATE_FILE)) {
        fs.writeFileSync(STATE_FILE, JSON.stringify({}, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error('Error creating data directory/file:', e);
    }
  };

  const readState = () => {
    ensureFileExists();
    try {
      const content = fs.readFileSync(STATE_FILE, 'utf-8');
      return JSON.parse(content || '{}');
    } catch (e) {
      return {};
    }
  };

  const saveState = (data: any) => {
    ensureFileExists();
    try {
      fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('Error saving state:', e);
      return false;
    }
  };

  return {
    name: 'server-persistence-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = url.pathname;

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        // GET /api/state - Return current server state
        if (pathname === '/api/state' && req.method === 'GET') {
          const state = readState();
          res.statusCode = 200;
          return res.end(JSON.stringify(state));
        }

        // POST /api/sync - Save and synchronize state
        if (pathname === '/api/sync' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}');
              const currentState = readState();
              const merged = { ...currentState, ...payload, updatedAt: new Date().toISOString() };
              saveState(merged);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, state: merged }));
            } catch (err: any) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        // Default API fallback
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Endpoint not found' }));
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serverPersistencePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
