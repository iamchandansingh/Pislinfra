import React, { useState, useEffect, useRef } from 'react';
import { 
  FiUsers, 
  FiBookOpen, 
  FiDroplet, 
  FiFeather, 
  FiHeart, 
  FiSmile, 
  FiGlobe, 
  FiAward, 
  FiTarget, 
  FiShield, 
  FiCheckCircle,
  FiCheck
} from 'react-icons/fi';

interface StatItem {
  id?: string | number;
  iconName?: string;
  iconColor?: string;
  value?: number | string;
  suffix?: string;
  label?: string;
}

interface CSRStatsProps {
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  { id: 'impacted', iconName: 'FiUsers', iconColor: '#4F46E5', value: 10, suffix: '+', label: 'Lives Impacted' },
  { id: 'education', iconName: 'FiBookOpen', iconColor: '#16A34A', value: 25, suffix: '+', label: 'Education Initiatives' },
  { id: 'health', iconName: 'FiDroplet', iconColor: '#E11D48', value: 20, suffix: '+', label: 'Health Camps' },
  { id: 'environment', iconName: 'FiFeather', iconColor: '#EA580C', value: 30, suffix: '+', label: 'Environment Projects' },
];

const getIcon = (name?: string) => {
  const size = 24;
  const strokeWidth = 2;
  switch (name) {
    case 'FiUsers': return <FiUsers size={size} strokeWidth={strokeWidth} />;
    case 'FiBookOpen': return <FiBookOpen size={size} strokeWidth={strokeWidth} />;
    case 'FiDroplet': return <FiDroplet size={size} strokeWidth={strokeWidth} />;
    case 'FiFeather': return <FiFeather size={size} strokeWidth={strokeWidth} />;
    case 'FiHeart': return <FiHeart size={size} strokeWidth={strokeWidth} />;
    case 'FiSmile': return <FiSmile size={size} strokeWidth={strokeWidth} />;
    case 'FiGlobe': return <FiGlobe size={size} strokeWidth={strokeWidth} />;
    case 'FiAward': return <FiAward size={size} strokeWidth={strokeWidth} />;
    case 'FiTarget': return <FiTarget size={size} strokeWidth={strokeWidth} />;
    case 'FiShield': return <FiShield size={size} strokeWidth={strokeWidth} />;
    case 'FiCheckCircle': return <FiCheckCircle size={size} strokeWidth={strokeWidth} />;
    default: return <FiUsers size={size} strokeWidth={strokeWidth} />;
  }
};

const getTint = (color?: string) => {
  if (!color) return 'rgba(5, 42, 115, 0.08)';
  if (color.startsWith('#') && color.length === 7) {
    return `${color}14`;
  }
  return 'rgba(5, 42, 115, 0.08)';
};

interface CounterProps {
  value?: number | string;
  suffix?: string;
}

const CounterAnimation: React.FC<CounterProps> = ({ value = 0, suffix = '' }) => {
  const numericValue = typeof value === 'number' 
    ? value 
    : parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const startTime = Date.now();
    let animId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * numericValue));
      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        setCount(numericValue);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [started, numericValue]);

  return (
    <div 
      ref={ref} 
      className="csr-stat-number"
      style={{ 
        fontSize: '28px', 
        fontWeight: 800, 
        color: '#052A73', 
        lineHeight: 1.15, 
        fontFamily: 'Inter, sans-serif' 
      }}
    >
      {count}{suffix}
    </div>
  );
};

