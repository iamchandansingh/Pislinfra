import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBriefcase, FaNetworkWired } from 'react-icons/fa';

/* ─── CORPORATE BRAND COLORS ─────────────────────────────────────────────── */
const NAVY = '#28296F';
const ORANGE = '#ff904e';

const LeadershipMember = () => {
  return (
    <section style={{
      padding: '90px 24px',
      background: '#ffffff', // Clean crisp light backdrop
      fontFamily: '"Inter", "-apple-system", sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* New Architectural Profile Block Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.25fr',
          gap: '64px',
          alignItems: 'center',
          background: '#f8fafc', // Soft base container instead of floating box shadows
          borderRadius: '28px',
          padding: '40px',
          border: '1px solid #e2e8f0'
        }} className="pisl-leader-modern-layout">
          
          {/* ── LEFT COLUMN: Full portrait ratio asset image frame ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', position: 'relative' }}
          >
            <div style={{
              width: '100%',
              paddingTop: '125%', // Strict uniform vertical structural layout ratio
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#e2e8f0',
              position: 'relative',
              boxShadow: '0 12px 32px rgba(40, 41, 111, 0.05)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80" 
                alt="Shubhendra Mittal" 
                style={{ 
                  position: 'absolute', top: 0, left: 0,
                  width: '100%', height: '100%', objectFit: 'cover'
                }}
              />
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Sharp, Left-Aligned Content Stack ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}
          >
            {/* Header Identity Block */}
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 900, color: NAVY,
              margin: '0 0 4px 0', letterSpacing: '-1px', lineHeight: 1.15
            }}>
              Shubhendra Mittal
            </h2>
            
            <p style={{
              fontSize: '13px', fontWeight: 800, color: ORANGE,
              letterSpacing: '1.5px', textTransform: 'uppercase',
              margin: '0 0 24px 0'
            }}>
              Partner & Managing Director
            </p>

            {/* Premium Divider Hook */}
            <div style={{ width: '40px', height: '3px', background: ORANGE, borderRadius: '2px', marginBottom: '24px' }} />

            {/* Core Narrative Bio */}
            <p style={{
              fontSize: '15px', color: '#475569', lineHeight: '1.8',
              margin: '0 0 32px 0', fontWeight: 500
            }}>
              A graduate from IIT Kharagpur with an excellent knowledge & 33+ years of expertise in Steel Fabrication, Infrastructure Development & Business Development coupled with excellent networking and communication skills. He has a natural flair for in depth technical analysis and technological innovation.
            </p>

            {/* Linear Typographic Attribute Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '28px',
              width: '100%'
            }} className="pisl-leader-modern-meta">
              
              {/* Asset Parameter 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <FaGraduationCap style={{ color: ORANGE, fontSize: '18px' }} />
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: NAVY }}>IIT Kharagpur</h4>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Alumnus Graduate</p>
              </div>

              {/* Asset Parameter 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <FaBriefcase style={{ color: NAVY, fontSize: '16px' }} />
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: NAVY }}>33+ Years</h4>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Industry Expertise</p>
              </div>

              {/* Asset Parameter 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <FaNetworkWired style={{ color: ORANGE, fontSize: '16px' }} />
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: NAVY }}>Innovation</h4>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Technical Analysis</p>
              </div>

            </div>

          </motion.div>

        </div>
      </div>

      {/* Fluid CSS queries injection for flawless tablet cross-over */}
      <style>{`
        @media (max-width: 992px) {
          .pisl-leader-modern-layout {
            grid-template-columns: 1fr !important;
            padding: 32px 24px !important;
            gap: 40px !important;
          }
          .pisl-leader-modern-meta {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default LeadershipMember;