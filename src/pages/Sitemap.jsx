import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiChevronRight } from 'react-icons/hi';
import PageHero from '../components/hero/PageHero';
import BlogSEO from '../components/Blog/BlogSEO';

import { useBlogs } from '../context/BlogContext';
import fallbackDB from '../data/Blogdb.js';

const NAVY = '#28296F';
const ORANGE = '#ff904e';

const Sitemap = () => {
  const { blogs } = useBlogs();
  const allBlogs = (blogs && blogs.length > 0) ? blogs : fallbackDB;
  const publishedBlogs = allBlogs.filter(b => b.status === 'published' && b.slug);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

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
    { title: 'Projects', link: '/projects/ongoing', children: [
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
    { title: `Blog & Articles (${publishedBlogs.length})`, link: '/blog', children: publishedBlogs.map(b => ({
      title: b.title,
      link: `/blog/${b.slug}`
    })) },
    { title: 'Careers', link: '/careers', children: [] },
    { title: 'Annual Reports', link: '/annual-reports', children: [] },
    { title: 'Contact Us', link: '/contact-us', children: [] },
  ];

  return (
    <div className="pisl-sitemap-page" style={{ background: '#ffffff', fontFamily: '"Inter", "Helvetica Neue", sans-serif' }}>
      
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title="Sitemap" 
        subtitle="Find all pages of our website"
        breadcrumb="Sitemap"
        bgImage="/images/hero/Sitemap.png"
      />

      <section className="pisl-sitemap-section">
        <div className="pisl-sitemap-container">
          
          <div className="pisl-sitemap-grid">
            {sitemapData.map((item, index) => {
              const hasChildren = item.children && item.children.length > 0;
              const isScrollable = item.children && item.children.length > 6;

              return (
                <div 
                  key={index}
                  className="pisl-sitemap-card"
                >
                  <Link 
                    to={item.link} 
                    className="pisl-sitemap-card-title"
                    style={{ marginBottom: hasChildren ? '16px' : '0' }}
                  >
                    <span>{item.title}</span>
                    {!hasChildren && <HiChevronRight className="pisl-title-arrow" />}
                  </Link>

                  {hasChildren && (
                    <ul className={`pisl-sitemap-sublinks ${isScrollable ? 'sitemap-sublinks-scroll' : ''}`}>
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link 
                            to={child.link} 
                            className="pisl-sitemap-sublink"
                          >
                            <HiChevronRight className="pisl-sublink-arrow" />
                            <span>{child.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      <style>{`
        .pisl-sitemap-page {
          width: 100%;
          overflow-x: hidden;
        }

        .pisl-sitemap-section {
          padding: 70px 24px 90px;
          background-color: #f8fafc;
        }

        .pisl-sitemap-container {
          max-width: 1240px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .pisl-sitemap-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .pisl-sitemap-card {
          padding: 28px 26px;
          background-color: #ffffff;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
          transform: none !important;
        }

        .pisl-sitemap-card:hover {
          border-color: rgba(255, 144, 78, 0.4) !important;
          box-shadow: 0 8px 24px rgba(40, 41, 111, 0.06) !important;
          transform: none !important;
        }

        .pisl-sitemap-card-title {
          font-size: 17.5px;
          font-weight: 800;
          color: ${NAVY};
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          letter-spacing: -0.3px;
          line-height: 1.35;
          transition: color 0.2s ease !important;
        }

        .pisl-sitemap-card-title:hover {
          color: ${ORANGE} !important;
        }

        .pisl-title-arrow {
          font-size: 16px;
          color: ${NAVY};
          opacity: 0.5;
          flex-shrink: 0;
          transition: color 0.2s ease, opacity 0.2s ease !important;
        }

        .pisl-sitemap-card-title:hover .pisl-title-arrow {
          color: ${ORANGE} !important;
          opacity: 1 !important;
        }

        .pisl-sitemap-sublinks {
          list-style: none;
          padding: 0 0 0 12px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
          border-left: 2px solid rgba(255, 144, 78, 0.2);
        }

        .sitemap-sublinks-scroll {
          max-height: 260px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .sitemap-sublinks-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .sitemap-sublinks-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .pisl-sitemap-sublink {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          color: #64748b;
          font-size: 13.5px;
          font-weight: 500;
          text-decoration: none;
          padding: 6px 0;
          line-height: 1.45;
          word-break: break-word;
          transition: color 0.2s ease !important;
          transform: none !important;
        }

        .pisl-sitemap-sublink:hover {
          color: ${ORANGE} !important;
          transform: none !important;
        }

        .pisl-sublink-arrow {
          font-size: 13px;
          color: ${ORANGE};
          flex-shrink: 0;
          margin-top: 3px;
        }

        /* Mobile Phone Responsiveness */
        @media (max-width: 900px) {
          .pisl-sitemap-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }

        @media (max-width: 600px) {
          .pisl-sitemap-section {
            padding: 32px 14px 48px !important;
          }

          .pisl-sitemap-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }

          .pisl-sitemap-card {
            padding: 18px 16px !important;
            border-radius: 14px !important;
          }

          .pisl-sitemap-card-title {
            font-size: 16px !important;
          }

          .pisl-sitemap-sublink {
            font-size: 13px !important;
            padding: 5px 0 !important;
          }

          .pisl-sitemap-sublinks {
            padding-left: 10px !important;
          }

          .sitemap-sublinks-scroll {
            max-height: 220px !important;
          }
        }

        @media (max-width: 380px) {
          .pisl-sitemap-section {
            padding: 24px 10px 40px !important;
          }

          .pisl-sitemap-card {
            padding: 14px 12px !important;
          }

          .pisl-sitemap-card-title {
            font-size: 15px !important;
          }

          .pisl-sitemap-sublink {
            font-size: 12.5px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Sitemap;