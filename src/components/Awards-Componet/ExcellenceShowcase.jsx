import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Mousewheel, Pagination, Autoplay } from 'swiper/modules';
import clientsData from '../../data/clientsData';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// ==========================================================================
// CUSTOM SVG ICONS - No external dependencies
// ==========================================================================

const ArrowRightIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ArrowLeftIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CalendarIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DownloadIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const EyeIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CloseIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const StarIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BadgeCheckIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const ShieldCheckIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const DocumentIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const BuildingIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <line x1="8" y1="6" x2="10" y2="6" />
    <line x1="14" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="10" y2="10" />
    <line x1="14" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="10" y2="14" />
    <line x1="14" y1="14" x2="16" y2="14" />
  </svg>
);

const ClockIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const GlobeIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const TrophyIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const UsersIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LightBulbIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.5.8 2.7 1.5 3.5.75.75 1.22 1.5 1.4 2.5" />
  </svg>
);

const TrendingUpIcon = ({ size = 24, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IsoLogo = ({ color = "#1E2A5A" }) => (
  <svg viewBox="0 0 100 100" width="45" height="45">
    <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="4" />
    <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke={color} strokeWidth="2" />
    <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke={color} strokeWidth="2" />
    <path d="M5 50h90M50 5v90" stroke={color} strokeWidth="2" />
    <rect x="18" y="32" width="64" height="36" fill="white" />
    <text x="50" y="58" fontFamily="Arial, sans-serif" fontSize="30" fontWeight="900" fill={color} textAnchor="middle">ISO</text>
  </svg>
);

const CiiLogo = () => (
  <div style={{ border: '2px solid #1E2A5A', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px', width: '70px', margin: '0 auto' }}>
    <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 900, color: '#1E2A5A', fontSize: '24px', letterSpacing: '-1px' }}>CII</span>
  </div>
);

const FidicLogo = () => (
  <svg viewBox="0 0 100 100" width="45" height="45">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#1E2A5A" strokeWidth="4" />
    <path d="M10 50h80M50 10v80" stroke="#1E2A5A" strokeWidth="2" />
    <rect x="15" y="35" width="70" height="30" fill="white" />
    <text x="50" y="56" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="900" fill="#1E2A5A" textAnchor="middle">FIDIC</text>
  </svg>
);

const IgbcLogo = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50px' }}>
    <svg viewBox="0 0 50 50" width="30" height="30">
      <path d="M25 5 C10 20, 10 40, 25 45 C40 40, 40 20, 25 5 Z" fill="#4ADE80" stroke="#3B82F6" strokeWidth="2" />
      <path d="M25 5 v40" stroke="#3B82F6" strokeWidth="2" />
    </svg>
    <span style={{ fontWeight: 900, fontSize: '11px', color: '#111827', marginTop: '2px' }}>IGBC</span>
  </div>
);

const NsicLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px' }}>
    <span style={{ fontFamily: 'Arial, sans-serif', fontStyle: 'italic', fontWeight: 900, color: '#1E3A8A', fontSize: '28px', letterSpacing: '-1px' }}>NSIC</span>
  </div>
);

const MsmeLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '50px' }}>
    <span style={{ fontSize: '24px' }}>🏛️</span>
    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
      <span style={{ fontWeight: 900, color: '#1E2A5A', fontSize: '15px', letterSpacing: '0.5px', lineHeight: 1 }}>MSME</span>
      <span style={{ fontSize: '7px', color: '#1E2A5A', fontWeight: 700 }}>MINISTRY OF MICRO, SMALL & MEDIUM ENTERPRISES</span>
    </div>
  </div>
);

/**
 * ExcellenceShowcase - Premium Enterprise Awards & Certificates Gallery
 * Pislinfrastructure Company
 */
