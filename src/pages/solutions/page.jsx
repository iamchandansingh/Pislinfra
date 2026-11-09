import React, { useState, useEffect } from 'react'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import { fetchStrapiData, getLocalDataSync } from '../../services/strapi'

const ServicesPage = () => {
  const [pageData, setPageData] = useState(() => {
    const raw = getLocalDataSync('solution-pages-solutions') || getLocalDataSync('solution-pages?filters[slug]=solutions&populate=*');
    if (raw) return Array.isArray(raw) ? raw[0] : raw;
    return null;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getLocalDataSync('solution-pages-solutions') || getLocalDataSync('solution-pages?filters[slug]=solutions&populate=*');
      if (fresh) setPageData(Array.isArray(fresh) ? fresh[0] : fresh);
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const getData = async (forceFresh = false) => {
      try {
        const res = await fetchStrapiData('solution-pages?filters[slug]=solutions&populate=*', { forceFresh });
        if (res && isMounted) {
          const item = Array.isArray(res) ? res[0] : res;
          if (item) setPageData(item);
        }
      } catch (err) {
        console.error("Error fetching solutions SEO data:", err);
      }
    };
    getData();
    return () => { isMounted = false; };
  }, []);

  const fallbackTitle = 'Construction & Infrastructure Solutions | Pislinfra';
  const fallbackDescription = "Explore Pislinfra's comprehensive construction and infrastructure solutions, combining technical expertise, quality execution and innovative approaches.";
  const fallbackPrimaryKeyword = 'Construction & Infrastructure Solutions';
  const fallbackFocusKeywords = 'Construction & Infrastructure Solutions, turnkey industrial EPC, warehouse construction, infrastructure solutions India';

  // Connect CMS Solutions page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
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
    seoKeywords: pageData?.seo?.seoKeywords || resolvedFocusKeywords || 'Construction & Infrastructure Solutions, industrial construction solutions, warehouse EPC company India, logistics park construction, PEB design build, civil infrastructure development, Pislinfra',
    slug: 'solutions',
    canonicalUrl: 'https://pislinfra.com/solutions',
    ogTitle: pageData?.ogTitle || pageData?.seo?.ogTitle || resolvedTitle,
    ogDescription: pageData?.ogDescription || pageData?.seo?.ogDescription || resolvedDescription,
    ogImage: pageData?.seo?.ogImage || 'https://pislinfra.com/images/hero/Service.png',
    ogType: 'website',
    twitterTitle: pageData?.twitterTitle || pageData?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: pageData?.twitterDescription || pageData?.seo?.twitterDescription || resolvedDescription,
    twitterImage: pageData?.seo?.twitterImage || 'https://pislinfra.com/images/hero/Service.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'Service',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Industrial Solutions', 'Warehouse Construction', 'Logistics Parks', 'Turnkey EPC', 'Civil Infrastructure'],
  };

  const imgStyle = {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px',
    border: '3px solid #ff8d4b',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
  };

  return (
    <div>
      <BlogSEO blog={seoData} />

      <PageHero 
        title="Our Solutions" 
        subtitle="Comprehensive infrastructure solutions tailored to your needs"
        breadcrumb="Solutions"
        bgImage="/images/hero/Service.png"
      />

      <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' }}>
        
        <div className="service-row" style={sectionStyle}>
          <div style={imageContainerStyle}>
            <img src="/images/Overview/3.png" alt="Design" style={imgStyle} />
          </div>
          <div style={contentStyle}>
            <h2 style={{ color: '#28296F', fontSize: '32px', marginBottom: '20px', fontWeight: 800 }}>Design</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
              Our team of dedicated architects and designers collaboratively envision and execute projects that redefine skylines and set new standards in architectural excellence. From conceptualisation to realisation, our vertical design approach ensures every project stands as a testament to our commitment to shaping environments that not only stand tall but also enrich lives. Explore our portfolio and witness the transformative power of design that reaches for the sky.
            </p>
          </div>
        </div>

        <div className="service-row" style={{ ...sectionStyle, flexDirection: 'row-reverse' }}>
          <div style={imageContainerStyle}>
            <img src="/images/Overview/12.png" alt="Construction" style={imgStyle} />
          </div>
          <div style={contentStyle}>
            <h2 style={{ color: '#28296F', fontSize: '32px', marginBottom: '20px', fontWeight: 800 }}>Construction</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
              We specialise in the vertical of construction that builds the backbone of industries. Our expertise lies in creating robust and efficient spaces that cater to the unique needs of warehousing and industrial operations. With a keen focus on functionality, durability, and optimised space utilisation, we construct vertical structures that seamlessly integrate with the industrial landscape.
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .service-row {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  )
}

const sectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '50px',
  flexWrap: 'wrap'
};

const imageContainerStyle = { flex: '1', minWidth: '300px' };
const contentStyle = { flex: '1', minWidth: '300px' };

export default ServicesPage
