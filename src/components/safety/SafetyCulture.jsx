import React from 'react';

const SafetyCulture = ({ title, desc }) => {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      padding: '60px 20px',
      maxWidth: '1370px',
      margin: '0 auto',
      backgroundColor: '#ffffff'
    }}>

      <div className="safety-culture-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '50px', 
        alignItems: 'center' 
      }}>
        
        {/* LEFT: Worker Image */}
        <div style={{
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
          height: '650px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="/images/safety/safety.png"
            alt="PISL Safety Worker" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              padding: '20px'
            }} 
          />
        </div>

        {/* RIGHT: Content */}
        <div style={{ paddingLeft: '10px' }}>
          
          {/* Safety Culture */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: '800',
              color: '#0a2a66',
              margin: '0 0 16px',
              letterSpacing: '-1px',
              lineHeight: 1.2
            }}>
              {title || <>Safety <span style={{ color: '#0a2a66' }}>Culture</span></>}
            </h2>
            
            <p style={{
              fontSize: '15px',
              lineHeight: '1.7',
              color: '#475569',
              margin: '0 0 16px'
            }}>
              {desc || "Safety is built through awareness, responsibility, and teamwork. Every individual is encouraged to follow proactive safety practices, maintain workplace discipline, and contribute towards a safer environment across every project."}
            </p>
            
            <p style={{
              fontSize: '15px',
              lineHeight: '1.7',
              color: '#475569',
              margin: 0
            }}>
              Continuous training sessions, toolbox talks, safety briefings, and operational planning help strengthen safety standards while protecting workers, teams, and surrounding communities.
            </p>
          </div>

          {/* Pre-Task Planning */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '20px 24px',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '17px',
              fontWeight: '700',
              color: '#0a2a66',
              margin: '0 0 8px'
            }}>
              Pre-Task Planning Resources
            </h3>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#64748b',
              margin: 0
            }}>
              The Pre-Task Planning (PTP) process ensures employees and subcontractors take ownership of safety goals, identify risks before work begins, and execute tasks with proper preparation and accountability.
            </p>
          </div>

          {/* PPE Guidelines */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px 24px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '17px',
              fontWeight: '700',
              color: '#0a2a66',
              margin: '0 0 12px'
            }}>
              PPE Requirements
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px 16px',
              fontSize: '13px',
              color: '#475569'
            }}>
              {[
                'Hard hat / Safety helmet',
                'High visibility vest',
                'Safety glasses with side shields',
                'Steel-toe safety boots',
                'Hearing protection (as needed)',
                'Cut-resistant gloves',
                'Full-length work pants',
                'Face shield (as needed)'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#0a2a66',
                    flexShrink: 0
                  }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .safety-culture-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 600px) {
          .safety-culture-grid {
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SafetyCulture;