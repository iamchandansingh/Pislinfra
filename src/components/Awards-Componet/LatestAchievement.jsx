import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Custom SVG icons
const CalendarIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TagIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const LocationIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserGroupIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CheckIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRightIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const DownloadIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const TrophyIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const StarIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const LatestAchievement = ({ achievementData = {}, onViewDetails, onDownload }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [imageLoaded, setImageLoaded] = useState(false);

  const achievement = {
    year: 2025,
    title: 'Best Infrastructure Company 2025',
    organization: 'Industry Excellence Council',
    description: 'In recognition of outstanding contribution to infrastructure development, project execution, quality assurance, innovation, and nation-building excellence.',
    category: 'Infrastructure Excellence',
    location: 'New Delhi, India',
    presentedBy: 'Industry Excellence Council',
    awardImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop',
    certificateImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    highlights: ['National Recognition', 'Industry Leadership', 'Excellence in Innovation', 'Quality Standards', 'Sustainable Development'],
    ...achievementData,
  };

  const infoItems = [
    { icon: CalendarIcon, label: 'Award Year', value: achievement.year, color: '#F37346' },
    { icon: TagIcon, label: 'Category', value: achievement.category, color: '#2A2A75' },
    { icon: LocationIcon, label: 'Location', value: achievement.location, color: '#F37346' },
    { icon: UserGroupIcon, label: 'Presented By', value: achievement.presentedBy, color: '#2A2A75' },
  ];

  const handleViewDetails = () => {
    if (onViewDetails) onViewDetails({ image: achievement.awardImage, certificate: achievement.certificateImage, name: achievement.title, description: achievement.description, date: achievement.year, location: achievement.location, organization: achievement.organization });
  };

  const handleDownload = () => {
    if (onDownload) onDownload(achievement.certificateImage);
  };

  return (
    <section style={{ background: '#FFFFFF', padding: '0', position: 'relative', overflow: 'hidden' }} ref={sectionRef}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        
        <motion.div
          style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', boxShadow: '0 15px 40px rgba(0,0,0,0.04)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '50% 50%', minHeight: '300px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="latest-card"
        >
          
          {/* Left - Image */}
          <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)', minHeight: '250px' }}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {!imageLoaded && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrophyIcon size={80} color="rgba(42,42,117,0.08)" />
                </div>
              )}
              <img src={achievement.awardImage} alt={achievement.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imageLoaded ? 1 : 0 }} onLoad={() => setImageLoaded(true)} />
            </div>

          </div>

          {/* Right - Content */}
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            
            <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 600, color: '#F37346', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '10px', fontFamily: "'Inter', sans-serif" }}>
              Latest Achievement
            </span>
            
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700, color: '#2A2A75', lineHeight: 1.2, margin: '0 0 8px 0', fontFamily: "'Inter', sans-serif" }}>
              {achievement.title}
            </h2>
            
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#F37346', margin: '0 0 16px 0', fontFamily: "'Inter', sans-serif" }}>
              Awarded by {achievement.organization}
            </p>
            
            <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.7, margin: '0 0 20px 0', fontFamily: "'Inter', sans-serif" }}>
              {achievement.description}
            </p>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {infoItems.map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid #F3F4F6', borderRadius: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${item.color}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={16} color={item.color} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>{item.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', fontFamily: "'Inter', sans-serif" }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#2A2A75', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', fontFamily: "'Inter', sans-serif" }}>Highlights</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {achievement.highlights.map((highlight) => (
                  <div key={highlight} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151', fontFamily: "'Inter', sans-serif" }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(243,115,70,0.1)', color: '#F37346', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckIcon size={12} />
                    </div>
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

              <button onClick={handleDownload} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 22px', background: 'transparent', color: '#F37346', border: '2px solid #F37346', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                <DownloadIcon size={16} /> Certificate
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`@media(max-width:1024px){.latest-card{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
};

export default LatestAchievement;