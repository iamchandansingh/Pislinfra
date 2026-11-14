import { getImageUrl } from '../utils/imageUrl.js';
import mainBackupData from '../data/MainBackupPislinfra.json';

export const isLocalhost = Boolean(
  import.meta.env.DEV &&
  typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0' ||
    window.location.hostname.endsWith('.local')
  )
);

const DEFAULT_WP_ORIGIN = import.meta.env.VITE_WP_URL || (
  (import.meta.env.DEV && isLocalhost)
    ? 'http://127.0.0.1:8080'
    : (typeof window !== 'undefined' ? `${window.location.origin}/wp-cms` : '')
);

export const WP_URL = (DEFAULT_WP_ORIGIN || '').replace(/\/+$/, '');
export const WP_API_BASE = (
  import.meta.env.VITE_WP_API_URL ||
  (WP_URL ? `${WP_URL}/wp-json/pislinfra/v1` : '')
).replace(/\/+$/, '');

let cmsOfflineState = false;
let failedAttempts = 0;
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
// 2. CMS CONNECTIVITY STATUS NOTIFIER
// ==========================================
const notifyStatus = (isOffline) => {
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
    if (failedAttempts < 3) return;
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

export const CACHE_VERSION = 'v14_2026_11_12_wordpress_headless';

if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const currentVersion = window.localStorage.getItem('pisl_cache_version');
    if (currentVersion !== CACHE_VERSION) {
      const keysToRemove = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k !== 'pisl_cache_version' && (k.startsWith('pisl_') || k.startsWith('strapi_') || k.startsWith('wp_'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
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
// 3. INDEXEDDB HIGH-CAPACITY FALLBACK STORAGE
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
    tx.objectStore(STORE_NAME).put({ endpoint, data, updatedAt: Date.now() });
  } catch (e) {}
};

const getFromIDB = async (endpoint) => {
  try {
    const db = await openIDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(endpoint);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
};

const memoryCache = new Map();
const inFlightRequests = new Map();
const staticJsonRequests = new Map();

const unwrapData = (val) => {
  if (val && typeof val === 'object' && val.data !== undefined && (Array.isArray(val.data) || (typeof val.data === 'object' && val.data !== null))) {
    return val.data;
  }
  return val;
};

/**
 * Translates historical endpoint strings and query params cleanly to WordPress REST paths
 * under /wp-json/pislinfra/v1/<resource>.
 */
export const normalizeEndpoint = (endpoint) => {
  const raw = (endpoint || '').replace(/^\/?(?:api\/|wp-json\/pislinfra\/v1\/)?/, '');
  const [rawPath, rawQuery = ''] = raw.split('?');

  const pathAliases = {
    'press-release': 'press-releases',
    'timeline-milestones': 'milestones',
    governance: 'governance-page',
  };
  const cleanPath = pathAliases[rawPath] || rawPath;

  if (!rawQuery) return cleanPath;

  const keptParams = [];
  for (const part of rawQuery.split('&')) {
    if (!part) continue;
    // Strip populate=* / populate[...] params (WordPress REST responses are always pre-populated)
    if (part.startsWith('populate')) continue;
    keptParams.push(part);
  }
  return keptParams.length > 0 ? `${cleanPath}?${keptParams.join('&')}` : cleanPath;
};

const stripSortCreatedAt = (endpoint) =>
  (endpoint || '')
    .replace(/^\/?(api\/)?/, '')
    .replace(/([?&])sort=createdAt:(asc|desc)(&|$)/, (m, p1, p2, p3) => (p1 === '?' && p3 ? '?' : ''))
    .replace(/[?&]$/, '')
    .replace(/&&+/g, '&');

// ==========================================
// 4. SYNCHRONOUS LOCAL FALLBACK RETRIEVAL (0ms First-Paint + Offline Resilience)
// ==========================================
export const getLocalDataSync = (endpoint) => {
  if (!endpoint) return null;
  const cleanEndpoint = stripSortCreatedAt(endpoint);
  const wpKey = normalizeEndpoint(endpoint);

  if (memoryCache.has(endpoint)) return memoryCache.get(endpoint);
  if (memoryCache.has(cleanEndpoint)) return memoryCache.get(cleanEndpoint);
  if (memoryCache.has(wpKey)) return memoryCache.get(wpKey);

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const cached =
        window.localStorage.getItem(`pisl_cache_${wpKey}`) ||
        window.localStorage.getItem(`pisl_cache_${cleanEndpoint}`) ||
        window.localStorage.getItem(`pisl_cache_${endpoint}`);
      if (cached) {
        const parsed = sanitizeBrandText(unwrapData(JSON.parse(cached)));
        if (parsed) {
          memoryCache.set(endpoint, parsed);
          memoryCache.set(wpKey, parsed);
          return parsed;
        }
      }
    } catch (e) {}
  }

  if (mainBackupData) {
    let raw = null;
    const baseKey = cleanEndpoint.split('?')[0];
    if (mainBackupData[endpoint]) {
      raw = mainBackupData[endpoint];
    } else if (mainBackupData[cleanEndpoint]) {
      raw = mainBackupData[cleanEndpoint];
    } else if (mainBackupData[wpKey]) {
      raw = mainBackupData[wpKey];
    } else {
      const slugMatch = cleanEndpoint.match(/filters\[slug\](?:\[\$eq\]|\[\])?=([^&]+)/);
      if (slugMatch && slugMatch[1]) {
        const slugVal = decodeURIComponent(slugMatch[1]).trim().toLowerCase();
        const slugKey = `${baseKey}-${slugVal}`;
        if (mainBackupData[slugKey]) {
          raw = mainBackupData[slugKey];
        } else if (mainBackupData[baseKey]) {
          const pool = unwrapData(mainBackupData[baseKey]);
          if (Array.isArray(pool)) {
            const matched = pool.find((item) => {
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
      memoryCache.set(wpKey, clean);
      return clean;
    }
  }

  return null;
};

const fetchStaticJsonFallback = async (cleanEndpoint) => {
  if (typeof window === 'undefined' || !cleanEndpoint) return null;
  const baseKey = cleanEndpoint.split('?')[0];
  if (staticJsonRequests.has(baseKey)) {
    const json = await staticJsonRequests.get(baseKey);
    return json ? sanitizeBrandText(unwrapData(json)) : null;
  }

  const req = (async () => {
    const controller = new AbortController();
    const tId = setTimeout(() => { try { controller.abort(); } catch (_) {} }, 2000);
    try {
      const resp = await fetch(`/data/${baseKey}.json`, { cache: 'no-cache', signal: controller.signal });
      clearTimeout(tId);
      if (!resp.ok) return null;
      return await resp.json();
    } catch (_) {
      clearTimeout(tId);
      return null;
    }
  })();

  staticJsonRequests.set(baseKey, req);
  const json = await req;
  if (!json) return null;
  let resolved = unwrapData(json);
  const slugMatch = cleanEndpoint.match(/filters\[slug\](?:\[\$eq\]|\[\])?=([^&]+)/);
  if (slugMatch && slugMatch[1] && Array.isArray(resolved)) {
    const slugVal = decodeURIComponent(slugMatch[1]).trim().toLowerCase();
    const matched = resolved.find((item) => (item.slug || '').toLowerCase() === slugVal);
    if (matched) resolved = [matched];
  }
  return sanitizeBrandText(resolved);
};

// ==========================================
// 5. LIVE WORDPRESS REST API FETCHER (+ GRACEFUL OFFLINE FALLBACK)
// ==========================================
const getEndpointBase = (wpEndpoint) => String(wpEndpoint || '').split('?')[0].replace(/^\/+|\/+$/g, '');

export const getPreviewContext = () => {
  if (typeof window === 'undefined' || !window.location) return null;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('pisl_preview') !== '1') return null;
    const type = (params.get('pisl_type') || '').trim();
    const id = (params.get('pisl_id') || '').trim();
    const exp = (params.get('pisl_exp') || '').trim();
    const sig = (params.get('pisl_sig') || '').trim();
    if (!type || !id || !exp || !sig) return null;
    return { active: true, type, id, exp, sig };
  } catch (_) {
    return null;
  }
};

export const fetchPreviewRecord = async (ctx = getPreviewContext()) => {
  if (!ctx || !WP_API_BASE) return null;
  try {
    const qs = new URLSearchParams({
      type: ctx.type,
      id: ctx.id,
      exp: ctx.exp,
      sig: ctx.sig,
    }).toString();
    const res = await fetch(`${WP_API_BASE}/preview?${qs}`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || !json.data) return null;
    return {
      ...json,
      data: sanitizeBrandText(unwrapData(json.data)),
    };
  } catch (_) {
    return null;
  }
};

export const fetchAdminSession = async (route = '/') => {
  if (!WP_API_BASE) return { authenticated: false };
  try {
    const qs = new URLSearchParams({ route }).toString();
    const res = await fetch(`${WP_API_BASE}/admin-session?${qs}`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return { authenticated: false };
    return await res.json();
  } catch (_) {
    return { authenticated: false };
  }
};

export const triggerCacheBump = async (wpRestNonce) => {
  if (!WP_API_BASE || !wpRestNonce) return false;
  try {
    const res = await fetch(`${WP_API_BASE}/cache/bump`, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'X-WP-Nonce': wpRestNonce,
      },
    });
    return res.ok;
  } catch (_) {
    return false;
  }
};

export const clearLocalSiteCache = () => {
  memoryCache.clear();
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const toRemove = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && (k.startsWith('pisl_') || k.startsWith('strapi_') || k.startsWith('wp_'))) {
          toRemove.push(k);
        }
      }
      toRemove.forEach((k) => window.localStorage.removeItem(k));
    } catch (_) {}
  }
};

