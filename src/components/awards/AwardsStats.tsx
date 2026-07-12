import React, { useState, useEffect, useRef } from 'react';
import { FiAward, FiStar, FiUsers, FiGlobe } from 'react-icons/fi';
import awardsAndCertifications from '../../data/Awards-&-Certifications';

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
      else setCount(value);
    };
    requestAnimationFrame(animate);
  }, [started, value]);

  if (value === 1) return <div ref={ref} style={{ fontSize: '28px', fontWeight: 800, color: '#052A73', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>Pan India</div>;

  return (
    <div ref={ref} style={{ fontSize: '28px', fontWeight: 800, color: '#052A73', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>
      {count}{suffix}
    </div>
  );
};

const AwardsStats = () => {
  const totalAwards = awardsAndCertifications.filter(a => a.category === 'Award').length;
  const totalCertifications = awardsAndCertifications.filter(a => a.category === 'Certification').length;
  const totalAll = awardsAndCertifications.length;
  
  const years = [...new Set(awardsAndCertifications.map(a => a.year).filter(Boolean))];
  const yearsCount = years.length;

  const statsData = [
    { id: 'awards', icon: <FiAward size={36} strokeWidth={1.8} />, iconColor: '#F97316', value: totalAll, suffix: '+', label: 'Awards & Certs' },
    { id: 'years', icon: <FiStar size={36} strokeWidth={1.8} />, iconColor: '#F59E0B', value: yearsCount, suffix: '+', label: 'Years of Recognition' },
    { id: 'institutions', icon: <FiUsers size={36} strokeWidth={1.8} />, iconColor: '#4F46E5', value: 8, suffix: '+', label: 'Institutions & Bodies' },
    { id: 'recognition', icon: <FiGlobe size={36} strokeWidth={1.8} />, iconColor: '#22C55E', value: 1, suffix: '', label: 'Pan India Recognition' },
  ];

  return (
    <div style={{ width: '100%', position: 'relative', marginTop: '-55px', zIndex: 20 }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        
        {/* Desktop Layout */}
        <div className="awards-desktop" style={{ 
          backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '18px', 
          padding: '22px 20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
          display: 'none', gridTemplateColumns: 'repeat(4, 1fr)',
        }}>
          {statsData.map((stat, index) => (
            <div key={stat.id} style={{ 
              display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', 
              padding: '0 14px', borderRight: index < 3 ? '1px solid #EEF2F7' : 'none' 
            }}>
              <span style={{ color: stat.iconColor, display: 'flex', lineHeight: 0 }}>{stat.icon}</span>
              <div>
                <CounterAnimation value={stat.value} suffix={stat.suffix} />
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', margin: '3px 0 0 0', fontFamily: 'Inter, sans-serif' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="awards-mobile" style={{ 
          backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '16px', 
          padding: '16px 10px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', 
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        }}>
          {statsData.map((stat, index) => (
            <div key={stat.id} style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', 
              padding: '14px 8px', 
              borderRight: index % 2 === 0 ? '1px solid #EEF2F7' : 'none',
              borderBottom: index < 2 ? '1px solid #EEF2F7' : 'none',
            }}>
              <span style={{ color: stat.iconColor, display: 'flex', lineHeight: 0, flexShrink: 0 }}>
                {React.cloneElement(stat.icon, { size: 30 })}
              </span>
              <div>
                <CounterAnimation value={stat.value} suffix={stat.suffix} />
                <p style={{ fontSize: '10px', fontWeight: 600, color: '#475569', margin: '2px 0 0 0', fontFamily: 'Inter, sans-serif' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (min-width: 640px) {
          .awards-desktop { display: grid !important; }
          .awards-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AwardsStats;