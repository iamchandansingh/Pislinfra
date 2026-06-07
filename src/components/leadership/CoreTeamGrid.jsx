import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaEnvelope } from 'react-icons/fa';

// Import all team member images
import pankajSoodImg from '../../assets/images/leadership/Core Team/Pankaj-Sood.png';
import ramdhanYadavImg from '../../assets/images/leadership/Core Team/Ramdhan-Yadav.png';
import rajeshYadavImg from '../../assets/images/leadership/Core Team/Rajesh-Yada.png';
import brigadierSurinderImg from '../../assets/images/leadership/Core Team/Brigadier-Surinder-Singh.png';
import arnabBoseImg from '../../assets/images/leadership/Core Team/Arnab-Bose.png';
import jitenderSinghImg from '../../assets/images/leadership/Core Team/JITENDER-SINGH.png';
import sumitGuptaImg from '../../assets/images/leadership/Core Team/Sumit-Gupta.png';
import opTiwariImg from '../../assets/images/leadership/Core Team/OP-Tiwari.png';
import manojKumarImg from '../../assets/images/leadership/Core Team/Manoj-Kumar.png';
import princeAroraImg from '../../assets/images/leadership/Core Team/Prince-Arora.png';
import kartikDaraImg from '../../assets/images/leadership/Core Team/Kartik-Dara.png';
import ravinderTomarImg from '../../assets/images/leadership/Core Team/Ravinder-Toma.png';
import amitDubeyImg from '../../assets/images/leadership/Core Team/Amit-Dubey.png';
import mohsinKhanImg from '../../assets/images/leadership/Core Team/Mohsin-Khan.png';
import soniaAhujaImg from '../../assets/images/leadership/Core Team/Sonia-Ahuja.png';
import gurpreetSinghImg from '../../assets/images/leadership/Core Team/Gurpreet-Singh.png';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const teamMembers = [
  { id: 1, name: 'PANKAJ SOOD', role: 'Chief Financial Officer', dept: 'Finance', desc: 'Driving strategic financial planning and enterprise growth initiatives.', img: pankajSoodImg },
  { id: 2, name: 'RAMDHAN YADAV', role: 'Director Finance', dept: 'Finance', desc: 'Managing corporate finance operations and compliance frameworks.', img: ramdhanYadavImg },
  { id: 3, name: 'RAJESH YADAV', role: 'Chief Development Officer', dept: 'Development', desc: 'Leading large-scale infrastructure development and execution strategies.', img: rajeshYadavImg },
  { id: 4, name: 'BRIG. SURINDER YADAV', role: 'Chief Administrative Officer', dept: 'Administration', desc: 'Overseeing administrative operations and organizational governance.', img: brigadierSurinderImg },
  { id: 5, name: 'ARNAB BOSE', role: 'Sr Project Director', dept: 'Projects', desc: 'Delivering high-value infrastructure projects with operational excellence.', img: arnabBoseImg },
  { id: 6, name: 'JITENDER SINGH', role: 'Sr Project Director', dept: 'Projects', desc: 'Supervising multi-site project execution and engineering coordination.', img: jitenderSinghImg },
  { id: 7, name: 'SUMIT GUPTA', role: 'Project Director', dept: 'Projects', desc: 'Managing end-to-end project planning and construction workflows.', img: sumitGuptaImg },
  { id: 8, name: 'OP TIWARI', role: 'DGM Projects', dept: 'Projects', desc: 'Streamlining project delivery and execution management systems.', img: opTiwariImg },
  { id: 9, name: 'MANOJ KUMAR', role: 'Vice President (Tendering)', dept: 'Tendering', desc: 'Leading tendering operations and contract acquisition strategies.', img: manojKumarImg },
  { id: 10, name: 'PRINCE ARORA', role: 'Manager Tendering – Civil', dept: 'Tendering', desc: 'Handling civil tender management and bid optimization processes.', img: princeAroraImg },
  { id: 11, name: 'KARTIK DARA', role: 'Manager Tendering – Civil', dept: 'Tendering', desc: 'Coordinating civil estimation and tender documentation workflows.', img: kartikDaraImg },
  { id: 12, name: 'RAVINDRA TOMAR', role: 'Manager Tendering – MEP', dept: 'Tendering', desc: 'Managing MEP tendering and technical commercial evaluations.', img: ravinderTomarImg },
  { id: 13, name: 'AMIT DUBEY', role: 'EHS Lead', dept: 'Safety & EHS', desc: 'Ensuring workplace safety, EHS compliance, and risk management.', img: amitDubeyImg },
  { id: 14, name: 'MOHSIN KHAN', role: 'AGM Procurement', dept: 'Procurement', desc: 'Managing procurement operations and strategic vendor coordination.', img: mohsinKhanImg },
  { id: 15, name: 'SONIA AHUJA', role: 'Sr. Manager Design', dept: 'Design', desc: 'Developing smart architectural and engineering design solutions.', img: soniaAhujaImg },
  { id: 16, name: 'GURPREET SINGH', role: 'Manager Design', dept: 'Design', desc: 'Creating innovative structural and design planning frameworks.', img: gurpreetSinghImg }
];

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
          src={member.img} 
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
          {member.role} • <span style={{ color: '#64748b', fontWeight: 500 }}>{member.dept}</span>
        </p>
        <p style={{ fontSize: '13px', color: '#475569', fontWeight: 500, lineHeight: '1.45', margin: '0 0 16px 0', flex: 1 }}>
          {member.desc}
        </p>
        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '12px', width: '100%' }}>
          <a href="#linkedin" className="pisl-meta-anchor" style={{ color: '#94a3b8', display: 'flex', transition: 'color 0.2s' }}>
            <FaLinkedinIn style={{ fontSize: '13px' }} />
          </a>
          <a href="#email" className="pisl-meta-anchor" style={{ color: '#94a3b8', display: 'flex', transition: 'color 0.2s' }}>
            <FaEnvelope style={{ fontSize: '13px' }} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const CoreTeamGrid = () => {
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
          Our <span style={{ color: ORANGE }}>Core Team</span>
        </h2>

        <div 
          className="pisl-passport-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}
        >
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
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
        .pisl-meta-anchor:hover {
          color: ${ORANGE} !important;
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