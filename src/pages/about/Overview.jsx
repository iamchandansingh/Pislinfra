import Preloader from '../../components/common/Preloader';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchStrapiData, getLocalDataSync } from '../../services/strapi';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import OurPresence from '../../components/sections/OurPresence';
import AboutDocuments from '../../components/about/AboutDocuments';
import { 
  FaWarehouse, FaCalendar, FaBuilding, FaUsers, 
  FaHardHat, FaIndustry, FaHandshake, FaStar, FaLightbulb, FaShieldAlt,
  FaCheckCircle, FaCogs, FaChartLine
} from 'react-icons/fa';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const iconMap = {
  FaWarehouse: FaWarehouse,
  FaCalendar: FaCalendar,
  FaBuilding: FaBuilding,
  FaUsers: FaUsers,
  FaTeam: FaUsers,
  FaHardHat: FaHardHat,
  FaIndustry: FaIndustry,
  FaHandshake: FaHandshake,
  FaStar: FaStar,
  FaLightbulb: FaLightbulb,
  FaShieldAlt: FaShieldAlt,
  FaCogs: FaCogs,
  FaChartLine: FaChartLine
};

const getIcon = (name) => {
  return iconMap[name] || FaCheckCircle;
};

const AutoSlidingImages = () => {
  const images = [
    '/images/Overview/11.png',
    '/images/Overview/8.png',
    '/images/Overview/4.png',
    '/images/Overview/3.png',
    '/images/Overview/13.png',
    '/images/Overview/21.png',
  ];
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % images.length), 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="overview-slider-wrap" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(40,40,110,0.1)', height: '340px', position: 'relative' }}>
      {images.map((img, i) => (
        <img 
          key={i} 
          src={img} 
          alt="Pislinfra Overview" 
          loading="lazy"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            opacity: current === i ? 1 : 0, 
            transition: 'opacity 0.8s ease' 
          }} 
        />
      ))}
      {/* Slide indicator dots */}
      <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 2 }}>
        {images.map((_, i) => (
          <span 
            key={i} 
            style={{ 
              width: current === i ? '18px' : '6px', 
              height: '6px', 
              borderRadius: '3px', 
              backgroundColor: current === i ? ORANGE : 'rgba(255,255,255,0.7)', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease' 
            }} 
          />
        ))}
      </div>
    </div>
  );
};

