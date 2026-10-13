import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaChartLine, 
  FaUsersCog, 
  FaFilePdf, 
  FaFilePowerpoint, 
  FaEye, 
  FaDownload 
} from 'react-icons/fa';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';
const FONT = 'Inter, sans-serif';

const defaultResourceCards = [
  {
    id: 'company-profile',
    title: 'Company Profile',
    coverTitle: 'COMPANY PROFILE',
    coverSubtitle: 'Building Infrastructure for a Better Tomorrow',
    desc: 'Overview of our company, infrastructure capabilities, key projects and achievements.',
    type: 'PPT / PPTX',
    typeIcon: FaFilePowerpoint,
    typeBg: 'rgba(255, 135, 85, 0.1)',
    typeColor: ORANGE,
    typeBorder: 'rgba(255, 135, 85, 0.25)',
    bgImage: '/images/blogs/optimized_1787755078619_572_Green-Industrial-Park_png.webp',
    accentColor: NAVY,
    viewUrl: '/reports/Pragati-Infra-Solutions-2.pdf',
    downloadUrl: '/reports/Pragati-Infra-Solutions-2.pdf',
    viewLabel: 'View Presentation',
    downloadLabel: 'Download PPT',
  },
  {
    id: 'hse-policy',
    title: 'HSE Policy',
    coverTitle: 'HSE POLICY',
    coverSubtitle: 'Safe People • Safe Projects • Stronger Tomorrow',
    desc: 'Official Health, Safety & Environment policies, operational guidelines and zero-harm standards.',
    type: 'PDF',
    typeIcon: FaFilePdf,
    typeBg: 'rgba(239, 68, 68, 0.08)',
    typeColor: '#ef4444',
    typeBorder: 'rgba(239, 68, 68, 0.2)',
    bgImage: '/images/EHS/Site-Safety-Inspection.png',
    accentColor: ORANGE,
    viewUrl: '/reports/Annual-Reports-2023-2024.pdf',
    downloadUrl: '/reports/Annual-Reports-2023-2024.pdf',
    viewLabel: 'View PDF',
    downloadLabel: 'Download PDF',
  },
];

