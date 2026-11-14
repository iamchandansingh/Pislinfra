const BLOG_FILES = new Set([
  "25291982daf56f9ce02e7cd1aefc6e5d.png",
  "32711eb5adf0d85f234b64323e755351.png",
  "44ef59a859f6567fe3a5b25e9a750f31.png",
  "72c75288ddf4456952d341fe2720432e.png",
  "9644769f233415508cdb1b859fc9d6a7.png",
  "9721c065918a9f62c31b6d2f834258dc.png",
  "Choosing_the_Right_Industrial_Construction_Partner_12_Questions_to_Ask_284223dc16.avif",
  "Data_Centre_and_Digital_Infrastructure_065af3faf6.avif",
  "How_Smart_Warehouses_Are_Transforming_Supply_Chain_Efficiency_in_2026_3bef2a8522.avif",
  "Industrial_Corridors_in_India_7cff9486a8.avif",
  "Industrial_Flooring_Options_for_Manufacturing_Plants_24700cc7b7.avif",
  "Industrial_Infrastructure_and_Manufacturing1_80a8505b0d.avif",
  "Industrial_Infrastructure_and_Manufacturing_081f9bbb37.avif",
  "ae2b646d9b1d28205efe8c43f041481a.png",
  "c175083bfde97a499aa3e5288439dfd8.png",
  "c3510e1e5b8a53a434fe66166506096f.png",
  "c4f31083a8b547cfdc95ee9cb9a7539f.png",
  "cb91f7b12d9525440063b22374471313.png",
  "fbdfe5b5b2bebbaf5ab446e5388d8d58.png",
  "industrial_EPC_contractor_83969ef29f.avif",
  "industrial_flooring_for_factories_32e837e8a8.avif",
  "optimized_1787755045721_882_Technology_png.webp",
  "optimized_1787755078619_572_Green-Industrial-Park_png.webp",
  "optimized_1787755079697_328_Industrial-Parks_png.webp",
  "optimized_1787755102107_84_Sustainable-Warehouse-Construction_png.webp",
  "optimized_1787755103540_138_Innovative-Materials_png.webp",
  "optimized_1787755126710_874_Logistics-Infrastructure-India_png.webp",
  "optimized_1787755169116_146_Industrial-Construction_png.webp",
  "optimized_1787755169120_911_Understanding-Different_png.webp",
  "optimized_1787755279974_473_Phases-of-Construction_png.webp",
  "optimized_1787755299577_273_Best-EPC-contractors_png.webp",
  "optimized_1787755313504_490_Constructionsd_png.webp",
  "optimized_1787755328860_778_Water-Management_png.webp",
  "optimized_1787755381273_146_Blog_png-1200x375.webp",
  "optimized_1787755381273_146_Blog_png.webp",
  "optimized_1787755414635_339_Logistics-Park-Companies_png.webp",
  "optimized_1787755415036_631_blog_png.webp",
  "pexels-photo-1216589.jpeg",
  "pisl_1889ae287f.avif"
]);

export const normalizeBlogImageUrl = (img) => {
  if (!img) return null;
  let url = typeof img === 'string' ? img : (img.url || img.formats?.large?.url || img.formats?.medium?.url || img.formats?.small?.url);
  if (!url || typeof url !== 'string') return null;
  url = url.trim();

  // If already a local blog image, return as is
  if (url.startsWith('/images/blogs/')) {
    return url;
  }

  // Extract base filename to check against bundled blog assets
  const cleanUrl = url.split('?')[0].split('#')[0];
  const filename = cleanUrl.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');

  if (BLOG_FILES.has(filename)) {
    return `/images/blogs/${filename}`;
  }

  // Check without -scaled suffix (e.g. Industrial_Infrastructure_and_Manufacturing1_80a8505b0d-scaled.avif)
  const unscaled = filename.replace(/-scaled\./, '.');
  if (BLOG_FILES.has(unscaled)) {
    return `/images/blogs/${unscaled}`;
  }

  // Check without size suffix (e.g. -1200x800.avif)
  const unsize = filename.replace(/-\d+x\d+\./, '.');
  if (BLOG_FILES.has(unsize)) {
    return `/images/blogs/${unsize}`;
  }

  // Fix broken cms.pislinfra.com subdomain to live WordPress URL
  if (url.includes('cms.pislinfra.com')) {
    return url.replace(/https?:\/\/cms\.pislinfra\.com/g, 'https://pislinfra.com/cms');
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

export const extractNumericId = (itemOrId) => {
  const raw = typeof itemOrId === 'object' && itemOrId !== null
    ? (itemOrId.wp_id ?? itemOrId.id ?? itemOrId.documentId)
    : itemOrId;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  const match = String(raw || '').match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
};

export const sortBlogsByDateDesc = (a, b) => {
  const timeA = new Date(a?.publishDate || a?.publishedAt || a?.createdAt || 0).getTime() || 0;
  const timeB = new Date(b?.publishDate || b?.publishedAt || b?.createdAt || 0).getTime() || 0;
  if (timeB !== timeA) return timeB - timeA;
  const createdA = new Date(a?.publishedAt || a?.createdAt || 0).getTime() || 0;
  const createdB = new Date(b?.publishedAt || b?.createdAt || 0).getTime() || 0;
  if (createdB !== createdA) return createdB - createdA;
  const idA = extractNumericId(a);
  const idB = extractNumericId(b);
  if (idB !== idA) {
    return idB - idA;
  }
  return 0;
};

export const stripHtmlAndWpBlocks = (raw = '') => {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const slugifyHeading = (text = '') =>
  String(text).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
