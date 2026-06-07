import React, { useState, useEffect, useRef } from 'react';
import { FiHeart, FiUsers, FiBookOpen, FiDroplet, FiFeather, FiLink } from 'react-icons/fi';

interface StatItem {
  id: string;
  icon: React.ReactNode;
  iconColor: string;
  value: number;
  suffix: string;
  label: string;
}

const statsData: StatItem[] = [
  { id: 'projects', icon: <FiHeart size={34} strokeWidth={1.8} />, iconColor: '#FF6B35', value: 50, suffix: '+', label: 'CSR Projects' },
  { id: 'impacted', icon: <FiUsers size={34} strokeWidth={1.8} />, iconColor: '#6366F1', value: 100, suffix: 'K+', label: 'Lives Impacted' },
  { id: 'education', icon: <FiBookOpen size={34} strokeWidth={1.8} />, iconColor: '#22C55E', value: 75, suffix: '+', label: 'Education Initiatives' },
  { id: 'health', icon: <FiDroplet size={34} strokeWidth={1.8} />, iconColor: '#EC4899', value: 40, suffix: '+', label: 'Health Camps' },
  { id: 'environment', icon: <FiFeather size={34} strokeWidth={1.8} />, iconColor: '#F97316', value: 30, suffix: '+', label: 'Environment Projects' },
  { id: 'partners', icon: <FiLink size={34} strokeWidth={1.8} />, iconColor: '#3B82F6', value: 100, suffix: '+', label: 'Community Partners' },
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
    };
    requestAnimationFrame(animate);
  }, [started, value]);

  return (
    <div ref={ref} style={{ fontSize: '26px', fontWeight: 800, color: '#052A73', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>
      {count}{suffix}
    </div>
  );
};

const CSRStats: React.FC = () => {
  return (
    <div style={{ width: '100%', position: 'relative', zIndex: 10, marginTop: '-55px' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '16px',
          padding: '20px 16px', boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center',
        }}>
          {statsData.map((stat, index) => (
            <React.Fragment key={stat.id}>
              <div className="stat-item" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', padding: '0 8px' }}>
                <span style={{ color: stat.iconColor, display: 'flex', lineHeight: 0, flexShrink: 0 }}>{stat.icon}</span>
                <div>
                  <CounterAnimation value={stat.value} suffix={stat.suffix} />
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#475569', lineHeight: 1.3, marginTop: '2px', marginBottom: 0, fontFamily: 'Inter, sans-serif' }}>{stat.label}</p>
                </div>
              </div>
              {index < statsData.length - 1 && <div style={{ width: '1px', height: '65px', backgroundColor: '#EEF2F7', flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 1200px) { .stat-item { min-width: calc(33.33% - 1px); } } @media (max-width: 900px) { .stat-item { min-width: calc(50% - 1px); } } @media (max-width: 600px) { .stat-item { min-width: 100%; } }`}</style>
    </div>
  );
};

export default CSRStats;