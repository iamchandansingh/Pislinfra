import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const projectImagesDir = path.join(rootDir, 'public/images/projects');
const diskFiles = new Set(fs.existsSync(projectImagesDir) ? fs.readdirSync(projectImagesDir) : []);

function cleanMediaObject(media) {
  if (!media || typeof media !== 'object') return media;

  let localFile = null;
  // Check if formats.large already has local path
  if (media.formats?.large?.url?.startsWith('/images/projects/')) {
    localFile = media.formats.large.url;
  } else if (media.url?.startsWith('/images/projects/')) {
    localFile = media.url;
  } else {
    // Try to extract filename
    const urlsToTry = [
      media.formats?.large?.url,
      media.formats?.medium?.url,
      media.formats?.small?.url,
      media.formats?.thumbnail?.url,
      media.url
    ].filter(Boolean);

    for (const u of urlsToTry) {
      const fn = u.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
      if (diskFiles.has(fn)) {
        localFile = `/images/projects/${fn}`;
        break;
      }
      // Check without large_/medium_/small_/thumbnail_ prefix
      const unprefixed = fn.replace(/^(large|medium|small|thumbnail)_/, '');
      for (const df of diskFiles) {
        if (df.includes(unprefixed)) {
          localFile = `/images/projects/${df}`;
          break;
        }
      }
      if (localFile) break;
    }
  }

  if (localFile) {
    media.url = localFile;
    if (media.formats) {
      for (const fmt of ['large', 'medium', 'small', 'thumbnail']) {
        if (media.formats[fmt]) {
          media.formats[fmt].url = localFile;
        }
      }
    }
  }

  return media;
}

function cleanProjectItem(item) {
  if (!item || typeof item !== 'object') return item;

  if (item.image) {
    if (typeof item.image === 'string' && item.image.includes('r2.dev/')) {
      const fn = item.image.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
      if (diskFiles.has(fn)) item.image = `/images/projects/${fn}`;
    } else if (typeof item.image === 'object') {
      item.image = cleanMediaObject(item.image);
    }
  }

  if (Array.isArray(item.images)) {
    item.images = item.images.map(img => {
      if (typeof img === 'string' && img.includes('r2.dev/')) {
        const fn = img.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
        return diskFiles.has(fn) ? `/images/projects/${fn}` : img;
      } else if (typeof img === 'object') {
        return cleanMediaObject(img);
      }
      return img;
    });
  }

  return item;
}

function processBackupFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  console.log(`Processing ${filePath}...`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let count = 0;
  for (const [key, value] of Object.entries(data)) {
    if (key.includes('project') && !key.includes('page')) {
      if (Array.isArray(value)) {
        data[key] = value.map(cleanProjectItem);
        count += value.length;
      } else if (value && Array.isArray(value.data)) {
        value.data = value.data.map(cleanProjectItem);
        count += value.data.length;
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Finished ${filePath}, cleaned ${count} project items.`);
}

processBackupFile(path.join(rootDir, 'public/data/live-backup.json'));
processBackupFile(path.join(rootDir, 'src/data/MainBackupPislinfra.json'));
console.log('Done cleaning project backup URLs!');
