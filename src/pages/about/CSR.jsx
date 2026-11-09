import React, { useEffect, useState } from 'react';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import CSRStats from '../../components/csr/CSRStats';
import CSRPhilosophy from '../../components/csr/CSRPhilosophy';
import CSRFocusAreas from '../../components/csr/CSRFocusAreas';
import CSRInitiatives from '../../components/csr/CSRInitiatives';
import CSRCTA from '../../components/csr/CSRCTA';
import { fetchStrapiData, getLocalDataSync } from '../../services/strapi';
import { getImageUrl } from '../../utils/imageUrl.js';
import Preloader from '../../components/common/Preloader';

const CSR = () => {
  const [data, setData] = useState(() => getLocalDataSync('csr-page'));
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchStrapiData('csr-page?populate=seo,heroImage,philosophyImages,stats,focusAreas.image,givingBackCards.image,environmentCards.image,celebrationCards.image');
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
      if (e.detail?.endpoint?.includes('csr-page') && e.detail.data) {
        setData(e.detail.data);
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, []);

  if (loading && !data) return <Preloader />;

  const pageData = data || {};

  const fallbackTitle = 'CSR & Community Empowerment Programs - Sustainable Social Impact | Pislinfra';
  const fallbackDescription = 'Discover Pislinfra\'s Corporate Social Responsibility (CSR) programs empowering local communities through education, healthcare, skill development, and environmental greening across India.';

  // Connect CMS CSR page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = (pageData?.metaTitle || pageData?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (pageData?.metaDescription || pageData?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (pageData?.primaryKeyword || '').trim();
  const resolvedFocusKeywords = (pageData?.focusKeywords || '').trim();

  const seoData = {
    contentType: 'page',
    ...(pageData?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: pageData?.seo?.seoKeywords || resolvedFocusKeywords || 'Pislinfra CSR, corporate social responsibility construction, community empowerment India, sustainable development, green initiatives, healthcare and education CSR',
    slug: 'about/csr',
    canonicalUrl: 'https://pislinfra.com/about/csr',
    ogTitle: pageData?.seo?.ogTitle || resolvedTitle,
    ogDescription: pageData?.seo?.ogDescription || resolvedDescription,
    ogImage: pageData?.seo?.ogImage || pageData?.heroImage?.url || '/images/hero/CSR.png',
    ogType: 'website',
    twitterTitle: pageData?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: pageData?.seo?.twitterDescription || resolvedDescription,
    twitterImage: pageData?.seo?.twitterImage || pageData?.heroImage?.url || '/images/hero/CSR.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'AboutPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['CSR', 'Social Responsibility', 'Community Empowerment', 'Education', 'Environment', 'Welfare', 'Pislinfra']
  };

  const heroImage = pageData?.heroImage ? getImageUrl(pageData.heroImage) : "/images/hero/CSR.png";

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <BlogSEO blog={seoData} />
      <PageHero 
        title={pageData.heroTitle || "CSR Initiatives"} 
        subtitle={pageData.heroSubtitle || "Changing lives beyond business"} 
        breadcrumb={pageData.heroBreadcrumb || "About Us / CSR"} 
        bgImage={heroImage} 
      />
      <CSRStats stats={pageData.stats} />
      <CSRPhilosophy title={pageData.philosophyTitle} description={pageData.philosophyDescription} images={pageData.philosophyImages} />
      <CSRFocusAreas areas={pageData.focusAreas} />
      <CSRInitiatives givingBackCards={pageData.givingBackCards} envCards={pageData.environmentCards} celebCards={pageData.celebrationCards} />
      <CSRCTA />
    </div>
  );
};

export default CSR;
