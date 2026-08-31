import React from 'react';
import { motion } from 'framer-motion';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const getImageUrl = (imgObj, defaultImg) => {
  if (!imgObj) return defaultImg;
  const url = imgObj.url || imgObj.data?.attributes?.url;
  if (!url) return defaultImg;
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_STRAPI_URL || "http://127.0.0.1:1337"}${url}`;
};

const TeamMemberCard = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -6, boxShadow: '0 20px 35px rgba(40, 41, 111, 0.08)' }}
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="pisl-passport-member-card"
    >
      <div style={{
        width: '100%',
        paddingTop: '133.33%',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#f8fafc',
        position: 'relative',
        marginBottom: '16px'
      }}>
        <img 
          src={getImageUrl(member.image)} 
          alt={member.name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            position: 'absolute',
            top: 0, left: 0,
            transition: 'transform 0.4s ease'
          }} 
          className="pisl-passport-img"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
        <h4 style={{ fontSize: '15px', fontWeight: 800, color: NAVY, margin: '0 0 2px 0', letterSpacing: '-0.3px' }}>
          {member.name}
        </h4>
        <p style={{ fontSize: '12px', color: ORANGE, fontWeight: 700, margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          {member.designation} {member.department && <span style={{ color: '#64748b', fontWeight: 500 }}>• {member.department}</span>}
        </p>
        <p style={{ fontSize: '13px', color: '#475569', fontWeight: 500, lineHeight: '1.45', margin: '0', flex: 1 }}>
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
};

const CoreTeamGrid = ({ title, members }) => {
  return (
    <section style={{
      padding: '100px 24px',
      background: '#ffffff',
      fontFamily: '"Inter", "-apple-system", sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <h2 style={{
          fontSize: '28px', fontWeight: 900, color: NAVY,
          margin: '0 0 48px 0', letterSpacing: '-0.5px'
        }}>
          {title || 'Our Core Team'}
        </h2>

        <div 
          className="pisl-passport-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}
        >
          {(members || []).map((member, index) => (
            <TeamMemberCard key={index} member={member} index={index} />
          ))}
        </div>

      </div>

      <style>{`
        .pisl-passport-member-card:hover .pisl-passport-img {
          transform: scale(1.04);
        }
        .pisl-passport-member-card:hover {
          border-color: rgba(40, 41, 111, 0.12) !important;
        }
        @media (max-width: 1100px) {
          .pisl-passport-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 768px) {
          .pisl-passport-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 440px) {
          .pisl-passport-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CoreTeamGrid;
