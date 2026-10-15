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
                      cx: p.cx != null ? Number(p.cx) : null,
                      cy: p.cy != null ? Number(p.cy) : null,
                      images: imgs.length > 0 ? imgs : ['/images/projects/default.jpg']
                    };
                  }));
                  if (formattedOg.length > 0) {
                    fs.writeFileSync(ogPath, `const projectsData = ${JSON.stringify(formattedOg, null, 2)};\n\nexport default projectsData;\n`, 'utf8');
                  }
                }

                if (endpoint.includes('coverage-markers') && Array.isArray(data) && data.length > 0) {
                  const markersPath = path.resolve(__dirname, 'src/data/coverageMarkersData.js');
                  fs.writeFileSync(markersPath, `const coverageMarkersData = ${JSON.stringify(data, null, 2)};\n\nexport default coverageMarkersData;\n`, 'utf8');

                  // Also sync cx and cy directly into projectsData.js
                  const ogPath = path.resolve(__dirname, 'src/data/projectsData.js');
                  if (fs.existsSync(ogPath)) {
                    try {
                      const ogContent = fs.readFileSync(ogPath, 'utf8');
                      const jsonMatch = ogContent.match(/const\s+projectsData\s*=\s*(\[[\s\S]*?\]);/);
                      if (jsonMatch) {
                        const ogList = JSON.parse(jsonMatch[1]);
                        const slugify = str => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                        let updated = false;
                        ogList.forEach(p => {
                          const pSlug = slugify(p.name);
                          const pCity = slugify(p.location || p.city || '');
                          const marker = data.find(m => {
                            const mSlug = slugify(m.projectName || m.name || '');
                            const mCity = slugify(m.city || m.location || '');
                            if (mSlug === pSlug) {
                              if (mCity && pCity) return mCity === pCity;
                              return true;
                            }
                            return false;
                          });
                          if (marker && marker.cx != null && marker.cy != null) {
                            if (p.cx !== Number(marker.cx) || p.cy !== Number(marker.cy)) {
                              p.cx = Number(marker.cx);
                              p.cy = Number(marker.cy);
                              updated = true;
                            }
                          }
                        });
                        if (updated) {
                          fs.writeFileSync(ogPath, `const projectsData = ${JSON.stringify(ogList, null, 2)};\n\nexport default projectsData;\n`, 'utf8');
                        }
                      }
                    } catch (e) {}
                  }

                  // Also sync cx and cy directly into completedProjects.js
                  const compSyncPath = path.resolve(__dirname, 'src/data/completedProjects.js');
                  if (fs.existsSync(compSyncPath)) {
                    try {
                      const compContent = fs.readFileSync(compSyncPath, 'utf8');
                      const jsonMatch = compContent.match(/const\s+completedProjects\s*=\s*(\[[\s\S]*?\]);/);
                      if (jsonMatch) {
                        const compList = JSON.parse(jsonMatch[1]);
                        const slugify = str => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                        let updatedComp = false;
                        compList.forEach(p => {
                          const pSlug = slugify(p.name);
                          const pCity = slugify(p.location || p.city || '');
                          const marker = data.find(m => {
                            const mSlug = slugify(m.projectName || m.name || '');
                            const mCity = slugify(m.city || m.location || '');
                            if (mSlug === pSlug) {
                              if (mCity && pCity) return mCity === pCity;
                              return true;
                            }
                            return false;
                          });
                          if (marker && marker.cx != null && marker.cy != null) {
                            if (p.cx !== Number(marker.cx) || p.cy !== Number(marker.cy)) {
                              p.cx = Number(marker.cx);
                              p.cy = Number(marker.cy);
                              updatedComp = true;
                            }
                          }
                        });
                        if (updatedComp) {
                          fs.writeFileSync(compSyncPath, `const completedProjects = ${JSON.stringify(compList, null, 2)};\n\nexport default completedProjects;\n`, 'utf8');
                        }
                      }
                    } catch (e) {}
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
                      cx: p.cx != null ? Number(p.cx) : null,
                      cy: p.cy != null ? Number(p.cy) : null,
                      images: imgs.length > 0 ? imgs : ['/images/projects/default.jpg']
                    };
                  }));
                  if (formattedComp.length > 0) {
                    fs.writeFileSync(compPath, `const completedProjects = ${JSON.stringify(formattedComp, null, 2)};\n\nexport default completedProjects;\n`, 'utf8');
                  }
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