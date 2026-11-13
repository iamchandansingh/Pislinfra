import React, { useState, useEffect } from 'react'
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../services/wordpress'
import { getImageUrl } from '../utils/imageUrl'
import PageHero from '../components/hero/PageHero'
import BlogSEO from '../components/Blog/BlogSEO'
import CareerBenefitsSection from '../components/Careers/CareerBenefitsSection'
import CurrentOpeningsSection from '../components/Careers/CurrentOpeningsSection'
import HiringProcessSection from '../components/Careers/HiringProcessSection'
import CareerApplicationSection from '../components/Careers/CareerApplicationSection'
import Preloader from '../components/common/Preloader'

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
  const previewCtx = getPreviewContext();
  const isPagePreview = Boolean(previewCtx && previewCtx.type === 'career-page');
  const isJobPreview = Boolean(previewCtx && previewCtx.type === 'job-openings');
  const isAnyPreview = Boolean(previewCtx);

  const [selectedPosition, setSelectedPosition] = useState('');
  const [data, setData] = useState(() => {
    if (isPagePreview) return null;
    const raw = getLocalDataSync('career-page') || getLocalDataSync('career-page?populate=*');
    if (raw) return Array.isArray(raw) ? (raw[0] || defaultCareerData) : raw;
    return defaultCareerData;
  });
  const [jobs, setJobs] = useState(() => {
    if (isJobPreview) return [];
    const localJobs = getLocalDataSync('job-openings');
    if (Array.isArray(localJobs) && localJobs.length > 0) return localJobs;
    return jobOpeningsData;
  });
  const [loading, setLoading] = useState(isPagePreview || isJobPreview);

  useEffect(() => {
    if (isAnyPreview) return;
    const handleUpdate = () => {
      const fresh = getLocalDataSync('career-page') || getLocalDataSync('career-page?populate=*');
      if (fresh) {
        setData(Array.isArray(fresh) ? (fresh[0] || defaultCareerData) : fresh);
      }
      const freshJobs = getLocalDataSync('job-openings');
      if (Array.isArray(freshJobs) && freshJobs.length > 0) {
        setJobs(freshJobs);
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, [isAnyPreview]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const pageRes = await fetchWpData(
          'career-page?populate[0]=heroImage&populate[1]=seo&populate[2]=benefits&populate[3]=processSteps',
          { forceFresh: isPagePreview }
        );
        if (pageRes && isMounted) {
          setData(Array.isArray(pageRes) ? (pageRes[0] || defaultCareerData) : pageRes);
        }

        const jobsRes = await fetchWpData(
          'job-openings?pagination[limit]=100',
          { forceFresh: isJobPreview }
        );
        if (jobsRes && isMounted) {
          const items = Array.isArray(jobsRes) ? jobsRes : (jobsRes.data || []);
          setJobs(items.length > 0 ? items : jobOpeningsData);
        } else if (isMounted && !isJobPreview) {
          setJobs(jobOpeningsData);
        }
      } catch (e) {
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [isPagePreview, isJobPreview]);

  if (loading && ((isPagePreview && !data) || (isJobPreview && jobs.length === 0))) {
    return <Preloader />;
  }

  const activeData = data || defaultCareerData;
  const allJobsList = jobs.length > 0 ? jobs : jobOpeningsData;

  const fallbackTitle = "Careers at Pislinfra | Build Your Future With Us";
  const fallbackDescription = "Explore career opportunities at Pislinfra and join a team committed to excellence, innovation, safety and building the future of infrastructure.";
  const fallbackPrimaryKeyword = "Careers at Pislinfra";
  const fallbackFocusKeywords = "Careers at Pislinfra, construction jobs India, civil engineering careers, infrastructure job openings, hiring, Pislinfra careers";

  // Connect CMS Careers page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = (activeData?.metaTitle || activeData?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (activeData?.metaDescription || activeData?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (activeData?.primaryKeyword || activeData?.seo?.primaryKeyword || fallbackPrimaryKeyword).trim();
  const resolvedFocusKeywords = (activeData?.focusKeywords || activeData?.seo?.focusKeywords || fallbackFocusKeywords).trim();

  const seoData = {
    contentType: 'page',
    slug: 'careers',
    canonicalUrl: 'https://pislinfra.com/careers',
    ogType: 'website',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    noIndex: false,
    noFollow: false,
    ...(activeData?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: activeData?.seo?.seoKeywords || resolvedFocusKeywords,
    ogTitle: activeData?.ogTitle || activeData?.seo?.ogTitle || resolvedTitle,
    ogDescription: activeData?.ogDescription || activeData?.seo?.ogDescription || resolvedDescription,
    ogImage: getImageUrl(activeData?.seo?.ogImage || activeData?.heroImage, '/images/hero/Careers.png'),
    twitterTitle: activeData?.twitterTitle || activeData?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: activeData?.twitterDescription || activeData?.seo?.twitterDescription || resolvedDescription,
    twitterImage: getImageUrl(activeData?.seo?.twitterImage || activeData?.heroImage, '/images/hero/Careers.png'),
    tags: activeData?.seo?.tags
      ? (typeof activeData.seo.tags === 'string' ? activeData.seo.tags.split(',').map(t => t.trim()) : activeData.seo.tags)
      : ['Careers', 'Jobs', 'Hiring', 'Construction', 'Engineering']
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

      {activeData?.showHero !== false && (
        <PageHero
          title={activeData?.title || "Careers"}
          subtitle={activeData?.heroSubtitle || "Join Pislinfra and build tomorrow's India with us."}
          breadcrumb={activeData?.breadcrumb || "Careers"}
          bgImage={getImageUrl(activeData?.heroImage, "/images/hero/Careers.png")}
        />
      )}

      <div className="careers-content-stack" style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
        {activeData?.showBenefits !== false && (
          <CareerBenefitsSection title={activeData?.benefitsTitle} benefits={activeData?.benefits?.length > 0 ? activeData.benefits.map(b => {
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
        )}

        {activeData?.showOpenings !== false && (
          <CurrentOpeningsSection title={activeData?.openingsTitle} onApplyNow={handleApplyNow} openings={jobs.length > 0 ? jobs : undefined} />
        )}

        {activeData?.showProcess !== false && (
          <HiringProcessSection title={activeData?.processTitle} steps={activeData?.processSteps?.length > 0 ? activeData.processSteps.map((s, i) => {
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
        )}

        {activeData?.showApplicationForm !== false && (
          <div id="application-form">
            <CareerApplicationSection preSelectedPosition={selectedPosition} jobPositionsList={jobs.length > 0 ? jobs.map(j => j.title) : undefined} title={activeData?.formTitle} subtitle={activeData?.formSubtitle} />
          </div>
        )}
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