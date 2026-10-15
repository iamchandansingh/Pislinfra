import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  TrendingUp, 
  MapPin, 
  FileText, 
  ArrowRight, 
  Eye 
} from 'lucide-react';
import { fetchStrapiData, getStrapiMediaUrl } from '../../services/strapi';

const PISL_DEFAULT_PDF = 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/Pragati_Infra_Solutions_2d2730c93f.pdf';
const PISL_DEFAULT_COVER = 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/Screenshot_2026_10_13_at_10_58_08_PM_baafd337f0.png';
const PISL_LOCAL_COVER = '/images/about/pisl-profile-cover.png';
const PISL_LOCAL_PDF = '/reports/Pragati-Infra-Solutions-2.pdf';

const AboutDocuments = ({ profileData }) => {
  const [docFileUrl, setDocFileUrl] = useState(PISL_DEFAULT_PDF);
  const [docCoverUrl, setDocCoverUrl] = useState(PISL_DEFAULT_COVER);
  const [docTitle, setDocTitle] = useState('Building Infrastructure\nfor a Better Tomorrow');
  const [docDesc, setDocDesc] = useState("Download our official company profile to explore Pislinfra's turnkey EPC capabilities, extensive industrial and warehousing portfolio, engineering expertise, and client partnerships across India.");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (downloading) return;
    setDownloading(true);

    try {
      const targetUrl = docFileUrl || '/reports/Pragati-Infra-Solutions-Corporate-Profile.pdf';
      const response = await fetch(targetUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Download network error');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = 'Pragati_Infra_Solutions_Corporate_Profile.pdf';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 300);
    } catch (err) {
      console.warn('Direct blob download failed, opening file directly:', err);
      window.open(targetUrl || '/reports/Pragati-Infra-Solutions-Corporate-Profile.pdf', '_blank');
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const applyProfile = (item) => {
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

  useEffect(() => {
    if (profileData) {
      applyProfile(profileData);
    }

    // 1. Live network fetch directly from Strapi about-page first
    fetchStrapiData('about-page?populate[0]=companyProfile.file&populate[1]=companyProfile.coverImage&populate[2]=resources.file&populate[3]=resources.coverImage')
      .then(res => {
        const d = res?.data?.attributes || res?.companyProfile ? res : res?.data || res;
        const profile = d?.companyProfile || (d?.resources && d.resources.find(r => (r.title || '').toLowerCase().includes('profile'))) || d?.resources?.[0];
        if (profile && (profile.file || profile.fileUrl || profile.coverImage || profile.title)) {
          applyProfile(profile);
          return;
        }
        // Fallback to ehs-page if about-page profile has not been uploaded yet
        return fetchStrapiData('ehs-page?populate[0]=resources&populate[1]=resources.file&populate[2]=resources.coverImage')
          .then(data => {
            const items = data?.resources || data?.data?.attributes?.resources || [];
            const pislItem = items.find(r => (r.title || '').toLowerCase().includes('profile'));
            if (pislItem) applyProfile(pislItem);
          });
      })
      .catch(() => {});

    // 2. Check if cached about-page or ehs-page in localStorage has updated profile file or cover
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && (key.includes('about-page') || key.includes('ehs-page'))) {
            const raw = window.localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              const pislItem = parsed?.companyProfile || parsed?.resources?.find(r => (r.title || '').toLowerCase().includes('profile'));
              if (pislItem) applyProfile(pislItem);
            }
          }
        }
      } catch (e) {}
    }
  }, [profileData]);

  const renderTitle = (text) => {
    if (!text) {
      return (
        <>
          Building Infrastructure <br className="ap-title-br" />
          for a <span className="ap-highlight">Better Tomorrow</span>
        </>
      );
    }
    if (text.includes('Better Tomorrow')) {
      const parts = text.split('Better Tomorrow');
      const cleanBefore = parts[0].trim();
      if (cleanBefore.includes('\n')) {
        const lines = cleanBefore.split('\n');
        return (
          <>
            {lines[0]} <br className="ap-title-br" />
            {lines.slice(1).join(' ')} <span className="ap-highlight">Better Tomorrow</span> {parts[1]}
          </>
        );
      }
      if (cleanBefore.toLowerCase().endsWith('for a')) {
        const mainPart = cleanBefore.slice(0, -5).trim();
        return (
          <>
            {mainPart} <br className="ap-title-br" />
            for a <span className="ap-highlight">Better Tomorrow</span> {parts[1]}
          </>
        );
      }
      return (
        <>
          {parts[0]} <span className="ap-highlight">Better Tomorrow</span> {parts[1]}
        </>
      );
    }
    if (text.includes('\n')) {
      const lines = text.split('\n');
      return (
        <>
          {lines.slice(0, -1).join(' ')} <br className="ap-title-br" />
          <span className="ap-highlight">{lines[lines.length - 1]}</span>
        </>
      );
    }
    const words = text.split(' ');
    if (words.length <= 2) return text;
    const firstPart = words.slice(0, words.length - 2).join(' ');
    const lastTwo = words.slice(words.length - 2).join(' ');
    return (
      <>
        {firstPart} <span className="ap-highlight">{lastTwo}</span>
      </>
    );
  };

  return (
    <section className="about-profile-section" style={{
      padding: '40px 24px 70px',
      backgroundColor: '#ffffff',
      fontFamily: '"Inter", sans-serif'
    }}>
      <div style={{ maxWidth: '1350px', margin: '0 auto' }}>
        
        {/* Main Banner Card */}
        <div className="ap-card">
          
          {/* Left Content Area */}
          <div className="ap-content">
            
            {/* Headline */}
            <h2 className="ap-headline">
              {renderTitle(docTitle)}
            </h2>

            {/* Subtitle / Description */}
            <p className="ap-description">
              {docDesc}
            </p>

            {/* 3 Metric Stat Items */}
            <div className="ap-stats-row">
              {/* Stat 1: 17+ Years */}
              <div className="ap-stat-item">
                <div className="ap-stat-icon ap-icon-blue">
                  <Building2 size={20} strokeWidth={2.2} />
                </div>
                <div className="ap-stat-text">
                  <div className="ap-stat-title">17+ Years</div>
                  <div className="ap-stat-sub">Excellence</div>
                </div>
              </div>

              {/* Stat 2: 16M+ Sq. Ft. */}
              <div className="ap-stat-item">
                <div className="ap-stat-icon ap-icon-orange">
                  <TrendingUp size={20} strokeWidth={2.2} />
                </div>
                <div className="ap-stat-text">
                  <div className="ap-stat-title">16M+ Sq. Ft.</div>
                  <div className="ap-stat-sub">Delivered</div>
                </div>
              </div>

              {/* Stat 3: Nationwide */}
              <div className="ap-stat-item ap-stat-item-last">
                <div className="ap-stat-icon ap-icon-green">
                  <MapPin size={20} strokeWidth={2.2} />
                </div>
                <div className="ap-stat-text">
                  <div className="ap-stat-title">Nationwide</div>
                  <div className="ap-stat-sub">Presence</div>
                </div>
              </div>
            </div>

            {/* Actions: Download Button & View Link */}
            <div className="ap-actions">
              <a 
                href={docFileUrl}
                download="Pragati-Infra-Solutions-Company-Profile.pdf"
                onClick={handleDownload}
                className="ap-download-btn"
                title="Download Company Profile (PDF)"
              >
                <div className="ap-btn-body">
                  <FileText size={18} strokeWidth={2.2} />
                  <span>{downloading ? 'Downloading...' : 'Download Company Profile (PDF)'}</span>
                </div>
                <div className="ap-btn-arrow">
                  <ArrowRight size={18} strokeWidth={2.4} />
                </div>
              </a>

              <a 
                href={docFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ap-view-btn"
                title="View Presentation in Browser"
              >
                <Eye size={16} />
                <span>View Presentation</span>
              </a>
            </div>

          </div>

          {/* Right Visual Image: Official Strapi Cover with Local Offline Fallback */}
          <div className="ap-visual">
            <img 
              src={docCoverUrl} 
              alt="PISL Company Profile Presentation" 
              loading="lazy"
              onError={(e) => {
                if (e.currentTarget.src !== PISL_LOCAL_COVER && !e.currentTarget.src.endsWith(PISL_LOCAL_COVER)) {
                  e.currentTarget.src = PISL_LOCAL_COVER;
                }
              }}
              className="ap-image"
            />
          </div>

        </div>

      </div>

      <style>{`
        .ap-card {
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

        .ap-content {
          padding: 34px 32px 30px 38px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 2;
        }

        .ap-headline {
          font-size: clamp(26px, 2.8vw, 36px);
          font-weight: 800;
          color: #0c2356;
          line-height: 1.18;
          letter-spacing: -0.5px;
          margin: 0 0 14px;
        }

        .ap-highlight {
          color: #ff733b;
        }

        .ap-description {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 24px;
          max-width: 520px;
        }

        .ap-stats-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 26px;
          flex-wrap: wrap;
        }

        .ap-stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 16px;
          border-right: 1px solid #e2e8f0;
        }

        .ap-stat-item-last {
          border-right: none;
          padding-right: 0;
        }

        .ap-stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ap-icon-blue {
          background-color: #e0f2fe;
          color: #0284c7;
        }

        .ap-icon-orange {
          background-color: #ffedd5;
          color: #ea580c;
        }

        .ap-icon-green {
          background-color: #dcfce7;
          color: #059669;
        }

        .ap-stat-title {
          font-size: 14.5px;
          font-weight: 800;
          color: #0c2356;
          line-height: 1.2;
        }

        .ap-stat-sub {
          font-size: 11.5px;
          font-weight: 500;
          color: #64748b;
          line-height: 1.2;
        }

        .ap-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .ap-download-btn {
          display: inline-flex;
          align-items: stretch;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: none !important;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        @media (hover: hover) and (pointer: fine) {
          .ap-download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(11, 40, 101, 0.16) !important;
          }
          .ap-download-btn:hover .ap-btn-body {
            background-color: #071c49;
          }
          .ap-download-btn:hover .ap-btn-arrow {
            background-color: #ff8755;
          }
          .ap-view-btn:hover {
            background-color: #0b2865;
            color: #ffffff;
            transform: translateY(-2px);
          }
        }

        .ap-download-btn:active {
          transform: scale(0.98);
        }

        .ap-view-btn:active {
          transform: scale(0.98);
          background-color: #f1f5f9;
        }

        .ap-btn-body {
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

        .ap-btn-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          background-color: #ff733b;
          color: #ffffff;
          transition: background-color 0.2s ease;
        }

        .ap-view-btn {
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

        .ap-visual {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          overflow: hidden;
        }

        .ap-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        @media (max-width: 1080px) {
          .ap-card {
            grid-template-columns: 1fr;
          }
          .ap-content {
            padding: 30px 24px;
          }
          .ap-visual {
            width: 100%;
            height: auto;
            aspect-ratio: 16 / 9;
            min-height: auto;
            border-top: 1px solid #e2e8f0;
          }
        }

        @media (max-width: 768px) {
          .about-profile-section {
            padding: 34px 16px 48px 16px !important;
          }
          .ap-card {
            border-radius: 14px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04) !important;
          }
          .ap-content {
            padding: 24px 16px 22px 16px;
          }
          .ap-headline {
            font-size: clamp(21px, 5.8vw, 26px);
            line-height: 1.22;
            margin: 0 0 12px;
            letter-spacing: -0.4px;
          }
          .ap-description {
            font-size: 13px;
            line-height: 1.55;
            margin: 0 0 18px;
            color: #64748b;
          }
          .ap-stats-row {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 8px !important;
            margin-bottom: 20px !important;
            width: 100% !important;
          }
          .ap-stat-item {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding: 10px 4px !important;
            background: #f8fafc !important;
            border-radius: 10px !important;
            border: 1px solid #edf2f7 !important;
            border-right: 1px solid #edf2f7 !important;
            width: 100% !important;
            gap: 6px !important;
          }
          .ap-stat-item-last {
            border-right: 1px solid #edf2f7 !important;
            padding-right: 4px !important;
          }
          .ap-stat-icon {
            width: 36px !important;
            height: 36px !important;
            border-radius: 8px !important;
          }
          .ap-stat-title {
            font-size: 12.5px !important;
            font-weight: 800 !important;
            line-height: 1.2 !important;
            color: #0c2356 !important;
          }
          .ap-stat-sub {
            font-size: 10px !important;
            font-weight: 500 !important;
            color: #64748b !important;
            line-height: 1.2 !important;
          }
          .ap-actions {
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
            width: 100% !important;
          }
          .ap-download-btn {
            width: 100% !important;
            min-height: 46px !important;
            border-radius: 8px !important;
          }
          .ap-btn-body {
            justify-content: center !important;
            flex: 1 !important;
            padding: 12px 14px !important;
            font-size: 13px !important;
            font-weight: 700 !important;
          }
          .ap-btn-arrow {
            padding: 0 14px !important;
          }
          .ap-view-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 11px 16px !important;
            font-size: 13px !important;
            min-height: 44px !important;
            box-sizing: border-box !important;
            border-radius: 8px !important;
          }
          .ap-visual {
            width: 100% !important;
            aspect-ratio: 16 / 9 !important;
            border-top: 1px solid #e2e8f0 !important;
            background-color: #f8fafc !important;
          }
          .ap-image {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
        }

        @media (max-width: 360px) {
          .about-profile-section {
            padding: 28px 12px 40px 12px !important;
          }
          .ap-content {
            padding: 20px 12px 18px 12px !important;
          }
          .ap-headline {
            font-size: 20px !important;
          }
          .ap-description {
            font-size: 12px !important;
          }
          .ap-stats-row {
            gap: 6px !important;
          }
          .ap-stat-item {
            padding: 8px 2px !important;
          }
          .ap-stat-icon {
            width: 32px !important;
            height: 32px !important;
          }
          .ap-stat-title {
            font-size: 11.5px !important;
          }
          .ap-stat-sub {
            font-size: 9.5px !important;
          }
          .ap-btn-body {
            font-size: 12px !important;
            padding: 10px 8px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutDocuments;
