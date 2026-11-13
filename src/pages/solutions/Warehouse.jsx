import React, { useState, useEffect } from 'react'
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../../services/wordpress'
import { getImageUrl } from '../../utils/imageUrl'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import warehouseBg from '../../assets/images/Project/complete/Bilaspur-NCR/amazon-del5-billaspur-hr-5.png'
import {
  FaCircle,
  FaCheck,
  FaCheckCircle,
  FaBuilding,
  FaWarehouse,
  FaTruck,
  FaIndustry,
  FaCogs,
  FaShieldAlt,
  FaTools,
  FaAward,
  FaHardHat,
  FaCubes,
  FaLayerGroup,
  FaColumns,
  FaRulerCombined,
  FaMapMarkedAlt,
  FaDraftingCompass,
  FaBoxes,
  FaThLarge,
} from 'react-icons/fa';
import Preloader from '../../components/common/Preloader';

const commonIcons = {
  FaCircle,
  FaCheck,
  FaCheckCircle,
  FaBuilding,
  FaWarehouse,
  FaTruck,
  FaIndustry,
  FaCogs,
  FaShieldAlt,
  FaTools,
  FaAward,
  FaHardHat,
  FaCubes,
  FaLayerGroup,
  FaColumns,
  FaRulerCombined,
  FaMapMarkedAlt,
  FaDraftingCompass,
  FaBoxes,
  FaThLarge,
};

