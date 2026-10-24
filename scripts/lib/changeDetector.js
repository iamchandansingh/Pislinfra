import { executeNeonQuery, fetchWithPagination, fetchJson } from './contentDiscovery.js';

export const MONITORED_TABLES = [
  { table: 'awards', endpoint: 'awards?populate=*&sort=createdAt:desc', key: 'awards', isCollection: true },
  { table: 'blogs', endpoint: 'blogs?populate=*&sort=createdAt:desc', key: 'blogs', isCollection: true },
  { table: 'clients', endpoint: 'clients?sort=order:asc&populate=*', key: 'clients', isCollection: true },
  { table: 'completed_projects', endpoint: 'completed-projects?populate=*', key: 'completed-projects', isCollection: true },
  { table: 'ongoing_projects', endpoint: 'ongoing-projects?populate=*', key: 'ongoing-projects', isCollection: true },
  { table: 'coverage_markers', endpoint: 'coverage-markers?populate=*', key: 'coverage-markers', isCollection: true },
  { table: 'job_openings', endpoint: 'job-openings', key: 'job-openings', isCollection: true },
  { table: 'case_studies', endpoint: 'case-studies?populate=*&sort=createdAt:asc', key: 'case-studies', isCollection: true },
  { table: 'client_appreciations', endpoint: 'client-appreciations?populate=*', key: 'client-appreciations', isCollection: true },
  { table: 'solution_pages', endpoint: 'solution-pages?populate=*', key: 'solution-pages', isCollection: true },
  { table: 'warehouse_pages', endpoint: 'warehouse-page?populate=*', key: 'warehouse-page', isCollection: false },
  { table: 'about_pages', endpoint: 'about-page?populate[0]=heroImage&populate[1]=seo&populate[2]=stats&populate[3]=capabilities&populate[4]=values&populate[5]=companyProfile.file&populate[6]=companyProfile.coverImage&populate[7]=resources.file&populate[8]=resources.coverImage', key: 'about-page', isCollection: false },
  { table: 'home_pages', endpoint: 'home-page?populate=*', key: 'home-page', isCollection: false },
  { table: 'leadership_pages', endpoint: 'leadership-page?populate[0]=heroImage&populate[1]=seo&populate[2]=topLeaderImage&populate[3]=topLeaderHighlights&populate[4]=executives.image&populate[5]=coreTeam.image', key: 'leadership-page', isCollection: false },
  { table: 'ehs_pages', endpoint: 'ehs-page?populate[0]=heroImage&populate[1]=seo&populate[2]=gallery.image&populate[3]=stats&populate[4]=features&populate[5]=philosophy.image&populate[6]=awards.image&populate[7]=rules&populate[8]=resources&populate[9]=approaches&populate[10]=pillars&populate[11]=programs&populate[12]=resources.file&populate[13]=resources.coverImage&populate[14]=resourcesCoverImage', key: 'ehs-page', isCollection: false },
  { table: 'csr_pages', endpoint: 'csr-page?populate=seo,heroImage,philosophyImages,stats,focusAreas.image,givingBackCards.image,environmentCards.image,celebrationCards.image', key: 'csr-page', isCollection: false },
  { table: 'career_pages', endpoint: 'career-page?populate[0]=heroImage&populate[1]=seo&populate[2]=benefits&populate[3]=processSteps', key: 'career-page', isCollection: false },
  { table: 'annual_report_pages', endpoint: 'annual-report-page?populate[0]=heroImage&populate[1]=seo&populate[2]=reports&populate[3]=reports.pdfFile', key: 'annual-report-page', isCollection: false },
  { table: 'policy_pages', endpoint: 'policy-page?populate[0]=heroImage&populate[1]=seo&populate[2]=sections', key: 'policy-page', isCollection: false },
  { table: 'contact_pages', endpoint: 'contact-page?populate[0]=heroImage&populate[1]=seo.ogImage&populate[2]=seo.twitterImage', key: 'contact-page', isCollection: false },
  { table: 'completed_pages', endpoint: 'completed-page?populate=seo,heroImage', key: 'completed-page', isCollection: false },
  { table: 'ongoing_pages', endpoint: 'ongoing-page?populate=seo,heroImage', key: 'ongoing-page', isCollection: false },
  { table: 'awards_pages', endpoint: 'awards-page?populate[0]=heroImage&populate[1]=seo', key: 'awards-page', isCollection: false },
  { table: 'case_study_pages', endpoint: 'case-study-page?populate=seo,heroImage,approachSteps,trustedClients.logo', key: 'case-study-page', isCollection: false },
  { table: 'blog_pages', endpoint: 'blog-page?populate=seo,heroImage', key: 'blog-page', isCollection: false },
  { table: 'headers', endpoint: 'header?populate[0]=logo&populate[1]=navigation.subLinks', key: 'header', isCollection: false },
  { table: 'footers', endpoint: 'footer?populate[0]=logo&populate[1]=companyLinks&populate[2]=resourceLinks&populate[3]=solutionLinks', key: 'footer', isCollection: false },
  { table: 'top_headers', endpoint: 'top-header', key: 'top-header', isCollection: false },
  { table: 'files', endpoint: 'upload/files', key: 'files', isCollection: true }
];

