import React, { useState, useEffect } from 'react'
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../../services/wordpress'
import { getImageUrl } from '../../utils/imageUrl'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import infraBg from '../../assets/images/Project/complete/Bilaspur-NCR/amazon-del5-billaspur-hr-6.png'
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
  FaClock,
  FaUserTie,
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
  FaClock,
  FaUserTie,
};

const getIcon = (iconName, title = '') => {
  if (iconName && commonIcons[iconName]) return commonIcons[iconName];
  const t = (title || '').toLowerCase();
  if (t.includes('time') || t.includes('delivery') || t.includes('schedule') || t.includes('punctual')) return FaClock;
  if (t.includes('quality') || t.includes('excellence') || t.includes('standard')) return FaAward;
  if (t.includes('management') || t.includes('team') || t.includes('professional') || t.includes('expert')) return FaUserTie;
  if (t.includes('safety') || t.includes('shield') || t.includes('security') || t.includes('protection')) return FaShieldAlt;
  return FaAward;
};

const defaultInfrastructureData = {
  title: "Infrastructure Solutions",
  introText: "Pislinfra delivers robust infrastructure solutions across transportation, utility, and civil engineering projects.",
  mainFeatureTitle: "Infrastructure Development & Engineering",
  mainFeatureText: "Our infrastructure solutions provide sustainable, scalable, and resilient engineering for modern India.",
  features: [
    { title: "Civil Infrastructure", desc: "Roadways, bridges, and site development.", icon: "FaBuilding" },
    { title: "Utility Networks", desc: "Water supply, drainage, and power grid integration.", icon: "FaCogs" }
  ],
  whyPislTitle: "Why Partner with Pislinfra?",
  whyPislText: "Unmatched technical expertise and proven execution speed."
};

