import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaFilePdf, FaFileArchive, FaShieldAlt, FaHeadset, FaCheckCircle } from 'react-icons/fa';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';
const FONT = 'Inter, sans-serif';

const resourcesList = [
  { 
    id: 1, 
    title: 'Site Safety Manual', 
    desc: 'Comprehensive manual detailing all site-specific safety protocols.', 
    size: '4.2 MB', 
    icon: FaFilePdf
  },
  { 
    id: 2, 
    title: 'PPE Guidelines 2025', 
    desc: 'Updated guidelines on mandatory use of Protective Equipment.', 
    size: '1.8 MB', 
    icon: FaFilePdf
  },
  { 
    id: 3, 
    title: 'Emergency Response Plan', 
    desc: 'Step-by-step action plans for medical and structural incidents.', 
    size: '3.5 MB', 
    icon: FaFilePdf
  },
  { 
    id: 4, 
    title: 'Hazard Identification', 
    desc: 'Training material for reporting and mitigating potential hazards.', 
    size: '2.1 MB', 
    icon: FaFilePdf
  },
  { 
    id: 5, 
    title: 'Work Permit Procedures', 
    desc: 'Operating procedures for managing Permit To Work (PTW).', 
    size: '1.5 MB', 
    icon: FaFilePdf
  },
  { 
    id: 6, 
    title: 'Toolbox Talk Resources', 
    desc: 'A collection of weekly toolbox talk topics for site supervisors.', 
    size: '5.0 MB', 
    icon: FaFileArchive
  },
];

const supportItems = [
  { icon: FaShieldAlt, title: '24/7 Monitoring' },
  { icon: FaHeadset, title: 'Rapid Response' },
  { icon: FaCheckCircle, title: '100% Compliant' },
];

