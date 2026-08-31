import offlineBackup from '../data/MainBackupPislinfra.json';

export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export const fetchStrapiData = async (endpoint) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200); // 1.2s fast fallback

    const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json && json.data) {
        return json.data;
      }
    }
  } catch (error) {
    // Strapi offline / unreachable / aborted
  }

  // Seamless Automatic Offline Backup Fallback (Works 100% without CMS)
  if (offlineBackup) {
    if (offlineBackup[endpoint]) {
      return offlineBackup[endpoint];
    }
    const baseKey = endpoint.split('?')[0];
    if (offlineBackup[baseKey]) {
      return offlineBackup[baseKey];
    }

    // Check slug filter (e.g. solution-pages?filters[slug]=warehouse)
    const slugMatch = endpoint.match(/filters\[slug\](?:\[\$eq\])?=([a-zA-Z0-9_-]+)/);
    if (slugMatch && slugMatch[1]) {
      const slugKey = `${baseKey}-${slugMatch[1]}`;
      if (offlineBackup[slugKey]) {
        return offlineBackup[slugKey];
      }
    }
  }

  return null;
};
