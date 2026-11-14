import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import BlogDB from '../src/data/Blogdb.js';
import projectsData from '../src/data/projectsData.js';
import completedProjects from '../src/data/completedProjects.js';
import { jobOpeningsData } from '../src/data/careersJobsData.js';
import leadershipMembers from '../src/data/leadershipData.js';
import awardsData from '../src/data/Awards-&-Certifications.js';

const SITE_URL = 'https://pislinfra.com';
const PHONE_NUMBER = '+91-8527040411';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeUrl(raw) {
  if (!raw) return '';
  let str = String(raw).trim();
  str = str.replace(/https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/wp-content\/uploads\/(?:[0-9]{4}\/[0-9]{2}\/)?([a-zA-Z0-9._-]+)/g, '/images/uploads/$1');
  str = str.replace(/https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/g, SITE_URL);
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
  return base || String(project.id) || '';
};

// Client logos - strictly keeping GAR and Lodha Group unchanged per user instructions
const verifiedClients = [
  { id: 1, name: 'Reliance Industries Limited', logo: '/images/uploads/Reliance-logo.webp' },
  { id: 2, name: 'AM/NS India', logo: '/images/uploads/NSINDIA.png' },
  { id: 3, name: 'Adani', logo: '/images/uploads/Adani.webp' },
  { id: 4, name: 'GAR', logo: '/images/uploads/GMR.webp' },
  { id: 5, name: 'Morgan Stanley', logo: '/images/uploads/MorganStanley.webp' },
  { id: 6, name: 'Prologis', logo: '/images/uploads/Prologis.webp' },
  { id: 7, name: 'Lodha Group', logo: '/images/uploads/LOHIAGrups.webp' },
  { id: 8, name: 'PMG Group', logo: '/images/uploads/Pmg.png' },
  { id: 9, name: 'CPWD India', logo: '/images/uploads/Cpwd.webp' },
  { id: 10, name: 'VinFast India', logo: '/images/uploads/Vinfast.png' },
  { id: 11, name: 'Semac Consultants', logo: '/images/uploads/semac-2.webp' },
  { id: 12, name: 'Rajratan Global Wires', logo: '/images/uploads/Rajratan-2.webp' },
  { id: 13, name: 'Oswal Group', logo: '/images/uploads/OswalGroup.png' },
  { id: 14, name: 'Avitech Nutrition', logo: '/images/uploads/avitech.webp' },
  { id: 15, name: 'Amazon India', logo: '/images/uploads/Amazon.webp' },
  { id: 16, name: 'Flipkart Logistics', logo: '/images/uploads/Flipkart.webp' },
  { id: 17, name: 'Ecom Express', logo: '/images/uploads/EcomExpress.webp' },
  { id: 18, name: 'Daikin India', logo: '/images/uploads/DAIKIN.webp' },
  { id: 19, name: 'Bosch India', logo: '/images/uploads/Bosch.webp' },
  { id: 20, name: 'Allcargo Logistics', logo: '/images/uploads/allCargo.webp' },
  { id: 21, name: 'Myntra Designs', logo: '/images/uploads/Myntra.webp' },
  { id: 22, name: 'Cadbury Mondelez', logo: '/images/uploads/Cadbury.webp' },
  { id: 23, name: 'Blue Dart Express', logo: '/images/uploads/BLUEDART.webp' },
  { id: 24, name: 'DHL Supply Chain', logo: '/images/uploads/DHL.webp' },
  { id: 25, name: 'Haryana State Government', logo: '/images/uploads/HariyanaGoverment.png' },
  { id: 26, name: 'LOGOS India', logo: '/images/uploads/Logos.webp' }
];

const SOLUTION_PAGES = [
  {
    slug: 'solutions',
    pathSuffix: 'solutions',
    breadcrumbName: 'Solutions',
    title: 'Construction & Infrastructure Solutions | Pislinfra',
    headline: 'Construction & Infrastructure Solutions',
    description: "Explore Pislinfra's comprehensive construction and infrastructure solutions, combining technical expertise, quality execution and innovative engineering approaches across India.",
    keywords: 'Construction & Infrastructure Solutions, turnkey industrial EPC, warehouse construction, infrastructure solutions India, industrial construction solutions',
    image: '/images/hero/Service.png',
    features: [
      'Architectural Design & Structural Engineering',
      'Turnkey Industrial EPC Construction & Commissioning',
      'Modern High-Bay Warehousing & Logistics Parks',
      'Heavy Civil Infrastructure & Site Grading Works'
    ]
  },
  {
    slug: 'solutions/industrial',
    pathSuffix: 'solutions/industrial',
    breadcrumbName: 'Industrial Construction',
    title: 'Industrial Development & Manufacturing EPC Company In India | Pislinfra',
    headline: 'Industrial Construction & Manufacturing Plant Engineering',
    description: "Discover Pislinfra's industrial construction solutions, delivering reliable, efficient and quality-driven manufacturing plants, heavy factories and PEB facilities across India.",
    keywords: 'Industrial Development, industrial construction, turnkey EPC contractor India, factory building construction, heavy steel PEB fabrication, manufacturing infrastructure, Pislinfra',
    image: '/images/hero/Industrial.png',
    features: [
      'Heavy Structural Steel & Pre-Engineered Building (PEB) Fabrication',
      'Turnkey EPC Engineering, Equipment Foundations & Commissioning',
      'Factory Civil Works, High-Load Floors & Utility Integration',
      'Strict Zero-Harm Safety Standards & ISO 45001 Compliance'
    ]
  },
  {
    slug: 'solutions/infrastructure',
    pathSuffix: 'solutions/infrastructure',
    breadcrumbName: 'Infrastructure Development',
    title: 'Civil & Infrastructure Development Company In India | Pislinfra',
    headline: 'Heavy Civil Infrastructure & Transportation Engineering',
    description: 'Explore Pislinfra’s infrastructure construction solutions, combining engineering expertise, quality execution and reliable project delivery for roads, drainage, bridges and complex developments.',
    keywords: 'Infrastructure Development, infrastructure construction solutions, civil infrastructure, engineering expertise, complex developments India, Pislinfra',
    image: '/images/hero/Infrastructure.png',
    features: [
      'High-Capacity Industrial Road Networks & Heavy Pavements',
      'Integrated Storm Water Drainage & Industrial Utility Grids',
      'Large Scale Industrial Site Development, Earthworks & Grading',
      'Culverts, Bridges & Transport Corridor Connectivity'
    ]
  },
  {
    slug: 'solutions/logistic',
    pathSuffix: 'solutions/logistic',
    breadcrumbName: 'Logistics Parks',
    title: 'Logistics Park Development & Supply Chain Hubs in India | Pislinfra',
    headline: 'Grade-A Logistics Parks & Modern Distribution Centers',
    description: "Pislinfra develops Grade-A logistics parks across India with integrated design, procurement and construction solutions for modern supply chains and multi-modal transit.",
    keywords: 'Logistics Park Development, Grade-A logistics parks, warehousing and logistics solutions, supply chain infrastructure India, Pislinfra',
    image: '/images/hero/Logistic.png',
    features: [
      'Strategic Transport Corridor & Highway Connectivity',
      'High-Throughput Cross-Docking & Distribution Layouts',
      'Heavy-Load Truck Aprons & Internal Circulation Roads',
      'Automated Security, Fire Hydrant Rings & Power Sub-Stations'
    ]
  },
  {
    slug: 'solutions/warehouse',
    pathSuffix: 'solutions/warehouse',
    breadcrumbName: 'Warehousing Solutions',
    title: 'Warehouse Construction & Grade-A Storage Facilities in India | Pislinfra',
    headline: 'High-Bay Warehousing & Storage Facilities Engineering',
    description: "Pislinfra delivers design-build warehouse construction solutions across India, creating FM2 superflat floor, scalable, and US LEED-compliant storage hubs.",
    keywords: 'Warehouse Construction Company, design-build warehouse construction, warehouse solutions India, future-ready facilities, FM2 floors, Pislinfra',
    image: '/images/hero/Warehouse.png',
    features: [
      'FM2 & DM2 Superflat Industrial Floor Specifications',
      'USGBC LEED Gold Certified Sustainable Green Building Engineering',
      'Advanced Thermal Insulation, Skylights & Ventilation Systems',
      'High-Bay Pre-Engineered Steel Frames with Clear Heights up to 14m'
    ]
  }
];

