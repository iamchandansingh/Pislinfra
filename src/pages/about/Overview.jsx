import Preloader from '../../components/common/Preloader';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchStrapiData } from '../../services/strapi';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import OurPresence from '../../components/sections/OurPresence';
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
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(40,40,110,0.1)', height: '340px', position: 'relative' }}>
      {images.map((img, i) => (
        <img key={i} src={img} alt="Pislinfra" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: current === i ? 1 : 0, transition: 'opacity 0.8s ease' }} />
      ))}
    </div>
  );
};

const Overview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchStrapiData('about-page?populate[0]=heroImage&populate[1]=seo&populate[2]=stats&populate[3]=capabilities&populate[4]=values');
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

  const overviewTitleSplit = data.overviewTitle ? data.overviewTitle.split(' ') : ['OVER', 'VIEW'];
  const p1 = overviewTitleSplit[0] || 'OVER';
  const p2 = overviewTitleSplit.slice(1).join(' ') || 'VIEW';

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

      <section id="expertise" className="overview-section" style={{ backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 0.75fr', gap: '56px', alignItems: 'center' }} className="overview-split">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: NAVY, marginBottom: '24px' }}>
              {p1.toUpperCase()}<span style={{ color: ORANGE }}>{p2.toUpperCase()}</span>
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

      <section className="stats-section" style={{ backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="stats-grid">
            {(data.stats || []).map((item, i) => {
              const IconComp = getIcon(item.iconName);
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  style={{ textAlign: 'center', padding: '36px 20px 32px', backgroundColor: '#fff5f0', borderRadius: '16px', border: '2px solid #ffd5c2', borderBottom: `4px solid ${ORANGE}`, transition: 'all 0.3s ease', cursor: 'default' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <IconComp style={{ color: 'white', fontSize: '28px' }} />
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: NAVY, marginBottom: '6px', letterSpacing: '1px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', lineHeight: 1.5 }}>{item.description}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overview-section" style={{ backgroundColor: NAVY }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '48px', textAlign: 'center' }}>
            {c1} <span style={{ color: ORANGE }}>{c2}</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }} className="capabilities-grid">
            {(data.capabilities || []).map((cap, i) => {
              const IconComp = getIcon(cap.iconName);
              return (
                <div key={i} style={{ padding: '40px', backgroundColor: 'white', borderRadius: '16px', borderLeft: `4px solid ${ORANGE}`, borderBottom: `4px solid ${NAVY}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#fff5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComp style={{ color: ORANGE, fontSize: '26px' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: NAVY, marginBottom: '12px', lineHeight: '1.4' }}>{cap.title}</h3>
                      <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>{cap.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overview-section" style={{ backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: NAVY, marginBottom: '48px', textAlign: 'center' }}>
            {v1} <span style={{ color: ORANGE }}>{v2}</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="values-grid">
            {(data.values || []).map((val, i) => {
              const IconComp = getIcon(val.iconName);
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  style={{ textAlign: 'center', padding: '40px 24px 36px', backgroundColor: 'white', borderRadius: '16px', border: '2px solid #e5e7eb', borderBottom: `4px solid ${ORANGE}`, transition: 'all 0.3s ease', cursor: 'default' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '18px', backgroundColor: '#fff5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <IconComp style={{ color: ORANGE, fontSize: '32px' }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: NAVY, letterSpacing: '2px', marginBottom: '8px' }}>{val.title}</h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', lineHeight: 1.5, margin: 0 }}>{val.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <OurPresence title={data.presenceTitle} description={data.presenceDescription} />

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
        @media (max-width: 500px) {
          .stats-grid, .values-grid { grid-template-columns: 1fr !important; }
          .overview-section { padding: 40px 16px !important; }
          .stats-section { padding: 32px 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default Overview;
