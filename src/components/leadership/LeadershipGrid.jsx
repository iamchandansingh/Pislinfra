import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaEnvelope, FaCircle } from 'react-icons/fa';

/* ─── CORPORATE BRAND COLORS ─────────────────────────────────────────────── */
const NAVY = '#28296F';
const ORANGE = '#ff904e';

/* ─── CORE TEAM DATASET ────────────────────────────────────────────────── */
const teamMembers = [
  { id: 1, name: 'Aarav Sharma', role: 'Project Director', dept: 'Operations', desc: 'Managing major on-site timelines and asset deployments efficiently.' },
  { id: 2, name: 'Ishita Singh', role: 'Chief Structural Engineer', dept: 'Engineering', desc: 'Designing heavy industrial frameworks with advanced calculation tools.' },
  { id: 3, name: 'Kabir Malhotra', role: 'Head of Procurement', dept: 'Supply Chain', desc: 'Overseeing corporate partnerships and seamless material pipelines.' },
  { id: 4, name: 'Riya Verma', role: 'EHS Lead Specialist', dept: 'Safety & Health', desc: 'Enforcing strict zero-harm protocols and green park guidelines.' },
  { id: 5, name: 'Rohan Joshi', role: 'BIM Manager', dept: 'Design & Tech', desc: 'Developing smart 3D spatial models for high-end warehousing.' },
  { id: 6, name: 'Ananya Gupta', role: 'Contracts Administrator', dept: 'Legal & Finance', desc: 'Handling commercial legal frameworks and enterprise evaluations.' },
  { id: 7, name: 'Devendra Yadav', role: 'Plant Machinery In-charge', dept: 'Equipment', desc: 'Optimizing heavy structural execution and concrete workflows.' },
  { id: 8, name: 'Meera Nair', role: 'Planning Controls Manager', dept: 'Operations', desc: 'Structuring data milestones across PAN-India logistics assets.' },
  { id: 9, name: 'Vikram Rathore', role: 'Senior Site Coordinator', dept: 'Execution', desc: 'Supervising direct ground engineers and rapid cycle builds.' },
  { id: 10, name: 'Siddharth Shah', role: 'Quality Assurance Lead', dept: 'QA / QC', desc: 'Maintaining standard certifications and operational excellence.' },
  { id: 11, name: 'Kriti Saxena', role: 'Lead Architect', dept: 'Design & Tech', desc: 'Creating futuristic layouts inspired by sleek minimalist aesthetics.' },
  { id: 12, name: 'Arjun Mehta', role: 'Business Development Manager', dept: 'Strategy', desc: 'Expanding logistical market value footprints across micro hubs.' },
  { id: 13, name: 'Pranav Rao', role: 'MEP Infrastructure Lead', dept: 'Engineering', desc: 'Integrating high-speed automated power sync grids inside complexes.' },
  { id: 14, name: 'Sneha Kulkarni', role: 'HR & Talent Partner', dept: 'Corporate', desc: 'Managing strategic workplace talent and human resource policies.' },
  { id: 15, name: 'Aditya Mishra', role: 'Senior Quantity Surveyor', dept: 'Estimation', desc: 'Analyzing direct material metrics and commercial budget limits.' },
  { id: 16, name: 'Neha Kapoor', role: 'Sustainability Consultant', dept: 'EHS', desc: 'Spearheading alternative clean power designs across facilities.' }
];

