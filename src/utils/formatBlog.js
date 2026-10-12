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

export const formatStrapiBlogs = (strapiBlogs) => {
  return strapiBlogs.map(item => {
    return {
      id: item.documentId || item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      publishDate: item.publishDate,
      createdAt: item.createdAt,
      readTime: item.readTime,
      featuredImage: normalizeBlogImageUrl(item.featuredImage || item.image) || '/images/hero/Blog.png',
      galleryImages: (item.galleryImages || []).map(normalizeBlogImageUrl).filter(Boolean),
      tags: typeof item.tags === 'string' ? item.tags.split(',').map(t => t.trim()) : (Array.isArray(item.tags) ? item.tags : []),
      author: item.author || {},
      featured: Boolean(item.featured),
      status: item.statusField || item.status || 'published',
      seoTitle: item.seo?.seoTitle,
      seoDescription: item.seo?.seoDescription,
      seoKeywords: item.seo?.seoKeywords,
      faqSchema: item.faqSchema || [],
    };
  });
};
