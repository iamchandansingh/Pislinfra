import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── CORPORATE BRAND COLORS ─────────────────────────────────────────────── */
const NAVY = '#28296F';
const ORANGE = '#ff904e';

/* ─── MAIN ABOUT US COMPONENT ────────────────────────────────────────────── */
const AboutUs = ({ data }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  // 5 Premium PISL Reference Images
  const images = [
    "/images/Overview/53.png",
    "/images/Overview/56.png",
    "/images/Overview/62.png",
    "/images/Overview/58.png",
    "/images/Overview/43.png"
  ];

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="pisl-about-modern-section" style={{ 
      backgroundColor: '#FFFFFF', 
      padding: '70px 0', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <div className="pisl-container" style={{ 
        maxWidth: '1360px', 
        margin: '0 auto', 
        padding: '0 24px', 
        display: 'grid', 
        gridTemplateColumns: '45% 55%', 
        gap: '60px', 
        alignItems: 'center' 
      }}>
        
        {/* ── LEFT COLUMN: Elegant Single Dynamic Image Frame ── */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '460px', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          boxShadow: '0 20px 40px -15px rgba(40, 41, 111, 0.12)',
          background: '#f1f5f9'
        }}>
          <AnimatePresence mode="wait">
            <motion.img 
              key={activeIndex}
              src={images[activeIndex]} 
              alt="PISL Infrastructure Excellence" 
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                objectPosition: 'center',
                display: 'block' 
              }} 
            />
          </AnimatePresence>

          {/* Bottom Gradient for Image Depth */}
          <div style={{ 
            position: 'absolute', inset: 'auto 0 0 0', height: '70px', 
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)', pointerEvents: 'none' 
          }} />
        </div>

        {/* ── RIGHT COLUMN: Clickable Typography Block (Redirects cleanly to /about) ── */}
        <motion.div 
          onClick={() => navigate('/about')}
          initial={{ opacity: 0, x: 20 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          whileHover={{ x: 6 }}
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }}
          className="pisl-clickable-block"
          style={{
            display: 'block',
            textDecoration: 'none', 
            color: 'inherit',
            cursor: 'pointer'
          }}
        >
          {/* Main Title */}
          <h2 className="pisl-title" style={{ 
            fontSize: 'clamp(30px, 3.5vw, 40px)', 
            fontWeight: 800, 
            color: NAVY, 
            lineHeight: '1.2', 
            letterSpacing: '-1px', 
            margin: '0 0 24px 0',
            transition: 'opacity 0.3s ease'
          }}>
            {data?.aboutTitle ? <span dangerouslySetInnerHTML={{__html: data.aboutTitle}} /> : <>About <span style={{ color: ORANGE }}> Our Expertise </span></>}
          </h2>

          {/* Content Paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: '1.75', margin: 0, fontWeight: 500 }}>
              {data?.aboutDesc ? data.aboutDesc.split('\n')[0] : "We at PISL are recognised as India's leading construction company, providing services to well-reputed clientele in various sectors. We are committed to excellence, specializing in the full-cycle development of high-quality industrial and warehousing assets."}
            </p>
            <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: '1.75', margin: 0, fontWeight: 500 }}>
              {data?.aboutDesc && data.aboutDesc.includes('\n') ? data.aboutDesc.split('\n')[1] : "A client-first approach anchors our mission. As we expand our footprint nationwide, we proactively address the evolving business requirements of our clients, ensuring optimum operational efficiency."}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Global Style overrides for micro-interactions & responsiveness */}
      <style>{`
        .pisl-clickable-block:hover .pisl-title {
          opacity: 0.85;
        }
        
        @media (max-width: 992px) {
          .pisl-simple-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .pisl-simple-layout > div {
            height: 320px !important;
          }
        }
        @media (max-width: 640px) {
          .pisl-simple-layout > div {
            height: 260px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutUs;