import React from 'react';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import CSRStats from '../../components/csr/CSRStats';
import CSRPhilosophy from '../../components/csr/CSRPhilosophy';
import CSRFocusAreas from '../../components/csr/CSRFocusAreas';
import CSRInitiatives from '../../components/csr/CSRInitiatives';
import CSRCTA from '../../components/csr/CSRCTA';

const CSR = () => {
  const seoData = {
    contentType: 'page',
    title: 'CSR Initiatives',
    seoTitle: 'CSR Initiatives',
    seoDescription: 'Pislinfra\'s CSR initiatives - 50+ projects, 10+ lives impacted, 25+ education initiatives. Community development, environment sustainability & social responsibility.',
    seoKeywords: 'CSR initiatives, corporate social responsibility, community development, education initiatives, environment sustainability, social welfare, Pislinfra CSR',
    slug: 'about/csr',
    canonicalUrl: 'https://pislinfra.com/about/csr',
    ogTitle: 'CSR Initiatives - Social Responsibility | Pislinfra',
    ogDescription: 'Changing lives beyond business. 50+ CSR projects across India.',
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

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      
      <BlogSEO blog={seoData} />

      <PageHero 
        title="CSR Initiatives" 
        subtitle="Changing lives beyond business" 
        breadcrumb="About Us / CSR" 
        bgImage="/images/hero/leadership.png" 
      />

      <CSRStats />
      <CSRPhilosophy />
      <CSRFocusAreas />
      <CSRInitiatives />
      <CSRCTA />

    </div>
  );
};

export default CSR;