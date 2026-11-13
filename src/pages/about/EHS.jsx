import React, { useState, useEffect } from 'react'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import EHSStats from '../../components/ehs/EHSStats'
import SafeManHoursAndCommitment from '../../components/ehs/SafeManHoursAndCommitment'
import LifeSavingRules from '../../components/ehs/LifeSavingRules'
import EHSSafetyPrograms from '../../components/ehs/EHSSafetyPrograms'
import EHSPillarsAndPrograms from '../../components/ehs/EHSPillarsAndPrograms'
import CertificationsAndEHSAction from '../../components/ehs/CertificationsAndEHSAction'
import SafetyApproach from '../../components/safety/SafetyApproach';
import SafetyCulture from '../../components/safety/SafetyCulture';
import SafetyPhilosophy from '../../components/safety/SafetyPhilosophy';
import IndustryRecognition from '../../components/safety/IndustryRecognition';
import SafetyResources from '../../components/safety/SafetyResources';
import { fetchWpData, getWpMediaUrl, getLocalDataSync, getPreviewContext } from '../../services/wordpress';
import Preloader from '../../components/common/Preloader';

const getImageUrl = (imgObj, defaultImg) => {
  return getWpMediaUrl(imgObj, defaultImg);
};

const defaultEHSData = {
  title: 'Environment, Health & Safety',
  subtitle: 'Committed to Zero-Harm Standards and Sustainable Infrastructure',
  breadcrumb: 'About Us / EHS',
  heroImage: '/images/hero/EHS.png',
  commitmentTitle: 'Safe Man-Hours & Uncompromising Safety Commitment',
  philosophySectionTitle: 'Latest HSE Statistics',
  approachesSectionTitle: 'Our Safety Approach',
  approachesSectionSubtitle: 'Systematic Protocols Across Construction Operations',
  rulesSectionTitle: '12 Life-Saving Rules',
  rulesSectionSubtitle: 'Mandatory Standards For Zero Accidents On Every Site',
  safetyCultureTitle: 'Fostering a Zero-Harm Culture',
  safetyCultureDesc: 'Safety is a core value woven into every project lifecycle from planning to execution.',
  pillarsSectionTitle: 'Core Safety Pillars',
  programsSectionTitle: 'Comprehensive Safety Programs',
  gallerySectionTitle: 'EHS in Action',
  gallery: [
    { id: '1', title: 'PPE Training Session',   image: '/images/EHS/PPE-Training-Session.png' },
    { id: '2', title: 'Site Safety Inspection', image: '/images/EHS/Site-Safety-Inspection.png' },
    { id: '3', title: 'Fire Safety Drill',      image: '/images/EHS/Fire-Safety-Drill.png' },
    { id: '4', title: 'Emergency Mock Drill',   image: '/images/EHS/Emergency-Mock-Drill.png' },
  ],
  awardsSectionTitle: 'Photography With Client',
  awardsSectionSubtitle: 'Our commitment to safety, quality, and operational excellence continues to earn recognition across infrastructure and industrial projects.',
  resourcesSectionTitle: 'Key Documents & Downloads',
  resourcesSectionSubtitle: 'Safety is Our Highest Priority',
  resourcesSectionDesc: 'Access our official safety guidelines, comprehensive operational protocols, and essential resources for all project sites.',
  resourcesCoverImage: {
    id: 823,
    name: 'pisl_EHS-100kb.jpeg',
    url: '/images/uploads/pisl_EHS_100kb_1da8061955.jpeg'
  },
  resources: [
    {
      id: 18,
      title: 'HSE Policy',
      desc: 'Official Health, Safety & Environment policies, operational guidelines and zero-harm standards.',
      fileUrl: '/reports/HSE_POLICY_PISL_e35061d871.pdf',
      file: {
        id: 819,
        name: 'HSE POLICY PISL.pdf',
        url: '/reports/HSE_POLICY_PISL_e35061d871.pdf'
      }
    },
    {
      id: 22,
      title: 'Risk Management Policy',
      desc: 'Structured framework for identifying, assessing, and mitigating operational and project risks.',
      fileUrl: '/reports/Risk_Management_Policy_PISL_37fe051837.pdf',
      file: {
        id: 821,
        name: 'Risk Management Policy-PISL.pdf',
        url: '/reports/Risk_Management_Policy_PISL_37fe051837.pdf'
      }
    },
    {
      id: 23,
      title: 'Vigil Mechanism Policy',
      desc: 'Whistleblower mechanism ensuring corporate transparency, ethical conduct, and accountability.',
      fileUrl: '/reports/Vigil_Mechanism_Policy_PISL_6c1fe65e70.pdf',
      file: {
        id: 820,
        name: 'Vigil Mechanism Policy-PISL.pdf',
        url: '/reports/Vigil_Mechanism_Policy_PISL_6c1fe65e70.pdf'
      }
    },
    {
      id: 24,
      title: 'CSR Policy',
      desc: 'Corporate Social Responsibility commitments towards community welfare and sustainable development.',
      fileUrl: '/reports/CSR_Policy_PISL_2e584fd56d.pdf',
      file: {
        id: 822,
        name: 'CSR_Policy-PISL.pdf',
        url: '/reports/CSR_Policy_PISL_2e584fd56d.pdf'
      }
    }
  ]
};

