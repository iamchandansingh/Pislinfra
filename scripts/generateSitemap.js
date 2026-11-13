import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import BlogDB from '../src/data/Blogdb.js';
import projectsData from '../src/data/projectsData.js';
import completedProjects from '../src/data/completedProjects.js';
import { jobOpeningsData } from '../src/data/careersJobsData.js';

const SITE_URL = 'https://pislinfra.com';
const TODAY = new Date().toISOString().split('T')[0];
const INDEXNOW_KEY = 'pislinfra2026indexnowkey';

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Normalizes any accidental local development URLs or relative URLs to absolute production URLs.
 */
function sanitizeUrl(raw) {
  if (!raw) return '';
  let str = String(raw).trim();
  // Strip query strings or trailing markers
  str = str.replace(/https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/wp-content\/uploads\/(?:[0-9]{4}\/[0-9]{2}\/)?([a-zA-Z0-9._-]+)/g, (match, fn) => {
    return `${SITE_URL}/images/uploads/${fn}`;
  });
  str = str.replace(/https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/g, SITE_URL);
  if (str.startsWith('/')) {
    str = `${SITE_URL}${str}`;
  }
  return str;
}

const getProjectSlug = (project) => {
  if (!project) return '';
  if (project.slug) return project.slug;
  const pName = project.name || project.projectName || project.project_name || project.title || '';
  const base = pName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const pLoc = project.location || project.city || project.state || '';
  if (base === 'pmg-logistics-park' && pLoc) {
    const locLower = pLoc.toLowerCase();
    if (locLower.includes('neemrana')) return `${base}-neemrana`;
    if (locLower.includes('hyderabad')) return `${base}-hyderabad`;
    if (locLower.includes('kolathur') || locLower.includes('bangalore') || locLower.includes('bengaluru')) return `${base}-kolathur-bangalore`;
    const loc = locLower.replace(/[,/]/g, ' ').trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${base}-${loc}`;
  }
  return base || String(project.id || '');
};

// Verified client list with actual files in public/images/uploads/
const clientsList = [
  { id: 1, name: 'Reliance Industries Limited', logoPath: '/images/uploads/Reliance-logo.webp' },
  { id: 2, name: 'AM/NS India (ArcelorMittal Nippon Steel India)', logoPath: '/images/uploads/NSINDIA.png' },
  { id: 3, name: 'Adani', logoPath: '/images/uploads/Adani.webp' },
  { id: 4, name: 'GAR', logoPath: '/images/uploads/GMR.webp' },
  { id: 5, name: 'Morgan Stanley', logoPath: '/images/uploads/MorganStanley.webp' },
  { id: 6, name: 'Prologis', logoPath: '/images/uploads/Prologis.webp' },
  { id: 7, name: 'Lodha', logoPath: '/images/uploads/Lodha.webp' },
  { id: 8, name: 'PMG', logoPath: '/images/uploads/Pmg.png' },
  { id: 9, name: 'CPWD (Central Public Works Department)', logoPath: '/images/uploads/Cpwd.webp' },
  { id: 10, name: 'VinFast', logoPath: '/images/uploads/Vinfast.png' },
  { id: 11, name: 'Rajratan', logoPath: '/images/uploads/Rajratan-2.webp' },
  { id: 12, name: 'Oswal Group', logoPath: '/images/uploads/OswalGroup.png' },
  { id: 13, name: 'Avitech', logoPath: '/images/uploads/avitech.webp' },
  { id: 14, name: 'Amazon', logoPath: '/images/uploads/Amazon.webp' },
  { id: 15, name: 'Flipkart', logoPath: '/images/uploads/Flipkart.webp' },
  { id: 16, name: 'Ecom Express', logoPath: '/images/uploads/EcomExpress.webp' },
  { id: 17, name: 'Daikin', logoPath: '/images/uploads/DAIKIN.webp' },
  { id: 18, name: 'Bosch', logoPath: '/images/uploads/Bosch.webp' },
  { id: 19, name: 'Allcargo', logoPath: '/images/uploads/allCargo.webp' },
  { id: 20, name: 'Myntra', logoPath: '/images/uploads/Myntra.webp' },
  { id: 21, name: 'Cadbury', logoPath: '/images/uploads/Cadbury.webp' },
  { id: 22, name: 'Blue Dart', logoPath: '/images/uploads/BLUEDART.webp' },
  { id: 23, name: 'DHL', logoPath: '/images/uploads/DHL.webp' },
  { id: 24, name: 'Haryana Government', logoPath: '/images/uploads/HariyanaGoverment.png' },
  { id: 25, name: 'Lodha Group', logoPath: '/images/uploads/LOHIAGrups.webp' },
  { id: 26, name: 'LOGOS', logoPath: '/images/uploads/Logos.webp' }
];

// Verified 8 case studies with real project images
const caseStudiesList = [
  {
    slug: 'sunsat-warehousing',
    title: 'Flipkart Sampka - Sunsat Warehousing',
    project: 'Flipkart FCMH',
    developer: 'Sunsat Warehousing Pvt. Ltd.',
    location: 'Sampka, Delhi NCR',
    image: '/images/uploads/flipkart-sampka-pataudi-hr.png',
    seoTitle: 'Flipkart Sampka - Sunsat Warehousing Case Study | Pislinfra',
    seoDescription: 'Pislinfra completed 0.84 Million Sq. Ft Flipkart FCMH facility in 9 months with 104 dock doors and underground fire corridor.'
  },
  {
    slug: 'pragati-farukhnagar-logistics',
    title: 'Pragati Farukhnagar Logistics Park Phase I (Flipkart)',
    project: 'Flipkart',
    developer: 'Morgan Stanley',
    location: 'Farrukhnagar, Haryana',
    image: '/images/uploads/pragati-farrukhnagar-logistics-park-hr.png',
    seoTitle: 'Pragati Farukhnagar Logistics Park Case Study | Pislinfra',
    seoDescription: '10 Lakh sq. ft Grade-A warehouse delivered for Flipkart & Morgan Stanley with high-speed execution.'
  },
  {
    slug: 'ludhiana-logistics-park',
    title: 'Ludhiana Logistics Park',
    project: 'Industrial Logistics Hub',
    developer: 'Ludhiana Logistics',
    location: 'Ludhiana, Punjab',
    image: '/images/uploads/ludhiana-logistics-park-pb.png',
    seoTitle: 'Ludhiana Logistics Park Case Study | Pislinfra',
    seoDescription: 'High-bay industrial warehousing and distribution park engineered in Ludhiana, Punjab.'
  },
  {
    slug: 'bluestar-realtors-palwal',
    title: 'Bluestar Realtors Palwal (Ecom Express)',
    project: 'Ecom Express Fulfillment Center',
    developer: 'Bluestar Realtors Ltd',
    location: 'Palwal, NCR',
    image: '/images/uploads/bluestar-realtors-ltd-palwal-hr-3.png',
    seoTitle: 'Bluestar Realtors Palwal Case Study | Pislinfra',
    seoDescription: 'Turnkey distribution facility built for Ecom Express in Palwal with advanced sorting layouts.'
  },
  {
    slug: 'ncr-bigbox-patli',
    title: 'NCR Bigbox Patli (Welspun)',
    project: 'Bigbox Logistics Park',
    developer: 'Welspun One',
    location: 'Patli, NCR',
    image: '/images/uploads/large_ncr_bigbox_patli_hr_3_6aa090f432.png',
    seoTitle: 'NCR Bigbox Patli Case Study | Pislinfra',
    seoDescription: 'Grade-A industrial logistics park delivered with FM2 flooring and heavy-load capacity.'
  },
  {
    slug: 'avitech-nutrition-farukhnagar',
    title: 'Avitech Nutrition Farukhnagar',
    project: 'Manufacturing Plant',
    developer: 'Avitech Nutrition',
    location: 'Farrukhnagar, Haryana',
    image: '/images/uploads/avitech-nutrition-farukhnager-hr-3.png',
    seoTitle: 'Avitech Nutrition Farukhnagar Plant Case Study | Pislinfra',
    seoDescription: 'State-of-the-art animal nutrition manufacturing facility engineered and constructed by Pislinfra.'
  },
  {
    slug: 'om-sukh-logistics-park-pataudi',
    title: 'Om Sukh Logistics Park Pataudi',
    project: 'Logistics Park',
    developer: 'Om Sukh Developers',
    location: 'Pataudi, NCR',
    image: '/images/uploads/large_om_sukh_logistics_park_pataudi_hr_3_c62a9212a2.png',
    seoTitle: 'Om Sukh Logistics Park Pataudi Case Study | Pislinfra',
    seoDescription: 'Multi-user Grade-A warehousing park developed in Pataudi with modern utility networks.'
  },
  {
    slug: 'gmr-coimbatore-logistics-park',
    title: 'GMR Coimbatore Logistics Park',
    project: 'Multi-Modal Logistics Park',
    developer: 'GMR Group',
    location: 'Coimbatore, Tamil Nadu',
    image: '/images/uploads/gmr-coimbatore-logistics-park-coimbatore-tn-2.png',
    seoTitle: 'GMR Coimbatore Logistics Park Case Study | Pislinfra',
    seoDescription: 'Strategic logistics park constructed for GMR in Coimbatore, Tamil Nadu.'
  }
];

// Verified downloadable public PDFs
const PDF_DOCUMENTS = [
  {
    path: '/reports/Pragati-Infra-Solutions-Corporate-Profile.pdf',
    title: 'Pragati Infra Solutions - Comprehensive Corporate Profile',
    caption: 'Complete 35-page corporate credentials, warehouse engineering portfolio, and turnkey EPC profile.'
  },
  {
    path: '/reports/Pragati-Infra-Solutions-2.pdf',
    title: 'Pragati Infra Solutions - Capabilities Brochure',
    caption: 'Official corporate overview and turnkey industrial EPC capabilities brochure.'
  },
  {
    path: '/reports/HSE_POLICY_PISL.pdf',
    title: 'Pragati Infra Solutions - Health, Safety &amp; Environment (HSE) Policy',
    caption: 'Official Environment, Health and Safety policy and zero-harm framework of Pislinfra.'
  },
  {
    path: '/reports/CSR_Policy_PISL_2e584fd56d.pdf',
    title: 'Pragati Infra Solutions - Corporate Social Responsibility (CSR) Policy',
    caption: 'Official CSR governance, education initiatives, and social outreach policy of Pislinfra.'
  },
  {
    path: '/reports/Vigil_Mechanism_Policy_PISL_6c1fe65e70.pdf',
    title: 'Pragati Infra Solutions - Vigil Mechanism Policy',
    caption: 'Corporate governance and whistle-blower vigil mechanism policy of Pislinfra.'
  },
  {
    path: '/reports/Risk_Management_Policy_PISL_37fe051837.pdf',
    title: 'Pragati Infra Solutions - Risk Management Policy',
    caption: 'Enterprise risk management framework and operational risk mitigation policy of Pislinfra.'
  },
  {
    path: '/reports/Annual-Reports-2023-2024.pdf',
    title: 'Pislinfra Annual Report 2023-2024',
    caption: 'Financial statements, corporate governance, and annual review of operations for FY 2023-2024.'
  },
  {
    path: '/reports/Annual-Return_2024-25.pdf',
    title: 'Pislinfra Annual Return 2024-2025',
    caption: 'Statutory compliance and annual return filing for FY 2024-2025.'
  },
  {
    path: '/reports/Annual-Return-2022-23.pdf',
    title: 'Pislinfra Annual Return 2022-2023',
    caption: 'Annual corporate filing and financial return for FY 2022-2023.'
  },
  {
    path: '/reports/Annual-Return-2021-22.pdf',
    title: 'Pislinfra Annual Return 2021-2022',
    caption: 'Annual return and operations audit for FY 2021-2022.'
  },
  {
    path: '/reports/Pragati-Infra-Solutions-Private-Limited_Annual-Return_2020-21-1.pdf',
    title: 'Pislinfra Annual Return 2020-2021',
    caption: 'Corporate annual return documentation for FY 2020-2021.'
  },
  {
    path: '/reports/Pragati-Infra-Solutions-Private-Limited_Annual-Return_2019-2020.pdf',
    title: 'Pislinfra Annual Return 2019-2020',
    caption: 'Statutory filings and corporate audit for FY 2019-2020.'
  }
];

const SOLUTION_PAGES_META = [
  {
    loc: `${SITE_URL}/solutions`,
    priority: '0.95',
    changefreq: 'weekly',
    image: `${SITE_URL}/images/hero/Service.png`,
    title: 'Turnkey Industrial &amp; Infrastructure Solutions | Pislinfra',
    caption: 'Comprehensive industrial construction, warehouse design &amp; build, logistics parks, and turnkey EPC across India.'
  },
  {
    loc: `${SITE_URL}/solutions/industrial`,
    priority: '0.95',
    changefreq: 'weekly',
    image: `${SITE_URL}/images/hero/Service.png`,
    title: 'Turnkey Industrial Construction &amp; Manufacturing Plants EPC | Pislinfra',
    caption: 'Leading industrial construction EPC contractor in India. Heavy structural steel, factory buildings, and manufacturing plants.'
  },
  {
    loc: `${SITE_URL}/solutions/infrastructure`,
    priority: '0.95',
    changefreq: 'weekly',
    image: `${SITE_URL}/images/hero/Service.png`,
    title: 'Heavy Civil &amp; Utility Infrastructure Development Solutions | Pislinfra',
    caption: 'Delivering world-class civil infrastructure, highways, industrial road networks, and utility grids across India.'
  },
  {
    loc: `${SITE_URL}/solutions/logistic`,
    priority: '0.95',
    changefreq: 'weekly',
    image: `${SITE_URL}/images/hero/Service.png`,
    title: 'Grade-A Logistics Parks &amp; Distribution Centers Construction | Pislinfra',
    caption: 'Specialized construction of Grade-A logistics parks, warehousing hubs, and multi-modal distribution centers.'
  },
  {
    loc: `${SITE_URL}/solutions/warehouse`,
    priority: '0.95',
    changefreq: 'weekly',
    image: `${SITE_URL}/images/hero/Service.png`,
    title: 'Modern Warehouse Design &amp; LEED Certified Construction | Pislinfra',
    caption: 'Premier warehouse construction company in India. High-bay PEB buildings, FM2 floor specifications, and LEED gold green warehousing.'
  }
];

const CORE_PAGES_META = [
  {
    loc: `${SITE_URL}/`,
    priority: '1.0',
    changefreq: 'daily',
    image: `${SITE_URL}/logo.png`,
    title: 'Pislinfra - Industrial &amp; Infrastructure Construction',
    caption: 'Leading Turnkey Industrial Construction and PEB Engineering in India'
  },
  {
    loc: `${SITE_URL}/about`,
    priority: '0.95',
    changefreq: 'monthly',
    image: `${SITE_URL}/images/hero/11.png`,
    title: 'About Pislinfra - Corporate Overview &amp; Infrastructure Legacy',
    caption: 'Premier industrial EPC contractor with 16M+ sq ft of warehouses and logistics parks delivered across India.'
  },
  {
    loc: `${SITE_URL}/about/leadership`,
    priority: '0.9',
    changefreq: 'monthly',
    image: `${SITE_URL}/images/hero/leadership.png`,
    title: 'Executive Leadership &amp; Board of Directors | Pislinfra',
    caption: 'Visionary leadership team steering India\'s leading industrial infrastructure and turnkey construction enterprise.'
  },
  {
    loc: `${SITE_URL}/about/ehs`,
    priority: '0.9',
    changefreq: 'monthly',
    image: `${SITE_URL}/images/hero/EHS.png`,
    title: 'Environment, Health &amp; Safety (EHS) Policy &amp; Standards | Pislinfra',
    caption: '15+ Million safe man-hours and zero-LTI construction safety protocols with ISO certifications.'
  },
  {
    loc: `${SITE_URL}/about/csr`,
    priority: '0.85',
    changefreq: 'monthly',
    image: `${SITE_URL}/images/hero/CSR.png`,
    title: 'Corporate Social Responsibility (CSR) Initiatives | Pislinfra',
    caption: 'Grassroots social impact, education, healthcare, and ecological tree plantation programs.'
  },
  {
    loc: `${SITE_URL}/about/awards`,
    priority: '0.95',
    changefreq: 'weekly',
    image: `${SITE_URL}/images/hero/Awards-Certification.png`,
    title: 'Awards, Accolades &amp; Industry Recognitions | Pislinfra',
    caption: 'Prestigious industry honors, safety excellence recognitions by Adani and Fortune 500 clients.'
  },
  {
    loc: `${SITE_URL}/company-policy`,
    priority: '0.9',
    changefreq: 'monthly',
    image: `${SITE_URL}/images/hero/EHS.png`,
    title: 'Company Policy &amp; Corporate Governance | Pislinfra',
    caption: 'Official corporate governance, CSR, Vigil Mechanism, and Risk Management policies.'
  },
  {
    loc: `${SITE_URL}/coverage`,
    priority: '0.9',
    changefreq: 'weekly',
    image: `${SITE_URL}/images/hero/Ongoing-Projects.png`,
    title: 'Nationwide Construction Coverage Across India | Pislinfra',
    caption: 'Explore our multi-state presence delivering warehousing and infrastructure projects.'
  },
  {
    loc: `${SITE_URL}/annual-reports`,
    priority: '0.85',
    changefreq: 'monthly',
    image: `${SITE_URL}/images/hero/Annual-Reports.png`,
    title: 'Annual Reports &amp; Financial Statements | Pislinfra',
    caption: 'Annual returns and corporate governance filings of Pragati Infra Solutions.'
  },
  {
    loc: `${SITE_URL}/contact-us`,
    priority: '0.9',
    changefreq: 'monthly',
    image: `${SITE_URL}/images/hero/Contact-Us.png`,
    title: 'Contact Pislinfra Corporate Office',
    caption: 'Get in touch for industrial construction, warehousing and EPC projects across India.'
  },
  {
    loc: `${SITE_URL}/privacy-policy`,
    priority: '0.7',
    changefreq: 'yearly',
    image: `${SITE_URL}/logo.png`,
    title: 'Privacy Policy | Pislinfra',
    caption: 'Privacy policy and data governance practices of Pragati Infra Solutions Pvt. Ltd.'
  },
  {
    loc: `${SITE_URL}/sitemap`,
    priority: '0.7',
    changefreq: 'weekly',
    image: `${SITE_URL}/images/hero/Sitemap.png`,
    title: 'Website Sitemap | Pislinfra',
    caption: 'Complete hierarchical directory of all pages, solutions, and projects.'
  }
];

function generateSitemapsAndFeeds() {
  console.log('🚀 Generating Full Modular XML Sitemap Index, Child Sitemaps & RSS Feeds...');

  const publishedBlogs = Array.isArray(BlogDB) 
    ? BlogDB.filter(b => b.slug && b.status !== 'draft')
    : [];

  const allProjectsList = [
    ...projectsData.map(p => ({ ...p, projectType: 'ongoing' })),
    ...completedProjects.map(p => ({ ...p, projectType: 'completed' }))
  ];

  // ==========================================
  // 1. SITEMAP INDEX (sitemap.xml)
  // ==========================================
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-pages.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-projects.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-case-studies.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-solutions.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-blogs.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-careers.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-images.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-documents.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>
`;

  // ==========================================
  // 2. PAGES SITEMAP (sitemap-pages.xml)
  // ==========================================
  let pagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  CORE_PAGES_META.forEach(p => {
    pagesXml += `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <image:image>
      <image:loc>${sanitizeUrl(p.image)}</image:loc>
      <image:title>${escapeXml(p.title)}</image:title>
      <image:caption>${escapeXml(p.caption)}</image:caption>
    </image:image>
  </url>\n`;
  });

  pagesXml += `</urlset>\n`;

  // ==========================================
  // 3. SOLUTIONS SITEMAP (sitemap-solutions.xml)
  // ==========================================
  let solutionsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  SOLUTION_PAGES_META.forEach(s => {
    solutionsXml += `  <url>
    <loc>${s.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${s.changefreq}</changefreq>
    <priority>${s.priority}</priority>
    <image:image>
      <image:loc>${sanitizeUrl(s.image)}</image:loc>
      <image:title>${escapeXml(s.title)}</image:title>
      <image:caption>${escapeXml(s.caption)}</image:caption>
    </image:image>
  </url>\n`;
  });

  solutionsXml += `</urlset>\n`;

  // ==========================================
  // 4. PROJECTS SITEMAP (sitemap-projects.xml)
  // ==========================================
  let projectsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <url>
    <loc>${SITE_URL}/projects/ongoing</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/hero/Ongoing-Projects.png</image:loc>
      <image:title>Ongoing Infrastructure Projects - Pislinfra</image:title>
      <image:caption>Active construction sites and industrial facilities under execution across India.</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${SITE_URL}/projects/completed</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/hero/Completed-Projects.png</image:loc>
      <image:title>Completed Industrial Projects - Pislinfra</image:title>
      <image:caption>Successfully delivered warehousing and industrial infrastructure across India.</image:caption>
    </image:image>
  </url>
`;

  allProjectsList.forEach(proj => {
    const projectType = proj.projectType;
    const projectSlug = getProjectSlug(proj);
    const loc = `${SITE_URL}/project/${projectType}/${projectSlug}`;
    const cleanTitle = escapeXml(`${proj.name} - ${proj.category} in ${proj.location}, ${proj.state}`);
    const cleanCaption = escapeXml(`${proj.name} for ${proj.client}. Area: ${proj.area}. Status: ${proj.status}. Delivered by Pislinfra.`);

    let projectImagesXml = '';
    if (proj.images && proj.images.length > 0) {
      proj.images.forEach((img, idx) => {
        const fullImg = sanitizeUrl(img);
        projectImagesXml += `    <image:image>
      <image:loc>${fullImg}</image:loc>
      <image:title>${cleanTitle} (Photo ${idx + 1})</image:title>
      <image:caption>${cleanCaption}</image:caption>
    </image:image>\n`;
      });
    }

    projectsXml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
${projectImagesXml}  </url>\n`;
  });

  projectsXml += `</urlset>\n`;

  // ==========================================
  // 5. CASE STUDIES SITEMAP (sitemap-case-studies.xml)
  // ==========================================
  let caseStudiesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <url>
    <loc>${SITE_URL}/projects/case-study</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/hero/Case-Study.png</image:loc>
      <image:title>Infrastructure Construction Case Studies - Pislinfra</image:title>
      <image:caption>In-depth engineering analyses and execution case studies of landmark industrial infrastructure delivered by Pislinfra.</image:caption>
    </image:image>
  </url>
