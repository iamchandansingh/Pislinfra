import React, { useState, useEffect, useRef } from 'react';
import * as FiIcons from 'react-icons/fi';

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

const bgColors = ['#052A73', '#22C55E', '#FF7A1A', '#8B5CF6'];

const EHSStats = ({ stats }) => {
  const defaultStats = [
    { id: '1', iconName: 'FiShield', value: '30', suffix: 'M+', label: 'Safe Man Hours', sub: 'Upto 2025-26' },
    { id: '2', iconName: 'FiCheckCircle', value: '31673040', suffix: '', label: 'Lost Time Injuries (LTIR) Frequency Rate', sub: '2019 to 2025-26' },
    { id: '3', iconName: 'FiAward', value: '100', suffix: '%', label: 'Legal & Other Compliance', sub: 'Every Year' },
    { id: '4', iconName: 'FiBookOpen', value: '17', suffix: 'K+', label: 'Job Specific Safety Training', sub: 'Across All Projects' },
  ];

  const statsData = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <div style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        <style>{`
          .ehs-stats-container {
            display: flex;
            align-items: center;
            background-color: #FFFFFF;
            border: 1px solid #EEF2F7;
            border-radius: 14px;
            padding: 16px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          }
          .ehs-stat-item {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
            justify-content: center;
          }
          .ehs-stat-divider {
            width: 1px;
            height: 60px;
            background-color: #EEF2F7;
            flex-shrink: 0;
          }
          @media (max-width: 768px) {
            .ehs-stats-container {
              flex-direction: column;
              padding: 24px 16px;
              gap: 16px;
            }
            .ehs-stat-item {
              width: 100%;
              justify-content: flex-start;
              padding: 0 10px;
            }
            .ehs-stat-divider {
              width: 100%;
              height: 1px;
              margin: 4px 0;
            }
          }
        `}</style>
        <div className="ehs-stats-container">
          {statsData.map((stat, index) => {
            const Icon = FiIcons[stat.iconName] || FiIcons.FiCheck;
            const bg = bgColors[index % bgColors.length];
            return (
              <React.Fragment key={stat.id || index}>
                <div className="ehs-stat-item">
                  <div style={{ width: '50px', height: '50px', minWidth: '50px', borderRadius: '50%', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#FFFFFF', display: 'flex', lineHeight: 0 }}><Icon size={24} /></span>
                  </div>
                  <div>
                    <CounterAnimation value={parseFloat(stat.value)} suffix={stat.suffix || ''} />
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#1E293B', margin: '0 0 1px 0', fontFamily: 'Inter, sans-serif' }}>{stat.label}</p>
                    <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0, fontFamily: 'Inter, sans-serif' }}>{stat.sub}</p>
                  </div>
                </div>
                {index < statsData.length - 1 && <div className="ehs-stat-divider" />}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default EHSStats;
