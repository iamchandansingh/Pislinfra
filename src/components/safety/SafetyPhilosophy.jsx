import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';
const FONT_FAMILY = 'Inter, sans-serif';

const philosophyData = [
  {
    title: 'CCTV Camera',
    description:
      'Strong safety awareness helps teams identify risks early, stay alert on-site, and protect both themselves and others through responsible actions.',
    image: '/images/awards/Camera.png'
  },
  {
    title: 'Fall Protection',
    description:
      'Encouraging communication, teamwork, and regular engagement helps strengthen confidence, improve decision-making, and create a focused workplace.',
    image: '/images/awards/protection.png'
  },
  {
    title: 'Edge Professional',
    description:
      'Promoting disciplined work practices and responsible decision-making helps reduce risks, prevent incidents, and build long-term operational excellence.',
    image: '/images/awards/2.png',
  },
  {
    title: 'IGBC Compliance',
    description:
      'Safety is a collective responsibility where every team member contributes through accountability, coordination, and commitment towards maintaining safe environments.',
    image: '/images/awards/Compliance.png'
  },
  {
    title: 'Third Party Training',
    description:
      'Rigorous third-party training ensures our workforce is equipped with the latest safety techniques, certifications, and hazard prevention strategies.',
    image: '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(5).png',
  },
  {
    title: 'Motivational HSE Training',
    description:
      'Continuous motivational training drives a proactive safety culture, keeping safety at the forefront of every operational decision on the ground.',
    image: '/images/awards/3.png'
  },
];

const getUrl = (img) => {
  if (!img) return null;
  const url = typeof img === 'string' ? img : (img.url || img.data?.attributes?.url);
  if (!url) return null;
  return url.startsWith('http') ? url : `${import.meta.env.VITE_STRAPI_URL || "http://127.0.0.1:1337"}${url}`;
};

const SafetyPhilosophy = ({ philosophyItems, title }) => {
  const activeData = philosophyItems && philosophyItems.length > 0 
    ? philosophyItems.map((p, i) => ({ 
        title: p.title, 
        description: p.description, 
        image: getUrl(p.image) || philosophyData[i]?.image 
      })) 
    : philosophyData;
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section
      style={{
        padding: '100px 28px',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        overflow: 'hidden',
        fontFamily: FONT_FAMILY,
      }}
    >
      <div style={{ maxWidth: 1370, margin: '0 auto' }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h2
            style={{
              fontSize: 'clamp(28px, 3.5vw, 36px)',
              fontWeight: 900,
              color: NAVY,
              margin: 0,
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}
          >{title || "Latest HSE Statistics"}</h2>
        </motion.div>

        {/* Responsive Grid */}
        <div className="safety-grid">
          {activeData.map((data, index) => (
            <React.Fragment key={index}>
              {/* Text Card */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (Math.floor(index / 2)) * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="phi-text-card phi-card-wrapper"
                style={{
                  position: 'relative',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: `1px solid ${hoveredIndex === index ? 'rgba(10,42,102,0.08)' : 'transparent'}`,
                  background: hoveredIndex === index ? '#ffffff' : 'transparent',
                  boxShadow: hoveredIndex === index ? '0 10px 30px rgba(0,0,0,0.03)' : 'none',
                  cursor: 'default',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Active left border line */}
                <div style={{
                  position: 'absolute', left: '-1px', top: '24px', bottom: '24px',
                  width: '3px', background: ORANGE, borderRadius: '4px',
                  transform: hoveredIndex === index ? 'scaleY(1)' : 'scaleY(0)', 
                  transformOrigin: 'top',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}/>
                
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: hoveredIndex === index ? ORANGE : NAVY,
                  margin: '0 0 4px 0',
                  letterSpacing: '-0.3px',
                  transition: 'color 0.3s ease'
                }}>
                  {data.title}
                </h3>
                <p style={{
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                  color: '#64748b',
                  margin: 0,
                }}>
                  {data.description}
                </p>
              </motion.div>

              {/* Image Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (Math.floor(index / 2)) * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="phi-image-card phi-card-wrapper"
                style={{
                  overflow: 'hidden',
                  borderRadius: '16px',
                  boxShadow: hoveredIndex === index 
                    ? '0 20px 40px rgba(10,42,102,0.15)' 
                    : '0 12px 30px rgba(10,42,102,0.08)',
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  transition: 'box-shadow 0.4s ease'
                }}
              >
                <img
                  src={data.image}
                  alt={data.title}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transform: hoveredIndex === index ? 'scale(1.12)' : 'scale(1)',
                    transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(to top, rgba(10,42,102,0.7) 0%, transparent 60%)',
                  opacity: hoveredIndex === index ? 1 : 0, 
                  transition: 'opacity 0.4s ease'
                }}/>
              </motion.div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        /* Desktop Grid */
        .safety-grid {
          display: grid;
          grid-template-columns: 1fr 240px 1fr 240px;
          gap: 24px 40px; /* row-gap column-gap */
          align-items: center;
        }
        
        .phi-card-wrapper {
          height: 140px;
        }

        /* Tablet Responsive Grid */
        @media (max-width: 1200px) {
          .safety-grid {
            grid-template-columns: 1fr 200px;
            gap: 24px;
          }
        }
        
        /* Mobile Responsive Grid */
        @media (max-width: 768px) {
          .safety-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-top: 20px;
          }
          .phi-card-wrapper {
            height: auto;
          }
          .phi-text-card {
            padding: 24px 20px !important;
          }
          .phi-image-card {
            height: 220px !important;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </section>
  );
};

export default SafetyPhilosophy;