export const fetchWpData = async (endpoint, options = {}) => {
  if (!endpoint) return null;
  const wpEndpoint = normalizeEndpoint(endpoint);
  const cleanEndpoint = stripSortCreatedAt(endpoint);
  const previewCtx = getPreviewContext();
  const basePath = getEndpointBase(wpEndpoint);
  const matchesPreview = Boolean(
    previewCtx && (basePath === previewCtx.type || basePath.startsWith(`${previewCtx.type}/`))
  );

  if (matchesPreview) {
    const previewRes = await fetchPreviewRecord(previewCtx);
    if (previewRes && previewRes.data) {
      const previewItem = previewRes.data;
      const isSingleLookup = basePath.includes('/') || /filters\[(slug|documentId)\]/.test(wpEndpoint);
      const isCollectionEndpoint = wpEndpoint.includes('pagination') || wpEndpoint.includes('filters[') || wpEndpoint.includes('sort=') || [
        'blogs', 'ongoing-projects', 'completed-projects', 'case-studies', 'awards',
        'clients', 'client-appreciations', 'coverage-markers', 'job-openings',
        'solution-pages', 'policy-documents', 'milestones', 'press-releases'
      ].includes(basePath);

      if (!isCollectionEndpoint || basePath.includes('/')) {
        memoryCache.set(wpEndpoint, previewItem);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('pisl-data-update', {
            detail: { endpoint, cleanEndpoint, wpEndpoint, data: previewItem },
          }));
        }
        return previewItem;
      }

      if (isSingleLookup) {
        const arr = [previewItem];
        memoryCache.set(wpEndpoint, arr);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('pisl-data-update', {
            detail: { endpoint, cleanEndpoint, wpEndpoint, data: arr },
          }));
        }
        return arr;
      }

      // Collection list: merge unpublished preview item into published list in-memory only
      try {
        const listRes = await fetch(`${WP_API_BASE}/${wpEndpoint}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        const listJson = listRes.ok ? await listRes.json() : null;
        const baseList = Array.isArray(listJson?.data) ? sanitizeBrandText(unwrapData(listJson.data)) : [];
        const merged = [
          previewItem,
          ...baseList.filter((it) =>
            String(it?.id) !== String(previewItem?.id) &&
            (!previewItem?.documentId || it?.documentId !== previewItem.documentId)
          ),
        ];
        memoryCache.set(wpEndpoint, merged);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('pisl-data-update', {
            detail: { endpoint, cleanEndpoint, wpEndpoint, data: merged },
          }));
        }
        return merged;
      } catch (_) {
        return [previewItem];
      }
    }
  }

  // Deduplicate concurrent identical requests within the same render tick
  if (inFlightRequests.has(wpEndpoint) && !options.forceFresh) {
    return inFlightRequests.get(wpEndpoint);
  }

  const requestPromise = (async () => {
    // Attempt live WordPress REST API first so admin edits reflect immediately
    if (typeof fetch !== 'undefined' && WP_API_BASE) {
      const controller = new AbortController();
      const timeoutMs = options.timeoutMs || 4500;
      const tId = setTimeout(() => { try { controller.abort(); } catch (_) {} }, timeoutMs);
      try {
        const res = await fetch(`${WP_API_BASE}/${wpEndpoint}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: options.forceFresh ? 'no-store' : 'no-cache',
          signal: controller.signal,
        });
        clearTimeout(tId);

        if (res.ok) {
          const json = await res.json();
          if (json && json.data !== undefined && json.data !== null) {
            const cleanData = sanitizeBrandText(unwrapData(json.data));
            const prevCached = memoryCache.get(wpEndpoint);

            memoryCache.set(endpoint, cleanData);
            memoryCache.set(cleanEndpoint, cleanData);
            memoryCache.set(wpEndpoint, cleanData);
            notifyStatus(false);

            try {
              if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(`pisl_cache_${wpEndpoint}`, JSON.stringify(cleanData));
              }
            } catch (_) {}
            saveToIDB(wpEndpoint, cleanData);

            if (typeof window !== 'undefined' && (!prevCached || JSON.stringify(prevCached) !== JSON.stringify(cleanData))) {
              try {
                window.dispatchEvent(
                  new CustomEvent('pisl-data-update', {
                    detail: { endpoint, cleanEndpoint, wpEndpoint, data: cleanData },
                  })
                );
              } catch (_) {}
            }
            return cleanData;
          }
        }
      } catch (_) {
        clearTimeout(tId);
      }
    }

    // Offline / build fallback chain: IDB -> Static JSON -> Bundled MainBackup
    const idbData = await getFromIDB(wpEndpoint);
    if (idbData) {
      return sanitizeBrandText(idbData);
    }

    const staticData = await fetchStaticJsonFallback(cleanEndpoint);
    if (staticData) {
      memoryCache.set(wpEndpoint, staticData);
      return staticData;
    }

    notifyStatus(true);
    return getLocalDataSync(cleanEndpoint) || getLocalDataSync(endpoint);
  })();

  inFlightRequests.set(wpEndpoint, requestPromise);
  try {
    return await requestPromise;
  } finally {
    inFlightRequests.delete(wpEndpoint);
  }
};

