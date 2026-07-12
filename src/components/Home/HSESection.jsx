import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';

const hseImages = [
  '/images/EHS/Heroimages/2.png',
];

const HSESection = () => {
  const navigate = useNavigate();
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % hseImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ 
      padding: '40px 24px', 
      backgroundColor: '#f8fafc', 
      fontFamily: '"Inter", "-apple-system", sans-serif'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <h2 style={{
            fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: NAVY,
            margin: '0 0 6px', letterSpacing: '-1px'
          }}>
            Health, Safety & <span style={{ color: NAVY }}>Environment</span>
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 550, margin: '0 auto', lineHeight: 1.6 }}>
            Providing a safe workplace to our workers & protection of the environment is our topmost priority.
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
            style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(10,42,102,0.08)', height: 380, border: '3px solid #ff8755' }}
          >
            <img
              src={hseImages[0]}
              alt="HSE"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Quote */}
              <div style={{
                background: NAVY, borderRadius: '12px', padding: '24px 28px',
                color: '#fff', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `${ORANGE}15`, pointerEvents: 'none' }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px', position: 'relative' }}>
                  "Zero Harm Is Possible"
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6, position: 'relative' }}>
                  As an emerging leader in construction, we prohibit all injuries and illnesses arising from work.
                </p>
              </div>

              {/* Policy Points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { title: 'Occupational Health & Safety', desc: 'Personal commitment to safe workplace, healthy environment & culture.' },
                  { title: 'Environmental Protection', desc: 'Minimizing ecological footprint through sustainable practices.' },
                  { title: 'Worker Training & Wellness', desc: 'Mandatory safety training and regular health check-ups for all.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
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
                Build with us <FaArrowRight style={{ color: ORANGE, fontSize: 12 }} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hse-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default HSESection;