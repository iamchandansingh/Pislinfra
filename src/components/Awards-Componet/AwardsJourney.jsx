import React from 'react';

 

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const AwardsJourney = ({ onContactClick, onViewProjects, title, desc }) => {
  return (
    <div className="bg-white">

      {/* CTA Section */}
      <section className="awards-journey-section">
        <div className="awards-journey-wrapper">
          
          <div className="awards-journey-container">
            {/* Background Elements (Confetti & Buildings Simulation) */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
              {/* Confetti */}
              <div style={{ position: 'absolute', top: '20%', left: '30%', width: '12px', height: '12px', background: '#F59E0B', transform: 'rotate(45deg)' }}></div>
              <div style={{ position: 'absolute', top: '70%', left: '25%', width: '8px', height: '8px', background: '#D97706', transform: 'rotate(20deg)' }}></div>
              <div style={{ position: 'absolute', top: '30%', right: '40%', width: '14px', height: '8px', background: '#F59E0B', transform: 'rotate(-30deg)' }}></div>
              <div style={{ position: 'absolute', top: '80%', right: '35%', width: '10px', height: '10px', background: '#D97706', transform: 'rotate(60deg)' }}></div>
              <div style={{ position: 'absolute', top: '40%', right: '15%', width: '12px', height: '12px', background: '#F59E0B', transform: 'rotate(15deg)' }}></div>
              <div style={{ position: 'absolute', top: '15%', left: '60%', width: '8px', height: '14px', background: '#D97706', transform: 'rotate(-45deg)' }}></div>
              <div style={{ position: 'absolute', top: '10%', right: '8%', width: '10px', height: '10px', background: '#F59E0B', transform: 'rotate(80deg)' }}></div>
              
              {/* Wireframe Buildings using SVG */}
              <svg style={{ position: 'absolute', bottom: '-10px', left: '45%', height: '120%', opacity: 0.05 }} viewBox="0 0 200 200" preserveAspectRatio="xMidYMax meet">
                <path d="M50 200V80h40v120M60 90h20v10H60zM60 110h20v10H60zM60 130h20v10H60zM60 150h20v10H60zM60 170h20v10H60z" stroke="#FFF" strokeWidth="2" fill="none"/>
                <path d="M90 200V50h50v150M100 60h30v10h-30zM100 80h30v10h-30zM100 100h30v10h-30zM100 120h30v10h-30zM100 140h30v10h-30zM100 160h30v10h-30zM100 180h30v10h-30z" stroke="#FFF" strokeWidth="2" fill="none"/>
                <path d="M140 200v-90h40v90M150 120h20v10h-20zM150 140h20v10h-20zM150 160h20v10h-20zM150 180h20v10h-20z" stroke="#FFF" strokeWidth="2" fill="none"/>
                <path d="M10 200v-70h40v70M20 140h20v10H20zM20 160h20v10H20zM20 180h20v10H20z" stroke="#FFF" strokeWidth="2" fill="none"/>
              </svg>
            </div>

            {/* Left Trophy Image */}
            <div className="awards-journey-image">
              <img src="/golden_trophy.png" alt="Trophy" />
              {/* Simple Pedestal base shadow */}
              <div className="awards-pedestal-shadow"></div>
            </div>

            {/* Center Text */}
            <div className="awards-journey-text">
              <span className="awards-journey-eyebrow">
                PARTNER WITH AN
              </span>
              <h2 className="awards-journey-heading" dangerouslySetInnerHTML={{ __html: title || "Award-Winning<br />Organization" }} />
              <p className="awards-journey-desc">{desc || "Let's build a stronger, smarter and sustainable future together."}</p>
            </div>

            {/* Right Buttons */}
            <div className="awards-journey-buttons">
              <button onClick={onContactClick} className="awards-cta-btn primary" type="button">
                <span>Contact Us Today</span> <ArrowRightIcon />
              </button>
              <button onClick={onViewProjects} className="awards-cta-btn secondary" type="button">
                <span>View Our Projects</span> <ArrowRightIcon />
              </button>
            </div>
            
          </div>
        </div>
      </section>

      <style>{`
        .awards-journey-section {
          padding: 40px 0 80px 0;
          background: #FFFFFF;
          width: 100%;
          box-sizing: border-box;
        }
        .awards-journey-wrapper {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 20px;
          box-sizing: border-box;
          width: 100%;
        }
        .awards-journey-container {
          width: 100%;
          background-color: #12163E;
          background-image: radial-gradient(circle at 70% 30%, rgba(255,255,255,0.03) 0%, transparent 40%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          padding: 30px 36px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 16px 36px rgba(0,0,0,0.12);
          box-sizing: border-box;
          gap: 36px;
        }
        .awards-journey-image {
          position: relative;
          z-index: 1;
          width: 130px;
          height: 130px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .awards-journey-image img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          border-radius: 12px;
        }
        .awards-pedestal-shadow {
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 15px;
          background: rgba(0,0,0,0.4);
          border-radius: 50%;
          filter: blur(8px);
          z-index: -1;
        }
        .awards-journey-text {
          position: relative;
          z-index: 1;
          flex: 1;
          min-width: 0;
          box-sizing: border-box;
        }
        .awards-journey-eyebrow {
          display: block;
          color: #F37346;
          font-size: 12.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
          font-family: 'Inter', sans-serif;
        }
        .awards-journey-heading {
          color: #FFFFFF;
          font-size: clamp(26px, 3.2vw, 38px);
          font-weight: 700;
          font-family: 'Georgia', serif;
          line-height: 1.2;
          margin: 0 0 12px 0;
          letter-spacing: -0.4px;
        }
        .awards-journey-desc {
          color: #E2E8F0;
          font-size: 14.5px;
          font-weight: 400;
          font-family: 'Inter', sans-serif;
          margin: 0;
          max-width: 440px;
          line-height: 1.55;
        }
        .awards-journey-buttons {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-shrink: 0;
          min-width: 200px;
          margin-left: auto;
          box-sizing: border-box;
        }
        .awards-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 24px;
          border-radius: 8px;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: none !important;
          box-sizing: border-box;
          text-decoration: none;
        }
        .awards-cta-btn.primary {
          background: #F37346;
          color: #FFFFFF;
          border: none;
        }
        .awards-cta-btn.secondary {
          background: transparent;
          color: #FFFFFF;
          border: 1px solid rgba(255,255,255,0.45);
        }

        @media (max-width: 900px) {
          .awards-journey-container {
            flex-direction: column !important;
            text-align: center !important;
            padding: 28px 20px !important;
            gap: 22px !important;
          }
          .awards-journey-image {
            width: 100px !important;
            height: 100px !important;
            margin: 0 auto !important;
          }
          .awards-journey-text {
            width: 100% !important;
            padding: 0 !important;
          }
          .awards-journey-desc {
            max-width: 100% !important;
            margin: 0 auto !important;
          }
          .awards-journey-buttons {
            margin-left: 0 !important;
            width: 100% !important;
            max-width: 360px !important;
            gap: 10px !important;
          }
          .awards-cta-btn {
            width: 100% !important;
          }
        }

        @media (max-width: 768px) {
          .awards-journey-section {
            padding: 25px 0 50px 0 !important;
          }
          .awards-journey-wrapper {
            padding: 0 16px !important;
          }
          .awards-journey-container {
            padding: 24px 16px !important;
            border-radius: 14px !important;
          }
          .awards-journey-heading {
            font-size: clamp(22px, 6vw, 30px) !important;
          }
          .awards-journey-buttons {
            max-width: 100% !important;
          }
        }

        @media (max-width: 500px) {
          .awards-journey-wrapper {
            padding: 0 12px !important;
          }
          .awards-journey-container {
            padding: 20px 14px !important;
            gap: 18px !important;
          }
          .awards-journey-heading {
            font-size: clamp(21px, 6.5vw, 26px) !important;
          }
          .awards-journey-desc {
            font-size: 13.5px !important;
          }
          .awards-cta-btn {
            padding: 12px 18px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AwardsJourney;