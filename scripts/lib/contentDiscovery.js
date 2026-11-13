import { sanitizeBrand } from './dataAdapters.js';

const WP_CANDIDATE_BASES = [
  process.env.VITE_WP_API_URL,
  'http://127.0.0.1:8080/wp-json/pislinfra/v1',
  'http://localhost:8080/wp-json/pislinfra/v1',
  'https://cms.pislinfra.com/wp-json/pislinfra/v1',
].filter(Boolean);

/**
 * Standard Pislinfra CMS endpoints served cleanly by WordPress Headless CMS (/wp-json/pislinfra/v1/*).
 */
export const CORE_ENDPOINTS = [
  // Collections
  { key: 'ongoing-projects', endpoint: 'ongoing-projects', isCollection: true },
  { key: 'completed-projects', endpoint: 'completed-projects', isCollection: true },
  { key: 'awards', endpoint: 'awards', isCollection: true },
  { key: 'blogs', endpoint: 'blogs', isCollection: true },
  { key: 'clients', endpoint: 'clients?sort=order:asc', isCollection: true },
  { key: 'client-appreciations', endpoint: 'client-appreciations', isCollection: true },
  { key: 'coverage-markers', endpoint: 'coverage-markers', isCollection: true },
  { key: 'job-openings', endpoint: 'job-openings', isCollection: true },
  { key: 'case-studies', endpoint: 'case-studies', isCollection: true },
  { key: 'solution-pages', endpoint: 'solution-pages', isCollection: true },
  { key: 'policy-documents', endpoint: 'policy-documents?sort=displayOrder:asc', isCollection: true },
  { key: 'milestones', endpoint: 'milestones', isCollection: true },
  { key: 'press-releases', endpoint: 'press-releases', isCollection: true },

  // Single-Types
  { key: 'home-page', endpoint: 'home-page', isCollection: false },
  { key: 'about-page', endpoint: 'about-page', isCollection: false },
  { key: 'leadership-page', endpoint: 'leadership-page', isCollection: false },
  { key: 'ehs-page', endpoint: 'ehs-page', isCollection: false },
  { key: 'csr-page', endpoint: 'csr-page', isCollection: false },
  { key: 'career-page', endpoint: 'career-page', isCollection: false },
  { key: 'awards-page', endpoint: 'awards-page', isCollection: false },
  { key: 'blog-page', endpoint: 'blog-page', isCollection: false },
  { key: 'case-study-page', endpoint: 'case-study-page', isCollection: false },
  { key: 'annual-report-page', endpoint: 'annual-report-page', isCollection: false },
  { key: 'policy-page', endpoint: 'policy-page', isCollection: false },
  { key: 'governance-page', endpoint: 'governance-page', isCollection: false },
  { key: 'contact-page', endpoint: 'contact-page', isCollection: false },
  { key: 'completed-page', endpoint: 'completed-page', isCollection: false },
  { key: 'ongoing-page', endpoint: 'ongoing-page', isCollection: false },
  { key: 'warehouse-page', endpoint: 'warehouse-page', isCollection: false },
  { key: 'top-header', endpoint: 'top-header', isCollection: false },
  { key: 'header', endpoint: 'header', isCollection: false },
  { key: 'footer', endpoint: 'footer', isCollection: false },

  // Solution filters
  { key: 'solution-pages-solutions', endpoint: 'solution-pages?filters[slug]=solutions', isCollection: false },
  { key: 'solution-pages-industrial', endpoint: 'solution-pages?filters[slug]=industrial', isCollection: false },
  { key: 'solution-pages-infrastructure', endpoint: 'solution-pages?filters[slug]=infrastructure', isCollection: false },
  { key: 'solution-pages-logistic', endpoint: 'solution-pages?filters[slug]=logistic', isCollection: false },
  { key: 'solution-pages-warehouse', endpoint: 'solution-pages?filters[slug]=warehouse', isCollection: false },
];

export async function fetchJson(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache, no-store',
        Pragma: 'no-cache',
        'User-Agent': 'PislinfraWordPressSync/1.0',
      },
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function detectActiveWordPress() {
  for (const apiBase of WP_CANDIDATE_BASES) {
    try {
      const health = await fetchJson(`${apiBase.replace(/\/+$/, '')}/health`, 5000);
      if (health && health.ok) {
        return apiBase.replace(/\/+$/, '');
      }
    } catch (e) {}
  }
  return null;
}

export function unwrapData(val) {
  if (!val) return val;
  if (typeof val === 'object' && val.data !== undefined) {
    return unwrapData(val.data);
  }
  if (Array.isArray(val)) {
    return val.map(unwrapData);
  }
  return val;
}

export async function fetchWithPagination(apiBase, endpointInfo) {
  const { endpoint, isCollection } = endpointInfo;
  const separator = endpoint.includes('?') ? '&' : '?';

  let allItems = [];
  let currentPage = 1;
  let pageCount = 1;

  do {
    const pagedUrl = isCollection
      ? `${apiBase}/${endpoint}${separator}pagination[page]=${currentPage}&pagination[pageSize]=100`
      : `${apiBase}/${endpoint}`;

    const json = await fetchJson(pagedUrl, 15000);
    if (!json) break;

    if (isCollection) {
      if (Array.isArray(json.data)) {
        allItems = allItems.concat(json.data);
      }
      if (json.meta?.pagination?.pageCount) {
        pageCount = json.meta.pagination.pageCount;
      } else {
        break;
      }
      currentPage++;
    } else {
      allItems = json.data || json;
      break;
    }
  } while (isCollection && currentPage <= pageCount);

  return unwrapData(allItems);
}

/**
 * Syncs live content exclusively from WordPress Headless CMS with local snapshot fallback.
 * Zero Neon DB or Render dependency.
 */
export async function discoverAndSyncWebsiteContent(currentSnapshot = {}) {
  const report = {
    source: 'verified-local-snapshot',
    endpointsDiscovered: CORE_ENDPOINTS.length,
    endpointsSynced: 0,
    failures: [],
    sourcesChecked: [],
  };

  const updatedData = { ...currentSnapshot };

  console.log('📡 Checking WordPress Headless CMS REST API...');
  const activeWp = await detectActiveWordPress();
  report.sourcesChecked.push({
    name: 'WordPress REST API',
    url: activeWp,
    status: activeWp ? 'CONNECTED' : 'OFFLINE',
  });

  if (activeWp) {
    console.log(`✅ Connected to WordPress REST API at ${activeWp}`);
    report.source = `wordpress (${activeWp})`;

    const BATCH_SIZE = 4;
    for (let i = 0; i < CORE_ENDPOINTS.length; i += BATCH_SIZE) {
      const batch = CORE_ENDPOINTS.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (ep) => {
          try {
            const res = await fetchWithPagination(activeWp, ep);
            if (res !== null && res !== undefined) {
              const clean = sanitizeBrand(res);
              updatedData[ep.key] = clean;
              updatedData[ep.endpoint] = clean;
              report.endpointsSynced++;
            }
          } catch (err) {
            report.failures.push({ key: ep.key, error: err.message });
          }
        })
      );
    }

    return { data: updatedData, report };
  }

  console.log('ℹ️ WordPress REST API offline during build. Using verified local snapshot.');
  return { data: updatedData, report };
}
