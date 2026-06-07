import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaCity, FaSearchLocation, FaChartLine, FaUsersCog } from 'react-icons/fa';

/* ─── CORPORATE BRAND COLORS ─────────────────────────────────────────────── */
const NAVY = '#28296F';
const ORANGE = '#ff904e';

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

/* ─── MATRIX ROW COMPONENT ────────────────────────────────────────────────── */
const StatRow = ({ icon: Icon, end, suffix, label, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useCountUp(end, 2, isInView);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '32px 24px',
        gap: '40px',
        background: '#ffffff',
        borderRadius: '16px',
        marginBottom: '12px',
        boxShadow: '0 4px 12px rgba(40, 41, 111, 0.02)'
      }}
      className="pisl-matrix-row"
    >
      {/* Left side: Icon + Label description */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: 'rgba(40, 41, 111, 0.04)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Icon style={{ fontSize: '18px', color: ORANGE }} />
        </div>
        <p style={{
          fontSize: '14.5px', color: '#475569', margin: 0,
          fontWeight: 500, lineHeight: '1.5', maxWidth: '400px'
        }}>
          {label}
        </p>
      </div>

      {/* Right side: Bold Huge Typography Number with Count Animation */}
      <div style={{
        fontSize: '44px', fontWeight: 900, color: NAVY,
        lineHeight: 1, letterSpacing: '-1px', textAlign: 'right', flexShrink: 0
      }}>
        {count}<span style={{ color: ORANGE, fontWeight: 600, fontSize: '28px', marginLeft: '2px' }}>{suffix}</span>
      </div>
    </motion.div>
  );
};

/* ─── MAIN STATS MATRIX COMPONENT ────────────────────────────────────────── */
const StatsSection = () => {
  const mainRef = useRef(null);
  const mainInView = useInView(mainRef, { once: true });
  const legacyCount = useCountUp('17', 2.5, mainInView);
  
  const dataset = [
    {
      icon: FaCity,
      end: '10',
      suffix: 'M+',
      label: 'Million Sq. Ft of Optimally-Designed Spaces'
    },
    {
      icon: FaSearchLocation,
      end: '25',
      suffix: '+',
      label: 'Key Micro Markets Signify Our PAN-India Presence'
    },
    {
      icon: FaChartLine,
      end: '20',
      suffix: 'M',
      label: 'Million Sq. Ft Development Pipeline Over Next 3 Years'
    },
    {
      icon: FaUsersCog,
      end: '100',
      suffix: '+',
      label: 'Visionaries Bringing Forth Decades of Expertise'
    }
  ];

  return (
    <section style={{
      padding: '120px 24px',
      background: '#f4f6fa',
      fontFamily: '"Inter", "-apple-system", BlinkMacSystemFont, sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '80px',
          alignItems: 'start'
        }} className="pisl-matrix-layout">
          
          {/* ── LEFT SIDE: Main Legacy Block ── */}
          <motion.div
            ref={mainRef}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ position: 'sticky', top: '40px' }}
          >
            {/* Big Legacy Counter with Count Animation */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
              <span style={{
                fontSize: 'clamp(72px, 8vw, 110px)',
                fontWeight: 900,
                color: NAVY,
                lineHeight: 0.8,
                letterSpacing: '-4px'
              }}>{legacyCount}</span>
              <span style={{ fontSize: '48px', fontWeight: 900, color: ORANGE }}>+</span>
              <span style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#64748b',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginLeft: '12px'
              }}>Years of Impact</span>
            </div>

            {/* Core Message Text */}
            <h2 style={{
              fontSize: '24px', fontWeight: 900, color: '#0f172a',
              lineHeight: '1.3', margin: '0 0 20px 0', letterSpacing: '-0.5px'
            }}>
              Building Global-Standard Industrial & Logistics Parks.
            </h2>

            <p style={{
              fontSize: '14.5px', color: '#64748b', lineHeight: '1.7',
              margin: 0, fontWeight: 500, maxWidth: '440px'
            }}>
              When you choose PISL, you gain a partner dedicated to understanding your business needs to support your growth — because your success is our relentless pursuit.
            </p>
          </motion.div>

          {/* ── RIGHT SIDE: Linear Matrix Grid Rows ── */}
          <div style={{ paddingTop: '12px' }} className="pisl-matrix-wrapper">
            {dataset.map((stat, idx) => (
              <StatRow 
                key={idx}
                icon={stat.icon}
                end={stat.end}
                suffix={stat.suffix}
                label={stat.label}
                delay={idx * 0.12}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Fluid Responsive Adaptation */}
      <style>{`
        @media (max-width: 992px) {
          .pisl-matrix-layout {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          div[style*="position: 'sticky'"] {
            position: relative !important;
            top: 0 !important;
          }
        }
        @media (max-width: 600px) {
          .pisl-matrix-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
            padding: 24px 20px !important;
          }
          .pisl-matrix-row > div:last-child {
            textAlign: left !important;
            font-size: 38px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;