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
import { fetchStrapiData } from '../../services/strapi';
import Preloader from '../../components/common/Preloader';

const getImageUrl = (imgObj, defaultImg) => {
  if (!imgObj) return defaultImg;
  const url = imgObj.url || imgObj.data?.attributes?.url;
  if (!url) return defaultImg;
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_STRAPI_URL || "http://127.0.0.1:1337"}${url}`;
};

const EHS = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        let res = null;
        try {
          res = await fetchStrapiData('ehs-page?populate=deep');
        } catch(e) {}
        
        if (!res) {
          res = await fetchStrapiData('ehs-page?populate[0]=heroImage&populate[1]=seo&populate[2]=gallery.image&populate[3]=stats&populate[4]=features&populate[5]=philosophy.image&populate[6]=awards.image&populate[7]=rules&populate[8]=resources&populate[9]=approaches&populate[10]=pillars&populate[11]=programs');
        }
        
        setData(res);
      } catch (err) {
        console.error('Error fetching EHS data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Preloader />;
  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Data not found.</div>;

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
      />
    </div>
  )
}

export default EHS
