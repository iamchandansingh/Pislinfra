import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const DATA_PATHS = {
  projects: path.join(ROOT, 'src/data/projectsData.js'),
  completed: path.join(ROOT, 'src/data/completedProjects.js'),
  awards: path.join(ROOT, 'src/data/Awards-&-Certifications.js'),
  blogs: path.join(ROOT, 'src/data/Blogdb.js'),
  leadership: path.join(ROOT, 'src/data/leadershipData.js'),
  coverageMarkers: path.join(ROOT, 'src/data/coverageMarkersData.js'),
  clientAppreciations: path.join(ROOT, 'src/data/clientAppreciationsData.js')
};

export function sanitizeBrand(data) {
  if (!data) return data;
  if (typeof data === 'string') {
    return data
      .replace(/PISL\s+INFRA\./gi, 'Pislinfra.')
      .replace(/PISL\s+INFRA/gi, 'Pislinfra')
      .replace(/PISL\s+Infra\./g, 'Pislinfra.')
      .replace(/PISL\s+Infra/g, 'Pislinfra')
      .replace(/Pisl\s+Infra\./g, 'Pislinfra.')
      .replace(/Pisl\s+Infra/g, 'Pislinfra')
      .replace(/Pisl\s+infra/g, 'Pislinfra');
  }
  if (Array.isArray(data)) return data.map(sanitizeBrand);
  if (typeof data === 'object') {
    const clean = {};
    for (const [k, v] of Object.entries(data)) clean[k] = sanitizeBrand(v);
    return clean;
  }
  return data;
}

/**
 * Adapter for Ongoing Projects (replaces rigid length === 16 check)
 */
export function adaptOngoingProjects(rawList) {
  if (!Array.isArray(rawList) || rawList.length === 0) return null;

  const filtered = rawList.filter(p => {
    const n = (p.name || p.title || '').toLowerCase();
    return !n.includes('humsafar') && !n.includes('logistics park llp');
  });

  if (filtered.length === 0) return null;

  const formatted = filtered.map((p, idx) => {
    const rawImgs = p.images || (p.image ? [p.image] : []);
    const imgs = rawImgs.map(img => {
      const u = typeof img === 'string' ? img : (img.formats?.large?.url || img.formats?.medium?.url || img.url);
      if (u && typeof u === 'string' && u.includes('r2.dev/')) {
        const fn = u.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
        return `/images/projects/${fn}`;
      }
      return u;
    }).filter(Boolean);

    return {
      id: idx + 1,
      documentId: p.documentId || `og_${idx + 1}`,
      category: p.category || "Industrial",
      name: p.name || p.title || `Project ${idx + 1}`,
      location: p.location || '',
      state: p.state || '',
      area: p.area || '',
      client: p.client || '',
      timeline: p.timeline || '',
      status: "Ongoing",
      scope: p.scope || '',
      cx: p.cx != null ? Number(p.cx) : null,
      cy: p.cy != null ? Number(p.cy) : null,
      images: imgs.length > 0 ? imgs : ['/images/projects/default.jpg']
    };
  });

  fs.writeFileSync(DATA_PATHS.projects, `const projectsData = ${JSON.stringify(formatted, null, 2)};\n\nexport default projectsData;\n`, 'utf8');
  return formatted;
}

/**
 * Adapter for Completed Projects (replaces rigid length === 27 check)
 */
