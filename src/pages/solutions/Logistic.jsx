import React, { useState, useEffect } from 'react'
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../../services/wordpress'
import { getImageUrl } from '../../utils/imageUrl'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import logisticBg from '../../assets/images/Project/complete/Farrukhnagar,NCR-2/all-cargo-logistics-park-farrukhnagar-hr-2.png'
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
  FaShippingFast,
  FaDraftingCompass,
  FaBoxes,
  FaLightbulb,
  FaBullseye,
  FaChartLine,
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
  FaShippingFast,
  FaDraftingCompass,
  FaBoxes,
  FaLightbulb,
  FaBullseye,
  FaChartLine,
};

const getIcon = (iconName, title = '') => {
  if (iconName && commonIcons[iconName]) return commonIcons[iconName];
  const t = (title || '').toLowerCase();
  if (t.includes('design') || t.includes('draft') || t.includes('plan')) return FaDraftingCompass;
  if (t.includes('construction') || t.includes('build') || t.includes('structure')) return FaHardHat;
  if (t.includes('procurement') || t.includes('sourcing') || t.includes('supply') || t.includes('box')) return FaBoxes;
  if (t.includes('cutting-edge') || t.includes('grade-a') || t.includes('space') || t.includes('warehousing')) return FaIndustry;
  if (t.includes('tech') || t.includes('innovation')) return FaLightbulb;
  if (t.includes('execution') || t.includes('precision')) return FaBullseye;
  if (t.includes('financial') || t.includes('strategic') || t.includes('safe') || t.includes('approach')) return FaChartLine;
  return FaIndustry;
};

const defaultLogisticData = {
  title: "Logistic Park Development",
  introText: "Pislinfra builds grade-A logistics parks and distribution hubs across major industrial corridors.",
  mainFeatureTitle: "Introduction",
  mainFeatureText: "PISL stands as India's premier construction company, renowned for delivering exceptional services across diverse sectors. With a vast portfolio exceeding 8 million sq. ft., PISL embodies enthusiasm, hard work, and integrity. Committed to excellence, we've successfully crafted numerous projects, spanning millions of square metres, over our 13-year journey. Our unwavering ethical standards and strong track record make us a trusted industry leader in logistic park development.",
  grids: [
    {
      id: 31,
      title: "Services (Design, Procurement & Construction)",
      description: null,
      items: [
        {
          id: 243,
          title: "Design",
          description: "PISL's design expertise transcends aesthetics, focusing on robust foundations that endure the test of time. Our dedicated architects envision and execute projects that redefine skylines, represent architectural excellence and enrich lives.",
          iconName: "FaDraftingCompass"
        },
        {
          id: 244,
          title: "Construction",
          description: "Pislinfra specialises in constructing industrial backbones with a keen eye on functionality, durability, and space optimisation. Our experienced team ensures meticulous planning and execution, delivering exceptional results. Whether it is large-scale warehouses or specialised facilities, our warehouse contractors contribute to streamlined operations and business growth.",
          iconName: "FaHardHat"
        },
        {
          id: 245,
          title: "Procurement",
          description: "Through smart sourcing, efficient procedures, and high-quality products, PISL's procurement sector offers considerable value. We ensure timely and cost-effective procurement with our vast network and industry experience, facilitating the flawless execution of warehousing and industrial initiatives.",
          iconName: "FaBoxes"
        }
      ]
    }
  ]
};

