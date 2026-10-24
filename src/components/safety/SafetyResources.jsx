import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Eye, 
  Download, 
  ShieldCheck 
} from 'lucide-react';
import { fetchStrapiData, getStrapiMediaUrl } from '../../services/strapi';

const DEFAULT_RESOURCES_COVER = 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/pisl_EHS_100kb_82653bd4f2.jpeg';
const LOCAL_RESOURCES_FALLBACK = '/images/about/ehs-resources-cover.jpeg';

const TARGET_POLICIES = [
  {
    key: 'hse',
    title: 'HSE Policy',
    desc: 'Official Health, Safety & Environment policies, operational guidelines and zero-harm standards.',
    defaultUrl: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/HSE_POLICY_PISL_e35061d871.pdf',
    defaultFileName: 'HSE_POLICY_PISL.pdf'
  },
  {
    key: 'risk',
    title: 'Risk Management Policy',
    desc: 'Structured framework for identifying, assessing, and mitigating operational and project risks.',
    defaultUrl: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/Risk_Management_Policy_PISL_37fe051837.pdf',
    defaultFileName: 'Risk_Management_Policy_PISL.pdf'
  },
  {
    key: 'vigil',
    title: 'Vigil Mechanism Policy',
    desc: 'Whistleblower mechanism ensuring corporate transparency, ethical conduct, and accountability.',
    defaultUrl: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/Vigil_Mechanism_Policy_PISL_6c1fe65e70.pdf',
    defaultFileName: 'Vigil_Mechanism_Policy_PISL.pdf'
  },
  {
    key: 'csr',
    title: 'CSR Policy',
    desc: 'Corporate Social Responsibility commitments towards community welfare and sustainable development.',
    defaultUrl: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/CSR_Policy_PISL_2e584fd56d.pdf',
    defaultFileName: 'CSR_Policy_PISL.pdf'
  }
];

// Pure CMS data mapper: Resolves directly from CMS media records, with reliable CMS defaults
const buildPoliciesFromCMS = (cmsResources) => {
  const rawList = Array.isArray(cmsResources) ? cmsResources : [];
  // Strictly filter out PISL Profile from this section only
  const list = rawList.filter(item => {
    const t = (item?.title || '').toLowerCase();
    return !t.includes('pisl profile');
  });

  return TARGET_POLICIES.map((target) => {
    // Find matching document entry in CMS resources by title keyword
    const match = list.find((item) => {
      const t = (item.title || '').toLowerCase();
      if (target.key === 'hse') return t.includes('hse') || t.includes('health') || t.includes('safety policy');
      if (target.key === 'risk') return t.includes('risk') || t.includes('management');
      if (target.key === 'vigil') return t.includes('vigil') || t.includes('whistle');
      if (target.key === 'csr') return t.includes('csr') || t.includes('social responsibility');
      return false;
    });

    const fileObj = match ? (match.file || match.fileUrl) : null;
    const cmsUrl = fileObj ? getStrapiMediaUrl(fileObj) : null;
    const fileUrl = cmsUrl || target.defaultUrl;
    const fileName = match?.file?.name || target.defaultFileName || `${target.title}.pdf`;

    return {
      id: target.key,
      title: match?.title || target.title,
      desc: match?.desc || target.desc,
      hasPdf: Boolean(fileUrl),
      fileUrl: fileUrl,
      fileName: fileName
    };
  });
};

