import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ArrowRight, 
  Eye 
} from 'lucide-react';
import { fetchStrapiData, getStrapiMediaUrl } from '../../services/strapi';

const DEFAULT_HSE_PDF = 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/HSE_POLICY_PISL_e35061d871.pdf';
const LOCAL_HSE_PDF = '/reports/Annual-Reports-2023-2024.pdf';
const DEFAULT_HSE_COVER = '/images/hero/safety-Hero-image.png';
const LOCAL_HSE_FALLBACK = '/images/EHS/Site-Safety-Inspection.png';

const SafetyResources = ({ resources, title, subtitle, desc }) => {
  const [docFileUrl, setDocFileUrl] = useState(DEFAULT_HSE_PDF);
  const [docCoverUrl, setDocCoverUrl] = useState(DEFAULT_HSE_COVER);
  const [docTitle, setDocTitle] = useState('HSE Policy');
  const [docDesc, setDocDesc] = useState('Official Health, Safety & Environment policies, operational guidelines and zero-harm standards. Access our comprehensive workplace safety framework and protocols.');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (downloading) return;
    setDownloading(true);

    try {
      // 1. Try fetching target PDF file as a blob to force native browser download
      const targetUrl = docFileUrl || '/reports/HSE_POLICY_PISL.pdf';
      const response = await fetch(targetUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Download network error');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = 'HSE_POLICY_PISL.pdf';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 300);
    } catch (err) {
      console.warn('Direct blob download failed, falling back to local file:', err);
      // Fallback: Trigger download via local same-origin copy
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = '/reports/HSE_POLICY_PISL.pdf';
      a.download = 'HSE_POLICY_PISL.pdf';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 300);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  useEffect(() => {
    const applyItem = (item) => {
      if (!item) return;
      if (item.title) setDocTitle(item.title);
      if (item.desc) setDocDesc(item.desc);
      if (item.file || item.fileUrl) {
        const u = getStrapiMediaUrl(item.file || item.fileUrl);
        if (u) setDocFileUrl(u);
      }
      if (item.coverImage) {
        const c = getStrapiMediaUrl(item.coverImage);
        if (c) setDocCoverUrl(c);
      }
    };

    // 1. Check passed resources prop
    const hseItem = (resources || []).find(r => {
      const t = (r.title || '').toLowerCase();
      return t.includes('hse') || t.includes('policy') || t.includes('safety');
    }) || (resources && resources.length > 0 ? resources[0] : null);

    if (hseItem) applyItem(hseItem);

    // 2. Fetch directly from Strapi CMS for live real-time updates
    fetchStrapiData('ehs-page?populate[0]=resources&populate[1]=resources.file&populate[2]=resources.coverImage')
      .then(data => {
        const items = data?.resources || data?.data?.attributes?.resources || [];
        const liveItem = items.find(r => {
          const t = (r.title || '').toLowerCase();
          return t.includes('hse') || t.includes('policy') || t.includes('safety');
        });
        if (liveItem) applyItem(liveItem);
      })
      .catch(() => {});

    // 3. Check localStorage for updated strapi cache
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.includes('ehs-page')) {
            const raw = window.localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              const item = parsed?.resources?.find(r => {
                const t = (r.title || '').toLowerCase();
                return t.includes('hse') || t.includes('policy') || t.includes('safety');
              });
              if (item) applyItem(item);
            }
          }
        }
      } catch (e) {}
    }
  }, [resources]);

  return (
    <section className="ehs-safety-section" style={{
      padding: '40px 24px 70px',
      backgroundColor: '#ffffff',
      fontFamily: '"Inter", sans-serif'
    }}>
      <div style={{ maxWidth: '1350px', margin: '0 auto' }}>
        
        {/* Main Banner Card */}
        <div className="hse-card">
          
          {/* Left Content Area */}
          <div className="hse-content">
            
            {/* Headline */}
            <h3 className="hse-headline">
              Environment, Health & Safety <br />
              <span className="hse-highlight">{docTitle}</span>
            </h3>

            {/* Subtitle / Description */}
            <p className="hse-description">
              {docDesc}
            </p>

            {/* Call To Action Buttons */}
            <div className="hse-actions">
              <a 
                href={docFileUrl}
                download="HSE_POLICY_PISL.pdf"
                onClick={handleDownload}
                className="hse-download-btn"
                title="Download HSE Policy (PDF)"
              >
                <div className="hse-btn-body">
                  <FileText size={18} strokeWidth={2.2} />
                  <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
                </div>
                <div className="hse-btn-arrow">
                  <ArrowRight size={18} strokeWidth={2.4} />
                </div>
              </a>

              <a 
                href={docFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hse-view-btn"
                title="View PDF in Browser"
              >
                <Eye size={16} />
                <span>View PDF</span>
              </a>
            </div>

          </div>

          {/* Right Visual Image */}
          <div className="hse-visual">
            <img 
              src={docCoverUrl} 
              alt="HSE Policy & Safety Standards" 
              loading="lazy"
              onError={(e) => {
                if (e.currentTarget.src !== LOCAL_HSE_FALLBACK && !e.currentTarget.src.endsWith(LOCAL_HSE_FALLBACK)) {
                  e.currentTarget.src = LOCAL_HSE_FALLBACK;
                }
              }}
              className="hse-image"
            />
          </div>

        </div>

      </div>

      <style>{`
        .hse-card {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: none !important;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.15fr 0.95fr;
          align-items: stretch;
          position: relative;
        }

        .hse-content {
          padding: 34px 32px 30px 38px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 2;
        }

        .hse-headline {
          font-size: clamp(26px, 2.8vw, 36px);
          font-weight: 800;
          color: #0c2356;
          line-height: 1.18;
          letter-spacing: -0.5px;
          margin: 0 0 14px;
        }

        .hse-highlight {
          color: #ff733b;
        }

        .hse-description {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 28px;
          max-width: 520px;
        }

        .hse-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hse-download-btn {
          display: inline-flex;
          align-items: stretch;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: none !important;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .hse-download-btn:hover {
          transform: translateY(-2px);
          box-shadow: none !important;
        }

        .hse-btn-body {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 20px;
          background-color: #0b2865;
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: -0.2px;
          transition: background-color 0.2s ease;
        }

        .hse-download-btn:hover .hse-btn-body {
          background-color: #071c49;
        }

        .hse-btn-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          background-color: #ff733b;
          color: #ffffff;
          transition: background-color 0.2s ease;
        }

        .hse-download-btn:hover .hse-btn-arrow {
          background-color: #ff8755;
        }

        .hse-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          border-radius: 8px;
          border: 1.5px solid #0b2865;
          background-color: #ffffff;
          color: #0b2865;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .hse-view-btn:hover {
          background-color: #0b2865;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .hse-visual {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          overflow: hidden;
        }

        .hse-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        @media (max-width: 1080px) {
          .hse-card {
            grid-template-columns: 1fr;
          }
          .hse-content {
            padding: 30px 24px;
          }
          .hse-visual {
            width: 100%;
            height: auto;
            aspect-ratio: 16 / 9;
            min-height: auto;
          }
        }

        @media (max-width: 640px) {
          .ehs-safety-section {
            padding: 24px 14px 44px;
          }
          .hse-card {
            border-radius: 10px;
          }
          .hse-content {
            padding: 22px 16px;
          }
          .hse-headline {
            font-size: 24px;
          }
          .hse-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .hse-download-btn,
          .hse-view-btn {
            width: 100%;
            justify-content: center;
          }
          .hse-btn-body {
            justify-content: center;
            flex: 1;
          }
          .hse-visual {
            aspect-ratio: 16 / 9;
          }
        }
      `}</style>
    </section>
  );
};

export default SafetyResources;