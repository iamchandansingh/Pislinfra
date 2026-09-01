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
      featuredImage: item.featuredImage?.url 
        ? (item.featuredImage.url.startsWith('http') ? item.featuredImage.url : `${item.featuredImage.url}`) 
        : null,
      galleryImages: item.galleryImages?.map(img => 
        img.url.startsWith('http') ? img.url : `${img.url}`
      ) || [],
      tags: typeof item.tags === 'string' ? item.tags.split(',').map(t => t.trim()) : (Array.isArray(item.tags) ? item.tags : []),
      author: item.author || {},
      featured: Boolean(item.featured),
      status: item.statusField || 'published',
      seoTitle: item.seo?.seoTitle,
      seoDescription: item.seo?.seoDescription,
      seoKeywords: item.seo?.seoKeywords,
      faqSchema: item.faqSchema || [],
    };
  });
};
