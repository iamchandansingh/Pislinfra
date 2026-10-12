import offlineBackup from '../data/MainBackupPislinfra.json';

const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '0.0.0.0' ||
  window.location.hostname.endsWith('.local')
);

// In development on localhost, prioritize local Strapi (http://localhost:1337) so edits reflect instantly.
// On live production, use VITE_STRAPI_URL or Render.
export const STRAPI_URL = isLocalhost
  ? 'http://localhost:1337'
  : (import.meta.env.VITE_STRAPI_URL || 'https://cms-pislinfra.onrender.com');

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

const memoryCache = new Map();
const lastFetchedTime = new Map();
const inFlightRequests = new Map();

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

// Live fetch directly from Strapi CMS with resilient timeout and fallback
export const fetchStrapiData = async (endpoint, options = {}) => {
  const { forceFresh = false } = options;

  // 1. LIVE NETWORK FETCH FIRST (Always prioritize fresh data from Strapi CMS)
  const candidateUrls = isLocalhost
    ? ['http://localhost:1337', import.meta.env.VITE_STRAPI_URL || 'https://cms-pislinfra.onrender.com']
    : [import.meta.env.VITE_STRAPI_URL || 'https://cms-pislinfra.onrender.com'];

  for (const baseUrl of candidateUrls) {
    if (!baseUrl) continue;
    try {
      const controller = new AbortController();
      const timeoutMs = baseUrl.includes('localhost') ? 3000 : 10000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${baseUrl}/api/${endpoint}`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (json && json.data) {
          const cleanData = sanitizeBrandText(json.data);
          memoryCache.set(endpoint, cleanData);
          lastFetchedTime.set(endpoint, Date.now());
          saveToIDB(endpoint, cleanData);
          if (typeof window !== 'undefined' && window.localStorage) {
            try { 
              window.localStorage.setItem(`pisl_cache_${endpoint}`, JSON.stringify(cleanData));
              window.localStorage.setItem(`pisl_cache_time_${endpoint}`, Date.now().toString());
            } catch (e) {}
          }
          notifyStatus(false);
          return cleanData;
        }
      }
    } catch (e) {
      // Failed on current host, try next candidate
    }
  }

  notifyStatus(true);

  // 2. FALLBACK: Memory Cache
  if (memoryCache.has(endpoint)) {
    return memoryCache.get(endpoint);
  }

  // 3. FALLBACK: LocalStorage Cache
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const localCached = window.localStorage.getItem(`pisl_cache_${endpoint}`);
      if (localCached) {
        const parsed = sanitizeBrandText(JSON.parse(localCached));
        memoryCache.set(endpoint, parsed);
        return parsed;
      }
    } catch (e) {}
  }

  // 4. FALLBACK: IndexedDB
  const idbData = await getFromIDB(endpoint);
  if (idbData) {
    const cleanIdb = sanitizeBrandText(idbData);
    memoryCache.set(endpoint, cleanIdb);
    return cleanIdb;
  }

  // 5. FALLBACK: Hostinger Server Disk Backup
  if (typeof window !== 'undefined') {
    try {
      const hostingerRes = await fetch(`/sync-backup.php?endpoint=${encodeURIComponent(endpoint)}`, { cache: 'no-cache' });
      if (hostingerRes.ok) {
        const hostingerJson = await hostingerRes.json();
        if (hostingerJson) {
          const cleanHostinger = sanitizeBrandText(hostingerJson);
          memoryCache.set(endpoint, cleanHostinger);
          return cleanHostinger;
        }
      }
    } catch (e) {}
  }

  // 6. LAST RESORT FALLBACK: Bundled Offline Fallback (MainBackupPislinfra.json)
  const localFallback = getLocalBackup(endpoint);
  if (localFallback) {
    memoryCache.set(endpoint, localFallback);
    return localFallback;
  }

  return null;
};
