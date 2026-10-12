import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function autoBackupDevPlugin() {
  return {
    name: 'auto-backup-dev-plugin',
    configureServer(server) {
      server.middlewares.use('/__api/save-main-backup', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { endpoint, data } = JSON.parse(body);
              if (endpoint && data) {
                const backupPath = path.resolve(__dirname, 'src/data/MainBackupPislinfra.json');
                if (fs.existsSync(backupPath)) {
                  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
                  backup[endpoint] = data;
                  const baseKey = endpoint.split('?')[0];
                  backup[baseKey] = data;
                  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2), 'utf8');
                }

                if (endpoint.includes('ongoing-projects') && Array.isArray(data) && data.length > 0) {
                  const ogPath = path.resolve(__dirname, 'src/data/projectsData.js');
                  const formattedOg = data.map((p, idx) => {
                    const imgs = (p.images || []).map(img => img.formats?.large?.url || img.formats?.medium?.url || img.url).filter(Boolean);
                    return {
                      id: idx + 1,
                      documentId: p.documentId,
                      category: p.category || "Industrial",
                      name: p.name,
                      location: p.location,
                      state: p.state,
                      area: p.area,
                      client: p.client,
                      timeline: p.timeline,
                      status: "Ongoing",
                      scope: p.scope,
                      images: imgs
                    };
                  });
                  fs.writeFileSync(ogPath, `const projectsData = ${JSON.stringify(formattedOg, null, 2)};\n\nexport default projectsData;\n`, 'utf8');
                }

                if (endpoint.includes('completed-projects') && Array.isArray(data) && data.length > 0) {
                  const compPath = path.resolve(__dirname, 'src/data/completedProjects.js');
                  const formattedComp = data.map((p, idx) => {
                    const imgs = (p.images || []).map(img => img.formats?.large?.url || img.formats?.medium?.url || img.url).filter(Boolean);
                    return {
                      id: idx + 1,
                      documentId: p.documentId,
                      category: p.category || "Warehousing",
                      name: p.name,
                      location: p.location,
                      state: p.state,
                      area: p.area,
                      client: p.client,
                      timeline: p.timeline,
                      status: "Completed",
                      scope: p.scope,
                      images: imgs
                    };
                  });
                  fs.writeFileSync(compPath, `const completedProjects = ${JSON.stringify(formattedComp, null, 2)};\n\nexport default completedProjects;\n`, 'utf8');
                }
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
    autoBackupDevPlugin(),
    react(),
    tailwindcss(),
    
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
            if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react/')) {
              return 'vendor-react';
            }
            if (id.includes('react-icons') || id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('leaflet')) {
              return 'vendor-maps';
            }
            if (id.includes('html2canvas') || id.includes('dompurify')) {
              return 'vendor-utils';
            }
            return 'vendor-core';
          }
          if (id.includes('MainBackupPislinfra.json') || id.includes('coverageMarkersData.js') || id.includes('Awards-&-Certifications.js')) {
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