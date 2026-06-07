import React from 'react';
import { motion } from 'framer-motion';

/* ─── CORPORATE BRAND COLORS ─────────────────────────────────────────────── */
const NAVY = '#28296F';
const ORANGE = '#ff904e';

/* ─── SERVICES DATA WITH LOCAL IMAGES ────────────────────────────────────── */
const servicesData = [
  {
    id: 'design',
    title: 'DESIGN',
    desc: 'It is not the beauty of a building you should look at, it is the construction of the foundation that will stand the test of time.',
    img: '/images/Overview/3.png',
  },
  {
    id: 'construction',
    title: 'CONSTRUCTION',
    desc: 'Construction is an important milestone which requires completion to aid an efficient project delivery.',
    img: '/images/Overview/vpw.png',
  }
];

/* ─── COMPACT SQUARE CARD COMPONENT ──────────────────────────────────────── */
const SquareServiceCard = ({ data, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      style={{
        background: '#ffffff',
        borderRadius: '0px',
        overflow: 'hidden',
        boxShadow: '0 15px 30px rgba(15, 23, 42, 0.25)',
        position: 'relative',
        width: '100%',
        maxWidth: '360px',
        height: '360px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* ── Image Section ── */}
      <div style={{ 
        position: 'relative', 
        height: '55%', 
        overflow: 'hidden',
        flexShrink: 0,
        borderRadius: '0px'
      }}>
        <motion.img
          src={data.img}
          alt={data.title}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            display: 'block',
            borderRadius: '0px'
          }}
        />
        
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute', 
          inset: 0,
          background: `linear-gradient(to top, ${NAVY}99 0%, transparent 60%)`,
          pointerEvents: 'none',
          borderRadius: '0px'
        }} />
      </div>

      {/* ── Content Section ── */}
      <div style={{ 
        padding: '20px 24px', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#ffffff'
      }}>
        
        {/* Title */}
        <h3 style={{
          fontSize: '18px', 
          fontWeight: 800, 
          color: NAVY,
          margin: '0 0 10px 0', 
          letterSpacing: '-0.5px',
          lineHeight: 1.2
        }}>
          {data.title}
        </h3>
        
        {/* Description */}
        <p style={{
          fontSize: '12px', 
          color: '#64748b',
          lineHeight: '1.5', 
          margin: 0, 
          fontWeight: 400
        }}>
          {data.desc}
        </p>
      </div>
    </motion.div>
  );
};

/* ─── MAIN SERVICES COMPONENT ────────────────────────────────────────────── */
const Services = () => {
  return (
    <section style={{ 
      padding: '60px 24px', 
      background: NAVY,
      fontFamily: '"Inter", "-apple-system", sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* ── Compact Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 34px)', 
            fontWeight: 800, 
            color: '#ffffff',
            margin: 0, 
            letterSpacing: '-1px',
            lineHeight: 1.2
          }}>
            Our Strategic <span style={{ color: ORANGE }}>Capabilities.</span>
          </h2>
        </motion.div>

        {/* ── Centered Cards Grid ── */}
        <div style={{
          display: 'flex', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '30px'
        }}>
          {servicesData.map((data, index) => (
            <SquareServiceCard key={data.id} data={data} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;