import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaCity, FaSearchLocation, FaChartLine, FaUsersCog, FaBuilding, FaMapMarkedAlt } from 'react-icons/fa';
import { BiBuildings, BiMap, BiTrendingUp, BiGroup } from 'react-icons/bi';

/* ─── CORPORATE BRAND COLORS ─────────────────────────────────────────────── */
const NAVY = '#1E2A5A';
const ORANGE = '#F37346';
const PURPLE = '#6366F1';
const GREEN = '#10B981';

/* ─── COUNT UP HOOK ──────────────────────────────────────────────────────── */
const useCountUp = (end, duration = 2, startCounting) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!startCounting) return;
    
    let startTime = null;
    const startValue = 0;
    const endValue = parseInt(end);
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * (endValue - startValue) + startValue);
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, startCounting]);
  
  return count;
};

/* ─── GRID CARD COMPONENT ────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, end, suffix, label, delay, color, number, bgIcon: BgIcon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useCountUp(end, 2.5, isInView);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      style={{
        position: 'relative',
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px 18px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '180px',
        borderBottom: `4px solid ${color}`,
        overflow: 'hidden'
      }}
      className="pisl-stat-card"
    >
      {/* Top Right Number Tab */}
      <div 
        className="pisl-card-number-tab"
        style={{
          position: 'absolute',
          top: 0,
          right: '24px',
          background: color,
          color: '#fff',
          padding: '4px 12px',
          borderBottomLeftRadius: '6px',
          borderBottomRightRadius: '6px',
          fontWeight: 700,
          fontSize: '12px',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {number}
      </div>

      {/* Icon */}
      <div 
        className="pisl-card-icon"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
          color: '#fff',
          fontSize: '20px',
          boxShadow: `0 6px 18px ${color}35`,
          position: 'relative',
          zIndex: 2
        }}
      >
        <Icon />
      </div>

      {/* Label */}
      <h3 
        className="pisl-card-label"
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#334155',
          lineHeight: 1.45,
          marginBottom: '12px',
          position: 'relative',
          zIndex: 2,
          fontFamily: "'Inter', sans-serif",
          maxWidth: '92%'
        }}
      >
        {label}
      </h3>

      {/* Count */}
      <div 
        className="pisl-card-count"
        style={{
          fontSize: '38px',
          fontWeight: 800,
          color: NAVY,
          lineHeight: 1,
          letterSpacing: '-1.5px',
          position: 'relative',
          zIndex: 2,
          fontFamily: "'Inter', sans-serif",
          display: 'flex',
          alignItems: 'baseline'
        }}
      >
        {count}
        <span 
          className="pisl-card-suffix"
          style={{ color: color, fontSize: '22px', marginLeft: '3px', fontWeight: 700 }}
        >
          {suffix}
        </span>
      </div>

      {/* Background Watermark Icon */}
      {BgIcon && (
        <div 
          className="pisl-card-bg-icon"
          style={{
            position: 'absolute',
            right: '-16px',
            bottom: '-16px',
            opacity: 0.03,
            fontSize: '120px',
            color: NAVY,
            zIndex: 1,
            pointerEvents: 'none',
            transform: 'rotate(-10deg)'
          }}
        >
          <BgIcon />
        </div>
      )}
    </motion.div>
  );
};

const parseStatValue = (val, defaultEnd = '0', defaultSuffix = '+') => {
  if (!val) return { end: defaultEnd, suffix: defaultSuffix };
  const str = String(val).trim();
  const match = str.match(/^([0-9]+)\s*(.*)$/);
  if (match) {
    return { end: match[1], suffix: match[2] || defaultSuffix };
  }
  const digits = str.replace(/[^0-9]/g, '') || defaultEnd;
  const suffix = str.replace(/[0-9]/g, '').trim() || defaultSuffix;
  return { end: digits, suffix };
};

const renderStatsTitle = (title) => {
  if (!title) {
    return <>Building Global-Standard <span style={{ color: ORANGE }}>Industrial & Logistics Parks.</span></>;
  }
  if (typeof title === 'string' && title.includes('<')) {
    return <span dangerouslySetInnerHTML={{ __html: title }} />;
  }
  const marker = "Industrial & Logistics Parks";
  if (title.includes(marker)) {
    const parts = title.split(marker);
    return <>{parts[0]}<span style={{ color: ORANGE }}>{marker}</span>{parts.slice(1).join(marker)}</>;
  }
  const words = String(title).trim().split(' ');
  if (words.length > 2) {
    const mid = Math.ceil(words.length / 2);
    const firstHalf = words.slice(0, mid).join(' ');
    const secondHalf = words.slice(mid).join(' ');
    return <>{firstHalf} <span style={{ color: ORANGE }}>{secondHalf}</span></>;
  }
  return title;
};

