export const normalizeBlogImageUrl = (img) => {
  if (!img) return null;
  let url = typeof img === 'string' ? img : (img.url || img.formats?.large?.url || img.formats?.medium?.url || img.formats?.small?.url);
  if (!url || typeof url !== 'string') return null;
  if (url.includes('r2.dev/')) {
    const filename = url.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
    return `/images/blogs/${filename}`;
  }
  return url;
};

export const resolvePublishDate = (item) => {
  if (!item) return null;
  if (item.publishDate && typeof item.publishDate === 'string' && item.publishDate.trim()) {
    return item.publishDate.trim();
  }
  if (item.publishedAt && typeof item.publishedAt === 'string' && item.publishedAt.trim()) {
    return item.publishedAt.split('T')[0];
  }
  if (item.createdAt && typeof item.createdAt === 'string' && item.createdAt.trim()) {
    return item.createdAt.split('T')[0];
  }
  return null;
};

export const formatBlogDate = (dateString, fallbackDate = null) => {
  const raw = dateString || fallbackDate;
  if (!raw) return '';
  try {
    const parsed = new Date(raw);
    // Guard against epoch (<= 86400000 ms) and invalid dates so Jan 01, 1970 is never rendered
    if (isNaN(parsed.getTime()) || parsed.getTime() <= 86400000) {
      if (fallbackDate && fallbackDate !== dateString) {
        return formatBlogDate(fallbackDate);
      }
      return '';
    }
    return parsed.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return '';
  }
};

export const formatStrapiBlogs = (strapiBlogs) => {
  if (!Array.isArray(strapiBlogs)) return [];
  return strapiBlogs.map(item => {
    const resolvedDate = resolvePublishDate(item);
    return {
      id: item.documentId || item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category || 'Construction & Infrastructure',
      publishDate: resolvedDate,
      publishedAt: item.publishedAt,
      createdAt: item.createdAt,
      readTime: item.readTime,
      featuredImage: normalizeBlogImageUrl(item.featuredImage || item.image) || '/images/hero/Blog.png',
      galleryImages: (item.galleryImages || []).map(normalizeBlogImageUrl).filter(Boolean),
      tags: typeof item.tags === 'string' ? item.tags.split(',').map(t => t.trim()) : (Array.isArray(item.tags) ? item.tags : []),
      author: item.author || 'Pislinfra Team',
      featured: Boolean(item.featured),
      status: (item.statusField || item.status || 'published').toLowerCase(),
      seoTitle: item.seo?.seoTitle,
      seoDescription: item.seo?.seoDescription,
      seoKeywords: item.seo?.seoKeywords,
      faqSchema: item.faqSchema || [],
    };
  });
};
