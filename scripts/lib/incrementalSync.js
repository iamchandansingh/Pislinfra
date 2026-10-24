import path from 'path';
import { fileURLToPath } from 'url';
import { loadCurrentSnapshot, safeCommitSnapshot, safeAtomicWrite, exportStaticCollections } from './snapshotManager.js';
import {
  adaptOngoingProjects,
  adaptCompletedProjects,
  adaptAwards,
  adaptBlogs,
  adaptLeadership,
  adaptCoverageMarkers,
  adaptClientAppreciations,
  sanitizeBrand
} from './dataAdapters.js';
import { crawlMediaUrls, downloadMediaAsset, DIRS, sanitizeLocalhostUrls } from './mediaSyncEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

/**
 * Maps Strapi UIDs to canonical snapshot keys.
 */
export function resolveSnapshotKey(uidOrKey) {
  if (!uidOrKey) return 'unknown';
  const clean = uidOrKey.replace(/^api::/, '').replace(/\.[a-zA-Z0-9_-]+$/, '');
  
  const map = {
    'award': 'awards',
    'awards': 'awards',
    'blog': 'blogs',
    'blogs': 'blogs',
    'client': 'clients',
    'clients': 'clients',
    'completed-project': 'completed-projects',
    'completed-projects': 'completed-projects',
    'ongoing-project': 'ongoing-projects',
    'ongoing-projects': 'ongoing-projects',
    'coverage-marker': 'coverage-markers',
    'coverage-markers': 'coverage-markers',
    'job-opening': 'job-openings',
    'job-openings': 'job-openings',
    'case-study': 'case-studies',
    'case-studies': 'case-studies',
    'client-appreciation': 'client-appreciations',
    'client-appreciations': 'client-appreciations',
    'solution-page': 'solution-pages',
    'solution-pages': 'solution-pages',
    'about-page': 'about-page',
    'home-page': 'home-page',
    'leadership-page': 'leadership-page',
    'ehs-page': 'ehs-page',
    'csr-page': 'csr-page',
    'career-page': 'career-page',
    'annual-report-page': 'annual-report-page',
    'policy-page': 'policy-page',
    'contact-page': 'contact-page',
    'completed-page': 'completed-page',
    'ongoing-page': 'ongoing-page',
    'awards-page': 'awards-page',
    'case-study-page': 'case-study-page',
    'blog-page': 'blog-page',
    'header': 'header',
    'footer': 'footer',
    'top-header': 'top-header',
    'warehouse-page': 'warehouse-page'
  };

  return map[clean] || clean;
}

/**
 * Performs high-speed targeted incremental sync for a single event or changed collection.
 * Target execution time: 20ms - 80ms.
 */
export async function applyIncrementalSync(targetKeyOrUid, updatedPayload, action = 'update') {
  const startTime = performance.now();
  const key = resolveSnapshotKey(targetKeyOrUid);
  const snapshot = loadCurrentSnapshot();

  let mediaDownloaded = 0;

  // 1. Merge payload into snapshot
  if (Array.isArray(updatedPayload)) {
    // Full replacement of collection
    snapshot[key] = sanitizeBrand(updatedPayload);
  } else if (updatedPayload && typeof updatedPayload === 'object') {
    const isSingleType = key.endsWith('-page') || key === 'header' || key === 'footer' || key === 'top-header';
    
    if (isSingleType) {
      snapshot[key] = sanitizeBrand(updatedPayload);
    } else {
      // Collection type update / insert / delete
      const currentList = Array.isArray(snapshot[key]) ? [...snapshot[key]] : [];
      const docId = updatedPayload.documentId || updatedPayload.id;

      if (action === 'delete' || action === 'unpublish') {
        snapshot[key] = currentList.filter(item => (item.documentId || item.id) !== docId);
      } else {
        const existingIdx = currentList.findIndex(item => (item.documentId || item.id) === docId);
        const cleanItem = sanitizeBrand(updatedPayload);
        if (existingIdx !== -1) {
          currentList[existingIdx] = { ...currentList[existingIdx], ...cleanItem };
        } else {
          currentList.unshift(cleanItem);
        }
        snapshot[key] = currentList;
      }
    }
  }

  // 2. Execute corresponding model adapter if registered
  try {
    if (key === 'ongoing-projects' && Array.isArray(snapshot[key])) {
      const adapted = adaptOngoingProjects(snapshot[key]);
      if (adapted) snapshot[key] = adapted;
    } else if (key === 'completed-projects' && Array.isArray(snapshot[key])) {
      const adapted = adaptCompletedProjects(snapshot[key]);
      if (adapted) snapshot[key] = adapted;
    } else if (key === 'awards' && Array.isArray(snapshot[key])) {
      const adapted = adaptAwards(snapshot[key]);
      if (adapted) snapshot[key] = adapted;
    } else if (key === 'blogs' && Array.isArray(snapshot[key])) {
      const adapted = adaptBlogs(snapshot[key]);
      if (adapted) snapshot[key] = adapted;
    } else if (key === 'leadership-page' && snapshot[key]) {
      adaptLeadership(snapshot[key]);
    } else if (key === 'coverage-markers' && Array.isArray(snapshot[key])) {
      const adapted = adaptCoverageMarkers(snapshot[key]);
      if (adapted) snapshot[key] = adapted;
    } else if (key === 'client-appreciations' && Array.isArray(snapshot[key])) {
      const adapted = adaptClientAppreciations(snapshot[key]);
      if (adapted) snapshot[key] = adapted;
    }
  } catch (adapterErr) {
    console.warn(`[IncrementalSync] Adapter note for ${key}:`, adapterErr.message);
  }

  // 3. Incremental Media Download (Scan ONLY the changed entity/collection)
  try {
    const mediaItems = crawlMediaUrls({ [key]: snapshot[key] });
    for (const item of mediaItems.values()) {
      const targetDir = item.category === 'reports' ? DIRS.reports : (DIRS[item.category] || DIRS.uploads);
      const targetPath = path.join(targetDir, item.filename);
      const downloaded = await downloadMediaAsset(item.url, targetPath);
      if (downloaded) mediaDownloaded++;
    }
  } catch (mediaErr) {
    console.warn(`[IncrementalSync] Media sync note for ${key}:`, mediaErr.message);
  }

  // 4. Strip localhost URLs
  const cleanSnapshot = sanitizeLocalhostUrls(snapshot);

  // 5. Commit atomically to active master and public backups
  const commitResult = safeCommitSnapshot(cleanSnapshot, {
    source: `incremental-sync (${key})`,
    mode: 'live-incremental'
  });

  // 6. Export single static JSON collection
  if (Array.isArray(cleanSnapshot[key])) {
    safeAtomicWrite(path.join(ROOT, 'public/data', `${key}.json`), cleanSnapshot[key]);
    if (key.includes('-')) {
      safeAtomicWrite(path.join(ROOT, 'public/data', `${key.replace(/-/g, '_')}.json`), cleanSnapshot[key]);
    }
  }

  const latencyMs = Math.round(performance.now() - startTime);

  return {
    success: commitResult.success,
    key,
    action,
    latencyMs,
    mediaDownloaded,
    collectionsCount: Object.keys(cleanSnapshot).length
  };
}