const DocumentThumbnail = ({ title, subtitle, bgImage, accentColor }) => {
  return (
    <div style={{
      width: '100%',
      height: '155px',
      borderRadius: '10px',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#f1f5f9',
      boxShadow: '0 2px 8px rgba(10,42,102,0.06)',
      display: 'flex',
    }}>
      {/* Background Project Photo */}
      <img
        src={bgImage}
        alt={title}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />

      {/* Angled Accent Trim Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '67%',
        height: '100%',
        backgroundColor: accentColor || ORANGE,
        clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0 100%)',
        zIndex: 1,
      }} />

      {/* White Slanted Document Card Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '65%',
        height: '100%',
        backgroundColor: '#ffffff',
        clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0 100%)',
        zIndex: 2,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
      }}>
        {/* PISL Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img 
            src="/logo.png" 
            alt="PISL" 
            style={{ height: '22px', width: 'auto', objectFit: 'contain' }} 
          />
        </div>

        {/* Document Header Text */}
        <div style={{ paddingBottom: '2px' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '900',
            color: NAVY,
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
            lineHeight: 1.2,
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '8.5px',
            fontWeight: '600',
            color: '#64748b',
            lineHeight: 1.25,
            marginTop: '3px',
          }}>
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

const SafetyResources = ({ resources, title, subtitle, desc }) => {
  const resourceCards = resources && resources.length > 0 
    ? resources.slice(0, 2).map((r, i) => ({
        ...defaultResourceCards[i % defaultResourceCards.length],
        title: r.title || defaultResourceCards[i % defaultResourceCards.length].title,
        coverTitle: r.title?.toUpperCase() || defaultResourceCards[i % defaultResourceCards.length].coverTitle,
        desc: r.description || r.desc || defaultResourceCards[i % defaultResourceCards.length].desc,
        viewUrl: r.file?.url ? (r.file.url.startsWith('http') ? r.file.url : `${import.meta.env.VITE_STRAPI_URL || ""}${r.file.url}`) : defaultResourceCards[i % defaultResourceCards.length].viewUrl,
        downloadUrl: r.file?.url ? (r.file.url.startsWith('http') ? r.file.url : `${import.meta.env.VITE_STRAPI_URL || ""}${r.file.url}`) : defaultResourceCards[i % defaultResourceCards.length].downloadUrl,
      }))
    : defaultResourceCards;

  return (
    <section style={{ 
      padding: '70px 20px 90px',
      backgroundColor: '#f8fafc',
      fontFamily: FONT
    }}>
      <div style={{ maxWidth: '1370px', margin: '0 auto' }}>
        
        {/* Split Section Layout */}
        <div className="safety-resources-split">
          
          {/* LEFT BANNER: Safety is Our Highest Priority */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="sr-left-banner"
          >
            {/* Background Construction Image */}
            <img 
              src="/images/EHS/Heroimages/1.png" 
              alt="PISL Safety Infrastructure" 
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />

            {/* Gradient Overlay in PISL Brand Navy */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to right, rgba(10,42,102, 0.95) 0%, rgba(10,42,102, 0.75) 60%, rgba(10,42,102, 0.35) 100%)',
              zIndex: 2,
            }} />

            {/* Content Top */}
            <div style={{ position: 'relative', zIndex: 3 }}>
              {/* Tag with Orange Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ 
                  width: '28px', 
                  height: '3px', 
                  backgroundColor: ORANGE, 
                  borderRadius: '2px', 
                  display: 'inline-block' 
                }} />
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: '800', 
                  color: '#ffffff', 
                  letterSpacing: '1.8px', 
                  textTransform: 'uppercase' 
                }}>
                  SAFETY & RESOURCES
                </span>
              </div>

              {/* Headline */}
              <h2 style={{
                fontSize: 'clamp(28px, 3.2vw, 40px)',
                fontWeight: '800',
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
                margin: '0 0 14px',
              }}>
                Safety is Our{' '}
                <span style={{ color: ORANGE }}>Highest</span>{' '}
                Priority
              </h2>

              {/* Subtext */}
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.86)',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '460px',
              }}>
                {desc || "Access our official safety guidelines, company profile, and important resources for all project sites."}
              </p>
            </div>

            {/* Content Bottom: 3 Circular Badges */}
            <div style={{ position: 'relative', zIndex: 3 }}>
              <div className="sr-badges-row">
                {/* Badge 1 */}
                <div className="sr-badge-item">
                  <div className="sr-badge-circle">
                    <FaShieldAlt style={{ fontSize: '15px' }} />
                  </div>
                  <div className="sr-badge-text">
                    Safe<br />Workplace
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="sr-badge-item">
                  <div className="sr-badge-circle">
                    <FaChartLine style={{ fontSize: '15px' }} />
                  </div>
                  <div className="sr-badge-text">
                    Best<br />Practices
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="sr-badge-item">
                  <div className="sr-badge-circle">
                    <FaUsersCog style={{ fontSize: '15px' }} />
                  </div>
                  <div className="sr-badge-text">
                    Sustainable<br />Operations
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Key Resources Header + 2 Resource Cards */}
          <div className="sr-right-column">
            
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: '24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ 
                  width: '28px', 
                  height: '3px', 
                  backgroundColor: ORANGE, 
                  borderRadius: '2px', 
                  display: 'inline-block' 
                }} />
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: '800', 
                  color: '#64748b', 
                  letterSpacing: '1.8px', 
                  textTransform: 'uppercase' 
                }}>
                  DOWNLOAD
                </span>
              </div>
              
              <h3 style={{
                fontSize: 'clamp(26px, 3vw, 34px)',
                fontWeight: '800',
                color: NAVY,
                letterSpacing: '-0.5px',
                margin: '0 0 6px',
              }}>
                {title ? title : <>Key <span style={{ color: ORANGE }}>Resources</span></>}
              </h3>

              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0,
                lineHeight: 1.5,
              }}>
                {subtitle || "Download official documents and company information."}
              </p>
            </motion.div>

            {/* 2 PDF Cards Grid */}
            <div className="sr-cards-grid">
              {resourceCards.map((card, idx) => (
                <motion.div
                  key={card.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="sr-card"
                >
                  <div>
                    {/* Top Document Cover */}
                    <DocumentThumbnail 
                      title={card.coverTitle}
                      subtitle={card.coverSubtitle}
                      bgImage={card.bgImage}
                      accentColor={card.accentColor}
                    />

                    {/* Format Pill Badge */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: card.typeBg,
                      color: card.typeColor,
                      border: `1px solid ${card.typeBorder}`,
                      fontSize: '10px',
                      fontWeight: '800',
                      letterSpacing: '0.4px',
                      marginTop: '14px',
                      marginBottom: '6px',
                    }}>
                      <card.typeIcon style={{ fontSize: '11px' }} />
                      <span>{card.type}</span>
                    </div>

                    {/* Title */}
                    <h4 style={{
                      fontSize: '17px',
                      fontWeight: '800',
                      color: NAVY,
                      margin: '0 0 4px',
                      lineHeight: 1.3,
                    }}>
                      {card.title}
                    </h4>

                    {/* Description */}
                    <p style={{
                      fontSize: '13px',
                      color: '#64748b',
                      lineHeight: 1.5,
                      margin: '0 0 18px',
                    }}>
                      {card.desc}
                    </p>
                  </div>

                  {/* Actions: View & Download Buttons */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginTop: 'auto',
                    paddingTop: '10px',
                    borderTop: '1px solid #f1f5f9',
                  }}>
                    <a 
                      href={card.viewUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="sr-btn sr-btn-view"
                    >
                      <FaEye style={{ fontSize: '13px' }} />
                      <span>{card.viewLabel}</span>
                    </a>

                    <a 
                      href={card.downloadUrl} 
                      download 
                      className="sr-btn sr-btn-download"
                    >
                      <FaDownload style={{ fontSize: '11px' }} />
                      <span>{card.downloadLabel}</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

        </div>

      </div>

      <style>{`
        .safety-resources-split {
          display: grid;
          grid-template-columns: minmax(360px, 430px) 1fr;
          gap: 32px;
          align-items: stretch;
        }

        .sr-left-banner {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          padding: 44px 34px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 480px;
          box-shadow: 0 12px 36px rgba(10, 42, 102, 0.12);
        }

        .sr-badges-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          padding-top: 28px;
          margin-top: 28px;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
        }

        .sr-badge-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .sr-badge-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${ORANGE};
          transition: all 0.3s ease;
        }

        .sr-badge-item:hover .sr-badge-circle {
          border-color: ${ORANGE};
          background: rgba(255, 135, 85, 0.2);
          transform: scale(1.08);
        }

        .sr-badge-text {
          font-size: 11.5px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.3;
        }

        .sr-right-column {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .sr-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .sr-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 6px 20px rgba(10, 42, 102, 0.04);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sr-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(10, 42, 102, 0.1);
          border-color: rgba(255, 135, 85, 0.4);
        }

        .sr-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 40px;
          padding: 0 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }

        .sr-btn-view {
          background: #ffffff;
          border: 1.5px solid ${NAVY};
          color: ${NAVY};
        }

        .sr-btn-view:hover {
          background: ${NAVY};
          color: #ffffff;
        }

        .sr-btn-download {
          background: ${NAVY};
          border: 1.5px solid ${NAVY};
          color: #ffffff;
        }

        .sr-btn-download:hover {
          background: ${ORANGE};
          border-color: ${ORANGE};
          color: #ffffff;
        }

        @media (max-width: 1100px) {
          .safety-resources-split {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }

        @media (max-width: 680px) {
          .sr-left-banner {
            padding: 30px 20px;
            min-height: auto;
          }
          .sr-badges-row {
            padding-top: 20px;
            margin-top: 20px;
            gap: 10px;
          }
          .sr-badge-circle {
            width: 36px;
            height: 36px;
          }
          .sr-badge-text {
            font-size: 10.5px;
          }
          .sr-cards-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
};

export default SafetyResources;