import React, { useState, useEffect } from 'react';
import PageHero from '../components/hero/PageHero';
import BlogSEO from '../components/Blog/BlogSEO';
import ContactCardsSection from '../components/Contact-us/ContactCardsSection';
import ContactInquirySection from '../components/Contact-us/ContactInquirySection';
import ContactMapSection from '../components/Contact-us/ContactMapSection';
import Preloader from '../components/common/Preloader';
import { fetchStrapiData, getLocalDataSync } from '../services/strapi';
import { getImageUrl } from '../utils/imageUrl';

const ContactUs = () => {
  const [pageData, setPageData] = useState(() => getLocalDataSync('contact-page'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getLocalDataSync('contact-page');
      if (fresh) setPageData(fresh);
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      try {
        const data = await fetchStrapiData('contact-page?populate[0]=heroImage&populate[1]=seo.ogImage&populate[2]=seo.twitterImage');
        if (data && isMounted) setPageData(data);
      } catch (e) {}
    };
    getData();
    return () => { isMounted = false; };
  }, []);

  if (loading && !pageData) return <Preloader />;

  const heroTitle = pageData?.heroTitle || 'Get in Touch';
  const heroSubtitle = pageData?.heroSubtitle || 'Secure enterprise channel for infrastructure collaboration.';
  const heroBg = pageData?.heroImage ? getImageUrl(pageData.heroImage, '/images/hero/Contact-Us.png') : '/images/hero/Contact-Us.png';

  const fallbackTitle = "Contact Pislinfra | Enquiries & Business Support";
  const fallbackDescription = "Get in touch with Pislinfra for project enquiries, business partnerships and construction solutions. Connect with our team for expert assistance.";
  const fallbackPrimaryKeyword = "Contact Pislinfra";
  const fallbackFocusKeywords = "Contact Pislinfra, project enquiries, business partnerships, construction solutions, infrastructure assistance, Pislinfra office";

  // Connect CMS Contact Us page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = (pageData?.metaTitle || pageData?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (pageData?.metaDescription || pageData?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (pageData?.primaryKeyword || pageData?.seo?.primaryKeyword || fallbackPrimaryKeyword).trim();
  const resolvedFocusKeywords = (pageData?.focusKeywords || pageData?.seo?.focusKeywords || fallbackFocusKeywords).trim();

  const seoData = {
    contentType: 'page',
    ...(pageData?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: pageData?.seo?.seoKeywords || resolvedFocusKeywords,
    slug: 'contact-us',
    canonicalUrl: pageData?.seo?.canonicalUrl || 'https://pislinfra.com/contact-us',
    ogTitle: pageData?.ogTitle || pageData?.seo?.ogTitle || resolvedTitle,
    ogDescription: pageData?.ogDescription || pageData?.seo?.ogDescription || resolvedDescription,
    ogImage: pageData?.seo?.ogImage ? getImageUrl(pageData.seo.ogImage, '/images/hero/Contact-Us.png') : '/images/hero/Contact-Us.png',
    ogType: pageData?.seo?.ogType || 'website',
    twitterTitle: pageData?.twitterTitle || pageData?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: pageData?.twitterDescription || pageData?.seo?.twitterDescription || resolvedDescription,
    twitterImage: pageData?.seo?.twitterImage ? getImageUrl(pageData.seo.twitterImage, '/images/hero/Contact-Us.png') : '/images/hero/Contact-Us.png',
    twitterCardType: pageData?.seo?.twitterCardType || 'summary_large_image',
    schemaType: pageData?.seo?.schemaType || 'ContactPage',
    breadcrumbSchema: pageData?.seo?.breadcrumbSchema !== undefined ? pageData.seo.breadcrumbSchema : true,
    organizationSchema: pageData?.seo?.organizationSchema !== undefined ? pageData.seo.organizationSchema : true,
    tags: pageData?.seo?.tags ? (typeof pageData.seo.tags === 'string' ? pageData.seo.tags.split(',').map(t => t.trim()) : pageData.seo.tags) : ['Contact', 'Inquiry', 'Quote', 'Industrial', 'Construction'],
    noIndex: pageData?.seo?.noIndex || false,
    noFollow: pageData?.seo?.noFollow || false,
    structuredData: pageData?.seo?.structuredData
  };

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
        @media (max-width: 768px) {
          .contact-sections {
            gap: 32px !important;
            padding-top: 24px !important;
            padding-bottom: 40px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ContactUs;
