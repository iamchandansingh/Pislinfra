import React, { useState, useEffect } from 'react';
import PageHero from '../components/hero/PageHero';
import BlogSEO from '../components/Blog/BlogSEO';
import ContactCardsSection from '../components/Contact-us/ContactCardsSection';
import ContactInquirySection from '../components/Contact-us/ContactInquirySection';
import ContactMapSection from '../components/Contact-us/ContactMapSection';
import Preloader from '../components/common/Preloader';
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../services/wordpress';
import { getImageUrl } from '../utils/imageUrl';

const ContactUs = () => {
  const isPreview = Boolean(getPreviewContext());
  const [pageData, setPageData] = useState(() =>
    isPreview ? null : (getLocalDataSync('contact-page') || getLocalDataSync('contact-page?populate=*'))
  );
  const [loading, setLoading] = useState(isPreview);

  useEffect(() => {
    if (isPreview) return;
    const handleUpdate = () => {
      const fresh = getLocalDataSync('contact-page') || getLocalDataSync('contact-page?populate=*');
      if (fresh) setPageData(fresh);
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, [isPreview]);

  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      try {
        const data = await fetchWpData(
          'contact-page?populate[0]=heroImage&populate[1]=seo.ogImage&populate[2]=seo.twitterImage',
          { forceFresh: isPreview }
        );
        if (data && isMounted) setPageData(data);
      } catch (e) {
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    getData();
    return () => { isMounted = false; };
  }, [isPreview]);

  if (loading && !pageData) return <Preloader />;

  const heroTitle = pageData?.heroTitle || 'Get in Touch';
  const heroSubtitle = pageData?.heroSubtitle || 'Secure enterprise channel for infrastructure collaboration.';
  const heroBreadcrumb = pageData?.heroBreadcrumb || 'Contact';
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
    slug: 'contact-us',
    canonicalUrl: 'https://pislinfra.com/contact-us',
    ogType: 'website',
    twitterCardType: 'summary_large_image',
    schemaType: 'ContactPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    noIndex: false,
    noFollow: false,
    ...(pageData?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: pageData?.seo?.seoKeywords || resolvedFocusKeywords,
    ogTitle: pageData?.ogTitle || pageData?.seo?.ogTitle || resolvedTitle,
    ogDescription: pageData?.ogDescription || pageData?.seo?.ogDescription || resolvedDescription,
    ogImage: getImageUrl(pageData?.seo?.ogImage || pageData?.heroImage, '/images/hero/Contact-Us.png'),
    twitterTitle: pageData?.twitterTitle || pageData?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: pageData?.twitterDescription || pageData?.seo?.twitterDescription || resolvedDescription,
    twitterImage: getImageUrl(pageData?.seo?.twitterImage || pageData?.heroImage, '/images/hero/Contact-Us.png'),
    tags: pageData?.seo?.tags
      ? (typeof pageData.seo.tags === 'string' ? pageData.seo.tags.split(',').map(t => t.trim()) : pageData.seo.tags)
      : ['Contact', 'Inquiry', 'Quote', 'Industrial', 'Construction'],
    structuredData: pageData?.seo?.structuredData
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      
      <BlogSEO blog={seoData} />

      {pageData?.showHero !== false && (
        <PageHero
          title={heroTitle}
          subtitle={heroSubtitle}
          breadcrumb={heroBreadcrumb}
          bgImage={heroBg}
        />
      )}

      <div className="contact-sections" style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '60px', paddingTop: '40px' }}>
        {pageData?.showContactCards !== false && <ContactCardsSection pageData={pageData} />}
        {pageData?.showInquiry !== false && <ContactInquirySection pageData={pageData} />}
        {pageData?.showMap !== false && <ContactMapSection />}
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