const Infrastructure = () => {
  const isPreview = Boolean(getPreviewContext());
  const [data, setData] = useState(() => {
    if (isPreview) return null;
    const raw = getLocalDataSync('solution-pages-infrastructure') || getLocalDataSync('solution-pages?filters[slug]=infrastructure');
    if (raw) return Array.isArray(raw) ? (raw[0] || defaultInfrastructureData) : raw;
    return defaultInfrastructureData;
  });
  const [loading, setLoading] = useState(isPreview);

  useEffect(() => {
    if (isPreview) return;
    const handleUpdate = () => {
      const fresh = getLocalDataSync('solution-pages-infrastructure') || getLocalDataSync('solution-pages?filters[slug]=infrastructure');
      if (fresh) {
        setData(Array.isArray(fresh) ? (fresh[0] || defaultInfrastructureData) : fresh);
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
          'solution-pages?filters[slug]=infrastructure&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=whyPislImage&populate[3]=features&populate[4]=seo',
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

  const activeData = data || defaultInfrastructureData;

  const fallbackTitle = "Infrastructure Development Company | Pislinfra";
  const fallbackDescription = "Explore Pislinfra’s infrastructure construction solutions, combining engineering expertise, quality execution and reliable project delivery for complex developments.";
  const fallbackPrimaryKeyword = "Infrastructure Development";
  const fallbackFocusKeywords = "Infrastructure Development, infrastructure construction solutions, civil infrastructure, engineering expertise, complex developments India, Pislinfra";

  const resolvedTitle = (activeData.metaTitle || activeData.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (activeData.metaDescription || activeData.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (activeData.primaryKeyword || activeData.seo?.primaryKeyword || fallbackPrimaryKeyword).trim();
  const resolvedFocusKeywords = (activeData.focusKeywords || activeData.seo?.focusKeywords || fallbackFocusKeywords).trim();

  const seoData = {
    contentType: 'page',
    slug: 'solutions/infrastructure',
    canonicalUrl: "https://pislinfra.com/solutions/infrastructure",
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
    ogImage: getImageUrl(activeData.seo?.ogImage || activeData.heroImage, 'https://pislinfra.com/images/hero/Infrastructure.png'),
    twitterTitle: activeData.twitterTitle || activeData.seo?.twitterTitle || resolvedTitle,
    twitterDescription: activeData.twitterDescription || activeData.seo?.twitterDescription || resolvedDescription,
    twitterImage: getImageUrl(activeData.seo?.twitterImage || activeData.heroImage, 'https://pislinfra.com/images/hero/Infrastructure.png'),
    tags: activeData.seo?.tags
      ? (typeof activeData.seo.tags === 'string' ? activeData.seo.tags.split(',').map(t => t.trim()) : activeData.seo.tags)
      : ['Civil Infrastructure', 'Industrial Utilities', 'Road Networks', 'Heavy Engineering', 'Earthworks'],
    structuredData: activeData.seo?.structuredData
  };

  const features = activeData.features || [];

  const whyPislGrid = (activeData.showWhyPisl !== false && (activeData.whyPislTitle || features.length > 0)) ? [{
    title: (
      <span>
        What Differentiates <span style={{ color: '#ff8755' }}>Us?</span>
      </span>
    ),
    description: activeData.whyPislDesc || "Our steadfast dedication to essential distinguishing qualities demonstrates our commitment to attaining operational excellence and maintaining the highest industry standards.",
    titleColor: '#ffffff',
    descColor: '#e2e8f0',
    items: features.map(f => ({
      icon: getIcon(f.iconName || f.icon, f.title),
      title: f.title,
      desc: f.description || f.desc
    })),
    vertical: false,
    boxLayout: true,
    showNumbers: true,
    compact: true,
    circleAnimation: true,
    fullWidth: true,
    borderless: true,
    noOrangeBorder: true,
    columns: 'repeat(auto-fit, minmax(260px, 1fr))',
    bgImage: getImageUrl(activeData.whyPislImage, infraBg),
    bgOverlay: 'linear-gradient(135deg, rgba(10, 42, 102, 0.72) 0%, rgba(30, 32, 95, 0.78) 100%)',
    imageFilter: 'brightness(0.92) contrast(1.05)',
    cardBg: '#ffffff',
    cardBorder: 'none',
    cardBottomBorder: 'none',
    cardShadow: '0 10px 30px rgba(0, 0, 0, 0.14)',
    iconBg: '#fff2ec',
    iconColor: '#ff8755',
    containerClass: 'infrastructure-advantages-section',
    containerStyle: {
      border: 'none',
      borderRadius: '0',
      boxShadow: 'none',
      padding: '75px 0',
    }
  }] : [];

  const allGrids = [...whyPislGrid, ...(Array.isArray(activeData.grids) ? activeData.grids : [])];

  const rawMainFeatureText = activeData.mainFeatureText || '';
  const textParts = rawMainFeatureText.split(/(?:###\s*)?Services Offered by Pislinfra/i);
  const introPart = textParts[0] ? textParts[0].trim() : rawMainFeatureText;
  const afterServices = textParts[1] ? textParts[1].trim() : '';

  const methodParts = afterServices.split(/(?:###\s*)?Our methodologies and approach/i);
  const servicesOnly = methodParts[0] ? methodParts[0].trim() : afterServices;
  const methodologiesOnly = methodParts[1]
    ? `Our methodologies and approach ${methodParts[1].trim()}`
    : "Our methodologies and approach distinguish us from competitors, as we aspire not just to finish projects but to craft exceptional infrastructure and designs. We specialise in civil construction, which helps us construct mammoths and industries for their specific business goals and objectives.";

  const leftColumnContent = (
    <div>
      <div style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8', marginBottom: '24px' }}>
        {introPart ? (
          <div dangerouslySetInnerHTML={{ __html: introPart.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>') }} />
        ) : (
          <p style={{ margin: 0 }}>
            Infrastructure development is the foundational framework that sustains a society's operational functions and enhances the quality of life. The scope encompasses the design, construction, and maintenance of essential facilities like roads, bridges, water supply systems, and energy networks. Beyond mere physical structures, it acts as the catalyst for economic growth and societal progress.
          </p>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '12px' }}>
          Services Offered by <span style={{ color: '#0a2a66' }}>Pislinfra</span>
        </h3>
        {servicesOnly ? (
          <div
            style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: servicesOnly.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>') }}
          />
        ) : (
          <>
            <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8', marginBottom: '12px' }}>
              PISL is an infrastructure development firm that oversees all stages of construction.
            </p>
            <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
              We take pride in building world-class manufacturing infrastructures. We firmly believe our construction process makes us a one-stop solution for major infrastructure developments. The company works closely with the stakeholders and clients to design effective and robust spaces. PISL works towards optimising resources without compromising the quality of final products.
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <SolutionLayout
      seoData={seoData}
      hero={{
        show: activeData.showHero !== false,
        title: activeData.title || "Infrastructure Development",
        subtitle: activeData.heroSubtitle || "Building the foundation for tomorrow's growth",
        breadcrumb: activeData.breadcrumb || "Solutions / Infrastructure",
        bgImage: activeData.heroImage ? getImageUrl(activeData.heroImage, infraBg) : infraBg
      }}
      intro={activeData.showIntro !== false ? {
        text: activeData.introText ? (<div dangerouslySetInnerHTML={{ __html: activeData.introText.replace(/\n/g, '<br/>') }} />) : null
      } : null}
      mainFeature={activeData.showMainFeature !== false ? {
        title: (
          <span>
            {(() => {
              const words = (activeData.mainFeatureTitle || "Introduction to Infrastructure Development").split(' ');
              if (words.length <= 2) return <span style={{ color: '#0a2a66' }}>{words.join(' ')}</span>;
              const firstPart = words.slice(0, words.length - 2).join(' ');
              const lastPart = words.slice(-2).join(' ');
              return <>{firstPart} <span style={{ color: '#0a2a66' }}>{lastPart}</span></>;
            })()}
          </span>
        ),
        text: leftColumnContent,
        image: getImageUrl(activeData.mainFeatureImage, infraBg),
        imageOverlayContent: methodologiesOnly,
        imageHeight: '410px',
        imageBorder: '2px solid #0a2a66'
      } : null}
      grids={allGrids}
    />
  )
}

export default Infrastructure
