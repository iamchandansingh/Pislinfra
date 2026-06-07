import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/hero/PageHero';
import { FaDownload, FaFilePdf, FaCalendar } from 'react-icons/fa';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const AnnualReports = () => {
  const reports = [
    {
      id: 1,
      year: '2024-2025',
      title: 'Annual Return FY 2024-25',
      desc: 'Comprehensive annual return filing with complete financial disclosures and company performance metrics.',
      size: 'PDF',
      file: '/reports/Annual-Return_2024-25.pdf',
    },
    {
      id: 2,
      year: '2023-2024',
      title: 'Annual Report FY 2023-24',
      desc: 'Detailed analysis of infrastructure projects completed and new strategic initiatives undertaken during the year.',
      size: 'PDF',
      file: '/reports/Annual-Reports-2023-2024.pdf',
    },
    {
      id: 3,
      year: '2022-2023',
      title: 'Annual Return FY 2022-23',
      desc: 'Performance summary and strategic roadmap highlighting key milestones and future expansion plans.',
      size: 'PDF',
      file: '/reports/Annual-Return-2022-23.pdf',
    },
    {
      id: 4,
      year: '2021-2022',
      title: 'Annual Return FY 2021-22',
      desc: 'Milestones achieved, capacity building efforts, and operational highlights across India.',
      size: 'PDF',
      file: '/reports/Annual-Return-2021-22.pdf',
    },
    {
      id: 5,
      year: '2020-2021',
      title: 'Annual Return FY 2020-21',
      desc: 'Financial year performance review with comprehensive company returns and compliance documentation.',
      size: 'PDF',
      file: '/reports/Pragati-Infra-Solutions-Private-Limited_Annual-Return_2020-21-1.pdf',
    },
    {
      id: 6,
      year: '2019-2020',
      title: 'Annual Return FY 2019-20',
      desc: 'Annual return filing for the financial year with complete statutory disclosures and company data.',
      size: 'PDF',
      file: '/reports/Pragati-Infra-Solutions-Private-Limited_Annual-Return_2019-2020.pdf',
    },
  ];

  const handleDownload = (file) => {
    window.open(file, '_blank');
  };

  return (
    <div style={{ background: '#ffffff', fontFamily: '"Inter", "Helvetica Neue", sans-serif' }}>
      <PageHero 
        title="Annual Reports" 
        subtitle="Financial reports and performance highlights"
        breadcrumb="Annual Reports"
        bgImage="/images/hero/Annual-Reports.png"
      />

      <section style={{ padding: '100px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ 
              textAlign: 'center', 
              marginBottom: '64px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <h2 style={{ 
              fontSize: 'clamp(28px, 3vw, 38px)', 
              fontWeight: 900, 
              color: NAVY, 
              margin: '0 0 16px 0',
              letterSpacing: '-0.8px'
            }}>
              Download Our <span style={{ color: ORANGE }}>Reports</span>
            </h2>
            <p style={{ 
              color: '#64748b', 
              lineHeight: '1.6', 
              fontSize: '15px', 
              maxWidth: '580px', 
              margin: 0,
              fontWeight: 500
            }}>
              Access our annual reports and returns for detailed insights into our financial performance, 
              project updates, and future plans nationwide.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reports.map((report, idx) => (
              <motion.div 
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, boxShadow: '0 12px 24px rgba(40, 41, 111, 0.05)', borderColor: 'rgba(255, 144, 78, 0.3)' }}
                style={{
                  padding: '24px 32px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '24px',
                  backgroundColor: '#ffffff',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                }}
                className="pisl-report-row"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: '1 1 auto' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    backgroundColor: 'rgba(255, 144, 78, 0.08)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <FaFilePdf style={{ fontSize: '20px', color: ORANGE }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: NAVY, margin: 0, letterSpacing: '-0.3px' }}>
                      {report.title}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0, lineHeight: '1.5', maxWidth: '640px', fontWeight: 500 }}>
                      {report.desc}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: NAVY }}>
                        <FaCalendar style={{ opacity: 0.7 }} /> FY {report.year}
                      </span>
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', color: '#475569' }}>
                        {report.size}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownload(report.file)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: NAVY,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '100px',
                    fontWeight: '800',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 4px 12px rgba(40, 41, 111, 0.1)',
                    transition: 'background-color 0.2s ease',
                  }}
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
          .pisl-report-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 24px !important;
            gap: 20px !important;
          }
          .pisl-report-row > button {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnnualReports;