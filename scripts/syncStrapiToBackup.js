import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_PATH = path.resolve(__dirname, '../src/data/MainBackupPislinfra.json');
const HOSTINGER_BACKUP_PATH = path.resolve(__dirname, '../public/data/live-backup.json');
const OG_PATH = path.resolve(__dirname, '../src/data/projectsData.js');
const COMP_PATH = path.resolve(__dirname, '../src/data/completedProjects.js');
const BLOG_PATH = path.resolve(__dirname, '../src/data/Blogdb.js');
const LEADERSHIP_PATH = path.resolve(__dirname, '../src/data/leadershipData.js');
const AWARDS_PATH = path.resolve(__dirname, '../src/data/Awards-&-Certifications.js');

const HOSTINGER_SYNC_URL = 'https://pislinfra.com/sync-backup.php';
const STRAPI_CANDIDATE_URLS = [
  'http://localhost:1337',
  process.env.VITE_STRAPI_URL || 'https://cms-pislinfra.onrender.com'
];

const STRAPI_ENDPOINTS = [
  'ongoing-projects?populate=*&pagination[pageSize]=100',
  'completed-projects?populate=*&pagination[pageSize]=100',
  'home-page?populate=*',
  'clients?pagination[pageSize]=100&sort=order:asc',
  'awards?populate=*&pagination[pageSize]=100&sort=createdAt:desc',
  'coverage-markers?populate=*&pagination[pageSize]=100',
  'blogs?populate=*&pagination[pageSize]=100',
  'job-openings?pagination[limit]=100',
  'leadership-page?populate[0]=heroImage&populate[1]=seo&populate[2]=topLeaderImage&populate[3]=topLeaderHighlights&populate[4]=executives.image&populate[5]=coreTeam.image',
  'about-page?populate[0]=heroImage&populate[1]=seo&populate[2]=stats&populate[3]=capabilities&populate[4]=values',
  'career-page?populate[0]=heroImage&populate[1]=seo&populate[2]=benefits&populate[3]=processSteps',
  'csr-page?populate=seo,heroImage,philosophyImages,stats,focusAreas.image,givingBackCards.image,environmentCards.image,celebrationCards.image',
  'ehs-page?populate[0]=heroImage&populate[1]=seo&populate[2]=gallery.image&populate[3]=stats&populate[4]=features&populate[5]=philosophy.image&populate[6]=awards.image&populate[7]=rules&populate[8]=resources&populate[9]=approaches&populate[10]=pillars&populate[11]=programs',
  'case-studies?populate=*&pagination[pageSize]=100&sort=createdAt:asc',
  'case-study-page?populate=seo,heroImage,approachSteps,trustedClients.logo',
  'annual-report-page?populate[0]=heroImage&populate[1]=seo&populate[2]=reports&populate[3]=reports.pdfFile',
  'policy-page?populate[0]=heroImage&populate[1]=seo&populate[2]=sections'
];

function unwrap(val) {
  if (val && typeof val === 'object' && val.data !== undefined) {
    if (Array.isArray(val.data) || (typeof val.data === 'object' && val.data !== null)) {
      return val.data;
    }
  }
  return val;
}

function sanitizeBrand(data) {
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
    for (const k in data) clean[k] = sanitizeBrand(data[k]);
    return clean;
  }
  return data;
}

async function fetchJson(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'PislinfraSync/2.0' }
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    clearTimeout(timeoutId);
    return null;
  }
}

const projectImagesDir = path.resolve(__dirname, '../public/images/projects');
if (!fs.existsSync(projectImagesDir)) fs.mkdirSync(projectImagesDir, { recursive: true });

async function ensureLocalProjectImage(url) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('r2.dev/')) return url;
  const fn = url.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
  const target = path.join(projectImagesDir, fn);
  if (!fs.existsSync(target)) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'PislinfraSync/2.0' } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(target, buf);
        console.log(`📥 Auto-downloaded project image: ${fn}`);
      }
    } catch (e) {
      console.log(`⚠️ Could not auto-download ${fn}: ${e.message}`);
    }
  }
  return `/images/projects/${fn}`;
}

