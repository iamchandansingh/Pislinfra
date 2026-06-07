import React from 'react';
import { motion } from 'framer-motion';

/* ─── CORPORATE BRAND COLORS ─────────────────────────────────────────────── */
const NAVY = '#28286e';
const ORANGE = '#ff8755';

/* ─── MAIN 404 COMPONENT ─────────────────────────────────────────────────── */
const NotFound = () => {
  return (
    <section style={{
      height: '100vh',
      width: '100%',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Inter", "-apple-system", sans-serif',
      padding: '0 24px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      {/* Structural Minimalist Grid Alignment */}
      <div style={{
        textAlign: 'center',
        maxWidth: '540px',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Massive Monolith 404 Number */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(100px, 15vw, 160px)',
            fontWeight: 900,
            color: NAVY,
            margin: '0 0 12px 0',
            letterSpacing: '-6px',
            lineHeight: 1
          }}
        >
          404<span style={{ color: ORANGE }}>.</span>
        </motion.h1>

        {/* Crisp Error Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontSize: '20px',
            fontWeight: 800,
            color: NAVY,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: '0 0 16px 0'
          }}
        >
          Page Not Found
        </motion.h2>

        {/* Clean Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            fontSize: '15px',
            color: '#64748b',
            lineHeight: '1.6',
            margin: '0 0 40px 0',
            fontWeight: 500
          }}
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </motion.p>

        {/* Premium Clickable Link Routing */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <a
            href="/"
            className="pisl-404-link"
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: NAVY,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.3s ease',
              position: 'relative'
            }}
          >
            Return to Homepage 
            <span className="route-arrow" style={{ transition: 'transform 0.3s ease', color: ORANGE }}>→</span>
          </a>
        </motion.div>

      </div>

      {/* Global CSS for interactions */}
      <style>{`
        .pisl-404-link:hover {
          color: ${ORANGE} !important;
        }
        .pisl-404-link:hover .route-arrow {
          transform: translateX(6px);
        }
      `}</style>
    </section>
  );
};

export default NotFound;