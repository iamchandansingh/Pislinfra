import React, { useState, useEffect } from 'react'
import { fetchStrapiData } from '../services/strapi'
import { getImageUrl } from '../utils/imageUrl'
import PageHero from '../components/hero/PageHero'
import BlogSEO from '../components/Blog/BlogSEO'
import CareerBenefitsSection from '../components/Careers/CareerBenefitsSection'
import CurrentOpeningsSection from '../components/Careers/CurrentOpeningsSection'
import HiringProcessSection from '../components/Careers/HiringProcessSection'
import CareerApplicationSection from '../components/Careers/CareerApplicationSection'

import jobOpeningsData from '../data/careersJobsData';

const defaultCareerData = {
  title: 'Careers',
  heroSubtitle: "Join Pislinfra and build tomorrow's India with us.",
  breadcrumb: 'Careers',
  heroImage: { url: '/images/hero/Careers.png' },
  seo: {
    seoTitle: 'Careers & Current Openings | Join India\'s Leading EPC Team | Pislinfra',
    seoDescription: 'Explore 27+ exciting engineering, project management, and construction job openings at Pislinfra across PAN India. Apply online today.',
    seoKeywords: 'construction jobs India, civil engineer careers, planning engineer hiring, safety officer jobs, project manager vacancy, Pislinfra hiring, PAN India construction jobs',
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
         setJobs(items.length > 0 ? items : jobOpeningsData);
      } else {
        setJobs(jobOpeningsData);
      }
    };
    loadData();
  }, []);

  const allJobsList = jobs.length > 0 ? jobs : jobOpeningsData;

  const jobPostingSchemas = allJobsList.map(job => ({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': job.title,
    'description': job.description || `${job.title} vacancy at Pragati Infra Solutions Pvt. Ltd. Experience: ${job.experience}. Qualification: ${job.qualification}. Location: ${job.location}.`,
    'identifier': {
      '@type': 'PropertyValue',
      'name': 'Pislinfra',
      'value': `PISL-JOB-${job.id || job.title.replace(/\s+/g, '-').toUpperCase()}`
    },
    'datePosted': '2026-01-01',
    'validThrough': '2026-12-31',
    'employmentType': job.employmentType || 'FULL_TIME',
    'hiringOrganization': {
      '@type': 'Organization',
      'name': 'Pragati Infra Solutions Pvt. Ltd.',
      'sameAs': 'https://pislinfra.com',
      'logo': 'https://pislinfra.com/logo.png'
    },
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38',
        'addressLocality': 'Gurugram',
        'addressRegion': 'Haryana',
        'postalCode': '122018',
        'addressCountry': 'IN'
      }
    },
    'applicantLocationRequirements': {
      '@type': 'Country',
      'name': 'IN'
    },
    'experienceRequirements': job.experience,
    'qualifications': job.qualification,
    'occupationalCategory': `${job.department} Engineering / Construction`,
    'directApply': true,
    'url': `https://pislinfra.com/careers`
  }));

  const seoData = {
    contentType: 'page',
    title: data?.title || 'Careers',
    seoTitle: data?.seo?.seoTitle || defaultCareerData.seo.seoTitle,
    seoDescription: data?.seo?.seoDescription || defaultCareerData.seo.seoDescription,
    seoKeywords: data?.seo?.seoKeywords || defaultCareerData.seo.seoKeywords,
    slug: 'careers',
    canonicalUrl: data?.seo?.canonicalUrl || 'https://pislinfra.com/careers',
    ogTitle: data?.seo?.ogTitle || defaultCareerData.seo.seoTitle,
    ogDescription: data?.seo?.ogDescription || defaultCareerData.seo.seoDescription,
    ogImage: getImageUrl(data?.seo?.ogImage || data?.heroImage, '/images/hero/Careers.png'),
    ogType: data?.seo?.ogType || 'website',
    twitterTitle: data?.seo?.twitterTitle || defaultCareerData.seo.seoTitle,
    twitterDescription: data?.seo?.twitterDescription || defaultCareerData.seo.seoDescription,
    twitterImage: getImageUrl(data?.seo?.twitterImage || data?.heroImage, '/images/hero/Careers.png'),
    twitterCardType: data?.seo?.twitterCardType || 'summary_large_image',
    schemaType: data?.seo?.schemaType || 'WebPage',
    breadcrumbSchema: data?.seo?.breadcrumbSchema !== undefined ? data.seo.breadcrumbSchema : true,
    organizationSchema: data?.seo?.organizationSchema !== undefined ? data.seo.organizationSchema : true,
    tags: data?.seo?.tags ? (typeof data.seo.tags === 'string' ? data.seo.tags.split(',').map(t => t.trim()) : data.seo.tags) : ['Careers', 'Jobs', 'Hiring', 'Construction', 'Engineering'],
    noIndex: data?.seo?.noIndex || false,
    noFollow: data?.seo?.noFollow || false,
    structuredData: jobPostingSchemas
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
        subtitle={data?.heroSubtitle || "Join Pislinfra and build tomorrow's India with us."}
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