import React, { useState, useEffect } from 'react';
import { fetchStrapiData, getLocalDataSync } from '../services/strapi';
import ReactMarkdown from 'react-markdown';
import PageHero from '../components/hero/PageHero';
import BlogSEO from '../components/Blog/BlogSEO';
import Preloader from '../components/common/Preloader';

const fallbackPolicyData = {
  title: 'Privacy Policy',
  heroSubtitle: 'Learn how we collect, use, and protect your data.',
  breadcrumb: 'Privacy Policy',
  lastUpdated: '2024-03-15',
  sections: [
    {
      title: 'Introduction',
      icon: 'overview',
      content: 'Welcome to Pragati Infra Solutions Private Limited ("Pislinfra", "we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or interact with our services.'
    },
    {
      title: 'Information We Collect',
      icon: 'file',
      content: 'We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our services, when you participate in activities on the Website, or when you contact us.\n\n*   **Personal Data:** Name, email address, phone number, and job title when submitted through contact or career forms.\n*   **Usage Data:** Information automatically collected by our servers, such as your IP address, browser type, operating system, and pages viewed.'
    },
    {
      title: 'How We Use Your Information',
      icon: 'users',
      content: 'We use personal information collected via our Website for a variety of business purposes, including to respond to user inquiries, provide customer support, deliver requested project and service updates, process job applications, and comply with legal, regulatory, and audit obligations.'
    },
    {
      title: 'Sharing Your Information',
      icon: 'share',
      content: 'We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell or rent your personal information to third parties for marketing purposes.'
    },
    {
      title: 'Data Security',
      icon: 'lock',
      content: 'We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.'
    },
    {
      title: 'Cookies and Tracking',
      icon: 'cookie',
      content: 'We may use cookies and similar tracking technologies to access or store information. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.'
    },
    {
      title: 'Contact Us',
      icon: 'mail',
      content: 'If you have questions or comments about this Privacy Policy, you may contact us at:\n\n**Company Address**\n31 P, adj. to Medanta, Medicity,\nIslampur Colony, Sector 38\nGurugram, Haryana 122018\n\n**Contact Details**\nPhone: 085270 40411\nEmail: info@pislinfra.com'
    }
  ]
};

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
  const [data, setData] = useState(() => getLocalDataSync('policy-page') || fallbackPolicyData);
  const [loading, setLoading] = useState(false);

  const getImageUrl = (imgObj, defaultImg) => {
    if (!imgObj || (!imgObj.url && !imgObj.data?.attributes?.url)) return defaultImg;
    const url = imgObj.url || imgObj.data?.attributes?.url;
    if (url.startsWith('/')) return `${import.meta.env.VITE_STRAPI_URL || ""}${url}`;
    return url;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    let isMounted = true;

    const loadData = async () => {
      try {
        const response = await fetchStrapiData('policy-page?populate[0]=heroImage&populate[1]=seo&populate[2]=sections');
        if (response && isMounted) {
          setData(response);
        }
      } catch (error) {
        console.error('Error fetching policy page:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  if (loading && !data) return <Preloader />;

  const currentData = data || fallbackPolicyData;

  const navItems = (currentData.sections && currentData.sections.length > 0)
    ? currentData.sections.map((section, index) => ({
        id: index + 1,
        title: section.title,
        icon: section.icon || 'file'
      }))
    : fallbackPolicyData.sections.map((section, index) => ({
        id: index + 1,
        title: section.title,
        icon: section.icon || 'file'
      }));

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const sectionsList = (currentData.sections && currentData.sections.length > 0)
    ? currentData.sections
    : fallbackPolicyData.sections;

  return (
    <div className="policy-page-wrapper">
      {currentData.seo && <BlogSEO blog={currentData.seo} />}
      
      <PageHero
        title={currentData.title || "Privacy Policy"}
        subtitle={currentData.heroSubtitle || "Learn how we collect, use, and protect your data."}
        breadcrumb={currentData.breadcrumb || "Privacy Policy"}
        bgImage={getImageUrl(currentData.heroImage, "/images/hero/Extra-2.png")}
      />

      <div className="policy-main-container">
        
        {/* Mobile Horizontal Section Jump Bar */}
        <div className="policy-mobile-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`policy-mobile-pill ${activeTab === item.id ? 'active' : ''}`}
            >
              <Icon name={item.icon} style={{ width: '14px', height: '14px' }} />
              <span>{item.id}. {item.title}</span>
            </button>
          ))}
        </div>

        <div className="policy-layout-grid">
          
          {/* Desktop Sticky Sidebar */}
          <aside className="policy-sidebar">
            <div className="policy-sidebar-card">
              <div className="sidebar-header-label">TABLE OF CONTENTS</div>
              <ul className="sidebar-nav-list">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`sidebar-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                    >
                      <span className="sidebar-btn-icon">
                        <Icon name={item.icon} />
                      </span>
                      <span className="sidebar-btn-text">{item.id}. {item.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Policy Document Content Area */}
          <main className="policy-content-area">
            <div className="policy-content-card">
              
              <div className="policy-card-header">
                <h1 className="policy-doc-title">
                  {currentData.title || "Privacy Policy"}
                </h1>
                <span className="policy-updated-badge">
                  Last updated: {currentData.lastUpdated ? new Date(currentData.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'March 15, 2024'}
                </span>
              </div>

              <div className="policy-sections-wrapper">
                {sectionsList.map((section, index) => (
                  <section 
                    key={index} 
                    id={`section-${index + 1}`} 
                    className="policy-section-block"
                  >
                    <div className="policy-section-header">
                      <div className="policy-section-icon-wrap">
                        <Icon name={section.icon || 'file'} />
                      </div>
                      <h2 className="policy-section-heading">
                        {index + 1}. {section.title}
                      </h2>
                    </div>

                    <div className="rich-text-content">
                      <ReactMarkdown>{section.content || ''}</ReactMarkdown>
                    </div>
                  </section>
                ))}
              </div>

            </div>
          </main>

        </div>
      </div>

      <style>{`
        .policy-page-wrapper {
          background-color: #f8fafc;
          min-height: 100vh;
          padding-bottom: 70px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          width: 100%;
          overflow-x: hidden;
        }

        .policy-main-container {
          width: 95%;
          max-width: 1240px;
          margin: 30px auto 0;
          padding: 0 16px;
          box-sizing: border-box;
        }

        /* Mobile Quick Jump Pills */
        .policy-mobile-nav {
          display: none;
          gap: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 8px;
          margin-bottom: 18px;
          scrollbar-width: none;
        }

        .policy-mobile-nav::-webkit-scrollbar {
          display: none;
        }

        .policy-mobile-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
          color: #475569;
          font-size: 12.5px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          flex-shrink: 0;
          transition: background-color 0.2s, color 0.2s, border-color 0.2s !important;
          transform: none !important;
        }

        .policy-mobile-pill.active {
          background-color: #1E2A5A;
          color: #ffffff;
          border-color: #1E2A5A;
        }

        .policy-mobile-pill.active svg {
          color: #FF6B35;
        }

        /* Layout Grid */
        .policy-layout-grid {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        @media (min-width: 992px) {
          .policy-layout-grid {
            flex-direction: row;
            align-items: flex-start;
          }
        }

        /* Desktop Sidebar */
        .policy-sidebar {
          display: none;
          width: 290px;
          flex-shrink: 0;
        }

        @media (min-width: 992px) {
          .policy-sidebar {
            display: block;
          }
        }

        .policy-sidebar-card {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 22px 18px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
          position: sticky;
          top: 100px;
        }

        .sidebar-header-label {
          font-size: 11.5px;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.8px;
          margin-bottom: 12px;
          padding: 0 10px;
        }

        .sidebar-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-nav-btn {
          width: 100%;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 600;
          background-color: transparent;
          color: #475569;
          transition: background-color 0.2s, color 0.2s !important;
          transform: none !important;
        }

        .sidebar-nav-btn:hover {
          background-color: #f1f5f9;
          color: #1E2A5A;
        }

        .sidebar-nav-btn.active {
          background-color: #f0f2fb;
          color: #FF6B35;
          font-weight: 700;
        }

        .sidebar-btn-icon {
          color: #94a3b8;
          display: flex;
          flex-shrink: 0;
        }

        .sidebar-nav-btn.active .sidebar-btn-icon {
          color: #FF6B35;
        }

        .sidebar-btn-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Content Area */
        .policy-content-area {
          flex: 1;
          min-width: 0;
        }

        .policy-content-card {
          background-color: #ffffff;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          padding: 36px 40px;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);
          box-sizing: border-box;
        }

        .policy-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 18px;
          border-bottom: 1px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 12px;
        }

        .policy-doc-title {
          font-size: clamp(24px, 3.5vw, 32px);
          font-weight: 900;
          color: #1E2A5A;
          margin: 0;
          letter-spacing: -0.5px;
          line-height: 1.25;
        }

        .policy-updated-badge {
          font-size: 13px;
          color: #64748B;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 6px 14px;
          border-radius: 999px;
          font-weight: 600;
          white-space: nowrap;
        }

        /* Sections */
        .policy-sections-wrapper {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .policy-section-block {
          padding-bottom: 28px;
          border-bottom: 1px solid #f1f5f9;
        }

        .policy-section-block:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .policy-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .policy-section-icon-wrap {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background-color: rgba(40, 41, 111, 0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #28296F;
        }

        .policy-section-heading {
          font-size: 19px;
          font-weight: 800;
          color: #1E2A5A;
          margin: 0;
          letter-spacing: -0.3px;
          line-height: 1.35;
        }

        /* Rich Text / Markdown Styling */
        .rich-text-content {
          color: #475569;
          font-size: 14.5px;
          line-height: 1.7;
          word-break: break-word;
        }

        .rich-text-content p {
          margin: 0 0 12px 0;
        }

        .rich-text-content p:last-child {
          margin-bottom: 0;
        }

        .rich-text-content ul, .rich-text-content ol {
          padding-left: 22px;
          margin: 8px 0 14px 0;
        }

        .rich-text-content li {
          margin-bottom: 6px;
          line-height: 1.6;
        }

        .rich-text-content strong {
          color: #1E2A5A;
          font-weight: 700;
        }

        .rich-text-content a {
          color: #FF6B35;
          text-decoration: underline;
          font-weight: 600;
        }

        /* Mobile Responsiveness */
        @media (max-width: 991px) {
          .policy-mobile-nav {
            display: flex;
          }
        }

        @media (max-width: 768px) {
          .policy-main-container {
            margin-top: 18px;
            padding: 0 12px;
          }

          .policy-content-card {
            padding: 22px 16px !important;
            border-radius: 14px !important;
          }

          .policy-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 20px;
            padding-bottom: 12px;
          }

          .policy-doc-title {
            font-size: 22px !important;
          }

          .policy-updated-badge {
            font-size: 12px !important;
            padding: 4px 10px !important;
          }

          .policy-sections-wrapper {
            gap: 26px !important;
          }

          .policy-section-block {
            padding-bottom: 20px !important;
          }

          .policy-section-header {
            gap: 10px !important;
            margin-bottom: 10px !important;
          }

          .policy-section-icon-wrap {
            width: 34px !important;
            height: 34px !important;
            border-radius: 8px !important;
          }

          .policy-section-icon-wrap svg {
            width: 17px !important;
            height: 17px !important;
          }

          .policy-section-heading {
            font-size: 16.5px !important;
          }

          .rich-text-content {
            font-size: 13.5px !important;
            line-height: 1.6 !important;
          }

          .rich-text-content ul, .rich-text-content ol {
            padding-left: 18px !important;
          }
        }

        @media (max-width: 380px) {
          .policy-main-container {
            padding: 0 8px;
          }

          .policy-content-card {
            padding: 16px 12px !important;
          }

          .policy-doc-title {
            font-size: 20px !important;
          }

          .policy-section-heading {
            font-size: 15.5px !important;
          }

          .rich-text-content {
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
