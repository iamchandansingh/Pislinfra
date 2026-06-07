import React, { useState } from 'react';
import { FiUser, FiMapPin, FiGrid, FiAlertTriangle, FiSettings, FiTrendingUp, FiArrowRight } from 'react-icons/fi';

// Types
interface SlideImage { id: number; url: string; alt: string; }
interface ProjectInfo { id: string; icon: React.ReactNode; label: string; value: string; }
interface CSRCard { id: string; icon: React.ReactNode; title: string; description: string; }

// Slide Images
const slideImages: SlideImage[] = [
  { id: 1, url: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Logistics Park View 1' },
  { id: 2, url: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Logistics Park View 2' },
  { id: 3, url: 'https://images.pexels.com/photos/3777190/pexels-photo-3777190.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Logistics Park View 3' },
  { id: 4, url: 'https://images.pexels.com/photos/159306/pexels-photo-159306.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Logistics Park View 4' },
];

const projectInfo: ProjectInfo[] = [
  { id: 'client', icon: <FiUser size={14} />, label: 'Client', value: 'Pragati Group' },
  { id: 'location', icon: <FiMapPin size={14} />, label: 'Location', value: 'Farrukhnagar, Haryana' },
  { id: 'area', icon: <FiGrid size={14} />, label: 'Area', value: '12.73 Lakh Sq. Ft.' },
];

const csrCards: CSRCard[] = [
  { id: 'challenge', icon: <FiAlertTriangle size={18} />, title: 'Challenge', description: 'Tight 14-month timeline with complex terrain and multi-stakeholder coordination.' },
  { id: 'solution', icon: <FiSettings size={18} />, title: 'Solution', description: 'Phased construction with advanced project management and modular techniques.' },
  { id: 'result', icon: <FiTrendingUp size={18} />, title: 'Result', description: 'Delivered ahead of schedule with 20% cost optimization and zero incidents.' },
];

const FeaturedCaseStudy: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div style={{ width: '100%', padding: '20px 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '97%', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="featured-container" style={{
          backgroundColor: '#FFFFFF', borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9',
          padding: '16px', display: 'grid', gridTemplateColumns: '48% 52%',
          gap: '28px', overflow: 'hidden',
        }}>
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
            <div className="slide-image" style={{
              width: '100%', height: '100%', minHeight: '380px',
              backgroundImage: `url(${slideImages[currentSlide].url})`,
              backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '16px',
            }} />
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', color: '#FFFFFF', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              {currentSlide + 1} / {slideImages.length}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '380px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: '#FF6B35', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Inter, sans-serif' }}>Featured Case Study</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, lineHeight: 1.15, color: '#0A2A66', margin: '0 0 10px 0', fontFamily: 'Inter, sans-serif' }}>Pragati Farrukhnagar Logistics Park</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {projectInfo.map((info, index) => (
                <React.Fragment key={info.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#FF6B35', display: 'flex' }}>{info.icon}</span>
                    <div>
                      <p style={{ fontSize: '9px', fontWeight: 500, color: '#9CA3AF', margin: '0 0 1px 0', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif' }}>{info.label}</p>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#374151', margin: 0, fontFamily: 'Inter, sans-serif' }}>{info.value}</p>
                    </div>
                  </div>
                  {index < projectInfo.length - 1 && <div style={{ width: '1px', height: '14px', backgroundColor: '#E5E7EB' }} />}
                </React.Fragment>
              ))}
            </div>

            <p style={{ fontSize: '13px', fontWeight: 400, lineHeight: 1.6, color: '#4B5563', margin: '0 0 12px 0', fontFamily: 'Inter, sans-serif' }}>
              A state-of-the-art logistics park developed to streamline supply chain operations with advanced infrastructure, efficient design, and sustainable practices.
            </p>

            <div className="csr-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
              {csrCards.map((card) => (
                <div key={card.id} style={{ borderLeft: '2px solid #F3F4F6', paddingLeft: '10px', cursor: 'default' }}>
                  <div style={{ color: '#FF6B35', marginBottom: '4px' }}>{card.icon}</div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0A2A66', margin: '0 0 2px 0', fontFamily: 'Inter, sans-serif' }}>{card.title}</h4>
                  <p style={{ fontSize: '11px', fontWeight: 400, lineHeight: 1.5, color: '#6B7280', margin: 0, fontFamily: 'Inter, sans-serif' }}>{card.description}</p>
                </div>
              ))}
            </div>

            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', height: '40px', padding: '0 20px',
              backgroundColor: '#0A2A66', color: '#FFFFFF', border: 'none', borderRadius: '8px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              alignSelf: 'flex-start', boxShadow: '0 2px 8px rgba(10,42,102,0.2)',
            }}>
              Read Full Case Study <FiArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCaseStudy;