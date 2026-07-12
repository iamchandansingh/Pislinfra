import React from 'react';
import { FiDownload, FiShield, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const EHSHero: React.FC = () => {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '620px',
      overflow: 'hidden',
    }}>
      
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }} />

      {/* Dark Blue Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(0,21,77,0.95) 0%, rgba(0,21,77,0.85) 40%, rgba(0,21,77,0.20) 100%)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 16px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}>
        
        {/* Left Content */}
        <div style={{ maxWidth: '58%' }}>
          
          {/* Breadcrumb */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.80)',
            marginBottom: '28px',
            fontFamily: 'Inter, sans-serif',
          }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.80)', textDecoration: 'none' }}>Home</Link>
            <FiChevronRight size={13} />
            <Link to="/about" style={{ color: 'rgba(255,255,255,0.80)', textDecoration: 'none' }}>About Us</Link>
            <FiChevronRight size={13} />
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>EHS Standards</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(48px, 7vw, 78px)',
            fontWeight: 800,
            lineHeight: 1,
            color: '#FFFFFF',
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-2px',
          }}>
            EHS Standards
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(20px, 2.5vw, 26px)',
            fontWeight: 600,
            color: '#FFFFFF',
            margin: '18px 0 0 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            Environment, Health & Safety Standards
          </p>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(16px, 1.8vw, 18px)',
            lineHeight: 1.9,
            color: 'rgba(255,255,255,0.90)',
            maxWidth: '620px',
            margin: '22px 0 0 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            Creating a safe workplace, protecting the environment and promoting 
            health & well-being for a sustainable tomorrow.
          </p>

          {/* Download Button */}
          <button style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            height: '58px',
            padding: '0 30px',
            backgroundColor: 'transparent',
            border: '2px solid rgba(255,255,255,0.35)',
            borderRadius: '12px',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            marginTop: '32px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.color = '#0A2A66';
            e.currentTarget.style.borderColor = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
          }}>
            <FiDownload size={20} />
            Download EHS Policy
          </button>

        </div>

        {/* Floating Commitment Card - Bottom Right */}
        <div className="commitment-card" style={{
          position: 'absolute',
          bottom: '30px',
          right: '20px',
          width: '360px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
          zIndex: 3,
        }}>
          
          {/* Large Green Shield Icon */}
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: '#ECFDF5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FiShield size={34} color="#22C55E" />
          </div>

          {/* Small Label */}
          <p style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#22C55E',
            margin: '18px 0 0 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            Our Commitment
          </p>

          {/* Main Card Title */}
          <h3 style={{
            fontSize: 'clamp(30px, 3.5vw, 38px)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: '#16A34A',
            margin: '14px 0 0 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            ZERO HARM<br />IS POSSIBLE®
          </h3>

          {/* Card Description */}
          <p style={{
            fontSize: '16px',
            lineHeight: 1.8,
            color: '#6B7280',
            margin: '16px 0 0 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            For people, environment and communities.
          </p>

        </div>

      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .commitment-card {
            position: static !important;
            width: 100% !important;
            margin-top: 32px;
          }
        }
      `}</style>
    </section>
  );
};

export default EHSHero;