const ABOUT_PAGES = [
  {
    slug: 'about',
    pathSuffix: 'about',
    breadcrumbName: 'Overview',
    title: "About Pislinfra - India's Premier Industrial & Warehouse EPC Contractor",
    headline: "Pragati Infra Solutions (Pislinfra) - Building India's Industrial Backbone",
    description: 'Pragati Infra Solutions Pvt. Ltd. (Pislinfra) is a premier industrial infrastructure and EPC enterprise with 16M+ sq. ft delivered across India. Specializing in warehouses, logistics parks, and PEB engineering.',
    keywords: 'about Pislinfra, industrial construction company India, Pragati Infra Solutions, turnkey EPC contractor, warehouse builder India, industrial infrastructure profile',
    image: '/images/hero/11.png',
    highlights: [
      '16+ Million Sq. Ft. of High-Grade Industrial & Warehouse Space Delivered',
      'Pan-India Execution Network Across 25+ Strategic Industrial Locations',
      'US LEED Gold Certified Green Building Engineering Experience',
      'Integrated In-House Turnkey EPC, Civil, PEB & MEP Engineering Capabilities'
    ]
  },
  {
    slug: 'about/overview',
    pathSuffix: 'about/overview',
    breadcrumbName: 'Corporate Overview',
    title: 'Corporate Overview & Vision - Pragati Infra Solutions | Pislinfra',
    headline: 'Engineering Excellence, Reliability & Sustainable Infrastructure',
    description: 'Learn about Pislinfra’s corporate history, mission, leadership values, and track record in delivering landmark industrial projects across India.',
    keywords: 'Pislinfra corporate overview, company background, engineering mission, infrastructure track record India',
    image: '/images/hero/11.png',
    highlights: [
      'Founded with a Vision to Revolutionize Indian Industrial Construction',
      'Over 17 Years of Deep Engineering Expertise and Consistent Delivery',
      'Partner of Choice for Fortune 500 Enterprises and Global Investors',
      'Unwavering Focus on Structural Integrity, Quality and Timely Handover'
    ]
  },
  {
    slug: 'about/leadership',
    pathSuffix: 'about/leadership',
    breadcrumbName: 'Leadership',
    title: 'Leadership & Board of Directors - Visionary Infrastructure Leaders | Pislinfra',
    headline: 'Executive Leadership & Visionary Management at Pislinfra',
    description: 'Meet the executive leadership team and board of directors at Pislinfra steering India’s fastest-growing industrial EPC, civil engineering, and warehouse construction enterprise.',
    keywords: 'Pislinfra leadership, board of directors, management team, industrial infrastructure leaders India, civil engineering executives, construction MD India',
    image: '/images/hero/leadership.png',
    highlights: [
      'Decades of Cumulative Leadership in Heavy Civil & Industrial EPC Projects',
      'Pioneers in Fast-Track Pre-Engineered Warehousing in Northern & Western India',
      'Hands-On Project Governance and Rigorous Cost & Schedule Optimization',
      'Dedicated to Institutional Safety Protocols and Sustainable Work Practices'
    ]
  },
  {
    slug: 'about/awards',
    pathSuffix: 'about/awards',
    breadcrumbName: 'Awards & Certifications',
    title: 'Awards & Certifications - Safety Milestones & Industry Honors | Pislinfra',
    headline: 'Prestigious Industry Awards, Accolades & US LEED Certifications',
    description: 'Explore Pislinfra prestigious awards, US LEED Gold certification, and zero-LTI safety milestones awarded by Adani, Reliance, and leading industry councils.',
    keywords: 'Pislinfra awards, construction awards India, safety excellence awards, Adani best safety contractor, LEED Gold warehousing, industrial EPC honors',
    image: '/images/hero/Awards-Certification.png',
    highlights: [
      'Adani Group Best Safety Contractor Award - Zero-LTI Milestone Recognition',
      'USGBC LEED Gold Certified Sustainable Warehousing Engineering Excellence',
      'Times of India Industry Leaders Award for Industrial Infrastructure',
      'Multiple Million Safe Man-Hours Accreditations across High-Risk Sites'
    ]
  },
  {
    slug: 'about/ehs',
    pathSuffix: 'about/ehs',
    breadcrumbName: 'EHS & Safety',
    title: 'EHS Safety Protocols & Zero-Accident Construction Standards | Pislinfra',
    headline: 'Environment, Health & Safety (EHS) - Zero Harm, Zero Accidents',
    description: 'Pislinfra is committed to world-class Environment, Health & Safety (EHS) standards with over 15+ million safe man-hours, ISO certifications, and zero-LTI safety protocols on construction sites.',
    keywords: 'EHS policy construction, safety standards industrial construction, ISO 45001 contractor India, zero harm safety culture, safe man hours construction, Pislinfra EHS',
    image: '/images/hero/EHS.png',
    highlights: [
      'Over 15 Million Cumulative Safe Man-Hours Without Lost Time Injury (LTI)',
      'Certified ISO 45001 (Safety), ISO 14001 (Environment), and ISO 9001 (Quality)',
      'Daily Tool-Box Talks (TBT), Risk Assessments (HIRA) and Mandatory PPE Enforcement',
      'Continuous Site Safety Training Programs and Zero-Tolerance Safety Violations'
    ]
  },
  {
    slug: 'about/csr',
    pathSuffix: 'about/csr',
    breadcrumbName: 'CSR Initiatives',
    title: 'CSR & Community Empowerment Programs - Sustainable Social Impact | Pislinfra',
    headline: 'Corporate Social Responsibility - Empowering Communities Nationwide',
    description: 'Discover Pislinfra Corporate Social Responsibility (CSR) programs empowering local communities through education, healthcare, skill development, and environmental greening across India.',
    keywords: 'Pislinfra CSR, corporate social responsibility construction, community empowerment India, sustainable development, green initiatives, healthcare and education CSR',
    image: '/images/hero/CSR.png',
    highlights: [
      'Grassroots Community Education Programs and Infrastructure Upgrades',
      'Free Multi-Specialty Health Screening Camps in Rural & Industrial Belts',
      'Vocational Skill Training and Apprenticeships for Local Construction Youth',
      'Large-Scale Native Tree Plantation Drives and Eco-Restoration Initiatives'
    ]
  },
  {
    slug: 'about/quality',
    pathSuffix: 'about/quality',
    breadcrumbName: 'Quality Standards',
    title: 'Quality Assurance & Quality Control (QA/QC) Standards | Pislinfra',
    headline: 'Rigorous Quality Standards & Engineering Precision',
    description: 'Pislinfra QA/QC framework guarantees structural reliability, concrete durability, laser screed floor precision, and conformance to Indian and international standards.',
    keywords: 'construction quality assurance, QA QC civil engineering India, concrete testing laboratory, FM2 floor verification, Pislinfra quality',
    image: '/images/hero/Service.png',
    highlights: [
      'Comprehensive On-Site NABL-Compliant Material Testing Laboratories',
      'Statistical Concrete Quality Monitoring and Ultrasonic Pulse Velocity Testing',
      'Laser Screed Precision for FM2/DM2 Superflat Industrial Floors',
      'Multi-Tier Quality Inspection Audits at Each Stage of Construction'
    ]
  }
];

const POLICY_REDIRECT_PAGES = [
  { pathSuffix: 'about/company-policy', title: 'Company Policy & Corporate Governance | Pislinfra' },
  { pathSuffix: 'about/policies', title: 'Company Policy & Corporate Governance | Pislinfra' },
  { pathSuffix: 'about/policies-governance', title: 'Policies & Governance | Pislinfra' },
  { pathSuffix: 'policies-governance', title: 'Policies & Governance | Pislinfra' }
];

