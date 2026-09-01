import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import BlogDB from '../src/data/Blogdb.js';
import projectsData from '../src/data/projectsData.js';
import completedProjects from '../src/data/completedProjects.js';

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

const slugify = (str) => (str || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const clientsList = [
  { id: 1, name: 'Reliance Industries Limited', logoPath: '/assets/images/CLIENTS/Reliance-logo.webp' },
  { id: 2, name: 'AM/NS India (ArcelorMittal Nippon Steel India)', logoPath: '/assets/images/CLIENTS/NSINDIA.png' },
  { id: 3, name: 'Adani', logoPath: '/assets/images/CLIENTS/Adani.webp' },
  { id: 4, name: 'GAR', logoPath: '/assets/images/CLIENTS/GMR.webp' },
  { id: 5, name: 'Morgan Stanley', logoPath: '/assets/images/CLIENTS/MorganStanley.webp' },
  { id: 6, name: 'Prologis', logoPath: '/assets/images/CLIENTS/Prologis.webp' },
  { id: 7, name: 'Lodha', logoPath: '/assets/images/CLIENTS/Lodha.webp' },
  { id: 8, name: 'PMG', logoPath: '/assets/images/CLIENTS/Pmg.png' },
  { id: 9, name: 'CPWD (Central Public Works Department)', logoPath: '/assets/images/CLIENTS/Cpwd.webp' },
  { id: 10, name: 'VinFast', logoPath: '/assets/images/CLIENTS/Vinfast.png' },
  { id: 11, name: 'SEMAC', logoPath: '/assets/images/CLIENTS/semac-2.webp' },
  { id: 12, name: 'Rajratan', logoPath: '/assets/images/CLIENTS/Rajratan-2.webp' },
  { id: 13, name: 'Oswal Group', logoPath: '/assets/images/CLIENTS/OswalGroup.png' },
  { id: 14, name: 'Avitech', logoPath: '/assets/images/CLIENTS/avitech.webp' },
  { id: 15, name: 'Amazon', logoPath: '/assets/images/CLIENTS/Amazon.webp' },
  { id: 16, name: 'Flipkart', logoPath: '/assets/images/CLIENTS/Flipkart.webp' },
  { id: 17, name: 'Ecom Express', logoPath: '/assets/images/CLIENTS/EcomExpress.webp' },
  { id: 18, name: 'Daikin', logoPath: '/assets/images/CLIENTS/DAIKIN.webp' },
  { id: 19, name: 'Bosch', logoPath: '/assets/images/CLIENTS/Bosch.webp' },
  { id: 20, name: 'Allcargo', logoPath: '/assets/images/CLIENTS/allCargo.webp' },
  { id: 21, name: 'Myntra', logoPath: '/assets/images/CLIENTS/Myntra.webp' },
  { id: 22, name: 'Cadbury', logoPath: '/assets/images/CLIENTS/Cadbury.webp' },
  { id: 23, name: 'Blue Dart', logoPath: '/assets/images/CLIENTS/BLUEDART.webp' },
  { id: 24, name: 'DHL', logoPath: '/assets/images/CLIENTS/DHL.webp' },
  { id: 25, name: 'Haryana Government', logoPath: '/assets/images/CLIENTS/HariyanaGoverment.png' },
  { id: 26, name: 'Stellar', logoPath: '/assets/images/CLIENTS/steller.webp' },
  { id: 27, name: 'Lodha Group', logoPath: '/assets/images/CLIENTS/LOHIAGrups.webp' },
  { id: 28, name: 'LOGOS', logoPath: '/assets/images/CLIENTS/Logos.webp' }
];

const caseStudiesList = [
  {
    slug: 'sunsat-warehousing',
    title: 'Flipkart Sampka - Sunsat Warehousing',
    project: 'Flipkart FCMH',
    developer: 'Sunsat Warehousing Pvt. Ltd.',
    location: 'Sampka, Delhi NCR',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'Flipkart Sampka - Sunsat Warehousing Case Study | Pislinfra',
    seoDescription: 'Pislinfra completed 0.84 Million Sq. Ft Flipkart FCMH facility in 9 months with 104 dock doors and Asia\'s longest underground fire corridor.'
  },
  {
    slug: 'pragati-farukhnagar-logistics',
    title: 'Pragati Farukhnagar Logistics Park Phase I (Flipkart)',
    project: 'Flipkart',
    developer: 'Morgan Stanley',
    location: 'Farrukhnagar, Haryana',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'Pragati Farukhnagar Logistics Park Case Study | Pislinfra',
    seoDescription: '10 Lakh sq. ft Grade-A warehouse delivered for Flipkart & Morgan Stanley with high-speed execution.'
  },
  {
    slug: 'ludhiana-logistics-park',
    title: 'Ludhiana Logistics Park',
    project: 'Industrial Logistics Hub',
    developer: 'Ludhiana Logistics',
    location: 'Ludhiana, Punjab',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'Ludhiana Logistics Park Case Study | Pislinfra',
    seoDescription: 'High-bay industrial warehousing and distribution park engineered in Ludhiana, Punjab.'
  },
  {
    slug: 'bluestar-realtors-palwal',
    title: 'Bluestar Realtors Palwal (Ecom Express)',
    project: 'Ecom Express Fulfillment Center',
    developer: 'Bluestar Realtors Ltd',
    location: 'Palwal, NCR',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'Bluestar Realtors Palwal Case Study | Pislinfra',
    seoDescription: 'Turnkey distribution facility built for Ecom Express in Palwal with advanced sorting layouts.'
  },
  {
    slug: 'ncr-bigbox-patli',
    title: 'NCR Bigbox Patli (Welspun)',
    project: 'Bigbox Logistics Park',
    developer: 'Welspun One',
    location: 'Patli, NCR',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'NCR Bigbox Patli Case Study | Pislinfra',
    seoDescription: 'Grade-A industrial logistics park delivered with FM2 flooring and heavy-load capacity.'
  },
  {
    slug: 'avitech-nutrition-farukhnagar',
    title: 'Avitech Nutrition Farukhnagar',
    project: 'Manufacturing Plant',
    developer: 'Avitech Nutrition',
    location: 'Farrukhnagar, Haryana',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'Avitech Nutrition Farukhnagar Plant Case Study | Pislinfra',
    seoDescription: 'State-of-the-art animal nutrition manufacturing facility engineered and constructed by Pislinfra.'
  },
  {
    slug: 'om-sukh-logistics-park-pataudi',
    title: 'Om Sukh Logistics Park Pataudi',
    project: 'Logistics Park',
    developer: 'Om Sukh Developers',
    location: 'Pataudi, NCR',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'Om Sukh Logistics Park Pataudi Case Study | Pislinfra',
    seoDescription: 'Multi-user Grade-A warehousing park developed in Pataudi with modern utility networks.'
  },
  {
    slug: 'gmr-coimbatore-logistics-park',
    title: 'GMR Coimbatore Logistics Park',
    project: 'Multi-Modal Logistics Park',
    developer: 'GMR Group',
    location: 'Coimbatore, Tamil Nadu',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'GMR Coimbatore Logistics Park Case Study | Pislinfra',
    seoDescription: 'Strategic logistics park constructed for GMR in Coimbatore, Tamil Nadu.'
  }
];

const PDF_DOCUMENTS = [
  {
    path: '/reports/Pragati-Infra-Solutions-2.pdf',
    title: 'Pragati Infra Solutions - Corporate Profile &amp; Capability Brochure',
    caption: 'Official corporate overview, warehouse engineering specifications, and turnkey industrial EPC portfolio of Pislinfra.'
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
    image: `${SITE_URL}/images/hero/Industrial.png`,
    title: 'Turnkey Industrial Construction &amp; Manufacturing Plants EPC | Pislinfra',
    caption: 'Leading industrial construction EPC contractor in India. Heavy structural steel, factory buildings, and manufacturing plants.'
  },
  {
    loc: `${SITE_URL}/solutions/infrastructure`,
    priority: '0.95',
    changefreq: 'weekly',
    image: `${SITE_URL}/images/hero/Infrastructure.png`,
    title: 'Heavy Civil &amp; Utility Infrastructure Development Solutions | Pislinfra',
    caption: 'Delivering world-class civil infrastructure, highways, industrial road networks, and utility grids across India.'
  },
  {
    loc: `${SITE_URL}/solutions/logistic`,
    priority: '0.95',
    changefreq: 'weekly',
    image: `${SITE_URL}/images/hero/Logistic.png`,
    title: 'Grade-A Logistics Parks &amp; Distribution Centers Construction | Pislinfra',
    caption: 'Specialized construction of Grade-A logistics parks, warehousing hubs, and multi-modal distribution centers.'
  },
  {
    loc: `${SITE_URL}/solutions/warehouse`,
    priority: '0.95',
    changefreq: 'weekly',
    image: `${SITE_URL}/images/hero/Warehouse.png`,
    title: 'Modern Warehouse Design &amp; LEED Certified Construction | Pislinfra',
    caption: 'Premier warehouse construction company in India. High-bay PEB buildings, FM2 floor specifications, and LEED gold green warehousing.'
  }
];

const ABOUT_PAGES_META = [
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
    title: 'Awards, Accolades &amp; US LEED Gold Certifications | Pislinfra',
    caption: 'Prestigious industry honors, safety excellence recognitions by Adani and Fortune 500 clients.'
  }
];

