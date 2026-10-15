import React, { useState, useEffect, useRef } from 'react';
import { FiShield, FiCheckCircle, FiAward, FiBookOpen, FiCheck } from 'react-icons/fi';

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  FiShield,
  FiCheckCircle,
  FiAward,
  FiBookOpen,
  FiCheck
};

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

  const isLong = String(value).length > 6;

  return (
    <div 
      ref={ref} 
      className={`ehs-stat-counter ${isLong ? 'ehs-stat-counter-long' : ''}`}
      style={{ fontSize: '28px', fontWeight: 800, color: '#052A73', lineHeight: 1, fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}
    >
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
    <div className="ehs-stats-wrapper" style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
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
            .ehs-stats-wrapper {
              padding: 0 16px 24px 16px !important;
              box-sizing: border-box !important;
            }
            .ehs-stats-container {
              display: grid !important;
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 12px !important;
              padding: 0 !important;
              background-color: transparent !important;
              border: none !important;
              box-shadow: none !important;
            }
            .ehs-stat-divider {
              display: none !important;
            }
            .ehs-stat-item {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              text-align: center !important;
              background: #f8fafc !important;
              border: 1.5px solid #e2e8f0 !important;
              border-bottom: 3.5px solid var(--stat-accent, #052A73) !important;
              border-radius: 14px !important;
              padding: 16px 10px 14px 10px !important;
              width: 100% !important;
              height: 100% !important;
              box-sizing: border-box !important;
              gap: 8px !important;
              box-shadow: 0 2px 10px rgba(5, 42, 115, 0.04) !important;
            }
            .ehs-stat-icon-wrap {
              width: 44px !important;
              height: 44px !important;
              min-width: 44px !important;
              border-radius: 12px !important;
              margin-bottom: 2px !important;
            }
            .ehs-stat-icon-wrap svg {
              width: 20px !important;
              height: 20px !important;
            }
            .ehs-stat-content {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              text-align: center !important;
              width: 100% !important;
            }
            .ehs-stat-counter {
              font-size: clamp(21px, 5.5vw, 25px) !important;
              line-height: 1.1 !important;
              margin-bottom: 4px !important;
            }
            .ehs-stat-counter-long {
              font-size: clamp(15px, 4.2vw, 18px) !important;
              letter-spacing: -0.4px !important;
            }
            .ehs-stat-label {
              font-size: 11.5px !important;
              font-weight: 700 !important;
              line-height: 1.35 !important;
              color: #1e293b !important;
              margin-bottom: 3px !important;
            }
            .ehs-stat-sub {
              font-size: 10.5px !important;
              color: #64748b !important;
              line-height: 1.25 !important;
            }
          }
          @media (max-width: 360px) {
            .ehs-stats-wrapper {
              padding: 0 10px 20px 10px !important;
            }
            .ehs-stats-container {
              gap: 8px !important;
            }
            .ehs-stat-item {
              padding: 12px 6px 10px 6px !important;
              border-radius: 12px !important;
            }
            .ehs-stat-icon-wrap {
              width: 38px !important;
              height: 38px !important;
              min-width: 38px !important;
            }
            .ehs-stat-counter {
              font-size: 19px !important;
            }
            .ehs-stat-counter-long {
              font-size: 14px !important;
            }
            .ehs-stat-label {
              font-size: 10.5px !important;
            }
            .ehs-stat-sub {
              font-size: 9.5px !important;
            }
          }
        `}</style>
        <div className="ehs-stats-container">
          {statsData.map((stat, index) => {
            const Icon = iconMap[stat.iconName] || FiCheck;
            const bg = bgColors[index % bgColors.length];
            return (
              <React.Fragment key={stat.id || index}>
                <div className="ehs-stat-item" style={{ '--stat-accent': bg } as React.CSSProperties}>
                  <div className="ehs-stat-icon-wrap" style={{ width: '50px', height: '50px', minWidth: '50px', borderRadius: '50%', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#FFFFFF', display: 'flex', lineHeight: 0 }}><Icon size={24} /></span>
                  </div>
                  <div className="ehs-stat-content">
                    <CounterAnimation value={parseFloat(stat.value)} suffix={stat.suffix || ''} />
                    <p className="ehs-stat-label" style={{ fontSize: '12px', fontWeight: 600, color: '#1E293B', margin: '0 0 1px 0', fontFamily: 'Inter, sans-serif' }}>{stat.label}</p>
                    <p className="ehs-stat-sub" style={{ fontSize: '11px', color: '#94A3B8', margin: 0, fontFamily: 'Inter, sans-serif' }}>{stat.sub}</p>
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
