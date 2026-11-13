import React, { useState, useEffect } from 'react'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import Preloader from '../../components/common/Preloader'
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../../services/wordpress'
import { getImageUrl } from '../../utils/imageUrl'

const ServicesPage = () => {
  const isPreview = Boolean(getPreviewContext());
  const [pageData, setPageData] = useState(() => {
    if (isPreview) return null;
    const raw = getLocalDataSync('solution-pages-solutions') || getLocalDataSync('solution-pages?filters[slug]=solutions&populate=*');
    if (raw) return Array.isArray(raw) ? raw[0] : raw;
    return null;
  });
  const [loading, setLoading] = useState(isPreview);

  useEffect(() => {
    if (isPreview) return;
    const handleUpdate = () => {
      const fresh = getLocalDataSync('solution-pages-solutions') || getLocalDataSync('solution-pages?filters[slug]=solutions&populate=*');
      if (fresh) setPageData(Array.isArray(fresh) ? fresh[0] : fresh);
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, [isPreview]);

  useEffect(() => {
    let isMounted = true;
    const getData = async (forceFresh = isPreview) => {
      try {
        const res = await fetchWpData('solution-pages?filters[slug]=solutions&populate=*', { forceFresh });
        if (res && isMounted) {
          const item = Array.isArray(res) ? res[0] : res;
          if (item) setPageData(item);
        }
      } catch (err) {
        console.error("Error fetching solutions SEO data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    getData(isPreview);
    return () => { isMounted = false; };
  }, [isPreview]);

  if (loading && !pageData) {
    return <Preloader />;
  }

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
  const resolvedSocialImage = getImageUrl(pageData?.seo?.ogImage || pageData?.heroImage, 'https://pislinfra.com/images/hero/Service.png');
  const resolvedTwitterImage = getImageUrl(pageData?.seo?.twitterImage || pageData?.seo?.ogImage || pageData?.heroImage, resolvedSocialImage);

  const seoData = {
    contentType: 'page',
    slug: 'solutions',
    canonicalUrl: 'https://pislinfra.com/solutions',
    ogType: 'website',
    twitterCardType: 'summary_large_image',
    schemaType: 'Service',
    breadcrumbSchema: true,
    organizationSchema: true,
    ...(pageData?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: pageData?.seo?.seoKeywords || resolvedFocusKeywords || 'Construction & Infrastructure Solutions, industrial construction solutions, warehouse EPC company India, logistics park construction, PEB design build, civil infrastructure development, Pislinfra',
    ogTitle: pageData?.ogTitle || pageData?.seo?.ogTitle || resolvedTitle,
    ogDescription: pageData?.ogDescription || pageData?.seo?.ogDescription || resolvedDescription,
    ogImage: resolvedSocialImage,
    twitterTitle: pageData?.twitterTitle || pageData?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: pageData?.twitterDescription || pageData?.seo?.twitterDescription || resolvedDescription,
    twitterImage: resolvedTwitterImage,
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

  const fallbackRows = [
    {
      id: 'design',
      title: 'Design',
      description: 'Our team of dedicated architects and designers collaboratively envision and execute projects that redefine skylines and set new standards in architectural excellence. From conceptualisation to realisation, our vertical design approach ensures every project stands as a testament to our commitment to shaping environments that not only stand tall but also enrich lives. Explore our portfolio and witness the transformative power of design that reaches for the sky.',
      image: '/images/Overview/3.png',
      imageAlt: 'Design',
    },
    {
      id: 'construction',
      title: 'Construction',
      description: 'We specialise in the vertical of construction that builds the backbone of industries. Our expertise lies in creating robust and efficient spaces that cater to the unique needs of warehousing and industrial operations. With a keen focus on functionality, durability, and optimised space utilisation, we construct vertical structures that seamlessly integrate with the industrial landscape.',
      image: '/images/Overview/12.png',
      imageAlt: 'Construction',
    },
  ];

  const cmsGridItems = Array.isArray(pageData?.grids) && Array.isArray(pageData.grids?.[0]?.items) && pageData.grids[0].items.length > 0
    ? pageData.grids[0].items
    : null;

  const serviceRows = (cmsGridItems || fallbackRows).map((row, idx) => {
    const fb = fallbackRows[idx % fallbackRows.length];
    return {
      id: row?.id || fb.id,
      title: row?.title || fb.title,
      description: row?.description || fb.description,
      image: getImageUrl(row?.image, fb.image) || fb.image,
      imageAlt: row?.imageAlt || row?.title || fb.imageAlt,
    };
  });

  return (
    <div>
      <BlogSEO blog={seoData} />

      {pageData?.showHero !== false && (
        <PageHero
          title={pageData?.mainFeatureTitle || "Our Solutions"}
          subtitle={pageData?.heroSubtitle || "Comprehensive infrastructure solutions tailored to your needs"}
          breadcrumb={pageData?.breadcrumb || "Solutions"}
          bgImage={getImageUrl(pageData?.heroImage, "/images/hero/Service.png")}
        />
      )}

      {pageData?.showIntro !== false && pageData?.introText && (
        <div style={{ padding: '60px 24px 0', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#333', maxWidth: '850px', margin: '0 auto' }}>
            {pageData.introText}
          </p>
        </div>
      )}

      {pageData?.showMainFeature !== false && (
        <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {serviceRows.map((row, idx) => (
            <div
              key={row.id || idx}
              className="service-row"
              style={idx % 2 === 1 ? { ...sectionStyle, flexDirection: 'row-reverse' } : sectionStyle}
            >
              <div style={imageContainerStyle}>
                <img src={row.image} alt={row.imageAlt} style={imgStyle} />
              </div>
              <div style={contentStyle}>
                <h2 style={{ color: '#28296F', fontSize: '32px', marginBottom: '20px', fontWeight: 800 }}>{row.title}</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                  {row.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

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
