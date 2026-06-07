import React, { useState, useEffect, useRef } from 'react';
import { FiAward, FiStar, FiUsers, FiGlobe } from 'react-icons/fi';

interface StatItem {
  id: string;
  icon: React.ReactNode;
  iconColor: string;
  value: number;
  suffix: string;
  label: string;
}

const statsData: StatItem[] = [
  { id: 'awards', icon: <FiAward size={36} strokeWidth={1.8} />, iconColor: '#F97316', value: 60, suffix: '+', label: 'Awards Won' },
  { id: 'years', icon: <FiStar size={36} strokeWidth={1.8} />, iconColor: '#F59E0B', value: 10, suffix: '+', label: 'Years of Recognition' },
  { id: 'institutions', icon: <FiUsers size={36} strokeWidth={1.8} />, iconColor: '#4F46E5', value: 25, suffix: '+', label: 'Institutions & Bodies' },
  { id: 'recognition', icon: <FiGlobe size={36} strokeWidth={1.8} />, iconColor: '#22C55E', value: 1, suffix: '', label: 'Pan India Recognition' },
];

const CounterAnimation = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
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

const AwardsStats: React.FC = () => (
  <div style={{ width: '100%', position: 'relative', marginTop: '-55px', zIndex: 20 }}>
    <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '18px', padding: '22px 20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {statsData.map((stat, index) => (
          <div key={stat.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', padding: '0 14px', borderRight: index < 3 ? '1px solid #EEF2F7' : 'none' }}>
            <span style={{ color: stat.iconColor, display: 'flex', lineHeight: 0 }}>{stat.icon}</span>
            <div>
              <CounterAnimation value={stat.value} suffix={stat.suffix} />
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', margin: '3px 0 0 0', fontFamily: 'Inter, sans-serif' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AwardsStats;