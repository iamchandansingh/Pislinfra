import React, { useState, useEffect } from 'react'
import { fetchStrapiData, getLocalDataSync } from '../services/strapi'
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
  primaryKeyword: 'Careers at Pislinfra',
  metaTitle: 'Careers at Pislinfra | Build Your Future With Us',
  metaDescription: 'Explore career opportunities at Pislinfra and join a team committed to excellence, innovation, safety and building the future of infrastructure.',
  focusKeywords: 'Careers at Pislinfra, construction jobs India, civil engineering careers, infrastructure job openings, hiring, Pislinfra careers',
  seo: {
    seoTitle: 'Careers at Pislinfra | Build Your Future With Us',
    seoDescription: 'Explore career opportunities at Pislinfra and join a team committed to excellence, innovation, safety and building the future of infrastructure.',
    seoKeywords: 'Careers at Pislinfra, construction jobs India, civil engineering careers, infrastructure job openings, hiring, Pislinfra careers',
    canonicalUrl: 'https://pislinfra.com/careers'
  }
};

const Careers = () => {
  const [selectedPosition, setSelectedPosition] = useState('');
  const [data, setData] = useState(() => {
    const raw = getLocalDataSync('career-page') || getLocalDataSync('career-page?populate=*');
    if (raw) return Array.isArray(raw) ? (raw[0] || defaultCareerData) : raw;
    return defaultCareerData;
  });
  const [jobs, setJobs] = useState(jobOpeningsData);

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getLocalDataSync('career-page') || getLocalDataSync('career-page?populate=*');
      if (fresh) {
        setData(Array.isArray(fresh) ? (fresh[0] || defaultCareerData) : fresh);
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const pageRes = await fetchStrapiData('career-page?populate[0]=heroImage&populate[1]=seo&populate[2]=benefits&populate[3]=processSteps');
        if (pageRes && isMounted) {
          setData(Array.isArray(pageRes) ? (pageRes[0] || defaultCareerData) : pageRes);
        }

        const jobsRes = await fetchStrapiData('job-openings?pagination[limit]=100');
        if (jobsRes && isMounted) {
          const items = Array.isArray(jobsRes) ? jobsRes : (jobsRes.data || []);
          setJobs(items.length > 0 ? items : jobOpeningsData);
        } else if (isMounted) {
          setJobs(jobOpeningsData);
        }
      } catch (e) {
      }
    };
    loadData();
    return () => { isMounted = false; };
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

  const fallbackTitle = "Careers at Pislinfra | Build Your Future With Us";
  const fallbackDescription = "Explore career opportunities at Pislinfra and join a team committed to excellence, innovation, safety and building the future of infrastructure.";
  const fallbackPrimaryKeyword = "Careers at Pislinfra";
  const fallbackFocusKeywords = "Careers at Pislinfra, construction jobs India, civil engineering careers, infrastructure job openings, hiring, Pislinfra careers";

  // Connect CMS Careers page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = (data?.metaTitle || data?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (data?.metaDescription || data?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (data?.primaryKeyword || data?.seo?.primaryKeyword || fallbackPrimaryKeyword).trim();
  const resolvedFocusKeywords = (data?.focusKeywords || data?.seo?.focusKeywords || fallbackFocusKeywords).trim();

  const seoData = {
    contentType: 'page',
    ...(data?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: data?.seo?.seoKeywords || resolvedFocusKeywords,
    slug: 'careers',
    canonicalUrl: data?.seo?.canonicalUrl || 'https://pislinfra.com/careers',
    ogTitle: data?.ogTitle || data?.seo?.ogTitle || resolvedTitle,
    ogDescription: data?.ogDescription || data?.seo?.ogDescription || resolvedDescription,
    ogImage: getImageUrl(data?.seo?.ogImage || data?.heroImage, '/images/hero/Careers.png'),
    ogType: data?.seo?.ogType || 'website',
    twitterTitle: data?.twitterTitle || data?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: data?.twitterDescription || data?.seo?.twitterDescription || resolvedDescription,
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

      <div className="careers-content-stack" style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
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

      <style>{`
        @media (max-width: 768px) {
          .careers-content-stack {
            gap: 40px !important;
            padding-bottom: 48px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Careers