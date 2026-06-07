import React from 'react';
import { ArrowRight } from 'lucide-react';

// Main Component
const FeaturedArticleSection: React.FC = () => {
  return (
    <div style={{ width: '100%', marginTop: '40px', marginBottom: '32px' }}>
      <div style={{ 
        maxWidth: '1300px', 
        margin: '0 auto', 
        paddingLeft: '16px', 
        paddingRight: '16px',
      }}>
        
        {/* Section Title */}
        <h2 style={{
          fontSize: '40px',
          fontWeight: 700,
          lineHeight: 1.2,
          color: '#1E2A5A',
          fontFamily: 'Inter, sans-serif',
          marginBottom: '24px',
        }}>
          Featured Article
        </h2>

        {/* Main Card */}
        <div 
          className="featured-card"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5EAF2',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(15,23,42,0.03)',
            height: '360px',
          }}
        >
          
          {/* LEFT - Content */}
          <div style={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            
            {/* Top Row - Badge + Date */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '26px',
                padding: '0 12px',
                backgroundColor: '#0B1450',
                color: '#FFFFFF',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Infrastructure
              </span>

              <span style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#64748B',
                fontFamily: 'Inter, sans-serif',
                marginLeft: '16px',
              }}>
                05 Jun 2026
              </span>
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '30px',
              fontWeight: 700,
              lineHeight: 1.3,
              color: '#1E2A5A',
              fontFamily: 'Inter, sans-serif',
              marginTop: '20px',
              marginBottom: 0,
            }}>
              Future of Infrastructure Development in India
            </h3>

            {/* Description */}
            <p style={{
              fontSize: '15px',
              fontWeight: 400,
              lineHeight: 1.7,
              color: '#64748B',
              fontFamily: 'Inter, sans-serif',
              marginTop: '14px',
              marginBottom: 0,
            }}>
              Exploring the latest trends and technologies shaping the infrastructure 
              sector and driving India's growth story.
            </p>

            {/* Read Article */}
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#FF6B35',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
                marginTop: '20px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              Read Article
              <ArrowRight size={16} />
            </a>

          </div>

          {/* RIGHT - Image */}
          <div 
            className="featured-image"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#1E2A5A',
              height: '100%',
              minHeight: '250px',
            }}
          />

        </div>

      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .featured-card {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .featured-image {
            height: 250px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FeaturedArticleSection;