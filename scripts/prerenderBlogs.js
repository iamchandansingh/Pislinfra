import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import BlogDB from '../src/data/Blogdb.js';
import projectsData from '../src/data/projectsData.js';
import completedProjects from '../src/data/completedProjects.js';
import jobOpeningsData from '../src/data/careersJobsData.js';

const SITE_URL = 'https://pislinfra.com';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const slugify = (str) => (str || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const getProjectSlug = (project) => {
  if (!project) return '';
  const pName = project.name || project.projectName || project.project_name || project.title || '';
  const base = pName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const pLoc = project.location || project.city || project.state || '';
  if (base === 'pmg-logistics-park' && pLoc) {
    const locLower = pLoc.toLowerCase();
    if (locLower.includes('neemrana')) return `${base}-neemrana`;
    if (locLower.includes('hyderabad')) return `${base}-hyderabad`;
    if (locLower.includes('kolathur') || locLower.includes('bangalore') || locLower.includes('bengaluru')) return `${base}-kolathur-bangalore`;
    const loc = locLower.replace(/[,/]/g, ' ').trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `${base}-${loc}`;
  }
  return base || project.id || '';
};

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
    developer: 'Sunsat Warehousing Pvt. Ltd.',
    location: 'Sampka, Delhi NCR',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'Flipkart Sampka - Sunsat Warehousing Case Study | Pislinfra',
    seoDescription: 'Pislinfra completed 0.84 Million Sq. Ft Flipkart FCMH facility in 9 months with 104 dock doors and Asia\'s longest underground fire corridor.',
    seoKeywords: 'Flipkart Sampka, Sunsat Warehousing, Flipkart FCMH, Delhi NCR warehouse, largest Flipkart facility, industrial case study, Pislinfra'
  },
  {
    slug: 'pragati-farukhnagar-logistics',
    title: 'Pragati Farukhnagar Logistics Park Phase I (Flipkart)',
    developer: 'Morgan Stanley',
    location: 'Farrukhnagar, Haryana',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'Pragati Farukhnagar Logistics Park Case Study | Pislinfra',
    seoDescription: '10 Lakh sq. ft Grade-A warehouse delivered for Flipkart & Morgan Stanley with high-speed execution.',
    seoKeywords: 'Pragati Farukhnagar, Morgan Stanley warehouse, Flipkart logistics park, industrial construction, Pislinfra'
  },
  {
    slug: 'ludhiana-logistics-park',
    title: 'Ludhiana Logistics Park',
    developer: 'Ludhiana Logistics',
    location: 'Ludhiana, Punjab',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'Ludhiana Logistics Park Case Study | Pislinfra',
    seoDescription: 'High-bay industrial warehousing and distribution park engineered in Ludhiana, Punjab.',
    seoKeywords: 'Ludhiana logistics park, Punjab warehouse construction, high-bay PEB, Pislinfra'
  },
  {
    slug: 'bluestar-realtors-palwal',
    title: 'Bluestar Realtors Palwal (Ecom Express)',
    developer: 'Bluestar Realtors Ltd',
    location: 'Palwal, NCR',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'Bluestar Realtors Palwal Case Study | Pislinfra',
    seoDescription: 'Turnkey distribution facility built for Ecom Express in Palwal with advanced sorting layouts.',
    seoKeywords: 'Bluestar Realtors, Palwal warehouse, Ecom Express logistics center, industrial builder NCR, Pislinfra'
  },
  {
    slug: 'ncr-bigbox-patli',
    title: 'NCR Bigbox Patli (Welspun)',
    developer: 'Welspun One',
    location: 'Patli, NCR',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'NCR Bigbox Patli Case Study | Pislinfra',
    seoDescription: 'Grade-A industrial logistics park delivered with FM2 flooring and heavy-load capacity.',
    seoKeywords: 'NCR Bigbox Patli, Welspun One logistics park, Grade A warehouse NCR, Pislinfra'
  },
  {
    slug: 'avitech-nutrition-farukhnagar',
    title: 'Avitech Nutrition Farukhnagar',
    developer: 'Avitech Nutrition',
    location: 'Farrukhnagar, Haryana',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'Avitech Nutrition Farukhnagar Plant Case Study | Pislinfra',
    seoDescription: 'State-of-the-art animal nutrition manufacturing facility engineered and constructed by Pislinfra.',
    seoKeywords: 'Avitech Nutrition, Farrukhnagar manufacturing plant, industrial factory civil work, Pislinfra'
  },
  {
    slug: 'om-sukh-logistics-park-pataudi',
    title: 'Om Sukh Logistics Park Pataudi',
    developer: 'Om Sukh Developers',
    location: 'Pataudi, NCR',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'Om Sukh Logistics Park Pataudi Case Study | Pislinfra',
    seoDescription: 'Multi-user Grade-A warehousing park developed in Pataudi with modern utility networks.',
    seoKeywords: 'Om Sukh Logistics Park, Pataudi warehouse development, logistics construction, Pislinfra'
  },
  {
    slug: 'gmr-coimbatore-logistics-park',
    title: 'GMR Coimbatore Logistics Park',
    developer: 'GMR Group',
    location: 'Coimbatore, Tamil Nadu',
    image: '/images/hero/Completed-Projects.png',
    seoTitle: 'GMR Coimbatore Logistics Park Case Study | Pislinfra',
    seoDescription: 'Strategic logistics park constructed for GMR in Coimbatore, Tamil Nadu.',
    seoKeywords: 'GMR logistics park, Coimbatore warehouse construction, Tamil Nadu industrial infrastructure, Pislinfra'
  }
];

const SOLUTION_PAGES = [
  {
    slug: 'solutions',
    pathSuffix: 'solutions',
    breadcrumbName: 'Solutions',
    title: 'Construction & Infrastructure Solutions | Pislinfra',
    headline: 'Construction & Infrastructure Solutions',
    description: "Explore Pislinfra's comprehensive construction and infrastructure solutions, combining technical expertise, quality execution and innovative approaches.",
    keywords: 'Construction & Infrastructure Solutions, turnkey industrial EPC, warehouse construction, infrastructure solutions India, industrial construction solutions',
    image: '/images/hero/Service.png',
    serviceType: 'Industrial Infrastructure & EPC Solutions',
    features: [
      'Architectural Design & Engineering',
      'Turnkey Industrial EPC Construction',
      'Modern High-Bay Warehousing',
      'Grade-A Logistics Parks Development'
    ]
  },
  {
    slug: 'solutions/industrial',
    pathSuffix: 'solutions/industrial',
    breadcrumbName: 'Industrial Development',
    title: 'Industrial Development Company In India | Pislinfra',
    headline: 'Industrial Development Company In India',
    description: "Discover Pislinfra's industrial construction solutions, delivering reliable, efficient and quality-driven infrastructure for diverse industrial requirements across India.",
    keywords: 'Industrial Development, industrial construction, turnkey EPC contractor India, factory building construction, heavy steel PEB fabrication, manufacturing infrastructure, Pislinfra',
    image: '/images/hero/Industrial.png',
    serviceType: 'Industrial Manufacturing & Factory Construction',
    features: [
      'Heavy Structural Steel & PEB Fabrication',
      'Turnkey EPC Engineering & Commissioning',
      'Factory Civil & Utility Integration',
      'International Safety & ISO Protocols'
    ]
  },
  {
    slug: 'solutions/infrastructure',
    pathSuffix: 'solutions/infrastructure',
    breadcrumbName: 'Infrastructure Development',
    title: 'Infrastructure Development Company | Pislinfra',
    headline: 'Infrastructure Development Company',
    description: 'Explore Pislinfra’s infrastructure construction solutions, combining engineering expertise, quality execution and reliable project delivery for complex developments.',
    keywords: 'Infrastructure Development, infrastructure construction solutions, civil infrastructure, engineering expertise, complex developments India, Pislinfra',
    image: '/images/hero/Infrastructure.png',
    serviceType: 'Heavy Civil & Utility Infrastructure',
    features: [
      'High-Capacity Industrial Road Networks',
      'Integrated Water & Drainage Utility Grids',
      'Large Scale Site Development & Grading',
      'Bridge & Transportation Engineering'
    ]
  },
  {
    slug: 'solutions/logistic',
    pathSuffix: 'solutions/logistic',
    breadcrumbName: 'Logistics Parks',
    title: 'Logistics Park Development Company in India | Pislinfra',
    headline: 'Logistics Park Development Company in India',
    description: "Pislinfra's develops Grade-A logistics parks across India with integrated design, procurement and construction solutions for modern supply chains.",
    keywords: 'Logistics Park Development, Grade-A logistics parks, warehousing and logistics solutions, supply chain infrastructure India, Pislinfra',
    image: '/images/hero/Logistic.png',
    serviceType: 'Logistics Parks & Distribution Hubs Construction',
    features: [
      'Strategic Transport Corridor Connectivity',
      'High-Throughput Cross-Docking Facilities',
      'Multi-Modal Freight Terminals',
      'Heavy-Load Concrete Pavements'
    ]
  },
  {
    slug: 'solutions/warehouse',
    pathSuffix: 'solutions/warehouse',
    breadcrumbName: 'Warehousing Solutions',
    title: 'Warehouse Construction Company in India | Pislinfra',
    headline: 'Warehouse Construction Company in India',
    description: "Pislinfra's delivers design-build warehouse construction solutions across India, creating efficient, scalable and future-ready facilities for businesses.",
    keywords: 'Warehouse Construction Company, design-build warehouse construction, warehouse solutions India, future-ready facilities, Pislinfra',
    image: '/images/hero/Warehouse.png',
    serviceType: 'High-Bay Warehousing & Storage Facilities',
    features: [
      'FM2 Superflat Floor Specifications',
      'LEED Gold Certified Sustainable Engineering',
      'Advanced Thermal & Climate Control Systems',
      'High-Bay Pre-Engineered Steel Structures'
    ]
  }
];

