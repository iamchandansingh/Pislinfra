import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { applyIncrementalSync } from './scripts/lib/incrementalSync.js'

function autoBackupDevPlugin() {
  return {
    name: 'auto-backup-dev-plugin',
    async configureServer(server) {
      // Check if Real-Time Auto-Sync Daemon is running on :5174
      try {
        const ping = await fetch('http://127.0.0.1:5174/api/health', { signal: AbortSignal.timeout(600) });
        if (ping.ok) {
          console.log('⚡ Connected to active Pislinfra Auto-Sync Daemon on :5174');
        }
      } catch (e) {
        // Auto-spawn daemon if not already running
        try {
          const { spawn } = await import('child_process');
          const daemonProc = spawn('node', ['scripts/autoSyncDaemon.js'], {
            detached: true,
            stdio: 'ignore'
          });
          daemonProc.unref();
          console.log('🚀 Auto-spawned Pislinfra Real-Time Auto-Sync Daemon on :5174');
        } catch (spawnErr) {}
      }

      server.middlewares.use('/__api/save-main-backup', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { endpoint, data } = JSON.parse(body);
              if (endpoint && data) {
                // Forward through universal incremental sync engine
                await applyIncrementalSync(endpoint, data, 'update');
              }
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    autoBackupDevPlugin(),
    
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),
  ],
  
  server: {
    watch: {
      ignored: ['**/src/data/**', '**/public/data/**', '**/dist/**', '**/public/images/**', '**/src/utils/imageUrl.js'],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:1337',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:1337',
        changeOrigin: true,
      },
    },
  },

  publicDir: 'public',
  
  build: {
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true,
    
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        dead_code: true,
      },
      mangle: {
        toplevel: true,
      },
    },
    
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('html-to-image')) {
              return 'vendor-pdf';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('swiper')) {
              return 'vendor-swiper';
            }
            if (id.includes('leaflet')) {
              return 'vendor-maps';
            }
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('react-helmet')) {
              return 'vendor-react';
            }
            return 'vendor-core';
          }
          if (id.includes('MainBackupPislinfra.json')) {
            return 'backup-data';
          }
          if (id.includes('coverageMarkersData.js') || id.includes('Awards-&-Certifications.js')) {
            return 'data-store';
          }
        },
      },
    },
    
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
  },
  
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },
})