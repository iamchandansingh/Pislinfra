import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiChevronRight } from 'react-icons/hi';
import PageHero from '../components/hero/PageHero';
import BlogSEO from '../components/Blog/BlogSEO';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const Sitemap = () => {
  const seoData = {
    contentType: 'page',
    title: 'Sitemap',
    seoTitle: 'Sitemap - All Pages | Pislinfra',
    seoDescription: 'Find all pages of Pislinfra website. Complete sitemap with links to About, Projects, Services, Blog, Careers & Contact pages.',
    seoKeywords: 'sitemap, website pages, Pislinfra pages, site navigation, all pages',
    slug: 'sitemap',
    canonicalUrl: 'https://pislinfra.com/sitemap',
    ogTitle: 'Sitemap - Pislinfra Website Navigation',
    ogDescription: 'Complete sitemap of Pislinfra - industrial infrastructure company.',
    ogImage: 'https://pislinfra.com/images/hero/Sitemap.png',
    ogType: 'website',
    twitterTitle: 'Sitemap | Pislinfra',
    twitterDescription: 'Find all pages of our website.',
    twitterImage: 'https://pislinfra.com/images/hero/Sitemap.png',
    twitterCardType: 'summary',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Sitemap', 'Navigation', 'Pages'],
  };

  const sitemapData = [
    { title: 'Home', link: '/', children: [] },
    { title: 'About Us', link: '/about', children: [
      { title: 'Overview / Profile', link: '/about' },
      { title: 'Leadership', link: '/about/leadership' },
      { title: 'EHS', link: '/about/ehs' },
      { title: 'Awards & Certification', link: '/about/awards' },
      { title: 'CSR', link: '/about/csr' },
    ]},
    { title: 'Projects', link: '/projects', children: [
      { title: 'Ongoing Projects', link: '/projects/ongoing' },
      { title: 'Completed Projects', link: '/projects/completed' },
      { title: 'Case Study', link: '/projects/case-study' },
    ]},
    { title: 'Our Solutions', link: '/solutions', children: [
      { title: 'Industrial Development', link: '/solutions/industrial' },
      { title: 'Infrastructure Development', link: '/solutions/infrastructure' },
      { title: 'Logistic Park Development', link: '/solutions/logistic' },
      { title: 'Warehouse Contractors', link: '/solutions/warehouse' },
    ]},
    { title: 'Blog', link: '/blog', children: [] },
    { title: 'Careers', link: '/careers', children: [] },
    { title: 'Annual Reports', link: '/annual-reports', children: [] },
    { title: 'Contact Us', link: '/contact-us', children: [] },
  ];

  return (
    <div style={{ background: '#ffffff', fontFamily: '"Inter", "Helvetica Neue", sans-serif' }}>
      
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title="Sitemap" 
        subtitle="Find all pages of our website"
        breadcrumb="Sitemap"
        bgImage="/images/hero/Sitemap.png"
      />

      <section style={{ padding: '100px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div className="pisl-sitemap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {sitemapData.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(40, 41, 111, 0.05)', borderColor: 'rgba(255, 144, 78, 0.25)' }}
                style={{ padding: '36px 32px', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease' }}
              >
                <Link to={item.link} style={{ fontSize: '18px', fontWeight: 800, color: NAVY, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: item.children.length > 0 ? '20px' : '0', transition: 'color 0.2s ease', letterSpacing: '-0.3px' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = ORANGE}
                  onMouseLeave={(e) => e.currentTarget.style.color = NAVY}
                >
                  {item.title}
                  {item.children.length === 0 && <HiChevronRight style={{ fontSize: '14px', marginTop: '2px', opacity: 0.5 }} />}
                </Link>

                {item.children.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: '1.5px solid #e2e8f0', paddingLeft: '12px' }}>
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex}>
                        <Link to={child.link} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', fontWeight: 500, textDecoration: 'none', padding: '6px 0', transition: 'all 0.2s ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = ORANGE; e.currentTarget.style.transform = 'translateX(4px)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
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