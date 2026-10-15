import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaRulerCombined, FaUsers, FaBuilding } from 'react-icons/fa';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';

const Counter = ({ end, suffix = '', duration = 4000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime = null;

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * end);
            
            setCount(current);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

const TextStat = ({ icon: Icon, end, suffix, label, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="pisl-text-stat-item"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '6px', 
      }}
    >
      <div 
        className="pisl-stat-num"
        style={{
          fontSize: 'clamp(32px, 3.5vw, 48px)', 
          fontWeight: 900,
          color: color,
          lineHeight: 1,
          letterSpacing: '-1px',
        }}
      >
        <Counter end={end} suffix={suffix} duration={2500} />
      </div>

      <div 
        className="pisl-stat-label-wrap"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '7px',
          color: NAVY,
        }}
      >
        <Icon className="pisl-stat-icon" style={{ fontSize: '14px', color: ORANGE, flexShrink: 0 }} />
        <span 
          className="pisl-stat-text-label"
          style={{
            fontSize: '12px', 
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            lineHeight: 1.35,
            whiteSpace: 'pre-line',
            textAlign: 'center',
          }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
};

const parseStat = (val, defaultEnd, defaultSuffix = '+') => {
  if (!val) return { end: defaultEnd, suffix: defaultSuffix };
  const str = String(val).trim();
  const digits = parseInt(str.replace(/[^0-9]/g, '')) || defaultEnd;
  const suffix = str.replace(/[0-9]/g, '').trim() || defaultSuffix;
  return { end: digits, suffix };
};

const formatLabel = (lbl, defaultText) => {
  if (!lbl) return defaultText;
  const words = lbl.trim().split(' ');
  if (words.length <= 1) return lbl;
  const mid = Math.ceil(words.length / 2);
  return words.slice(0, mid).join(' ') + '\n' + words.slice(mid).join(' ');
};

const Industries = ({ data }) => {
  const p1 = parseStat(data?.statLocations, 27, '+');
  const p2 = parseStat(data?.statSqFt, 16, '+');
  const p3 = parseStat(data?.statEmployees, 700, '+');
  const p4 = parseStat(data?.statProjects, 10, '+');

  const stats = [
    {
      icon: FaMapMarkerAlt,
      end: p1.end,
      suffix: p1.suffix,
      label: formatLabel(data?.statLocationsLabel, 'Locations\nCovered'),
      color: NAVY,
      delay: 0,
    },
    {
      icon: FaRulerCombined,
      end: p2.end,
      suffix: p2.suffix,
      label: formatLabel(data?.statSqFtLabel, 'Million Sq. Ft.\nConstructed'),
      color: ORANGE,
      delay: 0.1,
    },
    {
      icon: FaUsers,
      end: p3.end,
      suffix: p3.suffix,
      label: formatLabel(data?.statEmployeesLabel, 'Employee\nStrength'),
      color: NAVY,
      delay: 0.2,
    },
    {
      icon: FaBuilding,
      end: p4.end,
      suffix: p4.suffix,
      label: formatLabel(data?.statProjectsLabel, 'Upcoming\nProjects'),
      color: ORANGE,
      delay: 0.3,
    },
  ];

  return (
    <section className="pisl-industries-stats-section" style={{
      padding: '36px 24px',
      background: '#f8fafc',
      fontFamily: '"Inter", "Helvetica Neue", sans-serif',
      overflow: 'hidden',
      borderTop: '1px solid #eef2f6',
      borderBottom: '1px solid #eef2f6',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        <div 
          className="text-stats-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {stats.map((stat, index) => (
            <TextStat key={index} {...stat} />
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .text-stats-layout { 
            grid-template-columns: repeat(2, 1fr) !important; 
            row-gap: 32px !important;
            column-gap: 24px !important;
          }
        }
        @media (max-width: 640px) {
          .pisl-industries-stats-section {
            padding: 28px 16px !important;
          }
          .text-stats-layout { 
            grid-template-columns: repeat(2, 1fr) !important; 
            row-gap: 24px !important;
            column-gap: 16px !important;
          }
          .pisl-stat-num {
            font-size: clamp(28px, 7.5vw, 34px) !important;
            letter-spacing: -0.5px !important;
          }
          .pisl-stat-icon {
            font-size: 12px !important;
          }
          .pisl-stat-text-label {
            font-size: 10.5px !important;
            letter-spacing: 0.5px !important;
            line-height: 1.3 !important;
          }
        }
        @media (max-width: 360px) {
          .text-stats-layout {
            column-gap: 10px !important;
            row-gap: 20px !important;
          }
          .pisl-stat-num {
            font-size: 24px !important;
          }
          .pisl-stat-text-label {
            font-size: 9.5px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Industries;