import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '../..');
const BACKUP_PATH = path.join(ROOT, 'src/data/MainBackupPislinfra.json');
const HOSTINGER_BACKUP_PATH = path.join(ROOT, 'public/data/live-backup.json');
const BACKUPS_DIR = path.join(ROOT, 'src/data/backups');
const LATEST_SNAPSHOT_PATH = path.join(BACKUPS_DIR, 'snapshot-latest.json');
const MANIFEST_PATH = path.join(BACKUPS_DIR, 'manifest.json');
const SYNC_CURSOR_PATH = path.join(BACKUPS_DIR, 'sync-cursor.json');
const SYNC_STATUS_PATH = path.join(BACKUPS_DIR, 'sync-status.json');
const PUBLIC_DATA_DIR = path.join(ROOT, 'public/data');
const DIST_DATA_DIR = path.join(ROOT, 'dist/data');

if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DATA_DIR)) fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });

/**
 * Performs an atomic write by writing to a unique temporary file and renaming it.
 * Prevents partially written or corrupted files during unexpected shutdowns.
 */
export function safeAtomicWrite(targetPath, data) {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const tempPath = `${targetPath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 8)}`;
  
  fs.writeFileSync(tempPath, content, 'utf8');
  fs.renameSync(tempPath, targetPath);
}

/**
 * Validates integrity of a snapshot before allowing it to overwrite active files.
 */
export function validateSnapshot(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { isValid: false, reason: 'Snapshot must be a non-empty key-value object', counts: {} };
  }

  const keys = Object.keys(data);
  if (keys.length < 5) {
    return { isValid: false, reason: `Snapshot has too few collections (${keys.length} < 5)`, counts: {} };
  }

  const counts = {};
  for (const k of keys) {
    if (Array.isArray(data[k])) {
      counts[k] = data[k].length;
    } else if (data[k] && typeof data[k] === 'object') {
      counts[k] = Object.keys(data[k]).length;
    }
  }

  // Critical collections must not be completely empty if they existed
  const critical = ['ongoing-projects', 'completed-projects', 'awards', 'blogs', 'home-page', 'about-page'];
  const missing = critical.filter(k => {
    const val = data[k] || data[k.split('?')[0]];
    if (!val) return true;
    if (Array.isArray(val) && val.length === 0) return true;
    return false;
  });

  if (missing.length > 2) {
    return {
      isValid: false,
      reason: `Snapshot is missing critical collections: ${missing.join(', ')}`,
      counts
    };
  }

  return { isValid: true, reason: 'Valid', counts };
}

/**
 * Loads the current active snapshot, falling back to latest backup if available.
 */
export function loadCurrentSnapshot() {
  if (fs.existsSync(BACKUP_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));
    } catch (e) {}
  }
  if (fs.existsSync(LATEST_SNAPSHOT_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(LATEST_SNAPSHOT_PATH, 'utf8'));
    } catch (e) {}
  }
  return {};
}

/**
 * Creates a versioned snapshot on disk and cleans up older snapshots keeping the 10 most recent.
 */
export function createHistoricalSnapshot(data, metadata = {}) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `snapshot-${timestamp}.json`;
  const filePath = path.join(BACKUPS_DIR, filename);

  safeAtomicWrite(filePath, data);
  safeAtomicWrite(LATEST_SNAPSHOT_PATH, data);

  const manifest = {
    timestamp: new Date().toISOString(),
    filename,
    source: metadata.source || 'unknown',
    collectionsCount: Object.keys(data).length,
    counts: metadata.counts || {},
    mediaStats: metadata.mediaStats || {},
    mode: metadata.mode || 'live-sync',
    status: 'VALIDATED_AND_COMMITTED'
  };

  safeAtomicWrite(MANIFEST_PATH, manifest);

  // Rotate snapshots: keep 10 latest
  try {
    const files = fs.readdirSync(BACKUPS_DIR)
      .filter(f => f.startsWith('snapshot-20') && f.endsWith('.json'))
      .sort();
    if (files.length > 10) {
      const toDelete = files.slice(0, files.length - 10);
      for (const oldFile of toDelete) {
        try { fs.unlinkSync(path.join(BACKUPS_DIR, oldFile)); } catch (e) {}
      }
    }
  } catch (e) {}

  return manifest;
}

