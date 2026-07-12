import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiGrid, FiAlertTriangle, FiSettings, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import caseStudies from '../../data/caseStudies';

const FeaturedCaseStudy = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const featured = caseStudies.find(c => c.slug === 'pragati-farukhnagar-logistics') || caseStudies[0];

  if (!featured) return null;

  // Real images from case study data
  const slideImages = [
    { id: 1, url: featured.image, alt: featured.title },
    { id: 2, url: featured.engagementImage || featured.image, alt: 'Engagement' },
    { id: 3, url: featured.challengesImage || featured.image, alt: 'Challenges' },
    { id: 4, url: featured.achievementsImage || featured.image, alt: 'Achievements' },
  ];

  const projectInfo = [
    { id: 'client', icon: <FiUser size={13} />, label: 'Client', value: featured.developer || 'N/A' },
    { id: 'location', icon: <FiMapPin size={13} />, label: 'Location', value: featured.location || 'N/A' },
    { id: 'area', icon: <FiGrid size={13} />, label: 'Area', value: featured.buildUpArea || featured.plinthArea || 'N/A' },
  ];

  const csrCards = [
    { id: 'challenge', icon: <FiAlertTriangle size={16} />, title: 'Challenge', description: 'Local Villagers Interference & Consequent Delays' },
    { id: 'solution', icon: <FiSettings size={16} />, title: 'Solution', description: 'Detailed Planning & Project Scheduling' },
    { id: 'result', icon: <FiTrendingUp size={16} />, title: 'Result', description: 'Successfully completed despite multiple challenges' },
  ];

  const handleCardClick = () => {
    navigate(`/projects/case-study/${featured.slug}`);
  };

  return (
    <div style={{ width: '100%', padding: '20px 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '97%', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="featured-container" onClick={handleCardClick} style={{
          backgroundColor: '#FFFFFF', borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '16px', display: 'grid', gridTemplateColumns: '45% 55%',
          gap: '24px', overflow: 'hidden', cursor: 'pointer',
        }}>
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
            <div className="slide-image" style={{
              width: '100%', height: '100%', minHeight: '390px',
              backgroundImage: `url(${slideImages[currentSlide].url})`,
              backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '12px',
            }} />
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: '#1E293B', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              {currentSlide + 1} / {slideImages.length}
            </div>
          </div>

          {/* Right Content Column with padding side safety */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '390px', overflow: 'hidden', paddingRight: '24px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#FF6B35', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Inter, sans-serif' }}>Featured Case Study</span>
            
            {/* Title size slightly adjusted to fit nicely */}
            <h2 style={{ fontSize: 'clamp(18px, 2vw, 22px)', fontWeight: 800, lineHeight: 1.2, color: '#0A2A66', margin: '0 0 12px 0', fontFamily: 'Inter, sans-serif' }}>{featured.title}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {projectInfo.map((info, index) => (
                <React.Fragment key={info.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#FF6B35', display: 'flex' }}>{info.icon}</span>
                    <div>
                      <p style={{ fontSize: '8.5px', fontWeight: 500, color: '#9CA3AF', margin: '0 0 1px 0', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif' }}>{info.label}</p>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: '#374151', margin: 0, fontFamily: 'Inter, sans-serif' }}>{info.value}</p>
                    </div>
                  </div>
                  {index < projectInfo.length - 1 && <div style={{ width: '1px', height: '12px', backgroundColor: '#E5E7EB' }} />}
                </React.Fragment>
              ))}
            </div>

            {/* Description font size refined with clear spacing */}
            <p style={{ fontSize: '12px', fontWeight: 400, lineHeight: 1.55, color: '#4B5563', margin: '0 0 16px 0', marginRight: '12px', fontFamily: 'Inter, sans-serif' }}>
              {featured.introduction || featured.overview || featured.excerpt || 'Pislinfra built 12 Lakh sq. ft. Flipkart logistics park for Morgan Stanley in Farrukhnagar. Features first underground fire tunnel, completed despite NGT ban & challenges.'}
            </p>

            {/* Grid layout sizes decreased for a precise look */}
            <div className="csr-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '18px', width: '100%' }}>
              {csrCards.map((card) => (
                <div key={card.id} style={{ borderLeft: '2px solid #E2E8F0', paddingLeft: '8px', paddingRight: '6px', minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ color: '#FF6B35', marginBottom: '4px', display: 'flex' }}>{card.icon}</div>
                  <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#0A2A66', margin: '0 0 3px 0', fontFamily: 'Inter, sans-serif' }}>{card.title}</h4>
                  <p style={{ fontSize: '10px', fontWeight: 400, lineHeight: 1.4, color: '#6B7280', margin: 0, fontFamily: 'Inter, sans-serif', wordBreak: 'break-word' }}>{card.description}</p>
                </div>
              ))}
            </div>

            {/* Flat Shape Action Button */}
            <button onClick={(e) => { e.stopPropagation(); navigate(`/projects/case-study/${featured.slug}`); }} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', height: '36px', padding: '0 16px',
              backgroundColor: '#0A2A66', color: '#FFFFFF', border: 'none', borderRadius: '6px',
              fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              alignSelf: 'flex-start',
            }}>
              Read Full Case Study <FiArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .featured-container {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 12px !important;
          }
          .slide-image {
            min-height: 220px !important;
          }
          .csr-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FeaturedCaseStudy;