const getIcon = (iconName, title = '') => {
  if (iconName && commonIcons[iconName]) return commonIcons[iconName];

  const t = (title || '').toLowerCase();
  if (t.includes('floor')) return FaLayerGroup;
  if (t.includes('wall')) return FaBuilding;
  if (t.includes('structure')) return FaWarehouse;
  if (t.includes('bay') || t.includes('sizing')) return FaRulerCombined;
  if (t.includes('system')) return FaCogs;
  if (t.includes('site') || t.includes('selection')) return FaMapMarkedAlt;
  if (t.includes('design-build') || t.includes('strategy')) return FaDraftingCompass;
  if (t.includes('delivery') || t.includes('integrated')) return FaHardHat;
  if (t.includes('risk') || t.includes('minimisation') || t.includes('minimization')) return FaShieldAlt;

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
  const isPreview = Boolean(getPreviewContext());
  const [data, setData] = useState(() => {
    if (isPreview) return null;
    const raw = getLocalDataSync('solution-pages-warehouse') || getLocalDataSync('solution-pages?filters[slug]=warehouse');
    if (raw) return Array.isArray(raw) ? (raw[0] || defaultWarehouseData) : raw;
    return defaultWarehouseData;
  });
  const [loading, setLoading] = useState(isPreview);

  useEffect(() => {
    if (isPreview) return;
    const handleUpdate = () => {
      const fresh = getLocalDataSync('solution-pages-warehouse') || getLocalDataSync('solution-pages?filters[slug]=warehouse');
      if (fresh) {
        setData(Array.isArray(fresh) ? (fresh[0] || defaultWarehouseData) : fresh);
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, [isPreview]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const response = await fetchWpData(
          'solution-pages?filters[slug]=warehouse&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=grids.items&populate[3]=seo',
          { forceFresh: isPreview }
        );
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
  }, [isPreview]);

  if (loading && !data) return <Preloader />;

  const activeData = data || defaultWarehouseData;

  const fallbackTitle = "Warehouse Construction Company in India | Pislinfra";
  const fallbackDescription = "Pislinfra's delivers design-build warehouse construction solutions across India, creating efficient, scalable and future-ready facilities for businesses.";
  const fallbackPrimaryKeyword = "Warehouse Construction Company";
  const fallbackFocusKeywords = "Warehouse Construction Company, design-build warehouse construction, warehouse solutions India, future-ready facilities, Pislinfra";

  // Connect CMS Warehouse Solutions page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = (activeData.metaTitle || activeData.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (activeData.metaDescription || activeData.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (activeData.primaryKeyword || activeData.seo?.primaryKeyword || fallbackPrimaryKeyword).trim();
  const resolvedFocusKeywords = (activeData.focusKeywords || activeData.seo?.focusKeywords || fallbackFocusKeywords).trim();

  const seoData = {
    contentType: 'page',
    slug: 'solutions/warehouse',
    canonicalUrl: "https://pislinfra.com/solutions/warehouse",
    ogType: 'website',
    twitterCardType: 'summary_large_image',
    schemaType: 'Service',
    breadcrumbSchema: true,
    organizationSchema: true,
    noIndex: false,
    noFollow: false,
    ...(activeData.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: activeData.seo?.seoKeywords || resolvedFocusKeywords,
    ogTitle: activeData.ogTitle || activeData.seo?.ogTitle || resolvedTitle,
    ogDescription: activeData.ogDescription || activeData.seo?.ogDescription || resolvedDescription,
    ogImage: getImageUrl(activeData.seo?.ogImage || activeData.heroImage, 'https://pislinfra.com/images/hero/Warehouse.png'),
    twitterTitle: activeData.twitterTitle || activeData.seo?.twitterTitle || resolvedTitle,
    twitterDescription: activeData.twitterDescription || activeData.seo?.twitterDescription || resolvedDescription,
    twitterImage: getImageUrl(activeData.seo?.twitterImage || activeData.heroImage, 'https://pislinfra.com/images/hero/Warehouse.png'),
    tags: activeData.seo?.tags
      ? (typeof activeData.seo.tags === 'string' ? activeData.seo.tags.split(',').map(t => t.trim()) : activeData.seo.tags)
      : ['Warehouse Construction', 'LEED Certified Warehousing', 'PEB Industrial Buildings', 'FM2 Superflat Floors', 'Cold Storage Facilities'],
    structuredData: activeData.seo?.structuredData
  };

  const mapGridItems = (items) => {
    if (!items) return [];
    return items.map(item => ({
      icon: getIcon(item.iconName || item.icon, item.title),
      title: item.title ? item.title.replace(/^\d+\.\s*/, '') : '',
      desc: item.description || item.desc
    }));
  };

  const gridsArray = Array.isArray(activeData.grids) ? activeData.grids : (activeData.grids?.items ? [activeData.grids] : []);
  const dynamicGrids = gridsArray.map((grid, index) => {
    const isConsiderations = index === 0 || (grid.title && String(grid.title).toLowerCase().includes('consideration'));
    if (isConsiderations) {
      return {
        title: grid.title ? (
          <span
            dangerouslySetInnerHTML={{
              __html: grid.title.replace(/\((.*?)\)/g, '<span style="color: #ff8755">($1)</span>')
            }}
          />
        ) : '',
        titleColor: '#ffffff',
        descColor: '#e2e8f0',
        description: grid.description,
        items: mapGridItems(grid.items),
        vertical: false,
        boxLayout: true,
        showNumbers: true,
        compact: true,
        fullWidth: true,
        borderless: true,
        noOrangeBorder: true,
        circleAnimation: true,
        columns: 'repeat(auto-fit, minmax(320px, 1fr))',
        bgImage: warehouseBg,
        bgOverlay: 'linear-gradient(135deg, rgba(10, 42, 102, 0.72) 0%, rgba(30, 32, 95, 0.78) 100%)',
        imageFilter: 'brightness(0.92) contrast(1.05)',
        cardBg: '#ffffff',
        cardBorder: 'none',
        cardBottomBorder: 'none',
        cardShadow: '0 10px 30px rgba(0, 0, 0, 0.14)',
        iconBg: '#fff2ec',
        iconColor: '#ff8755',
        containerClass: 'warehouse-considerations-section',
        containerStyle: {
          border: 'none',
          borderRadius: '0',
          boxShadow: 'none',
          padding: '75px 0',
        }
      };
    }

    return {
      title: grid.title ? (
        <span
          dangerouslySetInnerHTML={{
            __html: grid.title.replace(/\((.*?)\)/g, '<span style="color: #ff8755">($1)</span>')
          }}
        />
      ) : '',
      titleColor: '#0a2a66',
      description: grid.description,
      items: mapGridItems(grid.items),
      vertical: false,
      boxLayout: true,
      showNumbers: true,
      compact: true,
      noOrangeBorder: true,
      borderWidth: '2px',
      cardBorder: '#edf2f7',
      circleAnimation: true,
      columns: 'repeat(auto-fit, minmax(320px, 1fr))',
      cardBg: '#ffffff',
      iconBg: '#fff2ec',
      iconColor: '#ff8755',
      cardShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
      cardStyle: {
        border: '2px solid #edf2f7'
      }
    };
  });

  return (
    <SolutionLayout
      seoData={seoData}
      hero={{
        show: activeData.showHero !== false,
        title: activeData.title || "Warehouse Contractors",
        subtitle: activeData.heroSubtitle || "State-of-the-art storage & distribution centers",
        breadcrumb: activeData.breadcrumb || "Solutions / Warehouse",
        bgImage: activeData.heroImage ? getImageUrl(activeData.heroImage, warehouseBg) : warehouseBg
      }}
      intro={activeData.showIntro !== false && activeData.introText ? {
        text: (<div dangerouslySetInnerHTML={{ __html: activeData.introText.replace(/\n/g, '<br/>') }} />)
      } : null}
      mainFeature={activeData.showMainFeature !== false ? {
        title: (
          <span>
            {(() => {
              const words = (activeData.mainFeatureTitle || "Design-Build Solutions").split(' ');
              if (words.length === 1) return <span style={{ color: '#0a2a66' }}>{words[0]}</span>;
              const firstPart = words.slice(0, words.length - 1).join(' ');
              const lastPart = words.slice(-1).join(' ');
              return <>{firstPart} <span style={{ color: '#0a2a66' }}>{lastPart}</span></>;
            })()}
          </span>
        ),
        text: activeData.mainFeatureText ? (
          <div style={{ marginBottom: '16px', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: activeData.mainFeatureText.replace(/### (.*?)\n/g, '<h3 style="font-size: 22px; font-weight: bold; color: #2a2a75; margin-bottom: 16px; margin-top: 32px;">$1</h3>').replace(/\n\n/g, '<br/><br/>') }} />
        ) : null,
        image: activeData.mainFeatureImage ? getImageUrl(activeData.mainFeatureImage, warehouseBg) : null,
        imageBorder: '2px solid #0a2a66'
      } : null}
      grids={dynamicGrids}
    />
  )
}

export default Warehouse