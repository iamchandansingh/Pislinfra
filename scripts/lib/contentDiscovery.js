import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sanitizeBrand } from './dataAdapters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NEON_CONNECTION_STRING = 'postgresql://neondb_owner:npg_0veFtX8HTnmY@ep-mute-voice-axlrx2cj.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';
const NEON_SQL_ENDPOINT = 'https://ep-mute-voice-axlrx2cj.c-4.us-east-2.aws.neon.tech/sql';
const HOSTINGER_SYNC_URL = 'https://pislinfra.com/sync-backup.php';

const STRAPI_CANDIDATE_URLS = [
  'http://127.0.0.1:1337',
  'http://localhost:1337',
  process.env.VITE_STRAPI_URL || 'https://cms-pislinfra.onrender.com'
];

/**
 * List of known standard website endpoints.
 * Newly introduced endpoints in Strapi are also discovered dynamically via Core Store & Schema.
 */
export const CORE_ENDPOINTS = [
  // Collections (pluralized endpoints)
  { key: 'ongoing-projects', endpoint: 'ongoing-projects?populate=*', isCollection: true },
  { key: 'completed-projects', endpoint: 'completed-projects?populate=*', isCollection: true },
  { key: 'awards', endpoint: 'awards?populate=*&sort=createdAt:desc', isCollection: true },
  { key: 'blogs', endpoint: 'blogs?populate=*&sort=createdAt:desc', isCollection: true },
  { key: 'clients', endpoint: 'clients?sort=order:asc&populate=*', isCollection: true },
  { key: 'client-appreciations', endpoint: 'client-appreciations?populate=*', isCollection: true },
  { key: 'coverage-markers', endpoint: 'coverage-markers?populate=*', isCollection: true },
  { key: 'job-openings', endpoint: 'job-openings', isCollection: true },
  { key: 'case-studies', endpoint: 'case-studies?populate=*&sort=createdAt:asc', isCollection: true },
  { key: 'solution-pages', endpoint: 'solution-pages?populate=*', isCollection: true },
  { key: 'milestones', endpoint: 'milestones?populate=*&sort=year:asc', isCollection: true },
  { key: 'timeline-milestones', endpoint: 'timeline-milestones?populate=*&sort=year:asc', isCollection: true },

  // Single-Types (individual pages & global blocks)
  { key: 'home-page', endpoint: 'home-page?populate=*', isCollection: false },
  { key: 'about-page', endpoint: 'about-page?populate[0]=heroImage&populate[1]=seo&populate[2]=stats&populate[3]=capabilities&populate[4]=values&populate[5]=companyProfile.file&populate[6]=companyProfile.coverImage&populate[7]=resources.file&populate[8]=resources.coverImage', isCollection: false },
  { key: 'leadership-page', endpoint: 'leadership-page?populate[0]=heroImage&populate[1]=seo&populate[2]=topLeaderImage&populate[3]=topLeaderHighlights&populate[4]=executives.image&populate[5]=coreTeam.image', isCollection: false },
  { key: 'ehs-page', endpoint: 'ehs-page?populate[0]=heroImage&populate[1]=seo&populate[2]=gallery.image&populate[3]=stats&populate[4]=features&populate[5]=philosophy.image&populate[6]=awards.image&populate[7]=rules&populate[8]=resources&populate[9]=approaches&populate[10]=pillars&populate[11]=programs&populate[12]=resources.file&populate[13]=resources.coverImage&populate[14]=resourcesCoverImage', isCollection: false },
  { key: 'csr-page', endpoint: 'csr-page?populate=seo,heroImage,philosophyImages,stats,focusAreas.image,givingBackCards.image,environmentCards.image,celebrationCards.image', isCollection: false },
  { key: 'career-page', endpoint: 'career-page?populate[0]=heroImage&populate[1]=seo&populate[2]=benefits&populate[3]=processSteps', isCollection: false },
  { key: 'awards-page', endpoint: 'awards-page?populate[0]=heroImage&populate[1]=seo', isCollection: false },
  { key: 'blog-page', endpoint: 'blog-page?populate=seo,heroImage', isCollection: false },
  { key: 'case-study-page', endpoint: 'case-study-page?populate=seo,heroImage,approachSteps,trustedClients.logo', isCollection: false },
  { key: 'annual-report-page', endpoint: 'annual-report-page?populate[0]=heroImage&populate[1]=seo&populate[2]=reports&populate[3]=reports.pdfFile', isCollection: false },
  { key: 'policy-page', endpoint: 'policy-page?populate[0]=heroImage&populate[1]=seo&populate[2]=sections', isCollection: false },
  { key: 'governance-page', endpoint: 'governance-page?populate[heroCoverImage]=true&populate[seo][populate][0]=ogImage&populate[policies][sort][0]=displayOrder:asc&populate[policies][populate][coverImage]=true&populate[policies][populate][pdfFile]=true', isCollection: false },
  { key: 'contact-page', endpoint: 'contact-page?populate[0]=heroImage&populate[1]=seo.ogImage&populate[2]=seo.twitterImage', isCollection: false },
  { key: 'completed-page', endpoint: 'completed-page?populate=seo,heroImage', isCollection: false },
  { key: 'ongoing-page', endpoint: 'ongoing-page?populate=seo,heroImage', isCollection: false },
  { key: 'warehouse-page', endpoint: 'warehouse-page?populate=*', isCollection: false },
  { key: 'top-header', endpoint: 'top-header', isCollection: false },
  { key: 'header', endpoint: 'header?populate[0]=logo&populate[1]=navigation.subLinks', isCollection: false },
  { key: 'footer', endpoint: 'footer?populate[0]=logo&populate[1]=companyLinks&populate[2]=resourceLinks&populate[3]=solutionLinks', isCollection: false },

  // Solution Specific Filters
  { key: 'solution-pages-industrial', endpoint: 'solution-pages?filters[slug]=industrial&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=whyPislImage&populate[3]=features&populate[4]=seo', isCollection: false },
  { key: 'solution-pages-infrastructure', endpoint: 'solution-pages?filters[slug]=infrastructure&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=whyPislImage&populate[3]=features&populate[4]=seo', isCollection: false },
  { key: 'solution-pages-logistic', endpoint: 'solution-pages?filters[slug]=logistic&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=grids.items&populate[3]=seo', isCollection: false },
  { key: 'solution-pages-warehouse', endpoint: 'solution-pages?filters[slug]=warehouse&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=grids.items&populate[3]=seo', isCollection: false }
];