const ABOUT_PAGES = [
  {
    slug: 'about',
    pathSuffix: 'about',
    breadcrumbName: 'Overview',
    title: 'About Pislinfra - India\'s Premier Industrial & Warehouse EPC Contractor',
    headline: 'Pragati Infra Solutions (Pislinfra) - Building India\'s Industrial Backbone',
    description: 'Pragati Infra Solutions Pvt. Ltd. (Pislinfra) is a leading industrial infrastructure and EPC company with 16M+ sq. ft delivered across India. Specializing in warehouses, logistics parks, and PEB engineering.',
    keywords: 'about Pislinfra, industrial construction company India, Pragati Infra Solutions, turnkey EPC contractor, warehouse builder India, industrial infrastructure profile',
    image: '/images/hero/11.png',
    sectionName: 'Company Overview & Infrastructure Legacy',
    highlights: [
      '16+ Million Sq. Ft. Delivered Across India',
      'Pan-India Execution in 12+ States',
      'US LEED Gold Certified Warehouse Builder',
      'End-to-End Turnkey EPC & Civil Engineering'
    ]
  },
  {
    slug: 'about/leadership',
    pathSuffix: 'about/leadership',
    breadcrumbName: 'Leadership',
    title: 'Leadership & Board of Directors - Visionary Infrastructure Leaders | Pislinfra',
    headline: 'Executive Leadership & Visionary Management at Pislinfra',
    description: 'Meet the leadership team and board of directors at Pislinfra steering India\'s fastest-growing industrial EPC, civil engineering, and warehouse construction enterprise.',
    keywords: 'Pislinfra leadership, board of directors, management team, industrial infrastructure leaders India, civil engineering executives, construction MD India',
    image: '/images/hero/leadership.png',
    sectionName: 'Executive Leadership & Governance',
    highlights: [
      'Decades of Industrial EPC Leadership Experience',
      'Strategic Vision for Sustainable Infrastructure',
      'Award-Winning Engineering & Project Governance',
      'Commitment to Zero-Harm Safety & Quality'
    ]
  },
  {
    slug: 'about/ehs',
    pathSuffix: 'about/ehs',
    breadcrumbName: 'EHS Policy',
    title: 'EHS Safety Protocols & Zero-Accident Construction Standards | Pislinfra',
    headline: 'Environment, Health & Safety (EHS) - Zero Harm, Zero Accidents',
    description: 'Pislinfra is committed to world-class Environment, Health & Safety (EHS) standards with over 15+ million safe man-hours, ISO certifications, and zero-LTI safety protocols on construction sites.',
    keywords: 'EHS policy construction, safety standards industrial construction, ISO 45001 contractor India, zero harm safety culture, safe man hours construction, Pislinfra EHS',
    image: '/images/hero/EHS.png',
    sectionName: 'Environment, Health & Safety (EHS)',
    highlights: [
      '15+ Million Safe Man-Hours Achieved',
      'ISO 45001, ISO 14001, ISO 9001 Certified Standards',
      'Rigorous Site-Level Safety Protocols & Hazard Audits',
      'Green Building & Sustainable Construction Practices'
    ]
  },
  {
    slug: 'about/csr',
    pathSuffix: 'about/csr',
    breadcrumbName: 'CSR Initiatives',
    title: 'CSR & Community Empowerment Programs - Sustainable Social Impact | Pislinfra',
    headline: 'Corporate Social Responsibility - Empowering Communities Nationwide',
    description: 'Discover Pislinfra\'s Corporate Social Responsibility (CSR) programs empowering local communities through education, healthcare, skill development, and environmental greening across India.',
    keywords: 'Pislinfra CSR, corporate social responsibility construction, community empowerment India, sustainable development, green initiatives, healthcare and education CSR',
    image: '/images/hero/CSR.png',
    sectionName: 'Corporate Social Responsibility (CSR)',
    highlights: [
      'Community Education & Girl Child Empowerment',
      'Vocational Skill Centers for Construction Youth',
      'Afforestation & Tree Plantation Drives',
      'Free Health Camps & Worker Welfare Programs'
    ]
  },
  {
    slug: 'about/awards',
    pathSuffix: 'about/awards',
    breadcrumbName: 'Awards & Certifications',
    title: 'Awards & Certifications - Safety Milestones & Industry Honors | Pislinfra',
    headline: 'Prestigious Industry Awards, Accolades & US LEED Certifications',
    description: 'Explore Pislinfra prestigious awards, US LEED Gold certification, and zero-LTI safety milestones awarded by Adani, Reliance, and leading industry councils.',
    keywords: 'Pislinfra awards, construction awards India, safety excellence awards, Adani best safety contractor, LEED Gold warehousing, industrial EPC honors, turnkey infrastructure accolades, 2026 infrastructure award',
    image: '/images/hero/Awards-Certification.png',
    sectionName: 'Awards, Accolades & Certifications',
    highlights: [
      'Best Safety Contractor Award - Adani Group',
      'USGBC LEED Gold Certified Warehousing Projects',
      'Times of India Industry Leaders Award',
      'Zero-LTI Milestone Recognitions from Fortune 500 Clients'
    ]
  },
  {
    slug: 'about/company-policy',
    pathSuffix: 'about/company-policy',
    breadcrumbName: 'Company Policy',
    title: 'Company Policy & Corporate Governance | Pislinfra',
    headline: 'Corporate Policies, Ethics & Governance Framework',
    description: 'Explore Pislinfra corporate policies including Risk Management Policy, Vigil Mechanism Policy, and Corporate Social Responsibility (CSR) Policy.',
    keywords: 'Pislinfra policies, company policy, risk management policy, vigil mechanism policy, CSR policy, corporate governance infrastructure India',
    image: 'https://pislinfra.com/images/uploads/optimized_1787756480751_Extra-2.webp',
    sectionName: 'Policies & Corporate Governance',
    highlights: [
      'Risk Management Policy - Comprehensive Business Continuity & Mitigation Framework',
      'Vigil Mechanism Policy - Transparent Ethics, Accountability & Reporting Mechanism',
      'CSR Policy - Sustainable Community Development & Social Empowerment',
      'Statutory & Regulatory Compliance across all Operations'
    ]
  },
  {
    slug: 'about/policies',
    pathSuffix: 'about/policies',
    breadcrumbName: 'Company Policy',
    title: 'Company Policy & Corporate Governance | Pislinfra',
    headline: 'Corporate Policies, Ethics & Governance Framework',
    description: 'Explore Pislinfra corporate policies including Risk Management Policy, Vigil Mechanism Policy, and Corporate Social Responsibility (CSR) Policy.',
    keywords: 'Pislinfra policies, company policy, risk management policy, vigil mechanism policy, CSR policy, corporate governance infrastructure India',
    image: 'https://pislinfra.com/images/uploads/optimized_1787756480751_Extra-2.webp',
    sectionName: 'Policies & Corporate Governance',
    highlights: [
      'Risk Management Policy - Comprehensive Business Continuity & Mitigation Framework',
      'Vigil Mechanism Policy - Transparent Ethics, Accountability & Reporting Mechanism',
      'CSR Policy - Sustainable Community Development & Social Empowerment',
      'Statutory & Regulatory Compliance across all Operations'
    ]
  }
];

