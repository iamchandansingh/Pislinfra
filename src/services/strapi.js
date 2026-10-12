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
// 2.1 CACHE VERSIONING & INSTANT PURGE
// (Busts legacy browser cache so visitors instantly get latest projects)
// ==========================================
export const CACHE_VERSION = 'v7_2026_10_12_pmg_neemrana_fix';

if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const currentVersion = window.localStorage.getItem('pisl_cache_version');
    if (currentVersion !== CACHE_VERSION) {
      console.log('🔄 New Pislinfra version detected. Purging legacy cache...');
      const keysToRemove = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && (k.startsWith('pisl_cache_') || k.startsWith('strapi_'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => window.localStorage.removeItem(k));
      window.localStorage.setItem('pisl_cache_version', CACHE_VERSION);

      if (window.indexedDB) {
        try {
          window.indexedDB.deleteDatabase('Pislinfra_Offline_Engine');
        } catch (e) {}
      }
    }
  } catch (e) {}
}

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

const unwrapData = (val) => {
  if (val && typeof val === 'object' && val.data !== undefined && (Array.isArray(val.data) || (typeof val.data === 'object' && val.data !== null))) {
    return val.data;
  }
  return val;
};

const getLocalBackup = (endpoint) => {
  if (!offlineBackup) return null;
  let raw = null;
  if (offlineBackup[endpoint]) {
    raw = offlineBackup[endpoint];
  } else {
    const baseKey = endpoint.split('?')[0];
    if (offlineBackup[baseKey]) {
      raw = offlineBackup[baseKey];
    } else {
      const slugMatch = endpoint.match(/filters\[slug\](?:\[\$eq\])?=([a-zA-Z0-9_-]+)/);
      if (slugMatch && slugMatch[1]) {
        const slugKey = `${baseKey}-${slugMatch[1]}`;
        if (offlineBackup[slugKey]) {
          raw = offlineBackup[slugKey];
        }
      }
    }
  }
  if (!raw) return null;
  return sanitizeBrandText(unwrapData(raw));
};

