import React, { useState, useEffect, useRef } from 'react';
import { FiShield, FiCheckCircle, FiAward, FiBookOpen } from 'react-icons/fi';

const statsData = [
  { id: '1', icon: <FiShield size={24} />, iconBg: '#052A73', value: 18.4, suffix: 'M+', label: 'Safe Man Hours', sub: 'Upto 2024-25' },
  { id: '2', icon: <FiCheckCircle size={24} />, iconBg: '#22C55E', value: 0, suffix: '', label: 'Lost Time Injuries (LTI)', sub: '2019-20 to 2024-25' },
  { id: '3', icon: <FiAward size={24} />, iconBg: '#FF7A1A', value: 100, suffix: '%', label: 'Legal & Other Compliance', sub: 'Every Year' },
  { id: '4', icon: <FiBookOpen size={24} />, iconBg: '#8B5CF6', value: 5000, suffix: '+', label: 'Safety Trainings Conducted', sub: 'Across All Projects' },
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
    const duration = 6000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(interval); }
      else { setCount(Math.floor(current * 10) / 10); }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, value]);

  return (
    <div ref={ref} style={{ fontSize: '28px', fontWeight: 800, color: '#052A73', lineHeight: 1, fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>
      {count}{suffix}
    </div>
  );
};

const EHSStats: React.FC = () => (
  <div style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
    <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '14px',
        padding: '16px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center',
      }}>
        {statsData.map((stat, index) => (
          <React.Fragment key={stat.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'center' }}>
              <div style={{ width: '50px', height: '50px', minWidth: '50px', borderRadius: '50%', backgroundColor: stat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#FFFFFF', display: 'flex', lineHeight: 0 }}>{stat.icon}</span>
              </div>
              <div>
                <CounterAnimation value={stat.value} suffix={stat.suffix} />
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#1E293B', margin: '0 0 1px 0', fontFamily: 'Inter, sans-serif' }}>{stat.label}</p>
                <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0, fontFamily: 'Inter, sans-serif' }}>{stat.sub}</p>
              </div>
            </div>
            {index < statsData.length - 1 && <div style={{ width: '1px', height: '60px', backgroundColor: '#EEF2F7', flexShrink: 0 }} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

export default EHSStats;