const CORPORATE_PAGES = [
  {
    pathSuffix: 'careers',
    title: 'Careers at Pislinfra | Build Your Future With Us',
    headline: 'Careers at Pislinfra',
    description: 'Explore career opportunities at Pislinfra and join a team committed to excellence, innovation, safety and building the future of infrastructure.',
    keywords: 'Careers at Pislinfra, construction jobs India, civil engineering careers, infrastructure job openings, hiring, Pislinfra careers',
    image: '/images/hero/Careers.png',
    canonicalUrl: `${SITE_URL}/careers`
  },
  {
    pathSuffix: 'contact-us',
    title: 'Contact Pislinfra | Enquiries & Business Support',
    headline: 'Contact Pislinfra',
    description: 'Get in touch with Pislinfra for project enquiries, business partnerships and construction solutions. Connect with our team for expert assistance.',
    keywords: 'Contact Pislinfra, project enquiries, business partnerships, construction solutions, infrastructure assistance, Pislinfra office',
    image: '/images/hero/Contact-Us.png',
    canonicalUrl: `${SITE_URL}/contact-us`
  },
  {
    pathSuffix: 'annual-reports',
    title: 'Pislinfra Annual Reports | Company Reports & Updates',
    headline: 'Annual Reports, Financial Disclosures & Corporate Filings',
    description: 'Explore Pislinfra annual reports, company information and key business updates covering multiple financial years.',
    keywords: 'Pislinfra Annual Reports, company reports, annual returns, statutory disclosures, financial year performance, Pislinfra',
    image: '/images/hero/Annual-Reports.png',
    canonicalUrl: `${SITE_URL}/annual-reports`
  },
  {
    pathSuffix: 'coverage',
    title: 'Pan-India Presence & Infrastructure Footprint | Pislinfra',
    headline: 'Delivering Landmark Infrastructure Across 25+ Locations in India',
    description: 'Explore Pislinfra\'s nationwide operational presence with 16M+ sq. ft delivered across 12+ states in India including Gujarat, Haryana, Tamil Nadu, and Punjab.',
    keywords: 'Pislinfra presence, construction locations India, pan India EPC footprint, warehouse builder Haryana Gujarat, industrial projects map',
    image: '/images/hero/Service.png',
    canonicalUrl: `${SITE_URL}/coverage`
  },
  {
    pathSuffix: 'sitemap',
    title: 'HTML Site Index & Complete Navigation | Pislinfra',
    headline: 'Pislinfra Website Sitemap & Navigation Index',
    description: 'Complete navigation index of all industrial solutions, projects, case studies, blogs, about us sections, and corporate information on Pislinfra.',
    keywords: 'Pislinfra sitemap, website index, pages navigation, industrial construction links',
    image: '/logo.png',
    canonicalUrl: `${SITE_URL}/sitemap`
  },
  {
    pathSuffix: 'privacy-policy',
    title: 'Privacy Policy | Pislinfra',
    headline: 'Privacy Policy & Corporate Data Protection',
    description: 'Read Pislinfra’s Privacy Policy to understand how we collect, use, protect and manage personal information when you use our website and services.',
    keywords: 'Privacy Policy, Pislinfra, data protection, personal information, cookies and tracking, privacy terms',
    image: '/images/hero/Extra-2.png',
    canonicalUrl: `${SITE_URL}/privacy-policy`
  }
];

