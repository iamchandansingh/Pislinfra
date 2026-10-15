import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBriefcase, FaNetworkWired, FaCheckCircle } from 'react-icons/fa';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import CoreTeamGrid from '../../components/leadership/CoreTeamGrid';
import { fetchStrapiData, getLocalDataSync } from '../../services/strapi';
import Preloader from '../../components/common/Preloader';
import defaultLeadershipData from '../../data/leadershipData';

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
  const [data, setData] = useState(() => {
    const local = getLocalDataSync('leadership-page');
    return (local && local.topLeaderName) ? local : defaultLeadershipData;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchStrapiData('leadership-page?populate[0]=heroImage&populate[1]=seo&populate[2]=topLeaderImage&populate[3]=topLeaderHighlights&populate[4]=executives.image&populate[5]=coreTeam.image');
        const clean = res?.data || res;
        if (clean && clean.topLeaderName) {
          setData(clean);
        }
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
    return `${import.meta.env.VITE_STRAPI_URL || ""}${url}`;
  };

  if (loading && !data) return <Preloader />;

  const seoData = {
    contentType: 'page',
    title: data.seo?.seoTitle || 'Leadership & Executive Management Team | Pislinfra',
    seoTitle: data.seo?.seoTitle || 'Leadership & Board of Directors - Visionary Infrastructure Leaders | Pislinfra',
    seoDescription: data.seo?.seoDescription || 'Meet the leadership team and board of directors at Pislinfra steering India\'s fastest-growing industrial EPC, civil engineering, and warehouse construction enterprise.',
    seoKeywords: data.seo?.seoKeywords || 'Pislinfra leadership, board of directors, management team, industrial infrastructure leaders India, civil engineering executives, construction MD India',
    slug: 'about/leadership',
    canonicalUrl: 'https://pislinfra.com/about/leadership',
    ogTitle: data.seo?.ogTitle || 'Executive Leadership & Management Team | Pislinfra',
    ogDescription: data.seo?.ogDescription || 'Meet the visionaries driving engineering excellence and nationwide industrial infrastructure development at Pislinfra.',
    ogImage: getImageUrl(data.seo?.ogImage || data.heroImage, 'https://pislinfra.com/images/hero/leadership.png'),
    ogType: 'website',
    twitterTitle: data.seo?.twitterTitle || 'Leadership Team | Pislinfra',
    twitterDescription: data.seo?.twitterDescription || 'Visionary leadership behind 16M+ sq. ft of turnkey infrastructure in India.',
    twitterImage: getImageUrl(data.seo?.twitterImage || data.heroImage, 'https://pislinfra.com/images/hero/leadership.png'),
    twitterCardType: 'summary_large_image',
    schemaType: 'AboutPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Leadership', 'Management', 'Directors', 'Founders', 'Pislinfra Executive Team'],
    ...data.seo
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

      <section className="pisl-leader-section" style={{ padding: '60px 20px', background: '#ffffff' }}>
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
              <div className="leader-img-box" style={{
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
              <h2 className="leader-name" style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: NAVY, margin: '0 0 4px 0', letterSpacing: '-0.5px', fontFamily: 'Inter, sans-serif' }}>
                {data.topLeaderName}
              </h2>
              
              <p className="leader-designation" style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', margin: '0 0 20px 0', fontFamily: 'Inter, sans-serif' }}>
                {data.topLeaderDesignation}
              </p>

              <div className="leader-bio-wrap" style={{ borderLeft: `2px solid ${ORANGE}`, paddingLeft: '18px', marginBottom: '28px' }}>
                <p className="leader-bio-text" style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: 0, fontFamily: 'Inter, sans-serif' }}>
                  {data.topLeaderBio}
                </p>
              </div>

              <div className="leader-highlights" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(data.topLeaderHighlights || []).map((highlight, index) => {
                  const IconComp = getIcon(highlight.iconName);
                  const isLast = index === data.topLeaderHighlights.length - 1;
                  return (
                    <div key={index} className="leader-highlight-item" style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: isLast ? '0' : '14px', borderBottom: isLast ? 'none' : '1px solid #f1f5f9' }}>
                      <div className="leader-highlight-icon-wrap" style={{ width: '36px', height: '36px', borderRadius: '8px', background: index % 2 === 0 ? 'rgba(255,144,78,0.08)' : 'rgba(40,41,111,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconComp className="leader-highlight-icon" style={{ color: index % 2 === 0 ? ORANGE : NAVY, fontSize: '15px' }} />
                      </div>
                      <div>
                        <h4 className="leader-highlight-title" style={{ margin: '0 0 1px 0', fontSize: '13px', fontWeight: 700, color: NAVY, fontFamily: 'Inter, sans-serif' }}>{highlight.title}</h4>
                        <p className="leader-highlight-desc" style={{ margin: 0, fontSize: '11px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>{highlight.description}</p>
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
      <section className="pisl-exec-section" style={{ padding: '60px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="exec-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="exec-title" style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, color: NAVY, margin: '0 0 6px 0', letterSpacing: '-0.5px', fontFamily: 'Inter, sans-serif' }}>
              {data.executiveTitle}
            </h2>
            <p className="exec-subtitle" style={{ fontSize: '13px', color: '#64748b', maxWidth: '450px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
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
                className="exec-card"
                style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
              >
                <div className="exec-img-box" style={{ width: '100%', paddingTop: '125%', overflow: 'hidden', background: '#20245e', borderRadius: '20px', position: 'relative', marginBottom: '16px', boxShadow: '0 8px 24px rgba(40,41,111,0.04)' }}>
                  <img src={getImageUrl(member.image)} alt={member.name} className="exec-img" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', transition: 'transform 0.4s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(40,41,111,0.15) 0%, transparent 50%)', pointerEvents: 'none' }} />
                </div>
                <div className="exec-info" style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left', padding: '0 4px' }}>
                  <h3 className="exec-name" style={{ fontSize: '18px', fontWeight: 800, color: NAVY, margin: '0 0 3px 0', letterSpacing: '-0.3px', fontFamily: 'Inter, sans-serif' }}>{member.name}</h3>
                  <p className="exec-designation" style={{ fontSize: '11px', fontWeight: 700, color: ORANGE, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>{member.designation}</p>
                  <p className="exec-bio" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0, fontFamily: 'Inter, sans-serif' }}>{member.bio}</p>
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

        /* Mobile styles for Shubhendra Mittal section */
        @media (max-width: 767px) {
          section.pisl-leader-section {
            padding: 34px 16px 40px 16px !important;
          }
          .leader-layout {
            gap: 22px !important;
          }
          .leader-img {
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
          }
          .leader-img-box {
            max-width: 290px !important;
            padding-top: 108% !important;
            border-radius: 20px !important;
            margin: 0 auto !important;
            box-shadow: 0 14px 38px -10px rgba(40, 41, 111, 0.16) !important;
          }
          .leader-name {
            font-size: clamp(23px, 6vw, 30px) !important;
            margin-bottom: 4px !important;
            letter-spacing: -0.4px !important;
          }
          .leader-designation {
            font-size: 12.5px !important;
            color: #ff904e !important;
            font-weight: 700 !important;
            letter-spacing: 0.8px !important;
            text-transform: uppercase !important;
            margin-bottom: 16px !important;
          }
          .leader-bio-wrap {
            padding-left: 14px !important;
            margin-bottom: 22px !important;
            border-left-width: 3px !important;
          }
          .leader-bio-text {
            font-size: 13.5px !important;
            line-height: 1.65 !important;
            color: #475569 !important;
          }
          .leader-highlights {
            gap: 10px !important;
          }
          .leader-highlight-item {
            gap: 12px !important;
            padding-bottom: 12px !important;
          }
          .leader-highlight-icon-wrap {
            width: 38px !important;
            height: 38px !important;
            border-radius: 10px !important;
          }
          .leader-highlight-title {
            font-size: 13.5px !important;
            margin-bottom: 2px !important;
            font-weight: 700 !important;
          }
          .leader-highlight-desc {
            font-size: 11.5px !important;
            line-height: 1.45 !important;
          }
        }

        @media (max-width: 360px) {
          section.pisl-leader-section {
            padding: 28px 12px 34px 12px !important;
          }
          .leader-img-box {
            max-width: 250px !important;
          }
          .leader-name {
            font-size: 21px !important;
          }
          .leader-bio-text {
            font-size: 12.5px !important;
          }
        }

        /* Mobile styles for Executive Management section */
        @media (max-width: 767px) {
          section.pisl-exec-section {
            padding: 36px 16px 42px 16px !important;
          }
          .exec-header {
            margin-bottom: 22px !important;
          }
          .exec-title {
            font-size: clamp(22px, 6vw, 28px) !important;
            letter-spacing: -0.4px !important;
            margin-bottom: 6px !important;
          }
          .exec-subtitle {
            font-size: 13px !important;
            line-height: 1.5 !important;
          }
          .exec-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .exec-card {
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 16px !important;
            padding: 14px !important;
            box-shadow: 0 4px 16px rgba(40, 41, 111, 0.04) !important;
            max-width: 350px !important;
            margin: 0 auto !important;
            width: 100% !important;
          }
          .exec-img-box {
            padding-top: 125% !important;
            border-radius: 14px !important;
            margin-bottom: 14px !important;
            background: #20245e !important;
            box-shadow: none !important;
          }
          .exec-img {
            object-fit: cover !important;
            object-position: center 20% !important;
          }
          .exec-info {
            padding: 0 2px !important;
          }
          .exec-name {
            font-size: 16.5px !important;
            margin-bottom: 3px !important;
          }
          .exec-designation {
            font-size: 11px !important;
            letter-spacing: 0.8px !important;
            margin-bottom: 8px !important;
          }
          .exec-bio {
            font-size: 12.5px !important;
            line-height: 1.55 !important;
            color: #64748b !important;
          }
        }

        @media (max-width: 360px) {
          section.pisl-exec-section {
            padding: 28px 12px 34px 12px !important;
          }
          .exec-card {
            padding: 12px !important;
          }
          .exec-name {
            font-size: 15px !important;
          }
          .exec-bio {
            font-size: 11.5px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Leadership;
