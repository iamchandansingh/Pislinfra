
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchStrapiData } from '../services/strapi';
import PageHero from '../components/hero/PageHero';
import BlogSEO from '../components/Blog/BlogSEO';
import { FaDownload, FaFilePdf, FaCalendar } from 'react-icons/fa';
import Preloader from '../components/common/Preloader';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const AnnualReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchStrapiData('annual-report-page?populate[0]=heroImage&populate[1]=seo&populate[2]=reports&populate[3]=reports.pdfFile');
        if (response) {
          setData(response);
        }
      } catch (error) {
        console.error('Error fetching annual reports:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getImageUrl = (imgObj, defaultImg) => {
    if (!imgObj || (!imgObj.url && !imgObj.data?.attributes?.url)) return defaultImg;
    const url = imgObj.url || imgObj.data?.attributes?.url;
    if (url.startsWith('/')) return `${import.meta.env.VITE_STRAPI_URL || "http://127.0.0.1:1337"}${url}`;
    return url;
  };

  const getFileUrl = (fileUrl, pdfFileObj) => {
    const url = pdfFileObj?.url || pdfFileObj?.data?.attributes?.url;
    if (url) {
      if (url.startsWith('/')) return `${import.meta.env.VITE_STRAPI_URL || "http://127.0.0.1:1337"}${url}`;
      return url;
    }
    return fileUrl || '#';
  };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  if (loading) return <Preloader />;
  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Reports not found.</div>;

  const seoData = {
    ...data.seo,
    contentType: 'page',
    ogImage: getImageUrl(data.seo?.ogImage || data.heroImage, 'https://pislinfra.com/images/hero/Annual-Reports.png')
  };

  const reports = data.reports || [];

  return (
    <div style={{ background: '#ffffff', fontFamily: '"Inter", "Helvetica Neue", sans-serif' }}>
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title={data.title} 
        subtitle={data.subtitle}
        breadcrumb={data.breadcrumb}
        bgImage={getImageUrl(data.heroImage, "/images/hero/Annual-Reports.png")}
      />

      <section style={{ padding: '100px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 900, color: NAVY, margin: '0 0 16px 0', letterSpacing: '-0.8px' }}>
              {data.headerTitle ? (
                <>
                  {data.headerTitle.split(' ').slice(0, -1).join(' ')} <span style={{ color: ORANGE }}>{data.headerTitle.split(' ').slice(-1)}</span>
                </>
              ) : (
                <>Download Our <span style={{ color: ORANGE }}>Reports</span></>
              )}
            </h2>
            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '15px', maxWidth: '580px', margin: 0, fontWeight: 500 }}>
              {data.headerDescription}
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reports.map((report, idx) => (
              <motion.div 
                key={report.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, boxShadow: '0 12px 24px rgba(40, 41, 111, 0.05)', borderColor: 'rgba(255, 144, 78, 0.3)' }}
                style={{ padding: '24px 32px', border: '1px solid #e2e8f0', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', backgroundColor: '#ffffff', transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease' }}
                className="pisl-report-row"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: '1 1 auto' }}>
                  <div style={{ width: '52px', height: '52px', backgroundColor: 'rgba(255, 144, 78, 0.08)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaFilePdf style={{ fontSize: '20px', color: ORANGE }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: NAVY, margin: 0, letterSpacing: '-0.3px' }}>{report.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0, lineHeight: '1.5', maxWidth: '640px', fontWeight: 500 }}>{report.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: NAVY }}><FaCalendar style={{ opacity: 0.7 }} /> FY {report.year}</span>
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', color: '#475569' }}>{report.size}</span>
                    </div>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownload(getFileUrl(report.fileUrl, report.pdfFile))}
                  style={{ padding: '12px 24px', backgroundColor: NAVY, color: '#ffffff', border: 'none', borderRadius: '100px', fontWeight: '800', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 12px rgba(40, 41, 111, 0.1)', transition: 'background-color 0.2s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = ORANGE}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = NAVY}
                >
                  <FaDownload style={{ fontSize: '11px' }} /> Download
                </motion.button>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .pisl-report-row { flex-direction: column !important; align-items: flex-start !important; padding: 24px !important; gap: 20px !important; }
          .pisl-report-row > button { width: 100% !important; justify-content: center !important; }
        }
      `}</style>
    </div>
  );
};

export default AnnualReports;