const EHS = () => {
  const isPreview = Boolean(getPreviewContext());
  // Stale-While-Revalidate: Instant synchronous render from localStorage cache or defaults (skip stale cache on preview)
  const [data, setData] = useState(() => {
    if (isPreview) return null;
    const local = getLocalDataSync('ehs-page');
    if (local && typeof local === 'object' && Object.keys(local).length > 0) return local;
    return defaultEHSData;
  });
  const [loading, setLoading] = useState(() => isPreview);

  useEffect(() => {
    let isMounted = true;
    const loadData = async (forceFresh = true) => {
      try {
        const res = await fetchWpData('ehs-page?populate=*', { forceFresh });
        if (res && typeof res === 'object' && isMounted) {
          setData(res);
        } else if (isMounted && !data) {
          setData(defaultEHSData);
        }
      } catch (err) {
        console.error('Error fetching EHS data', err);
        if (isMounted && !data) {
          setData(defaultEHSData);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData(true);

    // Instant update when SWR revalidation resolves fresh data in background
    const handleDataUpdate = (e) => {
      if (isPreview) return;
      const ep = e.detail?.cleanEndpoint || e.detail?.endpoint || '';
      if (ep.includes('ehs-page') && e.detail?.data && isMounted) {
        setData(e.detail.data);
      }
    };
    window.addEventListener('pisl-data-update', handleDataUpdate);

    // Auto-refresh from CMS on tab visibility
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isMounted) {
        loadData(true);
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => { 
      isMounted = false;
      window.removeEventListener('pisl-data-update', handleDataUpdate);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [isPreview]);

  if (loading && !data) return <Preloader />;

  const pageData = data || defaultEHSData;

  const fallbackTitle = "EHS Safety Protocols & Zero-Accident Construction Standards | Pislinfra";
  const fallbackDescription = "Pislinfra is committed to world-class Environment, Health & Safety (EHS) standards with over 15+ million safe man-hours, ISO certifications, and zero-LTI safety protocols on construction sites.";

  // Connect CMS EHS page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = (pageData?.metaTitle || pageData?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (pageData?.metaDescription || pageData?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (pageData?.primaryKeyword || pageData?.seo?.primaryKeyword || '').trim();
  const resolvedFocusKeywords = (pageData?.focusKeywords || pageData?.seo?.focusKeywords || '').trim();
  const resolvedOgImage = getImageUrl(pageData?.seo?.ogImage || pageData?.heroImage, 'https://pislinfra.com/images/hero/EHS.png');
  const resolvedTwitterImage = getImageUrl(pageData?.seo?.twitterImage || pageData?.heroImage, 'https://pislinfra.com/images/hero/EHS.png');

  const seoData = {
    contentType: 'page',
    slug: 'about/ehs',
    canonicalUrl: 'https://pislinfra.com/about/ehs',
    ogType: 'website',
    twitterCardType: 'summary_large_image',
    schemaType: 'AboutPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['EHS', 'Safety Policy', 'Safe Man Hours', 'ISO 45001', 'Construction Safety', 'Pislinfra'],
    ...(pageData?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: pageData?.seo?.seoKeywords || resolvedFocusKeywords || 'EHS policy construction, safety standards industrial construction, ISO 45001 contractor India, zero harm safety culture, safe man hours construction, Pislinfra EHS',
    ogTitle: pageData?.ogTitle || pageData?.seo?.ogTitle || resolvedTitle,
    ogDescription: pageData?.ogDescription || pageData?.seo?.ogDescription || resolvedDescription,
    ogImage: resolvedOgImage,
    twitterTitle: pageData?.twitterTitle || pageData?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: pageData?.twitterDescription || pageData?.seo?.twitterDescription || resolvedDescription,
    twitterImage: resolvedTwitterImage,
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <BlogSEO blog={seoData} />
      
      {pageData?.showHero !== false && (
        <PageHero 
          title={pageData.title} 
          subtitle={pageData.subtitle}
          breadcrumb={pageData.breadcrumb}
          bgImage={getImageUrl(pageData.heroImage, "/images/hero/EHS.png")}
        />
      )}
      
      <div style={{ height: '40px', backgroundColor: '#FFFFFF' }} />
      
      {pageData?.showStats !== false && <EHSStats stats={pageData.stats} />}
      {pageData?.showCommitment !== false && (
        <SafeManHoursAndCommitment 
          features={pageData.features} 
          title={pageData.commitmentTitle} 
        />
      )}
      {pageData?.showPhilosophy !== false && (
        <SafetyPhilosophy 
          philosophyItems={pageData.philosophy} 
          title={pageData.philosophySectionTitle} 
        />
      )}
      {pageData?.showApproaches !== false && (
        <SafetyApproach 
          approaches={pageData.approaches} 
          title={pageData.approachesSectionTitle} 
          subtitle={pageData.approachesSectionSubtitle} 
        />
      )}
      {pageData?.showRules !== false && (
        <LifeSavingRules 
          rules={pageData.rules} 
          title={pageData.rulesSectionTitle} 
          subtitle={pageData.rulesSectionSubtitle} 
        />
      )}
      {pageData?.showSafetyCulture !== false && (
        <SafetyCulture 
          title={pageData.safetyCultureTitle} 
          desc={pageData.safetyCultureDesc} 
        />
      )}
      {pageData?.showPillars !== false && (
        <EHSPillarsAndPrograms 
          pillars={pageData.pillars} 
          title={pageData.pillarsSectionTitle} 
        />
      )}
      {pageData?.showPrograms !== false && (
        <EHSSafetyPrograms 
          programs={pageData.programs} 
          title={pageData.programsSectionTitle} 
        />
      )}
      {pageData?.showGallery !== false && (
        <CertificationsAndEHSAction 
          gallery={pageData.gallery} 
          title={pageData.gallerySectionTitle} 
        />
      )}
      {pageData?.showAwards !== false && (
        <IndustryRecognition 
          awards={pageData.awards} 
          title={pageData.awardsSectionTitle} 
          subtitle={pageData.awardsSectionSubtitle} 
        />
      )}
      {pageData?.showResources !== false && (
        <SafetyResources 
          resources={pageData.resources} 
          title={pageData.resourcesSectionTitle} 
          subtitle={pageData.resourcesSectionSubtitle} 
          desc={pageData.resourcesSectionDesc} 
          coverImage={pageData.resourcesCoverImage}
        />
      )}
    </div>
  )
}

export default EHS
