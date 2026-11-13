import React, { useEffect, useState } from 'react';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import CSRStats from '../../components/csr/CSRStats';
import CSRPhilosophy from '../../components/csr/CSRPhilosophy';
import CSRFocusAreas from '../../components/csr/CSRFocusAreas';
import CSRInitiatives from '../../components/csr/CSRInitiatives';
import CSRCTA from '../../components/csr/CSRCTA';
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../../services/wordpress';
import { getImageUrl } from '../../utils/imageUrl.js';
import Preloader from '../../components/common/Preloader';

const CSR = () => {
  const isPreview = Boolean(getPreviewContext());
  const [data, setData] = useState(() => (isPreview ? null : getLocalDataSync('csr-page')));
  const [loading, setLoading] = useState(isPreview || !data);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchWpData(
          'csr-page?populate=seo,heroImage,philosophyImages,stats,focusAreas.image,givingBackCards.image,environmentCards.image,celebrationCards.image',
          { forceFresh: isPreview }
        );
        if (res) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to fetch CSR data', err);
      } finally {
        setLoading(false);
      }
    };
    getData();

    const handleUpdate = (e) => {
      if (isPreview) return;
      if ((e.detail?.cleanEndpoint?.startsWith('csr-page') || e.detail?.endpoint?.includes('csr-page')) && e.detail.data) {
        setData(e.detail.data);
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, [isPreview]);

  if (loading && !data) return <Preloader />;

  const pageData = data || {};

  const fallbackTitle = 'CSR & Community Empowerment Programs - Sustainable Social Impact | Pislinfra';
  const fallbackDescription = 'Discover Pislinfra\'s Corporate Social Responsibility (CSR) programs empowering local communities through education, healthcare, skill development, and environmental greening across India.';

  // Connect CMS CSR page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = (pageData?.metaTitle || pageData?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (pageData?.metaDescription || pageData?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (pageData?.primaryKeyword || pageData?.seo?.primaryKeyword || '').trim();
  const resolvedFocusKeywords = (pageData?.focusKeywords || pageData?.seo?.focusKeywords || '').trim();
  const resolvedHeroImage = getImageUrl(pageData?.heroImage, '/images/hero/CSR.png');
  const resolvedOgImage = getImageUrl(pageData?.seo?.ogImage || pageData?.ogImage || pageData?.heroImage, resolvedHeroImage);
  const resolvedTwitterImage = getImageUrl(pageData?.seo?.twitterImage || pageData?.twitterImage, resolvedOgImage);

  const seoData = {
    contentType: 'page',
    slug: 'about/csr',
    canonicalUrl: 'https://pislinfra.com/about/csr',
    ogType: 'website',
    twitterCardType: 'summary_large_image',
    schemaType: 'AboutPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['CSR', 'Social Responsibility', 'Community Empowerment', 'Education', 'Environment', 'Welfare', 'Pislinfra'],
    ...(pageData?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: pageData?.seo?.seoKeywords || resolvedFocusKeywords || 'Pislinfra CSR, corporate social responsibility construction, community empowerment India, sustainable development, green initiatives, healthcare and education CSR',
    canonicalUrl: pageData?.seo?.canonicalUrl || 'https://pislinfra.com/about/csr',
    ogTitle: pageData?.seo?.ogTitle || resolvedTitle,
    ogDescription: pageData?.seo?.ogDescription || resolvedDescription,
    ogImage: resolvedOgImage,
    twitterTitle: pageData?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: pageData?.seo?.twitterDescription || resolvedDescription,
    twitterImage: resolvedTwitterImage,
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <BlogSEO blog={seoData} />
      {pageData?.showHero !== false && (
        <PageHero 
          title={pageData.heroTitle || "CSR Initiatives"} 
          subtitle={pageData.heroSubtitle || "Changing lives beyond business"} 
          breadcrumb={pageData.heroBreadcrumb || "About Us / CSR"} 
          bgImage={resolvedHeroImage} 
        />
      )}
      {pageData?.showStats !== false && <CSRStats stats={pageData.stats} />}
      {pageData?.showPhilosophy !== false && (
        <CSRPhilosophy
          badge={pageData.philosophyBadge}
          title={pageData.philosophyTitle}
          description={pageData.philosophyDescription}
          images={pageData.philosophyImages}
        />
      )}
      {pageData?.showFocusAreas !== false && (
        <CSRFocusAreas
          badge={pageData.focusBadge}
          title={pageData.focusTitle}
          subtitle={pageData.focusSubtitle}
          areas={pageData.focusAreas}
        />
      )}
      {pageData?.showInitiatives !== false && (
        <CSRInitiatives
          givingBackTitle={pageData.givingBackTitle}
          environmentTitle={pageData.environmentTitle}
          celebrationsTitle={pageData.celebrationsTitle}
          givingBackCards={pageData.givingBackCards}
          envCards={pageData.environmentCards}
          celebCards={pageData.celebrationCards}
        />
      )}
      {pageData?.showCta !== false && (
        <CSRCTA
          heading={pageData.ctaHeading}
          subtext={pageData.ctaSubtext}
          buttonText={pageData.ctaButtonText}
          buttonLink={pageData.ctaButtonLink}
        />
      )}
    </div>
  );
};

export default CSR;
