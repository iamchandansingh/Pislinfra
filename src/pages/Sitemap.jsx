import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiChevronRight } from 'react-icons/hi';
import PageHero from '../components/hero/PageHero';

/* ─── CORPORATE BRAND COLORS ─────────────────────────────────────────────── */
const NAVY = '#28296F';
const ORANGE = '#ff904e';

const Sitemap = () => {
  const sitemapData = [
    {
      title: 'Home',
      link: '/',
      children: []
    },
    {
      title: 'About Us',
      link: '/about',
      children: [
        { title: 'Overview / Profile', link: '/about' },
        { title: 'Leadership', link: '/about/leadership' },
        { title: 'EHS', link: '/about/ehs' },
        { title: 'Awards & Certification', link: '/about/awards' },
        { title: 'CSR', link: '/about/csr' },
      ]
    },
    {
      title: 'Projects',
      link: '/projects',
      children: [
        { title: 'Ongoing Projects', link: '/projects/ongoing' },
        { title: 'Completed Projects', link: '/projects/completed' },
        { title: 'Case Study', link: '/projects/case-study' },
      ]
    },
    {
      title: 'Services',
      link: '/services',
      children: [
        { title: 'Industrial Development', link: '/services/industrial' },
        { title: 'Infrastructure Development', link: '/services/infrastructure' },
        { title: 'Logistic Park Development', link: '/services/logistic' },
        { title: 'Warehouse Contractors', link: '/services/warehouse' },
      ]
    },
    {
      title: 'Blog',
      link: '/blog',
      children: []
    },
    {
      title: 'Careers',
      link: '/careers',
      children: []
    },
    {
      title: 'Annual Reports',
      link: '/annual-reports',
      children: []
    },
    {
      title: 'Contact Us',
      link: '/contact-us',
      children: []
    },
  ];

  return (
    <div style={{ background: '#ffffff', fontFamily: '"Inter", "Helvetica Neue", sans-serif' }}>
      {/* Hero Component */}
      <PageHero 
        title="Sitemap" 
        subtitle="Find all pages of our website"
        breadcrumb="Sitemap"
        bgImage="/images/hero/Sitemap.png"
      />

      {/* Sitemap Content Section */}
      <section style={{ padding: '100px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* Structural Premium Card Matrix */}
          <div 
            className="pisl-sitemap-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '32px' 
            }}
          >
            {sitemapData.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(40, 41, 111, 0.05)', borderColor: 'rgba(255, 144, 78, 0.25)' }}
                style={{
                  padding: '36px 32px',
                  backgroundColor: '#ffffff',
                  borderRadius: '24px', // Premium rounded architectural styling
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                }}
              >
                {/* Main Branch Link Header */}
                <Link 
                  to={item.link} 
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: NAVY,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginBottom: item.children.length > 0 ? '20px' : '0',
                    transition: 'color 0.2s ease',
                    letterSpacing: '-0.3px',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = ORANGE}
                  onMouseLeave={(e) => e.currentTarget.style.color = NAVY}
                >
                  {item.title}
                  {item.children.length === 0 && <HiChevronRight style={{ fontSize: '14px', marginTop: '2px', opacity: 0.5 }} />}
                </Link>

                {/* Sub-node Links Iteration */}
                {item.children.length > 0 && (
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '4px',
                    borderLeft: '1.5px solid #e2e8f0', // Elegant hierarchical structural indent
                    paddingLeft: '12px'
                  }}>
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex}>
                        <Link 
                          to={child.link} 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#64748b',
                            fontSize: '14px',
                            fontWeight: 500,
                            textDecoration: 'none',
                            padding: '6px 0',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = ORANGE;
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#64748b';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <HiChevronRight style={{ fontSize: '12px', color: ORANGE, flexShrink: 0 }} />
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sitemap;