import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, GraduationCap, Clock, Calendar, ArrowLeft, CheckCircle2, DollarSign } from 'lucide-react';
import PageHero from '../components/hero/PageHero';
import BlogSEO from '../components/Blog/BlogSEO';
import Preloader from '../components/common/Preloader';
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../services/wordpress';

export default function JobDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isPreview = Boolean(getPreviewContext());

  const [job, setJob] = useState(() => {
    const cached = getLocalDataSync('job-openings');
    if (Array.isArray(cached)) {
      return cached.find(j => j.slug === slug || String(j.id) === slug) || null;
    }
    return null;
  });
  const [loading, setLoading] = useState(!job || isPreview);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    let isMounted = true;

    fetchWpData('job-openings?populate=*', { forceFresh: isPreview })
      .then(res => {
        if (!isMounted) return;
        if (Array.isArray(res)) {
          const found = res.find(j => j.slug === slug || String(j.id) === slug);
          if (found) {
            setJob(found);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [slug, isPreview]);

  if (loading && !job) {
    return <Preloader />;
  }

  if (!job) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', color: '#1E2A5A', marginBottom: '16px', fontWeight: 700 }}>Job Opening Not Found</h1>
        <p style={{ color: '#64748B', marginBottom: '24px' }}>The position you are looking for may have been closed or relocated.</p>
        <Link to="/careers" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#FF6B35', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to All Openings
        </Link>
      </div>
    );
  }

  const jobTitle = job.title || 'Job Opening';
  const jobDept = job.department || 'Engineering';
  const jobExp = job.experience || 'Experience required';
  const jobQual = job.qualification || 'Professional qualification';
  const jobLoc = job.location || 'PAN India';
  const jobDate = job.datePosted || '2026-08-22';
  const jobSlug = job.slug || slug;

  // Verified description only - no fabricated content
  const hasCustomDesc = Boolean(job.description && job.description.trim());
  const descriptionText = hasCustomDesc
    ? job.description.trim()
    : `Career opening for ${jobTitle} in the ${jobDept} department at Pragati Infra Solutions Pvt. Ltd. Location: ${jobLoc}. Experience: ${jobExp}. Qualification: ${jobQual}.`;

  // Schema.org JobPosting - ONLY verified fields
  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': jobTitle,
    'description': descriptionText,
    'datePosted': jobDate,
    ...(job.validThrough ? { 'validThrough': job.validThrough } : {}),
    ...(job.employmentType ? { 'employmentType': job.employmentType } : {}),
    ...(job.salary ? {
      'baseSalary': {
        '@type': 'MonetaryAmount',
        'currency': 'INR',
        'value': {
          '@type': 'QuantitativeValue',
          'value': job.salary,
          'unitText': 'YEAR'
        }
      }
    } : {}),
    'identifier': {
      '@type': 'PropertyValue',
      'name': 'Pislinfra',
      'value': `PISL-JOB-${job.id || jobSlug.toUpperCase()}`
    },
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
    'experienceRequirements': jobExp,
    'qualifications': jobQual,
    'occupationalCategory': `${jobDept} Engineering / Construction`,
    'directApply': true,
    'url': `https://pislinfra.com/careers/${jobSlug}`
  };

  const seoData = {
    title: `${jobTitle} | Careers at Pragati Infra Solutions`,
    seoTitle: `${jobTitle} Careers | Pragati Infra Solutions`,
    seoDescription: `Apply for ${jobTitle} vacancy in ${jobDept} at Pragati Infra Solutions Pvt. Ltd. Experience: ${jobExp}, Location: ${jobLoc}.`,
    canonicalUrl: `https://pislinfra.com/careers/${jobSlug}`,
    ogType: 'website',
    ogImage: '/images/hero/Careers.png',
    twitterImage: '/images/hero/Careers.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    structuredData: [jobPostingSchema]
  };

  return (
    <div className="job-detail-page" style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: '60px' }}>
      <BlogSEO blog={seoData} />

      <PageHero
        title={jobTitle}
        subtitle={`${jobDept} Department • ${jobLoc}`}
        breadcrumb={`Careers / ${jobTitle}`}
        bgImage="/images/hero/Careers.png"
      />

      <div style={{ maxWidth: '1100px', margin: '-40px auto 0 auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        {/* Navigation back */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            to="/careers"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1E2A5A', fontWeight: 600, fontSize: '14px', textDecoration: 'none', background: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}
          >
            <ArrowLeft size={16} /> All Current Openings
          </Link>
        </div>

        {/* Job Header Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: '#FFF7ED', color: '#EA580C', borderRadius: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
                {jobDept}
              </span>
              <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, color: '#1E2A5A', margin: '0 0 12px 0', lineHeight: 1.25 }}>
                {jobTitle}
              </h1>
              <p style={{ margin: 0, color: '#64748B', fontSize: '15px' }}>
                Pragati Infra Solutions Pvt. Ltd. • Ref: PISL-JOB-{job.id || jobSlug.toUpperCase()}
              </p>
            </div>

            <div>
              <a
                href={`/careers?apply=${encodeURIComponent(jobTitle)}#application-form`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: '#FF6B35', color: '#FFFFFF', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', boxShadow: '0 4px 12px rgba(255,107,53,0.3)', transition: 'background 0.2s' }}
              >
                Apply for this Position
              </a>
            </div>
          </div>

          <hr style={{ margin: '28px 0', border: 'none', borderTop: '1px solid #EEF2F6' }} />

          {/* Key Job Specifications Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                <Clock size={20} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Experience</span>
                <strong style={{ fontSize: '14px', color: '#1E2A5A' }}>{jobExp}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A', flexShrink: 0 }}>
                <MapPin size={20} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Location</span>
                <strong style={{ fontSize: '14px', color: '#1E2A5A' }}>{jobLoc}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333EA', flexShrink: 0 }}>
                <GraduationCap size={20} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Qualification</span>
                <strong style={{ fontSize: '14px', color: '#1E2A5A' }}>{jobQual}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C', flexShrink: 0 }}>
                <Calendar size={20} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Date Posted</span>
                <strong style={{ fontSize: '14px', color: '#1E2A5A' }}>{jobDate}</strong>
              </div>
            </div>

            {job.employmentType && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626', flexShrink: 0 }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Employment Type</span>
                  <strong style={{ fontSize: '14px', color: '#1E2A5A' }}>{job.employmentType}</strong>
                </div>
              </div>
            )}

            {job.salary && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Compensation</span>
                  <strong style={{ fontSize: '14px', color: '#1E2A5A' }}>{job.salary}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Description / Role Details */}
        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '36px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1E2A5A', marginBottom: '18px', borderBottom: '2px solid #FF6B35', display: 'inline-block', paddingBottom: '6px' }}>
            Position Overview &amp; Requirements
          </h2>

          {hasCustomDesc ? (
            <div
              style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155' }}
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          ) : (
            <div style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155' }}>
              <p>
                Pragati Infra Solutions Pvt. Ltd. (PISL) is inviting applications for the position of <strong>{jobTitle}</strong> within our <strong>{jobDept}</strong> department. As an engineering and infrastructure solutions provider, we value technical competence, safety orientation, and project delivery excellence.
              </p>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1E2A5A', marginTop: '24px', marginBottom: '12px' }}>
                Role Specifics
              </h3>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Designation:</strong> {jobTitle}</li>
                <li><strong>Department:</strong> {jobDept}</li>
                <li><strong>Experience Required:</strong> {jobExp}</li>
                <li><strong>Qualification:</strong> {jobQual}</li>
                <li><strong>Job Location:</strong> {jobLoc}</li>
                <li><strong>Posting Date:</strong> {jobDate}</li>
              </ul>
              <p style={{ marginTop: '20px' }}>
                Interested candidates can submit their profile through our online application portal or contact our Human Resources team directly.
              </p>
            </div>
          )}

          <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid #EEF2F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontSize: '14px', fontWeight: 600 }}>
              <CheckCircle2 size={18} /> Verified Opening at Pragati Infra Solutions
            </div>
            <a
              href={`/careers?apply=${encodeURIComponent(jobTitle)}#application-form`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#1E2A5A', color: '#FFFFFF', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
            >
              Apply Online &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
