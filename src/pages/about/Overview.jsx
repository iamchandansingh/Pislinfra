import Preloader from '../../components/common/Preloader';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../../services/wordpress';
import { getImageUrl } from '../../utils/imageUrl.js';
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

const AutoSlidingImages = ({ galleryImages = [] }) => {
  const defaultImages = [
    '/images/Overview/11.png',
    '/images/Overview/8.png',
    '/images/Overview/4.png',
    '/images/Overview/3.png',
    '/images/Overview/13.png',
    '/images/Overview/21.png',
  ];
  const resolvedGallery = Array.isArray(galleryImages)
    ? galleryImages.map((img, i) => getImageUrl(img, defaultImages[i % defaultImages.length])).filter(Boolean)
    : [];
  const images = resolvedGallery.length > 0 ? resolvedGallery : defaultImages;
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % images.length), 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div 
      className="overview-slider-wrap" 
      style={{ 
        borderRadius: '12px', 
        border: `2px solid ${NAVY}`,
        overflow: 'hidden', 
        boxShadow: '0 14px 36px rgba(40,40,110,0.12)', 
        height: '340px', 
        position: 'relative' 
      }}
    >
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
            onClick={() => setCurrent(i)}
            style={{ 
              width: current === i ? '18px' : '6px', 
              height: '6px', 
              borderRadius: '3px', 
              backgroundColor: current === i ? ORANGE : 'rgba(255,255,255,0.7)', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease' 
            }} 
          />
        ))}
      </div>
    </div>
  );
};

const DEFAULT_ABOUT_SECTIONS = ['hero', 'overview', 'stats', 'capabilities', 'values', 'presence', 'companyProfile'];

