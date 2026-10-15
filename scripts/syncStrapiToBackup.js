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
  'http://127.0.0.1:1337',
  'http://localhost:1337',
  process.env.VITE_STRAPI_URL || 'https://cms-pislinfra.onrender.com'
];

const STRAPI_ENDPOINTS = [
  'ongoing-projects?populate=*&pagination[pageSize]=100',
  'completed-projects?populate=*&pagination[pageSize]=100',
  'home-page?populate=*',
  'clients?pagination[pageSize]=100&sort=order:asc&populate=*',
  'awards?populate=*&pagination[pageSize]=100&sort=createdAt:desc',
  'awards-page?populate[0]=heroImage&populate[1]=seo',
  'client-appreciations?populate=*&pagination[pageSize]=100',
  'milestones?populate=*&pagination[pageSize]=100&sort=year:asc',
  'timeline-milestones?populate=*&pagination[pageSize]=100&sort=year:asc',
  'coverage-markers?populate=*&pagination[pageSize]=100',
  'blogs?populate=*&pagination[pageSize]=100&sort=createdAt:desc',
  'blog-page?populate=seo,heroImage',
  'job-openings?pagination[limit]=100',
  'leadership-page?populate[0]=heroImage&populate[1]=seo&populate[2]=topLeaderImage&populate[3]=topLeaderHighlights&populate[4]=executives.image&populate[5]=coreTeam.image',
  'about-page?populate[0]=heroImage&populate[1]=seo&populate[2]=stats&populate[3]=capabilities&populate[4]=values&populate[5]=companyProfile.file&populate[6]=companyProfile.coverImage&populate[7]=resources.file&populate[8]=resources.coverImage',
  'career-page?populate[0]=heroImage&populate[1]=seo&populate[2]=benefits&populate[3]=processSteps',
  'csr-page?populate=seo,heroImage,philosophyImages,stats,focusAreas.image,givingBackCards.image,environmentCards.image,celebrationCards.image',
  'ehs-page?populate[0]=heroImage&populate[1]=seo&populate[2]=gallery.image&populate[3]=stats&populate[4]=features&populate[5]=philosophy.image&populate[6]=awards.image&populate[7]=rules&populate[8]=resources&populate[9]=approaches&populate[10]=pillars&populate[11]=programs&populate[12]=resources.file&populate[13]=resources.coverImage',
  'case-studies?populate=*&pagination[pageSize]=100&sort=createdAt:asc',
  'case-study-page?populate=seo,heroImage,approachSteps,trustedClients.logo',
  'annual-report-page?populate[0]=heroImage&populate[1]=seo&populate[2]=reports&populate[3]=reports.pdfFile',
  'policy-page?populate[0]=heroImage&populate[1]=seo&populate[2]=sections',
  'top-header',
  'header?populate[0]=logo&populate[1]=navigation.subLinks',
  'footer?populate[0]=logo&populate[1]=companyLinks&populate[2]=resourceLinks&populate[3]=solutionLinks',
  'contact-page?populate[0]=heroImage&populate[1]=seo.ogImage&populate[2]=seo.twitterImage',
  'completed-page?populate=seo,heroImage',
  'ongoing-page?populate=seo,heroImage',
  'solution-pages?populate=*',
  'solution-pages?filters[slug]=industrial&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=whyPislImage&populate[3]=features&populate[4]=seo',
  'solution-pages?filters[slug]=infrastructure&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=whyPislImage&populate[3]=features&populate[4]=seo',
  'solution-pages?filters[slug]=logistic&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=grids.items&populate[3]=seo',
  'solution-pages?filters[slug]=warehouse&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=grids.items&populate[3]=seo'
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
      console.log(`⚠️ Could not auto-download project image ${fn}: ${e.message}`);
    }
  }
  return `/images/projects/${fn}`;
}

const awardsImagesDir = path.resolve(__dirname, '../public/images/awards');
if (!fs.existsSync(awardsImagesDir)) fs.mkdirSync(awardsImagesDir, { recursive: true });

