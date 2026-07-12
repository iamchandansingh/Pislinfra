import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import OurPresence from '../../components/sections/OurPresence';
import { FaWarehouse, FaCalendar, FaBuilding, FaUsers, FaStar, FaCogs, FaChartLine, FaHandshake, FaShieldAlt, FaUsers as FaTeam } from 'react-icons/fa';

const NAVY = '#2a2a75';
const ORANGE = '#ff8755';
const FONT = '"Helvetica Neue", Arial, sans-serif';

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
        <img key={i} src={img} alt="PISL" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: current === i ? 1 : 0, transition: 'opacity 0.8s ease' }} />
      ))}
    </div>
  );
};

const Overview = () => {

  const seoData = {
  contentType: 'page',
  title: 'Overview / Profile',
  seoTitle: 'Overview / Profile',
  seoDescription: 'PISL is India\'s leading industrial infrastructure company specializing in warehousing, logistics parks, EPC, and construction solutions.',
  seoKeywords: 'industrial infrastructure, construction company, warehousing, logistics park, industrial development, warehouse construction India, EPC contractor, industrial construction, infrastructure company, PISL Infra',
  slug: 'about',
  canonicalUrl: 'https://pislinfra.com/about',

  ogTitle: 'Overview / Profile',
  ogDescription: '17+ years of excellence, 16M+ sq. ft. delivered, and 600+ employees driving industrial infrastructure across India.',
  ogImage: 'https://pislinfra.com/images/hero/11.png',
  ogType: 'website',

  twitterTitle: 'Overview / Profile',
  twitterDescription: '17+ years of expertise in warehousing, logistics parks, EPC, and industrial construction across India.',
  twitterImage: 'https://pislinfra.com/images/hero/11.png',
  twitterCardType: 'summary_large_image',

  schemaType: 'AboutPage',
  breadcrumbSchema: true,
  organizationSchema: true,

  tags: [
    'PISL Infra',
    'Company Profile',
    'Industrial Infrastructure',
    'Construction',
    'Warehousing',
    'Logistics Parks',
    'EPC',
    'Industrial Development'
  ],
};

  const capabilities = [
    { icon: FaStar, title: 'Best Grade-A Industrial & Warehousing Infrastructure', desc: 'We offer the best spaces for our BTS (Built-To-Suit) clients which ensures efficiency & quality in each aspect including the Design & Construction of the project.' },
    { icon: FaCogs, title: 'Integrating New Technologies', desc: 'We are integrating Information Technology for creating useful tools to streamline our procurement processes and overall construction schedule management.' },
    { icon: FaChartLine, title: 'Streamlined Execution', desc: 'Execution is a core feature that is ensured in all the services we offer, which gives you the peace of mind that your investment is being utilized.' },
    { icon: FaHandshake, title: 'Financial Outlook', desc: 'The Warehousing Industry in India is growing at a fast pace with great financial returns. PISL also follows a safe yet profitable financial outlook.' },
  ];

  const values = [
    { icon: FaShieldAlt, title: 'TRUST', desc: 'Building lasting relationships through transparency and reliability' },
    { icon: FaCogs, title: 'EFFICIENCY', desc: 'Optimized project delivery with streamlined processes' },
    { icon: FaStar, title: 'INTEGRITY', desc: 'Ethical business practices and strong moral principles' },
    { icon: FaTeam, title: 'TEAMWORK', desc: 'Collaborative excellence across every project' },
  ];

  return (
    <div style={{ fontFamily: FONT }}>
      <BlogSEO blog={seoData} />
      
      <PageHero title="Overview / Profile" subtitle="Learn about our company history and mission" breadcrumb="About Us" bgImage="/images/hero/11.png" />
      
      <section id="expertise" className="overview-section" style={{ backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 0.75fr', gap: '56px', alignItems: 'center' }} className="overview-split">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: NAVY, marginBottom: '24px' }}>
              OVER<span style={{ color: ORANGE }}>VIEW</span>
            </h2>
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
              We at PISL are recognised as India's leading construction company, providing services to well-reputed clientele in various sectors.
            </p>
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
              PISL is the product of passion, hard work, and integrity. To us, excellence is a habit, and we always strive to do our best. We are an organisation with a strong ethical compass and a spectacular track record of excellence in the industry. Over the past 17+ years, our proven expertise has led us to build multiple projects covering millions of square meters in the construction industry.
            </p>
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
              We are present across various sectors like copper smelting, food processing, radial wires, automobile, heavy engineering, MSME, chemical, and other sectors.
            </p>
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8' }}>
              With a strong background in engineering and construction, we know how to make ideas and plans become real things. We are in the relentless pursuit of value creation, skill-building, and strengthening the infrastructural fabric of the nation with our passion and commitment.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <AutoSlidingImages />
          </motion.div>
        </div>
      </section>

      <section className="stats-section" style={{ backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="stats-grid">
            {[
              { icon: FaWarehouse, title: 'WAREHOUSE', desc: 'One of the prominent leaders in bts warehouse & industrial solutions across India' },
              { icon: FaCalendar, title: 'ESTABLISHED', desc: 'Established in 2009' },
              { icon: FaBuilding, title: 'PORTFOLIO', desc: 'Portfolio of over 16+ Million sq. ft.' },
              { icon: FaUsers, title: 'EMPLOYEE', desc: '600+ Employee Strength' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                style={{ textAlign: 'center', padding: '36px 20px 32px', backgroundColor: '#fff5f0', borderRadius: '16px', border: '2px solid #ffd5c2', borderBottom: `4px solid ${ORANGE}`, transition: 'all 0.3s ease', cursor: 'default' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <item.icon style={{ color: 'white', fontSize: '28px' }} />
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: NAVY, marginBottom: '6px', letterSpacing: '1px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', lineHeight: 1.5 }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="overview-section" style={{ backgroundColor: NAVY }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '48px', textAlign: 'center' }}>
            OUR <span style={{ color: ORANGE }}>CAPABILITIES</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }} className="capabilities-grid">
            {capabilities.map((cap, i) => (
              <div key={i} style={{ padding: '40px', backgroundColor: 'white', borderRadius: '16px', borderLeft: `4px solid ${ORANGE}`, borderBottom: `4px solid ${NAVY}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#fff5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <cap.icon style={{ color: ORANGE, fontSize: '26px' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: NAVY, marginBottom: '12px', lineHeight: '1.4' }}>{cap.title}</h3>
                    <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>{cap.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overview-section" style={{ backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: NAVY, marginBottom: '48px', textAlign: 'center' }}>
            OUR <span style={{ color: ORANGE }}>VALUES</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="values-grid">
            {values.map((val, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                style={{ textAlign: 'center', padding: '40px 24px 36px', backgroundColor: 'white', borderRadius: '16px', border: '2px solid #e5e7eb', borderBottom: `4px solid ${ORANGE}`, transition: 'all 0.3s ease', cursor: 'default' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '18px', backgroundColor: '#fff5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <val.icon style={{ color: ORANGE, fontSize: '32px' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: NAVY, letterSpacing: '2px', marginBottom: '8px' }}>{val.title}</h3>
                <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', lineHeight: 1.5, margin: 0 }}>{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <OurPresence />

      <style>{`
        .overview-section { padding: 80px 24px; }
        .stats-section { padding: 60px 24px; }
        
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