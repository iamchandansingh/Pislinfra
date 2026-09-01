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
    title: 'Turnkey Industrial, Warehouse & Infrastructure Solutions | Pislinfra',
    headline: 'Comprehensive Turnkey Industrial & Infrastructure Solutions in India',
    description: 'Explore Pislinfra comprehensive industrial solutions: Turnkey EPC factory construction, Grade-A logistics parks, LEED warehouses, and heavy civil engineering across India.',
    keywords: 'industrial construction solutions, warehouse EPC company India, logistics park construction, PEB design build, civil infrastructure development, Pislinfra',
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
    title: 'Turnkey Industrial Construction & Manufacturing Plants EPC | Pislinfra',
    headline: 'Turnkey Industrial Construction & Manufacturing Facilities EPC',
    description: "PISL is India's leading industrial construction EPC contractor specializing in heavy structural steel, manufacturing factories, PEB engineering, and turnkey plants.",
    keywords: 'industrial construction, turnkey EPC contractor India, factory building construction, heavy steel PEB fabrication, manufacturing infrastructure, industrial development, Pislinfra',
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
    breadcrumbName: 'Infrastructure Solutions',
    title: 'Heavy Civil & Utility Infrastructure Development Solutions | Pislinfra',
    headline: 'Heavy Civil Engineering & Utility Infrastructure Development',
    description: 'Delivering world-class civil infrastructure, highways, industrial road networks, utility grids, and site development for large-scale enterprise projects in India.',
    keywords: 'civil infrastructure development, industrial road networks, utility infrastructure contractor, site grading and leveling, heavy civil engineering India, Pislinfra infrastructure',
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
    title: 'Grade-A Logistics Parks & Distribution Centers Construction | Pislinfra',
    headline: 'Grade-A Logistics Parks & Distribution Hubs Engineering',
    description: 'Specialized engineering and construction of Grade-A logistics parks, supply chain distribution hubs, multi-modal terminals, and high-efficiency freight facilities across India.',
    keywords: 'logistics park construction, Grade-A distribution hubs, supply chain parks India, freight logistics infrastructure, multi-modal park development, Pislinfra',
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
    title: 'Modern Warehouse Design & LEED Certified Construction | Pislinfra',
    headline: 'Modern High-Bay Warehouse Design & LEED Green Construction',
    description: "India's premier warehouse construction company. High-bay pre-engineered steel buildings, FM2 floor specification, LEED gold certified green warehousing, and cold chain facilities.",
    keywords: 'warehouse construction company India, PEB warehouse contractor, FM2 superflat flooring, LEED certified green warehouse, cold storage construction, Pislinfra warehouse',
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
  }
];

