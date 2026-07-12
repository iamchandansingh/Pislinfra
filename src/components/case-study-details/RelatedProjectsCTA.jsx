// src/components/case-study-details/RelatedProjectsCTA.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';

const fallbackImage = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600';

/* ──────────────────────────────────────────────────────────────
   Section Header
   ────────────────────────────────────────────────────────────── */

const SectionHeader = ({ title }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    style={{ textAlign: 'center', marginBottom: '36px' }}
  >
    <h2 style={{
      fontSize: '24px',
      fontWeight: 800,
      color: '#071426',
      margin: 0,
      letterSpacing: '-0.02em',
      fontFamily: 'Inter, sans-serif',
    }}>
      {title}
    </h2>
  </motion.div>
);

/* ──────────────────────────────────────────────────────────────
   Project Card
   ────────────────────────────────────────────────────────────── */

const ProjectCard = ({ project, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={cardVariant}
      custom={index}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/case-studies/${project.slug}`)}
      style={cardWrapStyle}
    >
      <div style={imageWrapStyle}>
        <img
          src={project.image || fallbackImage}
          alt={project.title}
          style={imageStyle}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        />
        {project.category && (
          <span style={categoryBadgeStyle}>{project.category}</span>
        )}
      </div>
      <div style={cardBodyStyle}>
        <h3 style={cardTitleStyle}>{project.title}</h3>
        {project.location && (
          <span style={locationStyle}>
            <FiMapPin size={12} style={{ color: '#ff6b00' }} />
            {project.location}
          </span>
        )}
        <span style={ctaLinkStyle}>
          View Case Study <FiArrowRight size={14} />
        </span>
      </div>
    </motion.div>
  );
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const cardWrapStyle = {
  backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #EEF2F7',
  cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
  fontFamily: 'Inter, sans-serif',
};

const imageWrapStyle = { position: 'relative', height: '220px', overflow: 'hidden' };
const imageStyle = {
  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
  transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
};
const categoryBadgeStyle = {
  position: 'absolute', top: '14px', left: '14px',
  backgroundColor: '#ff6b00', color: '#FFFFFF', borderRadius: '8px',
  padding: '5px 12px', fontSize: '10px', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif',
};
const cardBodyStyle = { padding: '20px' };
const cardTitleStyle = {
  fontSize: '17px', fontWeight: 700, color: '#071426', margin: '0 0 8px 0',
  fontFamily: 'Inter, sans-serif',
};
const locationStyle = {
  display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px',
  color: '#94A3B8', marginBottom: '14px', fontFamily: 'Inter, sans-serif',
};
const ctaLinkStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  fontSize: '13px', fontWeight: 600, color: '#ff6b00',
  fontFamily: 'Inter, sans-serif', cursor: 'pointer',
};

/* ──────────────────────────────────────────────────────────────
   Related Projects Grid
   ────────────────────────────────────────────────────────────── */

const RelatedProjectsGrid = ({ projects = [] }) => {
  if (!projects || projects.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#94A3B8', fontFamily: 'Inter, sans-serif', padding: '40px 0' }}>
        No related projects found.
      </p>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rp-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: '24px',
      }}
    >
      {projects.map((project, i) => (
        <ProjectCard key={project.id || i} project={project} index={i} />
      ))}
    </motion.div>
  );
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ──────────────────────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────────────────────── */

const RelatedProjectsCTA = ({ relatedProjects = [], currentProject }) => {
  const filteredProjects = relatedProjects.filter(
    (p) => p.slug !== currentProject?.slug
  );

  return (
    <section
      style={{
        backgroundColor: '#f8fafc',
        padding: '80px 0',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          width: '100%',
          maxWidth: '1370px',
          padding: '0 20px',
        }}
      >
        <SectionHeader title="Explore More Success Stories" />
        <RelatedProjectsGrid projects={filteredProjects.slice(0, 3)} />
      </div>

      {/* Responsive */}
      <style>{`
        @media (min-width: 640px) {
          .rp-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .rp-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 28px !important; }
        }
      `}</style>
    </section>
  );
};

export default RelatedProjectsCTA;