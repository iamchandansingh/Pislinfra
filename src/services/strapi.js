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

let cmsOfflineState = !STRAPI_URL;
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

// Background live sync worker without blocking UI
const revalidateInBackground = (endpoint) => {
  if (!STRAPI_URL) {
    notifyStatus(true);
    return;
  }
  const now = Date.now();
  if (lastFetchedTime.has(endpoint) && now - lastFetchedTime.get(endpoint) < 15000) {
    return;
  }
  if (inFlightRequests.has(endpoint)) return;

  const fetchPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
        signal: controller.signal
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
            try { window.localStorage.setItem(`pisl_cache_${endpoint}`, JSON.stringify(cleanData)); } catch (e) {}
          }
          if (typeof window !== 'undefined') {
            fetch('/sync-backup.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ endpoint, data: cleanData })
            }).catch(() => {});
          }
          notifyStatus(false);
          return cleanData;
        }
      } else {
        notifyStatus(true);
      }
    } catch (e) {
      notifyStatus(true);
    } finally {
      inFlightRequests.delete(endpoint);
    }
  })();

  inFlightRequests.set(endpoint, fetchPromise);
};

// ==========================================
// 4. ENTERPRISE 0ms SWR DATA ENGINE
// ==========================================
export const fetchStrapiData = async (endpoint) => {
  // 1. FAST PATH: Memory Cache (0ms response)
  if (memoryCache.has(endpoint)) {
    revalidateInBackground(endpoint);
    return memoryCache.get(endpoint);
  }

  // 2. FAST PATH: LocalStorage Cache (0.1ms response)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const localCached = window.localStorage.getItem(`pisl_cache_${endpoint}`);
      if (localCached) {
        const parsed = sanitizeBrandText(JSON.parse(localCached));
        memoryCache.set(endpoint, parsed);
        revalidateInBackground(endpoint);
        return parsed;
      }
    } catch (e) {}
  }

  // 3. FAST PATH: Bundled Offline Fallback (Instant 0ms response)
  const localFallback = getLocalBackup(endpoint);
  if (localFallback) {
    memoryCache.set(endpoint, localFallback);
    revalidateInBackground(endpoint);
    return localFallback;
  }

  // 4. Check IndexedDB
  const idbData = await getFromIDB(endpoint);
  if (idbData) {
    const cleanIdb = sanitizeBrandText(idbData);
    memoryCache.set(endpoint, cleanIdb);
    revalidateInBackground(endpoint);
    return cleanIdb;
  }

  // 5. Check Hostinger Server Disk Backup
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

  // 6. Direct Live Strapi Fetch if nothing else is available
  if (STRAPI_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (json && json.data) {
          const cleanData = sanitizeBrandText(json.data);
          memoryCache.set(endpoint, cleanData);
          saveToIDB(endpoint, cleanData);
          return cleanData;
        }
      }
    } catch (error) {}
  }

  return null;
};