export async function fetchJson(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache, no-store',
        'Pragma': 'no-cache',
        'User-Agent': 'PislinfraUniversalSync/2.0'
      }
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Pings candidate sources to identify active Strapi instance.
 */
export async function detectActiveStrapi() {
  for (const url of STRAPI_CANDIDATE_URLS) {
    if (!url) continue;
    try {
      // 10-second ping to handle cold start
      const ping = await fetchJson(`${url}/api/home-page`, 10000);
      if (ping && (ping.data || ping.error === undefined)) {
        return url;
      }
    } catch (e) {}
  }
  return null;
}

/**
 * Unwraps Strapi 4/5 response structure.
 */
export function unwrapData(val) {
  if (!val) return val;
  if (typeof val === 'object' && val.data !== undefined) {
    return unwrapData(val.data);
  }
  if (Array.isArray(val)) {
    return val.map(unwrapData);
  }
  if (typeof val === 'object') {
    if (val.attributes && typeof val.attributes === 'object') {
      const merged = { id: val.id, documentId: val.documentId, ...val.attributes };
      return unwrapData(merged);
    }
    const clean = {};
    for (const [k, v] of Object.entries(val)) {
      clean[k] = unwrapData(v);
    }
    return clean;
  }
  return val;
}

/**
 * Fetches an endpoint with full pagination support until all records have been retrieved.
 */
