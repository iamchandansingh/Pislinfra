// src/utils/generateSitemap.js

import BlogDB from '../data/BlogDB';

const generateSitemap = () => {
  const baseUrl = 'https://pisl.in';
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/about', priority: 0.8, changefreq: 'monthly' },
    { url: '/solutions', priority: 0.9, changefreq: 'weekly' },
    { url: '/projects', priority: 0.9, changefreq: 'weekly' },
    { url: '/blog', priority: 0.8, changefreq: 'daily' },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' },
  ];

  const blogPages = BlogDB
    .filter(blog => blog.status === 'published' && blog.includeInSitemap !== false)
    .map(blog => ({
      url: `/blog/${blog.slug}`,
      priority: blog.sitemapPriority || 0.8,
      changefreq: blog.sitemapChangeFrequency || 'monthly',
      lastmod: blog.updatedDate || blog.publishDate,
    }));

  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

export default generateSitemap;