/**
 * Safely commits a snapshot to all public and bundled locations after validation using atomic writes.
 */
export function safeCommitSnapshot(data, metadata = {}) {
  const validation = validateSnapshot(data);
  if (!validation.isValid) {
    console.error(`❌ Snapshot validation failed: ${validation.reason}`);
    // Do NOT overwrite valid existing data with corrupted data
    if (fs.existsSync(LATEST_SNAPSHOT_PATH)) {
      console.warn(`🔄 Restoring from last-known-good snapshot (${LATEST_SNAPSHOT_PATH})...`);
      const fallback = JSON.parse(fs.readFileSync(LATEST_SNAPSHOT_PATH, 'utf8'));
      return { success: false, fallbackUsed: true, data: fallback, reason: validation.reason };
    }
    return { success: false, fallbackUsed: false, data, reason: validation.reason };
  }

  metadata.counts = validation.counts;

  // 1. Write active local master database atomically
  safeAtomicWrite(BACKUP_PATH, data);
  safeAtomicWrite(HOSTINGER_BACKUP_PATH, data);

  // 2. Write to dist/data/ if dist exists
  if (fs.existsSync(DIST_DATA_DIR)) {
    safeAtomicWrite(path.join(DIST_DATA_DIR, 'live-backup.json'), data);
  }

  // 3. Create versioned snapshot and manifest
  const manifest = createHistoricalSnapshot(data, metadata);

  return { success: true, manifest, data };
}

/**
 * Writes individual static JSON collections to public/data and dist/data for decoupled CDN consumption.
 */
export function exportStaticCollections(data) {
  if (fs.existsSync(path.resolve(ROOT, 'dist')) && !fs.existsSync(DIST_DATA_DIR)) {
    fs.mkdirSync(DIST_DATA_DIR, { recursive: true });
  }

  const writeStatic = (filename, content) => {
    if (!content) return;
    safeAtomicWrite(path.join(PUBLIC_DATA_DIR, filename), content);
    if (fs.existsSync(DIST_DATA_DIR)) {
      safeAtomicWrite(path.join(DIST_DATA_DIR, filename), content);
    }
  };

  for (const [key, val] of Object.entries(data)) {
    const baseKey = key.split('?')[0];
    if (Array.isArray(val) && val.length > 0) {
      writeStatic(`${baseKey}.json`, val);
      if (baseKey.includes('-')) {
        writeStatic(`${baseKey.replace(/-/g, '_')}.json`, val);
      }
    }
  }
}

/**
 * Loads the persisted synchronization cursor.
 */
export function loadSyncCursor() {
  if (fs.existsSync(SYNC_CURSOR_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(SYNC_CURSOR_PATH, 'utf8'));
    } catch (e) {}
  }
  return { lastSyncTime: 0, lastIso: null, cursors: {} };
}

/**
 * Atomically saves the synchronization cursor.
 */
export function saveSyncCursor(cursorData) {
  safeAtomicWrite(SYNC_CURSOR_PATH, cursorData);
}

/**
 * Loads the current live synchronization status.
 */
export function loadSyncStatus() {
  if (fs.existsSync(SYNC_STATUS_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(SYNC_STATUS_PATH, 'utf8'));
    } catch (e) {}
  }
  return {
    status: 'INITIALIZING',
    lastSuccessfulSync: null,
    syncLatencyMs: null,
    lastEvent: null,
    error: null,
    recoveryAttempts: 0
  };
}

/**
 * Atomically updates the live synchronization status.
 */
export function updateSyncStatus(patch = {}) {
  const current = loadSyncStatus();
  const updated = { ...current, ...patch, updatedAt: new Date().toISOString() };
  safeAtomicWrite(SYNC_STATUS_PATH, updated);
  return updated;
}
