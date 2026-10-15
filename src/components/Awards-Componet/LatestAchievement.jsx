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
    { icon: CalendarIcon, label: 'Award Year', value: achievement.year, color: '#F37346', itemClass: 'item-year' },
    { icon: TagIcon, label: 'Category', value: achievement.category, color: '#1E2A5A', itemClass: 'item-category' },
    { icon: LocationIcon, label: 'Location', value: achievement.location, color: '#F37346', itemClass: 'item-location' },
    { icon: UserGroupIcon, label: 'Presented By', value: achievement.presentedBy || achievement.organization, color: '#1E2A5A', itemClass: 'item-presented' },
  ];

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails({ 
        id: achievement.id,
        title: achievement.title,
        name: achievement.title,
        year: achievement.year,
        category: achievement.category,
        image: achievement.awardImage, 
        certificate: achievement.certificateImage, 
        awardImage: achievement.awardImage,
        certificateImage: achievement.certificateImage,
        images: achievement.images || [achievement.awardImage],
        gallery: achievement.gallery || [],
        description: achievement.description, 
        date: achievement.year, 
        location: achievement.location, 
        organization: achievement.organization,
        company: achievement.organization,
        presentedBy: achievement.presentedBy || achievement.organization,
        highlights: achievement.highlights
      });
    }
  };

  return (
    <section className="latest-achievement-section" ref={sectionRef}>
      <div className="latest-achievement-container">
        
        <div className="latest-card">
          
          {/* Left Column - Fixed-Size Full Cover Fit Image */}
          <div className="latest-image-col">
            {/* Top Year & Category Badges */}
            <div className="latest-badge-left">
              <span className="latest-year-badge">
                {achievement.year}
              </span>
            </div>

            <div className="latest-badge-right">
              <span className="latest-category-badge">
                {achievement.category}
              </span>
            </div>

            {/* Fixed Full Cover Image with Rich SEO tags */}
            <img 
              src={achievement.awardImage || achievement.certificateImage} 
              alt={`${achievement.title || 'Latest Recognition'} - ${achievement.category || 'Excellence'} Award ${achievement.year || '2026'} | Pislinfra Infrastructure Excellence`} 
              title={`${achievement.title || 'Latest Recognition'} (${achievement.year || '2026'}) - Pislinfra`}
              loading="lazy"
              decoding="async"
              itemProp="image"
              onError={(e) => {
                if (!e.target.src.endsWith('/images/awards/certificate.jpg')) {
                  e.target.src = '/images/awards/certificate.jpg';
                }
              }}
              className="latest-card-img"
            />

            {/* Subtle Gradient Shadow on Image for Depth */}
            <div className="latest-img-gradient" />
          </div>

          {/* Right Column - Executive Details & Accolade Info */}
          <div className="latest-details-col">
            
            {/* Top Row: Eyebrow + 10s Auto-Cycle 5 Dots */}
            <div className="latest-top-row">
              <div className="latest-eyebrow">
                <span>
                  {title || "⭐ LATEST RECOGNITION & ACHIEVEMENT"}
                </span>
              </div>

              {/* 5 Dots Indicator (Top Latest 5 Auto-Cycling Every 10s) */}
              {itemsList.length > 1 && (
                <div className="latest-dots-wrap">
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
            
            <div className="latest-content-body">
              {/* Title */}
              <div className="latest-title-wrap">
                <h2 className="latest-title-text">
                  {achievement.title}
                </h2>
              </div>
              
              {/* Awarded By */}
              <div className="latest-awarded-by">
                <TrophyIcon size={14} color="#F37346" />
                <span className="latest-awarded-text">Awarded by {achievement.organization || achievement.presentedBy}</span>
              </div>
              
              {/* Description */}
              <div className="latest-desc-wrap">
                <p className="latest-desc-text">
                  {achievement.description}
                </p>
              </div>

              {/* 2x2 Info Grid */}
              <div className="latest-info-grid">
                {infoItems.map((item) => (
                  <div key={item.label} className={`latest-info-item ${item.itemClass}`}>
                    <div 
                      className="latest-info-icon-box"
                      style={{ 
                        background: item.color === '#F37346' ? 'rgba(243, 115, 70, 0.1)' : 'rgba(30, 42, 90, 0.08)' 
                      }}
                    >
                      <item.icon size={12} color={item.color} />
                    </div>
                    <div className="latest-info-text-wrap">
                      <div className="latest-info-label">{item.label}</div>
                      <div className="latest-info-val">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Highlights Tag Pills */}
              <div className="latest-highlights-wrap">
                <div className="latest-highlights-list">
                  {(achievement.highlights || []).slice(0, 3).map((highlight) => (
                    <div key={highlight} className="latest-pill">
                      <div className="latest-pill-icon">
                        <CheckIcon size={7} color="#FFFFFF" />
                      </div>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="latest-actions-wrap">
                <button 
                  onClick={handleViewDetails} 
                  className="latest-view-btn"
                  type="button"
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
        .latest-achievement-section {
          background: #FFFFFF;
          padding: 40px 0 25px 0;
          position: relative;
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }
        .latest-achievement-container {
          max-width: 1360px;
          width: 100%;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 1;
          box-sizing: border-box;
        }
        .latest-card {
          background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
          border-radius: 20px;
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 14px 40px -8px rgba(30, 42, 90, 0.06);
          overflow: hidden;
          display: grid;
          grid-template-columns: 40% 60%;
          min-height: 425px;
          position: relative;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .latest-image-col {
          position: relative;
          overflow: hidden;
          background-color: #0F172A;
          min-height: 380px;
          width: 100%;
          max-width: 100%;
          height: 100%;
          padding: 0;
          box-sizing: border-box;
        }
        .latest-badge-left {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
        }
        .latest-year-badge {
          background: linear-gradient(135deg, #1E2A5A 0%, #2A2A75 100%);
          color: #FFFFFF;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 12.5px;
          font-weight: 800;
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }
        .latest-badge-right {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10;
        }
        .latest-category-badge {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(6px);
          color: #F37346;
          border: 1px solid rgba(243, 115, 70, 0.3);
          padding: 5px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }
        .latest-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .latest-img-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.05) 50%, rgba(15,23,42,0.35) 100%);
          pointer-events: none;
        }
        .latest-details-col {
          padding: 24px 34px 28px 34px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          height: 100%;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow: hidden;
        }
        .latest-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 8px;
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }
        .latest-eyebrow {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 800;
          color: #F37346;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-family: 'Inter', sans-serif;
          word-break: break-word;
        }
        .latest-dots-wrap {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }
        .latest-content-body {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow: hidden;
        }
        .latest-title-wrap {
          min-height: 54px;
          display: flex;
          align-items: center;
          margin: 0 0 6px 0;
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }
        .latest-title-text {
          font-size: clamp(19px, 2.3vw, 24px);
          font-weight: 800;
          color: #1E2A5A;
          line-height: 1.25;
          letter-spacing: -0.3px;
          margin: 0;
          font-family: 'Inter', sans-serif;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
          overflow-wrap: break-word;
          width: 100%;
        }
        .latest-awarded-by {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #F37346;
          font-size: 13px;
          font-weight: 700;
          margin: 0 0 8px 0;
          font-family: 'Inter', sans-serif;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
        }
        .latest-awarded-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
          flex: 1;
        }
        .latest-desc-wrap {
          margin: 0 0 12px 0;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
        }
        .latest-desc-text {
          font-size: 12.5px;
          color: #64748B;
          line-height: 1.5;
          margin: 0;
          font-family: 'Inter', sans-serif;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }
        .latest-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 12px;
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }
        .latest-info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: #FFFFFF;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          box-sizing: border-box;
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
        }
        .latest-info-icon-box {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .latest-info-text-wrap {
          min-width: 0;
          flex: 1;
          overflow: hidden;
        }
        .latest-info-label {
          font-size: 9px;
          color: #94A3B8;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .latest-info-val {
          font-size: 11.5px;
          font-weight: 700;
          color: #1E2A5A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          width: 100%;
          max-width: 100%;
        }
        .latest-highlights-wrap {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .latest-highlights-list {
          display: flex;
          flex-wrap: nowrap;
          gap: 6px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          padding-bottom: 2px;
        }
        .latest-highlights-list::-webkit-scrollbar {
          display: none;
        }
        .latest-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: #1E2A5A;
          background: rgba(243, 115, 70, 0.08);
          padding: 2.5px 9px;
          border-radius: 100px;
          border: 1px solid rgba(243, 115, 70, 0.2);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .latest-pill-icon {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #F37346;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .latest-actions-wrap {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }
        .latest-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          background: linear-gradient(135deg, #1E2A5A 0%, #2A2A75 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(30, 42, 90, 0.15);
          font-family: 'Inter', sans-serif;
          transition: background 0.2s ease;
        }
        .latest-view-btn:hover {
          background: #2A2A75;
        }

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
          .latest-image-col {
            min-height: 280px !important;
            height: 280px !important;
          }
        }

        @media (max-width: 768px) {
          .latest-achievement-section {
            padding: 20px 0 20px 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }
          .latest-achievement-container {
            padding: 0 16px !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .latest-card {
            border-radius: 16px !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
          .latest-image-col {
            min-height: clamp(210px, 58vw, 250px) !important;
            height: clamp(210px, 58vw, 250px) !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .latest-badge-left {
            top: 12px !important;
            left: 12px !important;
          }
          .latest-year-badge {
            padding: 4px 12px !important;
            font-size: 11px !important;
          }
          .latest-badge-right {
            top: 12px !important;
            right: 12px !important;
          }
          .latest-category-badge {
            padding: 4px 10px !important;
            font-size: 10px !important;
            max-width: 160px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            display: inline-block !important;
          }
          .latest-details-col {
            padding: 18px 14px 20px 14px !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
          .latest-top-row {
            margin-bottom: 6px !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }
          .latest-eyebrow {
            font-size: 10px !important;
            letter-spacing: 1px !important;
          }
          .latest-title-wrap {
            min-height: auto !important;
            margin-bottom: 4px !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }
          .latest-title-text {
            font-size: clamp(17px, 4.8vw, 20px) !important;
            line-height: 1.25 !important;
          }
          .latest-awarded-by {
            font-size: 12px !important;
            margin-bottom: 6px !important;
          }
          .latest-desc-wrap {
            height: auto !important;
            min-height: auto !important;
            margin-bottom: 12px !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }
          .latest-desc-text {
            font-size: 12px !important;
            line-height: 1.5 !important;
          }
          .latest-info-grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 6px !important;
            margin-bottom: 12px !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }
          .latest-info-item {
            padding: 6px 8px !important;
            gap: 6px !important;
            min-width: 0 !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          /* Full width for Location and Presented By on mobile so no cut-off! */
          .latest-info-item.item-location,
          .latest-info-item.item-presented {
            grid-column: span 2 !important;
          }
          .latest-info-icon-box {
            width: 22px !important;
            height: 22px !important;
          }
          .latest-info-label {
            font-size: 8.5px !important;
          }
          .latest-info-val {
            font-size: 11px !important;
          }
          .latest-highlights-wrap {
            height: auto !important;
            margin-bottom: 14px !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }
          .latest-pill {
            font-size: 10.5px !important;
            padding: 2.5px 8px !important;
          }
          .latest-actions-wrap {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }
          .latest-view-btn {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            justify-content: center !important;
            padding: 11px 16px !important;
            font-size: 12.5px !important;
            border-radius: 9px !important;
          }
        }

        @media (max-width: 360px) {
          .latest-details-col {
            padding: 16px 10px 18px 10px !important;
          }
          .latest-title-text {
            font-size: 16px !important;
          }
          .latest-info-item {
            grid-column: span 2 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default LatestAchievement;