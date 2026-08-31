import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

// SVG Icons
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const AwardPopup = ({ isOpen, onClose, data: fallbackData, awardData }) => {
  const data = awardData || fallbackData;
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  if (!isOpen || !data) return null;

  const images = (data.images && data.images.length > 0)
    ? data.images
    : (data.gallery && data.gallery.length > 0)
      ? [data.image, ...data.gallery]
      : (data.image ? [data.image] : []);

  const currentImg = images[activeImageIndex] || images[0] || data.image;

  const handleDownload = () => {
    window.open(currentImg || data.image, '_blank');
  };

  const infoItems = [
    { icon: StarIcon, label: 'Category', value: data.category || 'Excellence', color: '#F59E0B' },
    { icon: CalendarIcon, label: 'Year', value: data.year, color: '#3B82F6' },
    { icon: BuildingIcon, label: 'Presented By', value: data.presentedBy || 'Industry Authority', color: '#8B5CF6' },
    { icon: LocationIcon, label: 'Location', value: data.location || 'Global', color: '#10B981' }
  ];

  return (
    <div 
      className="award-popup-overlay"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10000,
        padding: '16px'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="award-popup-modal"
        style={{
          width: '100%', maxWidth: '980px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'row',
          height: '580px',
          maxHeight: '92vh',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '40px', height: '40px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 60,
            color: '#64748B',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F37346';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <CloseIcon />
        </button>

        {/* Left - Image Section (Instant 0ms Display) */}
        <div 
          className="award-popup-left"
          style={{
            width: '45%',
            backgroundColor: '#12163E',
            backgroundImage: 'url(/images/popup-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              padding: '10px',
              backgroundColor: '#ffffff',
              border: '6px solid #171717',
              boxShadow: 'inset 0 0 0 2px #d4af37, 0 20px 40px -10px rgba(0,0,0,0.6)',
              maxWidth: '90%',
              maxHeight: images.length > 1 ? '78%' : '90%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}>
              <img 
                src={currentImg} 
                alt={data.title} 
                style={{ maxWidth: '100%', maxHeight: '330px', objectFit: 'contain', display: 'block' }}
              />
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: activeImageIndex === idx ? '22px' : '9px',
                      height: '9px',
                      borderRadius: '100px',
                      backgroundColor: activeImageIndex === idx ? '#F37346' : 'rgba(255,255,255,0.45)',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right - Content Section with Fixed Sticky Footer */}
        <div 
          className="award-popup-right"
          style={{
            width: '55%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#ffffff'
          }}
        >
          {/* Scrollable Content Body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px 32px 16px 32px',
            boxSizing: 'border-box'
          }}>
            {/* Top Label */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '11.5px', fontWeight: 700, color: '#F37346',
              textTransform: 'uppercase', letterSpacing: '2px',
              marginBottom: '12px', fontFamily: "'Inter', sans-serif"
            }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '6px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrophyIcon />
              </span>
              Award Recognition
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: 'clamp(20px, 2.2vw, 26px)', fontWeight: 800, color: '#1E2A5A',
              marginBottom: '10px', fontFamily: "'Inter', sans-serif",
              lineHeight: 1.25, letterSpacing: '-0.3px'
            }}>
              {data.title || data.name}
            </h2>

            {/* Description */}
            <p style={{
              fontSize: '14px', color: '#64748B', lineHeight: 1.6,
              marginBottom: '24px', fontFamily: "'Inter', sans-serif"
            }}>
              {data.description}
            </p>

            {/* Info Grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'
            }}>
              {infoItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color, flexShrink: 0
                  }}>
                    <item.icon />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px', fontFamily: "'Inter', sans-serif" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E2A5A', fontFamily: "'Inter', sans-serif" }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            {data.highlights && data.highlights.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1E2A5A', marginBottom: '10px', fontFamily: "'Inter', sans-serif" }}>
                  Key Highlights
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {data.highlights.map((highlight, index) => (
                    <span key={index} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      backgroundColor: '#F1F5F9', color: '#475569',
                      padding: '4px 10px', borderRadius: '100px',
                      fontSize: '12px', fontWeight: 600, fontFamily: "'Inter', sans-serif"
                    }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#F37346' }} />
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Sticky Action Footer with Download Button */}
          <div style={{
            padding: '16px 32px',
            borderTop: '1px solid #F1F5F9',
            backgroundColor: '#FFFFFF',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 -4px 16px rgba(0,0,0,0.03)'
          }}>
            <button 
              onClick={handleDownload}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                backgroundColor: '#F37346', color: '#ffffff',
                padding: '12px 24px', borderRadius: '10px',
                fontSize: '14.5px', fontWeight: 700,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(243,115,70,0.25)',
                transition: 'all 0.25s ease',
                width: '100%', fontFamily: "'Inter', sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e06034';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(243,115,70,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F37346';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(243,115,70,0.25)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Award Image
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 850px) {
          .award-popup-modal {
            flex-direction: column !important;
            height: auto !important;
            max-height: 90vh !important;
          }
          .award-popup-left {
            width: 100% !important;
            height: 200px !important;
            padding: 12px !important;
          }
          .award-popup-left img {
            max-height: 160px !important;
          }
          .award-popup-right {
            width: 100% !important;
            max-height: calc(90vh - 200px) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AwardPopup;