const CORPORATE_PAGES = [
  {
    pathSuffix: 'company-policy',
    title: 'Company Policy & Corporate Governance Framework | Pislinfra',
    headline: 'Corporate Policies, Ethical Standards & Governance Framework',
    description: 'Explore Pislinfra corporate policies including Risk Management Policy, Vigil Mechanism / Whistleblower Policy, Corporate Social Responsibility (CSR) Policy, and HSE Policy.',
    keywords: 'Pislinfra policies, company policy, risk management policy, vigil mechanism policy, CSR policy, corporate governance infrastructure India',
    image: '/images/hero/Extra-2.png',
    canonicalUrl: `${SITE_URL}/company-policy`
  },
  {
    pathSuffix: 'careers',
    title: 'Careers at Pislinfra | Build Your Future With Us',
    headline: 'Careers at Pislinfra - Join Our World-Class Engineering Team',
    description: 'Explore career opportunities at Pislinfra. Discover 27 active job openings across planning, costing, site execution, quality control, safety, and project management in India.',
    keywords: 'Careers at Pislinfra, construction jobs India, civil engineering careers, infrastructure job openings, hiring, Pislinfra careers',
    image: '/images/hero/Careers.png',
    canonicalUrl: `${SITE_URL}/careers`
  },
  {
    pathSuffix: 'contact-us',
    title: 'Contact Pislinfra | Enquiries & Business Support',
    headline: 'Contact Pragati Infra Solutions - Partner With Us Today',
    description: 'Get in touch with Pislinfra for industrial project enquiries, warehouse development partnerships, and construction solutions. Connect with our engineering leadership.',
    keywords: 'Contact Pislinfra, project enquiries, business partnerships, construction solutions, infrastructure assistance, Pislinfra office',
    image: '/images/hero/Contact-Us.png',
    canonicalUrl: `${SITE_URL}/contact-us`
  },
  {
    pathSuffix: 'annual-reports',
    title: 'Pislinfra Annual Reports | Corporate Filings & Disclosures',
    headline: 'Annual Reports, Financial Disclosures & Corporate Filings',
    description: 'Explore Pislinfra annual reports, statutory disclosures, and financial filings demonstrating transparency, consistent growth, and solid governance.',
    keywords: 'Pislinfra Annual Reports, company reports, annual returns, statutory disclosures, financial year performance, Pislinfra',
    image: '/images/hero/Annual-Reports.png',
    canonicalUrl: `${SITE_URL}/annual-reports`
  },
  {
    pathSuffix: 'coverage',
    title: 'Pan-India Presence & Infrastructure Footprint | Pislinfra',
    headline: 'Delivering Landmark Infrastructure Across 25+ Locations in India',
    description: "Explore Pislinfra nationwide operational footprint with 16M+ sq. ft delivered across 12+ states in India including Gujarat, Haryana, Tamil Nadu, Punjab, and Maharashtra.",
    keywords: 'Pislinfra presence, construction locations India, pan India EPC footprint, warehouse builder Haryana Gujarat, industrial projects map',
    image: '/images/hero/Service.png',
    canonicalUrl: `${SITE_URL}/coverage`
  },
  {
    pathSuffix: 'sitemap',
    title: 'HTML Site Index & Complete Website Navigation | Pislinfra',
    headline: 'Pislinfra Website Sitemap & Navigation Index',
    description: 'Complete directory of all industrial solutions, projects, case studies, blogs, about us sections, corporate policies, and career opportunities at Pislinfra.',
    keywords: 'Pislinfra sitemap, website index, pages navigation, industrial construction links',
    image: '/logo.png',
    canonicalUrl: `${SITE_URL}/sitemap`
  },
  {
    pathSuffix: 'privacy-policy',
    title: 'Privacy Policy & Data Protection | Pislinfra',
    headline: 'Privacy Policy & Corporate Data Protection Standards',
    description: 'Read Pislinfra Privacy Policy to understand how we collect, use, protect and manage information across our website and business operations.',
    keywords: 'Privacy Policy, Pislinfra, data protection, personal information, privacy terms',
    image: '/images/hero/Extra-2.png',
    canonicalUrl: `${SITE_URL}/privacy-policy`
  }
];

/**
 * Clean wrapper that matches the global website container system
 */
