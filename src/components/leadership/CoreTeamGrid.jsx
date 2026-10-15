import React from 'react';
import { motion } from 'framer-motion';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const getImageUrl = (imgObj, defaultImg) => {
  if (!imgObj) return defaultImg;
  const url = imgObj.url || imgObj.data?.attributes?.url;
  if (!url) return defaultImg;
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_STRAPI_URL || ""}${url}`;
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
      <div 
        className="pisl-passport-img-box"
        style={{
          width: '100%',
          paddingTop: '133.33%',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#f8fafc',
          position: 'relative',
          marginBottom: '16px'
        }}
      >
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

      <div className="pisl-passport-info" style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
        <h4 className="pisl-passport-name" style={{ fontSize: '15px', fontWeight: 800, color: NAVY, margin: '0 0 2px 0', letterSpacing: '-0.3px' }}>
          {member.name}
        </h4>
        <p className="pisl-passport-designation" style={{ fontSize: '12px', color: ORANGE, fontWeight: 700, margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          {member.designation} {member.department && <span style={{ color: '#64748b', fontWeight: 500 }}>• {member.department}</span>}
        </p>
        <p className="pisl-passport-bio" style={{ fontSize: '13px', color: '#475569', fontWeight: 500, lineHeight: '1.45', margin: '0', flex: 1 }}>
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
};

const CoreTeamGrid = ({ title, members }) => {
  return (
    <section 
      className="pisl-core-team-section"
      style={{
        padding: '100px 24px',
        background: '#ffffff',
        fontFamily: '"Inter", "-apple-system", sans-serif'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <h2 
          className="pisl-core-team-title"
          style={{
            fontSize: '28px', fontWeight: 900, color: NAVY,
            margin: '0 0 48px 0', letterSpacing: '-0.5px'
          }}
        >
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
        @media (hover: hover) and (pointer: fine) {
          .pisl-passport-member-card:hover .pisl-passport-img {
            transform: scale(1.04);
          }
          .pisl-passport-member-card:hover {
            border-color: rgba(40, 41, 111, 0.16) !important;
            box-shadow: 0 12px 28px rgba(40, 41, 111, 0.08) !important;
          }
        }
        @media (max-width: 1100px) {
          .pisl-passport-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 768px) {
          section.pisl-core-team-section {
            padding: 36px 16px 44px 16px !important;
          }
          .pisl-core-team-title {
            font-size: clamp(22px, 6vw, 28px) !important;
            margin-bottom: 20px !important;
            letter-spacing: -0.4px !important;
          }
          .pisl-passport-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
          .pisl-passport-member-card {
            padding: 10px 10px 12px 10px !important;
            border-radius: 14px !important;
            box-shadow: 0 2px 10px rgba(40, 41, 111, 0.04) !important;
          }
          .pisl-passport-img-box {
            padding-top: 130% !important;
            border-radius: 10px !important;
            margin-bottom: 8px !important;
          }
          .pisl-passport-img {
            object-position: center 20% !important;
          }
          .pisl-passport-name {
            font-size: 13.5px !important;
            margin-bottom: 2px !important;
            line-height: 1.3 !important;
          }
          .pisl-passport-designation {
            font-size: 10.5px !important;
            margin-bottom: 6px !important;
            letter-spacing: 0.2px !important;
            line-height: 1.3 !important;
          }
          .pisl-passport-bio {
            font-size: 11.5px !important;
            line-height: 1.45 !important;
          }
        }
        @media (max-width: 360px) {
          section.pisl-core-team-section {
            padding: 28px 10px 36px 10px !important;
          }
          .pisl-passport-grid {
            gap: 8px !important;
          }
          .pisl-passport-member-card {
            padding: 8px 8px 10px 8px !important;
            border-radius: 12px !important;
          }
          .pisl-passport-name {
            font-size: 12px !important;
          }
          .pisl-passport-designation {
            font-size: 9.5px !important;
          }
          .pisl-passport-bio {
            font-size: 10.5px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CoreTeamGrid;