const Overview = () => {
  const [data, setData] = useState(() => getLocalDataSync('about-page'));
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchStrapiData('about-page?populate[0]=heroImage&populate[1]=seo&populate[2]=stats&populate[3]=capabilities&populate[4]=values&populate[5]=companyProfile.file&populate[6]=companyProfile.coverImage&populate[7]=resources.file&populate[8]=resources.coverImage');
        if (response) {
          setData(response);
        }
      } catch (error) {
        console.error('Error fetching about page:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    const handleUpdate = (e) => {
      if (e.detail?.endpoint?.includes('about-page') && e.detail.data) {
        setData(e.detail.data);
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, []);

  const getImageUrl = (imgObj, defaultImg) => {
    if (!imgObj) return defaultImg;
    const url = imgObj.url || imgObj.data?.attributes?.url;
    if (!url) return defaultImg;
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_STRAPI_URL || ""}${url}`;
  };

  if (loading && !data) return <Preloader />;
  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Data not found.</div>;

  const seoData = {
    contentType: 'page',
    title: data.seo?.seoTitle || 'About Us - Company Overview & Infrastructure Legacy | Pislinfra',
    seoTitle: data.seo?.seoTitle || 'About Pislinfra - India\'s Premier Industrial & Warehouse EPC Contractor',
    seoDescription: data.seo?.seoDescription || 'Pragati Infra Solutions Pvt. Ltd. (Pislinfra) is a leading industrial infrastructure and EPC company with 16M+ sq. ft delivered across India. Specializing in warehouses, logistics parks, and PEB engineering.',
    seoKeywords: data.seo?.seoKeywords || 'about Pislinfra, industrial construction company India, Pragati Infra Solutions, turnkey EPC contractor, warehouse builder India, industrial infrastructure profile',
    slug: 'about',
    canonicalUrl: 'https://pislinfra.com/about',
    ogTitle: data.seo?.ogTitle || 'About Pislinfra - Turnkey Industrial EPC Company',
    ogDescription: data.seo?.ogDescription || 'Discover Pislinfra\'s journey, 16M+ sq ft delivered, Grade-A logistics parks, and nationwide presence.',
    ogImage: getImageUrl(data.seo?.ogImage || data.heroImage, 'https://pislinfra.com/images/hero/11.png'),
    ogType: 'website',
    twitterTitle: data.seo?.twitterTitle || 'About Us | Pislinfra Infrastructure',
    twitterDescription: data.seo?.twitterDescription || '16M+ sq ft of industrial infrastructure and warehousing delivered across India.',
    twitterImage: getImageUrl(data.seo?.twitterImage || data.heroImage, 'https://pislinfra.com/images/hero/11.png'),
    twitterCardType: 'summary_large_image',
    schemaType: 'AboutPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['About Us', 'Pislinfra', 'Industrial EPC', 'Company Overview', 'Infrastructure Leader India'],
    ...data.seo
  };

  const overviewTitle = data?.overviewTitle ? data.overviewTitle.toUpperCase() : 'OVERVIEW';

  const capabilitiesTitleSplit = data.capabilitiesTitle ? data.capabilitiesTitle.split(' ') : ['OUR', 'CAPABILITIES'];
  const c1 = capabilitiesTitleSplit.slice(0, -1).join(' ') || 'OUR';
  const c2 = capabilitiesTitleSplit.slice(-1) || 'CAPABILITIES';

  const valuesTitleSplit = data.valuesTitle ? data.valuesTitle.split(' ') : ['OUR', 'VALUES'];
  const v1 = valuesTitleSplit.slice(0, -1).join(' ') || 'OUR';
  const v2 = valuesTitleSplit.slice(-1) || 'VALUES';

  return (
    <div style={{ background: '#ffffff', fontFamily: '"Inter", "Helvetica Neue", sans-serif' }}>
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title={data.title} 
        subtitle={data.subtitle}
        breadcrumb={data.breadcrumb}
        bgImage={getImageUrl(data.heroImage, "/images/hero/11.png")}
      />

      <section id="expertise" className="overview-section pisl-overview-section" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 0.75fr', gap: '56px', alignItems: 'center' }} className="overview-split">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="overview-title" style={{ fontSize: '36px', fontWeight: 'bold', color: NAVY, marginBottom: '24px' }}>
              {overviewTitle}
            </h2>
            <div 
              className="rich-text-content"
              style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: data.overviewText }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <AutoSlidingImages />
          </motion.div>
        </div>
      </section>

      <section className="stats-section pisl-stats-section" style={{ backgroundColor: '#f9fafb', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="stats-grid pisl-stats-grid">
            {(data.stats || []).map((item, i) => {
              const IconComp = getIcon(item.iconName);
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="pisl-stat-card"
                  style={{ 
                    textAlign: 'center', 
                    padding: '36px 20px 32px', 
                    backgroundColor: '#fff5f0', 
                    borderRadius: '16px', 
                    border: '2px solid #ffd5c2', 
                    borderBottom: `4px solid ${ORANGE}`, 
                    transition: 'all 0.3s ease', 
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: '100%'
                  }}
                >
                  <div 
                    className="pisl-stat-icon-wrap"
                    style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '16px', 
                      backgroundColor: ORANGE, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 14px',
                      flexShrink: 0
                    }}
                  >
                    <IconComp className="pisl-stat-icon" style={{ color: 'white', fontSize: '28px' }} />
                  </div>
                  <div 
                    className="pisl-stat-title"
                    style={{ fontSize: '16px', fontWeight: 'bold', color: NAVY, marginBottom: '6px', letterSpacing: '1px' }}
                  >
                    {item.title}
                  </div>
                  <div 
                    className="pisl-stat-desc"
                    style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', lineHeight: 1.5 }}
                  >
                    {item.description}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overview-section pisl-capabilities-section" style={{ backgroundColor: NAVY, overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="pisl-capabilities-title" style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '48px', textAlign: 'center' }}>
            {c1} <span style={{ color: ORANGE }}>{c2}</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }} className="capabilities-grid pisl-capabilities-grid">
            {(data.capabilities || []).map((cap, i) => {
              const IconComp = getIcon(cap.iconName);
              return (
                <div 
                  key={i} 
                  className="pisl-capability-card"
                  style={{ 
                    padding: '40px', 
                    backgroundColor: 'white', 
                    borderRadius: '16px', 
                    borderLeft: `4px solid ${ORANGE}`, 
                    borderBottom: `4px solid ${NAVY}`,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                    <div 
                      className="pisl-capability-icon-wrap"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '16px', 
                        backgroundColor: '#fff5f0', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        flexShrink: 0 
                      }}
                    >
                      <IconComp className="pisl-capability-icon" style={{ color: ORANGE, fontSize: '26px' }} />
                    </div>
                    <div>
                      <h3 className="pisl-capability-title" style={{ fontSize: '18px', fontWeight: 'bold', color: NAVY, marginBottom: '12px', lineHeight: '1.4' }}>
                        {cap.title}
                      </h3>
                      <p className="pisl-capability-desc" style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>
                        {cap.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="overview-section pisl-values-section" style={{ backgroundColor: '#f9fafb', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="pisl-values-title" style={{ fontSize: '36px', fontWeight: 'bold', color: NAVY, marginBottom: '48px', textAlign: 'center' }}>
            {v1} <span style={{ color: ORANGE }}>{v2}</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="values-grid pisl-values-grid">
            {(data.values || []).map((val, i) => {
              const IconComp = getIcon(val.iconName);
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="pisl-value-card"
                  style={{ 
                    textAlign: 'center', 
                    padding: '40px 24px 36px', 
                    backgroundColor: 'white', 
                    borderRadius: '16px', 
                    border: '2px solid #e5e7eb', 
                    borderBottom: `4px solid ${ORANGE}`, 
                    transition: 'all 0.3s ease', 
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: '100%',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
                  }}
                >
                  <div 
                    className="pisl-value-icon-wrap"
                    style={{ 
                      width: '72px', 
                      height: '72px', 
                      borderRadius: '18px', 
                      backgroundColor: '#fff5f0', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 16px',
                      flexShrink: 0
                    }}
                  >
                    <IconComp className="pisl-value-icon" style={{ color: ORANGE, fontSize: '32px' }} />
                  </div>
                  <h3 className="pisl-value-title" style={{ fontSize: '18px', fontWeight: 'bold', color: NAVY, letterSpacing: '2px', marginBottom: '8px' }}>
                    {val.title}
                  </h3>
                  <p className="pisl-value-desc" style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', lineHeight: 1.5, margin: 0 }}>
                    {val.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OUR PRESENCE */}
      <OurPresence title={data.presenceTitle} description={data.presenceDescription} />

      {/* Building Infrastructure for a Better Tomorrow (Company Profile) - Sabse Niche */}
      <AboutDocuments profileData={data?.companyProfile || (data?.resources && data.resources.find(r => (r.title || '').toLowerCase().includes('profile'))) || (data?.resources && data.resources[0])} />

      <style>{`
        .overview-section { padding: 80px 24px; }
        .stats-section { padding: 60px 24px; }
        .rich-text-content p { margin-bottom: 14px; }
        
        @media (max-width: 900px) {
          .overview-split { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .capabilities-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 768px) {
          section.pisl-overview-section {
            padding: 34px 16px 38px 16px !important;
          }
          .overview-split {
            gap: 22px !important;
          }
          .overview-title {
            font-size: clamp(22px, 6vw, 28px) !important;
            margin-bottom: 14px !important;
            letter-spacing: -0.5px !important;
          }
          .rich-text-content {
            font-size: 14px !important;
            line-height: 1.65 !important;
          }
          .rich-text-content p {
            margin-bottom: 12px !important;
          }
          .overview-slider-wrap {
            height: clamp(200px, 56vw, 250px) !important;
            border-radius: 14px !important;
          }

          /* Stats Section Mobile (2x2 Grid) */
          section.pisl-stats-section {
            padding: 34px 16px 36px 16px !important;
          }
          .pisl-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
          .pisl-stat-card {
            padding: 20px 10px 18px !important;
            border-radius: 12px !important;
            border-width: 1.5px !important;
            border-bottom-width: 3.5px !important;
            transform: none !important;
          }
          .pisl-stat-icon-wrap {
            width: 44px !important;
            height: 44px !important;
            border-radius: 10px !important;
            margin: 0 auto 10px !important;
          }
          .pisl-stat-icon {
            font-size: 20px !important;
          }
          .pisl-stat-title {
            font-size: 13px !important;
            letter-spacing: 0.5px !important;
            margin-bottom: 4px !important;
            font-weight: 800 !important;
          }
          .pisl-stat-desc {
            font-size: 11px !important;
            line-height: 1.4 !important;
            color: #64748b !important;
          }

          /* Capabilities Section Mobile */
          section.pisl-capabilities-section {
            padding: 36px 16px 40px 16px !important;
          }
          .pisl-capabilities-title {
            font-size: clamp(22px, 6vw, 28px) !important;
            margin-bottom: 22px !important;
            letter-spacing: -0.5px !important;
          }
          .pisl-capabilities-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .pisl-capability-card {
            padding: 18px 16px !important;
            border-radius: 14px !important;
          }
          .pisl-capability-card > div {
            gap: 14px !important;
          }
          .pisl-capability-icon-wrap {
            width: 46px !important;
            height: 46px !important;
            border-radius: 12px !important;
          }
          .pisl-capability-icon {
            font-size: 20px !important;
          }
          .pisl-capability-title {
            font-size: 15px !important;
            margin-bottom: 6px !important;
            font-weight: 800 !important;
          }
          .pisl-capability-desc {
            font-size: 13px !important;
            line-height: 1.55 !important;
          }

          /* Values Section Mobile (2x2 Grid) */
          section.pisl-values-section {
            padding: 36px 16px 40px 16px !important;
          }
          .pisl-values-title {
            font-size: clamp(22px, 6vw, 28px) !important;
            margin-bottom: 22px !important;
            letter-spacing: -0.5px !important;
          }
          .pisl-values-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
          .pisl-value-card {
            padding: 22px 10px 18px !important;
            border-radius: 12px !important;
            border-width: 1.5px !important;
            border-bottom-width: 3.5px !important;
            transform: none !important;
          }
          .pisl-value-icon-wrap {
            width: 48px !important;
            height: 48px !important;
            border-radius: 12px !important;
            margin: 0 auto 10px !important;
          }
          .pisl-value-icon {
            font-size: 22px !important;
          }
          .pisl-value-title {
            font-size: 13.5px !important;
            letter-spacing: 1px !important;
            margin-bottom: 4px !important;
            font-weight: 800 !important;
          }
          .pisl-value-desc {
            font-size: 11px !important;
            line-height: 1.4 !important;
            color: #64748b !important;
          }
        }

        @media (max-width: 500px) {
          .overview-section { padding: 40px 16px !important; }
          .stats-section { padding: 32px 16px !important; }
          .pisl-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .pisl-values-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 360px) {
          section.pisl-overview-section {
            padding: 28px 14px 32px 14px !important;
          }
          .overview-slider-wrap {
            height: 185px !important;
          }
          .pisl-stats-grid {
            gap: 8px !important;
          }
          .pisl-stat-card {
            padding: 16px 6px 14px !important;
          }
          .pisl-stat-title {
            font-size: 12px !important;
          }
          .pisl-stat-desc {
            font-size: 10.5px !important;
          }
          .pisl-capability-card {
            padding: 14px 12px !important;
          }
          .pisl-capability-icon-wrap {
            width: 40px !important;
            height: 40px !important;
          }
          .pisl-capability-icon {
            font-size: 18px !important;
          }
          .pisl-capability-title {
            font-size: 14px !important;
          }
          .pisl-capability-desc {
            font-size: 12.5px !important;
          }
          .pisl-values-grid {
            gap: 8px !important;
          }
          .pisl-value-card {
            padding: 16px 6px 14px !important;
          }
          .pisl-value-title {
            font-size: 12px !important;
          }
          .pisl-value-desc {
            font-size: 10.5px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Overview;
