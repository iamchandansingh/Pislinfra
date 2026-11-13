import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiHome, HiOutlineDownload, HiOutlineDocumentText } from 'react-icons/hi';
import BlogSEO from '../../components/Blog/BlogSEO';
import Preloader from '../../components/common/Preloader';
import NotFound from '../NotFound';
import { fetchWpData, getLocalDataSync, getPreviewContext, getWpMediaUrl } from '../../services/wordpress';

// Single request: page hero + published policy documents (Strapi only populates published relations)
const GOVERNANCE_ENDPOINT = 'governance-page?populate[heroCoverImage]=true&populate[seo][populate][0]=ogImage&populate[policies][sort][0]=displayOrder:asc&populate[policies][populate][coverImage]=true&populate[policies][populate][pdfFile]=true';

const ACCENTS = {
  navy: '#28286e',
  orange: '#ff8d4b',
  green: '#1E9E5A',
};

// Robust default local policies data (ensures policies always render even if Strapi/network is offline)
const DEFAULT_POLICIES = [
  {
    id: 1,
    displayOrder: 1,
    title: 'Risk Management Policy',
    slug: 'risk-management-policy',
    shortDescription: 'Our Risk Management Policy outlines our approach to identifying, assessing and mitigating risks to ensure business continuity, resilience and sustainable growth.',
    buttonName: 'Download PDF',
    documentLabel: 'PDF Document',
    accentType: 'navy',
    coverImage: '/images/uploads/Risk_49056e0c4c.jpeg',
    pdfUrl: '/reports/Risk_Management_Policy_PISL_37fe051837.pdf'
  },
  {
    id: 2,
    displayOrder: 2,
    title: 'Vigil Mechanism Policy',
    slug: 'vigil-mechanism-policy',
    shortDescription: 'Our Vigil Mechanism Policy provides a framework for reporting concerns and promotes a culture of ethics, transparency and accountability.',
    buttonName: 'Download PDF',
    documentLabel: 'PDF Document',
    accentType: 'orange',
    coverImage: '/images/uploads/Vigil_cc39e832ef.jpeg',
    pdfUrl: '/reports/Vigil_Mechanism_Policy_PISL_6c1fe65e70.pdf'
  },
  {
    id: 3,
    displayOrder: 3,
    title: 'CSR Policy',
    slug: 'csr-policy',
    shortDescription: 'Our CSR Policy reflects our commitment to social responsibility, community development and creating a positive, sustainable impact across the regions we operate in.',
    buttonName: 'Download PDF',
    documentLabel: 'PDF Document',
    accentType: 'green',
    coverImage: '/images/uploads/CSR_017ee514a5.jpeg',
    pdfUrl: '/reports/CSR_Policy_PISL_2e584fd56d.pdf'
  }
];

const DEFAULT_PAGE_DATA = {
  id: 1,
  pageTitle: 'Company Policy',
  breadcrumbLabel: 'Company Policy',
  heroTitle: 'Company Policy',
  heroDescription: 'Corporate policies that guide ethical, transparent and responsible growth across Pislinfra.',
  slug: 'company-policy',
  heroCoverImage: '/images/uploads/optimized_1787756480751_Extra-2.webp',
  policies: DEFAULT_POLICIES
};

// Normalize data whether returned as an Array [ { ... } ], an Object { ... }, or wrapped in { data: ... }
const normalizePageData = (raw) => {
  if (!raw) return DEFAULT_PAGE_DATA;
  let target = raw;
  if (Array.isArray(raw)) {
    if (raw.length === 0) return DEFAULT_PAGE_DATA;
    target = raw[0];
  } else if (raw.data) {
    return normalizePageData(raw.data);
  }
  if (!target || typeof target !== 'object') return DEFAULT_PAGE_DATA;

  let rawPolicies = target.policies;
  if (rawPolicies && !Array.isArray(rawPolicies) && Array.isArray(rawPolicies.data)) {
    rawPolicies = rawPolicies.data;
  }
  const policiesArray = Array.isArray(rawPolicies) && rawPolicies.length > 0
    ? rawPolicies
    : DEFAULT_POLICIES;

  return {
    ...DEFAULT_PAGE_DATA,
    ...target,
    heroTitle: target.heroTitle || DEFAULT_PAGE_DATA.heroTitle,
    heroDescription: target.heroDescription || DEFAULT_PAGE_DATA.heroDescription,
    pageTitle: target.pageTitle || DEFAULT_PAGE_DATA.pageTitle,
    breadcrumbLabel: target.breadcrumbLabel || target.pageTitle || DEFAULT_PAGE_DATA.breadcrumbLabel,
    slug: target.slug || DEFAULT_PAGE_DATA.slug,
    heroCoverImage: target.heroCoverImage || DEFAULT_PAGE_DATA.heroCoverImage,
    policies: policiesArray
  };
};

const resolvePdfUrl = (pdfFile, fallbackUrl = '') => {
  if (!pdfFile && !fallbackUrl) return '';
  if (typeof pdfFile === 'string') {
    if (pdfFile.startsWith('/wp-content/uploads/')) return getWpMediaUrl(pdfFile, fallbackUrl);
    if (pdfFile.startsWith('http') || pdfFile.startsWith('/')) return pdfFile;
    return `/reports/${pdfFile}`;
  }
  if (pdfFile?.url) {
    if (pdfFile.url.startsWith('/wp-content/uploads/')) return getWpMediaUrl(pdfFile.url, fallbackUrl);
    if (pdfFile.url.startsWith('http') || pdfFile.url.startsWith('/')) return pdfFile.url;
    return `/${pdfFile.url.replace(/^\/+/, '')}`;
  }
  if (pdfFile?.hash) {
    return `/reports/${pdfFile.hash}.pdf`;
  }
  return fallbackUrl;
};

const resolveCoverUrl = (img, fallbackUrl = '') => {
  if (!img) return fallbackUrl;
  if (typeof img === 'string') {
    if (img.startsWith('/wp-content/uploads/')) return getWpMediaUrl(img, fallbackUrl);
    if (img.startsWith('http') || img.startsWith('/')) return img;
    return getWpMediaUrl(img, fallbackUrl);
  }
  if (img.url) {
    if (img.url.startsWith('/wp-content/uploads/')) return getWpMediaUrl(img.url, fallbackUrl);
    if (img.url.startsWith('http') || img.url.startsWith('/')) return img.url;
    return getWpMediaUrl(img.url, fallbackUrl);
  }
  if (img.formats?.medium?.url) return img.formats.medium.url;
  if (img.formats?.large?.url) return img.formats.large.url;
  if (img.formats?.small?.url) return img.formats.small.url;
  return getWpMediaUrl(img, fallbackUrl);
};

const sortPolicies = (policies) =>
  [...(Array.isArray(policies) ? policies : DEFAULT_POLICIES)].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

const PolicyCard = ({ policy }) => {
  const fallbackMatch = DEFAULT_POLICIES.find(p => p.slug === policy.slug || p.title === policy.title) || DEFAULT_POLICIES[0];
  const coverUrl = resolveCoverUrl(policy.coverImage, fallbackMatch?.coverImage);
  const pdfUrl = resolvePdfUrl(policy.pdfFile || policy.pdfUrl, fallbackMatch?.pdfUrl);
  const pdfName = policy.pdfFile?.name || `${policy.title?.replace(/\s+/g, '_')}.pdf` || 'Policy.pdf';
  const buttonName = policy.buttonName || 'Download PDF';

  return (
    <article className="pg-card">
      <div className="pg-card-media">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={policy.coverImageAlt || policy.title}
            loading="lazy"
            decoding="async"
            width="800"
            height="400"
          />
        ) : (
          <div className="pg-card-media-empty" aria-hidden="true">
            <HiOutlineDocumentText />
          </div>
        )}
      </div>

      <div className="pg-card-body">
        <h2 className="pg-card-title">{policy.title}</h2>
        <p className="pg-card-desc">{policy.shortDescription}</p>

        {pdfUrl ? (
          <a
            className="pg-btn"
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={pdfName}
            aria-label={`${buttonName}: ${policy.title} (PDF, opens in a new tab)`}
          >
            <HiOutlineDownload className="pg-btn-icon" aria-hidden="true" />
            <span>{buttonName}</span>
          </a>
        ) : (
          <span className="pg-btn pg-btn--disabled" aria-disabled="true">
            <HiOutlineDownload className="pg-btn-icon" aria-hidden="true" />
            <span>{buttonName}</span>
          </span>
        )}
      </div>
    </article>
  );
};

