import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBriefcase, FaNetworkWired } from 'react-icons/fa';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import CoreTeamGrid from '../../components/leadership/CoreTeamGrid';

import shubhendraMittalImg from '../../assets/images/leadership/Core Team/Shubhendra-Mittal.png';
import abhimanyuRaoImg from '../../assets/images/leadership/Core Team/1.png';
import kjrawal from '../../assets/images/leadership/Core Team/2.png';
import Yash from '../../assets/images/leadership/Core Team/Yash.png';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const executiveLeaders = [
  {
    id: 1,
    name: 'YASH MITTAL',
    designation: 'Promoter – Director',
    bio: 'A Graduate in Mechanical Engg. from BITS Pilani Dubai, focusing on deployment of new technologies for growth and development of EPC business.',
    img: Yash,
  },
  {
    id: 2,
    name: 'ABHIMANYU RAO',
    designation: 'Promoter – Director',
    bio: 'Spearheading robust commercial frameworks and technical innovation models to secure optimized logistics and warehousing portfolios.',
    img: abhimanyuRaoImg,
  },
  {
    id: 3,
    name: 'K.J. RAWAL',
    designation: 'Independent – Director',
    bio: 'A seasoned professional with 39+ years of experience in the EPC Industry. He joined Gannon Dunkerley & Co. Ltd. as a trainee engineer and rose to the ranks of Managing Director having executed large scale complex industrial projects Pan India.',
    img: kjrawal,
  }
];

const Leadership = () => {
  const seoData = {
    contentType: 'page',
    title: 'Leadership',
    seoTitle: 'Leadership',
    seoDescription: 'Meet the leadership team at Pislinfra. Shubhendra Mittal (IIT Kharagpur) leads with 33+ years expertise in steel fabrication, infrastructure & business development.',
    seoKeywords: 'leadership team, infrastructure leaders, construction management, Shubhendra Mittal, executive management, Pislinfra directors',
    slug: 'about/leadership',
    canonicalUrl: 'https://pislinfra.com/about/leadership',
    ogTitle: 'Our Leadership - Infrastructure Visionaries | Pislinfra',
    ogDescription: 'Meet the visionaries steering Pislinfra\'s growth in industrial construction.',
    ogImage: 'https://pislinfra.com/images/hero/leadership.png',
    ogType: 'website',
    twitterTitle: 'Leadership Team | Pislinfra',
    twitterDescription: 'The experts driving India\'s industrial infrastructure growth.',
    twitterImage: 'https://pislinfra.com/images/hero/leadership.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'AboutPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Leadership', 'Management', 'Directors', 'Infrastructure', 'Construction'],
  };

  return (
    <div style={{ background: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
      
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title="Our Leadership" 
        subtitle="The visionaries and domain experts steering our growth"
        breadcrumb="Leadership"
        bgImage="/images/hero/leadership.png"
      />

      {/* Shubhendra Mittal */}
      <section style={{ padding: '60px 20px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div className="leader-layout" style={{
            display: 'grid', gridTemplateColumns: '1fr', gap: '40px', alignItems: 'start',
          }}>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="leader-img"
            >
              <div style={{
                width: '100%', paddingTop: '120%', borderRadius: '24px', overflow: 'hidden',
                background: '#f1f5f9', position: 'relative',
                boxShadow: '0 20px 50px -10px rgba(40, 41, 111, 0.1)',
              }}>
                <img src={shubhendraMittalImg} alt="Shubhendra Mittal" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="leader-content"
            >
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: NAVY, margin: '0 0 4px 0', letterSpacing: '-0.5px', fontFamily: 'Inter, sans-serif' }}>
                Shubhendra Mittal
              </h2>
              
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', margin: '0 0 20px 0', fontFamily: 'Inter, sans-serif' }}>
                Partner & Managing Director
              </p>

              <div style={{ borderLeft: `2px solid ${ORANGE}`, paddingLeft: '18px', marginBottom: '28px' }}>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: 0, fontFamily: 'Inter, sans-serif' }}>
                  A graduate from IIT Kharagpur with an excellent knowledge & 33+ years of expertise in Steel Fabrication, Infrastructure Development & Business Development coupled with excellent networking and communication skills. He has a natural flair for in depth technical analysis and technological innovation.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,144,78,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaGraduationCap style={{ color: ORANGE, fontSize: '15px' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 1px 0', fontSize: '13px', fontWeight: 700, color: NAVY, fontFamily: 'Inter, sans-serif' }}>IIT Kharagpur Alumnus</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>Excellent professional knowledge base</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(40,41,111,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaBriefcase style={{ color: NAVY, fontSize: '15px' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 1px 0', fontSize: '13px', fontWeight: 700, color: NAVY, fontFamily: 'Inter, sans-serif' }}>33+ Years Core Expertise</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>Steel Fabrication & Infrastructure Development</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,144,78,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaNetworkWired style={{ color: ORANGE, fontSize: '15px' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 1px 0', fontSize: '13px', fontWeight: 700, color: NAVY, fontFamily: 'Inter, sans-serif' }}>Technological Innovation</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>Natural flair for in-depth technical analysis</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Executive Management */}
      <section style={{ padding: '60px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, color: NAVY, margin: '0 0 6px 0', letterSpacing: '-0.5px', fontFamily: 'Inter, sans-serif' }}>
              Executive Management
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '450px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
              Steering large enterprise operations with highly structured corporate delivery models.
            </p>
          </div>

          <div className="exec-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '32px' }}>
            {executiveLeaders.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
              >
                <div style={{ width: '100%', paddingTop: '110%', overflow: 'hidden', background: '#f1f5f9', borderRadius: '20px', position: 'relative', marginBottom: '16px', boxShadow: '0 8px 24px rgba(40,41,111,0.04)' }}>
                  <img src={member.img} alt={member.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(40,41,111,0.15) 0%, transparent 50%)', pointerEvents: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left', padding: '0 4px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: NAVY, margin: '0 0 3px 0', letterSpacing: '-0.3px', fontFamily: 'Inter, sans-serif' }}>{member.name}</h3>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: ORANGE, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>{member.designation}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0, fontFamily: 'Inter, sans-serif' }}>{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CoreTeamGrid />

      <style>{`
        @media (min-width: 768px) {
          .leader-layout { grid-template-columns: 0.9fr 1.1fr !important; gap: 60px !important; }
          .leader-img { position: sticky; top: 30px; }
        }
        @media (min-width: 640px) {
          .exec-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 40px 28px !important; }
        }
        @media (min-width: 1024px) {
          .exec-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 48px 32px !important; }
        }
      `}</style>
    </div>
  );
};

export default Leadership;