/**
 * Builds the high-speed multi-table cursor query.
 */
function buildCursorQuery() {
  return MONITORED_TABLES
    .map(t => `SELECT '${t.table}' as tbl, max(updated_at) as max_upd, count(*) as cnt FROM ${t.table}`)
    .join(' UNION ALL ');
}

/**
 * Executes high-speed change detection across all tables.
 * Returns { changed, modifiedTables, newCursor, latencyMs }
 */
export async function detectRemoteChanges(currentCursor = {}) {
  const startTime = performance.now();
  const query = buildCursorQuery();

  try {
    const rows = await executeNeonQuery(query);
    if (!rows || !Array.isArray(rows)) {
      return {
        changed: false,
        error: 'Database returned no rows',
        offline: true,
        latencyMs: Math.round(performance.now() - startTime)
      };
    }

    const modifiedTables = [];
    const newCursors = { ...(currentCursor.cursors || {}) };

    for (const row of rows) {
      const prev = newCursors[row.tbl];
      const currentMax = row.max_upd ? String(row.max_upd) : 'null';
      const currentCnt = row.cnt ? parseInt(row.cnt, 10) : 0;

      if (!prev) {
        // Initializing cursor
        newCursors[row.tbl] = { max_upd: currentMax, cnt: currentCnt };
      } else if (prev.max_upd !== currentMax || prev.cnt !== currentCnt) {
        modifiedTables.push(row.tbl);
        newCursors[row.tbl] = { max_upd: currentMax, cnt: currentCnt };
      }
    }

    const latencyMs = Math.round(performance.now() - startTime);

    return {
      changed: modifiedTables.length > 0,
      modifiedTables,
      newCursor: {
        lastSyncTime: Date.now(),
        lastIso: new Date().toISOString(),
        cursors: newCursors
      },
      latencyMs,
      offline: false
    };
  } catch (err) {
    return {
      changed: false,
      error: err.message,
      offline: true,
      latencyMs: Math.round(performance.now() - startTime)
    };
  }
}

/**
 * Fetches the fresh data for specifically modified tables.
 */
export async function fetchModifiedTableData(tableName, strapiBaseUrl = 'http://127.0.0.1:1337') {
  const tableDef = MONITORED_TABLES.find(t => t.table === tableName);
  if (!tableDef) return null;

  try {
    const data = await fetchWithPagination(strapiBaseUrl, tableDef);
    return { key: tableDef.key, data, isCollection: tableDef.isCollection };
  } catch (e) {
    return null;
  }
}