const Logistic = () => {
  const isPreview = Boolean(getPreviewContext());
  const [data, setData] = useState(() => {
    if (isPreview) return null;
    const raw = getLocalDataSync('solution-pages-logistic') || getLocalDataSync('solution-pages?filters[slug]=logistic');
    if (raw) return Array.isArray(raw) ? (raw[0] || defaultLogisticData) : raw;
    return defaultLogisticData;
  });
  const [loading, setLoading] = useState(isPreview);

  useEffect(() => {
    if (isPreview) return;
    const handleUpdate = () => {
      const fresh = getLocalDataSync('solution-pages-logistic') || getLocalDataSync('solution-pages?filters[slug]=logistic');
      if (fresh) {
        setData(Array.isArray(fresh) ? (fresh[0] || defaultLogisticData) : fresh);
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
          'solution-pages?filters[slug]=logistic&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=grids.items&populate[3]=seo',
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

  const activeData = data || defaultLogisticData;

  const fallbackTitle = "Logistics Park Development Company in India | Pislinfra";
  const fallbackDescription = "Pislinfra's develops Grade-A logistics parks across India with integrated design, procurement and construction solutions for modern supply chains.";
  const fallbackPrimaryKeyword = "Logistics Park Development";
  const fallbackFocusKeywords = "Logistics Park Development, Grade-A logistics parks, warehousing and logistics solutions, supply chain infrastructure India, Pislinfra";

  const resolvedTitle = (activeData.metaTitle || activeData.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (activeData.metaDescription || activeData.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (activeData.primaryKeyword || activeData.seo?.primaryKeyword || fallbackPrimaryKeyword).trim();
  const resolvedFocusKeywords = (activeData.focusKeywords || activeData.seo?.focusKeywords || fallbackFocusKeywords).trim();

  const seoData = {
    contentType: 'page',
    slug: 'solutions/logistic',
    canonicalUrl: "https://pislinfra.com/solutions/logistic",
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
    ogImage: getImageUrl(activeData.seo?.ogImage || activeData.heroImage, 'https://pislinfra.com/images/hero/Logistic.png'),
    twitterTitle: activeData.twitterTitle || activeData.seo?.twitterTitle || resolvedTitle,
    twitterDescription: activeData.twitterDescription || activeData.seo?.twitterDescription || resolvedDescription,
    twitterImage: getImageUrl(activeData.seo?.twitterImage || activeData.heroImage, 'https://pislinfra.com/images/hero/Logistic.png'),
    tags: activeData.seo?.tags
      ? (typeof activeData.seo.tags === 'string' ? activeData.seo.tags.split(',').map(t => t.trim()) : activeData.seo.tags)
      : ['Logistics Parks', 'Distribution Centers', 'Freight Infrastructure', 'Supply Chain Hubs', 'Multi-Modal Logistics'],
    structuredData: activeData.seo?.structuredData
  };

  const mapGridItems = (items) => {
    if (!items) return [];
    return items.map(item => ({
      icon: getIcon(item.iconName || item.icon, item.title),
      title: item.title ? item.title.replace(/^\d+[\.\s]+/, '') : '',
      desc: item.description || item.desc
    }));
  };

  const gridsArray = Array.isArray(activeData.grids) ? activeData.grids : (activeData.grids?.items ? [activeData.grids] : []);
  const dynamicGrids = gridsArray.map((grid, index) => {
    const isServices = index === 0 || (grid.title && grid.title.toLowerCase().includes('services'));
    if (isServices) {
      return {
        title: (
          <span>
            Services <span style={{ color: '#ff8755' }}>(Design, Procurement & Construction)</span>
          </span>
        ),
        description: grid.description,
        titleColor: '#ffffff',
        descColor: '#e2e8f0',
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
        bgImage: getImageUrl(activeData.heroImage || activeData.mainFeatureImage, logisticBg),
        bgOverlay: 'linear-gradient(135deg, rgba(10, 42, 102, 0.72) 0%, rgba(30, 32, 95, 0.78) 100%)',
        imageFilter: 'brightness(0.92) contrast(1.05)',
        cardBg: '#ffffff',
        cardBorder: 'none',
        cardBottomBorder: 'none',
        cardShadow: '0 10px 30px rgba(0, 0, 0, 0.14)',
        iconBg: '#fff2ec',
        iconColor: '#ff8755',
        containerClass: 'logistic-services-section',
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
        <span dangerouslySetInnerHTML={{
          __html: grid.title.replace(/\((.*?)\)/g, '<span style="color: #ff8755">($1)</span>')
        }} />
      ) : '',
      titleColor: '#0a2a66',
      description: grid.description,
      items: mapGridItems(grid.items),
      vertical: false,
      boxLayout: true,
      showNumbers: true,
      compact: true,
      circleAnimation: true,
      noOrangeBorder: true,
      borderWidth: '2px',
      cardBorder: '#edf2f7',
      columns: 'repeat(auto-fit, minmax(270px, 1fr))',
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
        title: activeData.title || "Logistic Park Development",
        subtitle: activeData.heroSubtitle || "Modern logistics & warehousing solutions",
        breadcrumb: activeData.breadcrumb || "Solutions / Logistic",
        bgImage: activeData.heroImage ? getImageUrl(activeData.heroImage, logisticBg) : logisticBg
      }}
      intro={activeData.showIntro !== false && activeData.introText ? {
        text: (<div dangerouslySetInnerHTML={{ __html: activeData.introText.replace(/\n/g, '<br/>') }} />)
      } : null}
      mainFeature={activeData.showMainFeature !== false ? {
        title: (
          <span>
            {(() => {
              const words = (activeData.mainFeatureTitle || "Introduction").split(' ');
              if (words.length === 1) return <span style={{ color: '#0a2a66' }}>{words[0]}</span>;
              const firstPart = words.slice(0, words.length - 1).join(' ');
              const lastPart = words.slice(-1).join(' ');
              return <>{firstPart} <span style={{ color: '#0a2a66' }}>{lastPart}</span></>;
            })()}
          </span>
        ),
        text: activeData.mainFeatureText ? (<div style={{ marginBottom: '16px', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: activeData.mainFeatureText.replace(/### (.*?)\n/g, '<h3 style="font-size: 22px; font-weight: bold; color: #2a2a75; margin-bottom: 16px; margin-top: 32px;">$1</h3>').replace(/\n\n/g, '<br/><br/>') }} />) : null,
        image: getImageUrl(activeData.mainFeatureImage, logisticBg)
      } : null}
      grids={dynamicGrids}
    />
  )
}

export default Logistic
