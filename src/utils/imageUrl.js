import { STRAPI_URL } from '../services/strapi';

export const getImageUrl = (url, defaultImg = '') => {
  if (!url) return defaultImg;
  if (typeof url === 'object') {
    url = url.formats?.large?.url ||
          url.formats?.medium?.url ||
          url.formats?.small?.url ||
          url.formats?.thumbnail?.url ||
          url.url ||
          url.attributes?.formats?.large?.url ||
          url.attributes?.formats?.medium?.url ||
          url.attributes?.formats?.small?.url ||
          url.attributes?.formats?.thumbnail?.url ||
          url.attributes?.url ||
          url.data?.attributes?.formats?.large?.url ||
          url.data?.attributes?.url ||
          url.data?.url ||
          '';
  }
  if (!url || typeof url !== 'string') return defaultImg;
  url = url.trim();
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('/uploads')) return STRAPI_URL ? `${STRAPI_URL}${url}` : (defaultImg || url);
  return url;
};