const SafetyResources = ({ resources, title, subtitle, desc }) => {
  const activeResources = resources && resources.length > 0 ? resources.map((r, i) => ({ id: r.id || i, title: r.title, desc: r.description || r.desc || resourcesList[i]?.desc, size: resourcesList[i]?.size || "0 MB", icon: resourcesList[i]?.icon })) : resourcesList;
  return (
    <section style={{ 
      padding: '60px 24px 80px',
      backgroundColor: '#f8fafc',
      fontFamily: FONT
    }}>
      <div style={{ maxWidth: '1370px', margin: '0 auto' }}> {/* Matches IndustryRecognition width */}

        {/* The Massive Split-Card Container (Straight Edges) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="split-card-container"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr', 
            borderRadius: '0px', // No curve
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0', // Clean straight border instead of full screen bleed
            boxShadow: '0 10px 40px rgba(10,42,102,0.05)'
          }}
        >
          
          {/* LEFT COLUMN: Visual & Support */}
          <div 
            className="left-column"
            style={{ 
              position: 'relative', 
              width: '100%',
              height: '100%', // Inherits height from grid
            }}
          >
            {/* Background Image */}
            <img 
              src="/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(4).png" 
              alt="Safety Professional" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
            />
            {/* Dark Gradient Overlay */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to bottom, rgba(10,42,102,0.1) 0%, rgba(10,42,102,0.95) 100%)'
            }} />

            {/* Content overlay on Image */}
            <div className="left-column-content">
              <div>
                <h3 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }} className="left-column-title">
                  Safety is our<br />Highest Priority
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, maxWidth: '90%' }}>
                  Access our official safety manuals, guidelines, and toolkits used across all PISL project sites.
                </p>
              </div>

              {/* Horizontal Support Strip (Left to Right) */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(10,42,102,0.4)', // Sleek dark navy glass
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '16px 24px',
                marginTop: '8px',
                gap: '12px'
              }} className="support-strip">
                {supportItems.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <item.icon style={{ color: ORANGE, fontSize: '18px' }} />
                    <span style={{ 
                      color: '#ffffff', 
                      fontSize: '12px', 
                      fontWeight: 700, 
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive List */}
          <div 
            className="right-column"
            style={{ 
              padding: '32px 5%', // Tighter padding, % for large screens
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            {/* Header Text */}
            <div style={{ marginBottom: '20px' }}> 
              <h2 style={{ 
                fontSize: 'clamp(24px, 3.5vw, 32px)', 
                fontWeight: 800, 
                color: NAVY, 
                margin: '0 0 8px',
                letterSpacing: '-1px'
              }}>
                Safety <span style={{ color: NAVY }}>Resources</span>
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Download essential workplace documents and operational guidelines instantly.
              </p>
            </div>

            {/* Highly Styled List View (Descriptions Removed for minimal height) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}> 
              {resourcesList.map((resource, i) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="resource-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 16px', // Minimal padding
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px', 
                    border: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    gap: '12px' 
                  }}
                >
                  {/* Left Icon */}
                  <div style={{
                    width: '36px', height: '36px', // Smaller icon box
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    flexShrink: 0,
                    transition: 'all 0.3s ease'
                  }} className="row-icon-box">
                    <resource.icon style={{ fontSize: '16px', color: '#94a3b8', transition: 'color 0.3s ease' }} className="row-icon" />
                  </div>

                  {/* Text Content (Title Only) */}
                  <div style={{ flex: 1, minWidth: 0 }}> 
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: '14px', 
                      fontWeight: 800, 
                      color: NAVY,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {resource.title}
                    </h4>
                  </div>

                  {/* Size & Action */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px' 
                  }} className="row-action-area">
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', transition: 'color 0.3s' }} className="row-size">
                      {resource.size}
                    </span>
                    <div style={{
                      width: '30px', height: '30px', // Minimal button
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.3s ease'
                    }} className="row-download-btn">
                      <FaDownload style={{ fontSize: '11px', color: NAVY, transition: 'color 0.3s ease' }} className="row-download-icon" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>

      <style>{`
        /* Card Row Hover Effects - Ultra Premium */
        .resource-row:hover {
          background-color: #ffffff !important;
          border-color: ${ORANGE} !important;
          box-shadow: 0 12px 30px rgba(255,135,85,0.12) !important;
          transform: translateY(-2px);
        }
        .resource-row:hover .row-icon-box {
          background-color: ${ORANGE} !important;
          transform: scale(1.05);
        }
        .resource-row:hover .row-icon {
          color: #ffffff !important;
        }
        .resource-row:hover .row-size {
          color: ${ORANGE} !important;
        }
        .resource-row:hover .row-download-btn {
          background-color: ${NAVY} !important;
          box-shadow: 0 6px 16px rgba(10,42,102,0.2) !important;
          transform: translateY(-2px);
        }
        .resource-row:hover .row-download-icon {
          color: #ffffff !important;
        }

        /* Default Desktop */
        .left-column-content {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 40px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Responsiveness */
        @media (max-width: 1024px) {
          .split-card-container {
            grid-template-columns: 1fr !important;
          }
          .left-column {
            height: auto !important;
            min-height: 400px !important;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }
          .left-column-content {
            position: relative;
            bottom: auto;
            left: auto;
            padding: 32px 24px !important;
            margin-top: 100px;
          }
          .right-column {
            padding: 32px 24px !important;
          }
          .support-strip {
            flex-wrap: wrap;
            justify-content: center !important;
          }
        }
        
        @media (max-width: 640px) {
          .left-column-content {
            padding: 24px !important;
            gap: 16px !important;
          }
          .left-column-title {
            font-size: 24px !important;
          }
          .support-strip {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 16px !important;
            gap: 12px !important;
          }
          .support-strip > div {
            width: 100%;
          }
          /* Keep rows horizontal on mobile but adjust gaps */
          .resource-row {
            padding: 10px 12px !important;
            gap: 10px !important;
          }
          .row-action-area {
            gap: 8px !important;
          }
          .row-size {
            display: none; /* Hide size on tiny screens to save space */
          }
        }
      `}</style>
    </section>
  );
};

export default SafetyResources;