async function syncBackup() {
  console.log('🔄 Checking live Hostinger and Strapi data sources for 100% offline bundling...');

  let masterBackup = {};
  if (fs.existsSync(BACKUP_PATH)) {
    try {
      masterBackup = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));
    } catch (e) {
      masterBackup = {};
    }
  }

  // 1. Fetch live master backup directly from Hostinger server disk
  let hostingerConnected = false;
  try {
    console.log(`🌐 Pinging Hostinger Live Disk DB (${HOSTINGER_SYNC_URL})...`);
    const hostingerMaster = await fetchJson(HOSTINGER_SYNC_URL, 8000);
    if (hostingerMaster && typeof hostingerMaster === 'object' && Object.keys(hostingerMaster).length > 0) {
      console.log(`✅ Connected to Hostinger Live DB (${Object.keys(hostingerMaster).length} collections found). Merging live changes...`);
      for (const [key, val] of Object.entries(hostingerMaster)) {
        const cleanVal = sanitizeBrand(unwrap(val));
        if (cleanVal) {
          masterBackup[key] = cleanVal;
          const baseKey = key.split('?')[0];
          masterBackup[baseKey] = cleanVal;
        }
      }
      hostingerConnected = true;
    }
  } catch (e) {
    console.log(`ℹ️ Hostinger fetch skipped (${e.message})`);
  }

  // 2. Fetch from Strapi CMS instances if available
  let activeStrapiUrl = null;
  for (const url of STRAPI_CANDIDATE_URLS) {
    try {
      const ping = await fetchJson(`${url}/api/home-page?populate=*`, 5000);
      if (ping) {
        activeStrapiUrl = url;
        break;
      }
    } catch (e) {}
  }

  if (activeStrapiUrl) {
    console.log(`📡 Connected to Strapi CMS at ${activeStrapiUrl}. Updating latest entries...`);
    for (const ep of STRAPI_ENDPOINTS) {
      try {
        const res = await fetchJson(`${activeStrapiUrl}/api/${ep}`, 7000);
        const data = sanitizeBrand(unwrap(res));
        if (data) {
          masterBackup[ep] = data;
          const baseKey = ep.split('?')[0];
          masterBackup[baseKey] = data;
        }
      } catch (err) {
        // Continue with other endpoints
      }
    }
  } else {
    console.log('ℹ️ Strapi instance offline or sleeping. Relying on Hostinger live backup & local storage.');
  }

  // 3. Ensure Ongoing Projects (Strictly 16 items; Exclude completed ones like Humsafar / Logistics Park LLP)
  const rawOngoing = masterBackup['ongoing-projects'] || masterBackup['ongoing-projects?populate=*&pagination[pageSize]=100'];
  if (Array.isArray(rawOngoing) && rawOngoing.length > 0) {
    const filteredOg = rawOngoing.filter(p => {
      const n = (p.name || p.title || '').toLowerCase();
      return !n.includes('humsafar') && !n.includes('logistics park llp');
    });

    const formattedOg = await Promise.all(filteredOg.map(async (p, idx) => {
      const rawImgs = p.images || (p.image ? [p.image] : []);
      const imgs = (await Promise.all(rawImgs.map(async (img) => {
        let u = typeof img === 'string' ? img : (img.formats?.large?.url || img.formats?.medium?.url || img.url);
        if (!u || typeof u !== 'string') return null;
        if (u.includes('r2.dev/')) {
          return await ensureLocalProjectImage(u);
        }
        return u;
      }))).filter(Boolean);
      return {
        id: idx + 1,
        documentId: p.documentId || `og_${idx + 1}`,
        category: p.category || "Industrial",
        name: p.name,
        location: p.location,
        state: p.state,
        area: p.area,
        client: p.client,
        timeline: p.timeline,
        status: "Ongoing",
        scope: p.scope,
        images: imgs.length > 0 ? imgs : ['/images/projects/default.jpg']
      };
    }));

    if (formattedOg.length === 16) {
      fs.writeFileSync(OG_PATH, `const projectsData = ${JSON.stringify(formattedOg, null, 2)};\n\nexport default projectsData;\n`, 'utf8');
      masterBackup['ongoing-projects'] = formattedOg;
      masterBackup['ongoing-projects?populate=*&pagination[pageSize]=100'] = formattedOg;
      masterBackup['ongoing-projects?populate=*&pagination[pageSize]=100&sort=createdAt:asc'] = formattedOg;
      console.log(`✅ Synced ongoing projects (${formattedOg.length}) to projectsData.js`);
    } else {
      console.log(`ℹ️ Ongoing projects count is ${formattedOg.length} (expected 16). Preserving verified projectsData.js`);
    }
  }

  // 4. Ensure Completed Projects (Strictly 27 items; Include Humsafar, Logistics Park LLP)
  const rawCompleted = masterBackup['completed-projects'] || masterBackup['completed-projects?populate=*&pagination[pageSize]=100'];
  if (Array.isArray(rawCompleted) && rawCompleted.length > 0) {
    let existingComp = [];
    if (fs.existsSync(COMP_PATH)) {
      try {
        const compContent = fs.readFileSync(COMP_PATH, 'utf8');
        const jsonMatch = compContent.match(/const\s+completedProjects\s*=\s*(\[[\s\S]*?\]);/);
        if (jsonMatch) existingComp = JSON.parse(jsonMatch[1]);
      } catch (e) {}
    }

    const normalize = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const formattedComp = await Promise.all(rawCompleted.map(async (p, idx) => {
      const rawImgs = p.images || (p.image ? [p.image] : []);
      const imgs = (await Promise.all(rawImgs.map(async (img) => {
        let u = typeof img === 'string' ? img : (img.formats?.large?.url || img.formats?.medium?.url || img.url);
        if (!u || typeof u !== 'string') return null;
        if (u.includes('r2.dev/')) {
          return await ensureLocalProjectImage(u);
        }
        return u;
      }))).filter(Boolean);
      return {
        id: idx + 1,
        documentId: p.documentId || `comp_${idx + 1}`,
        category: p.category || "Warehousing",
        name: p.name,
        location: p.location,
        state: p.state,
        area: p.area,
        client: p.client,
        timeline: p.timeline,
        status: "Completed",
        scope: p.scope,
        images: imgs.length > 0 ? imgs : ['/images/projects/default.jpg']
      };
    }));

    const seen = new Set();
    const mergedComp = [];
    for (const p of [...formattedComp, ...existingComp]) {
      const key = normalize(p.name);
      if (key && !seen.has(key)) {
        seen.add(key);
        mergedComp.push(p);
      }
    }

    const reindexedComp = mergedComp.map((p, idx) => ({ ...p, id: idx + 1 }));
    if (reindexedComp.length === 27) {
      fs.writeFileSync(COMP_PATH, `const completedProjects = ${JSON.stringify(reindexedComp, null, 2)};\n\nexport default completedProjects;\n`, 'utf8');
      masterBackup['completed-projects'] = reindexedComp;
      masterBackup['completed-projects?populate=*&pagination[pageSize]=100'] = reindexedComp;
      masterBackup['completed-projects?populate=*&pagination[pageSize]=100&sort=createdAt:asc'] = reindexedComp;
      console.log(`✅ Synced completed projects (${reindexedComp.length}) to completedProjects.js`);
    } else {
      console.log(`ℹ️ Completed projects count is ${reindexedComp.length} (expected 27). Preserving verified completedProjects.js`);
    }
  }

  // 5. Ensure Awards (Full dataset from live DB & offline file)
  const rawAwards = masterBackup['awards'] || masterBackup['awards?populate=*&pagination[pageSize]=100&sort=createdAt:desc'] || masterBackup['awards?populate=*&pagination[pageSize]=100&sort=order:asc'];
  if (Array.isArray(rawAwards) && rawAwards.length > 0) {
    const formattedAwards = rawAwards.map((item, idx) => {
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
        id: item.documentId || item.id || `award_${idx + 1}`,
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

    // Deduplicate and sort: Featured first, then Year (desc: 2026 first), then newest createdAt first!
    const seenAwards = new Set();
    const dedupedAwards = [];
    for (const a of formattedAwards) {
      if (!a || !a.title) continue;
      const key = a.title.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenAwards.has(key)) {
        seenAwards.add(key);
        dedupedAwards.push(a);
      }
    }

    const sortedAwards = dedupedAwards.sort((a, b) => {
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
        if (!isNaN(aTime) && !isNaN(bTime) && bTime !== aTime) {
          return bTime - aTime;
        }
      } else if (a.createdAt && !b.createdAt) return -1;
      else if (!a.createdAt && b.createdAt) return 1;

      const aTrophy = a.title?.includes('🏆') ? 1 : 0;
      const bTrophy = b.title?.includes('🏆') ? 1 : 0;
      if (bTrophy !== aTrophy) return bTrophy - aTrophy;

      return 0;
    });

    fs.writeFileSync(AWARDS_PATH, `const awardsAndCertifications = ${JSON.stringify(sortedAwards, null, 2)};\n\nexport default awardsAndCertifications;\n`, 'utf8');
    masterBackup['awards'] = sortedAwards;
    masterBackup['awards?populate=*&sort=order:asc'] = sortedAwards;
    masterBackup['awards?populate=*&sort=createdAt:desc'] = sortedAwards;
    masterBackup['awards?populate=*&pagination[pageSize]=100'] = sortedAwards;
    masterBackup['awards?populate=*&pagination[pageSize]=100&sort=createdAt:desc'] = sortedAwards;
    console.log(`✅ Synced and sorted awards (${sortedAwards.length}) into Awards-&-Certifications.js and master backup`);
  }

  // 5.1 Ensure Leadership Page
  const rawLeadership = masterBackup['leadership-page'];
  if (rawLeadership && rawLeadership.topLeaderName) {
    fs.writeFileSync(LEADERSHIP_PATH, `const leadershipData = ${JSON.stringify(rawLeadership, null, 2)};\n\nexport default leadershipData;\n`, 'utf8');
    console.log(`✅ Synced leadership data into leadershipData.js`);
  }

  // 6. Ensure Blogs (35 items)
  const rawBlogs = masterBackup['blogs'] || masterBackup['blogs?populate=*&pagination[pageSize]=100'];
  if (Array.isArray(rawBlogs) && rawBlogs.length > 0) {
    const formattedBlogs = rawBlogs.map(b => {
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

    fs.writeFileSync(BLOG_PATH, `const blogDB = ${JSON.stringify(formattedBlogs, null, 2)};\n\nexport default blogDB;\n`, 'utf8');
    masterBackup['blogs'] = formattedBlogs;
    masterBackup['blogs?populate=*&pagination[pageSize]=100&sort=createdAt:desc'] = formattedBlogs;
    masterBackup['blogs?populate=*&pagination[pageSize]=100'] = formattedBlogs;
    console.log(`✅ Synced blogs (${formattedBlogs.length}) into Blogdb.js and master backup`);
  }

  // 7. Write Master Backup & Hostinger public static backup
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(masterBackup, null, 2), 'utf8');
  fs.writeFileSync(HOSTINGER_BACKUP_PATH, JSON.stringify(masterBackup, null, 2), 'utf8');
  console.log('🌟 Complete offline backup bundle successfully saved to MainBackupPislinfra.json & public/data/live-backup.json!');
}

syncBackup();