const PoliciesGovernance = () => {
  const { slug } = useParams();
  const isPreview = Boolean(getPreviewContext());
  const [rawData, setRawData] = useState(() => (
    isPreview
      ? null
      : (getLocalDataSync('governance-page') || getLocalDataSync(GOVERNANCE_ENDPOINT) || DEFAULT_PAGE_DATA)
  ));
  const [loading, setLoading] = useState(isPreview);

  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      try {
        const res = await fetchWpData(GOVERNANCE_ENDPOINT, { forceFresh: isPreview });
        if (res && isMounted) setRawData(res);
      } catch (err) {
        console.warn('Network fetch for governance page fell back to local store:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    getData();

    const handleUpdate = (e) => {
      if (isPreview) return;
      if (e.detail?.endpoint?.startsWith('governance-page') && e.detail.data) {
        setRawData(e.detail.data);
      } else {
        const fresh = getLocalDataSync('governance-page') || getLocalDataSync(GOVERNANCE_ENDPOINT);
        if (fresh) setRawData(fresh);
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('pisl-data-update', handleUpdate);
    };
  }, [isPreview]);

  const pageData = useMemo(() => normalizePageData(rawData), [rawData]);
  const heroImageUrl = resolveCoverUrl(pageData?.heroCoverImage, DEFAULT_PAGE_DATA.heroCoverImage);
  const policies = useMemo(() => sortPolicies(pageData?.policies), [pageData]);

  const seoData = useMemo(() => {
    if (!pageData) return null;
    const seo = pageData.seo || {};
    const resolvedOgImage = resolveCoverUrl(seo.ogImage, heroImageUrl);
    const resolvedTwitterImage = resolveCoverUrl(seo.twitterImage || seo.ogImage, resolvedOgImage);
    return {
      ...seo,
      slug: pageData.slug || 'company-policy',
      title: pageData.pageTitle || 'Company Policy',
      seoTitle: seo.seoTitle || `${pageData.pageTitle || 'Company Policy'} | Pislinfra`,
      seoDescription: seo.seoDescription || pageData.pageDescription || pageData.heroDescription,
      canonicalUrl: seo.canonicalUrl || 'https://pislinfra.com/company-policy',
      ogImage: resolvedOgImage,
      ogType: seo.ogType || 'website',
      twitterImage: resolvedTwitterImage,
      twitterCardType: seo.twitterCardType || 'summary_large_image',
      schemaType: undefined,
      breadcrumbSchema: false,
    };
  }, [pageData, heroImageUrl]);

  if (loading && !rawData) return <Preloader />;

  const validSlugs = [pageData?.slug, 'company-policy', 'policies-governance', 'policies', 'governance'].filter(Boolean);
  if (slug && !validSlugs.includes(slug)) return <NotFound />;

  const breadcrumbLabel = pageData?.breadcrumbLabel || pageData?.pageTitle || 'Company Policy';

  return (
    <div className="pg-page">
      {seoData && <BlogSEO blog={seoData} />}

      {pageData?.showHero !== false && (
        <section className="pg-hero" aria-labelledby="pg-hero-title">
          {heroImageUrl && (
            <img
              className="pg-hero-img"
              src={heroImageUrl}
              alt={pageData?.heroImageAlt || 'Company Policy'}
              fetchpriority="high"
              decoding="async"
            />
          )}
          <div className="pg-hero-overlay" aria-hidden="true" />
          <div className="pg-hero-container pg-hero-content">
            <nav className="pg-breadcrumb" aria-label="Breadcrumb">
              <Link to="/"><HiHome aria-hidden="true" /> Home</Link>
              <span className="pg-breadcrumb-sep" aria-hidden="true">/</span>
              <Link to="/about">About Us</Link>
              <span className="pg-breadcrumb-sep" aria-hidden="true">/</span>
              <span className="pg-breadcrumb-current" aria-current="page">{breadcrumbLabel}</span>
            </nav>
            <h1 id="pg-hero-title" className="pg-hero-title">{pageData?.heroTitle || 'Company Policy'}</h1>
            {pageData?.heroDescription && <p className="pg-hero-desc">{pageData.heroDescription}</p>}
          </div>
        </section>
      )}

      {pageData?.showPolicies !== false && (
        <section className="pg-body-container pg-cards-section" aria-label={pageData?.pageTitle || 'Policies'} aria-busy={loading && policies.length === 0}>
          {policies.length === 0 ? (
            <div className="pg-message" role="status">
              <h2>No policies published yet</h2>
              <p>Policy documents will appear here once they are published.</p>
            </div>
          ) : (
            <div className="pg-grid">
              {policies.map((policy) => (
                <PolicyCard key={policy.documentId || policy.id || policy.slug || policy.title} policy={policy} />
              ))}
            </div>
          )}
        </section>
      )}

      <style>{`
        .pg-page {
          background-color: #f8fafc;
          padding-bottom: 72px;
          width: 100%;
          overflow-x: hidden;
          font-family: 'Inter', sans-serif;
        }

        .pg-hero-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }

        .pg-body-container {
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 20px;
          box-sizing: border-box;
        }

        /* Hero */
        .pg-hero {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 260px;
          padding: 70px 0 60px;
          background-color: #28286e;
          overflow: hidden;
        }

        .pg-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: brightness(0.4);
        }

        .pg-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(40, 40, 110, 0.94) 0%, rgba(40, 40, 110, 0.88) 50%, rgba(15, 23, 42, 0.78) 100%);
        }

        .pg-hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          margin: 0 auto;
        }

        .pg-breadcrumb {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          font-size: 13.5px;
          color: #b3b5ff;
        }

        .pg-breadcrumb a {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #b3b5ff;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .pg-breadcrumb a:hover {
          color: #ff8d4b;
        }

        .pg-breadcrumb-sep {
          color: #8888ff;
          user-select: none;
        }

        .pg-breadcrumb-current {
          color: #ff8d4b;
          font-weight: 600;
        }

        .pg-hero-title {
          margin: 0 0 10px;
          font-size: clamp(30px, 4vw, 42px);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.5px;
          color: #ffffff;
        }

        .pg-hero-desc {
          margin: 0;
          max-width: 760px;
          font-size: clamp(14.5px, 1.2vw, 16px);
          line-height: 1.6;
          color: #c9cbff;
        }

        /* Cards */
        .pg-cards-section {
          margin-top: 48px;
        }

        .pg-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }

        @media (min-width: 640px) {
          .pg-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .pg-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 32px;
          }
        }

        .pg-card {
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: none !important;
          transition: none !important;
        }

        .pg-card:hover {
          transform: none !important;
          box-shadow: none !important;
        }

        .pg-card-media {
          aspect-ratio: 16 / 9;
          background-color: #f1f5f9;
          overflow: hidden;
        }

        .pg-card-media img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pg-card-media-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-size: 42px;
          color: #94a3b8;
        }

        .pg-card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 24px;
        }

        .pg-card-title {
          margin: 0 0 12px;
          font-size: 20px;
          font-weight: 700;
          line-height: 1.35;
          color: #28286e;
        }

        .pg-card-desc {
          flex: 1;
          margin: 0 0 22px;
          font-size: 14.5px;
          line-height: 1.6;
          color: #4b5563;
        }

        .pg-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 48px;
          padding: 12px 20px;
          border-radius: 8px;
          background-color: #28286e;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }

        .pg-btn:hover {
          background-color: #ff8d4b;
          transform: none !important;
          box-shadow: none !important;
        }

        .pg-btn-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .pg-btn--disabled,
        .pg-btn--disabled:hover {
          background-color: #cbd5e1;
          box-shadow: none;
          cursor: not-allowed;
        }

        .pg-card-error {
          margin: 8px 0 0;
          font-size: 13px;
          color: #dc2626;
        }

        .pg-page a:focus-visible {
          outline: 3px solid #ff8d4b;
          outline-offset: 2px;
        }

        /* Loading, empty & error states */
        .pg-card--skeleton {
          min-height: 420px;
          background: linear-gradient(100deg, #ffffff 30%, #f1f3f8 50%, #ffffff 70%) 0 0 / 200% 100%;
          animation: pg-shimmer 1.4s linear infinite;
        }

        .pg-skeleton-hero span {
          display: block;
          height: 16px;
          width: 240px;
          margin-bottom: 16px;
          border-radius: 6px;
          background-color: rgba(255, 255, 255, 0.18);
        }

        .pg-skeleton-hero span:nth-child(2) { height: 42px; width: min(460px, 80%); }
        .pg-skeleton-hero span:nth-child(3) { width: min(560px, 90%); margin-bottom: 0; }

        @keyframes pg-shimmer { to { background-position: -200% 0; } }

        .pg-message {
          padding: 48px 24px;
          text-align: center;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: none !important;
        }

        .pg-message h2 {
          margin: 0 0 8px;
          font-size: 22px;
          font-weight: 800;
          color: #28286e;
        }

        .pg-message p { margin: 0; color: #4b5563; }

        @media (max-width: 639px) {
          .pg-hero-container, .pg-body-container { padding: 0 16px; }
          .pg-hero { min-height: 220px; padding: 48px 0 44px; }
          .pg-breadcrumb { font-size: 13px; gap: 6px; margin-bottom: 12px; }
          .pg-cards-section { margin-top: 28px; }
          .pg-card-body { padding: 20px 18px; }
          .pg-card-title { font-size: 18px; }
          .pg-card-desc { font-size: 14px; }
          .pg-btn { min-height: 46px; font-size: 14.5px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pg-card, .pg-btn-arrow { transition: none; }
          .pg-card:hover, .pg-btn:hover .pg-btn-arrow { transform: none; }
          .pg-card--skeleton { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default PoliciesGovernance;
