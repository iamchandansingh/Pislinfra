import React, { useState, useEffect, useRef } from 'react';
import { FiUsers, FiBookOpen, FiDroplet, FiFeather } from 'react-icons/fi';

const defaultStats = [
  { id: 'impacted', iconName: 'FiUsers', iconColor: '#6366F1', value: 10, suffix: '+', label: 'Lives Impacted' },
  { id: 'education', iconName: 'FiBookOpen', iconColor: '#22C55E', value: 25, suffix: '+', label: 'Education Initiatives' },
  { id: 'health', iconName: 'FiDroplet', iconColor: '#EC4899', value: 20, suffix: '+', label: 'Health Camps' },
  { id: 'environment', iconName: 'FiFeather', iconColor: '#F97316', value: 30, suffix: '+', label: 'Environment Projects' },
];

const CounterAnimation = ({ value, suffix }) => {
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
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, value]);

  return (
    <div ref={ref} style={{ fontSize: '26px', fontWeight: 800, color: '#052A73', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>
      {count}{suffix}
    </div>
  );
};

const getIcon = (name) => {
  const size = 34;
  const strokeWidth = 1.8;
  switch (name) {
    case 'FiUsers': return <FiUsers size={size} strokeWidth={strokeWidth} />;
    case 'FiBookOpen': return <FiBookOpen size={size} strokeWidth={strokeWidth} />;
    case 'FiDroplet': return <FiDroplet size={size} strokeWidth={strokeWidth} />;
    case 'FiFeather': return <FiFeather size={size} strokeWidth={strokeWidth} />;
    default: return <FiUsers size={size} strokeWidth={strokeWidth} />;
  }
};

const CSRStats = ({ stats }) => {
  const statsData = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <div style={{ width: '100%', position: 'relative', zIndex: 10, marginTop: '40px', marginBottom: '10px' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        <div className="csr-stats-container" style={{
          backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '16px',
          padding: '20px 16px', boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', flexWrap: 'wrap',
        }}>
          {statsData.map((stat, index) => (
            <React.Fragment key={stat.id || index}>
              <div className="stat-item" style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', padding: '10px 8px', minWidth: '0' }}>
                <span style={{ color: stat.iconColor, display: 'flex', lineHeight: 0, flexShrink: 0 }}>{getIcon(stat.iconName)}</span>
                <div>
                  <CounterAnimation value={stat.value} suffix={stat.suffix} />
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#475569', lineHeight: 1.3, marginTop: '2px', marginBottom: 0, fontFamily: 'Inter, sans-serif' }}>{stat.label}</p>
                </div>
              </div>
              {index < statsData.length - 1 && <div className="stat-divider" style={{ width: '1px', height: '65px', backgroundColor: '#EEF2F7', flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <style>{`
        .csr-stats-container { display: flex; flex-wrap: wrap; }
        .stat-item { flex: 1 1 auto; min-width: 0; }
        .stat-divider { display: block; }
        @media (max-width: 900px) {
          .stat-item { 
            flex: 1 1 calc(50% - 2px) !important; 
            border: 1px solid #EEF2F7;
            border-radius: 10px;
            margin: 4px;
            padding: 14px 10px !important;
            background: #FAFBFC;
          }
          .stat-item:nth-child(3) .stat-divider { display: none !important; }
          .stat-divider { display: none !important; }
        }
        @media (max-width: 600px) {
          .csr-stats-container { 
            gap: 8px; 
            padding: 12px !important; 
            background: transparent;
            box-shadow: none;
            border: none;
          }
          .stat-item { 
            flex: 1 1 100% !important;
            background: #FFFFFF;
            border: 1px solid #EEF2F7;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          }
          .stat-divider { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default CSRStats;
