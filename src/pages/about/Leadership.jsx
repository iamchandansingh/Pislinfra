import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBriefcase, FaNetworkWired } from 'react-icons/fa';
import PageHero from '../../components/hero/PageHero';
import CoreTeamGrid from '../../components/leadership/CoreTeamGrid';

// Import images
import shubhendraMittalImg from '../../assets/images/leadership/Core Team/Shubhendra-Mittal.png';
import abhimanyuRaoImg from '../../assets/images/leadership/Core Team/1.png';
import kjrawal from '../../assets/images/leadership/Core Team/2.png';



const NAVY = '#28296F';
const ORANGE = '#ff904e';

const executiveLeaders = [
  {
    id: 1,
    name: 'YASH MITTAL',
    designation: 'Promoter – Director',
    bio: 'A Graduate in Mechanical Engg. from BITS Pilani  Dubai, focusing on deployment of new technologies  for growth and development of EPC business.',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
  },
  {
    id: 2,
    name: 'ABHIMANYU RAO',
    designation: 'Promoter – Director',
    bio: 'Spearheading robust commercial frameworks and technical innovation models to secure optimized logistics and warehousing portfolios.',
    img: abhimanyuRaoImg,
  },
  {
    id: 3,
    name: 'K.J. RAWAL',
    designation: 'Independent – Director',
    bio: 'A seasoned professional with 39+ years of experience in the EPC Industry. He joined Gannon Dunkerley & Co. Ltd. as a trainee engineer and rose to the ranks of Managing Director having executed large scale complex industrial projects Pan India.',
    img: kjrawal,
  }
];

const Leadership = () => {
  return (
    <div style={{ background: '#ffffff', fontFamily: '"Inter", "-apple-system", sans-serif' }}>
      
      <PageHero 
        title="Our Leadership" 
        subtitle="The visionaries and domain experts steering our growth"
        breadcrumb="Leadership"
        bgImage="/images/hero/leadership.png"
      />

      <section style={{ padding: '120px 24px', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '0.9fr 1.1fr',
            gap: '80px',
            alignItems: 'start'
          }} className="pisl-canvas-layout">
            
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'sticky', top: '40px' }}
            >
              <div style={{
                width: '100%',
                paddingTop: '130%', 
                borderRadius: '0 40px 0 40px', 
                overflow: 'hidden',
                background: '#f1f5f9',
                position: 'relative',
                boxShadow: '0 30px 60px -15px rgba(40, 41, 111, 0.12)'
              }}>
                <img 
                  src={shubhendraMittalImg} 
                  alt="Shubhendra Mittal" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ padding: '10px 0' }}
            >
              

              <h2 style={{
                fontSize: 'clamp(32px, 4.5vw, 44px)', fontWeight: 900, color: NAVY,
                margin: '0 0 8px 0', letterSpacing: '-1.5px', lineHeight: 1.1
              }}>
                Shubhendra Mittal
              </h2>
              
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#475569', margin: '0 0 40px 0', letterSpacing: '-0.2px' }}>
                Partner & Managing Director
              </p>

              <div style={{ borderLeft: `3px solid #e2e8f0`, paddingLeft: '28px', marginBottom: '48px' }}>
                <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: '1.85', margin: 0, fontWeight: 500 }}>
                  A graduate from IIT Kharagpur with an excellent knowledge & 33+ years of expertise in Steel Fabrication, Infrastructure Development & Business Development coupled with excellent networking and communication skills. He has a natural flair for in depth technical analysis and technological innovation.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 144, 78, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaGraduationCap style={{ color: ORANGE, fontSize: '18px' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '14.5px', fontWeight: 800, color: NAVY }}>IIT Kharagpur Alumnus</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Excellent professional knowledge base</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(40, 41, 111, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaBriefcase style={{ color: NAVY, fontSize: '16px' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '14.5px', fontWeight: 800, color: NAVY }}>33+ Years Core Expertise</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Steel Fabrication & Infrastructure Development</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 144, 78, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaNetworkWired style={{ color: ORANGE, fontSize: '16px' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '14.5px', fontWeight: 800, color: NAVY }}>Technological Innovation</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Natural flair for in-depth technical analysis</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 900, color: NAVY, margin: '0 0 12px 0', letterSpacing: '-0.8px' }}>
              Executive <span style={{ color: ORANGE }}>Management</span>
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', fontWeight: 500, maxWidth: '540px', margin: '0 auto', lineHeight: '1.5' }}>
              Steering large enterprise operations with highly structured corporate delivery models.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px 32px' }} className="pisl-exec-grid">
            {executiveLeaders.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: 'transparent', display: 'flex', flexDirection: 'column', position: 'relative' }}
                className="pisl-canvas-leader-card"
              >
                <div style={{ width: '100%', paddingTop: '125%', overflow: 'hidden', background: '#f1f5f9', borderRadius: '24px', position: 'relative', marginBottom: '20px', boxShadow: '0 10px 30px rgba(40, 41, 111, 0.04)' }}>
                  <img src={member.img} alt={member.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'none', transition: 'transform 0.5s ease' }} className="pisl-canvas-img" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(40, 41, 111, 0.25) 0%, transparent 60%)', pointerEvents: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left', padding: '0 4px' }}>
                  <h3 style={{ fontSize: '21px', fontWeight: 900, color: NAVY, margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>{member.name}</h3>
                  <p style={{ fontSize: '12.5px', fontWeight: 800, color: ORANGE, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>{member.designation}</p>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: 0, fontWeight: 500, flex: 1 }}>{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CoreTeamGrid />

      <style>{`
        .pisl-canvas-leader-card:hover .pisl-canvas-img { transform: scale(1.04); }
        .pisl-meta-anchor:hover { color: ${ORANGE} !important; }
        @media (max-width: 992px) {
          .pisl-canvas-layout { grid-template-columns: 1fr !important; gap: 48px !important; }
          div[style*="position: 'sticky'"] { position: relative !important; top: 0 !important; }
          .pisl-exec-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 40px 24px !important; }
        }
        @media (max-width: 768px) {
          .pisl-exec-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </div>
  );
};

export default Leadership;