async function ensureLocalAwardImage(url) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('r2.dev/')) return url;
  const fn = url.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
  const target = path.join(awardsImagesDir, fn);
  if (fs.existsSync(target)) return `/images/awards/${fn}`;
  if (fs.existsSync(path.join(awardsImagesDir, `large_${fn}`))) return `/images/awards/large_${fn}`;
  if (fs.existsSync(path.join(awardsImagesDir, `medium_${fn}`))) return `/images/awards/medium_${fn}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'PislinfraSync/2.0' } });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(target, buf);
      console.log(`📥 Auto-downloaded award image: ${fn}`);
      return `/images/awards/${fn}`;
    }
  } catch (e) {
    console.log(`⚠️ Could not auto-download award image ${fn}: ${e.message}`);
  }
  return `/images/awards/${fn}`;
}

async function fetchAwardsFromNeonDB() {
  try {
    let pg;
    try {
      pg = await import('pg');
    } catch (e) {
      try {
        pg = await import('../cms-pisl/node_modules/pg/lib/index.js');
      } catch (e2) {
        pg = await import('../../cms-pisl/node_modules/pg/lib/index.js');
      }
    }
    const { Client } = pg.default || pg;
    const client = new Client({
      connectionString: 'postgresql://neondb_owner:npg_0veFtX8HTnmY@ep-mute-voice-axlrx2cj-pooler.c-4.us-east-2.aws.neon.tech/neondb',
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();
    const res = await client.query(`
      SELECT a.*, f.url as image_url, f.formats as image_formats
      FROM awards a
      LEFT JOIN files_related_mph frm ON frm.related_id = a.id AND frm.related_type = 'api::award.award'
      LEFT JOIN files f ON f.id = frm.file_id
      ORDER BY a.created_at DESC, frm.order ASC;
    `);
    await client.end();
    if (res.rows && res.rows.length > 0) {
      const awardMap = new Map();
      for (const row of res.rows) {
        if (!awardMap.has(row.id)) {
          awardMap.set(row.id, {
            id: row.id,
            documentId: row.document_id || `award_${row.id}`,
            title: row.title,
            category: row.category,
            year: row.year,
            company: row.company,
            location: row.location,
            desc: row.desc || '',
            description: row.desc || '',
            featured: false,
            isFeatured: false,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            images: []
          });
        }
        if (row.image_url) {
          awardMap.get(row.id).images.push({
            url: row.image_url,
            formats: row.image_formats
          });
        }
      }
      const list = Array.from(awardMap.values());
      console.log(`✅ Fetched ${list.length} awards directly from Neon PostgreSQL database`);
      return list;
    }
  } catch (err) {
    console.log(`ℹ️ Direct Neon DB fallback skipped (${err.message})`);
  }
  return null;
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
          // Never let an older truncated list overwrite richer local/Strapi data
          if (Array.isArray(cleanVal) && Array.isArray(masterBackup[key]) && cleanVal.length < masterBackup[key].length) {
            console.log(`ℹ️ Preserving local ${key} (${masterBackup[key].length} items > Hostinger ${cleanVal.length} items)`);
            continue;
          }
          masterBackup[key] = cleanVal;
          const baseKey = key.split('?')[0];
          if (!Array.isArray(cleanVal) || !Array.isArray(masterBackup[baseKey]) || cleanVal.length >= masterBackup[baseKey].length) {
            masterBackup[baseKey] = cleanVal;
          }
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
        const res = await fetchJson(`${activeStrapiUrl}/api/${ep}`, 15000);
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

  // 2.1 Bulletproof DB Fallback: if awards collection is incomplete (< 40 items), fetch straight from Neon PostgreSQL
  const currentAwards = masterBackup['awards'] || masterBackup['awards?populate=*&pagination[pageSize]=100&sort=createdAt:desc'];
  if (!Array.isArray(currentAwards) || currentAwards.length < 40) {
    console.log('🔄 Checking direct Neon DB fallback for complete awards dataset...');
    const neonAwards = await fetchAwardsFromNeonDB();
    if (neonAwards && neonAwards.length > 0) {
      if (!Array.isArray(currentAwards) || neonAwards.length >= currentAwards.length) {
        masterBackup['awards'] = neonAwards;
        masterBackup['awards?populate=*&pagination[pageSize]=100&sort=createdAt:desc'] = neonAwards;
      }
    }
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
    const formattedAwards = await Promise.all(rawAwards.map(async (item, idx) => {
      const allImgs = [];
      const addImg = async (img) => {
        if (!img) return;
        if (Array.isArray(img)) {
          for (const sub of img) await addImg(sub);
          return;
        }
        let u = typeof img === 'string' ? img : (img.formats?.large?.url || img.formats?.medium?.url || img.url);
        if (!u) return;
        if (u.includes('r2.dev/')) {
          u = await ensureLocalAwardImage(u);
        }
        if (!allImgs.includes(u)) allImgs.push(u);
      };
      if (item.images) await addImg(item.images);
      if (item.image) await addImg(item.image);
      if (item.imageUrls) await addImg(item.imageUrls);
      if (item.clientImage) await addImg(item.clientImage);

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
    }));

    // Deduplicate by unique documentId / id / title+year to preserve every distinct award
    const seenAwards = new Set();
    const dedupedAwards = [];
    for (const a of formattedAwards) {
      if (!a || !a.title) continue;
      const key = a.documentId
        ? `doc_${a.documentId}`
        : (a.id
            ? `id_${a.id}`
            : `${(a.title || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')}_${a.year || ''}_${(a.company || '').trim().toLowerCase()}`);
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

  // 6.1 Ensure Coverage Markers
  const rawMarkers = masterBackup['coverage-markers'] || masterBackup['coverage-markers?populate=*&pagination[pageSize]=100'];
  if (Array.isArray(rawMarkers) && rawMarkers.length > 0) {
    const formattedMarkers = await Promise.all(rawMarkers.map(async (m) => {
      if (Array.isArray(m.images) && m.images.length > 0) {
        const localImgs = await Promise.all(m.images.map(async (img) => {
          let u = typeof img === 'string' ? img : (img.formats?.large?.url || img.formats?.medium?.url || img.url);
          if (u && typeof u === 'string' && u.includes('r2.dev/')) {
            return await ensureLocalProjectImage(u);
          }
          return u;
        }));
        return { ...m, images: localImgs.filter(Boolean) };
      }
      return m;
    }));
    const MARKERS_PATH = path.resolve(__dirname, '../src/data/coverageMarkersData.js');
    fs.writeFileSync(MARKERS_PATH, `const coverageMarkersData = ${JSON.stringify(formattedMarkers, null, 2)};\n\nexport default coverageMarkersData;\n`, 'utf8');
    masterBackup['coverage-markers'] = formattedMarkers;
    masterBackup['coverage-markers?populate=*&pagination[pageSize]=100'] = formattedMarkers;
    console.log(`✅ Synced coverage markers (${formattedMarkers.length}) into coverageMarkersData.js`);
  }

  // 6.2 Ensure Client Appreciations
  const rawApprec = masterBackup['client-appreciations'] || masterBackup['client-appreciations?populate=*&pagination[pageSize]=100'];
  if (Array.isArray(rawApprec) && rawApprec.length > 0) {
    const APPREC_PATH = path.resolve(__dirname, '../src/data/clientAppreciationsData.js');
    fs.writeFileSync(APPREC_PATH, `export const clientAppreciations = ${JSON.stringify(rawApprec, null, 2)};\n\nexport default clientAppreciations;\n`, 'utf8');
    console.log(`✅ Synced client appreciations (${rawApprec.length}) into clientAppreciationsData.js`);
  }

  // 7. Write Master Backup & Hostinger public static backup
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(masterBackup, null, 2), 'utf8');
  fs.writeFileSync(HOSTINGER_BACKUP_PATH, JSON.stringify(masterBackup, null, 2), 'utf8');

  // 7.1 Sync individual static JSON collections to public/data/ and dist/data/
  const publicDataDir = path.resolve(__dirname, '../public/data');
  const distDataDir = path.resolve(__dirname, '../dist/data');
  if (!fs.existsSync(publicDataDir)) fs.mkdirSync(publicDataDir, { recursive: true });
  if (fs.existsSync(path.resolve(__dirname, '../dist')) && !fs.existsSync(distDataDir)) {
    fs.mkdirSync(distDataDir, { recursive: true });
  }

  const writePublicAndDist = (filename, dataObj) => {
    if (!dataObj) return;
    const jsonStr = JSON.stringify(dataObj, null, 2);
    fs.writeFileSync(path.join(publicDataDir, filename), jsonStr, 'utf8');
    if (fs.existsSync(distDataDir)) {
      fs.writeFileSync(path.join(distDataDir, filename), jsonStr, 'utf8');
    }
  };

  writePublicAndDist('live-backup.json', masterBackup);
  if (masterBackup['ongoing-projects']) {
    writePublicAndDist('ongoing-projects.json', masterBackup['ongoing-projects']);
    writePublicAndDist('ongoing_projects.json', masterBackup['ongoing-projects']);
  }
  if (masterBackup['completed-projects']) {
    writePublicAndDist('completed-projects.json', masterBackup['completed-projects']);
    writePublicAndDist('completed_projects.json', masterBackup['completed-projects']);
  }
  if (masterBackup['awards']) {
    writePublicAndDist('awards.json', masterBackup['awards']);
  }
  if (masterBackup['client-appreciations']) {
    writePublicAndDist('client-appreciations.json', masterBackup['client-appreciations']);
  }
  if (masterBackup['coverage-markers']) {
    writePublicAndDist('coverage-markers.json', masterBackup['coverage-markers']);
  }

  // 8. Auto-update PROJECT_FILES & AWARD_FILES Sets in src/utils/imageUrl.js so newly downloaded images are instantly registered
  try {
    const imgUrlPath = path.resolve(__dirname, '../src/utils/imageUrl.js');
    if (fs.existsSync(imgUrlPath)) {
      let imgUrlContent = fs.readFileSync(imgUrlPath, 'utf8');

      if (fs.existsSync(projectImagesDir)) {
        const pFiles = fs.readdirSync(projectImagesDir).filter(f => !f.startsWith('.') && (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.avif') || f.endsWith('.svg')));
        pFiles.sort();
        const setStr = `const PROJECT_FILES = new Set(${JSON.stringify(pFiles)});`;
        imgUrlContent = imgUrlContent.replace(/const PROJECT_FILES = new Set\(\[[\s\S]*?\]\);/, setStr);
        console.log(`✅ Auto-registered ${pFiles.length} project images in src/utils/imageUrl.js`);
      }

      if (fs.existsSync(awardsImagesDir)) {
        const aFiles = fs.readdirSync(awardsImagesDir).filter(f => !f.startsWith('.') && (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.avif') || f.endsWith('.svg')));
        aFiles.sort();
        const awardSetStr = `const AWARD_FILES = new Set(${JSON.stringify(aFiles)});`;
        imgUrlContent = imgUrlContent.replace(/const AWARD_FILES = new Set\(\[[\s\S]*?\]\);/, awardSetStr);
        console.log(`✅ Auto-registered ${aFiles.length} award images in src/utils/imageUrl.js`);
      }

      fs.writeFileSync(imgUrlPath, imgUrlContent, 'utf8');
    }
  } catch (e) {
    console.warn('Could not update imageUrl.js:', e.message);
  }

  console.log('🌟 Complete offline backup bundle successfully saved to MainBackupPislinfra.json, public/data/ & dist/data/!');
}

syncBackup();
