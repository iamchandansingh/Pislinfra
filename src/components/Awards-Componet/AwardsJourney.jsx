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
      <section className="py-0 pb-0" style={{ paddingBottom: '80px', paddingTop: '40px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 20px' }}>
          
          <div className="awards-journey-container" style={{
            width: '100%',
            backgroundColor: '#12163E', // Very dark blue from screenshot
            backgroundImage: `radial-gradient(circle at 70% 30%, rgba(255,255,255,0.03) 0%, transparent 40%)`,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            textAlign: 'left',
            padding: '20px 24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '40px'
          }}>
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
            <div className="awards-journey-image" style={{ position: 'relative', zIndex: 1, width: '140px', height: '140px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/golden_trophy.png" alt="Trophy" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px' }} />
              {/* Simple Pedestal base shadow */}
              <div style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '15px', background: 'rgba(0,0,0,0.4)', borderRadius: '50%', filter: 'blur(8px)', zIndex: -1 }}></div>
            </div>

            {/* Center Text */}
            <div className="awards-journey-text" style={{ position: 'relative', zIndex: 1, flex: '0 1 auto', padding: '0 20px', minWidth: '300px' }}>
              <h4 style={{ color: '#F37346', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>
                PARTNER WITH AN
              </h4>
              <h2 style={{ color: '#FFFFFF', fontSize: '38px', fontWeight: 600, fontFamily: "'Georgia', serif", lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.5px' }} dangerouslySetInnerHTML={{ __html: title || "Award-Winning<br />Organization" }} />
              <p style={{ color: '#E5E7EB', fontSize: '15px', fontWeight: 400, fontFamily: "'Inter', sans-serif", margin: 0, maxWidth: '400px' }}>{desc || "Let's build a stronger, smarter and sustainable future together."}</p>
            </div>

            {/* Right Buttons */}
            <div className="awards-journey-buttons" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0, minWidth: '220px', marginLeft: 'auto' }}>
              <button onClick={onContactClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#F37346', color: '#FFFFFF', padding: '14px 24px', borderRadius: '6px', border: 'none', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.3s' }}>
                Contact Us Today <ArrowRightIcon />
              </button>
              <button onClick={onViewProjects} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', color: '#FFFFFF', padding: '14px 24px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.3s' }}>
                View Our Projects <ArrowRightIcon />
              </button>
            </div>
            
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .awards-journey-container {
            padding: 20px 16px !important;
            flex-direction: column !important;
            text-align: center !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 24px !important;
          }
          .awards-journey-text {
            min-width: 100% !important;
            padding: 0 !important;
          }
          .awards-journey-buttons {
            margin-left: 0 !important;
            width: 100% !important;
          }
          .awards-journey-buttons button {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AwardsJourney;