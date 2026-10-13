import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function downloadImageIfMissing(url, folder) {
  if (!url || typeof url !== 'string') return url;
  let fetchUrl = url;
  let fn = '';
  if (url.includes('r2.dev/')) {
    fn = url.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
  } else if (url.startsWith('/uploads/') || url.includes('localhost:1337/uploads/')) {
    fn = url.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
    fetchUrl = url.startsWith('/uploads/') ? `http://localhost:1337${url}` : url;
  } else {
    return url;
  }

  const targetDir = path.resolve(__dirname, 'public/images', folder);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, fn);
  if (!fs.existsSync(targetPath)) {
    try {
      const res = await fetch(fetchUrl, { headers: { 'User-Agent': 'PislinfraDev/1.0' } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(targetPath, buf);
        console.log(`📥 Auto-downloaded [${folder}] image: ${fn}`);
        const distDir = path.resolve(__dirname, 'dist/images', folder);
        if (fs.existsSync(distDir)) {
          fs.writeFileSync(path.join(distDir, fn), buf);
        }
      }
    } catch (e) {
      console.warn(`Could not download ${fn}:`, e.message);
    }
  }
  return `/images/${folder}/${fn}`;
}

function autoBackupDevPlugin() {
  return {
    name: 'auto-backup-dev-plugin',
    configureServer(server) {
      server.middlewares.use('/__api/save-main-backup', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { endpoint, data } = JSON.parse(body);
              if (endpoint && data) {
                // Update MainBackupPislinfra.json
                const backupPath = path.resolve(__dirname, 'src/data/MainBackupPislinfra.json');
                if (fs.existsSync(backupPath)) {
                  try {
                    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
                    backup[endpoint] = data;
                    const baseKey = endpoint.split('?')[0];
                    backup[baseKey] = data;
                    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2), 'utf8');
                  } catch (e) {}
                }

                // Update public/data/live-backup.json
                const liveBackupPath = path.resolve(__dirname, 'public/data/live-backup.json');
                if (fs.existsSync(liveBackupPath)) {
                  try {
                    const liveBackup = JSON.parse(fs.readFileSync(liveBackupPath, 'utf8'));
                    liveBackup[endpoint] = data;
                    const baseKey = endpoint.split('?')[0];
                    liveBackup[baseKey] = data;
                    fs.writeFileSync(liveBackupPath, JSON.stringify(liveBackup, null, 2), 'utf8');
                  } catch (e) {}
                }

                if (endpoint.includes('ongoing-projects') && Array.isArray(data) && data.length > 0) {
                  const ogPath = path.resolve(__dirname, 'src/data/projectsData.js');
                  const filtered = data.filter(p => {
                    const n = (p.name || p.title || '').toLowerCase();
                    return !n.includes('humsafar') && !n.includes('logistics park llp');
                  });
                  const formattedOg = await Promise.all(filtered.map(async (p, idx) => {
                    const rawImgs = p.images || (p.image ? [p.image] : []);
                    const imgs = (await Promise.all(rawImgs.map(async (img) => {
                      const u = typeof img === 'string' ? img : (img.formats?.large?.url || img.formats?.medium?.url || img.url);
                      return await downloadImageIfMissing(u, 'projects');
                    }))).filter(Boolean);

                    return {
                      id: idx + 1,
                      documentId: p.documentId || `og_${idx + 1}`,
                      category: p.category || "Industrial",
                      name: p.name,
                      location: p.location,
                      state: p.state,
                      area: p.area,
                      client: p.client,
                      timeline: p.timeline,
                      status: "Ongoing",
                      scope: p.scope,
                      images: imgs.length > 0 ? imgs : ['/images/projects/default.jpg']
                    };
                  }));
                  if (formattedOg.length > 0) {
                    fs.writeFileSync(ogPath, `const projectsData = ${JSON.stringify(formattedOg, null, 2)};\n\nexport default projectsData;\n`, 'utf8');
                  }
                }

                if (endpoint.includes('completed-projects') && Array.isArray(data) && data.length > 0) {
                  const compPath = path.resolve(__dirname, 'src/data/completedProjects.js');
                  const formattedComp = await Promise.all(data.map(async (p, idx) => {
                    const rawImgs = p.images || (p.image ? [p.image] : []);
                    const imgs = (await Promise.all(rawImgs.map(async (img) => {
                      const u = typeof img === 'string' ? img : (img.formats?.large?.url || img.formats?.medium?.url || img.url);
                      return await downloadImageIfMissing(u, 'projects');
                    }))).filter(Boolean);

                    return {
                      id: idx + 1,
                      documentId: p.documentId || `comp_${idx + 1}`,
                      category: p.category || "Warehousing",
                      name: p.name,
                      location: p.location,
                      state: p.state,
                      area: p.area,
                      client: p.client,
                      timeline: p.timeline,
                      status: "Completed",
                      scope: p.scope,
                      images: imgs.length > 0 ? imgs : ['/images/projects/default.jpg']
                    };
                  }));
                  if (formattedComp.length > 0) {
                    fs.writeFileSync(compPath, `const completedProjects = ${JSON.stringify(formattedComp, null, 2)};\n\nexport default completedProjects;\n`, 'utf8');
                  }
                }

                // Auto-sync PROJECT_FILES Set in imageUrl.js
                try {
                  const imgUrlPath = path.resolve(__dirname, 'src/utils/imageUrl.js');
                  const projDir = path.resolve(__dirname, 'public/images/projects');
                  if (fs.existsSync(imgUrlPath) && fs.existsSync(projDir)) {
                    const pFiles = fs.readdirSync(projDir).filter(f => !f.startsWith('.') && (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.avif') || f.endsWith('.svg')));
                    pFiles.sort();
                    let imgUrlContent = fs.readFileSync(imgUrlPath, 'utf8');
                    const setStr = `const PROJECT_FILES = new Set(${JSON.stringify(pFiles)});`;
                    imgUrlContent = imgUrlContent.replace(/const PROJECT_FILES = new Set\(\[[\s\S]*?\]\);/, setStr);
                    fs.writeFileSync(imgUrlPath, imgUrlContent, 'utf8');
                  }
                } catch (e) {}
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
      ignored: ['**/src/data/**', '**/public/data/**', '**/dist/**', '**/public/images/**'],
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