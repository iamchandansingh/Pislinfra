import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUrl';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';

const fallbackImages = [
  '/images/EHS/Heroimages/2.png',
];

const renderHseTitle = (title) => {
  if (!title) {
    return <>Health, Safety & <span style={{ color: ORANGE }}>Environment</span></>;
  }
  if (typeof title === 'string' && title.includes('<')) {
    return <span dangerouslySetInnerHTML={{ __html: title }} />;
  }
  const marker = "environment";
  const lower = String(title).toLowerCase();
  if (lower.includes(marker)) {
    const idx = lower.indexOf(marker);
    const before = title.substring(0, idx);
    const matched = title.substring(idx, idx + marker.length);
    const after = title.substring(idx + marker.length);
    return <>{before}<span style={{ color: ORANGE }}>{matched}</span>{after}</>;
  }
  const words = String(title).trim().split(' ');
  if (words.length > 1) {
    const first = words.slice(0, -1).join(' ');
    const last = words.slice(-1).join(' ');
    return <>{first} <span style={{ color: ORANGE }}>{last}</span></>;
  }
  return title;
};

const HSESection = ({ data }) => {
  const navigate = useNavigate();
  const [currentImg, setCurrentImg] = useState(0);

  const images = data?.hseImage?.url 
    ? [getImageUrl(data.hseImage.url)] 
    : fallbackImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section 
      className="pisl-hse-section"
      style={{ 
        padding: '40px 24px', 
        backgroundColor: '#f8fafc', 
        fontFamily: '"Inter", "-apple-system", sans-serif',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pisl-hse-header"
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <h2 
            className="pisl-hse-title"
            style={{
              fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: NAVY,
              margin: '0 0 6px', letterSpacing: '-1px'
            }}
          >
            {renderHseTitle(data?.hseTitle)}
          </h2>
          <p 
            className="pisl-hse-desc"
            style={{ fontSize: 14, color: '#64748b', maxWidth: 550, margin: '0 auto', lineHeight: 1.6 }}
          >
            {data?.hseDesc || 'Providing a safe workplace to our workers & protection of the environment is our topmost priority.'}
          </p>
        </motion.div>

        {/* Split Layout */}
        <div className="hse-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center'
        }}>

          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hse-img-box"
            style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(10,42,102,0.08)', height: 380, border: '3px solid #ff8755' }}
          >
            <img
              src={images[0]}
              alt="HSE"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="hse-content-box" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Quote */}
              <div 
                className="hse-quote-box"
                style={{
                  background: NAVY, borderRadius: '12px', padding: '24px 28px',
                  color: '#fff', position: 'relative', overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `${ORANGE}15`, pointerEvents: 'none' }} />
                <h3 
                  className="hse-quote-title"
                  style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px', position: 'relative' }}
                >
                  "{data?.hseQuote || 'Zero Harm Is Possible'}"
                </h3>
                <p 
                  className="hse-quote-desc"
                  style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6, position: 'relative' }}
                >
                  {data?.hseQuoteDesc || 'As an emerging leader in construction, we prohibit all injuries and illnesses arising from work.'}
                </p>
              </div>

              {/* Policy Points */}
              <div className="hse-policy-list" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { title: data?.hsePillar1Title || 'Occupational Health & Safety', desc: data?.hsePillar1Desc || 'Personal commitment to safe workplace, healthy environment & culture.' },
                  { title: data?.hsePillar2Title || 'Environmental Protection', desc: data?.hsePillar2Desc || 'Minimizing ecological footprint through sustainable practices.' },
                  { title: data?.hsePillar3Title || 'Worker Training & Wellness', desc: data?.hsePillar3Desc || 'Mandatory safety training and regular health check-ups for all.' },
                ].map((item, i) => (
                  <div key={i} className="hse-policy-item" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: ORANGE, marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: NAVY }}>{item.title}</h4>
                      <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button 
                onClick={() => navigate('/about/ehs')}
                className="hse-cta-btn"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  color: NAVY, fontSize: 13, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '1px',
                  textDecoration: 'none', paddingTop: 12,
                  borderTop: '1px solid #e2e8f0', transition: 'color 0.3s',
                  background: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.color = ORANGE}
                onMouseLeave={e => e.currentTarget.style.color = NAVY}
              >
                {data?.ctaText || 'Build with us'} <FaArrowRight style={{ color: ORANGE, fontSize: 12 }} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pisl-hse-section {
            padding: 34px 16px 38px 16px !important;
          }
          .pisl-hse-header {
            margin-bottom: 22px !important;
          }
          .pisl-hse-title {
            font-size: clamp(21px, 5.8vw, 26px) !important;
            letter-spacing: -0.5px !important;
            margin-bottom: 8px !important;
          }
          .pisl-hse-desc {
            font-size: 13.5px !important;
            line-height: 1.55 !important;
          }
          .hse-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .hse-img-box {
            height: clamp(190px, 52vw, 235px) !important;
            border-radius: 14px !important;
            border-width: 2.5px !important;
          }
          .hse-content-box {
            gap: 18px !important;
          }
          .hse-quote-box {
            padding: 18px 20px !important;
            border-radius: 12px !important;
          }
          .hse-quote-title {
            font-size: 16px !important;
            margin-bottom: 6px !important;
          }
          .hse-quote-desc {
            font-size: 13px !important;
            line-height: 1.5 !important;
          }
          .hse-policy-list {
            gap: 12px !important;
          }
          .hse-policy-item h4 {
            font-size: 13.5px !important;
            margin-bottom: 3px !important;
          }
          .hse-policy-item p {
            font-size: 12.5px !important;
            line-height: 1.45 !important;
          }
          .hse-cta-btn {
            padding-top: 14px !important;
            font-size: 12.5px !important;
            min-height: 44px !important;
            align-items: center !important;
          }
        }

        @media (max-width: 360px) {
          .hse-img-box {
            height: 180px !important;
          }
          .hse-quote-box {
            padding: 14px 16px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HSESection;