function wrapWithLayout({ title, canonicalUrl, breadcrumbHtml = '', contentHtml = '' }) {
  return `
    <div class="website-outer" style="background-color: #E8E8E8; min-height: 100vh; width: 100%;">
      <div class="website-container" style="max-width: 1360px; margin: 0 auto; background-color: #ffffff; min-height: 100vh; display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        <header class="pisl-static-header" style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 18px 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
            <a href="/" aria-label="Pislinfra Homepage">
              <img src="/logo.png" alt="Pragati Infra Solutions Pvt. Ltd. (Pislinfra)" width="180" height="48" style="height: 48px; width: auto; object-fit: contain;" />
            </a>
            <nav aria-label="Main Navigation" style="display: flex; flex-wrap: wrap; gap: 18px; font-size: 15px; font-weight: 500;">
              <a href="/about/overview" style="color: #1e293b; text-decoration: none;">About Us</a>
              <a href="/solutions" style="color: #1e293b; text-decoration: none;">Solutions</a>
              <a href="/projects/ongoing" style="color: #1e293b; text-decoration: none;">Projects</a>
              <a href="/projects/case-study" style="color: #1e293b; text-decoration: none;">Case Studies</a>
              <a href="/about/leadership" style="color: #1e293b; text-decoration: none;">Leadership</a>
              <a href="/company-policy" style="color: #1e293b; text-decoration: none;">Policies</a>
              <a href="/blog" style="color: #1e293b; text-decoration: none;">Insights</a>
              <a href="/careers" style="color: #1e293b; text-decoration: none;">Careers</a>
              <a href="/contact-us" style="color: #0284c7; text-decoration: none; font-weight: 600;">Contact Us</a>
            </nav>
          </div>
        </header>

        <main id="main-content" style="flex: 1; padding: 40px 24px; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          ${breadcrumbHtml ? `<nav aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 14px; color: #64748b;">${breadcrumbHtml}</nav>` : ''}
          ${contentHtml}
        </main>

        <footer class="pisl-static-footer" style="background: #0B132B; color: #ffffff; padding: 48px 24px 24px 24px; margin-top: auto; font-family: system-ui, -apple-system, sans-serif;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 32px; margin-bottom: 32px;">
            <div>
              <p style="font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 12px 0;">Pragati Infra Solutions Pvt. Ltd.</p>
              <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 16px 0;">India's premier industrial and warehouse EPC contractor delivering Grade-A infrastructure across 25+ locations.</p>
              <p style="font-size: 14px; color: #cbd5e1; margin: 0;"><strong>Phone:</strong> <a href="tel:+918527040411" style="color: #38bdf8; text-decoration: none;">+91-8527040411</a></p>
              <p style="font-size: 14px; color: #cbd5e1; margin: 6px 0 0 0;"><strong>Email:</strong> <a href="mailto:contact@pislinfra.com" style="color: #38bdf8; text-decoration: none;">contact@pislinfra.com</a></p>
            </div>
            <div>
              <p style="font-size: 16px; font-weight: 600; color: #ffffff; margin: 0 0 12px 0;">Core Solutions</p>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; line-height: 2;">
                <li><a href="/solutions/industrial" style="color: #94a3b8; text-decoration: none;">Industrial Construction</a></li>
                <li><a href="/solutions/infrastructure" style="color: #94a3b8; text-decoration: none;">Infrastructure Development</a></li>
                <li><a href="/solutions/logistic" style="color: #94a3b8; text-decoration: none;">Logistics Parks</a></li>
                <li><a href="/solutions/warehouse" style="color: #94a3b8; text-decoration: none;">Warehousing Solutions</a></li>
              </ul>
            </div>
            <div>
              <p style="font-size: 16px; font-weight: 600; color: #ffffff; margin: 0 0 12px 0;">Corporate Governance</p>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; line-height: 2;">
                <li><a href="/company-policy" style="color: #94a3b8; text-decoration: none;">Company Policy & Governance</a></li>
                <li><a href="/about/ehs" style="color: #94a3b8; text-decoration: none;">EHS & Safety Excellence</a></li>
                <li><a href="/about/csr" style="color: #94a3b8; text-decoration: none;">CSR Initiatives</a></li>
                <li><a href="/about/awards" style="color: #94a3b8; text-decoration: none;">Awards & Certifications</a></li>
                <li><a href="/coverage" style="color: #94a3b8; text-decoration: none;">Pan-India Footprint</a></li>
                <li><a href="/annual-reports" style="color: #94a3b8; text-decoration: none;">Annual Reports</a></li>
                <li><a href="/sitemap" style="color: #94a3b8; text-decoration: none;">Website Directory</a></li>
              </ul>
            </div>
            <div>
              <p style="font-size: 16px; font-weight: 600; color: #ffffff; margin: 0 0 12px 0;">Registered Office</p>
              <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0;">31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122018</p>
            </div>
          </div>
          <div style="border-top: 1px solid #1e293b; padding-top: 20px; text-align: center; font-size: 13px; color: #64748b;">
            &copy; 2026 Pragati Infra Solutions Pvt. Ltd. (Pislinfra). All Rights Reserved.
          </div>
        </footer>
      </div>
    </div>
  `;
}

/**
 * Injects head meta tags and SEO crawlable static body into dist HTML template
 * Preserves the clean animated preloader inside #root for real JS visitors to eliminate
 * any 1-second flash of unstyled content / wrong page on route refresh.
 * Static body is placed inside <noscript> so search engine crawlers index all content.
 */
function injectPrerender(baseHtml, headBlock, rootBodyHtml) {
  let html = baseHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
  html = html.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, '');
  html = html.replace(/<meta\s+name=["']keywords["'][\s\S]*?>/i, '');
  html = html.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, '');
  html = html.replace(/<meta\s+property=["']og:[\s\S]*?>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, '');
  html = html.replace(/<link\s+rel=["']alternate["'][\s\S]*?rss[\s\S]*?>/gi, '');

  html = html.replace('</head>', `${headBlock}\n</head>`);

  // Place crawlable static HTML in <noscript> so search engine crawlers get 100% of text and links
  // while human users never experience any jarring layout shift or page flash on refresh
  if (rootBodyHtml) {
    const noscriptBlock = `\n    <noscript>\n      ${rootBodyHtml}\n    </noscript>`;
    html = html.replace('</body>', `${noscriptBlock}\n  </body>`);
  }

  return html;
}

export function prerenderAllPages() {
  console.log('⚡ Starting Complete SEO Static HTML Prerendering...');

  const distDir = path.join(__dirname, '..', 'dist');
  const baseIndexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(baseIndexHtmlPath)) {
    console.error('⚠️ dist/index.html not found. Run "vite build" first before prerendering.');
    return;
  }

  const baseHtml = fs.readFileSync(baseIndexHtmlPath, 'utf-8');

  // ==========================================
  // 1. PRERENDER INDIVIDUAL BLOG POSTS (35 posts)
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
    const rawImage = sanitizeUrl(blog.featuredImage || blog.image || '/images/hero/Blog.png');
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
    const publishDate = blog.publishDate || '2026-01-01';
    const authorName = blog.authorName || blog.author?.name || 'Pragati Infra Solutions Pvt. Ltd.';

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${SITE_URL}/blog` },
        { '@type': 'ListItem', 'position': 3, 'name': blog.title, 'item': canonicalUrl }
      ]
    };

    const blogPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      'headline': blog.title,
      'name': blog.title,
      'description': description,
      'image': [imageUrl],
      'datePublished': publishDate,
      'dateModified': blog.updatedDate || publishDate,
      'author': { '@type': 'Organization', 'name': authorName, 'url': SITE_URL },
      'publisher': {
        '@type': 'Organization',
        'name': 'Pragati Infra Solutions Pvt. Ltd.',
        'url': SITE_URL,
        'logo': { '@type': 'ImageObject', 'url': `${SITE_URL}/logo.png`, 'width': 512, 'height': 512 }
      },
      'mainEntityOfPage': { '@type': 'WebPage', '@id': canonicalUrl }
    };

    const headBlock = `
    <title>${escapeHtml(title)}</title>
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="${escapeHtml(authorName)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <script type="application/ld+json">
${JSON.stringify([blogPostingSchema, breadcrumbSchema], null, 2)}
    </script>`;

    const breadcrumbHtml = `<a href="/" style="color:#0284c7;text-decoration:none;">Home</a> &gt; <a href="/blog" style="color:#0284c7;text-decoration:none;">Blog</a> &gt; <span>${escapeHtml(blog.title)}</span>`;
    
    // Clean content snippet
    const rawContent = (blog.content || blog.excerpt || description).replace(/<script[\s\S]*?<\/script>/gi, '');
    const contentHtml = `
      <article>
        <header style="margin-bottom: 24px;">
          <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; line-height: 1.3; margin: 0 0 12px 0;">${escapeHtml(blog.title)}</h1>
          <div style="font-size: 14px; color: #64748b; margin-bottom: 20px;">
            Published on <strong>${escapeHtml(publishDate)}</strong> by <strong>${escapeHtml(authorName)}</strong>
          </div>
          <div style="margin-bottom: 28px; border-radius: 8px; overflow: hidden; max-height: 480px;">
            <img src="${escapeHtml(rawImage)}" alt="${escapeHtml(blog.imageAlt || blog.title)}" width="1200" height="630" style="width: 100%; height: auto; object-fit: cover; border-radius: 8px;" />
          </div>
        </header>
        <div class="blog-body" style="font-size: 17px; line-height: 1.8; color: #334155;">
          ${rawContent.length > 200 ? rawContent : `<p>${escapeHtml(rawContent)}</p>`}
        </div>
        <div style="margin-top: 40px; padding: 24px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">Explore Pislinfra Infrastructure Solutions</h3>
          <p style="font-size: 15px; color: #64748b; margin: 0 0 16px 0;">Learn how Pislinfra delivers turnkey industrial, warehousing, and PEB engineering solutions across India.</p>
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <a href="/solutions/industrial" style="color: #0284c7; font-weight: 600; text-decoration: none;">Industrial Construction &rarr;</a>
            <a href="/solutions/warehouse" style="color: #0284c7; font-weight: 600; text-decoration: none;">Warehousing Solutions &rarr;</a>
            <a href="/projects/ongoing" style="color: #0284c7; font-weight: 600; text-decoration: none;">View Ongoing Projects &rarr;</a>
          </div>
        </div>
      </article>
    `;

    const fullBodyHtml = wrapWithLayout({ title, canonicalUrl, breadcrumbHtml, contentHtml });
    const outputHtml = injectPrerender(baseHtml, headBlock, fullBodyHtml);

    const blogDir = path.join(distDir, 'blog', slug);
    if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
    fs.writeFileSync(path.join(blogDir, 'index.html'), outputHtml, 'utf-8');
    blogCount++;
  });
  console.log(`✅ Prerendered ${blogCount} individual blog static HTML pages!`);

  // ==========================================
  // 2. PRERENDER SOLUTIONS PAGES (5 pages)
  // ==========================================
  let solCount = 0;
  SOLUTION_PAGES.forEach(sol => {
    const canonicalUrl = `${SITE_URL}/${sol.pathSuffix}`;
    const headBlock = `
    <title>${escapeHtml(sol.title)}</title>
    <meta name="title" content="${escapeHtml(sol.title)}" />
    <meta name="description" content="${escapeHtml(sol.description)}" />
    <meta name="keywords" content="${escapeHtml(sol.keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(sol.title)}" />
    <meta property="og:description" content="${escapeHtml(sol.description)}" />
    <meta property="og:image" content="${SITE_URL}${sol.image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(sol.title)}" />
    <meta name="twitter:description" content="${escapeHtml(sol.description)}" />
    <meta name="twitter:image" content="${SITE_URL}${sol.image}" />
    <script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${canonicalUrl}#service`,
  'name': sol.headline,
  'description': sol.description,
  'provider': { '@type': 'Organization', 'name': 'Pragati Infra Solutions Pvt. Ltd.', 'url': SITE_URL },
  'areaServed': 'IN',
  'url': canonicalUrl
}, null, 2)}
    </script>`;

    const breadcrumbHtml = `<a href="/" style="color:#0284c7;text-decoration:none;">Home</a> &gt; <a href="/solutions" style="color:#0284c7;text-decoration:none;">Solutions</a> &gt; <span>${escapeHtml(sol.breadcrumbName)}</span>`;
    const featuresList = sol.features.map(f => `<li style="margin-bottom: 8px;">${escapeHtml(f)}</li>`).join('');

    const contentHtml = `
      <section>
        <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">${escapeHtml(sol.headline)}</h1>
        <p style="font-size: 18px; line-height: 1.7; color: #475569; margin: 0 0 24px 0;">${escapeHtml(sol.description)}</p>
        <div style="margin-bottom: 32px; border-radius: 8px; overflow: hidden;">
          <img src="${escapeHtml(sol.image)}" alt="${escapeHtml(sol.headline)} by Pislinfra" width="1200" height="400" style="width: 100%; height: auto; max-height: 420px; object-fit: cover; border-radius: 8px;" />
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">Core Engineering Capabilities</h2>
          <ul style="color: #334155; font-size: 16px; line-height: 1.8; padding-left: 20px; margin: 0;">
            ${featuresList}
          </ul>
        </div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <a href="/contact-us" style="display: inline-block; background: #0284c7; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-weight: 600; text-decoration: none;">Discuss Your Project</a>
          <a href="/projects/ongoing" style="display: inline-block; background: #f1f5f9; color: #0f172a; padding: 12px 24px; border-radius: 6px; font-weight: 600; text-decoration: none;">View Project Portfolio</a>
        </div>
      </section>
    `;

    const fullBodyHtml = wrapWithLayout({ title: sol.title, canonicalUrl, breadcrumbHtml, contentHtml });
    const outputHtml = injectPrerender(baseHtml, headBlock, fullBodyHtml);

    const solDir = path.join(distDir, ...sol.pathSuffix.split('/'));
    if (!fs.existsSync(solDir)) fs.mkdirSync(solDir, { recursive: true });
    fs.writeFileSync(path.join(solDir, 'index.html'), outputHtml, 'utf-8');
    solCount++;
  });
  console.log(`✅ Prerendered ${solCount} Solutions static HTML pages!`);

  // ==========================================
  // 3. PRERENDER ALL ABOUT US SUBPAGES (7 pages)
  // ==========================================
  let aboutCount = 0;
  ABOUT_PAGES.forEach(ab => {
    const canonicalUrl = `${SITE_URL}/${ab.pathSuffix}`;
    const headBlock = `
    <title>${escapeHtml(ab.title)}</title>
    <meta name="title" content="${escapeHtml(ab.title)}" />
    <meta name="description" content="${escapeHtml(ab.description)}" />
    <meta name="keywords" content="${escapeHtml(ab.keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(ab.title)}" />
    <meta property="og:description" content="${escapeHtml(ab.description)}" />
    <meta property="og:image" content="${SITE_URL}${ab.image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(ab.title)}" />
    <meta name="twitter:description" content="${escapeHtml(ab.description)}" />
    <meta name="twitter:image" content="${SITE_URL}${ab.image}" />
    <script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${canonicalUrl}#about`,
  'name': ab.headline,
  'description': ab.description,
  'publisher': { '@type': 'Organization', 'name': 'Pragati Infra Solutions Pvt. Ltd.', 'url': SITE_URL },
  'url': canonicalUrl
}, null, 2)}
    </script>`;

    const breadcrumbHtml = `<a href="/" style="color:#0284c7;text-decoration:none;">Home</a> &gt; <a href="/about/overview" style="color:#0284c7;text-decoration:none;">About Us</a> &gt; <span>${escapeHtml(ab.breadcrumbName)}</span>`;
    const highlightsHtml = ab.highlights.map(h => `<li style="margin-bottom: 8px;">${escapeHtml(h)}</li>`).join('');

    let extraSectionHtml = '';
    if (ab.slug === 'about/leadership') {
      const leaderCards = Array.isArray(leadershipMembers) ? leadershipMembers.map(m => `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center;">
          <img src="${sanitizeUrl(m.image || '/images/hero/leadership.png')}" alt="${escapeHtml(m.name)} - ${escapeHtml(m.role || 'Executive Leadership')} at Pislinfra" width="160" height="160" style="width: 140px; height: 140px; object-fit: cover; border-radius: 50%; margin: 0 auto 12px auto; display: block;" />
          <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">${escapeHtml(m.name)}</h3>
          <p style="font-size: 14px; font-weight: 600; color: #0284c7; margin: 0 0 10px 0;">${escapeHtml(m.role || m.designation || 'Leader')}</p>
          <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">${escapeHtml(m.description || m.bio || '')}</p>
        </div>
      `).join('') : '';

      extraSectionHtml = `
        <div style="margin-top: 32px;">
          <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 20px 0;">Executive Management Team</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px;">
            ${leaderCards}
          </div>
        </div>
      `;
    }

    const contentHtml = `
      <section>
        <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">${escapeHtml(ab.headline)}</h1>
        <p style="font-size: 18px; line-height: 1.7; color: #475569; margin: 0 0 24px 0;">${escapeHtml(ab.description)}</p>
        <div style="margin-bottom: 32px; border-radius: 8px; overflow: hidden;">
          <img src="${escapeHtml(ab.image)}" alt="${escapeHtml(ab.headline)}" width="1200" height="400" style="width: 100%; height: auto; max-height: 420px; object-fit: cover; border-radius: 8px;" />
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">Key Highlights & Commitments</h2>
          <ul style="color: #334155; font-size: 16px; line-height: 1.8; padding-left: 20px; margin: 0;">
            ${highlightsHtml}
          </ul>
        </div>
        ${extraSectionHtml}
      </section>
    `;

    const fullBodyHtml = wrapWithLayout({ title: ab.title, canonicalUrl, breadcrumbHtml, contentHtml });
    const outputHtml = injectPrerender(baseHtml, headBlock, fullBodyHtml);

    const abDir = path.join(distDir, ...ab.pathSuffix.split('/'));
    if (!fs.existsSync(abDir)) fs.mkdirSync(abDir, { recursive: true });
    fs.writeFileSync(path.join(abDir, 'index.html'), outputHtml, 'utf-8');
    aboutCount++;
  });
  console.log(`✅ Prerendered ${aboutCount} About Us static HTML pages!`);

  // ==========================================
  // 4. PRERENDER POLICY REDIRECT PAGES (4 pages)
  // ==========================================
  const primaryPolicyUrl = `${SITE_URL}/company-policy`;
  POLICY_REDIRECT_PAGES.forEach(pol => {
    const headBlock = `
    <title>${escapeHtml(pol.title)}</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${primaryPolicyUrl}" />
    <meta http-equiv="refresh" content="0;url=${primaryPolicyUrl}" />`;

    const contentHtml = `
      <section style="text-align: center; padding: 60px 20px;">
        <h1 style="font-size: 26px; color: #0f172a;">Redirecting to Company Policy & Corporate Governance...</h1>
        <p style="color: #64748b; margin-top: 12px;">If your browser does not redirect automatically, please <a href="/company-policy" style="color: #0284c7; font-weight: 600;">click here to view our Company Policy</a>.</p>
      </section>
    `;
    const fullBodyHtml = wrapWithLayout({ title: pol.title, canonicalUrl: primaryPolicyUrl, contentHtml });
    const outputHtml = injectPrerender(baseHtml, headBlock, fullBodyHtml);

    const polDir = path.join(distDir, ...pol.pathSuffix.split('/'));
    if (!fs.existsSync(polDir)) fs.mkdirSync(polDir, { recursive: true });
    fs.writeFileSync(path.join(polDir, 'index.html'), outputHtml, 'utf-8');
  });
  console.log(`✅ Prerendered 4 Company Policy redirect pages pointing cleanly to /company-policy!`);

  // ==========================================
  // 5. PRERENDER CASE STUDIES (8 detail + 1 listing)
  // ==========================================
  const csList = [
    { slug: 'sunsat-warehousing', title: 'Flipkart Sampka - Sunsat Warehousing', developer: 'Sunsat Warehousing Pvt. Ltd.', location: 'Sampka, Delhi NCR', image: '/images/uploads/flipkart-sampka-pataudi-hr.png' },
    { slug: 'pragati-farukhnagar-logistics', title: 'Pragati Farukhnagar Logistics Park Phase I (Flipkart)', developer: 'Morgan Stanley', location: 'Farrukhnagar, Haryana', image: '/images/uploads/large_pragati_farrukhnagar_logistics_park_hr_cfabd902b6.png' },
    { slug: 'ludhiana-logistics-park', title: 'Ludhiana Logistics Park', developer: 'Ludhiana Logistics', location: 'Ludhiana, Punjab', image: '/images/uploads/optimized_1787754985241_987_large_ludhiana-logistics-park-pb_png.webp' },
    { slug: 'bluestar-realtors-palwal', title: 'Bluestar Realtors Palwal (Ecom Express)', developer: 'Bluestar Realtors Ltd', location: 'Palwal, NCR', image: '/images/uploads/bluestar-realtors-ltd-palwal-hr-3.png' },
    { slug: 'ncr-bigbox-patli', title: 'NCR Bigbox Patli (Welspun)', developer: 'Welspun One', location: 'Patli, NCR', image: '/images/uploads/large_ncr_bigbox_patli_hr_3_6aa090f432.png' },
    { slug: 'avitech-nutrition-farukhnagar', title: 'Avitech Nutrition Farukhnagar', developer: 'Avitech Nutrition', location: 'Farrukhnagar, Haryana', image: '/images/uploads/avitech-nutrition-farukhnager-hr-3.png' },
    { slug: 'om-sukh-logistics-park-pataudi', title: 'Om Sukh Logistics Park Pataudi', developer: 'Om Sukh Developers', location: 'Pataudi, NCR', image: '/images/uploads/large_om_sukh_logistics_park_pataudi_hr_3_c62a9212a2.png' },
    { slug: 'gmr-coimbatore-logistics-park', title: 'GMR Coimbatore Logistics Park', developer: 'GMR Group', location: 'Coimbatore, Tamil Nadu', image: '/images/uploads/gmr-coimbatore-logistics-park-coimbatore-tn-2.png' }
  ];

  let csCount = 0;
  csList.forEach(cs => {
    const slug = cs.slug;
    const canonicalUrl = `${SITE_URL}/projects/case-study/${slug}`;
    const title = `${cs.title} - Case Study | Pislinfra`;
    const description = `Read how Pislinfra executed ${cs.title} in ${cs.location} for ${cs.developer || 'Client'}. Detailed case study on high-speed industrial construction and safety excellence.`;
    const rawImage = sanitizeUrl(cs.image || cs.featuredImage || '/images/hero/Case-Study.png');
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

    const headBlock = `
    <title>${escapeHtml(title)}</title>
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${canonicalUrl}#article`,
  'headline': cs.title,
  'description': description,
  'image': [imageUrl],
  'publisher': { '@type': 'Organization', 'name': 'Pragati Infra Solutions Pvt. Ltd.', 'url': SITE_URL },
  'url': canonicalUrl
}, null, 2)}
    </script>`;

    const breadcrumbHtml = `<a href="/" style="color:#0284c7;text-decoration:none;">Home</a> &gt; <a href="/projects/case-study" style="color:#0284c7;text-decoration:none;">Case Studies</a> &gt; <span>${escapeHtml(cs.title)}</span>`;
    const contentHtml = `
      <article>
        <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">${escapeHtml(cs.title)}</h1>
        <div style="display: flex; gap: 24px; flex-wrap: wrap; font-size: 15px; color: #64748b; margin-bottom: 24px;">
          <span><strong>Client/Developer:</strong> ${escapeHtml(cs.developer || 'N/A')}</span>
          <span><strong>Location:</strong> ${escapeHtml(cs.location || 'India')}</span>
          <span><strong>Area:</strong> ${escapeHtml(cs.buildUpArea || cs.plinthArea || 'Grade-A Facility')}</span>
        </div>
        <div style="margin-bottom: 32px; border-radius: 8px; overflow: hidden;">
          <img src="${escapeHtml(rawImage)}" alt="${escapeHtml(cs.title)} - Pislinfra Case Study" width="1200" height="600" style="width: 100%; height: auto; max-height: 480px; object-fit: cover; border-radius: 8px;" />
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Project Execution & Results</h2>
          <p style="font-size: 16px; line-height: 1.8; color: #334155; margin: 0 0 16px 0;">${escapeHtml(cs.overview || description)}</p>
          <p style="font-size: 15px; color: #475569; margin: 0;">Delivered with zero lost-time injuries (LTI), laser-guided concrete screed accuracy, and high-efficiency pre-engineered steel framing.</p>
        </div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <a href="/projects/case-study" style="color: #0284c7; font-weight: 600; text-decoration: none;">&larr; View All Case Studies</a>
          <a href="/projects/ongoing" style="color: #0284c7; font-weight: 600; text-decoration: none;">Explore Ongoing Projects &rarr;</a>
        </div>
      </article>
    `;

    const fullBodyHtml = wrapWithLayout({ title, canonicalUrl, breadcrumbHtml, contentHtml });
    const outputHtml = injectPrerender(baseHtml, headBlock, fullBodyHtml);

    const csDir = path.join(distDir, 'projects', 'case-study', slug);
    if (!fs.existsSync(csDir)) fs.mkdirSync(csDir, { recursive: true });
    fs.writeFileSync(path.join(csDir, 'index.html'), outputHtml, 'utf-8');
    csCount++;
  });
  console.log(`✅ Prerendered ${csCount} Case Study detail static HTML pages!`);

  // ==========================================
  // 6. PRERENDER ALL ONGOING & COMPLETED PROJECTS (43 pages)
  // ==========================================
  const allProjects = [
    ...projectsData.map(p => ({ ...p, projectType: 'ongoing' })),
    ...completedProjects.map(p => ({ ...p, projectType: 'completed' }))
  ];

  let projCount = 0;
  allProjects.forEach(proj => {
    const projectType = proj.projectType;
    const slug = getProjectSlug(proj);
    const canonicalUrl = `${SITE_URL}/project/${projectType}/${slug}`;
    const title = `${proj.name} - ${proj.category || 'Industrial'} Construction in ${proj.location}, ${proj.state} | Pislinfra`;
    const description = `${proj.name} in ${proj.location}, ${proj.state}. Client: ${proj.client || 'Valued Partner'}, Built-up Area: ${proj.area || 'Grade-A Space'}, Status: ${proj.status || projectType}. EPC construction delivered by Pislinfra.`;
    const rawImage = sanitizeUrl((proj.images && proj.images.length > 0) ? proj.images[0] : '/images/hero/Completed-Projects.png');
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

    const headBlock = `
    <title>${escapeHtml(title)}</title>
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'CivicStructure',
  '@id': `${canonicalUrl}#structure`,
  'name': proj.name,
  'description': description,
  'image': [imageUrl],
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': proj.location || 'India',
    'addressRegion': proj.state || 'India',
    'addressCountry': 'IN'
  },
  'url': canonicalUrl
}, null, 2)}
    </script>`;

    const breadcrumbHtml = `<a href="/" style="color:#0284c7;text-decoration:none;">Home</a> &gt; <a href="/projects/${projectType}" style="color:#0284c7;text-decoration:none;">${projectType === 'ongoing' ? 'Ongoing Projects' : 'Completed Projects'}</a> &gt; <span>${escapeHtml(proj.name)}</span>`;
    
    // Project specifications
    const contentHtml = `
      <article>
        <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">${escapeHtml(proj.name)}</h1>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <div><strong style="color: #64748b; font-size: 13px; text-transform: uppercase;">Client</strong><p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #0f172a;">${escapeHtml(proj.client || 'Confidential Client')}</p></div>
          <div><strong style="color: #64748b; font-size: 13px; text-transform: uppercase;">Location</strong><p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #0f172a;">${escapeHtml(proj.location || '')}, ${escapeHtml(proj.state || '')}</p></div>
          <div><strong style="color: #64748b; font-size: 13px; text-transform: uppercase;">Built-up Area</strong><p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #0f172a;">${escapeHtml(proj.area || 'Grade-A Space')}</p></div>
          <div><strong style="color: #64748b; font-size: 13px; text-transform: uppercase;">Status</strong><p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #0284c7;">${escapeHtml(proj.status || projectType)}</p></div>
          <div><strong style="color: #64748b; font-size: 13px; text-transform: uppercase;">Scope of Work</strong><p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #0f172a;">${escapeHtml(proj.scope || 'Turnkey EPC Construction')}</p></div>
        </div>
        <div style="margin-bottom: 32px; border-radius: 8px; overflow: hidden;">
          <img src="${escapeHtml(rawImage)}" alt="${escapeHtml(proj.name)} construction site in ${escapeHtml(proj.location || '')}" width="1200" height="600" style="width: 100%; height: auto; max-height: 480px; object-fit: cover; border-radius: 8px;" />
        </div>
        <div style="font-size: 16px; line-height: 1.8; color: #334155; margin-bottom: 32px;">
          <h2 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Project Overview</h2>
          <p>${escapeHtml(description)} Executed with highest civil engineering standards, rigorous safety protocols, and modern pre-engineered construction methodologies.</p>
        </div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <a href="/projects/${projectType}" style="color: #0284c7; font-weight: 600; text-decoration: none;">&larr; Back to ${projectType === 'ongoing' ? 'Ongoing Projects' : 'Completed Projects'}</a>
          <a href="/contact-us" style="color: #0284c7; font-weight: 600; text-decoration: none;">Enquire About Similar Projects &rarr;</a>
        </div>
      </article>
    `;

    const fullBodyHtml = wrapWithLayout({ title, canonicalUrl, breadcrumbHtml, contentHtml });
    const outputHtml = injectPrerender(baseHtml, headBlock, fullBodyHtml);

    const projDir = path.join(distDir, 'project', projectType, slug);
    if (!fs.existsSync(projDir)) fs.mkdirSync(projDir, { recursive: true });
    fs.writeFileSync(path.join(projDir, 'index.html'), outputHtml, 'utf-8');
    projCount++;
  });
  console.log(`✅ Prerendered ${projCount} Project detail static HTML pages!`);

  // ==========================================
  // 7. PRERENDER ALL 27 INDIVIDUAL JOB DETAIL PAGES (/careers/:slug)
  // Single JobPosting schema on each detail page; verified data only
  // ==========================================
  let jobCount = 0;
  jobOpeningsData.forEach(job => {
    const slug = job.slug;
    const canonicalUrl = `${SITE_URL}/careers/${slug}`;
    const title = `${job.title} | Careers at Pislinfra`;
    const description = `${job.title} vacancy in ${job.department} department at Pragati Infra Solutions Pvt. Ltd. Location: ${job.location}. Experience: ${job.experience}. Qualification: ${job.qualification}.`;
    const datePosted = job.datePosted || '2026-08-22';
    const employmentType = job.employmentType || 'FULL_TIME';
    const jobDescription = job.description || `${job.title} opening in ${job.department} department at Pragati Infra Solutions Pvt. Ltd. (Pislinfra). Required Experience: ${job.experience}. Required Qualification: ${job.qualification}. Work Location: ${job.location}. Responsibilities include engineering execution, quality control, safety compliance, and project schedule tracking.`;

    const jobPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      'title': job.title,
      'description': jobDescription,
      'identifier': {
        '@type': 'PropertyValue',
        'name': 'Pislinfra',
        'value': `PISL-JOB-${job.id}`
      },
      'datePosted': datePosted,
      'employmentType': employmentType,
      'hiringOrganization': {
        '@type': 'Organization',
        'name': 'Pragati Infra Solutions Pvt. Ltd.',
        'sameAs': SITE_URL,
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
      'url': canonicalUrl
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Careers', 'item': `${SITE_URL}/careers` },
        { '@type': 'ListItem', 'position': 3, 'name': job.title, 'item': canonicalUrl }
      ]
    };

    const headBlock = `
    <title>${escapeHtml(title)}</title>
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${SITE_URL}/images/hero/Careers.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE_URL}/images/hero/Careers.png" />
    <script type="application/ld+json">