function generateSitemapsAndFeeds() {
  console.log('🚀 Generating Full Dynamic Google SEO Sitemaps & RSS Feeds with Google Images, Clients & PDFs...');

  const publishedBlogs = Array.isArray(BlogDB) 
    ? BlogDB.filter(b => b.slug && b.status !== 'draft')
    : [];

  const allProjectsList = [
    ...projectsData.map(p => ({ ...p, projectType: 'ongoing' })),
    ...completedProjects.map(p => ({ ...p, projectType: 'completed' }))
  ];

  // ==========================================
  // 1. GENERATE MAIN SITEMAP (sitemap.xml)
  // ==========================================
  let mainXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Core Home Page -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${SITE_URL}/logo.png</image:loc>
      <image:title>Pislinfra - Industrial &amp; Infrastructure Construction</image:title>
      <image:caption>Leading Turnkey Industrial Construction and PEB Engineering in India</image:caption>
      <image:geo_location>India</image:geo_location>
      <image:license>${SITE_URL}/privacy-policy</image:license>
    </image:image>
  </url>

  <!-- ==================== ABOUT US SECTION ==================== -->
`;

  ABOUT_PAGES_META.forEach(ab => {
    mainXml += `  <url>
    <loc>${ab.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${ab.changefreq}</changefreq>
    <priority>${ab.priority}</priority>
    <image:image>
      <image:loc>${ab.image}</image:loc>
      <image:title>${ab.title}</image:title>
      <image:caption>${ab.caption}</image:caption>
      <image:geo_location>India</image:geo_location>
      <image:license>${SITE_URL}/privacy-policy</image:license>
    </image:image>
  </url>\n`;
  });

  mainXml += `
  <!-- Projects Section Index -->
  <url>
    <loc>${SITE_URL}/projects</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>${SITE_URL}/projects/completed</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/hero/Completed-Projects.png</image:loc>
      <image:title>Completed Projects Portfolio - Pislinfra</image:title>
      <image:caption>Over 16 Million sq ft delivered across industrial, warehousing and EPC projects in India.</image:caption>
      <image:geo_location>India</image:geo_location>
    </image:image>
  </url>
  <url>
    <loc>${SITE_URL}/projects/ongoing</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/hero/Ongoing-Projects.png</image:loc>
      <image:title>Ongoing Industrial Construction Sites - Pislinfra</image:title>
      <image:caption>Current state-of-the-art manufacturing plants and logistics hubs under development.</image:caption>
      <image:geo_location>India</image:geo_location>
    </image:image>
  </url>
  <url>
    <loc>${SITE_URL}/projects/case-study</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>

  <!-- ==================== SOLUTIONS PAGES (INDIVIDUAL RANKING) ==================== -->
`;

  SOLUTION_PAGES_META.forEach(sol => {
    mainXml += `  <url>
    <loc>${sol.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${sol.changefreq}</changefreq>
    <priority>${sol.priority}</priority>
    <image:image>
      <image:loc>${sol.image}</image:loc>
      <image:title>${sol.title}</image:title>
      <image:caption>${sol.caption}</image:caption>
      <image:geo_location>India</image:geo_location>
      <image:license>${SITE_URL}/privacy-policy</image:license>
    </image:image>
  </url>\n`;
  });

  mainXml += `
  <!-- Knowledge, Coverage, Annual Reports & Contact -->
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>${SITE_URL}/coverage</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/annual-reports</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${SITE_URL}/contact-us</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/hero/Contact-Us.png</image:loc>
      <image:title>Contact Pislinfra Headquarters</image:title>
      <image:caption>Get in touch for industrial construction, warehousing and EPC projects across India.</image:caption>
      <image:geo_location>Gurugram, Haryana, India</image:geo_location>
    </image:image>
  </url>
  <url>
    <loc>${SITE_URL}/careers</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/hero/Careers.png</image:loc>
      <image:title>Careers at Pislinfra</image:title>
      <image:caption>Join India&#039;s premier industrial construction and engineering team.</image:caption>
      <image:geo_location>India</image:geo_location>
    </image:image>
  </url>
  <url>
    <loc>${SITE_URL}/sitemap</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/privacy-policy</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
`;

  // ==========================================
  // 2. CASE STUDIES IN SITEMAP (sitemap-case-studies.xml)
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
  </url>
`;

  mainXml += `\n  <!-- ==================== CASE STUDIES ==================== -->\n`;
  caseStudiesList.forEach(cs => {
    const slug = cs.slug;
    const title = escapeXml(cs.seoTitle);
    const caption = escapeXml(cs.seoDescription);
    const loc = `${SITE_URL}/projects/case-study/${slug}`;
    const fullImg = `${SITE_URL}${cs.image}`;

    const csEntry = `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${fullImg}</image:loc>
      <image:title>${title}</image:title>
      <image:caption>${caption}</image:caption>
      <image:geo_location>${escapeXml(cs.location)}, India</image:geo_location>
      <image:license>${SITE_URL}/privacy-policy</image:license>
    </image:image>
  </url>\n`;

    mainXml += csEntry;
    caseStudiesXml += csEntry;
  });

  caseStudiesXml += `</urlset>\n`;

  // ==========================================
  // 3. GENERATE DEDICATED ABOUT SITEMAP (sitemap-about.xml)
  // ==========================================
  let aboutXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  ABOUT_PAGES_META.forEach(ab => {
    aboutXml += `  <url>
    <loc>${ab.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${ab.changefreq}</changefreq>
    <priority>${ab.priority}</priority>
    <image:image>
      <image:loc>${ab.image}</image:loc>
      <image:title>${ab.title}</image:title>
      <image:caption>${ab.caption}</image:caption>
      <image:geo_location>India</image:geo_location>
      <image:license>${SITE_URL}/privacy-policy</image:license>
    </image:image>
  </url>\n`;
  });

  aboutXml += `</urlset>\n`;

  // ==========================================
  // 4. GENERATE DEDICATED SOLUTIONS SITEMAP (sitemap-solutions.xml)
  // ==========================================
  let solutionsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  SOLUTION_PAGES_META.forEach(sol => {
    solutionsXml += `  <url>
    <loc>${sol.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${sol.changefreq}</changefreq>
    <priority>${sol.priority}</priority>
    <image:image>
      <image:loc>${sol.image}</image:loc>
      <image:title>${sol.title}</image:title>
      <image:caption>${sol.caption}</image:caption>
      <image:geo_location>India</image:geo_location>
      <image:license>${SITE_URL}/privacy-policy</image:license>
    </image:image>
  </url>\n`;
  });

  solutionsXml += `</urlset>\n`;

  // ==========================================
  // 5. GENERATE DEDICATED PROJECTS SITEMAP (sitemap-projects.xml)
  // ==========================================
  let projectsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <url>
    <loc>${SITE_URL}/projects</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
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
      <image:geo_location>India</image:geo_location>
    </image:image>
  </url>
  <url>
    <loc>${SITE_URL}/projects/ongoing</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/hero/Ongoing-Projects.png</image:loc>
      <image:title>Ongoing Infrastructure Projects - Pislinfra</image:title>
      <image:caption>Active construction sites and industrial facilities under execution across India.</image:caption>
      <image:geo_location>India</image:geo_location>
    </image:image>
  </url>
`;

  allProjectsList.forEach(proj => {
    const projectType = proj.projectType;
    const projectSlug = slugify(proj.name);
    const loc = `${SITE_URL}/project/${projectType}/${projectSlug}`;
    const cleanTitle = escapeXml(`${proj.name} - ${proj.category} in ${proj.location}, ${proj.state}`);
    const cleanCaption = escapeXml(`${proj.name} for ${proj.client}. Area: ${proj.area}. Status: ${proj.status}. Delivered by Pislinfra.`);

    let projectImagesXml = '';
    if (proj.images && proj.images.length > 0) {
      proj.images.forEach((img, idx) => {
        const fullImg = img.startsWith('http') ? img : `${SITE_URL}${img.startsWith('/') ? '' : '/'}${img}`;
        projectImagesXml += `    <image:image>
      <image:loc>${fullImg}</image:loc>
      <image:title>${cleanTitle} (Photo ${idx + 1})</image:title>
      <image:caption>${cleanCaption}</image:caption>
      <image:geo_location>${escapeXml(proj.location)}, ${escapeXml(proj.state)}, India</image:geo_location>
      <image:license>${SITE_URL}/privacy-policy</image:license>
    </image:image>\n`;
      });
    }

    const projectEntry = `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
${projectImagesXml}  </url>\n`;

    mainXml += projectEntry;
    projectsXml += projectEntry;
  });

  projectsXml += `</urlset>\n`;

  // ==========================================
  // 6. GENERATE DEDICATED CLIENTS SITEMAP (sitemap-clients.xml)
  // ==========================================
  let clientsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Clients Showcase on Homepage -->
  <url>
    <loc>${SITE_URL}/#clients</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
`;

  clientsList.forEach(cl => {
    const rawLogo = cl.logoPath;
    const logoUrl = `${SITE_URL}${rawLogo}`;
    const clientTitle = escapeXml(`${cl.name} - Official Industrial Client of Pislinfra`);
    const clientCaption = escapeXml(`Pislinfra delivered turnkey warehousing, PEB manufacturing plants and civil infrastructure for ${cl.name} in India.`);

    clientsXml += `    <image:image>
      <image:loc>${logoUrl}</image:loc>
      <image:title>${clientTitle}</image:title>
      <image:caption>${clientCaption}</image:caption>
      <image:geo_location>India</image:geo_location>
      <image:license>${SITE_URL}/privacy-policy</image:license>
    </image:image>\n`;
  });

  clientsXml += `  </url>\n</urlset>\n`;

  // ==========================================
  // 7. GENERATE PDF DOCUMENTS SITEMAP (sitemap-documents.xml)
  // ==========================================
  let docsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  PDF_DOCUMENTS.forEach(doc => {
    const docLoc = `${SITE_URL}${doc.path}`;
    const docEntry = `  <url>
    <loc>${docLoc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>\n`;

    mainXml += docEntry;
    docsXml += docEntry;
  });

  // ==========================================
  // 8. GENERATE DEDICATED CAREERS SITEMAP (sitemap-careers.xml)
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
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/hero/Careers.png</image:loc>
      <image:title>Careers at Pislinfra - 27+ Current Engineering &amp; Construction Job Openings</image:title>
      <image:caption>Join Pislinfra engineering, project management, and construction leadership teams across India.</image:caption>
      <image:geo_location>Gurugram, Haryana, India</image:geo_location>
      <image:license>${SITE_URL}/privacy-policy</image:license>
    </image:image>
  </url>
`;

  // ==========================================
  // 9. GENERATE DEDICATED BLOG SITEMAP (sitemap-blogs.xml)
  // ==========================================
  let blogXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  if (publishedBlogs.length > 0) {
    mainXml += `\n  <!-- ==================== INDIVIDUAL BLOG POSTS ==================== -->\n`;
    
    publishedBlogs.forEach(blog => {
      const slug = blog.slug;
      const title = blog.title || '';
      const excerpt = (blog.excerpt || blog.seoDescription || title).replace(/[\n\r]+/g, ' ').trim();
      const publishDate = blog.publishDate || TODAY;
      const rawImg = blog.featuredImage || blog.image || '/images/hero/Blog.png';
      const imgUrl = (typeof rawImg === 'string' && rawImg.startsWith('http')) ? rawImg : `${SITE_URL}${typeof rawImg === 'string' && rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
      
      const cleanTitle = escapeXml(title);
      const cleanExcerpt = escapeXml(excerpt.substring(0, 160));

      const blogEntry = `  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${publishDate.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${cleanTitle}</image:title>
      <image:caption>${cleanExcerpt}</image:caption>
      <image:geo_location>India</image:geo_location>
      <image:license>${SITE_URL}/privacy-policy</image:license>
    </image:image>
  </url>\n`;

      mainXml += blogEntry;
      blogXml += blogEntry;
    });
  }

  mainXml += `</urlset>\n`;
  blogXml += `</urlset>\n`;

  // ==========================================
  // 9. GENERATE RSS 2.0 FEED (rss.xml / feed.xml)
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

  careersXml += `</urlset>\n`;

  // Save all files in public directory
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  const aboutSitemapPath = path.join(publicDir, 'sitemap-about.xml');
  const solutionsSitemapPath = path.join(publicDir, 'sitemap-solutions.xml');
  const projectsSitemapPath = path.join(publicDir, 'sitemap-projects.xml');
  const caseStudiesSitemapPath = path.join(publicDir, 'sitemap-case-studies.xml');
  const clientsSitemapPath = path.join(publicDir, 'sitemap-clients.xml');
  const docsSitemapPath = path.join(publicDir, 'sitemap-documents.xml');
  const careersSitemapPath = path.join(publicDir, 'sitemap-careers.xml');
  const blogSitemapPath = path.join(publicDir, 'sitemap-blogs.xml');
  const rssPath = path.join(publicDir, 'rss.xml');
  const feedPath = path.join(publicDir, 'feed.xml');
  const indexNowKeyPath = path.join(publicDir, `${INDEXNOW_KEY}.txt`);
  const indexNowTextPath = path.join(publicDir, 'indexnow-key.txt');

  fs.writeFileSync(sitemapPath, mainXml, 'utf-8');
  fs.writeFileSync(aboutSitemapPath, aboutXml, 'utf-8');
  fs.writeFileSync(solutionsSitemapPath, solutionsXml, 'utf-8');
  fs.writeFileSync(projectsSitemapPath, projectsXml, 'utf-8');
  fs.writeFileSync(caseStudiesSitemapPath, caseStudiesXml, 'utf-8');
  fs.writeFileSync(clientsSitemapPath, clientsXml, 'utf-8');
  fs.writeFileSync(docsSitemapPath, docsXml, 'utf-8');
  fs.writeFileSync(careersSitemapPath, careersXml, 'utf-8');
  fs.writeFileSync(blogSitemapPath, blogXml, 'utf-8');
  fs.writeFileSync(rssPath, rssXml, 'utf-8');
  fs.writeFileSync(feedPath, rssXml, 'utf-8');
  fs.writeFileSync(indexNowKeyPath, INDEXNOW_KEY, 'utf-8');
  fs.writeFileSync(indexNowTextPath, INDEXNOW_KEY, 'utf-8');

  // Also write directly to dist if present
  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), mainXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-about.xml'), aboutXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-solutions.xml'), solutionsXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-projects.xml'), projectsXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-case-studies.xml'), caseStudiesXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-clients.xml'), clientsXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-documents.xml'), docsXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-careers.xml'), careersXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'sitemap-blogs.xml'), blogXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'feed.xml'), rssXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY, 'utf-8');
  }

  console.log(`✅ sitemap.xml generated with all pages, blogs, solutions, projects, case studies, clients & PDF documents`);
  console.log(`✅ sitemap-careers.xml generated (27 active job openings)`);
  console.log(`✅ sitemap-clients.xml generated (${clientsList.length} client partner logos)`);
  console.log(`✅ sitemap-documents.xml generated (${PDF_DOCUMENTS.length} downloadable corporate PDFs)`);
  console.log(`✅ sitemap-case-studies.xml generated (${caseStudiesList.length} landmark case studies)`);
  console.log(`✅ sitemap-about.xml generated`);
  console.log(`✅ sitemap-solutions.xml generated`);
  console.log(`✅ sitemap-projects.xml generated`);
  console.log(`✅ sitemap-blogs.xml generated`);
  console.log(`✅ rss.xml & feed.xml RSS feeds generated`);
  console.log(`✅ IndexNow verification key created`);
}

generateSitemapsAndFeeds();