const CSRStats: React.FC<CSRStatsProps> = ({ stats }) => {
  const statsData = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="csr-stats-section" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
      <div className="csr-stats-wrapper" style={{ width: '98%', maxWidth: '1370px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div className="csr-stats-card">
          {statsData.map((stat, index) => {
            const fallbackColor = defaultStats[index % defaultStats.length]?.iconColor || '#4F46E5';
            const iconColor = stat.iconColor || fallbackColor;
            const bgTint = getTint(iconColor);

            return (
              <React.Fragment key={stat.id || index}>
                <div className="csr-stat-item">
                  <div 
                    className="csr-stat-icon-wrap" 
                    style={{ backgroundColor: bgTint, color: iconColor }}
                  >
                    {getIcon(stat.iconName)}
                  </div>
                  <div className="csr-stat-info">
                    <CounterAnimation value={stat.value} suffix={stat.suffix || ''} />
                    <p className="csr-stat-label">{stat.label}</p>
                  </div>
                </div>
                {index < statsData.length - 1 && <div className="csr-stat-divider" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <style>{`
        .csr-stats-section {
          width: 100%;
          background: #FFFFFF;
          padding: 34px 0 16px 0;
        }
        .csr-stats-card {
          background-color: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 16px;
          padding: 22px 20px;
          box-shadow: 0 10px 30px rgba(5, 42, 115, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
        }
        .csr-stat-item {
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          gap: 14px;
          justify-content: center;
          padding: 8px 12px;
          min-width: 0;
          box-sizing: border-box;
          transition: none !important;
        }
        .csr-stat-icon-wrap {
          width: 52px;
          height: 52px;
          min-width: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .csr-stat-icon-wrap svg {
          width: 24px;
          height: 24px;
        }
        .csr-stat-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .csr-stat-number {
          font-size: 28px !important;
          font-weight: 800 !important;
          color: #052A73 !important;
          line-height: 1.15 !important;
          font-family: 'Inter', sans-serif !important;
        }
        .csr-stat-label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          line-height: 1.35;
          margin-top: 4px;
          margin-bottom: 0;
          font-family: 'Inter', sans-serif;
        }
        .csr-stat-divider {
          width: 1px;
          height: 54px;
          background-color: #EEF2F7;
          flex-shrink: 0;
        }

        /* Tablet Responsive (<= 992px) */
        @media (max-width: 992px) {
          .csr-stat-item {
            gap: 10px;
            padding: 6px 8px;
          }
          .csr-stat-icon-wrap {
            width: 46px;
            height: 46px;
            min-width: 46px;
            border-radius: 12px;
          }
          .csr-stat-icon-wrap svg {
            width: 22px;
            height: 22px;
          }
          .csr-stat-number {
            font-size: 24px !important;
          }
          .csr-stat-label {
            font-size: 12px;
          }
        }

        /* Mobile Responsive (<= 768px) */
        @media (max-width: 768px) {
          .csr-stats-section {
            padding: 20px 0 10px 0 !important;
          }
          .csr-stats-wrapper {
            padding: 0 16px !important;
          }
          .csr-stats-card {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            border-radius: 0 !important;
          }
          .csr-stat-divider {
            display: none !important;
          }
          .csr-stat-item {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            background: #FFFFFF !important;
            border: 1.5px solid #EEF2F7 !important;
            border-radius: 14px !important;
            padding: 18px 10px 14px 10px !important;
            box-shadow: 0 2px 10px rgba(5, 42, 115, 0.04) !important;
            width: 100% !important;
            height: 100% !important;
            gap: 8px !important;
          }
          .csr-stat-icon-wrap {
            width: 44px !important;
            height: 44px !important;
            min-width: 44px !important;
            border-radius: 12px !important;
            margin-bottom: 2px !important;
          }
          .csr-stat-icon-wrap svg {
            width: 22px !important;
            height: 22px !important;
          }
          .csr-stat-info {
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
          }
          .csr-stat-number {
            font-size: clamp(22px, 5.5vw, 26px) !important;
            line-height: 1.1 !important;
            margin-bottom: 3px !important;
          }
          .csr-stat-label {
            font-size: clamp(11px, 3.2vw, 12px) !important;
            font-weight: 600 !important;
            color: #475569 !important;
            line-height: 1.3 !important;
            margin-top: 0 !important;
            text-align: center !important;
          }
        }

        /* Small Phones (<= 380px) */
        @media (max-width: 380px) {
          .csr-stats-wrapper {
            padding: 0 10px !important;
          }
          .csr-stats-card {
            gap: 8px !important;
          }
          .csr-stat-item {
            padding: 14px 6px 12px 6px !important;
            border-radius: 12px !important;
          }
          .csr-stat-icon-wrap {
            width: 38px !important;
            height: 38px !important;
            min-width: 38px !important;
          }
          .csr-stat-icon-wrap svg {
            width: 18px !important;
            height: 18px !important;
          }
          .csr-stat-number {
            font-size: 20px !important;
          }
          .csr-stat-label {
            font-size: 10.5px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CSRStats;
