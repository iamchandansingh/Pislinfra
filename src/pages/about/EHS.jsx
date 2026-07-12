import React from 'react'
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

const EHS = () => {
  const seoData = {
    contentType: 'page',
    title: 'EHS Standards',
    seoTitle: 'Environment, Health & Safety Standards',
    seoDescription: 'Pislinfra\'s EHS standards ensure zero harm, environmental protection & workplace safety. Comprehensive safety programs, certifications & sustainable construction practices.',
    seoKeywords: 'EHS standards, environment health safety, construction safety, workplace safety, safety certification, environmental protection, sustainable construction, Pislinfra',
    slug: 'about/ehs',
    canonicalUrl: 'https://pislinfra.com/about/ehs',
    ogTitle: 'EHS Standards - Safety & Environment | Pislinfra',
    ogDescription: 'Our commitment to environment, health & safety excellence.',
    ogImage: 'https://pislinfra.com/images/hero/EHS.png',
    ogType: 'website',
    twitterTitle: 'EHS Standards | Pislinfra',
    twitterDescription: 'Zero harm commitment & sustainable practices.',
    twitterImage: 'https://pislinfra.com/images/hero/EHS.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['EHS', 'Safety', 'Health', 'Environment', 'Certification', 'Construction'],
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title="EHS Standards" 
        subtitle="Environment, Health & Safety Standards"
        breadcrumb="About Us / EHS"
        bgImage="/images/hero/EHS.png"
      />
      
      <div style={{ height: '40px', backgroundColor: '#FFFFFF' }} />
      
      {/* 1. Top Section (Requested Sequence) */}
      <EHSStats />
      
      {/* 2. Second Section (Requested Sequence) */}
      <SafeManHoursAndCommitment />
      
      {/* 3. Third Section (Latest HSE Statistics & CCTV) */}
      <SafetyPhilosophy />
      
      {/* 4. Fourth Section (PISL HSE Journey) */}
      <SafetyApproach />

      {/* 5. Rules & Culture */}
      <LifeSavingRules />
      <SafetyCulture />
      
      {/* 6. Programs & Pillars */}
      <EHSPillarsAndPrograms />
      <EHSSafetyPrograms />
      
      {/* 7. Certifications & Recognition */}
      <CertificationsAndEHSAction />
      <IndustryRecognition />

      {/* 8. Downloads */}
      <SafetyResources />
    </div>
  )
}

export default EHS