export const getWpMediaUrl = (img, fallback = '') => {
  if (!img) return fallback;
  if (Array.isArray(img)) {
    if (img.length === 0) return fallback;
    img = img[0];
  }
  return getImageUrl(img, fallback);
};

// ==========================================
// 3. SEO CONFIG, REDIRECTS & 404 MONITOR
// ==========================================
let seoConfigCache = null;
let seoConfigFetchedAt = 0;
let seoConfigPromise = null;

export const fetchSeoConfig = async (force = false) => {
  const now = Date.now();
  if (!force && seoConfigCache && now - seoConfigFetchedAt < 60000) {
    return seoConfigCache;
  }
  if (!force && seoConfigPromise) {
    return seoConfigPromise;
  }
  seoConfigPromise = (async () => {
    try {
      const res = await fetch(`${WP_API_BASE}/seo-config`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-cache',
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          seoConfigCache = json.data;
          seoConfigFetchedAt = Date.now();
          return seoConfigCache;
        }
      }
    } catch (_) {}
    return seoConfigCache;
  })();
  try {
    return await seoConfigPromise;
  } finally {
    seoConfigPromise = null;
  }
};

export const matchSeoRedirect = (pathname, redirects) => {
  if (!pathname || !Array.isArray(redirects) || redirects.length === 0) return null;
  const norm = ('/' + String(pathname).trim().replace(/^\/+/, '').replace(/\/+$/, '')).toLowerCase() || '/';
  return redirects.find((r) => {
    if (!r || !r.active || !r.source || !r.target) return false;
    const src = ('/' + String(r.source).trim().replace(/^\/+/, '').replace(/\/+$/, '')).toLowerCase() || '/';
    return src === norm;
  }) || null;
};

export const log404Hit = async (path) => {
  if (!path || typeof fetch === 'undefined') return;
  try {
    await fetch(`${WP_API_BASE}/log-404`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: String(path).slice(0, 255),
        referrer: typeof document !== 'undefined' ? (document.referrer || '').slice(0, 255) : '',
      }),
    });
  } catch (_) {}
};
