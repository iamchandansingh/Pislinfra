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
    ...data.seo,
    contentType: 'page',
    ogImage: getImageUrl(data.seo?.ogImage || data.heroImage, 'https://pislinfra.com/images/hero/EHS.png')
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
