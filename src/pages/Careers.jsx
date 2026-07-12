import React, { useState } from 'react'
import PageHero from '../components/hero/PageHero'
import BlogSEO from '../components/Blog/BlogSEO'
import CareerBenefitsSection from '../components/Careers/CareerBenefitsSection'
import CurrentOpeningsSection from '../components/Careers/CurrentOpeningsSection'
import HiringProcessSection from '../components/Careers/HiringProcessSection'
import CareerApplicationSection from '../components/Careers/CareerApplicationSection'

const Careers = () => {
  const [selectedPosition, setSelectedPosition] = useState('');

  const seoData = {
    contentType: 'page',
    title: 'Careers',
    seoTitle: 'Careers',
    seoDescription: 'Explore career opportunities at Pislinfra. Join India\'s leading industrial construction company. Apply for engineering, project management & construction jobs.',
    seoKeywords: 'careers, infrastructure jobs, construction jobs, civil engineering jobs, project manager jobs, warehouse construction careers, hiring, Pislinfra jobs',
    slug: 'careers',
    canonicalUrl: 'https://pislinfra.com/careers',
    ogTitle: 'Careers at Pislinfra - Build Your Future',
    ogDescription: 'Join Pislinfra team. Explore jobs in industrial construction, engineering & project management.',
    ogImage: 'https://pislinfra.com/images/hero/Careers.png',
    ogType: 'website',
    twitterTitle: 'Careers at Pislinfra - Infrastructure Jobs',
    twitterDescription: 'Build tomorrow\'s India with us. Apply now for construction & engineering roles.',
    twitterImage: 'https://pislinfra.com/images/hero/Careers.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Careers', 'Jobs', 'Hiring', 'Construction', 'Engineering', 'Infrastructure'],
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
        title="Careers"
        subtitle="Join PISL INFRA and build tomorrow's India with us."
        breadcrumb="Careers"
        bgImage="/images/hero/Careers.png"
      />

      <CareerBenefitsSection />
      <CurrentOpeningsSection onApplyNow={handleApplyNow} />
      <HiringProcessSection />

      <div id="application-form">
        <CareerApplicationSection preSelectedPosition={selectedPosition} />
      </div>

    </div>
  )
}

export default Careers