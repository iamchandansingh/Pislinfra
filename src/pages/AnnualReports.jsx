import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchStrapiData, getLocalDataSync } from '../services/strapi';
import PageHero from '../components/hero/PageHero';
import BlogSEO from '../components/Blog/BlogSEO';
import { FaDownload, FaFilePdf, FaCalendar } from 'react-icons/fa';
import Preloader from '../components/common/Preloader';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const fallbackData = {
  title: 'Annual Reports',
  subtitle: 'Transparency, compliance, and our journey of sustained infrastructure growth.',
  breadcrumb: 'Annual Reports',
  headerTitle: 'Download Our Reports',
  headerDescription: 'Explore Pislinfra annual reports, company information and key business updates covering multiple financial years.',
  reports: [
    {
      id: 1,
      title: 'Annual Return FY 2024-25',
      year: '2024-2025',
      desc: 'Comprehensive annual return filing with complete financial disclosures and company performance metrics.',
      size: 'PDF',
      fileUrl: '/reports/Annual-Return_2024-25.pdf'
    },
    {
      id: 2,
      title: 'Annual Report FY 2023-24',
      year: '2023-2024',
      desc: 'Detailed analysis of infrastructure projects completed and new strategic initiatives undertaken during the year.',
      size: 'PDF',
      fileUrl: '/reports/Annual-Reports-2023-2024.pdf'
    },
    {
      id: 3,
      title: 'Annual Return FY 2022-23',
      year: '2022-2023',
      desc: 'Performance summary and strategic roadmap highlighting key milestones and future expansion plans.',
      size: 'PDF',
      fileUrl: '/reports/Annual-Return-2022-23.pdf'
    },
    {
      id: 4,
      title: 'Annual Return FY 2021-22',
      year: '2021-2022',
      desc: 'Milestones achieved, capacity building efforts, and operational highlights across India.',
      size: 'PDF',
      fileUrl: '/reports/Annual-Return-2021-22.pdf'
    },
    {
      id: 5,
      title: 'Annual Return FY 2020-21',
      year: '2020-2021',
      desc: 'Financial year performance review with comprehensive company returns and compliance documentation.',
      size: 'PDF',
      fileUrl: '/reports/Pragati-Infra-Solutions-Private-Limited_Annual-Return_2020-21-1.pdf'
    },
    {
      id: 6,
      title: 'Annual Return FY 2019-20',
      year: '2019-2020',
      desc: 'Annual return filing for the financial year with complete statutory disclosures and company data.',
      size: 'PDF',
      fileUrl: '/reports/Pragati-Infra-Solutions-Private-Limited_Annual-Return_2019-2020.pdf'
    }
  ]
};

