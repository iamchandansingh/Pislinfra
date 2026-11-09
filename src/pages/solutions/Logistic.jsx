import React, { useState, useEffect } from 'react'
import { fetchStrapiData, getLocalDataSync } from '../../services/strapi'
import { getImageUrl } from '../../utils/imageUrl'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import logisticBg from '../../assets/images/Project/complete/Farrukhnagar,NCR-2/all-cargo-logistics-park-farrukhnagar-hr-2.png'
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



const defaultLogisticData = {
  title: "Logistics Parks",
  introText: "Pislinfra builds grade-A logistics parks and distribution hubs across major industrial corridors.",
  mainFeatureTitle: "Modern Logistics Infrastructure",
  mainFeatureText: "Strategic location design, PEB structures, high-load flooring, and integrated security for logistics parks.",
  grids: { items: [] }
};

const Logistic = () => {
  const [data, setData] = useState(() => {
    const raw = getLocalDataSync('solution-pages-logistic') || getLocalDataSync('solution-pages?filters[slug]=logistic');
    if (raw) return Array.isArray(raw) ? (raw[0] || defaultLogisticData) : raw;
    return defaultLogisticData;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getLocalDataSync('solution-pages-logistic') || getLocalDataSync('solution-pages?filters[slug]=logistic');
      if (fresh) {
        setData(Array.isArray(fresh) ? (fresh[0] || defaultLogisticData) : fresh);
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const response = await fetchStrapiData('solution-pages?filters[slug]=logistic&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=grids.items&populate[3]=seo');
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

  const fallbackTitle = "Logistics Park Development Company in India | Pislinfra";
  const fallbackDescription = "Pislinfra's develops Grade-A logistics parks across India with integrated design, procurement and construction solutions for modern supply chains.";
  const fallbackPrimaryKeyword = "Logistics Park Development";
  const fallbackFocusKeywords = "Logistics Park Development, Grade-A logistics parks, warehousing and logistics solutions, supply chain infrastructure India, Pislinfra";

  // Connect CMS Logistics Solutions page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
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
    slug: 'solutions/logistic',
    canonicalUrl: data.seo?.canonicalUrl || "https://pislinfra.com/solutions/logistic",
    ogTitle: data.ogTitle || data.seo?.ogTitle || resolvedTitle,
    ogDescription: data.ogDescription || data.seo?.ogDescription || resolvedDescription,
    ogImage: getImageUrl(data.seo?.ogImage || data.heroImage, 'https://pislinfra.com/images/hero/Logistic.png'),
    ogType: data.seo?.ogType || 'website',
    twitterTitle: data.twitterTitle || data.seo?.twitterTitle || resolvedTitle,
    twitterDescription: data.twitterDescription || data.seo?.twitterDescription || resolvedDescription,
    twitterImage: getImageUrl(data.seo?.twitterImage || data.heroImage, 'https://pislinfra.com/images/hero/Logistic.png'),
    twitterCardType: data.seo?.twitterCardType || 'summary_large_image',
    schemaType: data.seo?.schemaType || 'Service',
    breadcrumbSchema: data.seo?.breadcrumbSchema !== undefined ? data.seo.breadcrumbSchema : true,
    organizationSchema: data.seo?.organizationSchema !== undefined ? data.seo.organizationSchema : true,
    tags: data.seo?.tags ? (typeof data.seo.tags === 'string' ? data.seo.tags.split(',').map(t => t.trim()) : data.seo.tags) : ['Logistics Parks', 'Distribution Centers', 'Freight Infrastructure', 'Supply Chain Hubs', 'Multi-Modal Logistics'],
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
        title: "Logistic Park Development",
        subtitle: "Modern logistics & warehousing solutions",
        breadcrumb: "Solutions / Logistic",
        bgImage: data.heroImage ? getImageUrl(data.heroImage, logisticBg) : logisticBg
      }}
      mainFeature={{
        title: (
          <span>
            {(() => {
              const words = (data.mainFeatureTitle || "Introduction").split(' ');
              if (words.length === 1) return <span style={{ color: '#0a2a66' }}>{words[0]}</span>;
              const firstPart = words.slice(0, words.length - 1).join(' ');
              const lastPart = words.slice(-1).join(' ');
              return <>{firstPart} <span style={{ color: '#0a2a66' }}>{lastPart}</span></>;
            })()}
          </span>
        ),
        text: data.mainFeatureText ? (<div style={{ marginBottom: '16px', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: data.mainFeatureText.replace(/### (.*?)\n/g, '<h3 style="font-size: 22px; font-weight: bold; color: #2a2a75; margin-bottom: 16px; margin-top: 32px;">$1</h3>').replace(/\n\n/g, '<br/><br/>') }} />) : null,
        image: getImageUrl(data.mainFeatureImage, logisticBg)
      }}
      grids={dynamicGrids}
    />
  )
}

export default Logistic