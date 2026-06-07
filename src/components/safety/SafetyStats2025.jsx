import React from 'react';

const NAVY = '#28286e';
const ORANGE = '#ff8755';

const SafetyStats2025 = () => {
  const statsData = [
    { value: "5M+", label: "Safe Man-Hours Achieved" },
    { value: "0", label: "Major LTI Incidents" },
    { value: "100%", label: "Safety Compliance" },
    { value: "24/7", label: "Active Monitoring" },
    { value: "98%", label: "PPE Compliance Rate" },
    { value: "360°", label: "Safety Culture" },
  ];

  return (
    <div style={{
      backgroundColor: NAVY,
      color: '#ffffff',
      padding: '80px 40px',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: -100, right: -100,
        width: 400, height: 400,
        borderRadius: '50%',
        background: `${ORANGE}08`,
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '50px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        
        <div>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 44px)',
            fontWeight: '800',
            margin: '0 0 20px 0',
            letterSpacing: '-1px',
            color: '#ffffff',
            lineHeight: 1.2
          }}>
           PISL HSC <span style={{ color: ORANGE }}> Golden Role</span>
          </h2>

          <p style={{
            fontSize: '15px',
            lineHeight: '1.7',
            color: 'rgba(255,255,255,0.6)',
            margin: '0 0 48px 0',
            maxWidth: '520px'
          }}>
            Our Safety 360° philosophy takes a proactive, behavior-based approach, ensuring everyone plays a role in maintaining a safe work environment.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            rowGap: '36px',
            columnGap: '16px'
          }}>
            {statsData.map((stat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontSize: 'clamp(28px, 3.5vw, 44px)',
                  fontWeight: '800',
                  color: ORANGE,
                  lineHeight: '1.1',
                  marginBottom: '6px',
                  letterSpacing: '-1px'
                }}>
                  {stat.value}
                </span>
                <span style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px',
          height: '440px'
        }}>
          
          <div style={{
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 16px 36px rgba(0,0,0,0.25)',
            border: `1px solid ${ORANGE}20`,
            gridRow: 'span 2'
          }}>
            <img 
              src="/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(3).png"
              alt="Safety worker"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
            border: `1px solid ${ORANGE}20`
          }}>
            <img 
              src="/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(2).png"
              alt="Construction site"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
            border: `1px solid ${ORANGE}20`
          }}>
            <img 
              src="/images/awards/Safety-Excellence-Awards-Adani.png"
              alt="Engineers"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default SafetyStats2025;