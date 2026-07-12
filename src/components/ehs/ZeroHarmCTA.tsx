import React from 'react';
import { FiDownload, FiShield, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const EHSHero: React.FC = () => {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '520px',
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

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(0, 21, 77, 0.92) 0%, rgba(0, 21, 77, 0.75) 35%, rgba(0, 21, 77, 0.20) 100%)',
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
        <div style={{ flex: 1, maxWidth: '65%' }}>
          
          {/* Breadcrumb */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '20px',
            fontFamily: 'Inter, sans-serif',
          }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Home</Link>
            <FiChevronRight size={14} />
            <Link to="/about" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>About Us</Link>
            <FiChevronRight size={14} />
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>EHS Standards</span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(42px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: '#FFFFFF',
            margin: '0 0 20px 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            EHS Standards
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(20px, 3vw, 24px)',
            fontWeight: 600,
            color: '#FFFFFF',
            margin: '0 0 24px 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            Environment, Health & Safety Standards
          </p>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.90)',
            maxWidth: '620px',
            margin: '0 0 32px 0',
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
            height: '56px',
            padding: '0 30px',
            backgroundColor: 'transparent',
            border: '2px solid rgba(255,255,255,0.35)',
            borderRadius: '12px',
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
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
            Download EHS Policy
            <FiDownload size={18} />
          </button>

        </div>

        {/* Right Side - Commitment Card */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          right: '16px',
          width: '320px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '30px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          zIndex: 3,
        }}
        className="commitment-card">
          
          {/* Icon */}
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#E8F9EE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <FiShield size={28} color="#22C55E" />
          </div>

          {/* Label */}
          <p style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#22C55E',
            margin: '0 0 8px 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            Our Commitment
          </p>

          {/* Card Title */}
          <h3 style={{
            fontSize: '34px',
            fontWeight: 800,
            lineHeight: 1.2,
            color: '#16A34A',
            margin: '0 0 12px 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            ZERO HARM<br />IS POSSIBLE®
          </h3>

          {/* Card Description */}
          <p style={{
            fontSize: '16px',
            lineHeight: 1.7,
            color: '#6B7280',
            margin: 0,
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
            marginTop: 24px;
          }
        }
      `}</style>
    </section>
  );
};

export default EHSHero;