/* ─── LINEAR ROW PROFILE COMPONENT ───────────────────────────────────────── */
const TeamRowItem = ({ member, index }) => {
  const avatarImg = `https://images.unsplash.com/photo-${index % 2 === 0 ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'}?w=300&q=80`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.04 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1.2fr 1.5fr 2fr 80px',
        alignItems: 'center',
        padding: '16px 24px',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        gap: '24px',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
      className="pisl-matrix-linear-row"
    >
      {/* Column 1: Small Vertical Frame Portrait (Strict Full Color) */}
      <div style={{
        width: '56px',
        height: '72px',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#f1f5f9',
        flexShrink: 0
      }}>
        <img 
          src={avatarImg} 
          alt={member.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none' }} 
        />
      </div>

      {/* Column 2: Structural Name Plate */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: 800, color: NAVY, margin: 0, letterSpacing: '-0.2px' }}>
          {member.name}
        </h4>
      </div>

      {/* Column 3: Designation Designation Badge & Role Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <p style={{ fontSize: '13.5px', color: '#0f172a', fontWeight: 700, margin: 0 }}>
          {member.role}
        </p>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: ORANGE, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <FaCircle style={{ fontSize: '5px' }} /> {member.dept}
        </span>
      </div>

      {/* Column 4: Horizontal Dynamic Description Content */}
      <div>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: '1.4' }}>
          {member.desc}
        </p>
      </div>

      {/* Column 5: Right Aligned Actions */}
      <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
        <a href="#linkedin" className="pisl-row-link" style={{ color: '#94a3b8', transition: 'color 0.2s' }}><FaLinkedinIn style={{ fontSize: '13px' }} /></a>
        <a href="#email" className="pisl-row-link" style={{ color: '#94a3b8', transition: 'color 0.2s' }}><FaEnvelope style={{ fontSize: '13px' }} /></a>
      </div>
    </motion.div>
  );
};

/* ─── MAIN MATRIX GRID SECTION ───────────────────────────────────────────── */
const CoreTeamGrid = () => {
  return (
    <section style={{
      padding: '90px 24px',
      background: '#ffffff',
      fontFamily: '"Inter", "-apple-system", sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          marginBottom: '40px',
          borderBottom: `2px solid ${NAVY}`,
          paddingBottom: '20px'
        }} className="pisl-team-header">
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: NAVY, margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
              Our <span style={{ color: ORANGE }}>Core Team</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, margin: 0 }}>
              The domain professionals executing India's premium industrial infrastructure portfolios.
            </p>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: NAVY, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Total Assets: <span style={{ color: ORANGE }}>{teamMembers.length}</span>
          </div>
        </div>

        {/* Linear Stack Container */}
        <div style={{ 
          borderTop: '1px solid #e2e8f0', 
          borderRadius: '16px', 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(40, 41, 111, 0.02)'
        }} className="pisl-matrix-linear-wrapper">
          {teamMembers.map((member, index) => (
            <TeamRowItem key={member.id} member={member} index={index} />
          ))}
        </div>

      </div>

      {/* Responsive Structural Breakdown Rules */}
      <style>{`
        .pisl-matrix-linear-row:hover {
          background: #f8fafc !important;
          transform: scale(1.005);
          z-index: 5;
        }
        .pisl-row-link:hover {
          color: ${ORANGE} !important;
        }
        @media (max-width: 992px) {
          .pisl-matrix-linear-row {
            grid-template-columns: 70px 1.5fr 1.5fr 1fr !important;
            grid-template-areas: "img name info action" "img desc desc desc";
            gap: 12px !important;
            padding: 16px !important;
          }
          .pisl-matrix-linear-row > div:nth-child(1) { grid-area: img; }
          .pisl-matrix-linear-row > div:nth-child(2) { grid-area: name; }
          .pisl-matrix-linear-row > div:nth-child(3) { grid-area: info; }
          .pisl-matrix-linear-row > div:nth-child(4) { grid-area: desc; margin-top: 4px; }
          .pisl-matrix-linear-row > div:nth-child(5) { grid-area: action; }
        }
        @media (max-width: 640px) {
          .pisl-matrix-linear-row {
            grid-template-columns: 60px 1fr !important;
            grid-template-areas: "img name" "img info" "desc desc" "action action" !important;
            padding: 16px !important;
            gap: 8px !important;
          }
          .pisl-matrix-linear-row > div:disabled { display: none; }
          .pisl-matrix-linear-row > div:nth-child(5) { justify-content: flex-start !important; margin-top: 8px; }
          .pisl-team-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
      `}</style>
    </section>
  );
};

export default CoreTeamGrid;