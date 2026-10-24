import React, { useState, useEffect } from 'react';
import { fetchStrapiData, STRAPI_URL } from '../../services/strapi';
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

  const defaultResourceLinks = [
    { label: 'Careers', href: '/careers' },
    { label: 'Annual Reports', href: '/annual-reports' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Sitemap', href: '/sitemap' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Company Policy', href: '/company-policy' },
  ];

  const resourceLinks = (() => {
    const links = footerData?.resourceLinks ? [...footerData.resourceLinks] : defaultResourceLinks;
    const hasCompanyPolicy = links.some(l => l.href === '/company-policy' || l.href === '/about/company-policy');
    if (!hasCompanyPolicy) {
      const privacyIdx = links.findIndex(l => l.href === '/privacy-policy');
      if (privacyIdx !== -1) {
        links.splice(privacyIdx + 1, 0, { label: 'Company Policy', href: '/company-policy' });
      } else {
        links.push({ label: 'Company Policy', href: '/company-policy' });
      }
    }
    return links;
  })();

  const solutionLinks = footerData?.solutionLinks || [
    { label: 'Industrial Build', href: '/solutions/industrial' },
    { label: 'Infrastructure Development', href: '/solutions/infrastructure' },
    { label: 'Logistic Parks', href: '/solutions/logistic' },
    { label: 'Warehouse Contractors', href: '/solutions/warehouse' },
  ];

  const logoUrl = footerData?.logo?.url 
    ? (footerData.logo.url.startsWith('http') ? footerData.logo.url : (STRAPI_URL ? `${STRAPI_URL}${footerData.logo.url}` : "/White Logo.png"))
    : "/White Logo.png";

  return (
    <footer style={{ backgroundColor: '#0B132B', color: '#ffffff', fontFamily: 'inherit', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      
      {/* Top Banner Accent */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${ORANGE} 0%, #ffaa80 50%, ${NAVY} 100%)` }}></div>

      <div className="pisl-footer-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 24px 48px' }}>
        
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
          <div className="pisl-footer-brand-col">
            <Link to="/" style={{ display: 'inline-block', marginBottom: '22px' }}>
              <img 
                src={logoUrl} 
                alt="Pislinfra" 
                className="pisl-footer-logo"
                style={{ height: '80px', width: 'auto', objectFit: 'contain', display: 'block' }} 
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
          <div className="pisl-footer-col pisl-footer-company-col">
            <h4 className="pisl-footer-heading" style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', marginBottom: '20px', textAlign: 'left' }}>
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
          <div className="pisl-footer-col pisl-footer-resources-col">
            <h4 className="pisl-footer-heading" style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', marginBottom: '20px', textAlign: 'left' }}>
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
          <div className="pisl-footer-col pisl-footer-solutions-col">
            <h4 className="pisl-footer-heading" style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', marginBottom: '20px', textAlign: 'left' }}>
              Our Solutions
            </h4>
            <ul className="pisl-footer-solutions-list" style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
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
          <div className="pisl-footer-col pisl-footer-contact-col">
            <h4 className="pisl-footer-heading" style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', marginBottom: '20px', textAlign: 'left' }}>
              Contact Us
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
        <div className="pisl-footer-bottom" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <p className="pisl-footer-copyright" style={{ color: '#94a3b8', fontSize: '13.5px', margin: 0, fontWeight: 500 }}>
            &copy; {new Date().getFullYear()} {footerData?.copyrightText ? footerData.copyrightText.replace(/PISL\s+INFRA\./gi, 'Pislinfra.').replace(/PISL\s+INFRA/gi, 'Pislinfra').replace(/PISL\s+Infra/gi, 'Pislinfra') : "Pislinfra. All rights reserved."}
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
        @media (max-width: 640px) {
          .pisl-footer-container {
            padding: 38px 16px 28px 16px !important;
          }
          .pisl-main-footer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 26px 16px !important;
          }
          .pisl-footer-brand-col {
            grid-column: 1 / -1 !important;
            margin-bottom: 2px !important;
          }
          .pisl-footer-logo {
            height: 56px !important;
            margin-bottom: 14px !important;
          }
          .pisl-footer-brand-col p {
            max-width: 100% !important;
            font-size: 13px !important;
            line-height: 1.55 !important;
            margin-bottom: 16px !important;
          }
          .pisl-footer-company-col {
            grid-column: 1 !important;
          }
          .pisl-footer-resources-col {
            grid-column: 2 !important;
          }
          .pisl-footer-solutions-col {
            grid-column: 1 / -1 !important;
          }
          .pisl-footer-solutions-list {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px 14px !important;
          }
          .pisl-footer-solutions-list li {
            margin-bottom: 0 !important;
          }
          .pisl-footer-contact-col {
            grid-column: 1 / -1 !important;
            padding-top: 18px !important;
            border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
          }
          .pisl-footer-heading {
            font-size: 14px !important;
            margin-bottom: 14px !important;
          }
          .pisl-footer-link {
            font-size: 13px !important;
          }
          .pisl-footer-bottom {
            padding: 16px 16px !important;
            text-align: center !important;
            justify-content: center !important;
          }
          .pisl-footer-copyright {
            font-size: 12px !important;
            text-align: center !important;
            width: 100% !important;
          }
        }

        @media (max-width: 360px) {
          .pisl-main-footer-grid {
            grid-template-columns: 1fr !important;
            gap: 22px !important;
          }
          .pisl-footer-company-col,
          .pisl-footer-resources-col,
          .pisl-footer-solutions-col,
          .pisl-footer-contact-col,
          .pisl-footer-brand-col {
            grid-column: auto !important;
          }
          .pisl-footer-solutions-list {
            display: block !important;
          }
          .pisl-footer-solutions-list li {
            margin-bottom: 10px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;