// Live fetch directly from Strapi CMS with resilient timeout, deduplication and fallback
export const fetchStrapiData = async (endpoint, options = {}) => {
  const { forceFresh = false } = options;

  // Normalize endpoint: Strip heavy sort=createdAt:* when querying Strapi because Render free tier times out on sorting populated relations
  const trimmed = (endpoint || '').replace(/^\/?(api\/)?/, '');
  const cleanEndpoint = trimmed
    .replace(/([?&])sort=createdAt:(asc|desc)(&|$)/, (m, p1, p2, p3) => (p1 === '?' && p3 ? '?' : ''))
    .replace(/[?&]$/, '')
    .replace(/&&+/g, '&');

  // In-flight deduplication: prevent flooding Strapi with identical concurrent queries
  if (!forceFresh && inFlightRequests.has(cleanEndpoint)) {
    return inFlightRequests.get(cleanEndpoint);
  }

  const fetchPromise = (async () => {
    const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes fresh cache limit

    // 1. LIVE NETWORK FETCH FIRST (Always prioritize fresh data from Strapi CMS)
    const candidateUrls = isLocalhost
      ? ['', 'http://localhost:1337', import.meta.env.VITE_STRAPI_URL || 'https://cms-pislinfra.onrender.com']
      : [import.meta.env.VITE_STRAPI_URL || 'https://cms-pislinfra.onrender.com'];

    for (const baseUrl of candidateUrls) {
      if (baseUrl === undefined || baseUrl === null) continue;
      try {
        const controller = new AbortController();
        // Give local Strapi and remote CMS plenty of time to populate relations
        const timeoutMs = 15000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const sep = cleanEndpoint.includes('?') ? '&' : '?';
        const requestUrl = (isLocalhost || forceFresh)
          ? `${baseUrl}/api/${cleanEndpoint}${sep}_t=${Date.now()}`
          : `${baseUrl}/api/${cleanEndpoint}`;

        const response = await fetch(requestUrl, {
          cache: 'no-store',
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const json = await response.json();
          if (json && json.data) {
            const cleanData = sanitizeBrandText(json.data);
            memoryCache.set(endpoint, cleanData);
            memoryCache.set(cleanEndpoint, cleanData);
            lastFetchedTime.set(endpoint, Date.now());
            lastFetchedTime.set(cleanEndpoint, Date.now());
            saveToIDB(cleanEndpoint, cleanData);
            saveToIDB(endpoint, cleanData);

            if (typeof window !== 'undefined' && window.localStorage) {
              try { 
                window.localStorage.setItem(`pisl_cache_${cleanEndpoint}`, JSON.stringify(cleanData));
                window.localStorage.setItem(`pisl_cache_${endpoint}`, JSON.stringify(cleanData));
                window.localStorage.setItem(`pisl_cache_time_${cleanEndpoint}`, Date.now().toString());
                window.localStorage.setItem(`pisl_cache_time_${endpoint}`, Date.now().toString());
              } catch (e) {}
            }

            if (typeof window !== 'undefined') {
              if (isLocalhost) {
                try {
                  fetch('/__api/save-main-backup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: cleanEndpoint, data: cleanData })
                  }).catch(() => {});
                } catch (e) {}
              } else {
                // On live Hostinger production: Automatically save live Strapi updates to Hostinger disk DB
                try {
                  fetch('/sync-backup.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: cleanEndpoint, data: cleanData })
                  }).catch(() => {});
                } catch (e) {}
              }
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
    if (memoryCache.has(cleanEndpoint)) {
      return memoryCache.get(cleanEndpoint);
    }

    // 3. FALLBACK: Hostinger Server Disk Backup (Direct from server disk live-backup)
    if (typeof window !== 'undefined' && !isLocalhost) {
      try {
        const hostingerRes = await fetch(`/sync-backup.php?endpoint=${encodeURIComponent(cleanEndpoint)}`, { cache: 'no-cache' });
        if (hostingerRes.ok) {
          const hostingerJson = await hostingerRes.json();
          if (hostingerJson) {
            const cleanHostinger = sanitizeBrandText(unwrapData(hostingerJson));
            memoryCache.set(endpoint, cleanHostinger);
            memoryCache.set(cleanEndpoint, cleanHostinger);
            return cleanHostinger;
          }
        }
      } catch (e) {}
    }

    // 4. FALLBACK: LocalStorage Cache (within valid TTL, only in remote production)
    if (typeof window !== 'undefined' && window.localStorage && !isLocalhost) {
      try {
        const cacheTime = window.localStorage.getItem(`pisl_cache_time_${cleanEndpoint}`) || window.localStorage.getItem(`pisl_cache_time_${endpoint}`);
        if (cacheTime && (Date.now() - Number(cacheTime) < CACHE_TTL_MS)) {
          const localCached = window.localStorage.getItem(`pisl_cache_${cleanEndpoint}`) || window.localStorage.getItem(`pisl_cache_${endpoint}`);
          if (localCached) {
            const parsed = sanitizeBrandText(unwrapData(JSON.parse(localCached)));
            memoryCache.set(endpoint, parsed);
            memoryCache.set(cleanEndpoint, parsed);
            return parsed;
          }
        }
      } catch (e) {}
    }

    // 5. FALLBACK: IndexedDB
    const idbData = (await getFromIDB(cleanEndpoint)) || (await getFromIDB(endpoint));
    if (idbData) {
      const cleanIdb = sanitizeBrandText(unwrapData(idbData));
      memoryCache.set(endpoint, cleanIdb);
      memoryCache.set(cleanEndpoint, cleanIdb);
      return cleanIdb;
    }

    // 6. LAST RESORT FALLBACK: Bundled Offline Fallback (MainBackupPislinfra.json)
    const localFallback = getLocalBackup(cleanEndpoint) || getLocalBackup(endpoint);
    if (localFallback) {
      memoryCache.set(endpoint, localFallback);
      memoryCache.set(cleanEndpoint, localFallback);
      return localFallback;
    }

    return null;
  })();

  inFlightRequests.set(cleanEndpoint, fetchPromise);
  try {
    const res = await fetchPromise;
    return res;
  } finally {
    inFlightRequests.delete(cleanEndpoint);
  }
};