const ExcellenceShowcase = ({ 
  awards = [], 
  allAwards = [],
  milestones = [],
  certificates = [],
  clientAppreciations = [], 
  selectedYear = 'All',
  onYearChange,
  years = ['All', 2026, 2025, 2024, 2023, 2022, 2021],
  onViewAward,
  onViewCertificate
}) => {
  const getClientLogo = (companyName) => {
    // Quick custom mappings if needed
    if (companyName.includes('AM/NS')) {
       return clientsData.find(c => c.name.includes('AM/NS'))?.logo;
    }
    const client = clientsData.find(c => c.name.toLowerCase().includes(companyName.toLowerCase()));
    return client ? client.logo : null;
  };
  const awardsSectionRef = useRef(null);
  const certificatesSectionRef = useRef(null);
  const bottomGridRef = useRef(null);

  const [hoveredAward, setHoveredAward] = useState(null);
  const [hoveredCertificate, setHoveredCertificate] = useState(null);
  const [hoveredGridItem, setHoveredGridItem] = useState(null);

  // Dynamic Timeline Milestones synchronized with Strapi (Cloudinary & Neon DB) & allAwards
  const dynamicTimelineMilestones = useMemo(() => {
    const baseline = [
      {
        year: '2018',
        tag: 'Foundation',
        title: 'Establishment of Pragati Infra Solutions',
        desc: 'Founded with a definitive vision to transform Indian industrial, warehousing, and EPC infrastructure through precision engineering, cutting-edge PEB structures, and ethical governance.',
        statsSuffix: '1st Mega Logistics Park',
        highlights: ['Incorporation of PISL', 'First logistics park execution in NCR', 'Core engineering leadership assembled'],
        icon: <BuildingIcon size={24} color="#FFFFFF" />,
        image: '/images/about/mission.jpg',
        color: '#1E2A5A'
      },
      {
        year: '2019',
        tag: 'Rapid Scale',
        title: 'Expansion Across Northern Industrial Corridor',
        desc: 'Scaled operations across Haryana and NCR, delivering grade-A pre-engineered buildings and heavy industrial structures on record-breaking accelerated timelines.',
        statsSuffix: '500,000+ Sq. Ft. Delivered',
        highlights: ['Multi-acre warehousing parks', 'Grade-A industrial floorings', 'Long-term client partnerships initiated'],
        icon: <StarIcon size={24} color="#FFFFFF" />,
        image: '/images/projects/completed/pragati-one.jpg',
        color: '#F37346'
      },
      {
        year: '2020',
        tag: 'Resilience',
        title: 'Operational Resilience & Zero-Harm Safety',
        desc: 'Maintained strict zero-harm protocols and uninterrupted project execution during nationwide disruptions, solidifying trust with premier industrial conglomerates.',
        statsSuffix: '100% On-Time Delivery',
        highlights: ['Zero-incident safety execution', 'Digital project monitoring deployed', 'Rapid supply chain adaptation'],
        icon: <UsersIcon size={24} color="#FFFFFF" />,
        image: '/images/about/vision.jpg',
        color: '#1E2A5A'
      },
      {
        year: '2021',
        tag: 'Digital QA',
        title: 'Next-Gen Engineering & QA/QC Digitization',
        desc: 'Pioneered robotic total station surveys, automated scheduling, and advanced laser screed floorings across high-speed industrial developments.',
        statsSuffix: '1.2 Million Sq. Ft. Executed',
        highlights: ['Laser-screed flooring standard', 'Advanced PEB design modeling', 'Pan-India vendor network established'],
        icon: <ShieldCheckIcon size={24} color="#FFFFFF" />,
        image: '/images/projects/completed/pragati-two.jpg',
        color: '#F37346'
      },
      {
        year: '2022',
        tag: 'Prestige Award',
        title: 'The Economic Times Real Estate Conclave Winner',
        desc: 'Won Winner trophy at The Economic Times Real Estate Conclave & Awards 2022 (North) for Pragati One Logistics Park benchmark development.',
        statsSuffix: 'Winner ET Real Estate North',
        highlights: ['ET Real Estate Winner Award', 'Industrial & warehousing benchmark', 'Major corporate client acquisitions'],
        icon: <TrophyIcon size={24} color="#FFFFFF" />,
        image: '/images/about/excellence.jpg',
        color: '#F37346'
      },
      {
        year: '2023',
        tag: 'EPC Scale',
        title: 'Heavy Industrial EPC & Multi-State Expansion',
        desc: 'Secured landmark turnkey EPC contracts across Mundra, Gujarat, and Rajasthan, executing complex heavy petrochemical and industrial facilities.',
        statsSuffix: '2.5 Million Sq. Ft. Warehousing',
        highlights: ['Mundra industrial corridor expansion', 'Petrochemical & heavy infra EPC', 'LTI-free safety compliance'],
        icon: <TrendingUpIcon size={24} color="#FFFFFF" />,
        image: '/images/about/history.jpg',
        color: '#1E2A5A'
      },
      {
        year: '2024',
        tag: 'LEED Gold & Safety',
        title: 'LEED Gold Certification & Entrepreneur of Year',
        desc: 'Awarded US LEED Gold for Pragati One, Best Safety Conscious Contractor by Adani Petrochemicals, and Entrepreneur of the Year by IAF.',
        statsSuffix: 'USGBC LEED Gold Rated Warehouse',
        highlights: ['First non-captive LEED Gold warehouse', 'Adani Green PVC safety recognition', 'IAF Entrepreneur of the Year award'],
        icon: <BadgeCheckIcon size={24} color="#FFFFFF" />,
        image: '/images/about/journey.jpg',
        color: '#F37346'
      },
      {
        year: '2025',
        tag: '3.5M Safe Hours',
        title: 'Safety Excellence Award - Adani KCL Mundra',
        desc: 'Received prestigious Safety Excellence Award for 3.5 million continuous LTI-free safe man-hours on the landmark KCL Project at Mundra.',
        statsSuffix: '3.5 Million LTI-Free Safe Hours',
        highlights: ['Adani KCL Safety Excellence Award', 'Zero reportable incidents', '3.5M continuous safe man-hours'],
        icon: <ShieldCheckIcon size={24} color="#FFFFFF" />,
        image: '/images/projects/completed/pragati-three.jpg',
        color: '#1E2A5A'
      },
      {
        year: '2026',
        tag: 'Net-Zero Future',
        title: 'Next-Generation Sustainable Infrastructure',
        desc: 'Leading India towards carbon-neutral smart warehousing, solar-integrated industrial parks, and Net-Zero Ready certified EPC infrastructure.',
        statsSuffix: 'Net-Zero Ready & LEED Certified',
        highlights: ['Solar-integrated logistics parks', 'Smart automated green warehousing', 'Target 5M+ Sq. Ft. carbon-neutral infra'],
        icon: <GlobeIcon size={24} color="#FFFFFF" />,
        image: '/images/about/sustainable-infra-gold.jpg',
        color: '#F37346'
      }
    ];

    const sourceAwards = (allAwards && allAwards.length > 0) ? allAwards : awards;

    // Collect all distinct years from baseline, strapi milestones, and sourceAwards (including new years like 2027+)
    const strapiMilestoneYears = (milestones || []).map(m => String(m.year || '').trim()).filter(Boolean);
    const awardYears = [...new Set(sourceAwards.map(a => String(a.year || '').trim()).filter(Boolean))];
    const baselineYears = baseline.map(b => b.year);
    const allDistinctYears = [...new Set([...baselineYears, ...strapiMilestoneYears, ...awardYears])].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    return allDistinctYears.map((yearStr, idx) => {
      const yearAwards = sourceAwards.filter(a => String(a.year || '').trim() === yearStr);
      const strapiMilestone = (milestones || []).find(m => String(m.year || '').trim() === yearStr);
      const matchedBase = baseline.find(b => b.year === yearStr);
      const totalCount = yearAwards.length > 0 ? yearAwards.length : (strapiMilestone ? 1 : (matchedBase ? 1 : 1));
      
      // Prioritize Strapi Milestone cover image, title & description
      const topAward = yearAwards[0];
      const image = (strapiMilestone && strapiMilestone.image) || 
                    (topAward && (topAward.image || topAward.clientImage)) || 
                    (matchedBase && matchedBase.image) || 
                    '/images/about/sustainable-infra-gold.jpg';

      const title = (strapiMilestone && strapiMilestone.title) || 
                    (topAward && topAward.title) || 
                    (matchedBase && matchedBase.title) || 
                    `Infrastructure Milestones of ${yearStr}`;

      const desc = (strapiMilestone && strapiMilestone.desc) || 
                   (topAward && (topAward.desc || topAward.description)) || 
                   (matchedBase && matchedBase.desc) || 
                   `Key infrastructure excellence, safety landmarks, and quality benchmarks delivered in ${yearStr}.`;

      const tag = (strapiMilestone && strapiMilestone.tag) || 
                  (topAward && (topAward.category || topAward.tag)) || 
                  (matchedBase && matchedBase.tag) || 
                  'Milestone';

      const stats = (strapiMilestone && strapiMilestone.stats) || 
                    `Total ${totalCount} Award${totalCount > 1 ? 's' : ''} | ${matchedBase?.statsSuffix || 'Landmark EPC Delivery'}`;

      const highlights = (strapiMilestone && strapiMilestone.highlights && strapiMilestone.highlights.length > 0) ? 
                         strapiMilestone.highlights : 
                         (matchedBase?.highlights || [
                           `Recognized in ${yearStr}`,
                           `Total ${totalCount} Major Award${totalCount > 1 ? 's' : ''}`,
                           'High-speed quality infrastructure delivery'
                         ]);

      return {
        id: idx + 1,
        year: yearStr,
        tag,
        awardsCount: `${totalCount} Award${totalCount > 1 ? 's' : ''} Won`,
        title,
        desc,
        stats,
        highlights,
        icon: idx % 2 === 0 ? <TrophyIcon size={24} color="#FFFFFF" /> : <ShieldCheckIcon size={24} color="#FFFFFF" />,
        image,
        color: idx % 2 === 0 ? '#1E2A5A' : '#F37346'
      };
    });
  }, [allAwards, awards, milestones]);

  // Partition dynamic milestones into rows of 3
  const milestoneRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < dynamicTimelineMilestones.length; i += 3) {
      rows.push(dynamicTimelineMilestones.slice(i, i + 3));
    }
    return rows;
  }, [dynamicTimelineMilestones]);

  const defaultAwards = [
    { id: 1, name: 'Best Infrastructure Company', year: 2025, category: 'Excellence', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop', description: 'Recognized for outstanding contribution to infrastructure development and project execution.', certificate: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', gallery: [] },
    { id: 2, name: 'Innovation in Construction', year: 2024, category: 'Innovation', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop', description: 'Pioneering innovative construction methodologies.', certificate: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', gallery: [] },
    { id: 3, name: 'Safety Excellence Award', year: 2024, category: 'Safety', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop', description: 'Zero-incident safety record across all project sites.', certificate: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', gallery: [] },
    { id: 4, name: 'Quality Management Award', year: 2023, category: 'Quality', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop', description: 'ISO-certified quality management systems.', certificate: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', gallery: [] },
    { id: 5, name: 'Green Building Leadership', year: 2023, category: 'Sustainability', image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop', description: 'Leadership in sustainable infrastructure.', certificate: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', gallery: [] },
    { id: 6, name: 'Project Management Excellence', year: 2022, category: 'Management', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop', description: 'Excellence in large-scale project management.', certificate: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', gallery: [] },
  ];

  const defaultCertificates = [
    { id: 1, name: 'ISO 9001:2015', issuer: 'Bureau of Indian Standards', issueDate: '2025', expiryDate: '2028', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', description: 'Quality Management Systems certification for infrastructure development.', supportingFiles: [] },
    { id: 2, name: 'ISO 14001:2015', issuer: 'International Certification Body', issueDate: '2024', expiryDate: '2027', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', description: 'Environmental Management Systems certification.', supportingFiles: [] },
    { id: 3, name: 'OHSAS 18001', issuer: 'Safety Certification Authority', issueDate: '2024', expiryDate: '2027', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', description: 'Occupational Health and Safety Management.', supportingFiles: [] },
    { id: 4, name: 'LEED Platinum', issuer: 'Green Building Council', issueDate: '2023', expiryDate: '2026', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', description: 'Leadership in Energy and Environmental Design.', supportingFiles: [] },
    { id: 5, name: 'ISO 45001:2018', issuer: 'International Safety Org', issueDate: '2023', expiryDate: '2026', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', description: 'Occupational health and safety management.', supportingFiles: [] },
  ];

  // Bottom grid items data (Recognitions & Certifications)
  const recognitionsData = [
    { id: 1, logo: <CiiLogo />, title: 'Confederation of\nIndian Industry' },
    { id: 2, logo: <FidicLogo />, title: 'International Federation\nof Consulting Engineers' },
    { id: 3, logo: <IgbcLogo />, title: 'Indian Green\nBuilding Council' },
    { id: 4, logo: <NsicLogo />, title: 'ISO 9001 : 2008' },
    { id: 5, logo: <MsmeLogo />, title: 'Ministry of MSME\nGovt. of India' },
  ];

  const certificationsLogosData = [
    { id: 6, logo: <IsoLogo color="#2563EB" />, title: 'ISO 9001:2015\nQuality Management System' },
    { id: 7, logo: <IsoLogo color="#16A34A" />, title: 'ISO 14001:2015\nEnvironmental Management System' },
    { id: 8, logo: <IsoLogo color="#DC2626" />, title: 'ISO 45001:2018\nOccupational Health &\nSafety Management' },
    { id: 9, logo: <IsoLogo color="#1E3A8A" />, title: 'ISO 27001:2013\nInformation Security\nManagement' },
    { id: 10, logo: <IsoLogo color="#1E3A8A" />, title: 'ISO 37001:2016\nAnti-Bribery\nManagement System' },
  ];
  
  const allBottomCards = [...recognitionsData, ...certificationsLogosData];

  const awardsData = awards;
  const certificatesData = certificates;

  const handleAwardClick = useCallback((award) => {
    if (onViewAward) onViewAward(award);
  }, [onViewAward]);

  const handleCertificateClick = useCallback((cert) => {
    if (onViewCertificate) onViewCertificate(cert);
  }, [onViewCertificate]);

  // Styles
  const s = {
    mainContainer: { background: '#FFFFFF', padding: '0', position: 'relative', overflow: 'hidden' },
    bgPattern: { position: 'absolute', top: 0, right: 0, width: '60%', height: '100%', background: 'radial-gradient(ellipse at 80% 20%, rgba(42,42,117,0.015) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(243,115,70,0.01) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 0 },
    contentWrapper: { maxWidth: '1400px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 },
    awardsSection: { marginBottom: '0' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', gap: '32px', flexWrap: 'wrap' },
    headerLeft: { flex: 1, minWidth: '300px' },
    headerLabel: { display: 'inline-block', fontSize: '13px', fontWeight: 600, color: '#F37346', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '12px', fontFamily: "'Inter', sans-serif" },
    headerTitle: { fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 700, color: '#2A2A75', margin: '0 0 16px 0', letterSpacing: '-0.5px', lineHeight: 1.15, fontFamily: "'Inter', sans-serif" },
    headerDesc: { fontSize: '16px', color: '#6B7280', lineHeight: 1.7, margin: 0, maxWidth: '520px', fontFamily: "'Inter', sans-serif" },
    viewAllBtn: { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: 'transparent', color: '#2A2A75', border: '2px solid rgba(42,42,117,0.15)', borderRadius: '14px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.3s ease' },
    sliderContainer: { position: 'relative', margin: '0 -8px' },
    awardCard: (h) => ({ background: '#FFFFFF', borderRadius: '6px', border: h ? '2px solid rgba(243,115,70,0.3)' : '1px solid #F3F4F6', boxShadow: h ? '0 20px 40px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden', height: '240px', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.4s ease', transform: h ? 'translateY(-10px) scale(1.03)' : 'translateY(0) scale(1)' }),
    awardImageArea: { height: '100px', background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    awardImage: { width: '100%', height: '100%', objectFit: 'cover' },
    awardContent: { padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    awardName: { fontSize: '17px', fontWeight: 700, color: '#2A2A75', margin: '0 0 16px 0', lineHeight: 1.4, fontFamily: "'Inter', sans-serif" },
    badgesContainer: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    yearBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#F37346', color: '#FFFFFF', borderRadius: '50px', fontSize: '13px', fontWeight: 600, fontFamily: "'Inter', sans-serif" },
    categoryBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 14px', background: 'rgba(42,42,117,0.05)', color: '#2A2A75', borderRadius: '50px', fontSize: '12px', fontWeight: 600, fontFamily: "'Inter', sans-serif" },
    navBtn: (dir) => ({ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [dir === 'prev' ? 'left' : 'right']: '-20px', width: '52px', height: '52px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #F3F4F6', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: '#2A2A75' }),
    shelfWall: { background: 'linear-gradient(180deg, #FAFBFC 0%, #F5F6F8 100%)', borderRadius: '32px', padding: '16px 20px', position: 'relative', border: '1px solid #F3F4F6' },
    shelfLine: { position: 'absolute', bottom: '40px', left: '40px', right: '40px', height: '6px', background: 'linear-gradient(180deg, #E5E7EB 0%, #D1D5DB 100%)', borderRadius: '3px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' },
    certCard: (h) => ({ background: '#FFFFFF', borderRadius: '4px', border: '3px solid #374151', boxShadow: h ? '0 20px 40px rgba(0,0,0,0.12)' : '0 8px 24px rgba(0,0,0,0.06)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.5s ease', transform: h ? 'translateY(-12px) scale(1.04)' : 'translateY(0) scale(1)' }),
    matBorder: { margin: '8px', padding: '12px', background: '#FFFFFF', border: '2px solid #F3F4F6', borderRadius: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    certPreview: { width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '60px', borderRadius: '2px', overflow: 'hidden' },
    certInfo: { textAlign: 'center', width: '100%' },
    certName: { fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0', fontFamily: "'Inter', sans-serif" },
    certIssuer: { fontSize: '12px', fontWeight: 500, color: '#6B7280', margin: '0 0 4px 0', fontFamily: "'Inter', sans-serif" },
    certDate: { fontSize: '11px', fontWeight: 500, color: '#9CA3AF', fontFamily: "'Inter', sans-serif" },
    bottomGridSection: { marginTop: '20px', paddingBottom: '20px' },
    // Popup styles
    popupOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    popupCard: { background: '#FFFFFF', borderRadius: '8px', maxWidth: '650px', width: '100%', maxHeight: '85vh', overflow: 'auto', padding: '40px', position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.2)' },
    popupClose: { position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderRadius: '4px', border: 'none', background: '#F3F4F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563' },
    popupImage: { width: '100%', height: '300px', objectFit: 'cover', background: '#F9FAFB', borderRadius: '6px', marginBottom: '24px' },
    popupTitle: { fontSize: '28px', fontWeight: 700, color: '#2A2A75', marginBottom: '16px', fontFamily: "'Inter', sans-serif" },
    popupDesc: { fontSize: '15px', color: '#4B5563', lineHeight: 1.8, marginBottom: '24px', fontFamily: "'Inter', sans-serif" },
    popupDetails: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
    popupDetailItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', fontFamily: "'Inter', sans-serif" },
    popupBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: '#2A2A75', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
  };

  // Safety and Client Awards data injected based on user request
  const safetyAwardsData = [
    { 
      id: 1, company: 'Adani', 
      title: 'Best Safety Conscious Contractor Award', 
      desc: 'Recognized at MPL-Green PVC Projects, Mundra for outstanding safety performance and continuous commitment towards workplace safety excellence.', 
      year: '2025', category: 'Safety Excellence', location: 'Mundra, Gujarat', 
      icon: ShieldCheckIcon, 
      images: ['/images/awards/adani-Mundra-Petrochem-limmited-Jan-25.png', '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project.png'] 
    },
    { 
      id: 2, company: 'Reliance Industries Limited', 
      title: '2 Million LTI-Free Safe Manhours Achievement', 
      desc: 'Reliance Jamnagar project achieved 2 million LTI-free safe manhours through exceptional HSE practices and dedicated teamwork.', 
      year: '2024', category: 'HSE Excellence', location: 'Jamnagar, Gujarat', 
      icon: TrophyIcon, 
      images: ['/images/awards/Reliance-Jamnagar-HSE.png', '/images/awards/Reliance-Jamnagar-HSE-(2).png'] 
    },
    { 
      id: 3, company: 'Adani', 
      title: '2 Million Safe Man-Hours Award', 
      desc: 'Adani MPL site successfully achieved 2 million safe man-hours, reflecting strong safety culture and zero-harm commitment.', 
      year: '2024', category: 'Safety Milestone', location: 'Mundra, Gujarat', 
      icon: BadgeCheckIcon, 
      images: ['/images/awards/Safety-Excellence-Awards-Adani.png', '/images/awards/Safety-Excellence-Awards-Adani-(2).png', '/images/awards/Mundra-Petrochem-Adani.png'] 
    },
    { 
      id: 4, company: 'Flipkart', 
      title: 'Flipkart Safety Excellence Appreciation', 
      desc: 'PISL Patli Project received appreciation from Flipkart for achieving 1.5 million safe man-hours without any LTI incident.', 
      year: '2024', category: 'Safety Appreciation', location: 'Patli, Haryana', 
      icon: StarIcon, 
      images: ['/images/awards/NCR-Patli.png'] 
    },
    { 
      id: 5, company: 'Adani', 
      title: '1 Million Safe Hours Milestone', 
      desc: 'Mundra Team successfully crossed 1 million safe working hours with consistent dedication towards safety and operational discipline.', 
      year: '2024', category: 'Safety Milestone', location: 'Mundra, Gujarat', 
      icon: TrophyIcon, 
      images: ['/images/awards/adani-Mundra-Petrochem-limmited-july2025.png', '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project-(2).png'] 
    },
    { 
      id: 6, company: 'Adani', 
      title: 'Best Safety Conscious Contractor Recognition', 
      desc: 'Awarded again at MPL-Green PVC Projects for maintaining exceptional HSE standards and safe execution practices.', 
      year: '2025', category: 'Safety Excellence', location: 'Mundra, Gujarat', 
      icon: ShieldCheckIcon, 
      images: ['/images/awards/Safety-Excellence-Awards-Adani-(3).png', '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project-(2).png'] 
    },
    { 
      id: 7, company: 'Prologis',
      title: 'National Safety Week Appreciation', 
      desc: 'PISL PRR Jhamuwas project team was appreciated by the client during the National Safety Week closing ceremony for outstanding safety participation.', 
      year: '2024', category: 'Safety Week', location: 'Jhamuwas, Haryana', 
      icon: StarIcon, 
      images: ['/images/awards/Celebrated-National-Safety-PRR-Jhamuwas.png', '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(2).png'] 
    },
    { 
      id: 8, company: 'GAR',
      title: 'Blood Donation Camp Initiative', 
      desc: 'Successfully conducted a Blood Donation Camp during the 54th National Safety Week Celebration at PRAGATI Mappedu Chennai Project.', 
      year: '2024', category: 'CSR Initiative', location: 'Chennai, Tamil Nadu', 
      icon: UsersIcon, 
      images: ['/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(4).png'] 
    },
    { 
      id: 9, company: 'Prologis',
      title: 'Early Morning Safety Walk', 
      desc: 'Conducted an early morning safety walk at PRR Jhamuwas Site to strengthen awareness and proactive safety culture.', 
      year: '2024', category: 'Safety Initiative', location: 'Jhamuwas, Haryana', 
      icon: GlobeIcon, 
      images: ['/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(5).png', '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(6).png'] 
    },
    { 
      id: 10, company: 'AM/NS India',
      title: 'Safety Skid Awareness Program', 
      desc: 'Organized Safety Skid activity at CRM 02, AMNS Surat to promote hazard awareness and workplace safety engagement.', 
      year: '2024', category: 'Safety Training', location: 'Surat, Gujarat', 
      icon: ShieldCheckIcon, 
      images: ['/images/awards/Safety-Excellence-Awards-Adani-(2).png'] 
    },
  ];

  return (
    <div style={s.mainContainer}>
      <div style={s.bgPattern} />
      <div style={s.contentWrapper} className="responsive-wrapper">
        
        {/* AWARDS SECTION */}
        <section ref={awardsSectionRef} style={s.awardsSection}>
          {/* 1. Header with Left Title and Right Year Filter Pills */}
          <div className="legacy-awards-header">
            {/* Left Side: Title & Eyebrow */}
            <div className="legacy-title-col">
              <span className="legacy-eyebrow">
                OUR PRESTIGIOUS AWARDS
              </span>
              <h2 className="legacy-heading">
                A Legacy of Excellence
              </h2>
            </div>

            {/* Right Side: Year Filter Pills (All, 2026, 2025, 2024 ... 2018) */}
            <div className="awards-year-filter-row">
              {years.map((year) => {
                const isSelected = selectedYear === year;
                return (
                  <button
                    key={year}
                    onClick={() => onYearChange && onYearChange(year)}
                    className={`year-filter-pill ${isSelected ? 'active' : ''}`}
                    type="button"
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="responsive-slider-wrapper">
            {awardsData.length === 0 ? (
              <div className="awards-empty-box">
                <p>
                  No awards found for {selectedYear === 'All' ? 'the selected filter' : selectedYear}.
                </p>
              </div>
            ) : (
              <Swiper
                key={`swiper-showcase-${selectedYear}-${awardsData.length}`}
                modules={[Navigation, FreeMode, Mousewheel, Autoplay]}
                autoplay={awardsData.length > 4 ? { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                loop={awardsData.length > 4}
                spaceBetween={24}
                slidesPerView={1.2}
                freeMode={false}
                grabCursor={true}
                navigation={{ prevEl: '.awards-prev', nextEl: '.awards-next' }}
                breakpoints={{ 
                  0: { slidesPerView: 1.12, spaceBetween: 14 },
                  480: { slidesPerView: 1.35, spaceBetween: 16 },
                  640: { slidesPerView: 2, spaceBetween: 20 }, 
                  1024: { slidesPerView: 3, spaceBetween: 24 }, 
                  1280: { slidesPerView: 4, spaceBetween: 24 }
                }}
                style={{ padding: '8px 2px 20px 2px' }}
              >
                {awardsData.map((award, awardIdx) => (
                <SwiperSlide key={`award-${award.id || 'award'}-${awardIdx}`}>
                  <div
                    className="award-showcase-card"
                    onClick={() => handleAwardClick(award)}
                  >
                    {/* 1. IMAGE AT TOP (Full Cover Fit inside box) */}
                    <div className="award-card-img-wrap">
                      <img 
                        src={award.image} 
                        alt={`${award.name || award.title || 'Pislinfra Award'} - ${award.category || 'Excellence'} Recognition ${award.year || ''} | Pislinfra Infrastructure Excellence`} 
                        title={`${award.name || award.title || 'Award'} (${award.year || ''}) - Pislinfra`}
                        className="award-card-img"
                        loading="lazy"
                        decoding="async"
                        itemProp="image"
                        onError={(e) => {
                          if (!e.target.src.endsWith('/images/awards/certificate.jpg')) {
                            e.target.src = '/images/awards/certificate.jpg';
                          }
                        }}
                      />
                      {award.category && (
                        <div 
                          title={award.category}
                          className="award-card-category-badge"
                        >
                          {award.category}
                        </div>
                      )}
                    </div>

                    {/* 2. TITLE IN MIDDLE */}
                    <div className="award-card-title-wrap">
                      <h3 className="award-card-title-text">
                        {award.name}
                      </h3>
                    </div>

                    {/* 3. YEAR & ACTION AT BOTTOM */}
                    <div className="award-card-footer">
                      <div className="award-card-year">
                        <CalendarIcon size={15} color="#F37346" />
                        <span>
                          {award.year}
                        </span>
                      </div>

                      <div className="award-card-action">
                        <span>View Details</span>
                        <ArrowRightIcon size={13} color={hoveredAward === award.id ? '#F37346' : '#1E2A5A'} />
                      </div>
                    </div>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            )}
            {awardsData.length > 0 && (
              <>
                <button className="awards-prev" aria-label="Previous Award">
                  <ArrowLeftIcon size={18} />
                </button>
                <button className="awards-next" aria-label="Next Award">
                  <ArrowRightIcon size={18} />
                </button>
              </>
            )}
          </div>
        </section>

        {/* TIMELINE SECTION (Clean Alternating Center-Spine Corporate Roadmap) */}
        <section ref={certificatesSectionRef} className="journey-timeline-section">
          <div className="journey-header">
            <span className="journey-eyebrow">
              OUR JOURNEY OF EXCELLENCE
            </span>
            <h2 className="journey-heading">
              Milestones of Growth, Safety & Innovation
            </h2>
          </div>

          {/* WINDING SNAKE ROADMAP CONTAINER (DESKTOP) */}
          <div className="desktop-timeline" style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '20px 10px' }}>
            {milestoneRows.map((rowItems, rowIdx) => {
              const isReverse = rowIdx % 2 === 1;
              const hasNextRow = rowIdx < milestoneRows.length - 1;
              const itemsToRender = isReverse ? rowItems.slice().reverse() : rowItems;
              const isLastOverall = rowIdx === milestoneRows.length - 1;

              return (
                <div 
                  key={rowIdx} 
                  style={{ 
                    position: 'relative', 
                    marginBottom: hasNextRow ? '60px' : '0px' 
                  }}
                >
                  {/* Horizontal Connecting Highway Line */}
                  <div 
                    className="roadmap-h-line"
                    style={{
                      position: 'absolute',
                      top: '26px',
                      left: '12%',
                      right: '12%',
                      height: '3px',
                      background: isReverse 
                        ? 'linear-gradient(270deg, #F37346 0%, #1E2A5A 100%)' 
                        : 'linear-gradient(90deg, #1E2A5A 0%, #F37346 100%)',
                      zIndex: 0
                    }}
                  />

                  {/* U-Turn Curves (Connecting current row to the next row) */}
                  {hasNextRow && !isReverse && (
                    <div 
                      className="roadmap-u-turn-right"
                      style={{
                        position: 'absolute',
                        top: '26px',
                        right: '-28px',
                        width: '60px',
                        height: 'calc(100% + 60px)',
                        borderTop: '3px solid #F37346',
                        borderRight: '3px solid #F37346',
                        borderBottom: '3px solid #F37346',
                        borderTopRightRadius: '36px',
                        borderBottomRightRadius: '36px',
                        zIndex: 0
                      }}
                    />
                  )}

                  {hasNextRow && isReverse && (
                    <div 
                      className="roadmap-u-turn-left"
                      style={{
                        position: 'absolute',
                        top: '26px',
                        left: '-28px',
                        width: '60px',
                        height: 'calc(100% + 60px)',
                        borderTop: '3px solid #1E2A5A',
                        borderLeft: '3px solid #1E2A5A',
                        borderBottom: '3px solid #1E2A5A',
                        borderTopLeftRadius: '36px',
                        borderBottomLeftRadius: '36px',
                        zIndex: 0
                      }}
                    />
                  )}

                  {/* 3-Column Roadmap Grid */}
                  <div className="roadmap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', position: 'relative', zIndex: 1 }}>
                    {itemsToRender.map((item, colIdx) => {
                      const isLastItemInRow = colIdx === itemsToRender.length - 1;
                      const isFinalMilestone = isLastOverall && isLastItemInRow;

                      return (
                        <div
                          key={item.id || item.year}
                          className="roadmap-milestone-card"
                        >
                          {/* Premium Year Banner with Custom R2 Background Image & Ultra Sharp Large Golden Text */}
                          <div style={{ 
                            height: '130px', 
                            width: '100%', 
                            borderRadius: '14px', 
                            overflow: 'hidden', 
                            position: 'relative', 
                            marginBottom: '14px',
                            backgroundImage: "url('https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/years_2e23ba7341.avif')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            border: '1.5px solid rgba(243, 115, 70, 0.35)',
                            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.12)'
                          }}>
                            {/* Crisp Dark Gradient Overlay for Maximum Contrast & Zero Blur */}
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.88) 100%)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              padding: '12px 14px'
                            }}>
                              {/* Top Row: Year Node & Milestone Tag */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: isReverse ? '#F37346' : '#1E2A5A',
                                  border: '1px solid rgba(255, 255, 255, 0.3)',
                                  color: '#FFFFFF',
                                  padding: '4px 12px',
                                  borderRadius: '100px',
                                  fontSize: '13px',
                                  fontWeight: 800,
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                                  WebkitFontSmoothing: 'antialiased'
                                }}>
                                  {isReverse && colIdx > 0 && <span>⬅</span>}
                                  <span>{item.year}</span>
                                  {!isReverse && !isFinalMilestone && colIdx < 2 && <span style={{ color: '#FFD700' }}>➔</span>}
                                  {isFinalMilestone && <span>🏁</span>}
                                </div>

                                <span 
                                  title={item.tag}
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    color: '#FFD700',
                                    letterSpacing: '0.8px',
                                    background: 'rgba(15, 23, 42, 0.75)',
                                    padding: '3px 10px',
                                    borderRadius: '100px',
                                    border: '1px solid rgba(255, 215, 0, 0.4)',
                                    WebkitFontSmoothing: 'antialiased',
                                    maxWidth: '115px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'inline-block',
                                    verticalAlign: 'middle'
                                  }}
                                >
                                  {item.tag}
                                </span>
                              </div>

                              {/* Center / Middle: Crystal Sharp Extra Large Golden Total Awards Count */}
                              <div style={{ textAlign: 'center', margin: 'auto 0 6px 0' }}>
                                <div style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '10px',
                                  color: '#FFD700',
                                  fontSize: '26px',
                                  fontWeight: 900,
                                  fontFamily: "'Inter', sans-serif",
                                  textShadow: '0 2px 5px rgba(0, 0, 0, 0.95), 0 1px 2px rgba(0, 0, 0, 0.85)',
                                  letterSpacing: '0.4px',
                                  WebkitFontSmoothing: 'antialiased',
                                  MozOsxFontSmoothing: 'grayscale',
                                  textRendering: 'optimizeLegibility'
                                }}>
                                  <TrophyIcon size={26} color="#FFD700" />
                                  <span style={{ color: '#FFD700', fontWeight: 900 }}>
                                    {item.awardsCount}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E2A5A', margin: '0 0 4px 0', lineHeight: 1.3 }}>
                            {item.title}
                          </h4>
                          <p style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.45, margin: '0 0 10px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.desc}
                          </p>
                          
                          <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <TrophyIcon size={12} color="#F37346" />
                            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#1E2A5A' }}>{item.stats}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CONNECTED VERTICAL TIMELINE (MOBILE & TABLET) */}
          <div className="mobile-timeline">
            <div className="mobile-timeline-track">
              {dynamicTimelineMilestones.map((item, idx) => {
                const isLast = idx === dynamicTimelineMilestones.length - 1;

                return (
                  <div key={item.id || item.year} className="mobile-timeline-item">
                    {/* Spine Node */}
                    <div className="mobile-timeline-node-wrap">
                      <div className="mobile-timeline-node">
                        <span className="mobile-node-dot" />
                      </div>
                      {!isLast && <div className="mobile-timeline-line" />}
                    </div>

                    {/* Milestone Card */}
                    <div className="mobile-milestone-card">
                      {/* Top Header Banner */}
                      <div className="mobile-milestone-banner">
                        <div className="mobile-milestone-banner-overlay">
                          <div className="mobile-milestone-top-row">
                            <span className="mobile-milestone-year-badge">
                              {item.year}
                            </span>
                            <span className="mobile-milestone-tag" title={item.tag}>
                              {item.tag}
                            </span>
                          </div>

                          <div className="mobile-milestone-awards-row">
                            <TrophyIcon size={18} color="#FFD700" />
                            <span className="mobile-milestone-awards-count">
                              {item.awardsCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mobile-milestone-body">
                        <h4 className="mobile-milestone-title">{item.title}</h4>
                        <p className="mobile-milestone-desc">{item.desc}</p>
                        
                        <div className="mobile-milestone-footer">
                          <TrophyIcon size={12} color="#F37346" />
                          <span>{item.stats}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Old Recognitions and Certifications sections removed as requested */}

        {/* NEW SECTION: CLIENT APPRECIATIONS & SAFETY AWARDS */}
        {/* NEW SECTION: CLIENT APPRECIATIONS & SAFETY AWARDS */}
        <section className="responsive-bottom-section client-testimonials-section">
          <div className="client-testimonials-header">
            <span className="client-testimonials-eyebrow">
              CLIENT TESTIMONIALS & RECOGNITION
            </span>
            <h2 className="client-testimonials-heading">
              Client Appreciations & Safety Awards
            </h2>
          </div>
          
          <Swiper
            modules={[Pagination, FreeMode, Mousewheel, Autoplay]}
            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop={true}
            spaceBetween={20}
            slidesPerView={1.12}
            freeMode={false}
            grabCursor={true}
            pagination={{ clickable: true, bulletClass: 'swiper-custom-bullet', bulletActiveClass: 'swiper-custom-bullet-active' }}
            breakpoints={{ 
              0: { slidesPerView: 1.12, spaceBetween: 14 },
              480: { slidesPerView: 1.3, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 18 }, 
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 24 }
            }}
            style={{ padding: '10px 2px 45px 2px' }}
          >
            {(clientAppreciations && clientAppreciations.length > 0 ? clientAppreciations : safetyAwardsData).map((item, idx) => {
              // fallback logic for images if missing from Strapi
              const fallbackItem = safetyAwardsData[idx % safetyAwardsData.length] || safetyAwardsData[0];
              const itemImages = (item.images && item.images.length > 0) ? item.images : fallbackItem.images;
              
              const iconMap = {
                ShieldCheckIcon, TrophyIcon, BadgeCheckIcon, StarIcon, UsersIcon, GlobeIcon
              };
              const ItemIcon = typeof item.icon === 'string' ? (iconMap[item.icon] || TrophyIcon) : (item.icon || TrophyIcon);

              return (
              <SwiperSlide key={`client-${item.id || 'item'}-${idx}`}>
                <div
                  className="client-appreciation-card"
                  onClick={() => {
                     if (onViewAward) {
                       onViewAward({
                         ...item,
                         name: item.title,
                         description: item.desc,
                         image: itemImages && itemImages.length > 0 ? itemImages[0] : 'https://placehold.co/400x300?text=No+Image',
                         gallery: itemImages && itemImages.length > 1 ? itemImages.slice(1) : []
                       });
                     }
                  }}
                >
                  {/* Image Header inside the Card */}
                  {itemImages && itemImages.length > 0 && (
                    <div className="client-card-img-wrap">
                      <img 
                        src={itemImages[0]} 
                        alt={`${item.title || 'Client Appreciation'} - ${item.company || 'Industry Partner'} Recognition ${item.year || ''} | Pislinfra`} 
                        title={`${item.title || 'Recognition'} - ${item.company || ''}`}
                        loading="lazy"
                        decoding="async"
                        itemProp="image"
                        onError={(e) => {
                          if (!e.target.src.endsWith('/images/awards/certificate.jpg')) {
                            e.target.src = '/images/awards/certificate.jpg';
                          }
                        }}
                      />
                    </div>
                  )}

                  <div className="client-card-body">
                    <div className="client-card-company-row">
                       <div className="client-card-logo-wrap">
                          {getClientLogo(item.company) ? (
                            <img src={getClientLogo(item.company)} alt={item.company} />
                          ) : (
                            <ItemIcon size={24} />
                          )}
                       </div>
                       <div className="client-card-company-info">
                         <h5 className="client-card-company-name">{item.company}</h5>
                         <span className="client-card-location-year">
                           {item.location} • {item.year}
                         </span>
                       </div>
                    </div>
                    <h4 className="client-card-title">{item.title}</h4>
                    <p className="client-card-desc">
                      {item.desc}
                    </p>
                    
                    <div className="client-card-action">
                      View Award <ArrowRightIcon size={14} style={{ marginLeft: '4px' }} />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );})}
          </Swiper>
        </section>

      </div>
      <style>{`
        /* ========================================================
           A LEGACY OF EXCELLENCE - SECTION & HEADER
           ======================================================== */
        .legacy-awards-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          width: 100%;
          box-sizing: border-box;
        }
        .legacy-title-col {
          flex: 1;
          min-width: 260px;
        }
        .legacy-eyebrow {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 800;
          color: #F37346;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 6px;
          font-family: 'Inter', sans-serif;
        }
        .legacy-heading {
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 800;
          color: #1E2A5A;
          margin: 0;
          letter-spacing: -0.4px;
          line-height: 1.25;
          font-family: 'Inter', sans-serif;
        }

        /* Year Filter Pills */
        .awards-year-filter-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .year-filter-pill {
          padding: 7px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #475569;
          cursor: pointer;
          white-space: nowrap;
          transition: none !important;
        }
        .year-filter-pill:hover {
          background: #F8FAFC;
          color: #1E2A5A;
        }
        .year-filter-pill.active {
          background: #F37346 !important;
          color: #FFFFFF !important;
          border-color: #F37346 !important;
        }

        /* Empty State */
        .awards-empty-box {
          padding: 40px 20px;
          text-align: center;
          background: #F8FAFC;
          border-radius: 14px;
          border: 1px dashed #CBD5E1;
          color: #64748B;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          margin: 16px 0;
        }

        /* Responsive Slider & Navigation */
        .responsive-slider-wrapper {
          position: relative;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .responsive-slider-wrapper .swiper {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }
        .responsive-slider-wrapper .swiper-slide {
          height: auto !important;
          display: flex;
        }
        .awards-prev, .awards-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          color: #1E2A5A;
          transition: none !important;
        }
        .awards-prev {
          left: -18px;
        }
        .awards-next {
          right: -18px;
        }
        .awards-prev.swiper-button-disabled,
        .awards-next.swiper-button-disabled {
          opacity: 0.35;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* Award Showcase Card */
        .award-showcase-card {
          background: #FFFFFF;
          border-radius: 14px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          padding: 14px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
          min-height: 350px;
          box-sizing: border-box;
          transition: none !important;
        }
        .award-showcase-card:hover {
          box-shadow: 0 6px 20px rgba(30, 42, 90, 0.08) !important;
        }

        .award-card-img-wrap {
          width: 100%;
          height: 215px;
          background: #F8FAFC;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #F1F5F9;
          flex-shrink: 0;
        }
        .award-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .award-card-category-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(6px);
          color: #F37346;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 6px;
          border: 1px solid rgba(243, 115, 70, 0.25);
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          text-transform: uppercase;
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          z-index: 2;
          font-family: 'Inter', sans-serif;
        }
        .award-card-title-wrap {
          padding: 12px 2px 6px 2px;
          flex: 1;
          display: flex;
          align-items: flex-start;
          min-height: 48px;
        }
        .award-card-title-text {
          font-size: 15px;
          font-weight: 700;
          color: #1E2A5A;
          margin: 0;
          line-height: 1.35;
          font-family: 'Inter', sans-serif;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .award-card-footer {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .award-card-year {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .award-card-year span {
          font-size: 13px;
          font-weight: 700;
          color: #F37346;
          font-family: 'Inter', sans-serif;
        }
        .award-card-action {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12.5px;
          font-weight: 700;
          color: #1E2A5A;
          font-family: 'Inter', sans-serif;
        }

        /* ========================================================
           OUR JOURNEY OF EXCELLENCE (TIMELINE)
           ======================================================== */
        .journey-timeline-section {
          margin-top: 80px;
          margin-bottom: 75px;
          width: 100%;
          box-sizing: border-box;
        }
        .journey-header {
          text-align: left;
          margin-bottom: 28px;
        }
        .journey-eyebrow {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 800;
          color: #F37346;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 6px;
          font-family: 'Inter', sans-serif;
        }
        .journey-heading {
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 800;
          color: #1E2A5A;
          margin: 0;
          letter-spacing: -0.3px;
          line-height: 1.25;
          font-family: 'Inter', sans-serif;
        }

        /* Desktop Serpentine Roadmap */
        .desktop-timeline {
          display: block;
        }
        .roadmap-milestone-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(30, 42, 90, 0.04);
          padding: 16px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: none !important;
        }
        .roadmap-milestone-card:hover {
          box-shadow: 0 6px 18px rgba(30, 42, 90, 0.06) !important;
        }

        /* Mobile Timeline Default Hidden on Desktop */
        .mobile-timeline {
          display: none;
        }

        /* Mobile Connected Vertical Timeline Styles */
        .mobile-timeline-track {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 18px;
          width: 100%;
          box-sizing: border-box;
        }
        .mobile-timeline-item {
          position: relative;
          display: flex;
          gap: 12px;
          align-items: stretch;
          width: 100%;
          box-sizing: border-box;
        }
        .mobile-timeline-node-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 24px;
          flex-shrink: 0;
        }
        .mobile-timeline-node {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid #F37346;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(243, 115, 70, 0.2);
          z-index: 2;
          margin-top: 14px;
          flex-shrink: 0;
        }
        .mobile-node-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1E2A5A;
        }
        .mobile-timeline-line {
          position: absolute;
          top: 36px;
          bottom: -18px;
          width: 2px;
          background: #E2E8F0;
          z-index: 1;
        }
        .mobile-milestone-card {
          flex: 1;
          min-width: 0;
          background: #FFFFFF;
          border-radius: 14px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 14px rgba(30, 42, 90, 0.04);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          transition: none !important;
        }
        .mobile-milestone-banner {
          height: 90px;
          width: 100%;
          position: relative;
          overflow: hidden;
          background-image: url('https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/years_2e23ba7341.avif');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-bottom: 1px solid rgba(243, 115, 70, 0.2);
        }
        .mobile-milestone-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.88) 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 9px 12px;
        }
        .mobile-milestone-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .mobile-milestone-year-badge {
          display: inline-flex;
          align-items: center;
          background: #F37346;
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: #FFFFFF;
          padding: 2.5px 9px;
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 800;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .mobile-milestone-tag {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          color: #FFD700;
          letter-spacing: 0.6px;
          background: rgba(15, 23, 42, 0.8);
          padding: 2.5px 8px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 215, 0, 0.35);
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: 'Inter', sans-serif;
        }
        .mobile-milestone-awards-row {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #FFD700;
          font-size: 16px;
          font-weight: 800;
          font-family: 'Inter', sans-serif;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85);
        }
        .mobile-milestone-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .mobile-milestone-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #1E2A5A;
          margin: 0 0 4px 0;
          line-height: 1.35;
          font-family: 'Inter', sans-serif;
        }
        .mobile-milestone-desc {
          font-size: 11.5px;
          color: #64748B;
          line-height: 1.45;
          margin: 0 0 10px 0;
          font-family: 'Inter', sans-serif;
        }
        .mobile-milestone-footer {
          margin-top: auto;
          padding-top: 8px;
          border-top: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          font-weight: 700;
          color: #1E2A5A;
          font-family: 'Inter', sans-serif;
        }

        /* ========================================================
           CLIENT TESTIMONIALS & RECOGNITION (SECTION & CARDS)
           ======================================================== */
        .client-testimonials-section {
          width: 100%;
          max-width: 1400px;
          margin: 70px auto 0;
          padding: 0;
          box-sizing: border-box;
        }
        .client-testimonials-header {
          margin-bottom: 24px;
        }
        .client-testimonials-eyebrow {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 800;
          color: #F37346;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 6px;
          font-family: 'Inter', sans-serif;
        }
        .client-testimonials-heading {
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 800;
          color: #1E2A5A;
          margin: 0;
          letter-spacing: -0.3px;
          line-height: 1.25;
          font-family: 'Inter', sans-serif;
        }

        .client-testimonials-section .swiper-slide {
          height: auto !important;
          display: flex;
        }
        .client-appreciation-card {
          background: #FFFFFF;
          border-radius: 14px;
          border: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          height: 100%;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          cursor: pointer;
          overflow: hidden;
          transition: none !important;
          box-sizing: border-box;
        }
        .client-appreciation-card:hover {
          box-shadow: 0 8px 22px rgba(30, 42, 90, 0.08) !important;
        }
        .client-card-img-wrap {
          width: 100%;
          height: 240px;
          background-color: #F8FAFC;
          overflow: hidden;
          border-bottom: 1px solid #F1F5F9;
          flex-shrink: 0;
        }
        .client-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .client-card-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
          width: 100%;
          box-sizing: border-box;
        }
        .client-card-company-row {
          display: flex;
          align-items: center;
          margin-bottom: 14px;
          gap: 12px;
          width: 100%;
        }
        .client-card-logo-wrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #F8FAFC;
          border: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1E2A5A;
          flex-shrink: 0;
          overflow: hidden;
        }
        .client-card-logo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 6px;
        }
        .client-card-company-info {
          flex: 1;
          min-width: 0;
        }
        .client-card-company-name {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .client-card-location-year {
          font-size: 11px;
          color: #6B7280;
          font-family: 'Inter', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }
        .client-card-title {
          font-size: 15.5px;
          font-weight: 700;
          color: #1E2A5A;
          margin: 0 0 8px 0;
          font-family: 'Inter', sans-serif;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .client-card-desc {
          font-size: 12.5px;
          color: #4B5563;
          margin: 0;
          line-height: 1.5;
          font-family: 'Inter', sans-serif;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .client-card-action {
          margin-top: auto;
          padding-top: 16px;
          display: flex;
          align-items: center;
          color: #F37346;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
        }

        /* Swiper Custom Bullets */
        .swiper-custom-bullet {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #CBD5E1;
          margin: 0 4px;
          cursor: pointer;
          transition: none !important;
        }
        .swiper-custom-bullet-active {
          background: #F37346 !important;
          width: 22px !important;
          border-radius: 4px !important;
        }

        @media (max-width: 900px) {
          .desktop-timeline {
            display: none !important;
          }
          .mobile-timeline {
            display: block !important;
          }
          .journey-timeline-section {
            margin-top: 45px !important;
            margin-bottom: 45px !important;
          }
          .journey-header {
            margin-bottom: 20px !important;
          }
        }

        @media (max-width: 768px) {
          .responsive-wrapper {
            padding: 0 16px !important;
            width: 100% !important;
            max-width: 100vw !important;
            box-sizing: border-box !important;
          }
          .legacy-awards-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
            margin-bottom: 18px !important;
          }
          .legacy-title-col {
            width: 100% !important;
            min-width: 0 !important;
          }
          .legacy-heading {
            font-size: clamp(20px, 5.5vw, 25px) !important;
          }
          .awards-year-filter-row {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 2px 2px 6px 2px !important;
            gap: 8px !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .awards-year-filter-row::-webkit-scrollbar {
            display: none !important;
          }
          .year-filter-pill {
            flex-shrink: 0 !important;
            padding: 6px 14px !important;
            font-size: 12.5px !important;
          }
          .awards-prev, .awards-next {
            display: none !important;
          }
          .award-showcase-card {
            min-height: 285px !important;
            padding: 12px !important;
            border-radius: 12px !important;
          }
          .award-card-img-wrap {
            height: clamp(155px, 46vw, 185px) !important;
          }
          .award-card-title-text {
            font-size: 14px !important;
            line-height: 1.3 !important;
          }
          .award-card-title-wrap {
            min-height: 40px !important;
            padding: 10px 2px 4px 2px !important;
          }
          .award-card-footer {
            padding-top: 10px !important;
          }
          .responsive-bottom-section {
            margin-top: 45px !important;
            padding: 0 !important;
          }
          .client-testimonials-section {
            margin-top: 45px !important;
          }
          .client-appreciation-card {
            min-height: auto !important;
            border-radius: 12px !important;
          }
          .client-card-img-wrap {
            height: clamp(165px, 48vw, 200px) !important;
          }
          .client-card-body {
            padding: 14px !important;
          }
          .client-card-title {
            font-size: 14.5px !important;
          }
          .client-card-desc {
            font-size: 12px !important;
          }
          .client-card-action {
            padding-top: 12px !important;
          }
        }

        @media (max-width: 500px) {
          .responsive-wrapper {
            padding: 0 12px !important;
          }
          .responsive-slider-wrapper {
            padding: 0 !important;
            margin: 0 !important;
          }
          .responsive-bottom-section {
            padding: 0 !important;
          }
          .timeline-prev, .timeline-next, .awards-prev, .awards-next {
            display: none !important;
          }
          .award-showcase-card {
            min-height: 275px !important;
            padding: 11px !important;
          }
          .award-card-img-wrap {
            height: clamp(150px, 45vw, 175px) !important;
          }
          /* Mobile Timeline 500px Compact Adjustments */
          .mobile-timeline-item {
            gap: 10px !important;
          }
          .mobile-timeline-node-wrap {
            width: 20px !important;
          }
          .mobile-timeline-node {
            width: 18px !important;
            height: 18px !important;
            margin-top: 12px !important;
          }
          .mobile-node-dot {
            width: 6px !important;
            height: 6px !important;
          }
          .mobile-timeline-line {
            top: 30px !important;
          }
          .mobile-milestone-banner {
            height: 80px !important;
          }
          .mobile-milestone-awards-row {
            font-size: 15px !important;
          }
          .mobile-milestone-body {
            padding: 10px !important;
          }
          .client-testimonials-section {
            margin-top: 36px !important;
          }
          .client-card-img-wrap {
            height: clamp(150px, 46vw, 180px) !important;
          }
          .client-card-body {
            padding: 12px !important;
          }
          .client-card-logo-wrap {
            width: 38px !important;
            height: 38px !important;
          }
          .client-card-title {
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ExcellenceShowcase;