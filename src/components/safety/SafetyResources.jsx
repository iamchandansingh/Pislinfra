import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaDownload, FaPhone, FaChevronDown, FaFilePdf, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const NAVY = '#28286e';
const ORANGE = '#ff8755';

const SafetyResources = () => {
  const [selected, setSelected] = useState('Site Safety Manual');
  
  const resources = [
    'Site Safety Manual', 
    'PPE Guidelines', 
    'Emergency Response Plan', 
    'Hazard Identification', 
    'Work Permit Procedures', 
    'Toolbox Talk Resources', 
    'Safety Training Guide', 
    'Incident Reporting Process'
  ];

  const supportItems = [
    { icon: FaShieldAlt, title: '24/7 Safety Monitoring', desc: 'Round-the-clock safety surveillance' },
    { icon: FaHeadset, title: 'Emergency Coordination', desc: 'Rapid response team available' },
    { icon: FaCheckCircle, title: 'Site Compliance Support', desc: 'Full regulatory compliance' },
    { icon: FaFilePdf, title: 'Training Assistance', desc: 'Safety training & documentation' },
  ];

  return (
    <section style={{ padding: '80px 24px', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <h2 style={{ 
            fontSize: 'clamp(28px, 3.5vw, 40px)', 
            fontWeight: 800, 
            color: NAVY, 
            margin: '0 0 10px',
            letterSpacing: '-0.5px'
          }}>
            Safety <span style={{ color: ORANGE }}>Resources & Manuals</span>
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', maxWidth: 550, margin: '0 auto', lineHeight: 1.6 }}>
            Access essential safety guidelines, operational procedures, and workplace best practices designed for safer project execution.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '36px', 
          alignItems: 'start' 
        }} className="resources-grid">
          
          {/* LEFT: Image + Support Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Large Image */}
            <div style={{ 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 16px 40px rgba(40,40,110,0.08)', 
              height: 320,
              border: `1px solid ${ORANGE}10`
            }}>
              <img 
                src="/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(4).png" 
                alt="Safety Resources" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            {/* Support Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {supportItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3 }}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '8px',
                    background: `${ORANGE}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <item.icon style={{ fontSize: '13px', color: ORANGE }} />
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: 700, color: NAVY }}>{item.title}</h5>
                    <p style={{ margin: 0, fontSize: '10.5px', color: '#94a3b8', lineHeight: 1.3 }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Resource Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
          >
            <div style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              padding: '32px 28px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 8px 32px rgba(40,40,110,0.05)',
              position: 'sticky',
              top: '20px'
            }}>
              
              {/* Icon Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '44px', height: '44px',
                  borderRadius: '12px',
                  background: `${NAVY}08`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FaFilePdf style={{ fontSize: '20px', color: ORANGE }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: NAVY }}>Resource Library</h4>
                  <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Download safety documents</p>
                </div>
              </div>

              {/* Dropdown */}
              <label style={{ 
                fontSize: '10px', fontWeight: 700, 
                color: '#94a3b8', textTransform: 'uppercase', 
                letterSpacing: '1px', display: 'block', marginBottom: '6px' 
              }}>
                Select Resource Type
              </label>
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <select 
                  value={selected} 
                  onChange={e => setSelected(e.target.value)}
                  style={{ 
                    width: '100%', padding: '13px 16px', 
                    borderRadius: '10px', border: '1px solid #e2e8f0', 
                    fontSize: '14px', fontWeight: 600, color: NAVY, 
                    background: '#f8fafc', cursor: 'pointer', 
                    appearance: 'none', outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = ORANGE}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  {resources.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <FaChevronDown style={{ 
                  position: 'absolute', right: 14, top: '50%', 
                  transform: 'translateY(-50%)', color: NAVY, 
                  pointerEvents: 'none', fontSize: 12 
                }} />
              </div>

              {/* Selected Resource Preview */}
              <div style={{ 
                background: '#f8fafc', 
                borderRadius: '12px', 
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  marginBottom: '10px'
                }}>
                  <FaFilePdf style={{ color: ORANGE, fontSize: '16px' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: NAVY }}>{selected}</span>
                </div>
                <p style={{ 
                  margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.5 
                }}>
                  This document contains essential guidelines, procedures, and best practices for maintaining workplace safety standards across all project sites.
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    padding: '14px', 
                    background: NAVY, 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '10px', 
                    fontWeight: 700, 
                    fontSize: '13px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px', 
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 12px rgba(40,40,110,0.12)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = ORANGE} 
                  onMouseLeave={e => e.currentTarget.style.background = NAVY}
                >
                  <FaDownload size={12} /> Download {selected}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    padding: '14px', 
                    background: '#ffffff', 
                    color: NAVY, 
                    border: `2px solid ${NAVY}`, 
                    borderRadius: '10px', 
                    fontWeight: 700, 
                    fontSize: '13px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px', 
                    transition: 'all 0.3s' 
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.background = NAVY; 
                    e.currentTarget.style.color = '#fff'; 
                  }} 
                  onMouseLeave={e => { 
                    e.currentTarget.style.background = '#fff'; 
                    e.currentTarget.style.color = NAVY; 
                  }}
                >
                  <FaPhone size={12} /> Contact Safety Team
                </motion.button>
              </div>    

            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .resources-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SafetyResources;