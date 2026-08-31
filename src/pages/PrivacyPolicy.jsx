import React, { useState, useEffect } from 'react';
import { fetchStrapiData } from '../services/strapi';

import ReactMarkdown from 'react-markdown';
import PageHero from '../components/hero/PageHero';
import BlogSEO from '../components/Blog/BlogSEO';
import Preloader from '../components/common/Preloader';

const Icon = ({ name, style }) => {
  const icons = {
    overview: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    file: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />,
    lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
    cookie: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v1m0 4v.01M16 12h.01M16 16h.01M8 12h.01M8 16h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  };

  return (
    <svg style={{ width: '20px', height: '20px', ...style }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[name] || icons['file']}
    </svg>
  );
};

const PrivacyPolicy = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (imgObj, defaultImg) => {
    if (!imgObj || (!imgObj.url && !imgObj.data?.attributes?.url)) return defaultImg;
    const url = imgObj.url || imgObj.data?.attributes?.url;
    if (url.startsWith('/')) return `${import.meta.env.VITE_STRAPI_URL || "http://127.0.0.1:1337"}${url}`;
    return url;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchStrapiData('policy-page?populate[0]=heroImage&populate[1]=seo&populate[2]=sections');
        if (response) {
          setData(response);
        }
      } catch (error) {
        console.error('Error fetching policy page:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Preloader />;
  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Policy not found.</div>;

  const navItems = data.sections?.map((section, index) => ({
    id: index + 1,
    title: section.title,
    icon: section.icon || 'file'
  })) || [];

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      {data.seo && <BlogSEO seo={data.seo} />}
      
      <PageHero
        title={data.title || "Privacy Policy"}
        subtitle={data.heroSubtitle || "Learn how we collect, use, and protect your data."}
        breadcrumb={data.breadcrumb || "Privacy Policy"}
        bgImage={getImageUrl(data.heroImage, "/images/hero/Extra-2.png")}
      />

      
      <style>
        {`
          .policy-container {
            display: flex;
            flex-direction: column;
            gap: 30px;
          }
          .policy-sidebar {
            display: none;
            width: 100%;
            max-width: 300px;
            flex-shrink: 0;
          }
          .policy-content {
            flex: 1;
          }
          @media (min-width: 992px) {
            .policy-container {
              flex-direction: row;
            }
            .policy-sidebar {
              display: block;
            }
          }
        `}
      </style>

      <div style={{ width: '100%', maxWidth: '1200px', margin: '20px auto 0', padding: '0 20px', position: 'relative', zIndex: 10, boxSizing: 'border-box' }}>
        <div className="policy-container">
          
          <div className="policy-sidebar">
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', position: 'sticky', top: '100px' }}>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      style={{
                        width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                        borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px', fontWeight: 500,
                        backgroundColor: activeTab === item.id ? '#f0f2fb' : 'transparent',
                        color: activeTab === item.id ? '#FF6B35' : '#475569',
                      }}
                    >
                      <span style={{ color: activeTab === item.id ? '#FF6B35' : '#94a3b8', display: 'flex' }}>
                        <Icon name={item.icon} />
                      </span>
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '15px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
                <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: '#1E2A5A', margin: 0 }}>
                  {data.title || "Privacy Policy"}
                </h1>
                <span style={{ fontSize: '14px', color: '#64748B', backgroundColor: '#f8fafc', padding: '6px 12px', borderRadius: '999px', fontWeight: 500 }}>
                  Last updated: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'March 15, 2024'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {data.sections?.map((section, index) => (
                  <div key={index} id={`section-${index + 1}`} style={{ paddingBottom: '0px', paddingTop: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f0f2fb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#28296F' }}>
                        <Icon name={section.icon || 'file'} />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#28296F', margin: '0 0 5px 0', padding: '0' }}>{index + 1}. {section.title}</h2>
                      </div>
                    </div>
                    {/* Render Markdown or Rich Text */}
                    <div className="rich-text-content" style={{ lineHeight: '1.5', color: '#475569', marginBottom: '0px' }}>
                      <ReactMarkdown>{section.content || ''}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