const SafetyResources = ({ resources, title, subtitle, desc, coverImage }) => {
  const [docCoverUrl, setDocCoverUrl] = useState(() => {
    if (coverImage) {
      const u = getStrapiMediaUrl(coverImage);
      if (u) return u;
    }
    return DEFAULT_RESOURCES_COVER;
  });
  const [downloadingId, setDownloadingId] = useState(null);
  const [policies, setPolicies] = useState(() => buildPoliciesFromCMS(resources));

  const handleDownload = async (e, policy) => {
    e.preventDefault();
    if (!policy || !policy.hasPdf || !policy.fileUrl) return;
    if (downloadingId === policy.id) return;
    setDownloadingId(policy.id);

    const targetUrl = policy.fileUrl;
    const downloadName = policy.fileName || `${policy.title}.pdf`;

    try {
      const response = await fetch(targetUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Download network error');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 300);
    } catch (err) {
      console.warn('Direct blob download failed, triggering native browser download:', err);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = targetUrl;
      a.download = downloadName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 300);
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  useEffect(() => {
    // 1. Sync from passed prop
    if (coverImage) {
      const url = getStrapiMediaUrl(coverImage);
      if (url) setDocCoverUrl(url);
    }
    if (resources && resources.length > 0) {
      setPolicies(buildPoliciesFromCMS(resources));
      const coverItem = resources.find(r => r.coverImage);
      if (coverItem?.coverImage && !coverImage) {
        const url = getStrapiMediaUrl(coverItem.coverImage);
        if (url) setDocCoverUrl(url);
      }
    }

    // 2. Fetch fresh published data from CMS API
    const syncFromCMS = async (forceFresh = false) => {
      try {
        const data = await fetchStrapiData('ehs-page', { forceFresh });
        const sectionCover = data?.resourcesCoverImage || data?.data?.attributes?.resourcesCoverImage;
        if (sectionCover) {
          const url = getStrapiMediaUrl(sectionCover);
          if (url) setDocCoverUrl(url);
        }
        const items = data?.resources || data?.data?.attributes?.resources || [];
        if (items.length > 0) {
          setPolicies(buildPoliciesFromCMS(items));
          if (!sectionCover) {
            const coverItem = items.find(r => r.coverImage);
            if (coverItem?.coverImage) {
              const url = getStrapiMediaUrl(coverItem.coverImage);
              if (url) setDocCoverUrl(url);
            }
          }
        }
      } catch (e) {}
    };

    syncFromCMS(true);

    // 3. Listen to live background revalidation events for instantaneous updates
    const handleDataUpdate = (e) => {
      const d = e.detail?.data;
      if (e.detail?.cleanEndpoint?.includes('ehs-page')) {
        const sectionCover = d?.resourcesCoverImage || d?.attributes?.resourcesCoverImage;
        if (sectionCover) {
          const url = getStrapiMediaUrl(sectionCover);
          if (url) setDocCoverUrl(url);
        }
        if (d?.resources) {
          setPolicies(buildPoliciesFromCMS(d.resources));
        }
      }
    };
    window.addEventListener('pisl-data-update', handleDataUpdate);

    return () => {
      window.removeEventListener('pisl-data-update', handleDataUpdate);
    };
  }, [resources, coverImage]);

  return (
    <section className="ehs-safety-section" style={{
      padding: '24px 20px 40px',
      backgroundColor: '#ffffff',
      fontFamily: '"Inter", sans-serif'
    }}>
      <div style={{ maxWidth: '1350px', margin: '0 auto' }}>
        
        {/* Main Card with Left Cover Image and Right Content/Policy List */}
        <div className="hse-card">
          
          {/* Left: Dedicated Cover Image for Downloadable Resources */}
          <div className="hse-visual">
            <img 
              src={docCoverUrl} 
              alt="Downloadable Resources - Corporate Policies and Documents" 
              loading="lazy"
              onError={(e) => {
                if (e.currentTarget.src !== LOCAL_RESOURCES_FALLBACK && !e.currentTarget.src.endsWith(LOCAL_RESOURCES_FALLBACK)) {
                  e.currentTarget.src = LOCAL_RESOURCES_FALLBACK;
                }
              }}
              className="hse-image"
            />
            <div className="hse-image-overlay">
              <div className="hse-image-badge">
                <ShieldCheck size={16} color="#ffffff" />
                <span>Corporate Policies &amp; Documents</span>
              </div>
            </div>
          </div>

          {/* Right: Section Heading, Description & 4 Policies List */}
          <div className="hse-content">
            
            {/* Header Area */}
            <div className="hse-header">
              <h3 className="hse-headline">
                Downloadable Resources <span className="hse-count-tag">({policies.length})</span>
              </h3>
              <p className="hse-description">
                {desc || 'Official Health, Safety & Environment policies, operational guidelines and zero-harm standards. Access our comprehensive workplace safety framework and protocols.'}
              </p>
            </div>

            {/* Exactly 4 Policies in a clean list */}
            <div className="hse-policy-list">
              {policies.map((item) => {
                const isDownloading = downloadingId === item.id;
                return (
                  <div 
                    key={item.id} 
                    className={`hse-policy-item ${item.hasPdf ? 'has-pdf' : 'no-pdf'}`}
                  >
                    <div className="hse-policy-left">
                      <div className={`hse-policy-icon ${item.hasPdf ? 'icon-active' : 'icon-muted'}`}>
                        <FileText size={16} strokeWidth={2} />
                      </div>
                      <div className="hse-policy-info">
                        <div className="hse-policy-header-row">
                          <h4 className="hse-policy-title">{item.title}</h4>
                        </div>
                        <p className="hse-policy-desc">{item.desc}</p>
                      </div>
                    </div>

                    {/* View and Download actions only for policies with actual CMS PDF files */}
                    {item.hasPdf && (
                      <div className="hse-policy-actions">
                        <a 
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hse-view-btn"
                          title={`View ${item.title} in Browser`}
                        >
                          <Eye size={13} />
                          <span>View PDF</span>
                        </a>

                        <a 
                          href={item.fileUrl}
                          download={item.fileName || 'document.pdf'}
                          onClick={(e) => handleDownload(e, item)}
                          className="hse-download-btn"
                          title={`Download ${item.title}`}
                        >
                          <div className="hse-btn-body">
                            <Download size={13} strokeWidth={2.2} />
                            <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

      <style>{`
        .hse-card {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: none !important;
          overflow: hidden;
          display: grid;
          grid-template-columns: 0.9fr 1.35fr;
          align-items: stretch;
          position: relative;
        }

        .hse-visual {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 400px;
          background-color: #0b2865;
          overflow: hidden;
        }

        .hse-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .hse-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(12, 35, 86, 0.02) 0%, rgba(12, 35, 86, 0.72) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 18px;
        }

        .hse-image-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(12, 35, 86, 0.88);
          backdrop-filter: blur(6px);
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: fit-content;
        }

        .hse-content {
          padding: 22px 26px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background-color: #ffffff;
          z-index: 2;
        }

        .hse-header {
          margin-bottom: 12px;
        }

        .hse-headline,
        .hse-headline:hover,
        .hse-headline:focus {
          font-size: clamp(20px, 2vw, 24px);
          font-weight: 800;
          color: #0c2356 !important;
          line-height: 1.2;
          letter-spacing: -0.3px;
          margin: 0 0 6px 0;
          text-decoration: none !important;
        }

        .hse-count-tag {
          font-size: clamp(16px, 1.6vw, 20px);
          color: #0c2356;
          font-weight: 700;
          opacity: 0.85;
          margin-left: 4px;
        }

        .hse-subheadline,
        .hse-subheadline:hover,
        .hse-subheadline:focus {
          color: #0c2356 !important;
          font-weight: 700;
          font-size: clamp(16px, 1.6vw, 19px);
          display: inline-block;
          margin-top: 2px;
          text-decoration: none !important;
        }

        .hse-description {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.45;
          margin: 0;
          max-width: 640px;
        }

        .hse-policy-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hse-policy-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 9px 13px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
        }

        .hse-policy-item.has-pdf {
          background-color: #f8fafc;
        }

        .hse-policy-left {
          display: flex;
          align-items: center;
          gap: 11px;
          flex: 1;
          min-width: 0;
        }

        .hse-policy-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hse-policy-icon.icon-active {
          background-color: #0b2865;
          color: #ffffff;
        }

        .hse-policy-icon.icon-muted {
          background-color: #e2e8f0;
          color: #64748b;
        }

        .hse-policy-info {
          flex: 1;
          min-width: 0;
        }

        .hse-policy-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 2px;
        }

        .hse-policy-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0c2356;
          margin: 0;
          line-height: 1.25;
        }

        .hse-badge-active {
          background: #e0f2fe;
          color: #0369a1;
          font-size: 10px;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .hse-policy-desc {
          font-size: 11.5px;
          color: #64748b;
          line-height: 1.35;
          margin: 0;
        }

        .hse-policy-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .hse-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 11px;
          border-radius: 6px;
          border: 1.5px solid #0b2865;
          background-color: #ffffff;
          color: #0b2865;
          font-size: 11.5px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .hse-view-btn:hover {
          background-color: #0b2865;
          color: #ffffff;
        }

        .hse-download-btn {
          display: inline-flex;
          align-items: center;
          border-radius: 6px;
          overflow: hidden;
          background-color: #0b2865;
          color: #ffffff;
          font-size: 11.5px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          border: none;
          white-space: nowrap;
        }

        .hse-download-btn:hover {
          background-color: #071c49;
        }

        .hse-btn-body {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 11px;
          background-color: #0b2865;
          color: #ffffff;
        }

        .hse-download-btn:hover .hse-btn-body {
          background-color: #071c49;
        }

        @media (max-width: 1080px) {
          .hse-card {
            grid-template-columns: 1fr;
          }
          .hse-visual {
            min-height: 240px;
            height: 250px;
          }
          .hse-content {
            padding: 20px 18px;
          }
        }

        @media (max-width: 680px) {
          .ehs-safety-section {
            padding: 16px 14px 32px 14px !important;
          }
          .hse-content {
            padding: 16px 14px !important;
          }
          .hse-headline {
            font-size: 19px !important;
          }
          .hse-subheadline {
            font-size: 15px !important;
          }
          .hse-br {
            display: none;
          }
          .hse-policy-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .hse-policy-actions {
            width: 100%;
            justify-content: flex-start;
          }
          .hse-view-btn, .hse-download-btn {
            flex: 1;
            justify-content: center;
            text-align: center;
          }
          .hse-btn-body {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default SafetyResources;