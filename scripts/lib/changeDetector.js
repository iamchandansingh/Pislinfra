import { CORE_ENDPOINTS, fetchWithPagination, fetchJson } from './contentDiscovery.js';

const WP_API_BASE = (process.env.VITE_WP_API_URL || 'http://127.0.0.1:8080/wp-json/pislinfra/v1').replace(/\/$/, '');

export const MONITORED_TABLES = CORE_ENDPOINTS.map((item) => ({
  table: item.key,
  endpoint: item.endpoint,
  key: item.key,
  isCollection: item.isCollection,
}));

/**
 * Checks WordPress REST health & collection counts / cache version to detect remote updates
 * without any external PostgreSQL / Neon connection.
 */
export async function detectRemoteChanges(currentCursor = {}) {
  const startTime = performance.now();
  try {
    const health = await fetchJson(`${WP_API_BASE}/health`, 3000);
    if (!health || !health.ok) {
      return {
        changed: false,
        error: 'WordPress REST health check unavailable',
        offline: true,
        latencyMs: Math.round(performance.now() - startTime),
      };
    }

    const modifiedTables = [];
    const newCursors = { ...(currentCursor.cursors || {}) };
    const counts = health.counts || {};
    const cacheVersion = health.cacheVersion ?? 0;

    for (const ep of MONITORED_TABLES) {
      const cnt = counts[ep.key] ?? (ep.isCollection ? 0 : 1);
      const prev = newCursors[ep.table];
      const maxUpd = String(cacheVersion);
      if (!prev) {
        newCursors[ep.table] = { max_upd: maxUpd, cnt };
      } else if (prev.cnt !== cnt || prev.max_upd !== maxUpd) {
        modifiedTables.push(ep.table);
        newCursors[ep.table] = { max_upd: maxUpd, cnt };
      }
    }

    return {
      changed: modifiedTables.length > 0,
      modifiedTables,
      newCursor: {
        lastSyncTime: Date.now(),
        lastIso: new Date().toISOString(),
        cursors: newCursors,
      },
      latencyMs: Math.round(performance.now() - startTime),
      offline: false,
    };
  } catch (err) {
    return {
      changed: false,
      error: err.message,
      offline: true,
      latencyMs: Math.round(performance.now() - startTime),
    };
  }
}

/**
 * Fetches fresh data from WordPress REST API for a modified endpoint key.
 */
export async function fetchModifiedTableData(tableName, wpApiBase = WP_API_BASE) {
  const tableDef = MONITORED_TABLES.find((t) => t.table === tableName);
  if (!tableDef) return null;

  try {
    const data = await fetchWithPagination(wpApiBase, tableDef);
    return { key: tableDef.key, data, isCollection: tableDef.isCollection };
  } catch (e) {
    return null;
  }
}
