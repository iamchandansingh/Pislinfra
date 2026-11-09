import React, { useState, useEffect } from 'react'
import { fetchStrapiData, getLocalDataSync } from '../../services/strapi'
import { getImageUrl } from '../../utils/imageUrl'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import warehouseBg from '../../assets/images/Project/complete/Bilaspur-NCR/amazon-del5-billaspur-hr-5.png'
import { FaCircle, FaCheck, FaBuilding, FaWarehouse, FaTruck, FaIndustry } from 'react-icons/fa';
import Preloader from '../../components/common/Preloader';

const commonIcons = {
  FaCircle,
  FaCheck,
  FaBuilding,
  FaWarehouse,
  FaTruck,
  FaIndustry,
};

const getIcon = (iconName) => {
  if (iconName && commonIcons[iconName]) return commonIcons[iconName];
  return FaCircle;
};



const defaultWarehouseData = {
  title: "Warehousing Solutions",
  introText: "Pislinfra specializes in designing and constructing LEED-certified warehousing facilities.",
  mainFeatureTitle: "Grade-A Warehousing",
  mainFeatureText: "High-bay warehousing with FM2 floor specifications, thermal insulation, and energy-efficient systems.",
  grids: { items: [] }
};

const Warehouse = () => {
  const [data, setData] = useState(() => {
    const raw = getLocalDataSync('solution-pages-warehouse') || getLocalDataSync('solution-pages?filters[slug]=warehouse');
    if (raw) return Array.isArray(raw) ? (raw[0] || defaultWarehouseData) : raw;
    return defaultWarehouseData;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getLocalDataSync('solution-pages-warehouse') || getLocalDataSync('solution-pages?filters[slug]=warehouse');
      if (fresh) {
        setData(Array.isArray(fresh) ? (fresh[0] || defaultWarehouseData) : fresh);
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const response = await fetchStrapiData('solution-pages?filters[slug]=warehouse&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=grids.items&populate[3]=seo');
        if (response && isMounted) {
          if (Array.isArray(response) && response.length > 0) {
            setData(response[0]);
          } else if (!Array.isArray(response)) {
            setData(response);
          }
        }
      } catch (err) {
        // Fallback remains active
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  if (loading && !data) return <Preloader />;

  const fallbackTitle = "Warehouse Construction Company in India | Pislinfra";
  const fallbackDescription = "Pislinfra's delivers design-build warehouse construction solutions across India, creating efficient, scalable and future-ready facilities for businesses.";
  const fallbackPrimaryKeyword = "Warehouse Construction Company";
  const fallbackFocusKeywords = "Warehouse Construction Company, design-build warehouse construction, warehouse solutions India, future-ready facilities, Pislinfra";

  // Connect CMS Warehouse Solutions page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = (data.metaTitle || data.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (data.metaDescription || data.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (data.primaryKeyword || data.seo?.primaryKeyword || fallbackPrimaryKeyword).trim();
  const resolvedFocusKeywords = (data.focusKeywords || data.seo?.focusKeywords || fallbackFocusKeywords).trim();

  const seoData = {
    contentType: 'page',
    ...(data.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: data.seo?.seoKeywords || resolvedFocusKeywords,
    slug: 'solutions/warehouse',
    canonicalUrl: data.seo?.canonicalUrl || "https://pislinfra.com/solutions/warehouse",
    ogTitle: data.ogTitle || data.seo?.ogTitle || resolvedTitle,
    ogDescription: data.ogDescription || data.seo?.ogDescription || resolvedDescription,
    ogImage: getImageUrl(data.seo?.ogImage || data.heroImage, 'https://pislinfra.com/images/hero/Warehouse.png'),
    ogType: data.seo?.ogType || 'website',
    twitterTitle: data.twitterTitle || data.seo?.twitterTitle || resolvedTitle,
    twitterDescription: data.twitterDescription || data.seo?.twitterDescription || resolvedDescription,
    twitterImage: getImageUrl(data.seo?.twitterImage || data.heroImage, 'https://pislinfra.com/images/hero/Warehouse.png'),
    twitterCardType: data.seo?.twitterCardType || 'summary_large_image',
    schemaType: data.seo?.schemaType || 'Service',
    breadcrumbSchema: data.seo?.breadcrumbSchema !== undefined ? data.seo.breadcrumbSchema : true,
    organizationSchema: data.seo?.organizationSchema !== undefined ? data.seo.organizationSchema : true,
    tags: data.seo?.tags ? (typeof data.seo.tags === 'string' ? data.seo.tags.split(',').map(t => t.trim()) : data.seo.tags) : ['Warehouse Construction', 'LEED Certified Warehousing', 'PEB Industrial Buildings', 'FM2 Superflat Floors', 'Cold Storage Facilities'],
    noIndex: data.seo?.noIndex || false,
    noFollow: data.seo?.noFollow || false,
    structuredData: data.seo?.structuredData
  };

  const mapGridItems = (items) => {
    if (!items) return [];
    return items.map(item => ({
      icon: getIcon(item.icon),
      title: item.title,
      desc: item.description || item.desc
    }));
  };

  const gridsArray = Array.isArray(data.grids) ? data.grids : (data.grids?.items ? [data.grids] : []);
  const dynamicGrids = gridsArray.map(grid => ({
    title: grid.title ? <span dangerouslySetInnerHTML={{ __html: grid.title.replace(/\((.*?)\)/g, '<span style="color: #0a2a66">($1)</span>') }} /> : '',
    description: grid.description,
    items: mapGridItems(grid.items),
    vertical: grid.vertical,
    minWidth: grid.minWidth,
    cardBg: grid.cardBg,
    cardBorder: grid.cardBorder,
    iconBg: grid.iconBg,
    iconColor: grid.iconColor
  }));

  return (
    <SolutionLayout
      seoData={seoData}
      hero={{
        title: "Warehouse Contractors",
        subtitle: "State-of-the-art storage & distribution centers",
        breadcrumb: "Solutions / Warehouse",
        bgImage: data.heroImage ? getImageUrl(data.heroImage, warehouseBg) : warehouseBg
      }}
      mainFeature={{
        title: (
          <span>
            {(() => {
              const words = (data.mainFeatureTitle || "Design-Build Solutions").split(' ');
              if (words.length === 1) return <span style={{ color: '#0a2a66' }}>{words[0]}</span>;
              const firstPart = words.slice(0, words.length - 1).join(' ');
              const lastPart = words.slice(-1).join(' ');
              return <>{firstPart} <span style={{ color: '#0a2a66' }}>{lastPart}</span></>;
            })()}
          </span>
        ),
        text: data.mainFeatureText ? (
          <div style={{ marginBottom: '16px', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: data.mainFeatureText.replace(/### (.*?)\n/g, '<h3 style="font-size: 22px; font-weight: bold; color: #2a2a75; margin-bottom: 16px; margin-top: 32px;">$1</h3>').replace(/\n\n/g, '<br/><br/>') }} />
        ) : null,
        image: data.mainFeatureImage ? getImageUrl(data.mainFeatureImage, warehouseBg) : null
      }}
      grids={dynamicGrids}
    />
  )
}

export default Warehouse