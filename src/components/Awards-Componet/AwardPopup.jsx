import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

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
  if (!isOpen || !data) return null;

  const images = data.gallery && data.gallery.length > 0 
    ? [data.image, ...data.gallery] 
    : [data.image];

  const handleDownload = () => {
    window.open(data.image, '_blank');
  };

  const infoItems = [
    { icon: StarIcon, label: 'Category', value: data.category || 'Excellence', color: '#F59E0B' },
    { icon: CalendarIcon, label: 'Year', value: data.year, color: '#3B82F6' },
    { icon: BuildingIcon, label: 'Presented By', value: data.presentedBy || 'Industry Authority', color: '#8B5CF6' },
    { icon: LocationIcon, label: 'Location', value: data.location || 'Global', color: '#10B981' }
  ];

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10000,
        padding: '24px'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        style={{
          width: '100%', maxWidth: '1000px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'row',
          height: '600px',
          maxHeight: '90vh',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute', top: '20px', right: '20px',
            width: '44px', height: '44px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid #f3f4f6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 50,
            color: '#6b7280',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F37346';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <CloseIcon />
        </button>

        {/* Left - Image Section */}
        <div style={{
          width: '50%',
          backgroundColor: '#12163E',
          backgroundImage: 'url(/images/popup-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          overflow: 'hidden'
        }}>
          
          <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {images.length > 1 ? (
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                speed={500}
                loop={true}
                style={{ width: '100%', height: '100%' }}
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#ffffff',
                      border: '12px solid #171717',
                      boxShadow: 'inset 0 0 0 2px #d4af37, 0 35px 60px -15px rgba(0,0,0,0.8)',
                      maxWidth: '85%',
                      maxHeight: '85%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img 
                        src={img} 
                        alt={`${data.title} - ${idx + 1}`} 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', border: '1px solid #e5e5e5' }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div style={{
                padding: '16px',
                backgroundColor: '#ffffff',
                border: '12px solid #171717',
                boxShadow: 'inset 0 0 0 2px #d4af37, 0 35px 60px -15px rgba(0,0,0,0.8)',
                maxWidth: '85%',
                maxHeight: '85%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={images[0]} 
                  alt={data.title} 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', border: '1px solid #e5e5e5' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right - Content Section */}
        <div style={{
          width: '50%',
          padding: '40px',
          overflowY: 'auto',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* Top Label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', fontWeight: 600, color: '#F37346',
            textTransform: 'uppercase', letterSpacing: '3px',
            marginBottom: '16px', fontFamily: "'Inter', sans-serif"
          }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '6px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrophyIcon />
            </span>
            Award Recognition
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: '32px', fontWeight: 'bold', color: '#2A2A75',
            marginBottom: '8px', fontFamily: "'Inter', sans-serif",
            lineHeight: 1.15, letterSpacing: '-0.3px'
          }}>
            {data.title || data.name}
          </h2>

          {/* Description */}
          <p style={{
            fontSize: '15px', color: '#6b7280', lineHeight: 1.6,
            marginBottom: '32px', fontFamily: "'Inter', sans-serif"
          }}>
            {data.description}
          </p>

          {/* Info Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px'
          }}>
            {infoItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  backgroundColor: '#f9fafb', border: '1px solid #f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color, flexShrink: 0
                }}>
                  <item.icon />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px', fontFamily: "'Inter', sans-serif" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', fontFamily: "'Inter', sans-serif" }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Highlights */}
          {data.highlights && data.highlights.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px', fontFamily: "'Inter', sans-serif" }}>
                Key Highlights
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {data.highlights.map((highlight, index) => (
                  <span key={index} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    backgroundColor: '#f3f4f6', color: '#4b5563',
                    padding: '6px 12px', borderRadius: '9999px',
                    fontSize: '13px', fontWeight: 500, fontFamily: "'Inter', sans-serif"
                  }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#F37346' }} />
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            paddingTop: '24px', borderTop: '1px solid #f3f4f6', marginTop: 'auto'
          }}>
            <button 
              onClick={handleDownload}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                backgroundColor: '#F37346', color: '#ffffff',
                padding: '14px 28px', borderRadius: '12px',
                fontSize: '15px', fontWeight: 600,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(243,115,70,0.2)',
                transition: 'all 0.3s ease',
                flex: 1, fontFamily: "'Inter', sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e06034';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(243,115,70,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F37346';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(243,115,70,0.2)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Award Image
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AwardPopup;