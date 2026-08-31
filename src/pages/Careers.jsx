import React, { useState, useEffect } from 'react'
import { fetchStrapiData } from '../services/strapi'
import { getImageUrl } from '../utils/imageUrl'
import PageHero from '../components/hero/PageHero'
import BlogSEO from '../components/Blog/BlogSEO'
import CareerBenefitsSection from '../components/Careers/CareerBenefitsSection'
import CurrentOpeningsSection from '../components/Careers/CurrentOpeningsSection'
import HiringProcessSection from '../components/Careers/HiringProcessSection'
import CareerApplicationSection from '../components/Careers/CareerApplicationSection'

const defaultCareerData = {
  title: 'Careers',
  heroSubtitle: "Join PISL INFRA and build tomorrow's India with us.",
  breadcrumb: 'Careers',
  heroImage: { url: '/images/hero/Careers.png' },
  seo: {
    seoTitle: 'Careers | Join PISL Infra Team',
    seoDescription: 'Explore exciting career opportunities at Pislinfra. Join our engineering, project management, and construction leadership teams.',
    seoKeywords: 'careers, jobs, civil engineering jobs, construction careers, PISL infra hiring',
    canonicalUrl: 'https://pislinfra.com/careers'
  }
};

const Careers = () => {
  const [selectedPosition, setSelectedPosition] = useState('');
  const [data, setData] = useState(defaultCareerData);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const pageRes = await fetchStrapiData('career-page?populate[0]=heroImage&populate[1]=seo&populate[2]=benefits&populate[3]=processSteps');
      if (pageRes) setData(Array.isArray(pageRes) ? pageRes[0] : pageRes);

      const jobsRes = await fetchStrapiData('job-openings?pagination[limit]=100');
      if (jobsRes) {
         const items = Array.isArray(jobsRes) ? jobsRes : (jobsRes.data || []);
         setJobs(items);
      }
    };
    loadData();
  }, []);

  const seoData = {
    contentType: 'page',
    title: data?.title || 'Careers',
    seoTitle: data?.seo?.seoTitle || 'Careers | Join PISL Infra Team',
    seoDescription: data?.seo?.seoDescription || 'Explore exciting career opportunities at Pislinfra.',
    seoKeywords: data?.seo?.seoKeywords || 'careers, jobs, engineering, infrastructure',
    slug: 'careers',
    canonicalUrl: data?.seo?.canonicalUrl || 'https://pislinfra.com/careers',
    ogTitle: data?.seo?.ogTitle || 'Careers at Pislinfra',
    ogDescription: data?.seo?.ogDescription || 'Explore exciting career opportunities at Pislinfra.',
    ogImage: getImageUrl(data?.seo?.ogImage || data?.heroImage, '/images/hero/Careers.png'),
    ogType: data?.seo?.ogType || 'website',
    twitterTitle: data?.seo?.twitterTitle || 'Careers at Pislinfra',
    twitterDescription: data?.seo?.twitterDescription || 'Explore career opportunities at Pislinfra.',
    twitterImage: getImageUrl(data?.seo?.twitterImage || data?.heroImage, '/images/hero/Careers.png'),
    twitterCardType: data?.seo?.twitterCardType || 'summary_large_image',
    schemaType: data?.seo?.schemaType || 'WebPage',
    breadcrumbSchema: data?.seo?.breadcrumbSchema !== undefined ? data.seo.breadcrumbSchema : true,
    organizationSchema: data?.seo?.organizationSchema !== undefined ? data.seo.organizationSchema : true,
    tags: data?.seo?.tags ? (typeof data.seo.tags === 'string' ? data.seo.tags.split(',').map(t => t.trim()) : data.seo.tags) : ['Careers', 'Jobs', 'Hiring', 'Construction', 'Engineering'],
    noIndex: data?.seo?.noIndex || false,
    noFollow: data?.seo?.noFollow || false,
    structuredData: data?.seo?.structuredData
  };

  const handleApplyNow = (position) => {
    setSelectedPosition(position);
    setTimeout(() => {
      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div style={{ fontFamily: 'inherit', minHeight: '100vh' }}>
      
      <BlogSEO blog={seoData} />

      <PageHero
        title={data?.title || "Careers"}
        subtitle={data?.heroSubtitle || "Join PISL INFRA and build tomorrow's India with us."}
        breadcrumb={data?.breadcrumb || "Careers"}
        bgImage={getImageUrl(data?.heroImage, "/images/hero/Careers.png")}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
        <CareerBenefitsSection title={data?.benefitsTitle} benefits={data?.benefits?.length > 0 ? data.benefits.map(b => {
          const defaultIcons = {
            'Competitive Salary': 'Wallet',
            'Career Growth': 'TrendingUp',
            'Learning Programs': 'GraduationCap',
            'Health Benefits': 'HeartPulse',
            'Work-Life Balance': 'Scale',
            'Make an Impact': 'Star'
          };
          return {
            id: b.id || b.title,
            icon: b.iconName || defaultIcons[b.title] || 'Check',
            iconColor: ['Learning Programs', 'Work-Life Balance'].includes(b.title) ? '#1E2A5A' : '#FF6B35',
            title: b.title,
            description: b.description || b.desc
          };
        }) : undefined} />

        <CurrentOpeningsSection onApplyNow={handleApplyNow} openings={jobs.length > 0 ? jobs : undefined} />

        <HiringProcessSection title={data?.processTitle} steps={data?.processSteps?.length > 0 ? data.processSteps.map((s, i) => {
          const defaultSteps = {
            'Apply Online': 'FileText',
            'Initial Screening': 'ClipboardCheck',
            'Technical Interview': 'Users',
            'HR Discussion': 'MessageSquare',
            'Offer Letter': 'Award'
          };
          return {
            id: s.id || i,
            icon: s.iconName || defaultSteps[s.title] || 'Check',
            title: s.title,
            description: s.description || s.desc
          };
        }) : undefined} />

        <div id="application-form">
          <CareerApplicationSection preSelectedPosition={selectedPosition} jobPositionsList={jobs.length > 0 ? jobs.map(j => j.title) : undefined} title={data?.formTitle} subtitle={data?.formSubtitle} />
        </div>
      </div>
    </div>
  )
}

export default Careers