const AnnualReports = () => {
  const [data, setData] = useState(() => getLocalDataSync('annual-report-page') || fallbackData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    let isMounted = true;

    const loadData = async () => {
      try {
        const response = await fetchStrapiData('annual-report-page?populate[0]=heroImage&populate[1]=seo&populate[2]=reports&populate[3]=reports.pdfFile');
        if (response && isMounted) {
          setData(response);
        }
      } catch (error) {
        console.error('Error fetching annual reports:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  const getImageUrl = (imgObj, defaultImg) => {
    if (!imgObj || (!imgObj.url && !imgObj.data?.attributes?.url)) return defaultImg;
    const url = imgObj.url || imgObj.data?.attributes?.url;
    if (url.startsWith('/')) return `${import.meta.env.VITE_STRAPI_URL || ""}${url}`;
    return url;
  };

  const getFileUrl = (fileUrl, pdfFileObj) => {
    if (fileUrl && fileUrl.startsWith('/reports/')) return fileUrl;
    const url = pdfFileObj?.url || pdfFileObj?.data?.attributes?.url;
    if (url) {
      if (url.startsWith('/')) return `${import.meta.env.VITE_STRAPI_URL || ""}${url}`;
      return url;
    }
    return fileUrl || '#';
  };

  const handleDownload = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading && !data) return <Preloader />;
  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Reports not found.</div>;

  const currentData = data || fallbackData;

  const seoData = {
    ...currentData.seo,
    contentType: 'page',
    ogImage: getImageUrl(currentData.seo?.ogImage || currentData.heroImage, 'https://pislinfra.com/images/hero/Annual-Reports.png')
  };

  const reports = (currentData.reports && currentData.reports.length > 0) ? currentData.reports : fallbackData.reports;

  return (
    <div className="annual-reports-wrapper" style={{ background: '#ffffff', fontFamily: '"Inter", "Helvetica Neue", sans-serif' }}>
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title={currentData.title || fallbackData.title} 
        subtitle={currentData.subtitle || fallbackData.subtitle}
        breadcrumb={currentData.breadcrumb || fallbackData.breadcrumb}
        bgImage={getImageUrl(currentData.heroImage, "/images/hero/Annual-Reports.png")}
      />

      <section className="annual-reports-section">
        <div className="annual-reports-container">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="annual-reports-header"
          >
            <h2 className="annual-reports-title">
              {currentData.headerTitle ? (
                <>
                  {currentData.headerTitle.split(' ').slice(0, -1).join(' ')} <span style={{ color: ORANGE }}>{currentData.headerTitle.split(' ').slice(-1)}</span>
                </>
              ) : (
                <>Download Our <span style={{ color: ORANGE }}>Reports</span></>
              )}
            </h2>
            {currentData.headerDescription && (
              <p className="annual-reports-desc">
                {currentData.headerDescription}
              </p>
            )}
          </motion.div>

          <div className="annual-reports-list">
            {reports.map((report, idx) => {
              const fileUrl = getFileUrl(report.fileUrl, report.pdfFile);

              return (
                <div 
                  key={report.id || idx}
                  className="pisl-report-row"
                >
                  <div className="pisl-report-content">
                    <div className="pisl-report-icon-box">
                      <FaFilePdf className="pisl-report-icon" />
                    </div>
                    <div className="pisl-report-details">
                      <h3 className="pisl-report-item-title">{report.title}</h3>
                      {report.desc && <p className="pisl-report-item-desc">{report.desc}</p>}
                      <div className="pisl-report-meta">
                        <span className="pisl-meta-year">
                          <FaCalendar style={{ opacity: 0.7, marginRight: '5px' }} /> FY {report.year}
                        </span>
                        <span className="pisl-meta-size">
                          {report.size || 'PDF'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDownload(fileUrl)}
                    className="pisl-report-download-btn"
                    aria-label={`Download ${report.title}`}
                  >
                    <FaDownload style={{ fontSize: '11px', marginRight: '6px' }} /> Download
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      <style>{`
        .annual-reports-wrapper {
          width: 100%;
          overflow-x: hidden;
        }

        .annual-reports-section {
          padding: 80px 24px;
          background-color: #f8fafc;
        }

        .annual-reports-container {
          max-width: 1100px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .annual-reports-header {
          text-align: center;
          margin-bottom: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .annual-reports-title {
          font-size: clamp(26px, 3.2vw, 38px);
          font-weight: 900;
          color: ${NAVY};
          margin: 0 0 14px 0;
          letter-spacing: -0.8px;
          line-height: 1.25;
        }

        .annual-reports-desc {
          color: #64748b;
          line-height: 1.6;
          font-size: 15px;
          max-width: 580px;
          margin: 0;
          font-weight: 500;
        }

        .annual-reports-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .pisl-report-row {
          padding: 22px 30px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          background-color: #ffffff;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
          transform: none !important;
        }

        .pisl-report-row:hover {
          border-color: rgba(255, 144, 78, 0.4) !important;
          box-shadow: 0 8px 20px rgba(40, 41, 111, 0.05) !important;
          transform: none !important;
        }

        .pisl-report-content {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1 1 auto;
          min-width: 0;
        }

        .pisl-report-icon-box {
          width: 50px;
          height: 50px;
          background-color: rgba(255, 144, 78, 0.08);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pisl-report-icon {
          font-size: 20px;
          color: ${ORANGE};
        }

        .pisl-report-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .pisl-report-item-title {
          font-size: 17px;
          font-weight: 800;
          color: ${NAVY};
          margin: 0;
          letter-spacing: -0.3px;
          line-height: 1.35;
          word-break: break-word;
        }

        .pisl-report-item-desc {
          color: #64748b;
          font-size: 13.5px;
          margin: 0;
          line-height: 1.5;
          max-width: 640px;
          font-weight: 500;
          word-break: break-word;
        }

        .pisl-report-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 4px;
          font-size: 12px;
          font-weight: 600;
          flex-wrap: wrap;
        }

        .pisl-meta-year {
          display: flex;
          align-items: center;
          color: ${NAVY};
        }

        .pisl-meta-size {
          background-color: #f1f5f9;
          padding: 2px 8px;
          border-radius: 6px;
          color: #475569;
        }

        .pisl-report-download-btn {
          padding: 12px 24px;
          background-color: ${NAVY};
          color: #ffffff;
          border: none;
          border-radius: 100px;
          font-weight: 800;
          font-size: 12.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          box-shadow: 0 4px 12px rgba(40, 41, 111, 0.1);
          flex-shrink: 0;
          transition: background-color 0.2s ease !important;
          transform: none !important;
        }

        .pisl-report-download-btn:hover {
          background-color: ${ORANGE} !important;
          transform: none !important;
        }

        /* Mobile & Tablet Phone Responsiveness */
        @media (max-width: 768px) {
          .annual-reports-section {
            padding: 36px 14px 50px !important;
          }

          .annual-reports-header {
            margin-bottom: 24px !important;
          }

          .annual-reports-title {
            font-size: 24px !important;
            margin-bottom: 8px !important;
          }

          .annual-reports-desc {
            font-size: 13.5px !important;
            line-height: 1.5 !important;
          }

          .annual-reports-list {
            gap: 12px !important;
          }

          .pisl-report-row {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 16px 14px !important;
            gap: 14px !important;
            border-radius: 12px !important;
          }

          .pisl-report-content {
            align-items: flex-start !important;
            gap: 12px !important;
          }

          .pisl-report-icon-box {
            width: 42px !important;
            height: 42px !important;
            border-radius: 10px !important;
          }

          .pisl-report-icon {
            font-size: 17px !important;
          }

          .pisl-report-item-title {
            font-size: 15.5px !important;
          }

          .pisl-report-item-desc {
            font-size: 12.5px !important;
            line-height: 1.45 !important;
          }

          .pisl-report-meta {
            gap: 10px !important;
            margin-top: 4px !important;
            font-size: 11.5px !important;
          }

          .pisl-report-download-btn {
            width: 100% !important;
            height: 44px !important;
            border-radius: 8px !important;
            font-size: 12.5px !important;
            letter-spacing: 0.5px !important;
          }
        }

        @media (max-width: 380px) {
          .annual-reports-section {
            padding: 24px 10px 40px !important;
          }

          .pisl-report-row {
            padding: 14px 12px !important;
            gap: 12px !important;
          }

          .pisl-report-content {
            gap: 10px !important;
          }

          .pisl-report-icon-box {
            width: 38px !important;
            height: 38px !important;
          }

          .pisl-report-icon {
            font-size: 16px !important;
          }

          .pisl-report-item-title {
            font-size: 14.5px !important;
          }

          .annual-reports-title {
            font-size: 21px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnnualReports;
