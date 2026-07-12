import React from 'react';
import { FiAward, FiShield, FiStar, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AwardsHero: React.FC = () => {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '520px',
      overflow: 'hidden',
    }}>
      
      {/* Background Trophy Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '45%',
        height: '100%',
        backgroundImage: 'url(https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }} />

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(3,15,68,0.98) 0%, rgba(3,15,68,0.90) 45%, rgba(3,15,68,0.55) 75%, rgba(3,15,68,0.25) 100%)',
        zIndex: 1,
      }} />

      {/* Content Wrapper */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1370px',
        margin: '0 auto',
        padding: '0 24px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}>
        
        {/* Left Content - 55% */}
        <div style={{ maxWidth: '55%' }}>
          
          {/* Breadcrumb */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.75)',
            fontFamily: 'Inter, sans-serif',
          }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Home</Link>
            <FiChevronRight size={14} />
            <Link to="/about" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>About Us</Link>
            <FiChevronRight size={14} />
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Awards & Accolades</span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(42px, 6vw, 72px)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.05,
            letterSpacing: '-2px',
            margin: '20px 0 0 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            Awards & Accolades
          </h1>

          {/* Orange Accent Line */}
          <div style={{
            width: '60px',
            height: '4px',
            backgroundColor: '#FF6B35',
            borderRadius: '999px',
            marginTop: '20px',
          }} />

          {/* Description */}
          <p style={{
            fontSize: 'clamp(18px, 2vw, 22px)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 1.8,
            maxWidth: '650px',
            margin: '24px 0 0 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            Recognizing our commitment to excellence, safety, innovation and sustainable growth.
          </p>

          {/* Feature Highlights */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '60px',
            marginTop: '40px',
            flexWrap: 'wrap',
          }}>
            
            {/* Excellence */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiAward size={24} color="#FF6B35" strokeWidth={2} />
              <div>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0, fontFamily: 'Inter, sans-serif' }}>Excellence</p>
                <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', margin: '2px 0 0 0', fontFamily: 'Inter, sans-serif' }}>In Every Project</p>
              </div>
            </div>

            {/* Safety */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiShield size={24} color="#FF8A00" strokeWidth={2} />
              <div>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0, fontFamily: 'Inter, sans-serif' }}>Safety</p>
                <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', margin: '2px 0 0 0', fontFamily: 'Inter, sans-serif' }}>As Our Culture</p>
              </div>
            </div>

            {/* Impact */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiStar size={24} color="#FF6B35" strokeWidth={2} />
              <div>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0, fontFamily: 'Inter, sans-serif' }}>Impact</p>
                <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', margin: '2px 0 0 0', fontFamily: 'Inter, sans-serif' }}>That Matters</p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default AwardsHero;