const CORPORATE_PAGES = [
  {
    pathSuffix: 'careers',
    title: 'Careers at Pislinfra | Join India\'s Leading Infrastructure & EPC Enterprise',
    headline: 'Build Tomorrow\'s Industrial India With Pislinfra',
    description: 'Explore exciting career opportunities at Pislinfra. Join our civil engineering, project management, PEB design, and construction leadership teams across India.',
    keywords: 'Pislinfra careers, construction jobs India, civil engineer vacancies, PEB designer jobs, project manager infrastructure, EPC careers Gurugram',
    image: '/images/hero/Careers.png',
    canonicalUrl: `${SITE_URL}/careers`
  },
  {
    pathSuffix: 'contact-us',
    title: 'Contact Pislinfra | Industrial Construction & Infrastructure Inquiries',
    headline: 'Get in Touch for Turnkey Industrial & Warehousing Solutions',
    description: 'Contact Pislinfra headquarters in Gurugram, Haryana for turnkey industrial construction, warehouse EPC projects, and infrastructure inquiries across India.',
    keywords: 'contact Pislinfra, infrastructure company contact, warehouse construction quote, industrial EPC contractor Gurugram, PISL phone email',
    image: '/images/hero/Contact-Us.png',
    canonicalUrl: `${SITE_URL}/contact-us`
  },
  {
    pathSuffix: 'annual-reports',
    title: 'Annual Reports & Statutory Filings | Pislinfra Corporate Governance',
    headline: 'Annual Reports, Financial Disclosures & Corporate Filings',
    description: 'Access official Pislinfra annual reports, statutory returns, financial statements, and corporate governance documents for download.',
    keywords: 'Pislinfra annual reports, statutory filings, corporate governance, financial returns, annual reports PDF, Pragati Infra Solutions',
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
    title: 'Privacy Policy & Terms of Use | Pislinfra',
    headline: 'Privacy Policy & Corporate Data Protection',
    description: 'Learn how Pragati Infra Solutions Pvt. Ltd. (Pislinfra) collects, uses, and safeguards information submitted through our official enterprise website.',
    keywords: 'Pislinfra privacy policy, data protection, terms of use, privacy statement',
    image: '/logo.png',
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
    const canonicalUrl = `${SITE_URL}/${sol.slug}`;
    const rawImage = sol.image;
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      'name': sol.headline,
      'serviceType': sol.serviceType,
      'description': sol.description,
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
      'name': sol.title,
      'description': sol.description,
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
      'caption': sol.description,
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
    <!-- Individual Solution Page SEO for ${escapeHtml(sol.title)} -->
    <title>${escapeHtml(sol.title)}</title>
    <meta name="title" content="${escapeHtml(sol.title)}" />
    <meta name="description" content="${escapeHtml(sol.description)}" />
    <meta name="keywords" content="${escapeHtml(sol.keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />

    <meta name="voice-search-enabled" content="true" />
    <meta name="speakable" content="true" />
    <meta name="google-assistant-ready" content="true" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(sol.title)}" />
    <meta property="og:description" content="${escapeHtml(sol.description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Pislinfra" />
    <meta property="og:locale" content="en_IN" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Pislinfra" />
    <meta name="twitter:title" content="${escapeHtml(sol.title)}" />
    <meta name="twitter:description" content="${escapeHtml(sol.description)}" />
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
    const canonicalUrl = `${SITE_URL}/${ab.slug}`;
    const rawImage = ab.image;
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

    const aboutSchema = {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': `${canonicalUrl}#aboutpage`,
      'url': canonicalUrl,
      'name': ab.title,
      'headline': ab.headline,
      'description': ab.description,
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
    <!-- Individual About Page SEO for ${escapeHtml(ab.title)} -->
    <title>${escapeHtml(ab.title)}</title>
    <meta name="title" content="${escapeHtml(ab.title)}" />
    <meta name="description" content="${escapeHtml(ab.description)}" />
    <meta name="keywords" content="${escapeHtml(ab.keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />

    <meta name="voice-search-enabled" content="true" />
    <meta name="speakable" content="true" />
    <meta name="google-assistant-ready" content="true" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(ab.title)}" />
    <meta property="og:description" content="${escapeHtml(ab.description)}" />
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
  fs.writeFileSync(path.join(csIndexDir, 'index.html'), baseHtml, 'utf-8');

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
    const projectSlug = slugify(proj.name);
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
      pathSuffix: 'projects/ongoing',
      title: 'Ongoing Industrial Projects & Construction Sites in India | Pislinfra',
      description: 'Explore Pislinfra\'s ongoing industrial construction, warehouse developments, PEB steel plants, and infrastructure sites under execution across India.',
      keywords: 'ongoing industrial projects, warehouse construction sites India, PEB manufacturing plants under construction, civil infrastructure ongoing work, Pislinfra projects',
      canonicalUrl: `${SITE_URL}/projects/ongoing`,
      image: `${SITE_URL}/images/hero/Ongoing-Projects.png`
    },
    {
      pathSuffix: 'projects/completed',
      title: 'Completed Projects - Industrial & Warehouse Portfolio | Pislinfra',
      description: 'Explore Pislinfra\'s successfully delivered industrial projects - warehousing, logistics parks & infrastructure completed across India. 16M+ sq ft delivered.',
      keywords: 'completed projects, industrial construction, warehouse projects, logistics park, infrastructure portfolio, delivered projects, Pislinfra',
      canonicalUrl: `${SITE_URL}/projects/completed`,
      image: `${SITE_URL}/images/hero/Completed-Projects.png`
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
    listHtml = listHtml.replace(/<meta\s+property=["']og:[\s\S]*?>/gi, '');
    listHtml = listHtml.replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, '');

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
    <title>${escapeHtml(pl.title)}</title>
    <meta name="title" content="${escapeHtml(pl.title)}" />
    <meta name="description" content="${escapeHtml(pl.description)}" />
    <meta name="keywords" content="${escapeHtml(pl.keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${pl.canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${pl.canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pl.title)}" />
    <meta property="og:description" content="${escapeHtml(pl.description)}" />
    <meta property="og:image" content="${pl.image}" />
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
  const homeTitle = 'Pislinfra | Premier Industrial Infrastructure, Warehouse & EPC Company India';
  const homeDescription = 'Pislinfra (Pragati Infra Solutions) is India\'s leading industrial infrastructure, warehouse construction, and turnkey EPC company with 16M+ sq ft delivered across India for Amazon, Flipkart, Adani, Reliance, Myntra, Bosch, Daikin, and Prologis.';
  const homeKeywords = 'industrial construction company India, warehouse EPC contractor, PEB warehouse construction, logistics park builder, turnkey civil engineering India, Pislinfra, Amazon warehouse builder, Flipkart logistics park, Adani construction partner, Reliance solar unit builder';
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
