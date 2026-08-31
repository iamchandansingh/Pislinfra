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

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const DocIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
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

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CertificatePopup = ({ isOpen, onClose, certificateData }) => {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  if (!isOpen || !certificateData) return null;

  const certData = {
    name: certificateData.name || certificateData.title || 'Certificate of Excellence',
    title: certificateData.title || certificateData.name,
    category: certificateData.category || 'Quality & Standards',
    issuingAuthority: certificateData.issuingAuthority || certificateData.presentedBy || 'Certification Body',
    issueDate: certificateData.issueDate || certificateData.year || '2024',
    expiryDate: certificateData.expiryDate || 'Lifetime',
    certificateNumber: certificateData.certificateNumber || certificateData.id || 'PISL-CERT-001',
    description: certificateData.description || certificateData.desc || 'Standard compliance and excellence certification achieved by Pragati Infra Solutions.',
    country: certificateData.country || certificateData.location || 'Global',
    businessScope: certificateData.businessScope || certificateData.category || 'Professional Excellence',
    image: certificateData.image,
    gallery: certificateData.gallery || []
  };

  const images = (certificateData.images && certificateData.images.length > 0)
    ? certificateData.images
    : (certData.gallery && certData.gallery.length > 0)
      ? [certData.image, ...certData.gallery] 
      : (certData.image ? [certData.image] : []);

  const currentImg = images[activeImageIndex] || images[0] || certData.image;

  const handleDownload = () => {
    window.open(currentImg || certData.image, '_blank');
  };

  const infoItems = [
    { icon: ShieldIcon, label: 'Issuing Authority', value: certData.issuingAuthority, color: '#3B82F6' },
    { icon: CalendarIcon, label: 'Issue Date', value: certData.issueDate, color: '#8B5CF6' },
    { icon: CalendarIcon, label: 'Expiry Date', value: certData.expiryDate, color: '#F59E0B' },
    { icon: ShieldIcon, label: 'Status', value: 'Active', green: true, color: '#10B981' },
    { icon: GlobeIcon, label: 'Country', value: certData.country, color: '#06B6D4' },
    { icon: DocIcon, label: 'Business Scope', value: certData.businessScope, color: '#6366F1' },
  ];

  return (
    <div 
      className="cert-popup-overlay"
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
        className="cert-popup-modal"
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
            e.currentTarget.style.backgroundColor = '#2A2A75';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <CloseIcon />
        </button>

        {/* Left - Certificate Image Section (Instant 0ms Display) */}
        <div 
          className="cert-popup-left"
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
                alt={certData.name} 
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

        {/* Right - Content Section with Sticky Fixed Footer */}
        <div 
          className="cert-popup-right"
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
              fontSize: '11.5px', fontWeight: 700, color: '#10B981',
              textTransform: 'uppercase', letterSpacing: '2px',
              marginBottom: '12px', fontFamily: "'Inter', sans-serif"
            }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '6px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <VerifiedIcon />
              </span>
              Verified Certification
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: 'clamp(20px, 2.2vw, 26px)', fontWeight: 800, color: '#1E2A5A',
              marginBottom: '20px', fontFamily: "'Inter', sans-serif",
              lineHeight: 1.25, letterSpacing: '-0.3px'
            }}>
              {certData.name}
            </h2>

            {/* Info Grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'
            }}>
              {infoItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    backgroundColor: item.green ? '#ecfdf5' : '#F8FAFC',
                    border: `1px solid ${item.green ? '#d1fae5' : '#E2E8F0'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.green ? '#10B981' : item.color, flexShrink: 0
                  }}>
                    <item.icon />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px', fontFamily: "'Inter', sans-serif" }}>
                      {item.label}
                    </div>
                    <div style={{ 
                      fontSize: '13px', fontWeight: 700, 
                      color: item.green ? '#10B981' : '#1E2A5A', 
                      fontFamily: "'Inter', sans-serif" 
                    }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Badge */}
            <div style={{
              padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '12px',
              border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '14px',
              marginBottom: '16px'
            }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/ISO_Logo_%28Red_square%29.svg/1200px-ISO_Logo_%28Red_square%29.svg.png" alt="ISO" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E2A5A', marginBottom: '2px', fontFamily: "'Inter', sans-serif" }}>Internationally Recognized</div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontFamily: "'Inter', sans-serif" }}>Verified by Global Standards Organization</div>
              </div>
            </div>
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
                backgroundColor: '#1E2A5A', color: '#ffffff',
                padding: '12px 24px', borderRadius: '10px',
                fontSize: '14.5px', fontWeight: 700,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(30,42,90,0.25)',
                transition: 'all 0.25s ease',
                width: '100%', fontFamily: "'Inter', sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#151e42';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(30,42,90,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E2A5A';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(30,42,90,0.25)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Certificate
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 850px) {
          .cert-popup-modal {
            flex-direction: column !important;
            height: auto !important;
            max-height: 90vh !important;
          }
          .cert-popup-left {
            width: 100% !important;
            height: 200px !important;
            padding: 12px !important;
          }
          .cert-popup-left img {
            max-height: 160px !important;
          }
          .cert-popup-right {
            width: 100% !important;
            max-height: calc(90vh - 200px) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CertificatePopup;