/* ─── MAIN STATS COMPONENT ────────────────────────────────────────── */
const StatsSection = ({ data }) => {
  const mainRef = useRef(null);
  const mainInView = useInView(mainRef, { once: true });
  
  const rawLegacy = data?.legacyYears || data?.statLegacy || '17';
  const legacyNumeric = parseInt(String(rawLegacy).replace(/[^0-9]/g, '')) || 17;
  const legacyCount = useCountUp(legacyNumeric, 2.5, mainInView);
  
  // ── Section 1 Stats: "Building Global-Standard Industrial & Logistics Parks" ──
  // Card 01: 10M+ Million Sq. Ft of Optimally-Designed Spaces
  const s1Val = data?.statSpaceSqFt || '10M+';
  const s1Label = data?.statSpaceSqFtLabel || 'Million Sq. Ft of Optimally-Designed Spaces';
  const parsed1 = parseStatValue(s1Val, '10', 'M+');

  // Card 02: 27+ Key Micro Markets Signify Our PAN-India Presence
  const s2Val = data?.statMicroMarkets || '27+';
  const s2Label = data?.statMicroMarketsLabel || 'Key Micro Markets Signify Our PAN-India Presence';
  const parsed2 = parseStatValue(s2Val, '27', '+');

  // Card 03: 20M Million Sq. Ft Development Pipeline Over Next 3 Years
  const s3Val = data?.statPipelineSqFt || '20M';
  const s3Label = data?.statPipelineSqFtLabel || 'Million Sq. Ft Development Pipeline Over Next 3 Years';
  const parsed3 = parseStatValue(s3Val, '20', 'M');

  // Card 04: 100+ Visionaries Bringing Forth Decades of Expertise
  const s4Val = data?.statVisionaries || '100+';
  const s4Label = data?.statVisionariesLabel || 'Visionaries Bringing Forth Decades of Expertise';
  const parsed4 = parseStatValue(s4Val, '100', '+');

  const dataset = [
    {
      icon: BiBuildings,
      bgIcon: FaCity,
      end: parsed1.end,
      suffix: parsed1.suffix,
      label: s1Label,
      color: NAVY,
      number: '01'
    },
    {
      icon: BiMap,
      bgIcon: FaMapMarkedAlt,
      end: parsed2.end,
      suffix: parsed2.suffix,
      label: s2Label,
      color: ORANGE,
      number: '02'
    },
    {
      icon: BiTrendingUp,
      bgIcon: FaChartLine,
      end: parsed3.end,
      suffix: parsed3.suffix,
      label: s3Label,
      color: PURPLE,
      number: '03'
    },
    {
      icon: BiGroup,
      bgIcon: FaUsersCog,
      end: parsed4.end,
      suffix: parsed4.suffix,
      label: s4Label,
      color: GREEN,
      number: '04'
    }
  ];

  return (
    <section className="relative overflow-hidden" style={{
      background: '#ffffff',
      fontFamily: '"Inter", "-apple-system", BlinkMacSystemFont, sans-serif',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div 
        className="pisl-stats-section-wrap"
        style={{
          width: '100%',
          maxWidth: '1536px',
          padding: '30px 24px 30px 24px',
          backgroundColor: '#FAFBFC',
          backgroundImage: 'url("/bgimage.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 items-center pisl-stats-grid">
          
          {/* ── LEFT SIDE: Text and Main Info ── */}
          <motion.div
            ref={mainRef}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pisl-stats-left lg:pr-10"
            style={{ marginTop: '0px' }}
          >


            {/* Big Legacy Counter */}
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '20px' }} className="pisl-stats-legacy">
              <span className="pisl-legacy-num" style={{
                fontSize: 'clamp(70px, 8vw, 110px)',
                fontWeight: 900,
                color: NAVY,
                lineHeight: 0.85,
                letterSpacing: '-6px'
              }}>{legacyCount}</span>
              <span className="pisl-legacy-plus" style={{ fontSize: 'clamp(40px, 5vw, 70px)', fontWeight: 900, color: ORANGE, lineHeight: 0.85, marginLeft: '4px' }}>+</span>
            </div>

            {/* Core Message Text */}
            <h2 className="pisl-stats-title" style={{
              fontSize: 'clamp(24px, 3vw, 32px)', 
              fontWeight: 800, 
              color: NAVY,
              lineHeight: '1.25', 
              margin: '0 0 20px 0', 
              letterSpacing: '-1px'
            }}>
              {renderStatsTitle(data?.aboutSubtitle || data?.statsTitle)}
            </h2>

            {/* Decorative Line */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }} className="pisl-stats-line">
              <div style={{ width: '40px', height: '5px', backgroundColor: NAVY, borderRadius: '2px' }}></div>
              <div style={{ width: '16px', height: '5px', backgroundColor: ORANGE, borderRadius: '2px' }}></div>
            </div>

            <p className="pisl-stats-desc" style={{
              fontSize: '14.5px', color: '#4B5563', lineHeight: '1.7',
              margin: 0, fontWeight: 500, maxWidth: '480px'
            }}>
              {data?.statsDesc || 'When you choose PISL, you gain a partner dedicated to understanding your business needs to support your growth — because your success is our relentless pursuit.'}
            </p>
            

          </motion.div>

          {/* ── RIGHT SIDE: 2x2 Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pisl-stats-cards">
            {dataset.map((stat, idx) => (
              <StatCard 
                key={idx}
                icon={stat.icon}
                end={stat.end}
                suffix={stat.suffix}
                label={stat.label}
                delay={idx * 0.15}
                color={stat.color}
                number={stat.number}
                bgIcon={stat.bgIcon}
              />
            ))}
          </div>

        </div>
      </div>
      </div>

      {/* Fluid Responsive Adaptation */}
      <style>{`
        @media (max-width: 1024px) {
          .pisl-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .pisl-stats-left {
            padding-right: 0 !important;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            margin-top: 0 !important;
          }
          .pisl-stats-title {
            text-align: left !important;
          }
          .pisl-stats-desc {
            text-align: left !important;
            max-width: 100% !important;
          }
          .pisl-stats-legacy, .pisl-stats-line {
            justify-content: flex-start;
          }
        }

        @media (max-width: 640px) {
          .pisl-stats-section-wrap {
            padding: 30px 14px 32px 14px !important;
          }
          .pisl-stats-grid {
            gap: 20px !important;
          }
          .pisl-stats-legacy {
            margin-bottom: 10px !important;
          }
          .pisl-legacy-num {
            font-size: clamp(48px, 13vw, 62px) !important;
            letter-spacing: -2px !important;
            line-height: 0.9 !important;
          }
          .pisl-legacy-plus {
            font-size: clamp(28px, 8vw, 38px) !important;
            line-height: 0.9 !important;
          }
          .pisl-stats-title {
            font-size: clamp(20px, 5.5vw, 24px) !important;
            letter-spacing: -0.5px !important;
            line-height: 1.25 !important;
            margin-bottom: 12px !important;
          }
          .pisl-stats-line {
            margin-bottom: 12px !important;
          }
          .pisl-stats-desc {
            font-size: 13px !important;
            line-height: 1.6 !important;
          }
          .pisl-stats-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .pisl-stat-card {
            padding: 14px 10px 12px 10px !important;
            min-height: 135px !important;
            border-radius: 12px !important;
            border-bottom-width: 3px !important;
          }
          .pisl-card-number-tab {
            right: 10px !important;
            padding: 2px 7px !important;
            font-size: 10px !important;
            border-bottom-left-radius: 5px !important;
            border-bottom-right-radius: 5px !important;
          }
          .pisl-card-icon {
            width: 32px !important;
            height: 32px !important;
            border-radius: 8px !important;
            font-size: 15px !important;
            margin-bottom: 8px !important;
          }
          .pisl-card-label {
            font-size: 11px !important;
            line-height: 1.3 !important;
            margin-bottom: 6px !important;
            min-height: 40px !important;
            max-width: 100% !important;
          }
          .pisl-card-count {
            font-size: clamp(22px, 5.8vw, 26px) !important;
            letter-spacing: -0.5px !important;
          }
          .pisl-card-suffix {
            font-size: clamp(14px, 4vw, 17px) !important;
            margin-left: 2px !important;
          }
          .pisl-card-bg-icon {
            display: none !important;
          }
        }

        @media (max-width: 360px) {
          .pisl-stats-cards {
            gap: 8px !important;
          }
          .pisl-stat-card {
            padding: 10px 8px 10px 8px !important;
            min-height: 125px !important;
          }
          .pisl-card-count {
            font-size: 20px !important;
          }
          .pisl-card-suffix {
            font-size: 14px !important;
          }
          .pisl-card-label {
            font-size: 10px !important;
            min-height: 34px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;