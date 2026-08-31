import React, { useState, useRef, useMemo, useEffect } from 'react';

// Custom SVG icons
const CalendarIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TagIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const LocationIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserGroupIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CheckIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRightIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const DownloadIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const TrophyIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const LatestAchievement = ({ achievements = [], achievementData = {}, onViewDetails, onDownload, title }) => {
  const sectionRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normalize list to top 5 latest items
  const itemsList = useMemo(() => {
    const rawList = achievements && achievements.length > 0 
      ? achievements 
      : [achievementData];
    
    return rawList.slice(0, 5).map((item, idx) => ({
      id: item.id || idx,
      year: parseInt(item.year, 10) || 2025,
      title: item.title || 'Excellence in Infrastructure Award',
      organization: item.organization || item.company || item.presentedBy || 'Industry Excellence Council',
      description: item.description || item.desc || 'In recognition of outstanding contribution to infrastructure development, project execution, quality assurance, innovation, and safety excellence.',
      category: item.category || 'Excellence Award',
      location: item.location || 'India',
      presentedBy: item.presentedBy || item.company || item.organization || 'Industry Leaders',
      awardImage: item.awardImage || item.image || item.clientImage || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop',
      certificateImage: item.certificateImage || item.clientImage || item.image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
      highlights: item.highlights || [
        item.category || 'Excellence Recognition',
        `Recognized in ${item.year || '2025'}`,
        'Quality Assurance & Safety',
        'Industry Benchmark Standards'
      ]
    }));
  }, [achievements, achievementData]);

  // Auto-cycle next award every 10 seconds (10000ms)
  useEffect(() => {
    if (itemsList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % itemsList.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [itemsList.length]);

  const activeIndex = currentIndex < itemsList.length ? currentIndex : 0;
  const achievement = itemsList[activeIndex] || itemsList[0] || {};

  const infoItems = [
    { icon: CalendarIcon, label: 'Award Year', value: achievement.year, color: '#F37346' },
    { icon: TagIcon, label: 'Category', value: achievement.category, color: '#1E2A5A' },
    { icon: LocationIcon, label: 'Location', value: achievement.location, color: '#F37346' },
    { icon: UserGroupIcon, label: 'Presented By', value: achievement.presentedBy || achievement.organization, color: '#1E2A5A' },
  ];

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails({ 
        image: achievement.awardImage, 
        certificate: achievement.certificateImage, 
        name: achievement.title, 
        description: achievement.description, 
        date: achievement.year, 
        location: achievement.location, 
        organization: achievement.organization 
      });
    }
  };

  return (
    <section style={{ background: '#FFFFFF', padding: '45px 0 25px 0', position: 'relative', overflow: 'hidden' }} ref={sectionRef}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        
        <div
          style={{ 
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)', 
            borderRadius: '20px', 
            border: '1.5px solid #E2E8F0', 
            boxShadow: '0 14px 40px -8px rgba(30, 42, 90, 0.06)', 
            overflow: 'hidden', 
            display: 'grid', 
            gridTemplateColumns: '40% 60%', 
            minHeight: '425px',
            position: 'relative'
          }}
          className="latest-card"
        >
          
          {/* Left Column - Fixed-Size Full Cover Fit Image */}
          <div style={{ 
            position: 'relative', 
            overflow: 'hidden', 
            backgroundColor: '#0F172A',
            minHeight: '380px',
            width: '100%',
            height: '100%',
            padding: 0
          }}>
            {/* Top Year & Category Badges */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #1E2A5A 0%, #2A2A75 100%)', 
                color: '#FFFFFF', 
                padding: '6px 16px', 
                borderRadius: '100px', 
                fontSize: '12.5px', 
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                fontFamily: "'Inter', sans-serif"
              }}>
                {achievement.year}
              </span>
            </div>

            <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
              <span style={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(6px)',
                color: '#F37346', 
                border: '1px solid rgba(243, 115, 70, 0.3)', 
                padding: '5px 14px', 
                borderRadius: '100px', 
                fontSize: '11px', 
                fontWeight: 800,
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontFamily: "'Inter', sans-serif"
              }}>
                {achievement.category}
              </span>
            </div>

            {/* Fixed Full Cover Image */}
            <img 
              src={achievement.awardImage || achievement.certificateImage} 
              alt={achievement.title} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block'
              }} 
            />

            {/* Subtle Gradient Shadow on Image for Depth */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.05) 50%, rgba(15,23,42,0.35) 100%)',
              pointerEvents: 'none'
            }} />
          </div>

          {/* Right Column - Executive Details & Accolade Info */}
          <div style={{ padding: '24px 34px 28px 34px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', height: '100%' }}>
            
            {/* Top Row: Eyebrow + 10s Auto-Cycle 5 Dots */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ 
                  fontSize: '11.5px', 
                  fontWeight: 800, 
                  color: '#F37346', 
                  textTransform: 'uppercase', 
                  letterSpacing: '2px', 
                  fontFamily: "'Inter', sans-serif" 
                }}>
                  ⭐ LATEST RECOGNITION & ACHIEVEMENT
                </span>
              </div>

              {/* 5 Dots Indicator (Top Latest 5 Auto-Cycling Every 10s) */}
              {itemsList.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {itemsList.map((item, idx) => (
                    <button
                      key={`dot-${item.id || 'item'}-${idx}`}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        width: idx === activeIndex ? '20px' : '6px',
                        height: '6px',
                        borderRadius: '10px',
                        background: idx === activeIndex ? '#F37346' : '#CBD5E1',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      title={`View award ${idx + 1}: ${item.title}`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ width: '100%' }}>
              {/* Title with Fixed Height Box */}
              <div style={{ minHeight: '58px', display: 'flex', alignItems: 'center', margin: '0 0 4px 0' }}>
                <h2 style={{ 
                  fontSize: 'clamp(19px, 2.3vw, 24px)', 
                  fontWeight: 800, 
                  color: '#1E2A5A', 
                  lineHeight: 1.25, 
                  letterSpacing: '-0.3px',
                  margin: 0, 
                  fontFamily: "'Inter', sans-serif",
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {achievement.title}
                </h2>
              </div>
              
              {/* Awarded By with Fixed Height */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F37346', fontSize: '13px', fontWeight: 700, height: '18px', margin: '0 0 8px 0', fontFamily: "'Inter', sans-serif", overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                <TrophyIcon size={14} color="#F37346" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Awarded by {achievement.organization || achievement.presentedBy}</span>
              </div>
              
              {/* Description with Fixed Height */}
              <div style={{ height: '36px', minHeight: '36px', margin: '0 0 12px 0', overflow: 'hidden' }}>
                <p style={{ 
                  fontSize: '12.5px', 
                  color: '#64748B', 
                  lineHeight: 1.5, 
                  margin: 0, 
                  fontFamily: "'Inter', sans-serif",
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {achievement.description}
                </p>
              </div>

              {/* 2x2 Info Grid (Compact & Fixed) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
                {infoItems.map((item) => (
                  <div 
                    key={item.label} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '6px 10px', 
                      background: '#FFFFFF', 
                      borderRadius: '8px', 
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '6px', 
                      background: item.color === '#F37346' ? 'rgba(243, 115, 70, 0.1)' : 'rgba(30, 42, 90, 0.08)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <item.icon size={12} color={item.color} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>{item.label}</div>
                      <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E2A5A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Highlights Tag Pills with Fixed Height */}
              <div style={{ height: '26px', marginBottom: '14px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '6px', overflow: 'hidden' }}>
                  {(achievement.highlights || []).slice(0, 3).map((highlight) => (
                    <div 
                      key={highlight} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '5px', 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        color: '#1E2A5A', 
                        background: 'rgba(243, 115, 70, 0.08)', 
                        padding: '2.5px 9px', 
                        borderRadius: '100px', 
                        border: '1px solid rgba(243, 115, 70, 0.2)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F37346', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckIcon size={7} color="#FFFFFF" />
                      </div>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons (Compact) */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  onClick={handleViewDetails} 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '9px 20px', 
                    background: 'linear-gradient(135deg, #1E2A5A 0%, #2A2A75 100%)', 
                    color: '#FFFFFF', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '12.5px', 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(30, 42, 90, 0.15)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2A2A75'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E2A5A'}
                >
                  <span>View Full Award Details</span>
                  <ArrowRightIcon size={13} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 1025px) {
          .latest-card {
            height: 425px !important;
          }
        }
        @media (max-width: 1024px) {
          .latest-card {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
        }
      `}</style>
    </section>
  );
};

export default LatestAchievement;