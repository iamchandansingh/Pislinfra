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
        borderRadius: '20px',
        padding: '24px 20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '220px',
        borderBottom: `6px solid ${color}`,
        overflow: 'hidden'
      }}
      className="pisl-stat-card"
    >
      {/* Top Right Number Tab */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '32px',
        background: color,
        color: '#fff',
        padding: '6px 16px',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        fontWeight: 700,
        fontSize: '14px',
        fontFamily: "'Inter', sans-serif"
      }}>
        {number}
      </div>

      {/* Icon */}
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        color: '#fff',
        fontSize: '24px',
        boxShadow: `0 8px 24px ${color}40`,
        position: 'relative',
        zIndex: 2
      }}>
        <Icon />
      </div>

      {/* Label */}
      <h3 style={{
        fontSize: '14px',
        fontWeight: 600,
        color: '#334155',
        lineHeight: 1.6,
        marginBottom: '16px',
        position: 'relative',
        zIndex: 2,
        fontFamily: "'Inter', sans-serif",
        maxWidth: '90%'
      }}>
        {label}
      </h3>

      {/* Count */}
      <div style={{
        fontSize: '56px',
        fontWeight: 900,
        color: NAVY,
        lineHeight: 1,
        letterSpacing: '-2px',
        position: 'relative',
        zIndex: 2,
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        alignItems: 'baseline'
      }}>
        {count}
        <span style={{ color: color, fontSize: '32px', marginLeft: '4px', fontWeight: 700 }}>
          {suffix}
        </span>
      </div>

      {/* Background Watermark Icon */}
      {BgIcon && (
        <div style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-20px',
          opacity: 0.03,
          fontSize: '160px',
          color: NAVY,
          zIndex: 1,
          pointerEvents: 'none',
          transform: 'rotate(-10deg)'
        }}>
          <BgIcon />
        </div>
      )}
    </motion.div>
  );
};

/* ─── MAIN STATS COMPONENT ────────────────────────────────────────── */
const StatsSection = () => {
  const mainRef = useRef(null);
  const mainInView = useInView(mainRef, { once: true });
  const legacyCount = useCountUp('17', 2.5, mainInView);
  
  const dataset = [
    {
      icon: BiBuildings,
      bgIcon: FaCity,
      end: '10',
      suffix: 'M+',
      label: 'Million Sq. Ft of Optimally-Designed Spaces',
      color: NAVY,
      number: '01'
    },
    {
      icon: BiMap,
      bgIcon: FaMapMarkedAlt,
      end: '25',
      suffix: '+',
      label: 'Key Micro Markets Signify Our PAN-India Presence',
      color: ORANGE,
      number: '02'
    },
    {
      icon: BiTrendingUp,
      bgIcon: FaChartLine,
      end: '20',
      suffix: 'M',
      label: 'Million Sq. Ft Development Pipeline Over Next 3 Years',
      color: PURPLE,
      number: '03'
    },
    {
      icon: BiGroup,
      bgIcon: FaUsersCog,
      end: '100',
      suffix: '+',
      label: 'Visionaries Bringing Forth Decades of Expertise',
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
      <div style={{
        width: '100%',
        maxWidth: '1536px',
        padding: '100px 24px 120px 24px',
        backgroundColor: '#FAFBFC',
        backgroundImage: 'url("/bgimage.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}>
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
            style={{ marginTop: '-220px' }}
          >


            {/* Big Legacy Counter */}
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '20px' }} className="pisl-stats-legacy">
              <span style={{
                fontSize: 'clamp(70px, 8vw, 110px)',
                fontWeight: 900,
                color: NAVY,
                lineHeight: 0.85,
                letterSpacing: '-6px'
              }}>{legacyCount}</span>
              <span style={{ fontSize: 'clamp(40px, 5vw, 70px)', fontWeight: 900, color: ORANGE, lineHeight: 0.85, marginLeft: '4px' }}>+</span>
            </div>

            {/* Core Message Text */}
            <h2 style={{
              fontSize: 'clamp(24px, 3vw, 32px)', 
              fontWeight: 800, 
              color: NAVY,
              lineHeight: '1.25', 
              margin: '0 0 20px 0', 
              letterSpacing: '-1px'
            }}>
              Building Global-Standard <span style={{ color: ORANGE }}>Industrial & Logistics Parks.</span>
            </h2>

            {/* Decorative Line */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }} className="pisl-stats-line">
              <div style={{ width: '40px', height: '5px', backgroundColor: NAVY, borderRadius: '2px' }}></div>
              <div style={{ width: '16px', height: '5px', backgroundColor: ORANGE, borderRadius: '2px' }}></div>
            </div>

            <p style={{
              fontSize: '14.5px', color: '#4B5563', lineHeight: '1.7',
              margin: 0, fontWeight: 500, maxWidth: '480px'
            }}>
              When you choose PISL, you gain a partner dedicated to understanding your business needs to support your growth — because your success is our relentless pursuit.
            </p>
            

          </motion.div>

          {/* ── RIGHT SIDE: 2x2 Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pisl-stats-cards">
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
            gap: 60px !important;
          }
          .pisl-stats-left {
            padding-right: 0 !important;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-top: 0 !important;
          }
          .pisl-stats-left h2 {
            text-align: center;
          }
          .pisl-stats-left p {
            text-align: center;
          }
          .pisl-stats-label-wrapper, .pisl-stats-legacy, .pisl-stats-line {
            justify-content: center;
          }
          .pisl-proud-badge {
            text-align: center !important;
          }
        }
        @media (max-width: 640px) {
          .pisl-stats-cards {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;