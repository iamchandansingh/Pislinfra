import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_DATA_PATH = path.join(ROOT, 'src/data/projectsData.js');
const COMPLETED_DATA_PATH = path.join(ROOT, 'src/data/completedProjects.js');
const MAIN_BACKUP_PATH = path.join(ROOT, 'src/data/MainBackupPislinfra.json');
const LIVE_BACKUP_PATH = path.join(ROOT, 'public/data/live-backup.json');
const TARGET_DIR = path.join(ROOT, 'public/images/projects');
const ASSETS_PROJECT_DIR = path.join(ROOT, 'src/assets/images/Project');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Map all files in src/assets/images/Project
function getAssetFiles(dir, map = {}) {
  if (!fs.existsSync(dir)) return map;
  const list = fs.readdirSync(dir);
  for (const f of list) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      getAssetFiles(full, map);
    } else {
      map[f.toLowerCase()] = full;
    }
  }
  return map;
}

const assetMap = getAssetFiles(ASSETS_PROJECT_DIR);
console.log(`📁 Found ${Object.keys(assetMap).length} existing local project asset files.`);

// Collect all unique R2 URLs from projects
const projectsData = JSON.parse(fs.readFileSync(PROJECTS_DATA_PATH, 'utf8').replace(/^const\s+projectsData\s*=\s*/, '').replace(/;\s*export\s+default\s+projectsData;\s*$/, ''));
const completedProjects = JSON.parse(fs.readFileSync(COMPLETED_DATA_PATH, 'utf8').replace(/^const\s+completedProjects\s*=\s*/, '').replace(/;\s*export\s+default\s+completedProjects;\s*$/, ''));

const urlSet = new Set();
for (const p of [...projectsData, ...completedProjects]) {
  if (Array.isArray(p.images)) {
    for (const img of p.images) {
      if (typeof img === 'string' && img.includes('r2.dev')) {
        urlSet.add(img);
      }
    }
  }
}

const urls = Array.from(urlSet);
console.log(`🚀 Found ${urls.length} unique project images to localize...`);

function findLocalAsset(filename) {
  let clean = filename
    .replace(/^optimized_\d+_\d+_large_/, '')
    .replace(/^large_/, '')
    .replace(/_[a-f0-9]{8,}\./, '.')
    .replace(/_png\.webp$/, '.png')
    .replace(/_jpg\.webp$/, '.jpg')
    .replace(/_jpeg\.webp$/, '.jpeg')
    .replace(/_/g, '-')
    .toLowerCase();

  for (const [k, full] of Object.entries(assetMap)) {
    if (k === clean || k.replace(/[-_]/g, '') === clean.replace(/[-_]/g, '')) {
      return full;
    }
  }
  return null;
}

async function downloadUrl(url, destPath) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
    return true;
  } catch (err) {
    clearTimeout(timeoutId);
    return false;
  }
}

async function main() {
  let downloaded = 0;
  let copiedFromAssets = 0;
  let failed = 0;

  // Process in batches of 10
  const BATCH_SIZE = 10;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (u) => {
      const filename = u.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
      const dest = path.join(TARGET_DIR, filename);

      if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
        downloaded++;
        return;
      }

      // 1. Try download from R2
      const ok = await downloadUrl(u, dest);
      if (ok) {
        downloaded++;
      } else {
        // 2. Try match from src/assets/images/Project
        const localSrc = findLocalAsset(filename);
        if (localSrc && fs.existsSync(localSrc)) {
          fs.copyFileSync(localSrc, dest);
          copiedFromAssets++;
        } else {
          console.warn(`⚠️ Failed to download or find local match for: ${filename}`);
          failed++;
        }
      }
    }));
    console.log(`Progress: ${Math.min(i + BATCH_SIZE, urls.length)} / ${urls.length} images processed...`);
  }

  console.log(`\n🎉 Results: ${downloaded} downloaded from R2, ${copiedFromAssets} copied from local assets, ${failed} failed.`);

  // If any failed, find a fallback from existing files in TARGET_DIR or default
  const existingFiles = fs.readdirSync(TARGET_DIR).filter(f => !f.startsWith('.'));
  const defaultFallback = existingFiles[0] ? `/images/projects/${existingFiles[0]}` : '/images/hero/Ongoing-Projects.png';

  // Rewrite all project data files to use local paths
  function localizeUrl(url) {
    if (!url || typeof url !== 'string') return url;
    if (url.includes('r2.dev/')) {
      const filename = url.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
      const target = path.join(TARGET_DIR, filename);
      if (fs.existsSync(target)) {
        return `/images/projects/${filename}`;
      }
      return defaultFallback;
    }
    return url;
  }

  const updatedProjects = projectsData.map(p => ({
    ...p,
    images: (p.images || []).map(localizeUrl)
  }));

  const updatedCompleted = completedProjects.map(p => ({
    ...p,
    images: (p.images || []).map(localizeUrl)
  }));

  fs.writeFileSync(PROJECTS_DATA_PATH, `const projectsData = ${JSON.stringify(updatedProjects, null, 2)};\n\nexport default projectsData;\n`, 'utf8');
  fs.writeFileSync(COMPLETED_DATA_PATH, `const completedProjects = ${JSON.stringify(updatedCompleted, null, 2)};\n\nexport default completedProjects;\n`, 'utf8');
  console.log('✅ Updated projectsData.js and completedProjects.js with local paths.');

  // Update MainBackupPislinfra.json and live-backup.json
  for (const backupPath of [MAIN_BACKUP_PATH, LIVE_BACKUP_PATH]) {
    if (fs.existsSync(backupPath)) {
      let content = fs.readFileSync(backupPath, 'utf8');
      content = content.replace(/https:\/\/[^\"'\s\)]*r2\.dev\/([a-zA-Z0-9._-]+)/g, (match, filename) => {
        const clean = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        if (fs.existsSync(path.join(TARGET_DIR, clean))) {
          return `/images/projects/${clean}`;
        }
        if (fs.existsSync(path.join(ROOT, 'public/images/awards', clean))) {
          return `/images/awards/${clean}`;
        }
        if (fs.existsSync(path.join(ROOT, 'public/images/blogs', clean))) {
          return `/images/blogs/${clean}`;
        }
        return match;
      });
      fs.writeFileSync(backupPath, content, 'utf8');
      console.log(`✅ Localized R2 URLs in ${path.basename(backupPath)}`);
    }
  }
}

main().catch(console.error);