export function adaptCompletedProjects(rawList) {
  if (!Array.isArray(rawList) || rawList.length === 0) return null;

  let existing = [];
  if (fs.existsSync(DATA_PATHS.completed)) {
    try {
      const match = fs.readFileSync(DATA_PATHS.completed, 'utf8').match(/const\s+completedProjects\s*=\s*(\[[\s\S]*?\]);/);
      if (match) existing = JSON.parse(match[1]);
    } catch (e) {}
  }

  const normalize = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const formatted = rawList.map((p, idx) => {
    const rawImgs = p.images || (p.image ? [p.image] : []);
    const imgs = rawImgs.map(img => {
      const u = typeof img === 'string' ? img : (img.formats?.large?.url || img.formats?.medium?.url || img.url);
      if (u && typeof u === 'string' && u.includes('r2.dev/')) {
        const fn = u.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
        return `/images/projects/${fn}`;
      }
      return u;
    }).filter(Boolean);

    return {
      id: idx + 1,
      documentId: p.documentId || `comp_${idx + 1}`,
      category: p.category || "Warehousing",
      name: p.name || p.title || `Completed Project ${idx + 1}`,
      location: p.location || '',
      state: p.state || '',
      area: p.area || '',
      client: p.client || '',
      timeline: p.timeline || '',
      status: "Completed",
      scope: p.scope || '',
      cx: p.cx != null ? Number(p.cx) : null,
      cy: p.cy != null ? Number(p.cy) : null,
      images: imgs.length > 0 ? imgs : ['/images/projects/default.jpg']
    };
  });

  const seen = new Set();
  const merged = [];
  for (const p of [...formatted, ...existing]) {
    const key = normalize(p.name);
    if (key && !seen.has(key)) {
      seen.add(key);
      merged.push(p);
    }
  }

  const reindexed = merged.map((p, idx) => ({ ...p, id: idx + 1 }));
  fs.writeFileSync(DATA_PATHS.completed, `const completedProjects = ${JSON.stringify(reindexed, null, 2)};\n\nexport default completedProjects;\n`, 'utf8');
  return reindexed;
}

/**
 * Adapter for Awards & Certifications
 */
export function adaptAwards(rawAwards) {
  if (!Array.isArray(rawAwards) || rawAwards.length === 0) return null;

  const formatted = rawAwards.map((item, idx) => {
    const allImgs = [];
    const addImg = (img) => {
      if (!img) return;
      if (Array.isArray(img)) {
        img.forEach(addImg);
        return;
      }
      let u = typeof img === 'string' ? img : (img.formats?.large?.url || img.formats?.medium?.url || img.url);
      if (!u) return;
      if (u.includes('r2.dev/')) {
        const fn = u.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
        u = `/images/awards/${fn}`;
      }
      if (!allImgs.includes(u)) allImgs.push(u);
    };

    if (item.images) addImg(item.images);
    if (item.image) addImg(item.image);
    if (item.imageUrls) addImg(item.imageUrls);
    if (item.clientImage) addImg(item.clientImage);

    const primaryImg = allImgs[0] || '/images/awards/certificate.jpg';
    const clientImg = allImgs[1] || primaryImg;

    return {
      id: item.documentId || (item.id ? `award_${item.id}` : `award_${idx + 1}`),
      documentId: item.documentId || (item.id ? `award_${item.id}` : `award_${idx + 1}`),
      title: item.title,
      category: item.category || 'HSE / Safety Excellence',
      year: String(item.year || '2026'),
      company: item.company || 'Industry Recognition',
      location: item.location || 'India',
      description: item.desc || item.description || '',
      videoUrl: item.videoUrl || null,
      featured: Boolean(item.featured || item.isFeatured),
      isFeatured: Boolean(item.featured || item.isFeatured),
      createdAt: item.createdAt || null,
      image: primaryImg,
      clientImage: clientImg,
      images: allImgs.length > 0 ? allImgs : [primaryImg],
      gallery: allImgs.length > 1 ? allImgs.slice(1) : [],
      pdf: item.pdf ? (typeof item.pdf === 'string' ? item.pdf : (item.pdf.url || null)) : null
    };
  });

  const seen = new Set();
  const deduped = [];
  for (const a of formatted) {
    if (!a || !a.title) continue;
    const key = a.documentId
      ? `doc_${a.documentId}`
      : (a.id ? `id_${a.id}` : `${(a.title || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')}_${a.year}`);
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(a);
    }
  }

  const sorted = deduped.sort((a, b) => {
    const aFeat = Boolean(a.featured || a.isFeatured);
    const bFeat = Boolean(b.featured || b.isFeatured);
    if (aFeat && !bFeat) return -1;
    if (!aFeat && bFeat) return 1;

    const aYear = parseInt(a.year, 10) || 0;
    const bYear = parseInt(b.year, 10) || 0;
    if (bYear !== aYear) return bYear - aYear;

    if (a.createdAt && b.createdAt) {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      if (!isNaN(aTime) && !isNaN(bTime) && bTime !== aTime) return bTime - aTime;
    }
    return 0;
  });

  fs.writeFileSync(DATA_PATHS.awards, `const awardsAndCertifications = ${JSON.stringify(sorted, null, 2)};\n\nexport default awardsAndCertifications;\n`, 'utf8');
  return sorted;
}