const Overview = () => {
  const [data, setData] = useState(() => (getPreviewContext()?.type === 'about-page' ? null : getLocalDataSync('about-page')));
  const [ongoingProjects, setOngoingProjects] = useState(null);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [response, projRes] = await Promise.all([
          fetchWpData('about-page?populate[0]=heroImage&populate[1]=seo&populate[2]=stats&populate[3]=capabilities&populate[4]=values&populate[5]=companyProfile.file&populate[6]=companyProfile.coverImage&populate[7]=resources.file&populate[8]=resources.coverImage'),
          fetchWpData('ongoing-projects?pagination[limit]=100').catch(() => null),
        ]);
        if (response) {
          setData(response);
        }
        const projList = Array.isArray(projRes) ? projRes : (Array.isArray(projRes?.data) ? projRes.data : null);
        if (projList) {
          setOngoingProjects(projList);
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

  if (loading && !data) return <Preloader />;
  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Data not found.</div>;

  const fallbackTitle = "About Pislinfra - India's Premier Industrial & Warehouse EPC Contractor";
  const fallbackDescription = "Pragati Infra Solutions Pvt. Ltd. (Pislinfra) is a leading industrial infrastructure and EPC company with 16M+ sq. ft delivered across India. Specializing in warehouses, logistics parks, and PEB engineering.";

  // Connect CMS About page SEO fields (WordPress seo object takes priority over fallback defaults)
  const wpSeo = data?.seo && typeof data.seo === 'object' ? data.seo : {};
  const resolvedTitle = (wpSeo.seoTitle || wpSeo.metaTitle || data?.metaTitle || fallbackTitle).trim();
  const resolvedDescription = (wpSeo.seoDescription || wpSeo.metaDescription || data?.metaDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (data?.primaryKeyword || wpSeo.primaryKeyword || wpSeo.focusKeyword || '').trim();
  const resolvedFocusKeywords = (data?.focusKeywords || wpSeo.focusKeywords || wpSeo.secondaryKeywords || '').trim();
  const rawSchemaType = String(wpSeo.schemaType || '').trim();
  const resolvedSchemaType = rawSchemaType && !rawSchemaType.includes('+') ? rawSchemaType : 'AboutPage';

  const seoData = {
    contentType: 'page',
    slug: 'about',
    canonicalUrl: wpSeo.canonicalUrl || 'https://pislinfra.com/about',
    ogType: wpSeo.ogType || 'website',
    twitterCardType: wpSeo.twitterCardType || 'summary_large_image',
    breadcrumbSchema: wpSeo.breadcrumbSchema !== undefined ? Boolean(wpSeo.breadcrumbSchema) : true,
    organizationSchema: wpSeo.organizationSchema !== undefined ? Boolean(wpSeo.organizationSchema) : true,
    noIndex: Boolean(wpSeo.noIndex),
    noFollow: Boolean(wpSeo.noFollow),
    schemaType: resolvedSchemaType,
    seoKeywords: wpSeo.seoKeywords || resolvedFocusKeywords || 'about Pislinfra, industrial construction company India, Pragati Infra Solutions, turnkey EPC contractor, warehouse builder India, industrial infrastructure profile',
    tags: wpSeo.tags || ['About Us', 'Pislinfra', 'Industrial EPC', 'Company Overview', 'Infrastructure Leader India'],
    ...wpSeo,
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    ogTitle: wpSeo.ogTitle || data?.ogTitle || resolvedTitle,
    ogDescription: wpSeo.ogDescription || data?.ogDescription || resolvedDescription,
    ogImage: getImageUrl(wpSeo.ogImage || data?.heroImage, 'https://pislinfra.com/images/hero/11.png'),
    twitterTitle: wpSeo.twitterTitle || data?.twitterTitle || resolvedTitle,
    twitterDescription: wpSeo.twitterDescription || data?.twitterDescription || resolvedDescription,
    twitterImage: getImageUrl(wpSeo.twitterImage || wpSeo.ogImage || data?.heroImage, 'https://pislinfra.com/images/hero/11.png'),
  };

  const overviewTitle = data?.overviewTitle ? data.overviewTitle.toUpperCase() : 'OVERVIEW';

  const capabilitiesTitleSplit = (data?.capabilitiesTitle || 'OUR CAPABILITIES').trim().split(/\s+/);
  const c1 = capabilitiesTitleSplit.length > 1 ? capabilitiesTitleSplit.slice(0, -1).join(' ') : 'OUR';
  const c2 = capabilitiesTitleSplit.length > 1 ? capabilitiesTitleSplit.slice(-1)[0] : (capabilitiesTitleSplit[0] || 'CAPABILITIES');

  const valuesTitleSplit = (data?.valuesTitle || 'OUR VALUES').trim().split(/\s+/);
  const v1 = valuesTitleSplit.length > 1 ? valuesTitleSplit.slice(0, -1).join(' ') : 'OUR';
  const v2 = valuesTitleSplit.length > 1 ? valuesTitleSplit.slice(-1)[0] : (valuesTitleSplit[0] || 'VALUES');

  const parsedOrder = typeof data?.sectionOrder === 'string' && data.sectionOrder.trim()
    ? data.sectionOrder.split(',').map((s) => s.trim()).filter((k) => DEFAULT_ABOUT_SECTIONS.includes(k))
    : [];
  const sectionOrder = parsedOrder.length > 0
    ? [...parsedOrder, ...DEFAULT_ABOUT_SECTIONS.filter((k) => !parsedOrder.includes(k))]
    : DEFAULT_ABOUT_SECTIONS;

  const isVisible = (key) => {
    const map = {
      hero: data?.showHero !== false,
      overview: data?.showOverview !== false,
      stats: data?.showStats !== false,
      capabilities: data?.showCapabilities !== false,
      values: data?.showValues !== false,
      presence: data?.showPresence !== false,
      companyProfile: data?.showCompanyProfile !== false,
    };
    return map[key] !== false;
  };

  const sectionElements = {
    hero: (
      <PageHero 
        key="hero"
        title={data.title} 
        subtitle={data.subtitle}
        breadcrumb={data.breadcrumb || 'About Us'}
        bgImage={getImageUrl(data.heroImage, "/images/hero/11.png")}
      />
    ),
    overview: (
      <section key="overview" id="expertise" className="overview-section pisl-overview-section" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
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
            <AutoSlidingImages galleryImages={data?.overviewGallery} />
          </motion.div>
        </div>
      </section>
    ),
    stats: (
      <section key="stats" className="stats-section pisl-stats-section" style={{ backgroundColor: '#f9fafb', overflow: 'hidden' }}>
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
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    border: '2px solid #edf2f7', 
                    boxShadow: 'none',
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
                      backgroundColor: NAVY, 
                      boxShadow: 'none',
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
    ),
    capabilities: (
      <section key="capabilities" className="overview-section pisl-capabilities-section" style={{ backgroundColor: NAVY, overflow: 'hidden' }}>
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
                    boxShadow: 'none'
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
    ),
    values: (
      <section key="values" className="overview-section pisl-values-section" style={{ backgroundColor: '#f9fafb', overflow: 'hidden', padding: '70px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          <h2 className="pisl-values-title" style={{ fontSize: '36px', fontWeight: 'bold', color: NAVY, marginBottom: '48px', textAlign: 'center' }}>
            {v1} <span style={{ color: '#0a2a66' }}>{v2}</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }} className="values-grid pisl-values-grid">
            {(data.values || []).map((val, i) => {
              const IconComp = getIcon(val.iconName);
              return (
                <div 
                  key={i} 
                  className="pisl-value-card"
                  style={{ 
                    textAlign: 'left', 
                    padding: '34px 28px', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    border: '2px solid #edf2f7', 
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    height: '100%',
                    boxShadow: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', width: '100%' }}>
                    <div 
                      className="pisl-value-icon-wrap"
                      style={{ 
                        position: 'relative',
                        width: '54px', 
                        height: '54px', 
                        borderRadius: '50%', 
                        backgroundColor: '#eff6ff', 
                        border: '2px solid #28296F',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        flexShrink: 0,
                        boxShadow: 'none'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: '-6px',
                          borderRadius: '50%',
                          border: '2px dashed rgba(40, 41, 111, 0.45)',
                          animation: 'pislCircleSpin 10s linear infinite',
                          pointerEvents: 'none'
                        }}
                      />
                      <IconComp className="pisl-value-icon" style={{ color: NAVY, fontSize: '22px' }} />
                    </div>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: '800',
                      color: '#cbd5e1',
                      letterSpacing: '1px',
                      fontFamily: 'monospace'
                    }}>
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="pisl-value-title" style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', letterSpacing: '0.5px', marginBottom: '10px', lineHeight: '1.4' }}>
                    {val.title}
                  </h3>
                  <p className="pisl-value-desc" style={{ fontSize: '13.5px', color: '#64748b', fontWeight: '400', lineHeight: '1.7', margin: 0 }}>
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),
    presence: (
      <OurPresence
        key="presence"
        title={data.presenceTitle}
        description={data.presenceDescription}
        projects={ongoingProjects}
      />
    ),
    companyProfile: (
      <AboutDocuments
        key="companyProfile"
        profileData={data?.companyProfile || (data?.resources && data.resources.find(r => (r.title || '').toLowerCase().includes('profile'))) || (data?.resources && data.resources[0])}
        profileStats={data?.companyProfileStats}
        downloadLabel={data?.companyProfileDownloadLabel}
        viewLabel={data?.companyProfileViewLabel}
      />
    ),
  };

  return (
    <div style={{ background: '#ffffff', fontFamily: '"Inter", "Helvetica Neue", sans-serif' }}>
      <BlogSEO blog={seoData} />
      {sectionOrder.map((key) => (isVisible(key) ? sectionElements[key] : null))}

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
            border-radius: 10px !important;
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
            border-bottom-width: 1.5px !important;
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
            border-bottom-width: 1.5px !important;
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

        @keyframes pislCircleSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pislCirclePulse {
          0% { box-shadow: 0 0 0 0 rgba(40, 41, 111, 0.45); }
          70% { box-shadow: 0 0 0 10px rgba(40, 41, 111, 0); }
          100% { box-shadow: 0 0 0 0 rgba(40, 41, 111, 0); }
        }
      `}</style>
    </div>
  );
};

export default Overview;
