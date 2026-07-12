import React, { useState, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
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
  certificates = [], 
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
  const awardsInView = useInView(awardsSectionRef, { once: true, margin: '-80px' });
  const certificatesInView = useInView(certificatesSectionRef, { once: true, margin: '-80px' });
  const bottomGridInView = useInView(bottomGridRef, { once: true, margin: '-80px' });

  const [hoveredAward, setHoveredAward] = useState(null);
  const [hoveredCertificate, setHoveredCertificate] = useState(null);
  const [hoveredGridItem, setHoveredGridItem] = useState(null);

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

  const awardsData = awards.length > 0 ? awards : defaultAwards;
  const certificatesData = certificates.length > 0 ? certificates : defaultCertificates;

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
    contentWrapper: { maxWidth: '1400px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 },
    awardsSection: { marginBottom: '0' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px', gap: '32px', flexWrap: 'wrap' },
    headerLeft: { flex: 1, minWidth: '300px' },
    headerLabel: { display: 'inline-block', fontSize: '13px', fontWeight: 600, color: '#F37346', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '12px', fontFamily: "'Inter', sans-serif" },
    headerTitle: { fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 700, color: '#2A2A75', margin: '0 0 16px 0', letterSpacing: '-0.5px', lineHeight: 1.15, fontFamily: "'Inter', sans-serif" },
    headerDesc: { fontSize: '16px', color: '#6B7280', lineHeight: 1.7, margin: 0, maxWidth: '520px', fontFamily: "'Inter', sans-serif" },
    viewAllBtn: { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: 'transparent', color: '#2A2A75', border: '2px solid rgba(42,42,117,0.15)', borderRadius: '14px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.3s ease' },
    sliderContainer: { position: 'relative', margin: '0 -8px' },
    awardCard: (h) => ({ background: '#FFFFFF', borderRadius: '6px', border: h ? '2px solid rgba(243,115,70,0.3)' : '1px solid #F3F4F6', boxShadow: h ? '0 20px 40px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden', height: '240px', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.4s ease', transform: h ? 'translateY(-10px) scale(1.03)' : 'translateY(0) scale(1)' }),
    awardImageArea: { height: '100px', background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    awardImage: { width: '100%', height: '100%', objectFit: 'cover' },
    awardContent: { padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    awardName: { fontSize: '17px', fontWeight: 700, color: '#2A2A75', margin: '0 0 16px 0', lineHeight: 1.4, fontFamily: "'Inter', sans-serif" },
    badgesContainer: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    yearBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#F37346', color: '#FFFFFF', borderRadius: '50px', fontSize: '13px', fontWeight: 600, fontFamily: "'Inter', sans-serif" },
    categoryBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 14px', background: 'rgba(42,42,117,0.05)', color: '#2A2A75', borderRadius: '50px', fontSize: '12px', fontWeight: 600, fontFamily: "'Inter', sans-serif" },
    navBtn: (dir) => ({ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [dir === 'prev' ? 'left' : 'right']: '-20px', width: '52px', height: '52px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #F3F4F6', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: '#2A2A75' }),
    shelfWall: { background: 'linear-gradient(180deg, #FAFBFC 0%, #F5F6F8 100%)', borderRadius: '32px', padding: '60px 40px', position: 'relative', border: '1px solid #F3F4F6' },
    shelfLine: { position: 'absolute', bottom: '40px', left: '40px', right: '40px', height: '6px', background: 'linear-gradient(180deg, #E5E7EB 0%, #D1D5DB 100%)', borderRadius: '3px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' },
    certCard: (h) => ({ background: '#FFFFFF', borderRadius: '4px', border: '3px solid #374151', boxShadow: h ? '0 20px 40px rgba(0,0,0,0.12)' : '0 8px 24px rgba(0,0,0,0.06)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.5s ease', transform: h ? 'translateY(-12px) scale(1.04)' : 'translateY(0) scale(1)' }),
    matBorder: { margin: '16px', padding: '20px', background: '#FFFFFF', border: '2px solid #F3F4F6', borderRadius: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    certPreview: { width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', borderRadius: '2px', overflow: 'hidden' },
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
          <motion.div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '20px', flexWrap: 'wrap' }} initial={{ opacity: 0, y: 30 }} animate={awardsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, color: '#F37346', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>
                OUR PRESTIGIOUS AWARDS
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: '#1E2A5A', margin: 0, letterSpacing: '-0.5px', lineHeight: 1.2, fontFamily: "'Inter', sans-serif" }}>
                A Legacy of Excellence
              </h2>
            </div>
          </motion.div>

          <motion.div className="responsive-slider-wrapper" style={{ position: 'relative', margin: '0 -16px', padding: '0 40px' }} initial={{ opacity: 0, y: 40 }} animate={awardsInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.7 }}>
            <Swiper
              modules={[Navigation, FreeMode, Mousewheel, Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              spaceBetween={20}
              slidesPerView={2}
              freeMode={false}
              grabCursor={true}
              navigation={{ prevEl: '.awards-prev', nextEl: '.awards-next' }}
              breakpoints={{ 
                0: { slidesPerView: 1.2 },
                640: { slidesPerView: 3 }, 
                1024: { slidesPerView: 4 }, 
                1280: { slidesPerView: 5 }, 
                1400: { slidesPerView: 6 } 
              }}
              style={{ padding: '10px 8px' }}
            >
              {awardsData.map((award, index) => (
                <SwiperSlide key={award.id}>
                  <motion.div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '6px',
                      border: '1px solid #F3F4F6',
                      boxShadow: hoveredAward === award.id ? '0 12px 30px rgba(0,0,0,0.08)' : '0 4px 15px rgba(0,0,0,0.03)',
                      padding: '20px 16px',
                      height: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: hoveredAward === award.id ? 'translateY(-5px)' : 'translateY(0)'
                    }}
                    onClick={() => handleAwardClick(award)}
                    onMouseEnter={() => setHoveredAward(award.id)}
                    onMouseLeave={() => setHoveredAward(null)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={awardsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  >
                    <div style={{ height: '180px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <img src={award.image} alt={award.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0', textAlign: 'center', fontFamily: "'Inter', sans-serif", display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {award.name}
                      </h3>
                      <div style={{ fontSize: '13px', color: '#F37346', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                        {award.year}
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <button className="awards-prev" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, width: '40px', height: '40px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: '#1E2A5A' }}>
              <ArrowLeftIcon size={18} />
            </button>
            <button className="awards-next" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: 0, width: '40px', height: '40px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: '#1E2A5A' }}>
              <ArrowRightIcon size={18} />
            </button>
          </motion.div>
        </section>

        {/* TIMELINE SECTION (Responsive) */}
        <section ref={certificatesSectionRef} style={{ marginTop: '60px', marginBottom: '20px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={certificatesInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ display: 'inline-block', fontSize: '13px', fontWeight: 700, color: '#F37346', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontFamily: "'Inter', sans-serif" }}>
              OUR JOURNEY OF EXCELLENCE
            </span>
            <h2 className="mobile-only-heading" style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: '#1E2A5A', margin: 0, letterSpacing: '-0.5px', lineHeight: 1.2, fontFamily: "'Inter', sans-serif" }}>
              Milestones Achieved
            </h2>
          </motion.div>

          {/* DESKTOP HORIZONTAL TIMELINE */}
          <div className="desktop-timeline">
            <motion.div className="responsive-slider-wrapper" style={{ position: 'relative', margin: '0 -16px', padding: '0 40px' }} initial={{ opacity: 0, y: 40 }} animate={certificatesInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.7 }}>
              {/* The continuous horizontal line behind the timeline circles */}
              <div style={{ position: 'absolute', top: '40px', left: '60px', right: '60px', height: '2px', backgroundColor: '#1E2A5A', zIndex: 0 }}></div>
              
              <Swiper
                modules={[Navigation, FreeMode, Mousewheel]}
                spaceBetween={0}
                slidesPerView={2}
                freeMode={false}
                grabCursor={true}
                navigation={{ prevEl: '.timeline-prev', nextEl: '.timeline-next' }}
                breakpoints={{ 
                  640: { slidesPerView: 3 }, 
                  1024: { slidesPerView: 4 }, 
                  1280: { slidesPerView: 5 }, 
                  1400: { slidesPerView: 6 } 
                }}
                style={{ padding: '0 8px 10px 8px' }}
              >
                {[
                  { id: 1, year: '2018', title: 'Foundation of\nExcellence', icon: <BuildingIcon size={34} color="#FFFFFF" />, color: '#1E2A5A' },
                  { id: 2, year: '2019', title: 'Rising Star\nAward', icon: <StarIcon size={34} color="#FFFFFF" />, color: '#F37346' },
                  { id: 3, year: '2020', title: 'Emerging Company\nof the Year', icon: <UsersIcon size={34} color="#FFFFFF" />, color: '#1E2A5A' },
                  { id: 4, year: '2021', title: 'Innovation\nExcellence', icon: <LightBulbIcon size={34} color="#FFFFFF" />, color: '#F37346' },
                  { id: 5, year: '2022', title: 'Quality Excellence\nAward', icon: <BadgeCheckIcon size={34} color="#FFFFFF" />, color: '#1E2A5A' },
                  { id: 6, year: '2023', title: 'Safety Leadership\nAward', icon: <ShieldCheckIcon size={34} color="#FFFFFF" />, color: '#F37346' },
                  { id: 7, year: '2024', title: 'Excellence in\nProject Delivery', icon: <GlobeIcon size={34} color="#FFFFFF" />, color: '#1E2A5A' },
                  { id: 8, year: '2025', title: 'Best Infrastructure\nCompany', icon: <TrophyIcon size={34} color="#FFFFFF" />, color: '#F37346' },
                  { id: 9, year: '2026', title: 'Industry Leadership\nRecognition', icon: <BadgeCheckIcon size={34} color="#FFFFFF" />, color: '#1E2A5A' },
                ].map((item, index) => (
                  <SwiperSlide key={item.id}>
                    <motion.div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 1,
                        padding: '0 10px',
                        cursor: 'default'
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={certificatesInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                      <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%', 
                        backgroundColor: item.color, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        marginBottom: '20px', 
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                        position: 'relative',
                        zIndex: 2
                      }}>
                        {item.icon}
                      </div>
                      <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0', fontFamily: "'Inter', sans-serif" }}>
                        {item.year}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#4B5563', textAlign: 'center', margin: 0, lineHeight: 1.4, fontFamily: "'Inter', sans-serif", whiteSpace: 'pre-line' }}>
                        {item.title}
                      </p>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              <button className="timeline-prev" style={{ position: 'absolute', top: '40px', transform: 'translateY(-50%)', left: 0, width: '40px', height: '40px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: '#1E2A5A' }}>
                <ArrowLeftIcon size={18} />
              </button>
              <button className="timeline-next" style={{ position: 'absolute', top: '40px', transform: 'translateY(-50%)', right: 0, width: '40px', height: '40px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: '#1E2A5A' }}>
                <ArrowRightIcon size={18} />
              </button>
            </motion.div>
          </div>

          {/* MOBILE VERTICAL TIMELINE */}
          <div className="mobile-timeline">
            <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '0 16px' }} className="vertical-timeline-container">
              {/* The continuous vertical line */}
              <div style={{ position: 'absolute', top: '0', bottom: '0', left: '50px', width: '3px', backgroundColor: '#E5EAF2', zIndex: 0 }} className="timeline-vertical-line"></div>
              
              {[
                { id: 9, year: '2026', title: 'Industry Leadership Recognition', icon: <BadgeCheckIcon size={24} color="#FFFFFF" />, color: '#1E2A5A' },
                { id: 8, year: '2025', title: 'Best Infrastructure Company', icon: <TrophyIcon size={24} color="#FFFFFF" />, color: '#F37346' },
                { id: 7, year: '2024', title: 'Excellence in Project Delivery', icon: <GlobeIcon size={24} color="#FFFFFF" />, color: '#1E2A5A' },
                { id: 6, year: '2023', title: 'Safety Leadership Award', icon: <ShieldCheckIcon size={24} color="#FFFFFF" />, color: '#F37346' },
                { id: 5, year: '2022', title: 'Quality Excellence Award', icon: <BadgeCheckIcon size={24} color="#FFFFFF" />, color: '#1E2A5A' },
                { id: 4, year: '2021', title: 'Innovation Excellence', icon: <LightBulbIcon size={24} color="#FFFFFF" />, color: '#F37346' },
                { id: 3, year: '2020', title: 'Emerging Company of the Year', icon: <UsersIcon size={24} color="#FFFFFF" />, color: '#1E2A5A' },
                { id: 2, year: '2019', title: 'Rising Star Award', icon: <StarIcon size={24} color="#FFFFFF" />, color: '#F37346' },
                { id: 1, year: '2018', title: 'Foundation of Excellence', icon: <BuildingIcon size={24} color="#FFFFFF" />, color: '#1E2A5A' }
              ].map((item, index) => (
                <motion.div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    marginBottom: index === 8 ? 0 : '32px',
                    zIndex: 1
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="timeline-item group"
                >
                  {/* Icon Circle */}
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    backgroundColor: item.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    position: 'absolute',
                    left: '20px',
                    zIndex: 2,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    border: '4px solid #FFFFFF',
                    transition: 'transform 0.3s ease'
                  }} className="timeline-icon">
                    {item.icon}
                  </div>

                  {/* Content Box */}
                  <div style={{
                    marginLeft: '110px',
                    background: '#FFFFFF',
                    padding: '24px 32px',
                    borderRadius: '12px',
                    border: '1px solid #F3F4F6',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '24px',
                    transition: 'all 0.3s ease',
                    cursor: 'default'
                  }} className="timeline-content-box">
                    <h4 style={{ fontSize: '26px', fontWeight: 800, color: item.color, margin: 0, fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>
                      {item.year}
                    </h4>
                    <div style={{ height: '30px', width: '2px', backgroundColor: '#E5EAF2' }} className="timeline-divider"></div>
                    <p style={{ fontSize: '16px', color: '#4B5563', margin: 0, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                      {item.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Old Recognitions and Certifications sections removed as requested */}

        {/* NEW SECTION: CLIENT APPRECIATIONS & SAFETY AWARDS */}
        <section className="responsive-bottom-section" style={{ width: '100%', maxWidth: '1400px', margin: '40px auto 0', padding: '0 24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#F37346', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
              CLIENT APPRECIATIONS & SAFETY AWARDS
            </span>
          </div>
          
          <Swiper
            modules={[Pagination, FreeMode, Mousewheel, Autoplay]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
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
            {safetyAwardsData.map((item) => (
              <SwiperSlide key={item.id}>
                <motion.div
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
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  whileHover={{ transform: 'translateY(-5px)', boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
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
                      <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
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
                </motion.div>
              </SwiperSlide>
            ))}
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
        }

        @media (max-width: 500px) {
          .responsive-wrapper {
            padding: 0 16px !important;
          }
          .responsive-slider-wrapper {
            padding: 0 12px !important;
            margin: 0 !important;
          }
          .responsive-bottom-section {
            padding: 0 16px !important;
          }
          .timeline-prev, .timeline-next, .awards-prev, .awards-next {
            display: none !important;
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
            padding: 16px !important;
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