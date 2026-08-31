import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBriefcase, FaNetworkWired, FaCheckCircle } from 'react-icons/fa';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import CoreTeamGrid from '../../components/leadership/CoreTeamGrid';
import { fetchStrapiData } from '../../services/strapi';
import Preloader from '../../components/common/Preloader';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const iconMap = {
  FaGraduationCap: FaGraduationCap,
  FaBriefcase: FaBriefcase,
  FaNetworkWired: FaNetworkWired
};

const getIcon = (name) => {
  return iconMap[name] || FaCheckCircle;
};

const Leadership = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchStrapiData('leadership-page?populate[0]=heroImage&populate[1]=seo&populate[2]=topLeaderImage&populate[3]=topLeaderHighlights&populate[4]=executives.image&populate[5]=coreTeam.image');
        if (res) setData(res);
      } catch (err) {
        console.error('Error fetching leadership data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getImageUrl = (imgObj, defaultImg) => {
    if (!imgObj) return defaultImg;
    const url = imgObj.url || imgObj.data?.attributes?.url;
    if (!url) return defaultImg;
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_STRAPI_URL || "http://127.0.0.1:1337"}${url}`;
  };

  if (loading) return <Preloader />;
  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Data not found.</div>;

  const seoData = {
    ...data.seo,
    contentType: 'page',
    ogImage: getImageUrl(data.seo?.ogImage || data.heroImage, 'https://pislinfra.com/images/hero/leadership.png')
  };

  return (
    <div style={{ background: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
      
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title={data.title} 
        subtitle={data.subtitle}
        breadcrumb={data.breadcrumb}
        bgImage={getImageUrl(data.heroImage, "/images/hero/leadership.png")}
      />

      <section style={{ padding: '60px 20px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div className="leader-layout" style={{
            display: 'grid', gridTemplateColumns: '1fr', gap: '40px', alignItems: 'start',
          }}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="leader-img"
            >
              <div style={{
                width: '100%', paddingTop: '120%', borderRadius: '24px', overflow: 'hidden',
                background: '#f1f5f9', position: 'relative',
                boxShadow: '0 20px 50px -10px rgba(40, 41, 111, 0.1)',
              }}>
                <img src={getImageUrl(data.topLeaderImage)} alt={data.topLeaderName} 
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
                {data.topLeaderName}
              </h2>
              
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', margin: '0 0 20px 0', fontFamily: 'Inter, sans-serif' }}>
                {data.topLeaderDesignation}
              </p>

              <div style={{ borderLeft: `2px solid ${ORANGE}`, paddingLeft: '18px', marginBottom: '28px' }}>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: 0, fontFamily: 'Inter, sans-serif' }}>
                  {data.topLeaderBio}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(data.topLeaderHighlights || []).map((highlight, index) => {
                  const IconComp = getIcon(highlight.iconName);
                  const isLast = index === data.topLeaderHighlights.length - 1;
                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: isLast ? '0' : '14px', borderBottom: isLast ? 'none' : '1px solid #f1f5f9' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: index % 2 === 0 ? 'rgba(255,144,78,0.08)' : 'rgba(40,41,111,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconComp style={{ color: index % 2 === 0 ? ORANGE : NAVY, fontSize: '15px' }} />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 1px 0', fontSize: '13px', fontWeight: 700, color: NAVY, fontFamily: 'Inter, sans-serif' }}>{highlight.title}</h4>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>{highlight.description}</p>
                      </div>
                    </div>
                  );
                })}
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
              {data.executiveTitle}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '450px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
              {data.executiveSubtitle}
            </p>
          </div>

          <div className="exec-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '32px' }}>
            {(data.executives || []).map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
              >
                <div style={{ width: '100%', paddingTop: '110%', overflow: 'hidden', background: '#f1f5f9', borderRadius: '20px', position: 'relative', marginBottom: '16px', boxShadow: '0 8px 24px rgba(40,41,111,0.04)' }}>
                  <img src={getImageUrl(member.image)} alt={member.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
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

      <CoreTeamGrid title={data.coreTeamTitle} members={data.coreTeam} />

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
