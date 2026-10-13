import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_PATH = path.resolve(__dirname, '../src/data/MainBackupPislinfra.json');
const HOSTINGER_BACKUP_PATH = path.resolve(__dirname, '../public/data/live-backup.json');
const OG_PATH = path.resolve(__dirname, '../src/data/projectsData.js');
const COMP_PATH = path.resolve(__dirname, '../src/data/completedProjects.js');
const IMG_URL_PATH = path.resolve(__dirname, '../src/utils/imageUrl.js');

const projectImagesDir = path.resolve(__dirname, '../public/images/projects');
const distImagesDir = path.resolve(__dirname, '../dist/images/projects');
if (!fs.existsSync(projectImagesDir)) fs.mkdirSync(projectImagesDir, { recursive: true });
if (!fs.existsSync(distImagesDir)) fs.mkdirSync(distImagesDir, { recursive: true });

async function downloadProjectImg(url) {
  if (!url || typeof url !== 'string') return url;
  let fetchUrl = url;
  let fn = '';

  if (url.includes('r2.dev/')) {
    fn = url.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
  } else if (url.startsWith('/uploads/') || url.includes(':1337/uploads/')) {
    fn = url.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
    fetchUrl = url.startsWith('/uploads/') ? `http://127.0.0.1:1337${url}` : url;
  } else {
    return url;
  }

  const target = path.join(projectImagesDir, fn);
  const distTarget = path.join(distImagesDir, fn);

  if (!fs.existsSync(target)) {
    try {
      const res = await fetch(fetchUrl, { headers: { 'User-Agent': 'PislinfraDev/1.0' } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(target, buf);
        if (fs.existsSync(path.dirname(distTarget))) {
          fs.writeFileSync(distTarget, buf);
        }
        console.log(`📥 Downloaded project image: ${fn}`);
      }
    } catch (e) {
      console.warn(`Could not download image ${fn}:`, e.message);
    }
  }

  return `/images/projects/${fn}`;
}

export async function syncProjectsDirectly() {
  console.log('⚡ Direct Sync: Fetching ongoing and completed projects from Strapi...');

  let masterBackup = {};
  if (fs.existsSync(BACKUP_PATH)) {
    try {
      masterBackup = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));
    } catch (e) {
      masterBackup = {};
    }
  }

  const strapiUrls = ['http://127.0.0.1:1337', 'http://localhost:1337'];
  let activeUrl = null;

  for (const u of strapiUrls) {
    try {
      const res = await fetch(`${u}/api/ongoing-projects?pagination[pageSize]=1`, { cache: 'no-store' });
      if (res.ok) {
        activeUrl = u;
        break;
      }
    } catch (e) {}
  }

  if (!activeUrl) {
    console.error('❌ Could not connect to local Strapi on port 1337');
    return false;
  }

  let formattedOg = null;
  let formattedComp = null;

  try {
    // 1. Fetch Ongoing Projects
    const ogRes = await fetch(`${activeUrl}/api/ongoing-projects?populate=*&pagination[pageSize]=100`, { cache: 'no-store' });
    if (ogRes.ok) {
      const ogJson = await ogRes.json();
      const rawOg = ogJson.data || [];
      const filteredOg = rawOg.filter(p => {
        const n = (p.name || p.title || '').toLowerCase();
        return !n.includes('humsafar') && !n.includes('logistics park llp');
      });

      // Read existing local project datasets for fallback coordinates
      let existingOgList = [];
      try {
        if (fs.existsSync(OG_PATH)) {
          const mod = await import(`file://${OG_PATH}?t=${Date.now()}`);
          existingOgList = mod.default || [];
        }
      } catch (e) {}

      formattedOg = await Promise.all(filteredOg.map(async (p, idx) => {
        const rawImgs = p.images || (p.image ? [p.image] : []);
        const imgs = (await Promise.all(rawImgs.map(async (img) => {
          let u = typeof img === 'string' ? img : (img.formats?.large?.url || img.formats?.medium?.url || img.url);
          if (!u || typeof u !== 'string') return null;
          return await downloadProjectImg(u);
        }))).filter(Boolean);

        const matchLocal = existingOgList.find(e => (e.name || '').toLowerCase().trim() === (p.name || '').toLowerCase().trim()) || {};
        const finalCx = p.cx != null ? Number(p.cx) : (matchLocal.cx != null ? Number(matchLocal.cx) : null);
        const finalCy = p.cy != null ? Number(p.cy) : (matchLocal.cy != null ? Number(matchLocal.cy) : null);

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
          cx: finalCx,
          cy: finalCy,
          images: imgs.length > 0 ? imgs : ['/images/projects/default.jpg']
        };
      }));

      fs.writeFileSync(OG_PATH, `const projectsData = ${JSON.stringify(formattedOg, null, 2)};\n\nexport default projectsData;\n`, 'utf8');
      masterBackup['ongoing-projects'] = formattedOg;
      masterBackup['ongoing-projects?populate=*&pagination[pageSize]=100'] = formattedOg;
      masterBackup['ongoing-projects?populate=*&pagination[pageSize]=100&sort=createdAt:asc'] = formattedOg;
      console.log(`✅ Synced ongoing projects (${formattedOg.length}) directly to projectsData.js`);
    }

    // 2. Fetch Completed Projects
    const compRes = await fetch(`${activeUrl}/api/completed-projects?populate=*&pagination[pageSize]=100`, { cache: 'no-store' });
    if (compRes.ok) {
      const compJson = await compRes.json();
      const rawComp = compJson.data || [];

      let existingCompList = [];
      try {
        if (fs.existsSync(COMP_PATH)) {
          const mod = await import(`file://${COMP_PATH}?t=${Date.now()}`);
          existingCompList = mod.default || [];
        }
      } catch (e) {}

      formattedComp = await Promise.all(rawComp.map(async (p, idx) => {
        const rawImgs = p.images || (p.image ? [p.image] : []);
        const imgs = (await Promise.all(rawImgs.map(async (img) => {
          let u = typeof img === 'string' ? img : (img.formats?.large?.url || img.formats?.medium?.url || img.url);
          if (!u || typeof u !== 'string') return null;
          return await downloadProjectImg(u);
        }))).filter(Boolean);

        const matchLocal = existingCompList.find(e => (e.name || '').toLowerCase().trim() === (p.name || '').toLowerCase().trim()) || {};
        const finalCx = p.cx != null ? Number(p.cx) : (matchLocal.cx != null ? Number(matchLocal.cx) : null);
        const finalCy = p.cy != null ? Number(p.cy) : (matchLocal.cy != null ? Number(matchLocal.cy) : null);

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
          cx: finalCx,
          cy: finalCy,
          images: imgs.length > 0 ? imgs : ['/images/projects/default.jpg']
        };
      }));

      fs.writeFileSync(COMP_PATH, `const completedProjects = ${JSON.stringify(formattedComp, null, 2)};\n\nexport default completedProjects;\n`, 'utf8');
      masterBackup['completed-projects'] = formattedComp;
      masterBackup['completed-projects?populate=*&pagination[pageSize]=100'] = formattedComp;
      masterBackup['completed-projects?populate=*&pagination[pageSize]=100&sort=createdAt:asc'] = formattedComp;
      console.log(`✅ Synced completed projects (${formattedComp.length}) directly to completedProjects.js`);
    }

    // 2.1 Fetch Coverage Markers
    try {
      const markersRes = await fetch(`${activeUrl}/api/coverage-markers?populate=*&pagination[pageSize]=100`, { cache: 'no-store' });
      if (markersRes.ok) {
        const markersJson = await markersRes.json();
        const rawMarkers = markersJson.data || [];
        masterBackup['coverage-markers'] = rawMarkers;
        masterBackup['coverage-markers?populate=*&pagination[pageSize]=100'] = rawMarkers;
        const MARKERS_PATH = path.resolve(__dirname, '../src/data/coverageMarkersData.js');
        fs.writeFileSync(MARKERS_PATH, `const coverageMarkersData = ${JSON.stringify(rawMarkers, null, 2)};\n\nexport default coverageMarkersData;\n`, 'utf8');
        console.log(`✅ Synced ${rawMarkers.length} coverage markers to coverageMarkersData.js`);
      }
    } catch (e) {}

    // 3. Update Backups (Hostinger SSD Local Database & Bundled DB)
    fs.writeFileSync(BACKUP_PATH, JSON.stringify(masterBackup, null, 2), 'utf8');
    
    const hostingerDirs = [
      path.resolve(__dirname, '../public/data'),
      path.resolve(__dirname, '../dist/data')
    ];

    hostingerDirs.forEach(dir => {
      if (fs.existsSync(path.dirname(dir))) {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'live-backup.json'), JSON.stringify(masterBackup, null, 2), 'utf8');
        if (formattedOg) {
          fs.writeFileSync(path.join(dir, 'ongoing_projects.json'), JSON.stringify(formattedOg, null, 2), 'utf8');
          fs.writeFileSync(path.join(dir, 'ongoing-projects.json'), JSON.stringify(formattedOg, null, 2), 'utf8');
        }
        if (formattedComp) {
          fs.writeFileSync(path.join(dir, 'completed_projects.json'), JSON.stringify(formattedComp, null, 2), 'utf8');
          fs.writeFileSync(path.join(dir, 'completed-projects.json'), JSON.stringify(formattedComp, null, 2), 'utf8');
        }
      }
    });

    // 4. Update PROJECT_FILES in imageUrl.js
    if (fs.existsSync(IMG_URL_PATH) && fs.existsSync(projectImagesDir)) {
      const pFiles = fs.readdirSync(projectImagesDir).filter(f => !f.startsWith('.') && (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.avif') || f.endsWith('.svg')));
      pFiles.sort();
      let imgContent = fs.readFileSync(IMG_URL_PATH, 'utf8');
      const setStr = `const PROJECT_FILES = new Set(${JSON.stringify(pFiles)});`;
      imgContent = imgContent.replace(/const PROJECT_FILES = new Set\(\[[\s\S]*?\]\);/, setStr);
      fs.writeFileSync(IMG_URL_PATH, imgContent, 'utf8');
      console.log(`✅ Updated ${pFiles.length} project images in imageUrl.js`);
    }

    console.log('🎉 Direct sync completed successfully in seconds!');
    return true;
  } catch (err) {
    console.error('Error during direct sync:', err);
    return false;
  }
}

// Run if called directly from CLI
if (process.argv[1] && process.argv[1].endsWith('syncProjectsOnly.js')) {
  syncProjectsDirectly();
}
