import React from 'react';
import SEO from '../components/common/SEO';
import BlogSEO from '../components/Blog/BlogSEO';
import HeroVideo from '../components/hero/HeroVideo';
import AboutUs from '../components/about/AboutUs';
import StatsSection from '../components/about/StatsSection';
import Services from '../components/solutions/Services';
import CoverageMap from '../components/coverage/CoverageMap';
import Industries from '../components/industries/Industries';
import Clients from '../components/clients/Clients';
import Awards from '../components/Home/Awards';
import HSESection from '../components/Home/HSESection';

const Home = () => {
  const seoData = {
    contentType: 'page',
    title: 'PISL',
    seoTitle: 'PISL',
    seoDescription: 'Pislinfra delivers warehousing, logistics parks, and industrial construction solutions, with 17+ years of experience and 16M+ sq. ft. delivered.',
    seoKeywords: 'industrial infrastructure, construction company, warehousing, logistics park, industrial development, warehouse construction India, EPC contractor, industrial construction, infrastructure development, logistics infrastructure, turnkey construction, PEB warehouse construction.',
    slug: '',
    canonicalUrl: 'https://pislinfra.com',
    ogTitle: 'PISL',
    ogDescription: 'Leading industrial infrastructure company in India. 16M+ sq ft constructed, 25+ locations, 600+ employees.',
    ogImage: 'https://pislinfra.com/logo.png',
    ogType: 'website',
    twitterTitle: 'PISL',
    twitterDescription: 'Industrial infrastructure & construction experts. Warehousing, logistics parks & EPC solutions.',
    twitterImage: 'https://pislinfra.com/logo.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'Organization',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Industrial', 'Infrastructure', 'Construction', 'Warehousing', 'Logistics', 'EPC'],
  };

  return (
    <>
      <SEO
        title="PISL"
        description="PISL provides EPC, construction, infrastructure development, and industrial solutions across India."
        canonical="https://pislinfra.com"
        image="https://pislinfra.com/og-image.jpg"
      />
      
      <BlogSEO blog={seoData} />

      <div>
        <HeroVideo />
        <AboutUs />
        <StatsSection />
        <Services />
        <CoverageMap />
        <Industries />
        <Awards />
        <Clients />
        <HSESection />
      </div>
    </>
  );
};

export default Home;