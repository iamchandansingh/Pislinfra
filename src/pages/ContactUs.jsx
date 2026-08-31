import React, { useState, useEffect } from 'react';
import PageHero from '../components/hero/PageHero';
import BlogSEO from '../components/Blog/BlogSEO';
import ContactCardsSection from '../components/Contact-us/ContactCardsSection';
import ContactInquirySection from '../components/Contact-us/ContactInquirySection';
import ContactMapSection from '../components/Contact-us/ContactMapSection';
import Preloader from '../components/common/Preloader';
import { fetchStrapiData, STRAPI_URL } from '../services/strapi';

const ContactUs = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchStrapiData('contact-page?populate[0]=heroImage&populate[1]=seo.ogImage&populate[2]=seo.twitterImage');
      if (data) setPageData(data);
    };
    getData();
  }, []);

  if (loading && !pageData) return <Preloader />;

  const heroTitle = pageData?.heroTitle || 'Get in Touch';
  const heroSubtitle = pageData?.heroSubtitle || 'Secure enterprise channel for infrastructure collaboration.';
  const heroBg = pageData?.heroImage?.url ? (pageData.heroImage.url.startsWith('/') ? `${STRAPI_URL}${pageData.heroImage.url}` : pageData.heroImage.url) : '/images/hero/Contact-Us.png';

  const defaultSeoData = {
    contentType: 'page',
    title: 'Contact Us',
    seoTitle: 'Contact Us',
    seoDescription: 'Contact Pislinfra for industrial infrastructure projects. Reach out via phone, email, or visit our office in Gurugram, Haryana. Get a quote today.',
    seoKeywords: 'contact Pislinfra, infrastructure company contact, construction inquiry, industrial project quote, PISL office, Gurugram',
    slug: 'contact-us',
    canonicalUrl: 'https://pislinfra.com/contact-us',
    ogTitle: 'Contact Pislinfra',
    ogDescription: 'Get in touch with Pislinfra for warehousing, logistics & construction projects. Call, email or visit us.',
    ogImage: 'https://pislinfra.com/images/hero/Contact-Us.png',
    ogType: 'website',
    twitterTitle: 'Contact Pislinfra - Infrastructure Company',
    twitterDescription: 'Reach out for industrial construction & infrastructure projects.',
    twitterImage: 'https://pislinfra.com/images/hero/Contact-Us.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'ContactPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Contact', 'Inquiry', 'Quote', 'Industrial', 'Construction'],
  };

    const seoData = pageData?.seo ? {
    ...defaultSeoData,
    seoTitle: pageData.seo.seoTitle || defaultSeoData.seoTitle,
    title: pageData.seo.seoTitle || defaultSeoData.title,
    seoDescription: pageData.seo.seoDescription || defaultSeoData.seoDescription,
    seoKeywords: pageData.seo.seoKeywords || defaultSeoData.seoKeywords,
    canonicalUrl: pageData.seo.canonicalUrl || defaultSeoData.canonicalUrl,
    ogTitle: pageData.seo.ogTitle || defaultSeoData.ogTitle,
    ogDescription: pageData.seo.ogDescription || defaultSeoData.ogDescription,
    ogType: pageData.seo.ogType || defaultSeoData.ogType,
    twitterTitle: pageData.seo.twitterTitle || defaultSeoData.twitterTitle,
    twitterDescription: pageData.seo.twitterDescription || defaultSeoData.twitterDescription,
    twitterCardType: pageData.seo.twitterCardType || defaultSeoData.twitterCardType,
    schemaType: pageData.seo.schemaType || defaultSeoData.schemaType,
    ogImage: pageData.seo.ogImage?.url ? (pageData.seo.ogImage.url.startsWith('/') ? `${STRAPI_URL}${pageData.seo.ogImage.url}` : pageData.seo.ogImage.url) : defaultSeoData.ogImage,
    twitterImage: pageData.seo.twitterImage?.url ? (pageData.seo.twitterImage.url.startsWith('/') ? `${STRAPI_URL}${pageData.seo.twitterImage.url}` : pageData.seo.twitterImage.url) : (pageData.seo.ogImage?.url ? (pageData.seo.ogImage.url.startsWith('/') ? `${STRAPI_URL}${pageData.seo.ogImage.url}` : pageData.seo.ogImage.url) : defaultSeoData.twitterImage),
    noIndex: pageData.seo.noIndex || false,
    noFollow: pageData.seo.noFollow || false,
    breadcrumbSchema: pageData.seo.breadcrumbSchema !== undefined ? pageData.seo.breadcrumbSchema : true,
    organizationSchema: pageData.seo.organizationSchema !== undefined ? pageData.seo.organizationSchema : true,
    tags: pageData.seo.tags ? pageData.seo.tags.split(',').map(t => t.trim()) : [],
    structuredData: pageData.seo.structuredData
  } : defaultSeoData;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      
      <BlogSEO blog={seoData} />

      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        breadcrumb="Contact"
        bgImage={heroBg}
      />

      <div className="contact-sections" style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '60px', paddingTop: '40px' }}>
        <ContactCardsSection pageData={pageData} />
        <ContactInquirySection pageData={pageData} />
        <ContactMapSection />
      </div>

      <style>{`

      `}</style>
    </div>
  )
}

export default ContactUs;