export async function fetchWithPagination(baseUrl, endpointInfo) {
  const { key, endpoint, isCollection } = endpointInfo;
  const separator = endpoint.includes('?') ? '&' : '?';

  let allItems = [];
  let currentPage = 1;
  let pageCount = 1;
  let firstResponse = null;

  do {
    const pagedUrl = isCollection
      ? `${baseUrl}/api/${endpoint}${separator}pagination[page]=${currentPage}&pagination[pageSize]=100`
      : `${baseUrl}/api/${endpoint}`;

    const json = await fetchJson(pagedUrl, 20000);
    if (!json) break;

    if (!firstResponse) firstResponse = json;

    if (isCollection) {
      const rawData = json.data;
      if (Array.isArray(rawData)) {
        allItems = allItems.concat(rawData);
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

  if (isCollection) {
    return unwrapData(allItems);
  }
  return unwrapData(allItems);
}

/**
 * Direct HTTPS query to Neon PostgreSQL cloud database (0ms cold start, 150ms latency).
 */
export async function executeNeonQuery(sqlQuery) {
  try {
    const res = await fetch(NEON_SQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Neon-Connection-String': NEON_CONNECTION_STRING,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sqlQuery })
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.rows || [];
  } catch (e) {
    return null;
  }
}

/**
 * Discovers dynamically registered Strapi content types from DB or API.
 */
export async function discoverDynamicContentTypes(activeStrapiUrl) {
  const discovered = new Map();

  // Seed with core endpoints
  for (const ep of CORE_ENDPOINTS) {
    discovered.set(ep.key, ep);
  }

  // If Neon DB is reachable, inspect strapi_core_store_settings to detect any newly added content types
  try {
    const rows = await executeNeonQuery("SELECT key FROM strapi_core_store_settings WHERE key LIKE 'plugin_content_manager_configuration_content_types::api::%'");
    if (rows && rows.length > 0) {
      for (const row of rows) {
        const rawType = row.key.replace('plugin_content_manager_configuration_content_types::api::', '');
        const [apiName, modelName] = rawType.split('.');
        if (apiName && !discovered.has(apiName)) {
          // Determine if collection or single type
          const isSingle = apiName.endsWith('-page') || apiName === 'header' || apiName === 'footer' || apiName === 'top-header';
          const endpoint = `${apiName}?populate=*`;
          discovered.set(apiName, {
            key: apiName,
            endpoint,
            isCollection: !isSingle
          });
        }
      }
    }
  } catch (e) {}

  return Array.from(discovered.values());
}

/**
 * Master multi-source discovery & sync orchestrator.
 */
export async function discoverAndSyncWebsiteContent(currentSnapshot = {}) {
  const report = {
    source: 'unknown',
    endpointsDiscovered: 0,
    endpointsSynced: 0,
    failures: [],
    sourcesChecked: []
  };

  const updatedData = { ...currentSnapshot };

  // 1. Check Active Strapi CMS
  console.log('📡 Checking live Strapi CMS instances...');
  const activeStrapi = await detectActiveStrapi();
  report.sourcesChecked.push({ name: 'Strapi CMS', url: activeStrapi, status: activeStrapi ? 'CONNECTED' : 'OFFLINE' });

  if (activeStrapi) {
    console.log(`✅ Connected to authoritative Strapi CMS at ${activeStrapi}`);
    report.source = `strapi (${activeStrapi})`;

    const endpoints = await discoverDynamicContentTypes(activeStrapi);
    report.endpointsDiscovered = endpoints.length;

    // Concurrently fetch with controlled concurrency (4 at a time)
    const BATCH_SIZE = 4;
    for (let i = 0; i < endpoints.length; i += BATCH_SIZE) {
      const batch = endpoints.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (ep) => {
        try {
          const res = await fetchWithPagination(activeStrapi, ep);
          if (res !== null && res !== undefined) {
            const clean = sanitizeBrand(res);
            updatedData[ep.key] = clean;
            updatedData[ep.endpoint] = clean;
            report.endpointsSynced++;
          }
        } catch (err) {
          report.failures.push({ key: ep.key, error: err.message });
        }
      }));
    }

    return { data: updatedData, report };
  }

  // 2. Direct Neon Cloud PostgreSQL Fallback (If Strapi HTTP is asleep)
  console.log('🔄 Checking direct Neon PostgreSQL Cloud Database fallback...');
  try {
    const testNeon = await executeNeonQuery("SELECT count(*) as cnt FROM awards;");
    if (testNeon && testNeon.length > 0) {
      console.log('✅ Connected directly to Neon Cloud PostgreSQL Database over HTTPS');
      report.source = 'neon-postgres-direct';
      report.sourcesChecked.push({ name: 'Neon PostgreSQL', status: 'CONNECTED' });

      // Direct DB awards fetch with images
      const neonAwards = await executeNeonQuery(`
        SELECT a.*, f.url as image_url, f.formats as image_formats
        FROM awards a
        LEFT JOIN files_related_mph frm ON frm.related_id = a.id AND frm.related_type = 'api::award.award'
        LEFT JOIN files f ON f.id = frm.file_id
        ORDER BY a.created_at DESC, frm.order ASC;
      `);
      if (neonAwards && neonAwards.length > 0) {
        const awardMap = new Map();
        for (const row of neonAwards) {
          if (!awardMap.has(row.id)) {
            awardMap.set(row.id, {
              id: row.id,
              documentId: row.document_id || `award_${row.id}`,
              title: row.title,
              category: row.category,
              year: row.year,
              company: row.company,
              location: row.location,
              description: row.desc || '',
              featured: false,
              isFeatured: false,
              createdAt: row.created_at,
              updatedAt: row.updated_at,
              images: []
            });
          }
          if (row.image_url) {
            awardMap.get(row.id).images.push({ url: row.image_url, formats: row.image_formats });
          }
        }
        const fullAwards = Array.from(awardMap.values());
        updatedData['awards'] = fullAwards;
        report.endpointsSynced++;
      }
    }
  } catch (e) {
    report.sourcesChecked.push({ name: 'Neon PostgreSQL', status: 'FAILED' });
  }

  // 3. Hostinger Live Disk DB Fallback
  console.log(`🌐 Pinging Hostinger Live Disk DB (${HOSTINGER_SYNC_URL})...`);
  try {
    const hostingerMaster = await fetchJson(HOSTINGER_SYNC_URL, 10000);
    if (hostingerMaster && typeof hostingerMaster === 'object' && Object.keys(hostingerMaster).length > 0) {
      console.log(`✅ Connected to Hostinger Live DB (${Object.keys(hostingerMaster).length} collections found). Merging live changes...`);
      report.sourcesChecked.push({ name: 'Hostinger Live Disk', status: 'CONNECTED' });
      if (report.source === 'unknown') report.source = 'hostinger-live-disk';

      for (const [key, val] of Object.entries(hostingerMaster)) {
        const cleanVal = sanitizeBrand(unwrapData(val));
        if (cleanVal) {
          // If local has more recent or complete dataset, preserve it; otherwise merge
          if (Array.isArray(cleanVal) && Array.isArray(updatedData[key]) && cleanVal.length < updatedData[key].length) {
            continue;
          }
          updatedData[key] = cleanVal;
          const baseKey = key.split('?')[0];
          updatedData[baseKey] = cleanVal;
        }
      }
      return { data: updatedData, report };
    }
  } catch (e) {
    report.sourcesChecked.push({ name: 'Hostinger Live Disk', status: 'FAILED' });
  }

  // 4. Offline Snapshot Mode
  console.log('ℹ️ All remote networks offline. Using verified local snapshot.');
  report.source = 'verified-local-snapshot';
  return { data: updatedData, report };
}
