import React, { useEffect, useState } from 'react';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import CSRStats from '../../components/csr/CSRStats';
import CSRPhilosophy from '../../components/csr/CSRPhilosophy';
import CSRFocusAreas from '../../components/csr/CSRFocusAreas';
import CSRInitiatives from '../../components/csr/CSRInitiatives';
import CSRCTA from '../../components/csr/CSRCTA';
import { fetchStrapiData } from '../../services/strapi';
import Preloader from '../../components/common/Preloader';

const CSR = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) return <Preloader />;

  const pageData = data || {};
  const seoData = {
    contentType: 'page',
    title: pageData?.seo?.seoTitle || 'CSR Initiatives',
    seoTitle: pageData?.seo?.seoTitle || 'CSR Initiatives',
    seoDescription: pageData?.seo?.seoDescription || 'Pislinfra CSR initiatives.',
    seoKeywords: pageData?.seo?.seoKeywords || '',
    slug: 'about/csr',
    canonicalUrl: 'https://pislinfra.com/about/csr',
    ogTitle: pageData?.seo?.seoTitle || 'CSR Initiatives - Social Responsibility | Pislinfra',
    ogDescription: pageData?.seo?.seoDescription || 'Changing lives beyond business.',
    ogImage: 'https://pislinfra.com/images/hero/leadership.png',
    ogType: 'website',
    twitterTitle: 'CSR Initiatives | Pislinfra',
    twitterDescription: 'Community development & social welfare programs.',
    twitterImage: 'https://pislinfra.com/images/hero/leadership.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['CSR', 'Social Responsibility', 'Community', 'Education', 'Environment', 'Welfare'],
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    return img.url?.startsWith('http') ? img.url : `http://127.0.0.1:1337${img.url}`;
  };

  const heroImage = pageData?.heroImage ? getImageUrl(pageData.heroImage) : "/images/hero/leadership.png";

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
