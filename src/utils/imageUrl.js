import { STRAPI_URL } from '../services/strapi';

export const getImageUrl = (url, defaultImg = '') => {
  if (!url) return defaultImg;
  if (typeof url === 'object') {
    url = url.url || url.data?.attributes?.url || '';
  }
  if (!url || typeof url !== 'string') return defaultImg;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('/uploads')) return `${STRAPI_URL || "http://127.0.0.1:1337"}${url}`;
  return url;
};

