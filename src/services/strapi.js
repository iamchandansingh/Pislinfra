import offlineBackup from '../data/MainBackupPislinfra.json';

export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

let cmsOfflineState = false;
let failedAttempts = 0;
let successfulAttempts = 0;
const listeners = new Set();

// ==========================================
// 1. BRAND NAME SANITIZER (PISL INFRA -> Pislinfra)
// ==========================================
export const sanitizeBrandText = (data) => {
  if (!data) return data;
  if (typeof data === 'string') {
    return data
      .replace(/PISL\s+INFRA\./gi, 'Pislinfra.')
      .replace(/PISL\s+INFRA/gi, 'Pislinfra')
      .replace(/PISL\s+Infra\./g, 'Pislinfra.')
      .replace(/PISL\s+Infra/g, 'Pislinfra')
      .replace(/Pisl\s+Infra\./g, 'Pislinfra.')
      .replace(/Pisl\s+Infra/g, 'Pislinfra')
      .replace(/Pisl\s+infra/g, 'Pislinfra');
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeBrandText);
  }
  if (typeof data === 'object') {
    const clean = {};
    for (const key in data) {
      clean[key] = sanitizeBrandText(data[key]);
    }
    return clean;
  }
  return data;
};

// ==========================================
// 2. REAL-TIME CMS STATUS NOTIFIER
// ==========================================
const notifyStatus = (isOffline) => {
  if (cmsOfflineState !== isOffline) {
    cmsOfflineState = isOffline;
    listeners.forEach((cb) => {
      try { cb(isOffline); } catch (e) {}
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pisl-cms-status', { detail: { offline: isOffline } }));
    }
  }
};

export const subscribeCmsStatus = (callback) => {
  listeners.add(callback);
  callback(cmsOfflineState);
  return () => listeners.delete(callback);
};

export const isCmsOffline = () => cmsOfflineState;

// ==========================================
// 3. ENTERPRISE INDEXEDDB HIGH-CAPACITY STORAGE
// (Handles 12,000+ blogs without 5MB limits)
// ==========================================
const DB_NAME = 'Pislinfra_Offline_Engine';
const DB_VERSION = 1;
const STORE_NAME = 'cms_cache';

const openIDB = () => {
  if (typeof window === 'undefined' || !window.indexedDB) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'endpoint' });
        }
      };
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
};

const saveToIDB = async (endpoint, data) => {
  try {
    const db = await openIDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ endpoint, data, updatedAt: Date.now() });
  } catch (e) {}
};

const getFromIDB = async (endpoint) => {
  try {
    const db = await openIDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(endpoint);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
};

// ==========================================
// 4. ENTERPRISE 3-TIER DATA FETCHING ENGINE
// ==========================================
export const fetchStrapiData = async (endpoint) => {
  // ── OPTION 1: LIVE CLOUD CMS FETCH (Neon DB + Cloudflare + Strapi) ──
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s Neon cloud DB tolerance

    const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    // If server responds with valid status (< 500), server is 100% online
    if (response.status < 500) {
      successfulAttempts++;
      failedAttempts = 0;
      notifyStatus(false); // CMS is ONLINE (Footer remains clean & hidden)

      if (response.ok) {
        const json = await response.json();
        if (json && json.data) {
          const cleanData = sanitizeBrandText(json.data);

          // 1-Second Instant Local Backup Sync:
          // A) High-capacity IndexedDB (for 12,000+ blogs & jobs)
          saveToIDB(endpoint, cleanData);

          // B) Fast Browser LocalStorage
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              window.localStorage.setItem(`pisl_cache_${endpoint}`, JSON.stringify(cleanData));
            } catch (e) {}
          }

          // C) Hostinger Server Disk Sync (PHP API Snapshot in background)
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              fetch('/sync-backup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint, data: cleanData })
              }).catch(() => {});
            }, 500);
          }

          return cleanData;
        }
      }
    } else {
      failedAttempts++;
      if (failedAttempts >= 2 && successfulAttempts === 0) {
        notifyStatus(true); // Trigger Offline Mode in footer
      }
    }
  } catch (error) {
    // Network failure / Connection Refused / Neon DB billing timeout
    failedAttempts++;
    if (failedAttempts >= 2 && successfulAttempts === 0) {
      notifyStatus(true); // Trigger Offline Mode in footer
    }
  }

  // ── OPTION 2: HIGH-CAPACITY CLIENT STORAGE (IndexedDB & LocalStorage) ──
  // A) Check IndexedDB (Instant Gigabyte Storage)
  const idbData = await getFromIDB(endpoint);
  if (idbData) {
    return sanitizeBrandText(idbData);
  }

  // B) Check LocalStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const localCached = window.localStorage.getItem(`pisl_cache_${endpoint}`);
      if (localCached) {
        return sanitizeBrandText(JSON.parse(localCached));
      }
    } catch (e) {}
  }

  // ── OPTION 3: HOSTINGER DISK BACKUP & BUNDLED HARDCODED REPOSITORY ──
  // A) Check Hostinger Server Disk Live Backup
  if (typeof window !== 'undefined') {
    try {
      const hostingerRes = await fetch(`/sync-backup.php?endpoint=${encodeURIComponent(endpoint)}`, { cache: 'no-cache' });
      if (hostingerRes.ok) {
        const hostingerJson = await hostingerRes.json();
        if (hostingerJson) {
          return sanitizeBrandText(hostingerJson);
        }
      }
    } catch (e) {}
  }

  // B) Bundled Static JSON Fallback (MainBackupPislinfra.json)
  if (offlineBackup) {
    if (offlineBackup[endpoint]) {
      return sanitizeBrandText(offlineBackup[endpoint]);
    }
    const baseKey = endpoint.split('?')[0];
    if (offlineBackup[baseKey]) {
      return sanitizeBrandText(offlineBackup[baseKey]);
    }

    // Check slug filter (e.g. solution-pages?filters[slug]=warehouse)
    const slugMatch = endpoint.match(/filters\[slug\](?:\[\$eq\])?=([a-zA-Z0-9_-]+)/);
    if (slugMatch && slugMatch[1]) {
      const slugKey = `${baseKey}-${slugMatch[1]}`;
      if (offlineBackup[slugKey]) {
        return sanitizeBrandText(offlineBackup[slugKey]);
      }
    }
  }

  return null;
};
