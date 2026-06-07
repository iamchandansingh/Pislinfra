import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaRulerCombined, FaUsers, FaBuilding } from 'react-icons/fa';

/* =============================================================================
   COUNTER COMPONENT - Animated count-up effect (4 Seconds)
============================================================================= */
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
            // Ease-out function for smooth slowdown at the end
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

/* =============================================================================
   TYPOGRAPHY STAT ITEM - Centered, small, pure text
============================================================================= */
const TextStat = ({ icon: Icon, end, suffix, label, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center aligned elements horizontally
        justifyContent: 'center',
        textAlign: 'center', // Center text alignment
        gap: '6px', 
      }}
    >
      {/* Centered Typography Number */}
      <div style={{
        fontSize: 'clamp(36px, 4vw, 56px)', 
        fontWeight: 900,
        color: color,
        lineHeight: 1,
        letterSpacing: '-1px',
      }}>
        {/* Count effect explicitly set to 4000ms (4 seconds) */}
        <Counter end={end} suffix={suffix} duration={4000} />
      </div>

      {/* Sleek Centered Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        color: '#28286e',
      }}>
        <Icon style={{ fontSize: '14px', color: '#ff8755' }} />
        <span style={{
          fontSize: '11px', 
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          lineHeight: 1.4,
          whiteSpace: 'pre-line',
          textAlign: 'center', // Fix for multiline text centering
        }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
};

/* =============================================================================
   MAIN COMPONENT
============================================================================= */
const Industries = () => {
  const stats = [
    {
      icon: FaMapMarkerAlt,
      end: 25,
      suffix: '+',
      label: 'Locations\nCovered',
      color: '#28286e', // Navy
      delay: 0,
    },
    {
      icon: FaRulerCombined,
      end: 16,
      suffix: '+',
      label: 'Million Sq. Ft.\nConstructed',
      color: '#ff8755', // Orange
      delay: 0.15,
    },
    {
      icon: FaUsers,
      end: 600,
      suffix: '+',
      label: 'Employee\nStrength',
      color: '#28286e', // Navy
      delay: 0.3,
    },
    {
      icon: FaBuilding,
      end: 10,
      suffix: '+',
      label: 'Upcoming\nProjects',
      color: '#ff8755', // Orange
      delay: 0.45,
    },
  ];

  return (
    <section style={{
      padding: '80px 24px', // Optimized padding since header is removed
      background: '#f8fafc',
      fontFamily: '"Inter", "Helvetica Neue", sans-serif',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Pure Text Grid - Fully Centered Content */}
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

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 1024px) {
          .text-stats-layout { 
            grid-template-columns: repeat(2, 1fr) !important; 
            row-gap: 50px !important;
          }
        }
        @media (max-width: 640px) {
          .text-stats-layout { 
            grid-template-columns: 1fr !important; 
            row-gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Industries;