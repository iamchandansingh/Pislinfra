import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_PATH = path.resolve(__dirname, '../src/data/MainBackupPislinfra.json');
const HOSTINGER_BACKUP_PATH = path.resolve(__dirname, '../public/data/live-backup.json');
const OG_PATH = path.resolve(__dirname, '../src/data/projectsData.js');
const COMP_PATH = path.resolve(__dirname, '../src/data/completedProjects.js');

const CANDIDATE_URLS = [
  'http://localhost:1337',
  process.env.VITE_STRAPI_URL || 'https://cms-pislinfra.onrender.com'
];

const ENDPOINTS = [
  'ongoing-projects?populate=*&pagination[pageSize]=100',
  'completed-projects?populate=*&pagination[pageSize]=100',
  'home-page?populate=*',
  'clients?pagination[pageSize]=100&sort=order:asc',
  'awards?populate=*&sort=order:asc',
  'coverage-markers?populate=*&pagination[pageSize]=100',
  'blogs?populate=*&pagination[pageSize]=100'
];

async function fetchFromStrapi(url, endpoint) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${url}/api/${endpoint}`, {
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' }
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (e) {
    clearTimeout(timeoutId);
    return null;
  }
}

async function syncBackup() {
  console.log('🔄 Checking live Strapi connection to sync main DB backup...');

  let activeUrl = null;
  for (const url of CANDIDATE_URLS) {
    try {
      const ping = await fetchFromStrapi(url, 'home-page?populate=*');
      if (ping) {
        activeUrl = url;
        break;
      }
    } catch (e) {}
  }

  if (!activeUrl) {
    console.log('⚠️ Could not connect to Strapi instance. Keeping existing main backup files intact.');
    return;
  }

  console.log(`📡 Connected to Strapi at ${activeUrl}. Fetching latest database entries...`);

  let backup = {};
  if (fs.existsSync(BACKUP_PATH)) {
    try {
      backup = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));
    } catch (e) {
      backup = {};
    }
  }

  for (const ep of ENDPOINTS) {
    try {
      const data = await fetchFromStrapi(activeUrl, ep);
      if (data) {
        backup[ep] = data;
        const baseKey = ep.split('?')[0];
        backup[baseKey] = data;

        // If ongoing-projects, update projectsData.js (16 projects)
        if (ep.includes('ongoing-projects') && Array.isArray(data) && data.length > 0) {
          const filteredOg = data.filter(p => {
            const n = (p.name || p.title || '').toLowerCase();
            return !n.includes('humsafar') && !n.includes('logistics park llp');
          });
          const formattedOg = filteredOg.map((p, idx) => {
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
          fs.writeFileSync(OG_PATH, `const projectsData = ${JSON.stringify(formattedOg, null, 2)};\n\nexport default projectsData;\n`, 'utf8');
          console.log(`✅ Synced ongoing projects (${formattedOg.length}) to projectsData.js`);
        }

        // If completed-projects, update completedProjects.js (27 projects)
        if (ep.includes('completed-projects') && Array.isArray(data) && data.length > 0) {
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

          let existingComp = [];
          if (fs.existsSync(COMP_PATH)) {
            try {
              const compContent = fs.readFileSync(COMP_PATH, 'utf8');
              const jsonMatch = compContent.match(/const\s+completedProjects\s*=\s*(\[[\s\S]*?\]);/);
              if (jsonMatch) existingComp = JSON.parse(jsonMatch[1]);
            } catch (e) {}
          }
          const existingSlugs = new Set(formattedComp.map(p => (p.name || '').toLowerCase().replace(/[^a-z0-9]/g, '')));
          const missing = existingComp.filter(p => !existingSlugs.has((p.name || '').toLowerCase().replace(/[^a-z0-9]/g, '')));
          const allComp = [...formattedComp, ...missing].map((p, idx) => ({ ...p, id: idx + 1 }));

          fs.writeFileSync(COMP_PATH, `const completedProjects = ${JSON.stringify(allComp, null, 2)};\n\nexport default completedProjects;\n`, 'utf8');
          backup[ep] = allComp;
          backup[baseKey] = allComp;
          console.log(`✅ Synced completed projects (${allComp.length}) to completedProjects.js`);
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch ${ep}:`, err.message);
    }
  }

  fs.writeFileSync(BACKUP_PATH, JSON.stringify(backup, null, 2), 'utf8');
  fs.writeFileSync(HOSTINGER_BACKUP_PATH, JSON.stringify(backup, null, 2), 'utf8');
  console.log('✅ Main database backup & Hostinger live backup (live-backup.json) successfully updated!');
}

syncBackup();
