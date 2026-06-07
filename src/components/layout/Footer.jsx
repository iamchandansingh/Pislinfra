import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedinIn, FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { HiPhone, HiMail, HiLocationMarker, HiClock } from 'react-icons/hi';

/* ─── CORPORATE BRAND COLORS ─────────────────────────────────────────────── */
const NAVY = '#28296F';
const ORANGE = '#ff904e';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: NAVY, color: '#ffffff', borderTop: '4px solid #ff904e' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 24px 48px' }}>
        
        {/* Dynamic Matrix Responsive Column Grid */}
        <div 
          className="pisl-main-footer-grid"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.3fr 0.8fr 0.8fr 1fr 1.2fr', 
            gap: '40px' 
          }}
        >
          
          {/* ── COLUMN 1: CORPORATE BRAND PROFILE ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {/* Increased Logo Asset Size Wrapper */}
            <div style={{ height: '125px', marginBottom: '1px', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/White Logo.png" 
                alt="PISL INFRA Logo" 
                style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            
            <p style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.65', marginBottom: '24px', textAlign: 'left', fontWeight: 500 }}>
              Leading infrastructure development company delivering world-class industrial, logistics, and warehouse solutions across India.
            </p>
            
            {/* Social Asset Handles Row */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
                { icon: FaTwitter, href: '#', label: 'Twitter' },
                { icon: FaFacebookF, href: '#', label: 'Facebook' },
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaYoutube, href: '#', label: 'YouTube' },
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={social.label}
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
                  <social.icon style={{ fontSize: '14px' }} />
                </a>
              ))}
            </div>
          </div>

          {/* ── COLUMN 2: QUICK ACCENTS ── */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', marginBottom: '20px', textAlign: 'left' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
              {[
                { label: 'Profile', href: '/about' },
                { label: 'Projects', href: '/projects' },
                { label: 'Services', href: '/services' },
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

          {/* ── COLUMN 3: CORPORATE LINKS ── */}
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

          {/* ── COLUMN 4: DIVISION SERVICES ── */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', marginBottom: '20px', textAlign: 'left' }}>
              Our Solutions
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
              {[
                { label: 'Industrial Build', href: '/services/industrial' },
                { label: 'Infrastructure Development', href: '/services/infrastructure' },
                { label: 'Logistic Parks', href: '/services/logistic' },
                { label: 'Warehouse Contractors', href: '/services/warehouse' },
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

          {/* ── COLUMN 5: SYSTEM INFRASTRUCTURE ADDRESS BLOCK ── */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', marginBottom: '20px', textAlign: 'left' }}>
              Contact Hub
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
              <li style={{ marginBottom: '14px' }}>
                <a href="tel:+918527040411" className="pisl-footer-link" style={{ color: '#cbd5e1', fontSize: '13.5px', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '12px', fontWeight: 500, transition: 'color 0.2s' }}>
                  <HiPhone style={{ color: ORANGE, fontSize: '18px', flexShrink: 0, marginTop: '2px' }} />
                  <span>085270 40411</span>
                </a>
              </li>
              <li style={{ marginBottom: '14px' }}>
                <a href="mailto:info@pislinfra.com" className="pisl-footer-link" style={{ color: '#cbd5e1', fontSize: '13.5px', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '12px', fontWeight: 500, transition: 'color 0.2s' }}>
                  <HiMail style={{ color: ORANGE, fontSize: '18px', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ wordBreak: 'break-all' }}>info@pislinfra.com</span>
                </a>
              </li>
              <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#cbd5e1', fontSize: '13.5px', fontWeight: 500, lineHeight: '1.5' }}>
                <HiLocationMarker style={{ color: ORANGE, fontSize: '18px', flexShrink: 0, marginTop: '2px' }} />
                <span>31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122018</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#cbd5e1', fontSize: '13.5px', fontWeight: 500, lineHeight: '1.5' }}>
                <HiClock style={{ color: ORANGE, fontSize: '18px', flexShrink: 0, marginTop: '2px' }} />
                <span>Mon - Sat: 9:00 AM - 6:00 PM<br />Sunday: Closed</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Copyright Ground Bar Anchor */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(15, 23, 42, 0.15)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: 0, fontWeight: 500 }}>
            &copy; {new Date().getFullYear()} PISL INFRA. All rights reserved.
          </p>
        </div>
      </div>

      {/* Global CSS Injectors for Cross-Over Responsiveness */}
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
            gap: 40px 32px !important;
          }
        }
        @media (max-width: 768px) {
          .pisl-main-footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .pisl-main-footer-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;