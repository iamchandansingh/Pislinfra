import React from 'react';
import { FiUsers, FiArrowRight } from 'react-icons/fi';

const CSRCTA: React.FC = () => {
  return (
    <div style={{ width: '100%', padding: '30px 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        
        <div className="cta-banner" style={{
          height: '120px',
          width: '100%',
          background: 'linear-gradient(135deg, #0A0D6F 0%, #12106E 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
        }}>
          
          <div style={{ width: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiUsers size={70} color="rgba(255,255,255,0.30)" strokeWidth={1.5} />
          </div>

          <div style={{ width: '60%', paddingLeft: '16px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, margin: 0, fontFamily: 'Inter, sans-serif' }}>
              Together, we can build a <span style={{ color: '#FF7A1A' }}>better tomorrow</span>
            </h2>
            <p style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.80)', lineHeight: 1.5, margin: '6px 0 0 0', fontFamily: 'Inter, sans-serif' }}>
              Partner with us in our journey to create a positive impact on society.
            </p>
          </div>

          <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
            <button style={{
              height: '48px',
              width: '200px',
              backgroundColor: '#FFFFFF',
              color: '#052A73',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
            }}>
              Partner With Us
              <FiArrowRight size={16} color="#FF7A1A" />
            </button>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1100px) {
          .cta-banner { height: auto !important; padding: 24px !important; flex-direction: column !important; gap: 16px; text-align: center; }
          .cta-banner > div { width: 100% !important; justify-content: center !important; padding-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default CSRCTA;