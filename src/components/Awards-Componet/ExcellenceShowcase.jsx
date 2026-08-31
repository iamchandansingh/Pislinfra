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
 * PISL Infrastructure Company
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
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-end', 
              marginBottom: '24px', 
              gap: '20px', 
              flexWrap: 'wrap' 
            }}
          >
            {/* Left Side: Title & Eyebrow */}
            <div style={{ minWidth: '260px' }}>
              <span style={{ display: 'inline-block', fontSize: '11.5px', fontWeight: 800, color: '#F37346', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
                OUR PRESTIGIOUS AWARDS
              </span>
              <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 800, color: '#1E2A5A', margin: 0, letterSpacing: '-0.3px', lineHeight: 1.25, fontFamily: "'Inter', sans-serif" }}>
                A Legacy of Excellence
              </h2>
            </div>

            {/* Right Side: Year Filter Pills (All, 2026, 2025, 2024 ... 2018) */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                flexWrap: 'wrap',
                maxWidth: '100%',
                overflowX: 'auto',
                paddingBottom: '4px'
              }}
            >
              {years.map((year) => {
                const isSelected = selectedYear === year;
                return (
                  <button
                    key={year}
                    onClick={() => onYearChange && onYearChange(year)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '100px',
                      border: isSelected ? '1.5px solid #1E2A5A' : '1px solid #E2E8F0',
                      backgroundColor: isSelected ? '#1E2A5A' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#64748B',
                      fontSize: '12px',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected ? '0 3px 10px rgba(30,42,90,0.15)' : 'none',
                      fontFamily: "'Inter', sans-serif",
                      transition: 'all 0.15s ease',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#F37346';
                        e.currentTarget.style.color = '#F37346';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.color = '#64748B';
                      }
                    }}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="responsive-slider-wrapper" style={{ position: 'relative', margin: '0 -16px', padding: '0 20px' }}>
            {awardsData.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1', margin: '0 16px' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748B' }}>
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
                  0: { slidesPerView: 1.15, spaceBetween: 16 },
                  640: { slidesPerView: 2, spaceBetween: 20 }, 
                  1024: { slidesPerView: 3, spaceBetween: 24 }, 
                  1280: { slidesPerView: 4, spaceBetween: 24 }
                }}
                style={{ padding: '12px 6px 20px 6px' }}
              >
                {awardsData.map((award, awardIdx) => (
                <SwiperSlide key={`award-${award.id || 'award'}-${awardIdx}`}>
                  <div
                    className="award-showcase-card"
                    onClick={() => handleAwardClick(award)}
                  >
                    {/* 1. IMAGE AT TOP (Full Cover Fit inside box) */}
                    <div style={{ 
                      height: '235px', 
                      width: '100%', 
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px solid #EEF2F6',
                      overflow: 'hidden',
                      position: 'relative',
                      padding: 0
                    }}>
                      <img 
                        src={award.image} 
                        alt={`${award.name || award.title || 'Pislinfra Award'} - ${award.category || 'Excellence'} Recognition ${award.year || ''} | Pislinfra Infrastructure Excellence`} 
                        title={`${award.name || award.title || 'Award'} (${award.year || ''}) - Pislinfra`}
                        className="award-card-img"
                        loading="lazy"
                        decoding="async"
                        itemProp="image"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block',
                          transition: 'transform 0.35s ease'
                        }} 
                      />
                      {award.category && (
                        <div 
                          title={award.category}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(6px)',
                            color: '#F37346',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: '6px',
                            border: '1px solid rgba(243, 115, 70, 0.25)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                            textTransform: 'uppercase',
                            maxWidth: '135px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            zIndex: 2
                          }}
                        >
                          {award.category}
                        </div>
                      )}
                    </div>

                    {/* 2. TITLE IN MIDDLE */}
                    <div style={{ padding: '14px 2px 6px 2px' }}>
                      <h3 style={{ 
                        fontSize: '15.5px', 
                        fontWeight: 800, 
                        color: '#1E2A5A', 
                        margin: 0, 
                        lineHeight: 1.35, 
                        fontFamily: "'Inter', sans-serif", 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden' 
                      }}>
                        {award.name}
                      </h3>
                    </div>

                    {/* 3. YEAR & ACTION AT BOTTOM */}
                    <div style={{ 
                      marginTop: 'auto', 
                      paddingTop: '12px', 
                      borderTop: '1px solid #F1F5F9', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      width: '100%'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CalendarIcon size={15} color="#F37346" />
                        <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#F37346' }}>
                          {award.year}
                        </span>
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        color: hoveredAward === award.id ? '#F37346' : '#1E2A5A',
                        fontSize: '12.5px', 
                        fontWeight: 700,
                        transition: 'color 0.2s ease'
                      }}>
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
                <button className="awards-prev" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, width: '40px', height: '40px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: '#1E2A5A' }}>
                  <ArrowLeftIcon size={18} />
                </button>
                <button className="awards-next" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: 0, width: '40px', height: '40px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: '#1E2A5A' }}>
                  <ArrowRightIcon size={18} />
                </button>
              </>
            )}
          </div>
        </section>

        {/* TIMELINE SECTION (Clean Alternating Center-Spine Corporate Roadmap) */}
        <section ref={certificatesSectionRef} style={{ marginTop: '90px', marginBottom: '80px' }}>
          <div 
            style={{ textAlign: 'left', marginBottom: '28px' }}
          >
            <span style={{ display: 'inline-block', fontSize: '11.5px', fontWeight: 800, color: '#F37346', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
              OUR JOURNEY OF EXCELLENCE
            </span>
            <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 800, color: '#1E2A5A', margin: 0, letterSpacing: '-0.3px', lineHeight: 1.25, fontFamily: "'Inter', sans-serif" }}>
              Milestones of Growth, Safety & Innovation
            </h2>
          </div>

          {/* WINDING SNAKE ROADMAP CONTAINER */}
          <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '20px 10px' }}>
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

          {/* Instant 0ms Zero-Animation CSS Styles */}
          <style>{`
            .award-showcase-card {
              background: #FFFFFF;
              border-radius: 16px;
              border: 1px solid #E2E8F0;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
              padding: 16px;
              height: 390px;
              display: flex;
              flex-direction: column;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              transition: none !important;
            }
            .award-showcase-card:hover {
              border-color: #F37346 !important;
              box-shadow: 0 8px 24px rgba(30, 42, 90, 0.08) !important;
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
              border-color: #F37346 !important;
              box-shadow: 0 8px 20px rgba(30, 42, 90, 0.08) !important;
            }

            @media (max-width: 900px) {
              .roadmap-grid {
                grid-template-columns: 1fr !important;
                gap: 18px !important;
              }
              .roadmap-h-line, .roadmap-u-turn-right, .roadmap-u-turn-left {
                display: none !important;
              }
            }
          `}</style>
        </section>

        {/* Old Recognitions and Certifications sections removed as requested */}

        {/* NEW SECTION: CLIENT APPRECIATIONS & SAFETY AWARDS */}
        <section className="responsive-bottom-section" style={{ width: '100%', maxWidth: '1400px', margin: '70px auto 0', padding: '0 24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ display: 'inline-block', fontSize: '11.5px', fontWeight: 800, color: '#F37346', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
              CLIENT TESTIMONIALS & RECOGNITION
            </span>
            <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 800, color: '#1E2A5A', margin: 0, letterSpacing: '-0.3px', lineHeight: 1.25, fontFamily: "'Inter', sans-serif" }}>
              Client Appreciations & Safety Awards
            </h2>
          </div>
          
          <Swiper
            modules={[Pagination, FreeMode, Mousewheel, Autoplay]}
            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop={true}
            spaceBetween={20}
            slidesPerView={1}
            freeMode={false}
            grabCursor={true}
            pagination={{ clickable: true, bulletClass: 'swiper-custom-bullet', bulletActiveClass: 'swiper-custom-bullet-active' }}
            breakpoints={{ 
              640: { slidesPerView: 2 }, 
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            style={{ padding: '10px 4px 50px 4px' }}
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
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid #F3F4F6',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    height: '100%',
                    minHeight: '520px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onClick={() => {
                     if (onViewAward) {
                       onViewAward({
                         ...item,
                         name: item.title,
                         description: item.desc,
                         image: item.images && item.images.length > 0 ? item.images[0] : 'https://placehold.co/400x300?text=No+Image',
                         gallery: item.images && item.images.length > 1 ? item.images.slice(1) : []
                       });
                     }
                  }}
                >
                  {/* Image Header inside the Card */}
                  {item.images && item.images.length > 0 && (
                    <div style={{ width: '100%', height: '300px', backgroundColor: '#F9FAFB', overflow: 'hidden', borderBottom: '1px solid #F3F4F6' }}>
                      <img 
                        src={itemImages && itemImages[0] ? itemImages[0] : item.images[0]} 
                        alt={`${item.title || 'Client Appreciation'} - ${item.company || 'Industry Partner'} Recognition ${item.year || ''} | Pislinfra`} 
                        title={`${item.title || 'Recognition'} - ${item.company || ''}`}
                        loading="lazy"
                        decoding="async"
                        itemProp="image"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                  )}

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
                       <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F4F6F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E2A5A', flexShrink: 0, overflow: 'hidden' }}>
                          {getClientLogo(item.company) ? (
                            <img src={getClientLogo(item.company)} alt={item.company} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
                          ) : (
                            <item.icon size={24} />
                          )}
                       </div>
                       <div>
                         <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif" }}>{item.company}</h5>
                         <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                           {item.location} • {item.year}
                         </span>
                       </div>
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1E2A5A', margin: '0 0 12px 0', fontFamily: "'Inter', sans-serif", lineHeight: 1.3 }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: '#4B5563', margin: 0, lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
                      {item.desc}
                    </p>
                    
                    <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', alignItems: 'center', color: '#F37346', fontSize: '13px', fontWeight: 600 }}>
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
        .desktop-timeline {
          display: block;
        }
        .mobile-timeline {
          display: none;
        }
        .mobile-only-heading {
          display: none;
        }

        .timeline-item:hover .timeline-content-box {
          box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
          border-color: #F37346 !important;
          transform: translateX(5px);
        }
        .timeline-item:hover .timeline-icon {
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .desktop-timeline {
            display: none !important;
          }
          .mobile-timeline {
            display: block !important;
          }
          .mobile-only-heading {
            display: block !important;
          }
          .award-showcase-card {
            height: 375px !important;
            padding: 14px !important;
          }
          .roadmap-milestone-card {
            padding: 14px !important;
          }
          .responsive-bottom-section {
            margin-top: 45px !important;
            padding: 0 16px !important;
          }
        }

        @media (max-width: 500px) {
          .responsive-wrapper {
            padding: 0 12px !important;
          }
          .responsive-slider-wrapper {
            padding: 0 4px !important;
            margin: 0 !important;
          }
          .responsive-bottom-section {
            padding: 0 12px !important;
          }
          .timeline-prev, .timeline-next, .awards-prev, .awards-next {
            display: none !important;
          }
          .award-showcase-card {
            height: 360px !important;
            padding: 12px !important;
          }
          .roadmap-milestone-card {
            padding: 12px !important;
          }
          /* Vertical Timeline Mobile Adjustments */
          .timeline-vertical-line {
            left: 28px !important;
          }
          .timeline-icon {
            left: 4px !important;
            width: 48px !important;
            height: 48px !important;
          }
          .timeline-content-box {
            margin-left: 70px !important;
            padding: 14px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .timeline-divider {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ExcellenceShowcase;