import React, { useState, useEffect } from 'react'
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../../services/wordpress'
import { getImageUrl } from '../../utils/imageUrl'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import industrialBg from '../../assets/images/Project/complete/Pataudi-HR/flipkart-sampka-pataudi-hr.png'
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
  FaHandshake,
  FaThumbsUp,
  FaLightbulb,
  FaUsers,
  FaLayerGroup,
  FaRulerCombined,
  FaMapMarkedAlt,
  FaDraftingCompass,
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
  FaHandshake,
  FaThumbsUp,
  FaLightbulb,
  FaUsers,
  FaLayerGroup,
  FaRulerCombined,
  FaMapMarkedAlt,
  FaDraftingCompass,
};

const getIcon = (iconName, title = '') => {
  if (iconName && commonIcons[iconName]) return commonIcons[iconName];
  const t = (title || '').toLowerCase();
  if (t.includes('quality') || t.includes('services')) return FaAward;
  if (t.includes('expert') || t.includes('team')) return FaHardHat;
  if (t.includes('partner') || t.includes('trusted')) return FaHandshake;
  if (t.includes('satisfaction') || t.includes('client')) return FaThumbsUp;
  if (t.includes('innovation') || t.includes('continuous')) return FaLightbulb;
  if (t.includes('steel') || t.includes('structural')) return FaBuilding;
  if (t.includes('turnkey') || t.includes('epc')) return FaCogs;
  if (t.includes('safety') || t.includes('compliance')) return FaShieldAlt;
  return FaCheckCircle;
};



const defaultIndustrialData = {
  title: "Industrial Development",
  introText: "Pislinfra provides EPC, construction, infrastructure development, and industrial solutions across India.",
  mainFeatureTitle: "What is Industrial Development?",
  mainFeatureText: "Industrial development encompasses civil engineering, structural steel, foundation works, and utility infrastructure designed for factories and processing plants.",
  features: [
    { title: "Heavy Structural Steel", desc: "Engineered PEB & heavy structural fabrication.", icon: "FaBuilding" },
    { title: "Turnkey EPC Services", desc: "End-to-end design, civil construction, and commissioning.", icon: "FaCogs" },
    { title: "Safety & Compliance", desc: "Highest international safety protocols and ISO standard compliance.", icon: "FaShieldAlt" }
  ],
  whyPislTitle: "Why Choose Pislinfra for Industrial Construction?",
  whyPislText: "With over two decades of proven experience, PISL has delivered landmark industrial facilities across India."
};

const Industrial = () => {
  const isPreview = Boolean(getPreviewContext());
  const [data, setData] = useState(() => {
    if (isPreview) return null;
    const raw = getLocalDataSync('solution-pages-industrial') || getLocalDataSync('solution-pages?filters[slug]=industrial');
    if (raw) return Array.isArray(raw) ? (raw[0] || defaultIndustrialData) : raw;
    return defaultIndustrialData;
  });
  const [loading, setLoading] = useState(isPreview);

  useEffect(() => {
    if (isPreview) return;
    const handleUpdate = () => {
      const fresh = getLocalDataSync('solution-pages-industrial') || getLocalDataSync('solution-pages?filters[slug]=industrial');
      if (fresh) {
        setData(Array.isArray(fresh) ? (fresh[0] || defaultIndustrialData) : fresh);
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
          'solution-pages?filters[slug]=industrial&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=whyPislImage&populate[3]=features&populate[4]=seo',
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

  const activeData = data || defaultIndustrialData;

  const fallbackTitle = "Industrial Development Company In India | Pislinfra";
  const fallbackDescription = "Discover Pislinfra's industrial construction solutions, delivering reliable, efficient and quality-driven infrastructure for diverse industrial requirements across India.";
  const fallbackPrimaryKeyword = "Industrial Development";
  const fallbackFocusKeywords = "Industrial Development, industrial construction, turnkey EPC contractor India, factory building construction, heavy steel PEB fabrication, manufacturing infrastructure, Pislinfra";

  // Connect CMS Industrial Solutions page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = (activeData.metaTitle || activeData.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (activeData.metaDescription || activeData.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (activeData.primaryKeyword || activeData.seo?.primaryKeyword || fallbackPrimaryKeyword).trim();
  const resolvedFocusKeywords = (activeData.focusKeywords || activeData.seo?.focusKeywords || fallbackFocusKeywords).trim();

  const seoData = {
    contentType: 'page',
    slug: 'solutions/industrial',
    canonicalUrl: "https://pislinfra.com/solutions/industrial",
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
    ogImage: getImageUrl(activeData.seo?.ogImage || activeData.heroImage, 'https://pislinfra.com/images/hero/Industrial.png'),
    twitterTitle: activeData.twitterTitle || activeData.seo?.twitterTitle || resolvedTitle,
    twitterDescription: activeData.twitterDescription || activeData.seo?.twitterDescription || resolvedDescription,
    twitterImage: getImageUrl(activeData.seo?.twitterImage || activeData.heroImage, 'https://pislinfra.com/images/hero/Industrial.png'),
    tags: activeData.seo?.tags
      ? (typeof activeData.seo.tags === 'string' ? activeData.seo.tags.split(',').map(t => t.trim()) : activeData.seo.tags)
      : ['Industrial Construction', 'Manufacturing Plants', 'Turnkey EPC', 'Factory Engineering', 'PEB Structures'],
    structuredData: activeData.seo?.structuredData
  };

  const features = activeData.features || [];

  const whyPislGrid = (activeData.showWhyPisl !== false && (activeData.whyPislTitle || features.length > 0)) ? [{
    title: (
      <span>
        Why <span style={{ color: '#ff8755' }}>Pislinfra?</span>
      </span>
    ),
    description: activeData.whyPislDesc || "At Pislinfra, we thrive on harnessing the creativity of our focused team of engineers, designers, and workers. This collaborative synergy ensures the generation of fresh, inventive ideas, delivering unparalleled results for our clients across diverse industries.",
    titleColor: '#ffffff',
    descColor: '#e2e8f0',
    items: features.map(f => ({
      icon: getIcon(f.iconName || f.icon, f.title),
      title: f.title,
      desc: f.description || f.desc
    })),
    vertical: false,
    boxLayout: true,
    centeredItems: true,
    showNumbers: true,
    compact: true,
    circleAnimation: true,
    fullWidth: true,
    borderless: true,
    noOrangeBorder: true,
    bgImage: getImageUrl(activeData.whyPislImage, industrialBg),
    bgOverlay: 'linear-gradient(135deg, rgba(10, 42, 102, 0.72) 0%, rgba(30, 32, 95, 0.78) 100%)',
    imageFilter: 'brightness(0.92) contrast(1.05)',
    cardBg: '#ffffff',
    cardBorder: 'none',
    cardBottomBorder: 'none',
    cardShadow: '0 10px 30px rgba(0, 0, 0, 0.14)',
    iconBg: '#fff2ec',
    iconColor: '#ff8755',
    containerClass: 'industrial-advantages-section',
    containerStyle: {
      border: 'none',
      borderRadius: '0',
      boxShadow: 'none',
      padding: '75px 0',
    }
  }] : [];

  const allGrids = [...whyPislGrid, ...(Array.isArray(activeData.grids) ? activeData.grids : [])];

  const rawMainFeatureText = activeData.mainFeatureText || '';
  const textParts = rawMainFeatureText.split(/(?:###\s*)?Our Unique Methodologies & Approach/i);
  const introPart = textParts[0] ? textParts[0].trim() : rawMainFeatureText;
  const afterHeading = textParts[1] ? textParts[1].trim() : '';
  const methodologyParagraphs = afterHeading ? afterHeading.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean) : [];

  const methodologyP1 = methodologyParagraphs[0] || "Ranked among India's premier industrial construction firms, our commitment extends beyond mere project completion—we consider it incomplete until we precisely fulfil our client's unique requirements.";
  const methodologyP2 = methodologyParagraphs[1] || "Our methodologies and approach distinguish us from competitors, as we aspire not just to finish projects but to craft exceptional infrastructure and designs. We specialise in civil construction, which helps us construct mammoths and industries for their specific business goals and objectives.";

  const leftColumnContent = (
    <div>
      <div style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8', marginBottom: '24px' }}>
        {introPart ? (
          <div dangerouslySetInnerHTML={{ __html: introPart.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>') }} />
        ) : (
          <p style={{ margin: 0 }}>
            Industrial development is the dynamic process of creating, expanding, and optimising infrastructure and facilities within the industrial sector. It involves the strategic integration of technology, efficient resource management, and innovative warehouse design to foster economic growth, job creation, and the establishment of industrial ecosystems, driving progress and sustainability.
          </p>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '12px' }}>
          Our Unique Methodologies &amp; <span style={{ color: '#0a2a66' }}>Approach</span>
        </h3>
        <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
          {methodologyP1}
        </p>
      </div>
    </div>
  );

  return (
    <SolutionLayout
      seoData={seoData}
      hero={{
        show: activeData.showHero !== false,
        title: activeData.title || "Industrial Development",
        subtitle: activeData.heroSubtitle || "World-class industrial facilities and manufacturing plants",
        breadcrumb: activeData.breadcrumb || "Solutions / Industrial",
        bgImage: activeData.heroImage ? getImageUrl(activeData.heroImage, industrialBg) : industrialBg
      }}
      intro={activeData.showIntro !== false ? {
        text: activeData.introText ? (<div dangerouslySetInnerHTML={{ __html: activeData.introText.replace(/\n/g, '<br/>') }} />) : null
      } : null}
      mainFeature={activeData.showMainFeature !== false ? {
        title: (
          <span>
            {(() => {
              const words = (activeData.mainFeatureTitle || "What is Industrial Development?").split(' ');
              if (words.length <= 2) return <span style={{ color: '#0a2a66' }}>{words.join(' ')}</span>;
              const firstPart = words.slice(0, words.length - 2).join(' ');
              const lastPart = words.slice(-2).join(' ');
              return <>{firstPart} <span style={{ color: '#0a2a66' }}>{lastPart}</span></>;
            })()}
          </span>
        ),
        text: leftColumnContent,
        image: getImageUrl(activeData.mainFeatureImage, industrialBg),
        imageOverlayContent: methodologyP2,
        imageHeight: '410px',
        imageBorder: '2px solid #0a2a66'
      } : null}
      grids={allGrids}
    />
  )
}

export default Industrial