/**
 * Adapter for Blogs
 */
export function adaptBlogs(rawBlogs) {
  if (!Array.isArray(rawBlogs) || rawBlogs.length === 0) return null;

  const formatted = rawBlogs.map(b => {
    let featImg = b.featuredImage ? (typeof b.featuredImage === 'string' ? b.featuredImage : (b.featuredImage.url || b.featuredImage.formats?.large?.url || b.featuredImage.formats?.medium?.url)) : (b.image ? (typeof b.image === 'string' ? b.image : b.image.url) : null);
    if (featImg && featImg.includes('r2.dev/')) {
      const fn = featImg.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
      featImg = `/images/blogs/${fn}`;
    }
    let cleanContent = b.content;
    if (typeof cleanContent === 'string' && cleanContent.includes('r2.dev/')) {
      cleanContent = cleanContent.replace(/https:\/\/[^\"'\s\)]*r2\.dev\/([a-zA-Z0-9._-]+)/g, (match, filename) => {
        const fn = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        return `/images/blogs/${fn}`;
      });
    }
    return {
      id: b.documentId || b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      content: cleanContent,
      category: b.category,
      publishDate: b.publishDate,
      createdAt: b.createdAt,
      readTime: b.readTime,
      featuredImage: featImg || '/images/hero/Blog.png',
      tags: typeof b.tags === 'string' ? b.tags.split(',').map(t => t.trim()) : (Array.isArray(b.tags) ? b.tags : []),
      author: b.author || {},
      featured: Boolean(b.featured),
      status: b.statusField || b.status || 'published',
      seoTitle: b.seo?.seoTitle,
      seoDescription: b.seo?.seoDescription,
      seoKeywords: b.seo?.seoKeywords,
      faqSchema: b.faqSchema || []
    };
  });

  fs.writeFileSync(DATA_PATHS.blogs, `const blogDB = ${JSON.stringify(formatted, null, 2)};\n\nexport default blogDB;\n`, 'utf8');
  return formatted;
}

/**
 * Adapter for Leadership Page
 */
export function adaptLeadership(rawLeadership) {
  if (!rawLeadership || !rawLeadership.topLeaderName) return null;
  fs.writeFileSync(DATA_PATHS.leadership, `const leadershipData = ${JSON.stringify(rawLeadership, null, 2)};\n\nexport default leadershipData;\n`, 'utf8');
  return rawLeadership;
}

/**
 * Adapter for Coverage Markers
 */
export function adaptCoverageMarkers(rawMarkers) {
  if (!Array.isArray(rawMarkers) || rawMarkers.length === 0) return null;

  const formatted = rawMarkers.map(m => {
    if (Array.isArray(m.images) && m.images.length > 0) {
      const localImgs = m.images.map(img => {
        let u = typeof img === 'string' ? img : (img.formats?.large?.url || img.formats?.medium?.url || img.url);
        if (u && typeof u === 'string' && u.includes('r2.dev/')) {
          const fn = u.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
          return `/images/projects/${fn}`;
        }
        return u;
      }).filter(Boolean);
      return { ...m, images: localImgs };
    }
    return m;
  });

  fs.writeFileSync(DATA_PATHS.coverageMarkers, `const coverageMarkersData = ${JSON.stringify(formatted, null, 2)};\n\nexport default coverageMarkersData;\n`, 'utf8');
  return formatted;
}

/**
 * Adapter for Client Appreciations
 */
export function adaptClientAppreciations(rawApprec) {
  if (!Array.isArray(rawApprec) || rawApprec.length === 0) return null;
  fs.writeFileSync(DATA_PATHS.clientAppreciations, `export const clientAppreciations = ${JSON.stringify(rawApprec, null, 2)};\n\nexport default clientAppreciations;\n`, 'utf8');
  return rawApprec;
}
