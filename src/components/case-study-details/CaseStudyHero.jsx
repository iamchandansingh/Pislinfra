// src/components/case-study-details/CaseStudyHero.jsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  FiMapPin,
  FiLayers,
  FiChevronRight,
  FiHome,
} from 'react-icons/fi';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { delay, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

const HeroBreadcrumb = ({ title }) => (
  <motion.nav variants={fadeUp(0)} initial="hidden" animate="visible" style={breadcrumbNav} aria-label="Breadcrumb">
    <a href="/" style={breadcrumbLink}><FiHome size={14} /><span>Home</span></a>
    <FiChevronRight size={14} style={breadcrumbIcon} />
    <a href="/projects/case-study" style={breadcrumbLink}>Case Studies</a>
    <FiChevronRight size={14} style={breadcrumbIcon} />
    <span style={{ ...breadcrumbLink, color: 'rgba(255,255,255,0.9)', cursor: 'default' }}>{title}</span>
  </motion.nav>
);

const breadcrumbNav = { display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif' };
const breadcrumbLink = { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' };
const breadcrumbIcon = { color: 'rgba(255,255,255,0.35)' };

const HeroContent = ({ caseStudy }) => (
  <motion.div variants={fadeUp(0.15)} initial="hidden" animate="visible" style={{ marginTop: '16px' }}>
    <h1 style={titleStyle}>{caseStudy.title}</h1>
    {caseStudy.subtitle && <p style={subtitleStyle}>{caseStudy.subtitle}</p>}
    <div style={metaRow}>
      {caseStudy.location && (
        <span style={metaItem}><FiMapPin size={14} style={{ color: '#ff6b00' }} />{caseStudy.location}</span>
      )}
      {caseStudy.area && (
        <span style={metaItem}><FiLayers size={14} style={{ color: '#ff6b00' }} />{caseStudy.area}</span>
      )}
    </div>
    {caseStudy.description && <p style={descStyle}>{caseStudy.description}</p>}
  </motion.div>
);

const titleStyle = {
  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, lineHeight: 1.15,
  color: '#ffffff', margin: 0, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em',
};
const subtitleStyle = {
  fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', fontWeight: 500,
  color: 'rgba(255,255,255,0.7)', margin: '6px 0 0 0', fontFamily: 'Inter, sans-serif',
};
const metaRow = { display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '10px' };
const metaItem = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif',
};
const descStyle = {
  fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)',
  margin: '10px 0 0 0', maxWidth: '480px', fontFamily: 'Inter, sans-serif',
};

const CaseStudyHero = ({ caseStudy = {} }) => {
  const heroImage = caseStudy.heroImage || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400';

  return (
    <section style={{ position: 'relative', width: '100%', height: '380px', overflow: 'hidden', backgroundColor: '#071426', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <motion.div initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }} style={{ width: '100%', height: '100%' }}>
          <img src={heroImage} alt={caseStudy.title || 'Case Study'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </motion.div>
      </div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(7,20,38,0.78) 40%, rgba(7,20,38,0.3) 100%)' }} />

      <div style={{ position: 'relative', zIndex: 2, margin: '0 auto', width: '100%', maxWidth: '1370px', height: '100%', padding: '0 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <HeroBreadcrumb title={caseStudy.title || 'Case Study'} />
        <HeroContent caseStudy={caseStudy} />
      </div>

      <style>{`
        @media (min-width: 640px) {
          .hero-section { height: 420px !important; }
        }
        @media (min-width: 1024px) {
          .hero-section { height: 400px !important; }
        }
      `}</style>
    </section>
  );
};

export default CaseStudyHero;