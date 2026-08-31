import React, { useState, useEffect } from 'react';
import { fetchStrapiData } from '../../services/strapi';
import { Link } from 'react-router-dom';
import { FaLinkedinIn } from 'react-icons/fa';
import { HiPhone, HiMail, HiLocationMarker, HiClock } from 'react-icons/hi';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const Footer = () => {

  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const loadFooter = async () => {
      const data = await fetchStrapiData('footer?populate[0]=logo&populate[1]=companyLinks&populate[2]=resourceLinks&populate[3]=solutionLinks');
      if (data) {
        setFooterData(data);
      }
    };
    loadFooter();
  }, []);

  const companyLinks = footerData?.companyLinks || [
    { label: 'Profile', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Our Solutions', href: '/solutions' },
    { label: 'Blog', href: '/blog' },
  ];

  const resourceLinks = footerData?.resourceLinks || [
    { label: 'Careers', href: '/careers' },
    { label: 'Annual Reports', href: '/annual-reports' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Sitemap', href: '/sitemap' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ];

  const solutionLinks = footerData?.solutionLinks || [
    { label: 'Industrial Build', href: '/solutions/industrial' },
    { label: 'Infrastructure Development', href: '/solutions/infrastructure' },
    { label: 'Logistic Parks', href: '/solutions/logistic' },
    { label: 'Warehouse Contractors', href: '/solutions/warehouse' },
  ];

  return (
    <footer style={{ backgroundColor: NAVY, color: '#ffffff', borderTop: '4px solid #ff904e' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 24px 48px' }}>
        
        <div 
          className="pisl-main-footer-grid"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.3fr 0.8fr 0.8fr 1fr 1.2fr', 
            gap: '40px' 
          }}
        >
          
          {/* COLUMN 1: BRAND */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ height: '125px', marginBottom: '1px', display: 'flex', alignItems: 'center' }}>
              <img 
                src={footerData?.logo?.url ? (footerData.logo.url.startsWith("/") ? `${import.meta.env.VITE_STRAPI_URL || "http://127.0.0.1:1337"}${footerData.logo.url}` : footerData.logo.url) : "/White Logo.png"} 
                alt="PISL INFRA Logo" 
                style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            
            <p style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.65', marginBottom: '24px', textAlign: 'left', fontWeight: 500 }}>
              {footerData?.description || "Leading infrastructure development company delivering world-class industrial, logistics, and warehouse solutions across India."}
            </p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href={footerData?.linkedinUrl || "https://www.linkedin.com/company/pislinfra"} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
                className="pisl-footer-social-icon"
                style={{ 
                  width: '34px', 
                  height: '34px', 
                  backgroundColor: 'rgba(255,255,255,0.06)', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#e2e8f0', 
                  textDecoration: 'none', 
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
                }}
              >
                <FaLinkedinIn style={{ fontSize: '14px' }} />
              </a>
            </div>
          </div>

          {/* COLUMN 2: COMPANY */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', marginBottom: '20px', textAlign: 'left' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
              {[
                { label: 'Profile', href: '/about' },
                { label: 'Projects', href: '/projects' },
                { label: 'Our Solutions', href: '/solutions' },
                { label: 'Blog', href: '/blog' },
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <Link 
                    to={link.href} 
                    className="pisl-footer-link"
                    style={{ color: '#cbd5e1', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, transition: 'color 0.2s' }}
                  >
                    <span style={{ width: '4px', height: '4px', backgroundColor: ORANGE, borderRadius: '50%' }}></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: RESOURCES */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', marginBottom: '20px', textAlign: 'left' }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
              {[
                { label: 'Careers', href: '/careers' },
                { label: 'Annual Reports', href: '/annual-reports' },
                { label: 'Contact Us', href: '/contact-us' },
                { label: 'Sitemap', href: '/sitemap' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <Link 
                    to={link.href} 
                    className="pisl-footer-link"
                    style={{ color: '#cbd5e1', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, transition: 'color 0.2s' }}
                  >
                    <span style={{ width: '4px', height: '4px', backgroundColor: ORANGE, borderRadius: '50%' }}></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: SOLUTIONS */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', marginBottom: '20px', textAlign: 'left' }}>
              Our Solutions
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
              {[
                { label: 'Industrial Build', href: '/solutions/industrial' },
                { label: 'Infrastructure Development', href: '/solutions/infrastructure' },
                { label: 'Logistic Parks', href: '/solutions/logistic' },
                { label: 'Warehouse Contractors', href: '/solutions/warehouse' },
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <Link 
                    to={link.href} 
                    className="pisl-footer-link"
                    style={{ color: '#cbd5e1', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, transition: 'color 0.2s' }}
                  >
                    <span style={{ width: '4px', height: '4px', backgroundColor: ORANGE, borderRadius: '50%' }}></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 5: CONTACT */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', marginBottom: '20px', textAlign: 'left' }}>
              Contact Hub
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
              <li style={{ marginBottom: '14px' }}>
                <a href={`tel:${footerData?.phone || "085270 40411"}`} className="pisl-footer-link" style={{ color: '#cbd5e1', fontSize: '13.5px', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '12px', fontWeight: 500, transition: 'color 0.2s' }}>
                  <HiPhone style={{ color: ORANGE, fontSize: '18px', flexShrink: 0, marginTop: '2px' }} />
                  <span>{footerData?.phone || "085270 40411"}</span>
                </a>
              </li>
              <li style={{ marginBottom: '14px' }}>
                <a href={`mailto:${footerData?.email || "info@pislinfra.com"}`} className="pisl-footer-link" style={{ color: '#cbd5e1', fontSize: '13.5px', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '12px', fontWeight: 500, transition: 'color 0.2s' }}>
                  <HiMail style={{ color: ORANGE, fontSize: '18px', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ wordBreak: 'break-all' }}>{footerData?.email || "info@pislinfra.com"}</span>
                </a>
              </li>
              <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <HiLocationMarker style={{ color: ORANGE, fontSize: '18px', flexShrink: 0, marginTop: '2px' }} />
                <a href={footerData?.mapUrl || "https://maps.app.goo.gl/yrFiVHJsAwLp461c9"} target="_blank" rel="noopener noreferrer" className="pisl-footer-link" style={{ color: '#cbd5e1', fontSize: '13.5px', textDecoration: 'none', fontWeight: 500, lineHeight: '1.5', transition: 'color 0.2s' }}>
                  {footerData?.address || "31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122018"}
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#cbd5e1', fontSize: '13.5px', fontWeight: 500, lineHeight: '1.5' }}>
                <HiClock style={{ color: ORANGE, fontSize: '18px', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ whiteSpace: 'pre-line' }}>{footerData?.businessHours || "Mon - Sat: 9:00 AM - 6:00 PM\nSunday: Closed"}</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(15, 23, 42, 0.15)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: 0, fontWeight: 500 }}>
            &copy; {new Date().getFullYear()} {footerData?.copyrightText || "PISL INFRA. All rights reserved."}
          </p>
        </div>
      </div>

      <style>{`
        .pisl-footer-social-icon:hover {
          background-color: ${ORANGE} !important;
          color: #ffffff !important;
          transform: translateY(-2px);
        }
        .pisl-footer-link:hover {
          color: ${ORANGE} !important;
        }
        @media (max-width: 1200px) {
          .pisl-main-footer-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 900px) {
          .pisl-main-footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 28px !important;
          }
        }
        @media (max-width: 600px) {
          .pisl-main-footer-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;