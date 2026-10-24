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
import { fetchStrapiData, getStrapiMediaUrl, getLocalDataSync } from '../../services/strapi';
import Preloader from '../../components/common/Preloader';

const getImageUrl = (imgObj, defaultImg) => {
  return getStrapiMediaUrl(imgObj, defaultImg);
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
  awardsSectionTitle: 'Photography With Client',
  awardsSectionSubtitle: 'Our commitment to safety, quality, and operational excellence continues to earn recognition across infrastructure and industrial projects.',
  resourcesSectionTitle: 'Key Documents & Downloads',
  resourcesSectionSubtitle: 'Safety is Our Highest Priority',
  resourcesSectionDesc: 'Access our official safety guidelines, comprehensive operational protocols, and essential resources for all project sites.',
  resourcesCoverImage: {
    id: 823,
    name: 'pisl_EHS-100kb.jpeg',
    url: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/pisl_EHS_100kb_82653bd4f2.jpeg'
  },
  resources: [
    {
      id: 18,
      title: 'HSE Policy',
      desc: 'Official Health, Safety & Environment policies, operational guidelines and zero-harm standards.',
      fileUrl: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/HSE_POLICY_PISL_e35061d871.pdf',
      file: {
        id: 819,
        name: 'HSE POLICY PISL.pdf',
        url: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/HSE_POLICY_PISL_e35061d871.pdf'
      }
    },
    {
      id: 22,
      title: 'Risk Management Policy',
      desc: 'Structured framework for identifying, assessing, and mitigating operational and project risks.',
      fileUrl: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/Risk_Management_Policy_PISL_37fe051837.pdf',
      file: {
        id: 821,
        name: 'Risk Management Policy-PISL.pdf',
        url: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/Risk_Management_Policy_PISL_37fe051837.pdf'
      }
    },
    {
      id: 23,
      title: 'Vigil Mechanism Policy',
      desc: 'Whistleblower mechanism ensuring corporate transparency, ethical conduct, and accountability.',
      fileUrl: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/Vigil_Mechanism_Policy_PISL_6c1fe65e70.pdf',
      file: {
        id: 820,
        name: 'Vigil Mechanism Policy-PISL.pdf',
        url: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/Vigil_Mechanism_Policy_PISL_6c1fe65e70.pdf'
      }
    },
    {
      id: 24,
      title: 'CSR Policy',
      desc: 'Corporate Social Responsibility commitments towards community welfare and sustainable development.',
      fileUrl: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/CSR_Policy_PISL_2e584fd56d.pdf',
      file: {
        id: 822,
        name: 'CSR_Policy-PISL.pdf',
        url: 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/CSR_Policy_PISL_2e584fd56d.pdf'
      }
    }
  ]
};

const EHS = () => {
  // Stale-While-Revalidate: Instant synchronous render from localStorage cache or defaults (0ms load!)
  const [data, setData] = useState(() => {
    const local = getLocalDataSync('ehs-page');
    if (local && typeof local === 'object') return local;
    return defaultEHSData;
  });

  useEffect(() => {
    let isMounted = true;
    const loadData = async (forceFresh = false) => {
      try {
        const res = await fetchStrapiData('ehs-page', { forceFresh });
        if (res && isMounted) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching EHS data', err);
      }
    };
    loadData(true);

    // Instant update when SWR revalidation resolves fresh data in background
    const handleDataUpdate = (e) => {
      if (e.detail?.cleanEndpoint?.includes('ehs-page') && e.detail?.data && isMounted) {
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
  }, []);

  const seoData = {
    contentType: 'page',
    title: data.seo?.seoTitle || 'Environment, Health & Safety (EHS) Policy | Pislinfra',
    seoTitle: data.seo?.seoTitle || 'EHS Safety Protocols & Zero-Accident Construction Standards | Pislinfra',
    seoDescription: data.seo?.seoDescription || 'Pislinfra is committed to world-class Environment, Health & Safety (EHS) standards with over 15+ million safe man-hours, ISO certifications, and zero-LTI safety protocols on construction sites.',
    seoKeywords: data.seo?.seoKeywords || 'EHS policy construction, safety standards industrial construction, ISO 45001 contractor India, zero harm safety culture, safe man hours construction, Pislinfra EHS',
    slug: 'about/ehs',
    canonicalUrl: 'https://pislinfra.com/about/ehs',
    ogTitle: data.seo?.ogTitle || 'EHS & Industrial Safety Standards | Pislinfra',
    ogDescription: data.seo?.ogDescription || 'Uncompromising commitment to workforce safety, environmental sustainability, and ISO certified standards.',
    ogImage: getImageUrl(data.seo?.ogImage || data.heroImage, 'https://pislinfra.com/images/hero/EHS.png'),
    ogType: 'website',
    twitterTitle: data.seo?.twitterTitle || 'EHS & Workplace Safety | Pislinfra',
    twitterDescription: data.seo?.twitterDescription || '15+ Million Safe Man-Hours delivered with rigorous site safety standards.',
    twitterImage: getImageUrl(data.seo?.twitterImage || data.heroImage, 'https://pislinfra.com/images/hero/EHS.png'),
    twitterCardType: 'summary_large_image',
    schemaType: 'AboutPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['EHS', 'Safety Policy', 'Safe Man Hours', 'ISO 45001', 'Construction Safety', 'Pislinfra'],
    ...data.seo
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title={data.title} 
        subtitle={data.subtitle}
        breadcrumb={data.breadcrumb}
        bgImage={getImageUrl(data.heroImage, "/images/hero/EHS.png")}
      />
      
      <div style={{ height: '40px', backgroundColor: '#FFFFFF' }} />
      
      <EHSStats stats={data.stats} />
      <SafeManHoursAndCommitment 
        features={data.features} 
        title={data.commitmentTitle} 
      />
      <SafetyPhilosophy 
        philosophyItems={data.philosophy} 
        title={data.philosophySectionTitle} 
      />
      <SafetyApproach 
        approaches={data.approaches} 
        title={data.approachesSectionTitle} 
        subtitle={data.approachesSectionSubtitle} 
      />
      <LifeSavingRules 
        rules={data.rules} 
        title={data.rulesSectionTitle} 
        subtitle={data.rulesSectionSubtitle} 
      />
      <SafetyCulture 
        title={data.safetyCultureTitle} 
        desc={data.safetyCultureDesc} 
      />
      <EHSPillarsAndPrograms 
        pillars={data.pillars} 
        title={data.pillarsSectionTitle} 
      />
      <EHSSafetyPrograms 
        programs={data.programs} 
        title={data.programsSectionTitle} 
      />
      <CertificationsAndEHSAction 
        gallery={data.gallery} 
        title={data.gallerySectionTitle} 
      />
      <IndustryRecognition 
        awards={data.awards} 
        title={data.awardsSectionTitle} 
        subtitle={data.awardsSectionSubtitle} 
      />
      <SafetyResources 
        resources={data.resources} 
        title={data.resourcesSectionTitle} 
        subtitle={data.resourcesSectionSubtitle} 
        desc={data.resourcesSectionDesc} 
        coverImage={data.resourcesCoverImage}
      />
    </div>
  )
}

export default EHS
