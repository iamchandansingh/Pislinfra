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
  if (!isOpen || !certificateData) return null;

  // Use the standard schema keys if present, otherwise fallback to custom keys
  const certData = {
    name: certificateData.name || certificateData.title || 'Official Certificate',
    issuingAuthority: certificateData.issuer || certificateData.presentedBy || 'Governing Body',
    issueDate: certificateData.issueDate || certificateData.year || '2024',
    expiryDate: certificateData.expiryDate || 'Valid Indefinitely',
    country: certificateData.country || certificateData.location || 'Global',
    businessScope: certificateData.businessScope || certificateData.category || 'Professional Excellence',
    image: certificateData.image,
    gallery: certificateData.gallery || []
  };

  const images = certData.gallery && certData.gallery.length > 0 
    ? [certData.image, ...certData.gallery] 
    : [certData.image];

  const handleDownload = () => {
    window.open(certData.image, '_blank');
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

        {/* Left - Certificate Image */}
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
                        alt={`${certData.name} - ${idx + 1}`} 
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
                  alt={certData.name} 
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
            fontSize: '12px', fontWeight: 600, color: '#10B981',
            textTransform: 'uppercase', letterSpacing: '3px',
            marginBottom: '16px', fontFamily: "'Inter', sans-serif"
          }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '6px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <VerifiedIcon />
            </span>
            Verified Certification
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: '32px', fontWeight: 'bold', color: '#2A2A75',
            marginBottom: '32px', fontFamily: "'Inter', sans-serif",
            lineHeight: 1.15, letterSpacing: '-0.3px'
          }}>
            {certData.name}
          </h2>

          {/* Info Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px'
          }}>
            {infoItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  backgroundColor: item.green ? '#ecfdf5' : '#f9fafb',
                  border: `1px solid ${item.green ? '#d1fae5' : '#f3f4f6'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.green ? '#10B981' : item.color, flexShrink: 0
                }}>
                  <item.icon />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>
                    {item.label}
                  </div>
                  <div style={{ 
                    fontSize: '14px', fontWeight: 600, 
                    color: item.green ? '#10B981' : '#1f2937', 
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
            padding: '16px', backgroundColor: '#f8fafc', borderRadius: '16px',
            border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/ISO_Logo_%28Red_square%29.svg/1200px-ISO_Logo_%28Red_square%29.svg.png" alt="ISO" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '2px', fontFamily: "'Inter', sans-serif" }}>Internationally Recognized</div>
              <div style={{ fontSize: '12px', color: '#64748b', fontFamily: "'Inter', sans-serif" }}>Verified by Global Standards Organization</div>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            paddingTop: '24px', borderTop: '1px solid #f3f4f6', marginTop: 'auto'
          }}>
            <button 
              onClick={handleDownload}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                backgroundColor: '#2A2A75', color: '#ffffff',
                padding: '14px 28px', borderRadius: '12px',
                fontSize: '15px', fontWeight: 600,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(42,42,117,0.2)',
                transition: 'all 0.3s ease',
                flex: 1, fontFamily: "'Inter', sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1f1f56';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(42,42,117,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2A2A75';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(42,42,117,0.2)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Certificate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificatePopup;