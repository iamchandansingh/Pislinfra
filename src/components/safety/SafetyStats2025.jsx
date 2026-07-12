import React, { useState, useEffect, useRef } from 'react';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';

const CounterAnimation = ({ value, suffix, label }) => {
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const isPercentage = value.includes('%');
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 4000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericValue));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, numericValue]);

  const displayValue = value.includes('M+') ? `${count}M+` : 
                       value === '0' ? '0' : 
                       isPercentage ? `${count}%` : 
                       value.includes('24/7') ? '24/7' :
                       value.includes('360°') ? '360°' : 
                       `${count}${suffix || ''}`;

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{
        fontSize: 'clamp(28px, 3.5vw, 44px)',
        fontWeight: '800',
        color: ORANGE,
        lineHeight: '1.1',
        marginBottom: '6px',
        letterSpacing: '-1px'
      }}>
        {displayValue}
      </span>
      <span style={{
        fontSize: '11px',
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
      }}>
        {label}
      </span>
    </div>
  );
};

const SafetyStats2025 = () => {
  const statsData = [
    { value: "5M+", label: "Safe Man-Hours Achieved", numeric: 5 },
    { value: "0", label: "Major LTI Incidents", numeric: 0 },
    { value: "100%", label: "Safety Compliance", numeric: 100 },
    { value: "24/7", label: "Active Monitoring", numeric: 0 },
    { value: "98%", label: "PPE Compliance Rate", numeric: 98 },
    { value: "360°", label: "Safety Culture", numeric: 0 },
  ];

  return (
    <div style={{
      backgroundColor: NAVY,
      color: '#ffffff',
      padding: '80px 40px',
      fontFamily: 'Inter, sans-serif',
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

      <div className="safety-stats-grid" style={{
        maxWidth: '1370px',
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
           PISL HSE <span style={{ color: '#ffffff' }}>GOLDEN ROLE</span>
          </h2>

          <p style={{
            fontSize: '11px',
            lineHeight: '1.7',
            color: 'rgba(255,255,255,0.6)',
            margin: '0 0 48px 0',
            maxWidth: '520px'
          }}>
            Our Safety 360° philosophy takes a proactive, behavior-based approach, ensuring everyone plays a role in maintaining a safe work environment.
          </p>

          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            rowGap: '36px',
            columnGap: '16px'
          }}>
            {statsData.map((stat, idx) => (
              <CounterAnimation key={idx} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>

        <div className="safety-images-grid" style={{
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

      <style>{`
        @media (max-width: 1024px) {
          .safety-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .safety-images-grid {
            height: 300px !important;
          }
        }
        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .safety-images-grid {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .safety-images-grid > div:first-child {
            grid-row: auto !important;
            height: 200px !important;
          }
          .safety-images-grid > div {
            height: 180px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SafetyStats2025;