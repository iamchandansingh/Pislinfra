import React from 'react';
import { motion } from 'framer-motion';
import notFoundIllustration from '../assets/images/page-not-found.jpg';

/* ─── CORPORATE BRAND COLORS ─────────────────────────────────────────────── */
const NAVY = '#28286e';
const ORANGE = '#ff8755';

/* ─── MAIN 404 COMPONENT ─────────────────────────────────────────────────── */
const NotFound = () => {
  return (
    <section style={{
      minHeight: '55vh',
      width: '100%',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Inter", "-apple-system", sans-serif',
      padding: '40px 24px 50px 24px',
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
        
        {/* Page Not Found Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ marginBottom: '16px' }}
        >
          <img
            src={notFoundIllustration}
            onError={(e) => {
              if (!e.currentTarget.dataset.fallback) {
                e.currentTarget.dataset.fallback = 'true';
                e.currentTarget.src = '/images/page-not-found.jpg';
              }
            }}
            alt="Page Not Found"
            style={{
              maxWidth: '380px',
              width: '100%',
              height: 'auto',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </motion.div>

        {/* Clean Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            fontSize: '15px',
            color: '#64748b',
            lineHeight: '1.6',
            margin: '0 0 24px 0',
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