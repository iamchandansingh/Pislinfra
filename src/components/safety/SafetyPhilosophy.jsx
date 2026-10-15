import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getStrapiMediaUrl } from '../../services/strapi';

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

const SafetyPhilosophy = ({ philosophyItems, title }) => {
  const activeData = philosophyItems && philosophyItems.length > 0 
    ? philosophyItems.map((p, i) => {
        const customImg = getStrapiMediaUrl(p.image);
        return { 
          title: p.title || philosophyData[i]?.title, 
          description: p.description || philosophyData[i]?.description, 
          image: customImg || philosophyData[i]?.image 
        };
      }) 
    : philosophyData;
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="safety-philosophy-section">
      <style>{`
        .safety-philosophy-section {
          padding: 80px 28px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          overflow: hidden;
          font-family: ${FONT_FAMILY};
        }
        .safety-philosophy-inner {
          max-width: 1370px;
          margin: 0 auto;
        }
        .safety-philosophy-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .safety-philosophy-title {
          font-size: clamp(26px, 3.5vw, 36px);
          font-weight: 900;
          color: ${NAVY};
          margin: 0;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        /* Desktop: 2-column outer grid where each item has text + image */
        .safety-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px 40px;
          align-items: center;
        }

        .hse-stat-card {
          display: grid;
          grid-template-columns: 1fr 240px;
          gap: 20px;
          align-items: center;
          height: 140px;
          cursor: default;
        }

        .phi-text-card {
          position: relative;
          padding: 16px 20px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border: 1px solid transparent;
          background: transparent;
          height: 100%;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        .hse-card-hovered .phi-text-card {
          border-color: rgba(10, 42, 102, 0.08);
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
        }

        .phi-accent-bar {
          position: absolute;
          left: -1px;
          top: 24px;
          bottom: 24px;
          width: 3px;
          background: ${ORANGE};
          border-radius: 4px;
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hse-card-hovered .phi-accent-bar {
          transform: scaleY(1);
        }

        .phi-card-title {
          font-size: 18px;
          font-weight: 800;
          color: ${NAVY};
          margin: 0 0 4px 0;
          letter-spacing: -0.3px;
          transition: color 0.3s ease;
        }

        .hse-card-hovered .phi-card-title {
          color: ${ORANGE};
        }

        .phi-card-desc {
          font-size: 13.5px;
          line-height: 1.6;
          color: #64748b;
          margin: 0;
        }

        .phi-image-card {
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(10, 42, 102, 0.08);
          position: relative;
          background-color: #ffffff;
          height: 100%;
          transition: box-shadow 0.4s ease, transform 0.4s ease;
        }

        .hse-card-hovered .phi-image-card {
          box-shadow: 0 20px 40px rgba(10, 42, 102, 0.15);
          transform: translateY(-2px);
        }

        .phi-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .hse-card-hovered .phi-image {
          transform: scale(1.05);
        }

        .phi-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(10, 42, 102, 0.7) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .hse-card-hovered .phi-image-overlay {
          opacity: 1;
        }

        /* Tablet Responsive Grid */
        @media (max-width: 1200px) and (min-width: 769px) {
          .safety-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .hse-stat-card {
            grid-template-columns: 1fr 200px;
            height: 140px;
          }
        }

        /* Mobile Responsive Grid: Unified Single Card */
        @media (max-width: 768px) {
          .safety-philosophy-section {
            padding: 36px 16px 44px 16px !important;
          }
          .safety-philosophy-header {
            margin-bottom: 22px !important;
          }
          .safety-philosophy-title {
            font-size: clamp(21px, 5.2vw, 26px) !important;
            line-height: 1.25 !important;
          }
          .safety-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .hse-stat-card {
            display: flex !important;
            flex-direction: column !important;
            height: auto !important;
            background: #ffffff !important;
            border: 1px solid #EEF2F7 !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            box-shadow: 0 4px 14px rgba(10, 42, 102, 0.05) !important;
            gap: 0 !important;
          }
          .phi-image-card {
            order: 1 !important;
            width: 100% !important;
            height: 175px !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          .phi-image-overlay {
            opacity: 0.35 !important;
          }
          .phi-text-card {
            order: 2 !important;
            padding: 16px 16px 18px 20px !important;
            background: #ffffff !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          .phi-accent-bar {
            transform: scaleY(1) !important;
            left: 0 !important;
            top: 16px !important;
            bottom: 16px !important;
            width: 3.5px !important;
          }
          .phi-card-title {
            font-size: 16.5px !important;
            color: ${NAVY} !important;
            margin-bottom: 6px !important;
            line-height: 1.3 !important;
          }
          .phi-card-desc {
            font-size: 12.5px !important;
            line-height: 1.55 !important;
            color: #64748b !important;
          }
        }

        @media (max-width: 360px) {
          .safety-philosophy-section {
            padding: 32px 12px 38px 12px !important;
          }
          .phi-image-card {
            height: 155px !important;
          }
          .phi-text-card {
            padding: 14px 14px 16px 16px !important;
          }
          .phi-card-title {
            font-size: 15px !important;
          }
          .phi-card-desc {
            font-size: 12px !important;
          }
        }
      `}</style>

      <div className="safety-philosophy-inner">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="safety-philosophy-header"
        >
          <h2 className="safety-philosophy-title">
            {title || "Latest HSE Statistics"}
          </h2>
        </motion.div>

        {/* Responsive Grid */}
        <div className="safety-grid">
          {activeData.map((data, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`hse-stat-card ${isHovered ? 'hse-card-hovered' : ''}`}
              >
                {/* Text Card (Desktop Left / Mobile Bottom) */}
                <div className="phi-text-card">
                  <div className="phi-accent-bar" />
                  <h3 className="phi-card-title">{data.title}</h3>
                  <p className="phi-card-desc">{data.description}</p>
                </div>

                {/* Image Card (Desktop Right / Mobile Top) */}
                <div className="phi-image-card">
                  <img
                    src={data.image}
                    alt={data.title}
                    loading="lazy"
                    decoding="async"
                    className="phi-image"
                  />
                  <div className="phi-image-overlay" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SafetyPhilosophy;