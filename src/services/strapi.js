import { getImageUrl } from '../utils/imageUrl.js';

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
      const slugMatch = cleanEndpoint.match(/filters\[slug\](?:\[\$eq\]|\[\])?=([^&]+)/);
      if (slugMatch && slugMatch[1]) {
        const slugVal = decodeURIComponent(slugMatch[1]).trim().toLowerCase();
        const slugKey = `${baseKey}-${slugVal}`;
        if (mainBackupData[slugKey]) {
          raw = mainBackupData[slugKey];
        } else if (mainBackupData[baseKey]) {
          const pool = unwrapData(mainBackupData[baseKey]);
          if (Array.isArray(pool)) {
            const matched = pool.find(item => {
              const s = (item.slug || item.attributes?.slug || '').toLowerCase();
              const docId = (item.documentId || item.id || '').toString().toLowerCase();
              return s === slugVal || docId === slugVal;
            });
            if (matched) raw = [matched];
          }
        }
      } else if (mainBackupData[baseKey]) {
        raw = mainBackupData[baseKey];
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
// 5. 100% LOCAL-FIRST PRODUCTION DATA FETCHER (0ms)
// Zero visitor-side Strapi dependency, zero polling, zero external latency
// ==========================================
export const fetchStrapiData = async (endpoint, options = {}) => {
  const { forceFresh = false } = options;

  const trimmed = (endpoint || '').replace(/^\/?(api\/)?/, '');
  const cleanEndpoint = trimmed
    .replace(/([?&])sort=createdAt:(asc|desc)(&|$)/, (m, p1, p2, p3) => (p1 === '?' && p3 ? '?' : ''))
    .replace(/[?&]$/, '')
    .replace(/&&+/g, '&');

  // FAST PATH: Return immediately from local backup/cache in 0ms!
  const instantLocal = (!forceFresh || !isLocalhost)
    ? (getLocalDataSync(cleanEndpoint) || getLocalDataSync(endpoint))
    : null;

  if (instantLocal) {
    return instantLocal;
  }

  // SECONDARY PATH: In browser, check local static file (/data/<baseKey>.json) with 2500ms safety timeout
  if (typeof window !== 'undefined') {
    const baseKey = cleanEndpoint.split('?')[0];
    try {
      const controller = new AbortController();
      const tId = setTimeout(() => {
        try { controller.abort(); } catch (_) {}
      }, 2500);
      const resp = await fetch(`/data/${baseKey}.json`, { cache: 'no-cache', signal: controller.signal });
      clearTimeout(tId);
      if (resp.ok) {
        const json = await resp.json();
        if (json) {
          let resolved = unwrapData(json);
          const slugMatch = cleanEndpoint.match(/filters\[slug\](?:\[\$eq\]|\[\])?=([^&]+)/);
          if (slugMatch && slugMatch[1] && Array.isArray(resolved)) {
            const slugVal = decodeURIComponent(slugMatch[1]).trim().toLowerCase();
            const matched = resolved.find(item => {
              const s = (item.slug || item.attributes?.slug || '').toLowerCase();
              const docId = (item.documentId || item.id || '').toString().toLowerCase();
              return s === slugVal || docId === slugVal;
            });
            if (matched) resolved = [matched];
          }
          const clean = sanitizeBrandText(resolved);
          memoryCache.set(endpoint, clean);
          memoryCache.set(cleanEndpoint, clean);
          return clean;
        }
      }
    } catch (e) {}
  }

  // TERTIARY PATH: In local dev only (localhost:5173), if developer explicitly passed forceFresh: true
  // and local Strapi is running on 127.0.0.1:1337, try fetching with 2500ms timeout
  if (import.meta.env.DEV && isLocalhost && forceFresh) {
    try {
      const controller = new AbortController();
      const tId = setTimeout(() => {
        try { controller.abort(); } catch (_) {}
      }, 2500);
      try {
        const res = await fetch(`http://127.0.0.1:1337/api/${cleanEndpoint}`, {
          signal: controller.signal
        });
        clearTimeout(tId);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            const cleanData = sanitizeBrandText(unwrapData(json.data));
            memoryCache.set(endpoint, cleanData);
            memoryCache.set(cleanEndpoint, cleanData);
            return cleanData;
          }
        }
      } catch (_) {
        clearTimeout(tId);
      }
    } catch (e) {}
  }

  // FINAL FALLBACK: Local synchronous data
  const fallback = getLocalDataSync(cleanEndpoint) || getLocalDataSync(endpoint);
  if (fallback) return fallback;

  return null;
};

export const getStrapiMediaUrl = (img, fallback = '') => {
  if (!img) return fallback;
  if (Array.isArray(img)) {
    if (img.length === 0) return fallback;
    img = img[0];
  }
  return getImageUrl(img, fallback);
};

