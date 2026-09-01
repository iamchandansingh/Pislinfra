import offlineBackup from '../data/MainBackupPislinfra.json';

const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '0.0.0.0' ||
  window.location.hostname.endsWith('.local')
);

// If on live production (pislinfra.com), NEVER attempt to query localhost/127.0.0.1 (prevents Chrome Private Network Access popup)
export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL 
  ? import.meta.env.VITE_STRAPI_URL 
  : (isLocalhost ? 'http://localhost:1337' : '');

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

const getLocalBackup = (endpoint) => {
  if (!offlineBackup) return null;
  if (offlineBackup[endpoint]) {
    return sanitizeBrandText(offlineBackup[endpoint]);
  }
  const baseKey = endpoint.split('?')[0];
  if (offlineBackup[baseKey]) {
    return sanitizeBrandText(offlineBackup[baseKey]);
  }
  const slugMatch = endpoint.match(/filters\[slug\](?:\[\$eq\])?=([a-zA-Z0-9_-]+)/);
  if (slugMatch && slugMatch[1]) {
    const slugKey = `${baseKey}-${slugMatch[1]}`;
    if (offlineBackup[slugKey]) {
      return sanitizeBrandText(offlineBackup[slugKey]);
    }
  }
  return null;
};

// ==========================================
// 4. ENTERPRISE 4-TIER DATA FETCHING & AUTO-SYNC ENGINE
// ==========================================
export const fetchStrapiData = async (endpoint) => {
  // If no STRAPI_URL configured on live production domain, seamlessly use offline tiers
  if (!STRAPI_URL) {
    const idbData = await getFromIDB(endpoint);
    if (idbData) return sanitizeBrandText(idbData);

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const localCached = window.localStorage.getItem(`pisl_cache_${endpoint}`);
        if (localCached) return sanitizeBrandText(JSON.parse(localCached));
      } catch (e) {}
    }

    if (typeof window !== 'undefined') {
      try {
        const hostingerRes = await fetch(`/sync-backup.php?endpoint=${encodeURIComponent(endpoint)}`, { cache: 'no-cache' });
        if (hostingerRes.ok) {
          const hostingerJson = await hostingerRes.json();
          if (hostingerJson) return sanitizeBrandText(hostingerJson);
        }
      } catch (e) {}
    }

    return getLocalBackup(endpoint);
  }

  // ── TIER 1: LIVE CLOUD CMS FETCH (Neon DB + Cloudflare + Strapi) ──
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
      notifyStatus(false);

      if (response.ok) {
        const json = await response.json();
        if (json && json.data) {
          const cleanData = sanitizeBrandText(json.data);

          // Instant Real-Time Multi-Tier Persistence:
          // A) High-capacity IndexedDB (for 12,000+ blogs & jobs)
          saveToIDB(endpoint, cleanData);

          // B) Fast Browser LocalStorage
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              window.localStorage.setItem(`pisl_cache_${endpoint}`, JSON.stringify(cleanData));
            } catch (e) {}
          }

          // C) Hostinger Shared Hosting Server Disk Snapshot (POST /sync-backup.php)
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
        notifyStatus(true);
      }
    }
  } catch (error) {
    failedAttempts++;
    if (failedAttempts >= 2 && successfulAttempts === 0) {
      notifyStatus(true);
    }
  }

  // ── TIER 2: HIGH-CAPACITY CLIENT STORAGE (IndexedDB & LocalStorage) ──
  const idbData = await getFromIDB(endpoint);
  if (idbData) {
    return sanitizeBrandText(idbData);
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const localCached = window.localStorage.getItem(`pisl_cache_${endpoint}`);
      if (localCached) {
        return sanitizeBrandText(JSON.parse(localCached));
      }
    } catch (e) {}
  }

  // ── TIER 3: HOSTINGER DISK BACKUP SNAPSHOT ──
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

  // ── TIER 4: BUNDLED STATIC JSON REPOSITORY (MainBackupPislinfra.json) ──
  return getLocalBackup(endpoint);
};