function prerenderAllPages() {
  console.log('⚡ Prerendering static HTML with Google Voice, Images, Solutions, About Us, Case Studies & Corporate SEO...');

  const distDir = path.join(__dirname, '..', 'dist');
  const baseIndexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(baseIndexHtmlPath)) {
    console.log('⚠️ dist/index.html not found. Run "vite build" first before prerendering.');
    return;
  }

  const baseHtml = fs.readFileSync(baseIndexHtmlPath, 'utf-8');

  // ==========================================
  // 1. PRERENDER INDIVIDUAL BLOG POSTS
  // ==========================================
  const publishedBlogs = Array.isArray(BlogDB) 
    ? BlogDB.filter(b => b.slug && b.status !== 'draft')
    : [];

  let blogCount = 0;

  publishedBlogs.forEach(blog => {
    const slug = blog.slug;
    const title = blog.seoTitle || `${blog.title} | Pislinfra`;
    const cleanRawExcerpt = (blog.seoDescription || blog.excerpt || blog.content?.substring(0, 160) || '').replace(/[\n\r]+/g, ' ').trim();
    const description = cleanRawExcerpt.substring(0, 160);
    const keywords = blog.seoKeywords || (Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || 'warehouse construction, industrial infrastructure, pre-engineered buildings');
    const canonicalUrl = `${SITE_URL}/blog/${slug}`;
    const rawImage = blog.featuredImage || blog.image || '/images/hero/Blog.png';
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
    const publishDate = blog.publishDate || '2026-01-01';
    const updatedDate = blog.updatedDate || publishDate;
    const authorName = blog.authorName || blog.author?.name || 'Pragati Infra Solutions Pvt. Ltd.';

    const speakableSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      'url': canonicalUrl,
      'name': blog.title,
      'description': description,
      'speakable': {
        '@type': 'SpeakableSpecification',
        'cssSelector': [
          '#speakable-summary',
          '.speakable-quick-answer',
          '.blog-hero-title',
          '.blog-hero-excerpt',
          '.content-h2',
          '.content-p',
          '.faq-answer'
        ]
      }
    };

    const imageSchema = {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      '@id': `${imageUrl}#primaryimage`,
      'url': imageUrl,
      'contentUrl': imageUrl,
      'thumbnailUrl': imageUrl,
      'width': 1200,
      'height': 630,
      'caption': blog.imageCaption || description,
      'name': blog.imageTitle || blog.title,
      'description': blog.imageAlt || blog.title,
      'representativeOfPage': true,
      'license': `${SITE_URL}/privacy-policy`,
      'creditText': 'Pragati Infra Solutions Pvt. Ltd.',
      'creator': {
        '@type': 'Organization',
        'name': 'Pislinfra'
      }
    };

    const blogPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      'isPartOf': {
        '@type': 'WebSite',
        'name': 'Pislinfra',
        'url': SITE_URL
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      'headline': blog.headline || blog.title,
      'name': blog.title,
      'description': description,
      'image': imageSchema,
      'datePublished': publishDate,
      'dateModified': updatedDate,
      'inLanguage': blog.language || 'en-IN',
      'wordCount': blog.wordCount || (blog.content ? blog.content.split(/\s+/).length : 1200),
      'keywords': keywords,
      'articleSection': blog.articleSection || blog.category || 'Industrial Construction & Infrastructure',
      'author': {
        '@type': 'Organization',
        'name': authorName,
        'url': `${SITE_URL}/about`,
        'logo': `${SITE_URL}/logo.png`
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Pislinfra',
        'url': SITE_URL,
        'logo': {
          '@type': 'ImageObject',
          'url': `${SITE_URL}/logo.png`,
          'width': 512,
          'height': 512
        }
      }
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${SITE_URL}/blog` },
        { '@type': 'ListItem', 'position': 3, 'name': blog.title, 'item': canonicalUrl }
      ]
    };

    const jsonLdSchemas = [speakableSchema, imageSchema, blogPostingSchema, breadcrumbSchema];

    const metaHeadBlock = `
    <!-- Google Voice & Assistant SEO for ${escapeHtml(title)} -->
    <title>${escapeHtml(title)}</title>
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="${escapeHtml(authorName)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />

    <meta name="voice-search-enabled" content="true" />
    <meta name="speakable" content="true" />
    <meta name="google-assistant-ready" content="true" />

    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(blog.ogTitle || title)}" />
    <meta property="og:description" content="${escapeHtml(blog.ogDescription || description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(blog.imageAlt || blog.title)}" />
    <meta property="og:site_name" content="Pislinfra" />
    <meta property="og:locale" content="en_IN" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Pislinfra" />
    <meta name="twitter:title" content="${escapeHtml(blog.twitterTitle || title)}" />
    <meta name="twitter:description" content="${escapeHtml(blog.twitterDescription || description)}" />
    <meta name="twitter:image" content="${imageUrl}" />

    <script type="application/ld+json">
${JSON.stringify(jsonLdSchemas, null, 2)}
    </script>
`;

    let blogHtml = baseHtml;
    blogHtml = blogHtml.replace(/<title>[\s\S]*?<\/title>/i, '');
    blogHtml = blogHtml.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, '');
    blogHtml = blogHtml.replace(/<meta\s+name=["']keywords["'][\s\S]*?>/i, '');
    blogHtml = blogHtml.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, '');
    blogHtml = blogHtml.replace(/<meta\s+property=["']og:[\s\S]*?>/gi, '');
    blogHtml = blogHtml.replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, '');

    blogHtml = blogHtml.replace('</head>', `${metaHeadBlock}\n</head>`);

    const blogDir = path.join(distDir, 'blog', slug);
    if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
    fs.writeFileSync(path.join(blogDir, 'index.html'), blogHtml, 'utf-8');
    blogCount++;
  });

  console.log(`✅ Prerendered ${blogCount} individual blog static HTML pages!`);

  // ==========================================
  // 2. PRERENDER SEPARATE SOLUTIONS PAGES
  // ==========================================
  let solutionCount = 0;

  SOLUTION_PAGES.forEach(sol => {
    let solTitle = sol.title;
    let solDescription = sol.description;
    let solKeywords = sol.keywords;

    if (sol.slug === 'solutions') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const bData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const solCms = bData['solution-pages-solutions'] || bData['solution-pages?filters[slug]=solutions&populate=*'];
          const target = Array.isArray(solCms) ? solCms[0] : solCms;
          if (target?.metaTitle) solTitle = target.metaTitle;
          if (target?.metaDescription) solDescription = target.metaDescription;
          if (target?.focusKeywords || target?.primaryKeyword) {
            solKeywords = target.focusKeywords || target.primaryKeyword;
          }
        }
      } catch (e) {}
    }

    if (sol.slug === 'solutions/industrial') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const bData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const indCms = bData['solution-pages-industrial'] || bData['solution-pages?filters[slug]=industrial'];
          const target = Array.isArray(indCms) ? indCms[0] : indCms;
          if (target?.metaTitle || target?.seo?.seoTitle) solTitle = target.metaTitle || target.seo.seoTitle;
          if (target?.metaDescription || target?.seo?.seoDescription) solDescription = target.metaDescription || target.seo.seoDescription;
          if (target?.focusKeywords || target?.primaryKeyword || target?.seo?.seoKeywords) {
            solKeywords = target.focusKeywords || target.primaryKeyword || target.seo.seoKeywords;
          }
        }
      } catch (e) {}
    }

    if (sol.slug === 'solutions/infrastructure') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const bData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const infraCms = bData['solution-pages-infrastructure'] || bData['solution-pages?filters[slug]=infrastructure'];
          const target = Array.isArray(infraCms) ? infraCms[0] : infraCms;
          if (target?.metaTitle || target?.seo?.seoTitle) solTitle = target.metaTitle || target.seo.seoTitle;
          if (target?.metaDescription || target?.seo?.seoDescription) solDescription = target.metaDescription || target.seo.seoDescription;
          if (target?.focusKeywords || target?.primaryKeyword || target?.seo?.seoKeywords) {
            solKeywords = target.focusKeywords || target.primaryKeyword || target.seo.seoKeywords;
          }
        }
      } catch (e) {}
    }

    if (sol.slug === 'solutions/logistic') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const bData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const logCms = bData['solution-pages-logistic'] || bData['solution-pages?filters[slug]=logistic'];
          const target = Array.isArray(logCms) ? logCms[0] : logCms;
          if (target?.metaTitle || target?.seo?.seoTitle) solTitle = target.metaTitle || target.seo.seoTitle;
          if (target?.metaDescription || target?.seo?.seoDescription) solDescription = target.metaDescription || target.seo.seoDescription;
          if (target?.focusKeywords || target?.primaryKeyword || target?.seo?.seoKeywords) {
            solKeywords = target.focusKeywords || target.primaryKeyword || target.seo.seoKeywords;
          }
        }
      } catch (e) {}
    }

    if (sol.slug === 'solutions/warehouse') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const bData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const whCms = bData['solution-pages-warehouse'] || bData['solution-pages?filters[slug]=warehouse'];
          const target = Array.isArray(whCms) ? whCms[0] : whCms;
          if (target?.metaTitle || target?.seo?.seoTitle) solTitle = target.metaTitle || target.seo.seoTitle;
          if (target?.metaDescription || target?.seo?.seoDescription) solDescription = target.metaDescription || target.seo.seoDescription;
          if (target?.focusKeywords || target?.primaryKeyword || target?.seo?.seoKeywords) {
            solKeywords = target.focusKeywords || target.primaryKeyword || target.seo.seoKeywords;
          }
        }
      } catch (e) {}
    }

    const canonicalUrl = `${SITE_URL}/${sol.slug}`;
    const rawImage = sol.image;
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      'name': sol.headline,
      'serviceType': sol.serviceType,
      'description': solDescription,
      'provider': {
        '@type': 'Organization',
        'name': 'Pragati Infra Solutions Pvt. Ltd.',
        'alternateName': 'Pislinfra',
        'url': SITE_URL,
        'logo': `${SITE_URL}/logo.png`
      },
      'areaServed': {
        '@type': 'Country',
        'name': 'India'
      }
    };

    const speakableSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      'url': canonicalUrl,
      'name': solTitle,
      'description': solDescription,
      'speakable': {
        '@type': 'SpeakableSpecification',
        'cssSelector': ['#speakable-summary', 'h1', 'h2', 'p']
      }
    };

    const imageSchema = {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      '@id': `${imageUrl}#serviceimage`,
      'url': imageUrl,
      'contentUrl': imageUrl,
      'thumbnailUrl': imageUrl,
      'width': 1200,
      'height': 630,
      'name': sol.headline,
      'caption': solDescription,
      'license': `${SITE_URL}/privacy-policy`,
      'creditText': 'Pragati Infra Solutions Pvt. Ltd.'
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'Solutions', 'item': `${SITE_URL}/solutions` }
      ]
    };

    if (sol.slug !== 'solutions') {
      breadcrumbSchema.itemListElement.push({
        '@type': 'ListItem',
        'position': 3,
        'name': sol.breadcrumbName,
        'item': canonicalUrl
      });
    }

    const jsonLdSchemas = [serviceSchema, speakableSchema, imageSchema, breadcrumbSchema];

    const metaHeadBlock = `
    <!-- Individual Solution Page SEO for ${escapeHtml(solTitle)} -->
    <title>${escapeHtml(solTitle)}</title>
    <meta name="title" content="${escapeHtml(solTitle)}" />
    <meta name="description" content="${escapeHtml(solDescription)}" />
    <meta name="keywords" content="${escapeHtml(solKeywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />

    <meta name="voice-search-enabled" content="true" />
    <meta name="speakable" content="true" />
    <meta name="google-assistant-ready" content="true" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(solTitle)}" />
    <meta property="og:description" content="${escapeHtml(solDescription)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Pislinfra" />
    <meta property="og:locale" content="en_IN" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Pislinfra" />
    <meta name="twitter:title" content="${escapeHtml(solTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(solDescription)}" />
    <meta name="twitter:image" content="${imageUrl}" />

    <script type="application/ld+json">
${JSON.stringify(jsonLdSchemas, null, 2)}
    </script>
`;

    let solHtml = baseHtml;
    solHtml = solHtml.replace(/<title>[\s\S]*?<\/title>/i, '');
    solHtml = solHtml.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, '');
    solHtml = solHtml.replace(/<meta\s+name=["']keywords["'][\s\S]*?>/i, '');
    solHtml = solHtml.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, '');
    solHtml = solHtml.replace(/<meta\s+property=["']og:[\s\S]*?>/gi, '');
    solHtml = solHtml.replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, '');

    solHtml = solHtml.replace('</head>', `${metaHeadBlock}\n</head>`);

    const solDir = path.join(distDir, ...sol.pathSuffix.split('/'));
    if (!fs.existsSync(solDir)) fs.mkdirSync(solDir, { recursive: true });
    fs.writeFileSync(path.join(solDir, 'index.html'), solHtml, 'utf-8');
    solutionCount++;
  });

  console.log(`✅ Prerendered ${solutionCount} individual Solutions static HTML pages!`);

  // ==========================================
  // 3. PRERENDER ALL ABOUT US PAGES
  // ==========================================
  let aboutCount = 0;

  ABOUT_PAGES.forEach(ab => {
    let pageTitle = ab.title;
    let pageDescription = ab.description;
    let pageKeywords = ab.keywords;

    if (ab.slug === 'about') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const aboutDoc = (parsed && (parsed['about-page'] || parsed['about-page?populate=*'])) || {};
          if (aboutDoc.metaTitle) pageTitle = aboutDoc.metaTitle;
          else if (aboutDoc.seo?.seoTitle) pageTitle = aboutDoc.seo.seoTitle;
          if (aboutDoc.metaDescription) pageDescription = aboutDoc.metaDescription;
          else if (aboutDoc.seo?.seoDescription) pageDescription = aboutDoc.seo.seoDescription;
        }
      } catch (e) {}
    }

    if (ab.slug === 'about/leadership') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const leadDoc = (parsed && (parsed['leadership-page'] || parsed['leadership-page?populate=*'])) || {};
          if (leadDoc.metaTitle) pageTitle = leadDoc.metaTitle;
          else if (leadDoc.seo?.seoTitle) pageTitle = leadDoc.seo.seoTitle;
          if (leadDoc.metaDescription) pageDescription = leadDoc.metaDescription;
          else if (leadDoc.seo?.seoDescription) pageDescription = leadDoc.seo.seoDescription;
        }
      } catch (e) {}
    }

    if (ab.slug === 'about/ehs') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const ehsDoc = (parsed && (parsed['ehs-page'] || parsed['ehs-page?populate=*'])) || {};
          if (ehsDoc.metaTitle) pageTitle = ehsDoc.metaTitle;
          else if (ehsDoc.seo?.seoTitle) pageTitle = ehsDoc.seo.seoTitle;
          if (ehsDoc.metaDescription) pageDescription = ehsDoc.metaDescription;
          else if (ehsDoc.seo?.seoDescription) pageDescription = ehsDoc.seo.seoDescription;
        }
      } catch (e) {}
    }

    if (ab.slug === 'about/awards') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const awardsDoc = (parsed && (parsed['awards-page'] || parsed['awards-page?populate=*'])) || {};
          if (awardsDoc.metaTitle) pageTitle = awardsDoc.metaTitle;
          else if (awardsDoc.seo?.seoTitle) pageTitle = awardsDoc.seo.seoTitle;
          if (awardsDoc.metaDescription) pageDescription = awardsDoc.metaDescription;
          else if (awardsDoc.seo?.seoDescription) pageDescription = awardsDoc.seo.seoDescription;
        }
      } catch (e) {}
    }

    const canonicalUrl = `${SITE_URL}/${ab.slug}`;
    const rawImage = ab.image;
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

    const aboutSchema = {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': `${canonicalUrl}#aboutpage`,
      'url': canonicalUrl,
      'name': pageTitle,
      'headline': ab.headline,
      'description': pageDescription,
      'mainEntity': {
        '@type': 'Organization',
        'name': 'Pragati Infra Solutions Pvt. Ltd.',
        'alternateName': 'Pislinfra',
        'url': SITE_URL,
        'logo': `${SITE_URL}/logo.png`,
        'foundingDate': '2010'
      }
    };

    const speakableSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      'url': canonicalUrl,
      'name': ab.title,
      'description': ab.description,
      'speakable': {
        '@type': 'SpeakableSpecification',
        'cssSelector': ['#speakable-summary', 'h1', 'h2', 'p', '.highlight-item']
      }
    };

    const imageSchema = {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      '@id': `${imageUrl}#aboutimage`,
      'url': imageUrl,
      'contentUrl': imageUrl,
      'name': ab.headline,
      'caption': ab.description,
      'representativeOfPage': true,
      'license': `${SITE_URL}/privacy-policy`,
      'creditText': 'Pragati Infra Solutions Pvt. Ltd.'
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'About Us', 'item': `${SITE_URL}/about` }
      ]
    };

    if (ab.slug !== 'about') {
      breadcrumbSchema.itemListElement.push({
        '@type': 'ListItem',
        'position': 3,
        'name': ab.breadcrumbName,
        'item': canonicalUrl
      });
    }

    const jsonLdSchemas = [aboutSchema, speakableSchema, imageSchema, breadcrumbSchema];

    const metaHeadBlock = `
    <!-- Individual About Page SEO for ${escapeHtml(pageTitle)} -->
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="title" content="${escapeHtml(pageTitle)}" />
    <meta name="description" content="${escapeHtml(pageDescription)}" />
    <meta name="keywords" content="${escapeHtml(pageKeywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />

    <meta name="voice-search-enabled" content="true" />
    <meta name="speakable" content="true" />
    <meta name="google-assistant-ready" content="true" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDescription)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Pislinfra" />
    <meta property="og:locale" content="en_IN" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Pislinfra" />
    <meta name="twitter:title" content="${escapeHtml(ab.title)}" />
    <meta name="twitter:description" content="${escapeHtml(ab.description)}" />
    <meta name="twitter:image" content="${imageUrl}" />

    <script type="application/ld+json">
${JSON.stringify(jsonLdSchemas, null, 2)}
    </script>
`;

    let abHtml = baseHtml;
    abHtml = abHtml.replace(/<title>[\s\S]*?<\/title>/i, '');
    abHtml = abHtml.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, '');
    abHtml = abHtml.replace(/<meta\s+name=["']keywords["'][\s\S]*?>/i, '');
    abHtml = abHtml.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, '');
    abHtml = abHtml.replace(/<meta\s+property=["']og:[\s\S]*?>/gi, '');
    abHtml = abHtml.replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, '');

    abHtml = abHtml.replace('</head>', `${metaHeadBlock}\n</head>`);

    const abDir = path.join(distDir, ...ab.pathSuffix.split('/'));
    if (!fs.existsSync(abDir)) fs.mkdirSync(abDir, { recursive: true });
    fs.writeFileSync(path.join(abDir, 'index.html'), abHtml, 'utf-8');
    aboutCount++;
  });

  console.log(`✅ Prerendered ${aboutCount} individual About Us static HTML pages!`);

  // ==========================================
  // 4. PRERENDER ALL CASE STUDIES (dist/projects/case-study/:slug)
  // ==========================================
  let caseStudyCount = 0;

  caseStudiesList.forEach(cs => {
    const slug = cs.slug;
    const canonicalUrl = `${SITE_URL}/projects/case-study/${slug}`;
    const rawImage = cs.image || '/images/hero/Completed-Projects.png';
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
    const title = cs.seoTitle;
    const description = cs.seoDescription;
    const keywords = cs.seoKeywords;

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${canonicalUrl}#casestudy`,
      'headline': cs.title,
      'name': title,
      'description': description,
      'image': imageUrl,
      'author': {
        '@type': 'Organization',
        'name': 'Pislinfra Team',
        'url': SITE_URL
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Pislinfra',
        'url': SITE_URL,
        'logo': `${SITE_URL}/logo.png`
      }
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'Projects', 'item': `${SITE_URL}/projects` },
        { '@type': 'ListItem', 'position': 3, 'name': 'Case Studies', 'item': `${SITE_URL}/projects/case-study` },
        { '@type': 'ListItem', 'position': 4, 'name': cs.title, 'item': canonicalUrl }
      ]
    };

    const metaHeadBlock = `
    <!-- Case Study SEO for ${escapeHtml(cs.title)} -->
    <title>${escapeHtml(title)}</title>
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />

    <meta name="voice-search-enabled" content="true" />
    <meta name="speakable" content="true" />
    <meta name="google-assistant-ready" content="true" />

    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${imageUrl}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Pislinfra" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />

    <script type="application/ld+json">
${JSON.stringify([articleSchema, breadcrumbSchema], null, 2)}
    </script>
`;

    let csHtml = baseHtml;
    csHtml = csHtml.replace(/<title>[\s\S]*?<\/title>/i, '');
    csHtml = csHtml.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, '');
    csHtml = csHtml.replace(/<meta\s+name=["']keywords["'][\s\S]*?>/i, '');
    csHtml = csHtml.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, '');
    csHtml = csHtml.replace(/<meta\s+property=["']og:[\s\S]*?>/gi, '');
    csHtml = csHtml.replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, '');

    csHtml = csHtml.replace('</head>', `${metaHeadBlock}\n</head>`);

    const csDir = path.join(distDir, 'projects', 'case-study', slug);
    if (!fs.existsSync(csDir)) fs.mkdirSync(csDir, { recursive: true });
    fs.writeFileSync(path.join(csDir, 'index.html'), csHtml, 'utf-8');
    caseStudyCount++;
  });

  const csIndexDir = path.join(distDir, 'projects', 'case-study');
  if (!fs.existsSync(csIndexDir)) fs.mkdirSync(csIndexDir, { recursive: true });

  console.log(`✅ Prerendered ${caseStudyCount} individual Case Study static HTML pages!`);

  // ==========================================
  // 5. PRERENDER INDIVIDUAL ONGOING & COMPLETED PROJECTS
  // ==========================================
  let projectCount = 0;

  const allProjectsToPrerender = [
    ...projectsData.map(p => ({ ...p, projectType: 'ongoing' })),
    ...completedProjects.map(p => ({ ...p, projectType: 'completed' }))
  ];

  allProjectsToPrerender.forEach(proj => {
    const projectType = proj.projectType;
    const projectSlug = getProjectSlug(proj);
    const title = `${proj.name} - ${proj.category} Construction in ${proj.location}, ${proj.state} | Pislinfra`;
    const description = `${proj.name} in ${proj.location}, ${proj.state}. Client: ${proj.client}, Area: ${proj.area}, Status: ${proj.status}. Scope of work: ${proj.scope}. Delivered by Pislinfra.`;
    const keywords = `${proj.name}, ${proj.client} construction project, ${proj.category} construction ${proj.location}, industrial warehouse ${proj.state}, Pislinfra projects, turnkey civil engineering`;
    const canonicalUrl = `${SITE_URL}/project/${projectType}/${projectSlug}`;
    const rawImage = (proj.images && proj.images.length > 0) ? proj.images[0] : '/images/hero/Completed-Projects.png';
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

    const structureSchema = {
      '@context': 'https://schema.org',
      '@type': 'CivicStructure',
      '@id': `${canonicalUrl}#structure`,
      'name': proj.name,
      'description': description,
      'image': imageUrl,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': proj.location,
        'addressRegion': proj.state,
        'addressCountry': 'IN'
      },
      'founder': {
        '@type': 'Organization',
        'name': 'Pragati Infra Solutions Pvt. Ltd.',
        'url': SITE_URL
      }
    };

    const speakableSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      'url': canonicalUrl,
      'name': title,
      'description': description,
      'speakable': {
        '@type': 'SpeakableSpecification',
        'cssSelector': [
          '#speakable-summary',
          'h1',
          'h2',
          '.info-card'
        ]
      }
    };

    const imageGallerySchemas = (proj.images || []).map((img, idx) => {
      const imgFull = img.startsWith('http') ? img : `${SITE_URL}${img.startsWith('/') ? '' : '/'}${img}`;
      return {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        'url': imgFull,
        'contentUrl': imgFull,
        'name': `${proj.name} - Photo ${idx + 1}`,
        'caption': `${proj.name} ${proj.category} in ${proj.location}, ${proj.state}`,
        'representativeOfPage': idx === 0,
        'license': `${SITE_URL}/privacy-policy`,
        'creditText': 'Pragati Infra Solutions Pvt. Ltd.'
      };
    });

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': projectType === 'completed' ? 'Completed Projects' : 'Ongoing Projects', 'item': `${SITE_URL}/projects/${projectType}` },
        { '@type': 'ListItem', 'position': 3, 'name': proj.name, 'item': canonicalUrl }
      ]
    };

    const jsonLdSchemas = [structureSchema, speakableSchema, ...imageGallerySchemas, breadcrumbSchema];

    const metaHeadBlock = `
    <!-- Individual Project SEO for ${escapeHtml(proj.name)} -->
    <title>${escapeHtml(title)}</title>
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />

    <meta name="voice-search-enabled" content="true" />
    <meta name="speakable" content="true" />
    <meta name="google-assistant-ready" content="true" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(proj.name)} - ${escapeHtml(proj.category)} (${escapeHtml(proj.status)}) | Pislinfra" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Pislinfra" />
    <meta property="og:locale" content="en_IN" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Pislinfra" />
    <meta name="twitter:title" content="${escapeHtml(proj.name)} | Pislinfra Projects" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />

    <script type="application/ld+json">
${JSON.stringify(jsonLdSchemas, null, 2)}
    </script>
`;

    let projHtml = baseHtml;
    projHtml = projHtml.replace(/<title>[\s\S]*?<\/title>/i, '');
    projHtml = projHtml.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, '');
    projHtml = projHtml.replace(/<meta\s+name=["']keywords["'][\s\S]*?>/i, '');
    projHtml = projHtml.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, '');
    projHtml = projHtml.replace(/<meta\s+property=["']og:[\s\S]*?>/gi, '');
    projHtml = projHtml.replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, '');

    projHtml = projHtml.replace('</head>', `${metaHeadBlock}\n</head>`);

    const slugDir = path.join(distDir, 'project', projectType, projectSlug);
    if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true });
    fs.writeFileSync(path.join(slugDir, 'index.html'), projHtml, 'utf-8');

    if (proj.id) {
      const idDir = path.join(distDir, 'project', projectType, proj.id.toString());
      if (!fs.existsSync(idDir)) fs.mkdirSync(idDir, { recursive: true });
      fs.writeFileSync(path.join(idDir, 'index.html'), projHtml, 'utf-8');
    }

    projectCount++;
  });

  console.log(`✅ Prerendered ${projectCount} individual Ongoing & Completed project static HTML pages!`);

  // ==========================================
  // 6. PRERENDER CORPORATE & LISTING PAGES
  // ==========================================
  const allCorporateListingPages = [
    ...CORPORATE_PAGES,
    {
      pathSuffix: 'blog',
      title: 'Construction & Infrastructure Insights | Pislinfra',
      description: "Explore Pislinfra's latest insights on construction, infrastructure, engineering, project management, industry trends and innovative solutions.",
      keywords: 'Construction & Infrastructure Insights, infrastructure blog, construction insights, warehouse design, industrial development, logistics, project management, Pislinfra',
      canonicalUrl: `${SITE_URL}/blog`,
      image: `${SITE_URL}/images/hero/Blog.png`
    },
    {
      pathSuffix: 'projects/ongoing',
      title: 'Ongoing Projects | Pislinfra– Building India’s Future',
      description: 'Explore Pislinfra\'s ongoing projects across industrial, infrastructure, warehousing and logistics sectors, delivering quality construction solutions across India.',
      keywords: 'Ongoing Construction Projects, industrial infrastructure India, warehousing construction, PEB manufacturing plants',
      canonicalUrl: `${SITE_URL}/projects/ongoing`,
      image: `${SITE_URL}/images/hero/Ongoing-Projects.png`
    },
    {
      pathSuffix: 'projects/completed',
      title: 'Completed Projects & Project Portfolio | Pislinfra',
      description: 'Explore Pislinfra\'s completed projects across industrial, warehousing and infrastructure sectors, showcasing quality, safety and successful project delivery.',
      keywords: 'Completed Construction Projects, completed projects, industrial construction, warehouse projects, logistics park, infrastructure portfolio, delivered projects, Pislinfra',
      canonicalUrl: `${SITE_URL}/projects/completed`,
      image: `${SITE_URL}/images/hero/Completed-Projects.png`
    },
    {
      pathSuffix: 'projects/case-study',
      title: 'Project Case Studies & Insights | Pislinfra',
      description: "Explore Pislinfra's project case studies, highlighting our expertise, execution capabilities, innovative solutions and successful delivery across key sectors.",
      keywords: 'Construction Project Case Studies, industrial EPC case studies, warehouse project insights, infrastructure execution India',
      canonicalUrl: `${SITE_URL}/projects/case-study`,
      image: `${SITE_URL}/images/hero/Case-Study.webp`
    },
    {
      pathSuffix: 'projects',
      title: 'Projects Portfolio - Industrial, Warehousing & Infrastructure | Pislinfra',
      description: 'Explore our complete portfolio of ongoing and completed industrial, warehousing, and infrastructure projects across India.',
      keywords: 'projects portfolio, industrial construction projects, warehouse developments, infrastructure sites, Pislinfra',
      canonicalUrl: `${SITE_URL}/projects`,
      image: `${SITE_URL}/images/hero/Completed-Projects.png`
    }
  ];

  allCorporateListingPages.forEach(pl => {
    let listHtml = baseHtml;
    listHtml = listHtml.replace(/<title>[\s\S]*?<\/title>/i, '');
    listHtml = listHtml.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, '');
    listHtml = listHtml.replace(/<meta\s+name=["']keywords["'][\s\S]*?>/i, '');
    listHtml = listHtml.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, '');
    listHtml = listHtml.replace(/<meta\s+property=["'](og|twitter):[\s\S]*?>/gi, '');
    listHtml = listHtml.replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, '');

    let pageTitle = pl.title;
    let pageDescription = pl.description;
    let pageKeywords = pl.keywords;

    if (pl.pathSuffix === 'careers') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const careerDoc = (parsed && (parsed['career-page'] || parsed['career-page?populate=*'])) || {};
          if (careerDoc.metaTitle) pageTitle = careerDoc.metaTitle;
          else if (careerDoc.seo?.seoTitle) pageTitle = careerDoc.seo.seoTitle;
          if (careerDoc.metaDescription) pageDescription = careerDoc.metaDescription;
          else if (careerDoc.seo?.seoDescription) pageDescription = careerDoc.seo.seoDescription;
          if (careerDoc.focusKeywords) pageKeywords = careerDoc.focusKeywords;
          else if (careerDoc.primaryKeyword) pageKeywords = careerDoc.primaryKeyword;
        }
      } catch (e) {}
    }

    if (pl.pathSuffix === 'contact-us') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const contactDoc = (parsed && (parsed['contact-page'] || parsed['contact-page?populate=*'])) || {};
          if (contactDoc.metaTitle) pageTitle = contactDoc.metaTitle;
          else if (contactDoc.seo?.seoTitle) pageTitle = contactDoc.seo.seoTitle;
          if (contactDoc.metaDescription) pageDescription = contactDoc.metaDescription;
          else if (contactDoc.seo?.seoDescription) pageDescription = contactDoc.seo.seoDescription;
          if (contactDoc.focusKeywords) pageKeywords = contactDoc.focusKeywords;
          else if (contactDoc.primaryKeyword) pageKeywords = contactDoc.primaryKeyword;
        }
      } catch (e) {}
    }

    if (pl.pathSuffix === 'annual-reports') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const reportDoc = (parsed && (parsed['annual-report-page'] || parsed['annual-report-page?populate=*'])) || {};
          if (reportDoc.metaTitle) pageTitle = reportDoc.metaTitle;
          else if (reportDoc.seo?.seoTitle) pageTitle = reportDoc.seo.seoTitle;
          if (reportDoc.metaDescription) pageDescription = reportDoc.metaDescription;
          else if (reportDoc.seo?.seoDescription) pageDescription = reportDoc.seo.seoDescription;
          if (reportDoc.focusKeywords) pageKeywords = reportDoc.focusKeywords;
          else if (reportDoc.primaryKeyword) pageKeywords = reportDoc.primaryKeyword;
        }
      } catch (e) {}
    }

    if (pl.pathSuffix === 'privacy-policy') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const policyDoc = (parsed && (parsed['policy-page'] || parsed['policy-page?populate=*'])) || {};
          if (policyDoc.metaTitle) pageTitle = policyDoc.metaTitle;
          else if (policyDoc.seo?.seoTitle) pageTitle = policyDoc.seo.seoTitle;
          if (policyDoc.metaDescription) pageDescription = policyDoc.metaDescription;
          else if (policyDoc.seo?.seoDescription) pageDescription = policyDoc.seo.seoDescription;
          if (policyDoc.focusKeywords) pageKeywords = policyDoc.focusKeywords;
          else if (policyDoc.primaryKeyword) pageKeywords = policyDoc.primaryKeyword;
        }
      } catch (e) {}
    }

    if (pl.pathSuffix === 'blog') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const blogDoc = (parsed && (parsed['blog-page'] || parsed['blog-page?populate=*'])) || {};
          if (blogDoc.metaTitle) pageTitle = blogDoc.metaTitle;
          else if (blogDoc.seo?.seoTitle) pageTitle = blogDoc.seo.seoTitle;
          if (blogDoc.metaDescription) pageDescription = blogDoc.metaDescription;
          else if (blogDoc.seo?.seoDescription) pageDescription = blogDoc.seo.seoDescription;
          if (blogDoc.focusKeywords) pageKeywords = blogDoc.focusKeywords;
          else if (blogDoc.primaryKeyword) pageKeywords = blogDoc.primaryKeyword;
        }
      } catch (e) {}
    }

    if (pl.pathSuffix === 'projects/ongoing') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const ongoingDoc = (parsed && (parsed['ongoing-page'] || parsed['ongoing-page?populate=*'])) || {};
          if (ongoingDoc.metaTitle) pageTitle = ongoingDoc.metaTitle;
          else if (ongoingDoc.seo?.seoTitle) pageTitle = ongoingDoc.seo.seoTitle;
          if (ongoingDoc.metaDescription) pageDescription = ongoingDoc.metaDescription;
          else if (ongoingDoc.seo?.seoDescription) pageDescription = ongoingDoc.seo.seoDescription;
          if (ongoingDoc.focusKeywords) pageKeywords = ongoingDoc.focusKeywords;
          else if (ongoingDoc.primaryKeyword) pageKeywords = ongoingDoc.primaryKeyword;
        }
      } catch (e) {}
    }

    if (pl.pathSuffix === 'projects/completed') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const completedDoc = (parsed && (parsed['completed-page'] || parsed['completed-page?populate=*'])) || {};
          if (completedDoc.metaTitle) pageTitle = completedDoc.metaTitle;
          else if (completedDoc.seo?.seoTitle) pageTitle = completedDoc.seo.seoTitle;
          if (completedDoc.metaDescription) pageDescription = completedDoc.metaDescription;
          else if (completedDoc.seo?.seoDescription) pageDescription = completedDoc.seo.seoDescription;
          if (completedDoc.focusKeywords) pageKeywords = completedDoc.focusKeywords;
          else if (completedDoc.primaryKeyword) pageKeywords = completedDoc.primaryKeyword;
        }
      } catch (e) {}
    }

    if (pl.pathSuffix === 'projects/case-study') {
      try {
        const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
        if (fs.existsSync(backupPath)) {
          const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          const csDoc = (parsed && (parsed['case-study-page'] || parsed['case-study-page?populate=*'])) || {};
          if (csDoc.metaTitle) pageTitle = csDoc.metaTitle;
          else if (csDoc.seo?.seoTitle) pageTitle = csDoc.seo.seoTitle;
          if (csDoc.metaDescription) pageDescription = csDoc.metaDescription;
          else if (csDoc.seo?.seoDescription) pageDescription = csDoc.seo.seoDescription;
          if (csDoc.focusKeywords) pageKeywords = csDoc.focusKeywords;
          else if (csDoc.primaryKeyword) pageKeywords = csDoc.primaryKeyword;
        }
      } catch (e) {}
    }

    let extraSchemasJson = '';
    if (pl.pathSuffix === 'careers') {
      const jobPostingSchemas = [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${SITE_URL}/careers#webpage`,
          'url': `${SITE_URL}/careers`,
          'name': pl.title,
          'description': pl.description,
          'speakable': {
            '@type': 'SpeakableSpecification',
            'cssSelector': [
              '#speakable-summary',
              'h1',
              'h2',
              '.job-card-title',
              '.job-department'
            ]
          }
        },
        ...jobOpeningsData.map(job => ({
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          'title': job.title,
          'description': `${job.title} vacancy at Pragati Infra Solutions Pvt. Ltd. (Pislinfra). Experience required: ${job.experience}. Qualification: ${job.qualification}. Work location: ${job.location}.`,
          'identifier': {
            '@type': 'PropertyValue',
            'name': 'Pislinfra',
            'value': `PISL-JOB-${job.id}`
          },
          'datePosted': '2026-01-01',
          'validThrough': '2026-12-31',
          'employmentType': job.employmentType || 'FULL_TIME',
          'hiringOrganization': {
            '@type': 'Organization',
            'name': 'Pragati Infra Solutions Pvt. Ltd.',
            'sameAs': 'https://pislinfra.com',
            'logo': `${SITE_URL}/logo.png`
          },
          'jobLocation': {
            '@type': 'Place',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': '31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38',
              'addressLocality': 'Gurugram',
              'addressRegion': 'Haryana',
              'postalCode': '122018',
              'addressCountry': 'IN'
            }
          },
          'applicantLocationRequirements': {
            '@type': 'Country',
            'name': 'IN'
          },
          'experienceRequirements': job.experience,
          'qualifications': job.qualification,
          'occupationalCategory': `${job.department} Engineering / Construction`,
          'directApply': true,
          'url': `${SITE_URL}/careers`
        }))
      ];

      extraSchemasJson = `
    <script type="application/ld+json">
${JSON.stringify(jobPostingSchemas, null, 2)}
    </script>
`;
    }

    const headBlock = `
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="title" content="${escapeHtml(pageTitle)}" />
    <meta name="description" content="${escapeHtml(pageDescription)}" />
    <meta name="keywords" content="${escapeHtml(pageKeywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${pl.canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${pl.canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDescription)}" />
    <meta property="og:image" content="${pl.image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDescription)}" />
    <meta name="twitter:image" content="${pl.image}" />
${extraSchemasJson}`;
    listHtml = listHtml.replace('</head>', `${headBlock}\n</head>`);

    const listDir = path.join(distDir, ...pl.pathSuffix.split('/'));
    if (!fs.existsSync(listDir)) fs.mkdirSync(listDir, { recursive: true });
    fs.writeFileSync(path.join(listDir, 'index.html'), listHtml, 'utf-8');
  });

  console.log(`✅ Prerendered All Corporate & Listing static pages with 27 JobPosting schemas!`);

  // ==========================================
  // 7. PRERENDER ROOT HOME PAGE WITH ALL CLIENT SCHEMAS
  // ==========================================
  let homeBackup = {};
  try {
    const backupPath = path.join(__dirname, '../src/data/MainBackupPislinfra.json');
    if (fs.existsSync(backupPath)) {
      const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
      homeBackup = (parsed && (parsed['home-page'] || parsed['home-page?populate=*'])) || {};
    }
  } catch (e) {}

  const homeTitle = homeBackup.metaTitle || homeBackup.seoTitle || 'Pislinfra | Industrial Infrastructure & EPC Company India';
  const homeDescription = homeBackup.metaDescription || homeBackup.seoDescription || 'Pislinfra delivers warehousing, logistics parks, and industrial construction solutions, with 17+ years of experience and 16M+ sq. ft. delivered.';
  const homeKeywords = homeBackup.seoKeywords || 'Pislinfra, industrial infrastructure, construction company, warehousing, logistics park, industrial development, warehouse construction India, turnkey EPC company India, PEB warehouse construction, Grade-A warehouse builder, industrial park developers NCR, civil engineering contractors India, factory shed construction, pre-engineered buildings India, commercial construction company, BTS warehouse developers, logistics park infrastructure, heavy industrial construction, Pragati Infra Solutions, warehouse contractors Delhi NCR Haryana Gujarat, Amazon warehouse builder, Flipkart logistics park, Adani construction partner, Reliance solar unit builder';
  const homeCanonicalUrl = `${SITE_URL}/`;
  const homeLogoUrl = `${SITE_URL}/logo.png`;

  const clientSchemas = clientsList.map(cl => ({
    '@type': 'Organization',
    'name': cl.name,
    'description': `Client partner of Pislinfra for turnkey warehouse & industrial construction.`
  }));

  const homeOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'GeneralContractor'],
    '@id': `${SITE_URL}/#organization`,
    'name': 'Pragati Infra Solutions Pvt. Ltd.',
    'alternateName': ['Pislinfra', 'PISL'],
    'url': SITE_URL,
    'logo': {
      '@type': 'ImageObject',
      'url': homeLogoUrl,
      'width': 512,
      'height': 512
    },
    'description': homeDescription,
    'foundingDate': '2010',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38',
      'addressLocality': 'Gurugram',
      'addressRegion': 'Haryana',
      'postalCode': '122018',
      'addressCountry': 'IN'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+91-8527040411',
      'contactType': 'customer service',
      'areaServed': 'IN',
      'availableLanguage': ['English', 'Hindi']
    },
    'sponsor': clientSchemas,
    'sameAs': [
      'https://www.linkedin.com/company/pislinfra'
    ]
  };

  const homeWebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    'url': SITE_URL,
    'name': 'Pislinfra',
    'publisher': {
      '@id': `${SITE_URL}/#organization`
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const homeSpeakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}/#webpage`,
    'url': homeCanonicalUrl,
    'name': homeTitle,
    'description': homeDescription,
    'speakable': {
      '@type': 'SpeakableSpecification',
      'cssSelector': [
        '#speakable-summary',
        'h1',
        'h2',
        '.home-stat-number',
        '.home-stat-label'
      ]
    }
  };

  const homeJsonLd = [homeOrganizationSchema, homeWebSiteSchema, homeSpeakableSchema];

  const homeMetaHeadBlock = `
    <!-- Home Page Google & Voice Search SEO with Client Schemas -->
    <title>${escapeHtml(homeTitle)}</title>
    <meta name="title" content="${escapeHtml(homeTitle)}" />
    <meta name="description" content="${escapeHtml(homeDescription)}" />
    <meta name="keywords" content="${escapeHtml(homeKeywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${homeCanonicalUrl}" />

    <meta name="voice-search-enabled" content="true" />
    <meta name="speakable" content="true" />
    <meta name="google-assistant-ready" content="true" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${homeCanonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(homeTitle)}" />
    <meta property="og:description" content="${escapeHtml(homeDescription)}" />
    <meta property="og:image" content="${homeLogoUrl}" />
    <meta property="og:image:secure_url" content="${homeLogoUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Pislinfra" />
    <meta property="og:locale" content="en_IN" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Pislinfra" />
    <meta name="twitter:title" content="${escapeHtml(homeTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(homeDescription)}" />
    <meta name="twitter:image" content="${homeLogoUrl}" />

    <script type="application/ld+json">
${JSON.stringify(homeJsonLd, null, 2)}
    </script>
`;

  let homeFinalHtml = baseHtml;
  homeFinalHtml = homeFinalHtml.replace(/<title>[\s\S]*?<\/title>/i, '');
  homeFinalHtml = homeFinalHtml.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, '');
  homeFinalHtml = homeFinalHtml.replace(/<meta\s+name=["']keywords["'][\s\S]*?>/i, '');
  homeFinalHtml = homeFinalHtml.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, '');
  homeFinalHtml = homeFinalHtml.replace(/<meta\s+property=["']og:[\s\S]*?>/gi, '');
  homeFinalHtml = homeFinalHtml.replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, '');

  homeFinalHtml = homeFinalHtml.replace('</head>', `${homeMetaHeadBlock}\n</head>`);
  fs.writeFileSync(baseIndexHtmlPath, homeFinalHtml, 'utf-8');

  console.log(`✅ Prerendered Home Page dist/index.html with full Structured Data, Clients & Speakable Specifications!`);
}

prerenderAllPages();
