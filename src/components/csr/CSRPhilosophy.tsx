import React, { useState, useEffect } from 'react';

const getImageUrl = (img) => {
  if (!img) return null;
  return img.url?.startsWith('http') ? img.url : `${img.url}`;
};

const CSRPhilosophy = ({ title, description, images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const csrImages = images && images.length > 0 ? images.map(img => getImageUrl(img)) : ['/images/CSR/CSR-(5).png', '/images/CSR/CSR-(3).png', '/images/CSR/CSR-(1).png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % csrImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [csrImages.length]);

  return (
    <div style={{ width: '100%', padding: '50px 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        
        <div className="phil-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '50px',
          alignItems: 'center',
        }}>
          
          <div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#052A73', lineHeight: 1.15, letterSpacing: '-1px', margin: '0', fontFamily: 'Inter, sans-serif' }} dangerouslySetInnerHTML={{ __html: (title || 'Creating Sustainable<br />Communities').replace(/\n/g, '<br />') }}></h2>
            <p style={{ fontSize: '14px', fontWeight: 400, color: '#64748B', lineHeight: 1.7, maxWidth: '500px', margin: '18px 0 0 0', fontFamily: 'Inter, sans-serif' }}>{description || 'Our CSR philosophy is built on the foundation of sustainable development, inclusive growth, and social equity. We focus on initiatives that empower communities, enhance quality of life, and contribute to a better, greener future.'}</p>
          </div>

          <div style={{ 
            height: '340px', 
            width: '100%',
            borderRadius: '14px', 
            overflow: 'hidden', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            position: 'relative',
            border: '3px solid #ff8755',
          }}>
            {csrImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`CSR ${index + 1}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: currentSlide === index ? 1 : 0,
                  transition: 'opacity 1s ease-in-out',
                }}
              />
            ))}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              zIndex: 2,
            }}>
              {csrImages.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: index === currentSlide ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: index === currentSlide ? '#FF6B35' : 'rgba(255,255,255,0.7)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
      <style>{`
        @media (max-width: 1024px) { .phil-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
      `}</style>
    </div>
  );
};

export default CSRPhilosophy;
