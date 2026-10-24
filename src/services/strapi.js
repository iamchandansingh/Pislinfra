export const isLocalhost = Boolean(
  import.meta.env.DEV &&
  typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0' ||
    window.location.hostname.endsWith('.local')
  )
);

// In development on localhost, prioritize local Strapi (http://127.0.0.1:1337) so edits reflect instantly.
// On live production, use VITE_STRAPI_URL or Render.
export const STRAPI_URL = (import.meta.env.DEV && isLocalhost)
  ? 'http://127.0.0.1:1337'
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
  // Never show offline mode on localhost
  if (isLocalhost) {
    if (cmsOfflineState !== false) {
      cmsOfflineState = false;
      listeners.forEach((cb) => {
        try { cb(false); } catch (e) {}
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('pisl-cms-status', { detail: { offline: false } }));
      }
    }
    return;
  }

  if (isOffline) {
    failedAttempts++;
    if (failedAttempts < 3) return; // Only trigger offline mode after 3 consecutive failures
  } else {
    failedAttempts = 0;
  }

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
export const CACHE_VERSION = 'v12_2026_10_23_cover_fix';

if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const currentVersion = window.localStorage.getItem('pisl_cache_version');
    if (currentVersion !== CACHE_VERSION) {
      console.log('🔄 New Pislinfra version detected. Purging legacy cache...');
      const keysToRemove = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k !== 'pisl_cache_version' && (k.startsWith('pisl_') || k.startsWith('strapi_'))) {
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

import mainBackupData from '../data/MainBackupPislinfra.json';

const memoryCache = new Map();
const lastFetchedTime = new Map();
const inFlightRequests = new Map();
const backgroundRevalidating = new Set();

const unwrapData = (val) => {
  if (val && typeof val === 'object' && val.data !== undefined && (Array.isArray(val.data) || (typeof val.data === 'object' && val.data !== null))) {
    return val.data;
  }
  return val;
};

// ==========================================
// 4. INSTANT SYNCHRONOUS LOCAL DATA RETRIEVAL (0ms First-Paint)
// ==========================================
export const getLocalDataSync = (endpoint) => {
  if (!endpoint) return null;
  const trimmed = (endpoint || '').replace(/^\/?(api\/)?/, '');
  const cleanEndpoint = trimmed
    .replace(/([?&])sort=createdAt:(asc|desc)(&|$)/, (m, p1, p2, p3) => (p1 === '?' && p3 ? '?' : ''))
    .replace(/[?&]$/, '')
    .replace(/&&+/g, '&');

  // 1. Memory Cache (0ms)
  if (memoryCache.has(endpoint)) return memoryCache.get(endpoint);
  if (memoryCache.has(cleanEndpoint)) return memoryCache.get(cleanEndpoint);

  // 2. Client LocalStorage Cache (0ms)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const cached = window.localStorage.getItem(`pisl_cache_${cleanEndpoint}`) || window.localStorage.getItem(`pisl_cache_${endpoint}`);
      if (cached) {
        const parsed = sanitizeBrandText(unwrapData(JSON.parse(cached)));
        if (parsed) {
          memoryCache.set(endpoint, parsed);
          memoryCache.set(cleanEndpoint, parsed);
          return parsed;
        }
      }
    } catch (e) {}
  }

  // 3. Bundled MainBackupPislinfra Database (0ms)
  if (mainBackupData) {
    let raw = null;
    if (mainBackupData[endpoint]) {
      raw = mainBackupData[endpoint];
    } else if (mainBackupData[cleanEndpoint]) {
      raw = mainBackupData[cleanEndpoint];
    } else {
      const baseKey = cleanEndpoint.split('?')[0];
      if (mainBackupData[baseKey]) {
        raw = mainBackupData[baseKey];
      } else {
        const slugMatch = cleanEndpoint.match(/filters\[slug\](?:\[\$eq\])?=([a-zA-Z0-9_-]+)/);
        if (slugMatch && slugMatch[1]) {
          const slugKey = `${baseKey}-${slugMatch[1]}`;
          if (mainBackupData[slugKey]) {
            raw = mainBackupData[slugKey];
          }
        }
      }
    }

    if (raw) {
      const clean = sanitizeBrandText(unwrapData(raw));
      memoryCache.set(endpoint, clean);
      memoryCache.set(cleanEndpoint, clean);
      return clean;
    }
  }

  return null;
};

// ==========================================
// 5. BACKGROUND NETWORK REVALIDATION (Stale-While-Revalidate)
// ==========================================
const revalidateInBackground = (endpoint, cleanEndpoint) => {
  if (typeof window === 'undefined') return;

  // Revalidate cooldown: 0ms on localhost for instant CMS edits, 30s on production
  const cooldown = isLocalhost ? 0 : 30000;
  const lastTime = lastFetchedTime.get(cleanEndpoint) || lastFetchedTime.get(endpoint) || 0;
  if (!isLocalhost && Date.now() - lastTime < cooldown) return;
  if (backgroundRevalidating.has(cleanEndpoint)) return;
  backgroundRevalidating.add(cleanEndpoint);

  (async () => {
    try {
      const cleanData = await fetchFromNetwork(endpoint, cleanEndpoint, isLocalhost, 6000);
      if (cleanData) {
        lastFetchedTime.set(endpoint, Date.now());
        lastFetchedTime.set(cleanEndpoint, Date.now());
        // Notify components of background live data update
        window.dispatchEvent(new CustomEvent('pisl-data-update', {
          detail: { endpoint, cleanEndpoint, data: cleanData }
        }));
      }
    } catch (e) {
      // Background revalidation failed silently, user already has local data
    } finally {
      backgroundRevalidating.delete(cleanEndpoint);
    }
  })();
};

// ==========================================
// 6. LOW-LEVEL NETWORK FETCHER
// ==========================================
const fetchFromNetwork = async (endpoint, cleanEndpoint, forceFresh = false, customTimeoutMs = null) => {
  if (inFlightRequests.has(cleanEndpoint)) {
    return inFlightRequests.get(cleanEndpoint);
  }

  const fetchPromise = (async () => {
    const candidateUrls = (import.meta.env.DEV && isLocalhost)
      ? ['http://127.0.0.1:1337']
      : [import.meta.env.VITE_STRAPI_URL || 'https://cms-pislinfra.onrender.com'];

    for (const baseUrl of candidateUrls) {
      if (!baseUrl) continue;
      let timeoutId = null;
      try {
        const controller = new AbortController();
        const timeoutMs = customTimeoutMs || (isLocalhost ? 30000 : 15000);
        timeoutId = setTimeout(() => {
          try { controller.abort(); } catch (e) {}
        }, timeoutMs);

        if (forceFresh) {
          memoryCache.delete(endpoint);
          memoryCache.delete(cleanEndpoint);
        }

        const requestUrl = `${baseUrl}/api/${cleanEndpoint}`;
        const response = await fetch(requestUrl, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          signal: controller.signal
        });

        if (response.ok) {
          const json = await response.json();
          if (json && json.data) {
            const cleanData = sanitizeBrandText(unwrapData(json.data));
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
        // Continue to fallback
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    }

    // Secondary fallback: Hostinger disk backup on live production
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

    // Tertiary fallback: IndexedDB
    const idbData = (await getFromIDB(cleanEndpoint)) || (await getFromIDB(endpoint));
    if (idbData) {
      const cleanIdb = sanitizeBrandText(unwrapData(idbData));
      memoryCache.set(endpoint, cleanIdb);
      memoryCache.set(cleanEndpoint, cleanIdb);
      return cleanIdb;
    }

    // Final fallback: Local synchronous database
    const localFallback = getLocalDataSync(cleanEndpoint) || getLocalDataSync(endpoint);
    if (localFallback) return localFallback;

    return null;
  })();

  inFlightRequests.set(cleanEndpoint, fetchPromise);
  try {
    return await fetchPromise;
  } finally {
    inFlightRequests.delete(cleanEndpoint);
  }
};

// ==========================================
// 7. PRIMARY FAST DATA FETCHER (0ms Local-First + SWR)
// ==========================================
export const fetchStrapiData = async (endpoint, options = {}) => {
  const { forceFresh = false } = options;

  const trimmed = (endpoint || '').replace(/^\/?(api\/)?/, '');
  const cleanEndpoint = trimmed
    .replace(/([?&])sort=createdAt:(asc|desc)(&|$)/, (m, p1, p2, p3) => (p1 === '?' && p3 ? '?' : ''))
    .replace(/[?&]$/, '')
    .replace(/&&+/g, '&');

  // FAST PATH: Return immediately from local backup/cache in 0ms!
  if (!forceFresh) {
    const instantLocal = getLocalDataSync(cleanEndpoint) || getLocalDataSync(endpoint);
    if (instantLocal) {
      // Revalidate in background so live CMS updates still propagate without delaying page paint
      revalidateInBackground(endpoint, cleanEndpoint);
      return instantLocal;
    }
  }

  // SLOW PATH: Await network only when forced fresh or when local data is absent
  return await fetchFromNetwork(endpoint, cleanEndpoint, forceFresh);
};

export const getStrapiMediaUrl = (img, fallback = '') => {
  if (!img) return fallback;
  if (Array.isArray(img)) {
    if (img.length === 0) return fallback;
    img = img[0];
  }
  if (typeof img === 'string') {
    if (!img.trim()) return fallback;
    if (img.startsWith('http') || img.startsWith('//')) return img;
    return img.startsWith('/') ? `${STRAPI_URL}${img}` : `${STRAPI_URL}/${img}`;
  }
  const rawUrl = img.url || img.data?.attributes?.url || img.data?.url || img.formats?.large?.url || img.formats?.medium?.url || img.formats?.small?.url;
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  if (rawUrl.startsWith('http') || rawUrl.startsWith('//')) return rawUrl;
  return rawUrl.startsWith('/') ? `${STRAPI_URL}${rawUrl}` : `${STRAPI_URL}/${rawUrl}`;
};

