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
    title: pageData?.seo?.seoTitle || 'Corporate Social Responsibility (CSR) Initiatives | Pislinfra',
    seoTitle: pageData?.seo?.seoTitle || 'CSR & Community Empowerment Programs - Sustainable Social Impact | Pislinfra',
    seoDescription: pageData?.seo?.seoDescription || 'Discover Pislinfra\'s Corporate Social Responsibility (CSR) programs empowering local communities through education, healthcare, skill development, and environmental greening across India.',
    seoKeywords: pageData?.seo?.seoKeywords || 'Pislinfra CSR, corporate social responsibility construction, community empowerment India, sustainable development, green initiatives, healthcare and education CSR',
    slug: 'about/csr',
    canonicalUrl: 'https://pislinfra.com/about/csr',
    ogTitle: pageData?.seo?.ogTitle || 'CSR & Community Initiatives | Pislinfra',
    ogDescription: pageData?.seo?.ogDescription || 'Changing lives beyond construction through grassroots education, healthcare, and ecological sustainability.',
    ogImage: pageData?.heroImage?.url || '/images/hero/CSR.png',
    ogType: 'website',
    twitterTitle: pageData?.seo?.twitterTitle || 'CSR Programs | Pislinfra',
    twitterDescription: pageData?.seo?.twitterDescription || 'Community development & social welfare programs by Pislinfra across India.',
    twitterImage: pageData?.heroImage?.url || '/images/hero/CSR.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'AboutPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['CSR', 'Social Responsibility', 'Community Empowerment', 'Education', 'Environment', 'Welfare', 'Pislinfra'],
    ...pageData?.seo
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    return img.url?.startsWith('http') ? img.url : `${img.url}`;
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