`;

  caseStudiesList.forEach(cs => {
    const loc = `${SITE_URL}/projects/case-study/${cs.slug}`;
    const fullImg = sanitizeUrl(cs.image);
    const title = escapeXml(cs.seoTitle || `${cs.title} Case Study | Pislinfra`);
    const caption = escapeXml(cs.seoDescription || `${cs.title} project delivered by Pislinfra in ${cs.location}`);

    caseStudiesXml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${fullImg}</image:loc>
      <image:title>${title}</image:title>
      <image:caption>${caption}</image:caption>
    </image:image>
  </url>\n`;
  });

  caseStudiesXml += `</urlset>\n`;

  // ==========================================
  // 6. BLOGS SITEMAP (sitemap-blogs.xml)
  // ==========================================
  let blogXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/hero/Blog.png</image:loc>
      <image:title>Industrial Construction &amp; Infrastructure Insights - Pislinfra Blog</image:title>
      <image:caption>Expert insights, engineering case studies and warehouse construction guides from Pislinfra.</image:caption>
    </image:image>
  </url>
`;

  publishedBlogs.forEach(blog => {
    const slug = blog.slug;
    const title = blog.title || '';
    const excerpt = (blog.excerpt || blog.seoDescription || title).replace(/[\n\r]+/g, ' ').trim();
    const publishDate = blog.publishDate || TODAY;
    const rawImg = blog.featuredImage || blog.image || '/images/hero/Blog.png';
    const imgUrl = sanitizeUrl(rawImg);
    
    const cleanTitle = escapeXml(title);
    const cleanExcerpt = escapeXml(excerpt.substring(0, 160));

    blogXml += `  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${publishDate.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${cleanTitle}</image:title>
      <image:caption>${cleanExcerpt}</image:caption>
    </image:image>
  </url>\n`;
  });

  blogXml += `</urlset>\n`;

  // ==========================================
  // 7. CAREERS SITEMAP (sitemap-careers.xml)
  // ==========================================
  let careersXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <url>
    <loc>${SITE_URL}/careers</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/hero/Careers.png</image:loc>
      <image:title>Careers at Pislinfra - 27+ Current Engineering &amp; Construction Job Openings</image:title>
      <image:caption>Join Pislinfra engineering, project management, and construction leadership teams across India.</image:caption>
    </image:image>
  </url>
`;

  jobOpeningsData.forEach(job => {
    const jobSlug = job.slug || job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const cleanTitle = escapeXml(`${job.title} Careers | Pragati Infra Solutions`);
    const cleanDesc = escapeXml(`Apply for ${job.title} vacancy in ${job.department} department at Pragati Infra Solutions Pvt. Ltd. Location: ${job.location}, Experience: ${job.experience}`);

    careersXml += `  <url>
    <loc>${SITE_URL}/careers/${jobSlug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/hero/Careers.png</image:loc>
      <image:title>${cleanTitle}</image:title>
      <image:caption>${cleanDesc}</image:caption>
    </image:image>
  </url>\n`;
  });

  careersXml += `</urlset>\n`;

  // ==========================================
  // 8. DOCUMENTS SITEMAP (sitemap-documents.xml)
  // ==========================================
  let docsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  PDF_DOCUMENTS.forEach(doc => {
    const docLoc = `${SITE_URL}${doc.path}`;
    docsXml += `  <url>
    <loc>${docLoc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
  });

  docsXml += `</urlset>\n`;

  // ==========================================
  // 9. IMAGES SITEMAP (sitemap-images.xml)
  // ==========================================
  let imagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
`;

  clientsList.forEach(cl => {
    const logoUrl = sanitizeUrl(cl.logoPath);
    const clientTitle = escapeXml(`${cl.name} Logo - Client Partner of Pragati Infra Solutions`);
    const clientCaption = escapeXml(`Pragati Infra Solutions delivered turnkey warehousing, PEB manufacturing plants and civil infrastructure for ${cl.name} in India.`);

    imagesXml += `    <image:image>
      <image:loc>${logoUrl}</image:loc>
      <image:title>${clientTitle}</image:title>
      <image:caption>${clientCaption}</image:caption>
    </image:image>\n`;
  });

  imagesXml += `  </url>\n</urlset>\n`;

  // ==========================================
  // 10. RSS 2.0 & FEED.XML
  // ==========================================
  let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Pislinfra - Industrial Construction &amp; Infrastructure Insights</title>
    <link>${SITE_URL}/blog</link>
    <description>Latest expert insights, engineering advances, and warehouse construction strategies from Pislinfra.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
`;

  publishedBlogs.forEach(blog => {
    const slug = blog.slug;
    const title = escapeXml(blog.title);
    const desc = escapeXml((blog.excerpt || blog.seoDescription || '').replace(/[\n\r]+/g, ' ').trim());
    const pubDate = new Date(blog.publishDate || TODAY).toUTCString();
    const category = escapeXml(blog.category || 'Industrial Construction');
    const author = escapeXml(blog.author?.name || 'Pragati Infra Solutions Pvt. Ltd.');

    rssXml += `    <item>
      <title>${title}</title>
      <link>${SITE_URL}/blog/${slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${slug}</guid>
      <description>${desc}</description>
      <category>${category}</category>
      <dc:creator>${author}</dc:creator>
      <pubDate>${pubDate}</pubDate>
    </item>\n`;
  });

  rssXml += `  </channel>
</rss>\n`;

  // Save all files in public directory
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndexXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'sitemap-pages.xml'), pagesXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'sitemap-solutions.xml'), solutionsXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'sitemap-projects.xml'), projectsXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'sitemap-case-studies.xml'), caseStudiesXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'sitemap-blogs.xml'), blogXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'sitemap-careers.xml'), careersXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'sitemap-documents.xml'), docsXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'sitemap-images.xml'), imagesXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'feed.xml'), rssXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'indexnow-key.txt'), INDEXNOW_KEY, 'utf-8');

  // Also write directly to dist if present
  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapIndexXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-pages.xml'), pagesXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-solutions.xml'), solutionsXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-projects.xml'), projectsXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-case-studies.xml'), caseStudiesXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-blogs.xml'), blogXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-careers.xml'), careersXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-documents.xml'), docsXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-images.xml'), imagesXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'feed.xml'), rssXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY, 'utf-8');
  }

  console.log(`✅ sitemap.xml (<sitemapindex>) generated cleanly`);
  console.log(`✅ sitemap-pages.xml (${CORE_PAGES_META.length} pages including /company-policy)`);
  console.log(`✅ sitemap-solutions.xml (${SOLUTION_PAGES_META.length} solution pages)`);
  console.log(`✅ sitemap-projects.xml (${allProjectsList.length + 2} project pages & images)`);
  console.log(`✅ sitemap-case-studies.xml (${caseStudiesList.length + 1} case study pages)`);
  console.log(`✅ sitemap-blogs.xml (${publishedBlogs.length + 1} blog posts & images)`);
  console.log(`✅ sitemap-careers.xml (${jobOpeningsData.length + 1} career pages: hub + 27 jobs)`);
  console.log(`✅ sitemap-documents.xml (${PDF_DOCUMENTS.length} corporate PDFs)`);
  console.log(`✅ sitemap-images.xml (${clientsList.length} verified client logos)`);
  console.log(`✅ rss.xml & feed.xml RSS feeds generated`);
  console.log(`✅ IndexNow verification key created`);
}

generateSitemapsAndFeeds();
