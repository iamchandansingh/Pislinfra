import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiArrowRight } from 'react-icons/fi';

const CSRCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="csr-cta-section">
      <div className="csr-cta-wrapper">
        
        <div className="cta-banner">
          
          <div className="cta-icon">
            <FiUsers size={64} color="rgba(255,255,255,0.30)" strokeWidth={1.5} />
          </div>

          <div className="cta-text">
            <h2 className="cta-heading">
              Together, we can build a <span style={{ color: '#FF7A1A' }}>better tomorrow</span>
            </h2>
            <p className="cta-sub">
              Partner with us in our journey to create a positive impact on society.
            </p>
          </div>

          <div className="cta-btn-wrap">
            <button 
              onClick={() => navigate('/contact-us')}
              className="cta-action-btn"
            >
              Partner With Us
              <FiArrowRight size={16} color="#FF7A1A" />
            </button>
          </div>

        </div>

      </div>

      <style>{`
        .csr-cta-section {
          width: 100%;
          padding: 30px 0 46px 0;
          background-color: #FFFFFF;
        }
        .csr-cta-wrapper {
          width: 98%;
          max-width: 1370px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .cta-banner {
          height: 120px;
          width: 100%;
          background: linear-gradient(135deg, #0A0D6F 0%, #12106E 100%);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
          padding: 0 32px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
        }
        .cta-icon {
          width: 10%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cta-text {
          width: 60%;
          padding-left: 16px;
          box-sizing: border-box;
        }
        .cta-heading {
          font-size: clamp(22px, 2.5vw, 30px);
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.2;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }
        .cta-sub {
          font-size: 14px;
          font-weight: 400;
          color: rgba(255,255,255,0.82);
          line-height: 1.5;
          margin: 6px 0 0 0;
          font-family: 'Inter', sans-serif;
        }
        .cta-btn-wrap {
          width: 30%;
          display: flex;
          justify-content: flex-end;
          flex-shrink: 0;
        }
        .cta-action-btn {
          height: 48px;
          min-width: 190px;
          padding: 0 24px;
          background-color: #FFFFFF;
          color: #052A73;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        @media (max-width: 900px) {
          .csr-cta-section {
            padding: 20px 0 36px 0 !important;
          }
          .csr-cta-wrapper {
            padding: 0 16px !important;
          }
          .cta-banner { 
            height: auto !important; 
            padding: 28px 20px !important; 
            flex-direction: column !important; 
            gap: 16px !important; 
            text-align: center; 
            border-radius: 16px !important;
          }
          .cta-icon, .cta-text, .cta-btn-wrap { 
            width: 100% !important; 
            justify-content: center !important; 
            padding-left: 0 !important; 
          }
          .cta-icon svg { 
            width: 44px !important; 
            height: 44px !important; 
          }
          .cta-heading { 
            font-size: clamp(20px, 5.2vw, 24px) !important; 
            line-height: 1.25 !important;
          }
          .cta-sub { 
            font-size: 13px !important; 
            margin-top: 8px !important;
          }
          .cta-action-btn { 
            width: 100% !important; 
            max-width: 280px !important; 
            height: 46px !important;
          }
        }

        @media (max-width: 380px) {
          .csr-cta-wrapper {
            padding: 0 12px !important;
          }
          .cta-banner {
            padding: 22px 14px !important;
          }
          .cta-heading {
            font-size: 18.5px !important;
          }
          .cta-sub {
            font-size: 12px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CSRCTA;