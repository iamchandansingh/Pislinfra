import React from 'react';

const Preloader = () => {
  return (
    <>
      <style>{`
        .preloader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          background-color: #ffffff;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 99999;
          font-family: sans-serif;
        }
        .spinner-ring {
          position: relative;
          width: 160px;
          height: 160px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          box-shadow: 0 0 60px rgba(0,0,0,0.02);
          background: #ffffff;
        }
        .spinner-ring img {
          width: 80px;
          height: auto;
          z-index: 10;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse-logo {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      <div className="preloader-container">
        <div className="spinner-ring">
          <img src="/logo.png" alt="PISL Logo" style={{ animation: 'pulse-logo 2s ease-in-out infinite', willChange: 'transform' }} />
          <svg viewBox="0 0 100 100" className="spinner-svg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', animation: 'spin 0.6s linear infinite', willChange: 'transform' }}>
            <circle cx="50" cy="50" r="47" fill="none" stroke="#F3F4F6" strokeWidth="0.5" />
            
            <g transform="rotate(-135 50 50)">
              <circle cx="50" cy="50" r="47" fill="none" stroke="#6B21A8" strokeWidth="1.2" strokeDasharray="40 255.5" strokeLinecap="round" />
              <circle cx="97" cy="50" r="1.5" fill="#6B21A8" />
            </g>
            
            <g transform="rotate(-45 50 50)">
              <circle cx="50" cy="50" r="47" fill="none" stroke="#16A34A" strokeWidth="1.2" strokeDasharray="40 255.5" strokeLinecap="round" />
              <circle cx="97" cy="50" r="1.5" fill="#16A34A" />
            </g>
            
            <g transform="rotate(45 50 50)">
              <circle cx="50" cy="50" r="47" fill="none" stroke="#DC2626" strokeWidth="1.2" strokeDasharray="40 255.5" strokeLinecap="round" />
              <circle cx="97" cy="50" r="1.5" fill="#DC2626" />
            </g>
            
            <g transform="rotate(135 50 50)">
              <circle cx="50" cy="50" r="47" fill="none" stroke="#F97316" strokeWidth="1.2" strokeDasharray="40 255.5" strokeLinecap="round" />
              <circle cx="97" cy="50" r="1.5" fill="#F97316" />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Preloader;