${JSON.stringify([jobPostingSchema, breadcrumbSchema], null, 2)}
    </script>`;

    const breadcrumbHtml = `<a href="/" style="color:#0284c7;text-decoration:none;">Home</a> &gt; <a href="/careers" style="color:#0284c7;text-decoration:none;">Careers</a> &gt; <span>${escapeHtml(job.title)}</span>`;
    const contentHtml = `
      <article>
        <header style="margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px;">
          <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">${escapeHtml(job.title)}</h1>
          <p style="font-size: 15px; color: #64748b; margin: 0;">Job Code: <strong>PISL-JOB-${job.id}</strong> | Posted: <strong>${escapeHtml(datePosted)}</strong> | Pragati Infra Solutions Pvt. Ltd.</p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
          <div><strong style="color: #64748b; font-size: 13px; text-transform: uppercase;">Department</strong><p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #0f172a;">${escapeHtml(job.department)}</p></div>
          <div><strong style="color: #64748b; font-size: 13px; text-transform: uppercase;">Experience Required</strong><p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #0f172a;">${escapeHtml(job.experience)}</p></div>
          <div><strong style="color: #64748b; font-size: 13px; text-transform: uppercase;">Qualification</strong><p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #0f172a;">${escapeHtml(job.qualification)}</p></div>
          <div><strong style="color: #64748b; font-size: 13px; text-transform: uppercase;">Location</strong><p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #0f172a;">${escapeHtml(job.location)}</p></div>
          <div><strong style="color: #64748b; font-size: 13px; text-transform: uppercase;">Employment Type</strong><p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #0284c7;">${escapeHtml(employmentType.replace('_', ' '))}</p></div>
        </div>

        <section style="margin-bottom: 32px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Role Overview & Scope</h2>
          <p style="font-size: 16px; line-height: 1.8; color: #334155; margin: 0 0 16px 0;">${escapeHtml(jobDescription)}</p>
          <ul style="color: #334155; font-size: 15px; line-height: 1.8; padding-left: 20px; margin: 0;">
            <li>Coordinate site execution, engineering quality compliance, and daily safety checks.</li>
            <li>Collaborate with cross-functional project teams, client managers, and subcontractors.</li>
            <li>Adhere to ISO 45001 safety guidelines, ISO 9001 quality audits, and schedule milestones.</li>
          </ul>
        </section>

        <section style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #1e3a8a; margin: 0 0 8px 0;">How to Apply</h3>
          <p style="font-size: 15px; color: #1e40af; margin: 0 0 16px 0;">Interested candidates matching the above qualifications are invited to send their updated resume along with position title and job code to:</p>
          <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e3a8a;">
            Email: <a href="mailto:careers@pislinfra.com?subject=Application for ${encodeURIComponent(job.title)} (PISL-JOB-${job.id})" style="color: #0284c7; text-decoration: underline;">careers@pislinfra.com</a>
          </p>
        </section>

        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <a href="/careers" style="color: #0284c7; font-weight: 600; text-decoration: none;">&larr; View All 27 Career Openings</a>
          <a href="/about/overview" style="color: #0284c7; font-weight: 600; text-decoration: none;">Learn About Life at Pislinfra &rarr;</a>
        </div>
      </article>
    `;

    const fullBodyHtml = wrapWithLayout({ title, canonicalUrl, breadcrumbHtml, contentHtml });
    const outputHtml = injectPrerender(baseHtml, headBlock, fullBodyHtml);

    const jobDir = path.join(distDir, 'careers', slug);
    if (!fs.existsSync(jobDir)) fs.mkdirSync(jobDir, { recursive: true });
    fs.writeFileSync(path.join(jobDir, 'index.html'), outputHtml, 'utf-8');
    jobCount++;
  });
  console.log(`✅ Prerendered all ${jobCount} individual Google Jobs static pages with JobPosting schema!`);

  // ==========================================
  // 8. PRERENDER CORPORATE & LISTING PAGES
  // Note: /careers listing page has NO JobPosting schema, only WebPage schema
  // ==========================================
  const allCorporateListingPages = [
    ...CORPORATE_PAGES,
    {
      pathSuffix: 'blog',
      title: 'Construction & Infrastructure Insights | Pislinfra',
      headline: 'Construction & Infrastructure Insights',
      description: "Explore Pislinfra latest insights on construction, infrastructure, engineering, project management, industry trends and innovative warehousing solutions in India.",
      keywords: 'Construction & Infrastructure Insights, infrastructure blog, construction insights, warehouse design, industrial development, logistics, project management, Pislinfra',
      canonicalUrl: `${SITE_URL}/blog`,
      image: '/images/hero/Blog.png'
    },
    {
      pathSuffix: 'projects/ongoing',
      title: 'Ongoing Projects | Pislinfra – Building India’s Future',
      headline: 'Ongoing Landmark Infrastructure & EPC Projects',
      description: 'Explore Pislinfra ongoing projects across industrial, infrastructure, warehousing and logistics sectors, delivering quality construction solutions across India.',
      keywords: 'Ongoing Construction Projects, industrial infrastructure India, warehousing construction, PEB manufacturing plants',
      canonicalUrl: `${SITE_URL}/projects/ongoing`,
      image: '/images/hero/Ongoing-Projects.png'
    },
    {
      pathSuffix: 'projects/completed',
      title: 'Completed Projects | Pislinfra – Track Record of Excellence',
      headline: 'Completed Landmark Projects & Infrastructure Portfolio',
      description: 'Explore Pislinfra completed projects portfolio across industrial, infrastructure, warehousing and logistics sectors, demonstrating 16M+ sq. ft delivered with excellence.',
      keywords: 'Completed Construction Projects, industrial warehouse delivered, EPC track record India, Pislinfra portfolio',
      canonicalUrl: `${SITE_URL}/projects/completed`,
      image: '/images/hero/Completed-Projects.png'
    },
    {
      pathSuffix: 'projects/case-study',
      title: 'Industrial & Warehousing Case Studies | Pislinfra',
      headline: 'Case Studies - Proven Engineering & Construction Delivery',
      description: 'Review Pislinfra case studies detailing challenges, engineering solutions, and landmark outcomes across Grade-A logistics parks and manufacturing plants in India.',
      keywords: 'Construction Case Studies, warehouse case studies India, Flipkart case study, Welspun logistics park case study',
      canonicalUrl: `${SITE_URL}/projects/case-study`,
      image: '/images/hero/Case-Study.png'
    }
  ];

  let corpCount = 0;
  allCorporateListingPages.forEach(pl => {
    const canonicalUrl = pl.canonicalUrl || `${SITE_URL}/${pl.pathSuffix}`;
    const headBlock = `
    <title>${escapeHtml(pl.title)}</title>
    <meta name="title" content="${escapeHtml(pl.title)}" />
    <meta name="description" content="${escapeHtml(pl.description)}" />
    <meta name="keywords" content="${escapeHtml(pl.keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pl.title)}" />
    <meta property="og:description" content="${escapeHtml(pl.description)}" />
    <meta property="og:image" content="${SITE_URL}${pl.image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pl.title)}" />
    <meta name="twitter:description" content="${escapeHtml(pl.description)}" />
    <meta name="twitter:image" content="${SITE_URL}${pl.image}" />
    <script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${canonicalUrl}#webpage`,
  'name': pl.headline || pl.title,
  'description': pl.description,
  'url': canonicalUrl
}, null, 2)}
    </script>`;

    let breadcrumbHtml = `<a href="/" style="color:#0284c7;text-decoration:none;">Home</a> &gt; <span>${escapeHtml(pl.headline || pl.title)}</span>`;
    let contentHtml = '';

    if (pl.pathSuffix === 'careers') {
      const jobsRows = jobOpeningsData.map(job => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 14px 16px; font-weight: 600; color: #0f172a;">
            <a href="/careers/${job.slug}" style="color: #0284c7; text-decoration: none;">${escapeHtml(job.title)}</a>
          </td>
          <td style="padding: 14px 16px; color: #475569;">${escapeHtml(job.department)}</td>
          <td style="padding: 14px 16px; color: #475569;">${escapeHtml(job.experience)}</td>
          <td style="padding: 14px 16px; color: #475569;">${escapeHtml(job.qualification)}</td>
          <td style="padding: 14px 16px; color: #475569;">${escapeHtml(job.location)}</td>
          <td style="padding: 14px 16px;">
            <a href="/careers/${job.slug}" style="display: inline-block; background: #0284c7; color: #ffffff; padding: 6px 14px; border-radius: 4px; font-size: 13px; font-weight: 600; text-decoration: none;">View Details</a>
          </td>
        </tr>
      `).join('');

      contentHtml = `
        <section>
          <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">Careers at Pislinfra - Current Openings</h1>
          <p style="font-size: 17px; line-height: 1.7; color: #475569; margin: 0 0 28px 0;">Join India's leading industrial and infrastructure EPC organization. We are actively hiring dynamic professionals across engineering, planning, safety, quality control, and site management.</p>
          <div style="overflow-x: auto; margin-bottom: 32px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #0f172a;">
                  <th style="padding: 14px 16px;">Designation / Title</th>
                  <th style="padding: 14px 16px;">Department</th>
                  <th style="padding: 14px 16px;">Experience</th>
                  <th style="padding: 14px 16px;">Qualification</th>
                  <th style="padding: 14px 16px;">Location</th>
                  <th style="padding: 14px 16px;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${jobsRows}
              </tbody>
            </table>
          </div>
        </section>
      `;
    } else if (pl.pathSuffix === 'company-policy') {
      contentHtml = `
        <section>
          <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">Company Policy & Corporate Governance Framework</h1>
          <p style="font-size: 17px; line-height: 1.7; color: #475569; margin: 0 0 28px 0;">Pislinfra is committed to rigorous institutional governance, ethical accountability, environmental protection, and safety compliance across all construction and infrastructure operations.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 32px;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
              <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0;">Risk Management Policy</h2>
              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 16px 0;">Institutional risk mitigation framework identifying financial, operational, safety, and supply-chain risks across industrial projects.</p>
              <a href="/reports/Risk-Management-Policy.pdf" target="_blank" rel="noopener noreferrer" style="color: #0284c7; font-weight: 600; text-decoration: none;">Download Risk Policy (PDF) &rarr;</a>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
              <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0;">Vigil Mechanism Policy</h2>
              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 16px 0;">Whistleblower and ethical escalation framework providing confidential reporting of any governance or statutory violations.</p>
              <a href="/reports/Vigil-Mechanism-Policy.pdf" target="_blank" rel="noopener noreferrer" style="color: #0284c7; font-weight: 600; text-decoration: none;">Download Vigil Policy (PDF) &rarr;</a>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
              <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0;">CSR Policy</h2>
              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 16px 0;">Strategic social impact policy directing investments into community education, local healthcare, and rural afforestation.</p>
              <a href="/reports/CSR-Policy.pdf" target="_blank" rel="noopener noreferrer" style="color: #0284c7; font-weight: 600; text-decoration: none;">Download CSR Policy (PDF) &rarr;</a>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
              <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0;">HSE & Quality Policy</h2>
              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 16px 0;">Environment, Health & Safety mandate maintaining zero-LTI construction sites and ISO 45001 / ISO 14001 compliance.</p>
              <a href="/reports/HSE-Policy.pdf" target="_blank" rel="noopener noreferrer" style="color: #0284c7; font-weight: 600; text-decoration: none;">Download HSE Policy (PDF) &rarr;</a>
            </div>
          </div>
        </section>
      `;
    } else if (pl.pathSuffix === 'contact-us') {
      contentHtml = `
        <section>
          <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">Contact Pragati Infra Solutions</h1>
          <p style="font-size: 17px; line-height: 1.7; color: #475569; margin: 0 0 28px 0;">Connect with our engineering and business development team to discuss your upcoming industrial and warehouse construction requirements across India.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 32px;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Headquarters / Corporate Office</h2>
              <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 16px 0;">31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122018</p>
              <p style="font-size: 15px; color: #0f172a; margin: 0;"><strong>Phone:</strong> <a href="tel:+918527040411" style="color: #0284c7; text-decoration: none;">+91-8527040411</a></p>
              <p style="font-size: 15px; color: #0f172a; margin: 6px 0 0 0;"><strong>Email:</strong> <a href="mailto:contact@pislinfra.com" style="color: #0284c7; text-decoration: none;">contact@pislinfra.com</a></p>
            </div>
          </div>
        </section>
      `;
    } else {
      contentHtml = `
        <section>
          <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">${escapeHtml(pl.headline || pl.title)}</h1>
          <p style="font-size: 17px; line-height: 1.7; color: #475569; margin: 0 0 24px 0;">${escapeHtml(pl.description)}</p>
          <div style="margin-top: 24px;">
            <a href="/" style="color: #0284c7; font-weight: 600; text-decoration: none;">&larr; Back to Homepage</a>
          </div>
        </section>
      `;
    }

    const fullBodyHtml = wrapWithLayout({ title: pl.title, canonicalUrl, breadcrumbHtml, contentHtml });
    const outputHtml = injectPrerender(baseHtml, headBlock, fullBodyHtml);

    const corpDir = path.join(distDir, ...pl.pathSuffix.split('/'));
    if (!fs.existsSync(corpDir)) fs.mkdirSync(corpDir, { recursive: true });
    fs.writeFileSync(path.join(corpDir, 'index.html'), outputHtml, 'utf-8');
    corpCount++;
  });
  console.log(`✅ Prerendered ${corpCount} Corporate & Listing static pages!`);

  // ==========================================
  // 9. PRERENDER HOMEPAGE (dist/index.html)
  // Clean Organization schema without invalid sponsor schema
  // Clean WebSite schema without non-existent SearchAction
  // Visible crawlable body HTML
  // ==========================================
  const homeTitle = 'Pislinfra | Industrial Infrastructure & EPC Company India';
  const homeDescription = 'Pislinfra is a leading turnkey industrial infrastructure and warehouse construction company in India, delivering 16M+ sq. ft. across 25+ locations.';
  const homeKeywords = 'industrial construction, warehouse builder, EPC contractor India, logistics park developer, PEB manufacturing, Pislinfra';
  const homeCanonical = `${SITE_URL}/`;

  const homeOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'GeneralContractor'],
    '@id': `${SITE_URL}/#organization`,
    'name': 'Pislinfra',
    'legalName': 'Pragati Infra Solutions Pvt. Ltd.',
    'url': SITE_URL,
    'logo': {
      '@type': 'ImageObject',
      'url': `${SITE_URL}/logo.png`,
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
      'telephone': PHONE_NUMBER,
      'contactType': 'customer service',
      'areaServed': 'IN',
      'availableLanguage': ['English', 'Hindi']
    },
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
    }
  };

  const homeHeadBlock = `
    <title>${escapeHtml(homeTitle)}</title>
    <meta name="title" content="${escapeHtml(homeTitle)}" />
    <meta name="description" content="${escapeHtml(homeDescription)}" />
    <meta name="keywords" content="${escapeHtml(homeKeywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${homeCanonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${homeCanonical}" />
    <meta property="og:title" content="${escapeHtml(homeTitle)}" />
    <meta property="og:description" content="${escapeHtml(homeDescription)}" />
    <meta property="og:image" content="${SITE_URL}/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(homeTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(homeDescription)}" />
    <meta name="twitter:image" content="${SITE_URL}/logo.png" />
    <script type="application/ld+json">
${JSON.stringify([homeOrganizationSchema, homeWebSiteSchema], null, 2)}
    </script>`;

  const clientLogosHtml = verifiedClients.map(c => `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; display: flex; align-items: center; justify-content: center; height: 80px;">
      <img src="${escapeHtml(c.logo)}" alt="${escapeHtml(c.name)} client logo - Pislinfra" width="120" height="48" style="max-height: 48px; max-width: 120px; object-fit: contain;" />
    </div>
  `).join('');

  const homeContentHtml = `
    <section>
      <div style="text-align: center; margin-bottom: 48px; padding: 20px 0;">
        <h1 style="font-size: 38px; font-weight: 800; color: #0f172a; line-height: 1.25; margin: 0 0 16px 0;">Pragati Infra Solutions - Industrial Infrastructure &amp; EPC Company India</h1>
        <p style="font-size: 20px; color: #475569; max-width: 900px; margin: 0 auto 24px auto; line-height: 1.6;">Delivering world-class turnkey industrial construction, high-bay warehousing, and Grade-A logistics parks across 25+ locations in India.</p>
        <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
          <a href="/solutions" style="background: #0284c7; color: #ffffff; padding: 14px 28px; border-radius: 6px; font-weight: 600; text-decoration: none;">Explore Solutions</a>
          <a href="/projects/ongoing" style="background: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 6px; font-weight: 600; text-decoration: none;">View Projects</a>
          <a href="/contact-us" style="background: #f1f5f9; color: #0f172a; padding: 14px 28px; border-radius: 6px; font-weight: 600; text-decoration: none;">Contact Us</a>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 48px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center;">
          <p style="font-size: 36px; font-weight: 800; color: #0284c7; margin: 0 0 6px 0;">16M+ Sq. Ft.</p>
          <p style="font-size: 15px; color: #64748b; margin: 0;">Infrastructure Delivered</p>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center;">
          <p style="font-size: 36px; font-weight: 800; color: #0284c7; margin: 0 0 6px 0;">17+ Years</p>
          <p style="font-size: 15px; color: #64748b; margin: 0;">Engineering Legacy</p>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center;">
          <p style="font-size: 36px; font-weight: 800; color: #0284c7; margin: 0 0 6px 0;">25+ Locations</p>
          <p style="font-size: 15px; color: #64748b; margin: 0;">Pan-India Footprint</p>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center;">
          <p style="font-size: 36px; font-weight: 800; color: #0284c7; margin: 0 0 6px 0;">15M+ Hours</p>
          <p style="font-size: 15px; color: #64748b; margin: 0;">Safe Man-Hours Achieved</p>
        </div>
      </div>

      <div style="margin-bottom: 48px;">
        <h2 style="font-size: 26px; font-weight: 700; color: #0f172a; margin: 0 0 20px 0; text-align: center;">Trusted by Industry Leaders</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px;">
          ${clientLogosHtml}
        </div>
      </div>
    </section>
  `;

  const homeFullBodyHtml = wrapWithLayout({ title: homeTitle, canonicalUrl: homeCanonical, contentHtml: homeContentHtml });
  const homeFinalHtml = injectPrerender(baseHtml, homeHeadBlock, homeFullBodyHtml);
  fs.writeFileSync(baseIndexHtmlPath, homeFinalHtml, 'utf-8');
  console.log(`✅ Prerendered Home Page dist/index.html with full Structured Data and visible crawlable body!`);
}

prerenderAllPages();
