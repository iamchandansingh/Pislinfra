import React, { useState, useEffect } from 'react';
import { fetchStrapiData, subscribeCmsStatus } from '../../services/strapi';
import { Link } from 'react-router-dom';
import { FaLinkedinIn } from 'react-icons/fa';
import { HiPhone, HiMail, HiLocationMarker, HiClock } from 'react-icons/hi';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeCmsStatus(setIsOffline);
    return () => unsubscribe();
  }, []);

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

  const logoUrl = footerData?.logo?.url 
    ? (footerData.logo.url.startsWith('http') ? footerData.logo.url : `http://localhost:1337${footerData.logo.url}`)
    : "/White Logo.png";

  return (
    <footer style={{ backgroundColor: '#0B132B', color: '#ffffff', fontFamily: 'inherit', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      
      {/* Top Banner Accent */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${ORANGE} 0%, #ffaa80 50%, ${NAVY} 100%)` }}></div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 24px 48px' }}>
        
        {/* MAIN 5-COLUMN GRID */}
        <div 
          className="pisl-main-footer-grid"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.4fr 0.9fr 0.9fr 1.1fr 1.3fr', 
            gap: '40px',
            alignItems: 'start'
          }}
        >
          
          {/* COLUMN 1: BRAND INFO */}
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '20px' }}>
              <img 
                src={logoUrl} 
                alt="Pislinfra" 
                style={{ height: '48px', width: 'auto', objectFit: 'contain' }} 
              />
            </Link>
            <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '24px', maxWidth: '320px', textAlign: 'left' }}>
              {footerData?.tagline || "Engineering India's industrial backbone with next-generation Grade-A warehousing, advanced PEB structures, and turnkey infrastructure projects."}
            </p>
            
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href={footerData?.linkedinUrl || "https://www.linkedin.com/company/pislinfra/"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="pisl-footer-social-icon"
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.06)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: '8px', 
                  color: '#ffffff', 
                  fontSize: '15px', 
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', marginBottom: '20px', textAlign: 'left' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
              {companyLinks.map((link, index) => (
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
              {resourceLinks.map((link, index) => (
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
              {solutionLinks.map((link, index) => (
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
            &copy; {new Date().getFullYear()} {footerData?.copyrightText ? footerData.copyrightText.replace(/PISL\s+INFRA\./gi, 'Pislinfra.').replace(/PISL\s+INFRA/gi, 'Pislinfra').replace(/PISL\s+Infra/gi, 'Pislinfra') : "Pislinfra. All rights reserved."}
          </p>

          {isOffline && (
            <span 
              style={{ 
                fontSize: '11px', 
                color: '#64748b', 
                backgroundColor: 'transparent',
                padding: '2px 4px', 
                fontWeight: 400,
                letterSpacing: '0.4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                opacity: 0.65,
                marginLeft: 'auto'
              }}
              title="CMS is currently unreachable. Content is safely served from local backup."
            >
              <span style={{ width: '4px', height: '4px', backgroundColor: '#94a3b8', borderRadius: '50%', opacity: 0.7 }}></span>
              offline mode
            </span>
          )}
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