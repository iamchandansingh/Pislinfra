import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import awardsAndCertifications from '../../data/Awards-&-Certifications';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import AwardsYearFilter from '../../components/Awards-Componet/AwardsYearFilter';
import LatestAchievement from '../../components/Awards-Componet/LatestAchievement';
import ExcellenceShowcase from '../../components/Awards-Componet/ExcellenceShowcase';
import AwardsJourney from '../../components/Awards-Componet/AwardsJourney';
import AwardPopup from '../../components/Awards-Componet/AwardPopup';
import CertificatePopup from '../../components/Awards-Componet/CertificatePopup';

const ArrowUpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
  </svg>
);

const Awards = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [activePopupType, setActivePopupType] = useState(null);
  const navigate = useNavigate();

  const seoData = {
    contentType: 'page', title: 'Awards & Accolades',
    seoTitle: 'Awards & Certifications - Industry Recognition | PISL Infra',
    seoDescription: 'Pislinfra awarded Best Safety Contractor by Adani, Reliance & more.',
    seoKeywords: 'safety awards, construction awards, Pislinfra awards',
    slug: 'about/awards', canonicalUrl: 'https://pislinfra.com/about/awards',
    ogTitle: 'Awards & Certifications - Industry Recognition | Pislinfra',
    ogDescription: 'A legacy of excellence recognized by industry leaders.',
    ogImage: 'https://pislinfra.com/images/hero/Awards-Certification.png',
    ogType: 'website', twitterTitle: 'Awards & Accolades | Pislinfra',
    twitterDescription: 'Safety excellence awards & industry certifications.',
    twitterImage: 'https://pislinfra.com/images/hero/Awards-Certification.png',
    twitterCardType: 'summary_large_image', schemaType: 'WebPage',
    breadcrumbSchema: true, organizationSchema: true,
    tags: ['Awards', 'Certifications', 'Safety', 'Excellence'],
  };

  const uniqueYears = useMemo(() => {
    const years = awardsAndCertifications.map(item => parseInt(item.year, 10)).filter(y => !isNaN(y));
    return ['All', ...[...new Set(years)].sort((a, b) => b - a)];
  }, []);

  const [selectedYear, setSelectedYear] = useState('All');

  const filteredData = useMemo(() => {
    if (selectedYear === 'All') return awardsAndCertifications;
    return awardsAndCertifications.filter(item => parseInt(item.year, 10) === selectedYear);
  }, [selectedYear]);

  const latestAchievementData = useMemo(() => {
    const data = filteredData.length > 0 ? filteredData[0] : awardsAndCertifications[0];
    if (!data) return null;
    return {
      year: parseInt(data.year, 10),
      title: data.title,
      organization: 'Industry Recognition',
      description: data.description,
      category: data.category,
      location: 'India',
      presentedBy: 'Industry Leaders',
      awardImage: data.image || data.clientImage,
      certificateImage: data.clientImage || data.image,
      highlights: ['Excellence in Industry', 'Commitment to Quality'],
    };
  }, [filteredData]);

  const awardsShowcaseData = useMemo(() => {
    return filteredData.filter(item => item.category !== 'Certification').map(item => {
      const images = [];
      if (item.image) images.push(item.image);
      if (item.clientImage) images.push(item.clientImage);
      
      return {
        id: item.id,
        title: item.title,
        name: item.title,
        year: item.year,
        category: item.category || 'Excellence',
        image: images.length > 0 ? images[0] : 'https://placehold.co/400x300?text=No+Image',
        gallery: images.length > 1 ? images.slice(1) : [],
        description: item.description,
      };
    });
  }, [filteredData]);

  const certificatesData = useMemo(() => {
    return filteredData.filter(item => item.category === 'Certification').map(item => {
      const images = [];
      if (item.image) images.push(item.image);
      if (item.clientImage) images.push(item.clientImage);
      
      return {
        id: item.id,
        name: item.title,
        issuer: 'Industry Authority',
        issueDate: item.year,
        expiryDate: 'Lifetime',
        image: images.length > 0 ? images[0] : 'https://placehold.co/400x300?text=No+Image',
        gallery: images.length > 1 ? images.slice(1) : [],
        description: item.description,
      };
    });
  }, [filteredData]);

  const handleYearFilterChange = useCallback((year) => setSelectedYear(year), []);
  const handleViewAwardDetails = useCallback((data) => { setSelectedAward(data); setActivePopupType('award'); }, []);
  const handleViewCertificateDetails = useCallback((data) => { setSelectedCertificate(data); setActivePopupType('certificate'); }, []);
  const handleClosePopup = useCallback(() => { setSelectedAward(null); setSelectedCertificate(null); setActivePopupType(null); }, []);
  const handleDownload = useCallback((url) => { if (url) window.open(url, '_blank'); }, []);
  const handleContactClick = useCallback(() => { navigate('/contact-us'); }, [navigate]);
  const handleViewProjects = useCallback(() => { navigate('/projects/completed'); }, [navigate]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const pageStyle = { fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: '#FFFFFF' };
  const scrollBtnStyle = { position: 'fixed', bottom: '32px', right: '32px', width: '48px', height: '48px', borderRadius: '16px', background: '#2A2A75', color: '#FFFFFF', border: 'none', boxShadow: '0 8px 24px rgba(42,42,117,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 999 };

  return (
    <div style={pageStyle}>
      <BlogSEO blog={seoData} />
      <PageHero title="Awards & Accolades" subtitle="A legacy of excellence, recognized by industry leaders" breadcrumb="About Us / Awards" bgImage="/images/hero/Awards-Certification.png" />
      <AwardsYearFilter onYearChange={handleYearFilterChange} initialYear={selectedYear} years={uniqueYears} />
      {latestAchievementData && <LatestAchievement achievementData={latestAchievementData} onViewDetails={handleViewAwardDetails} onDownload={handleDownload} />}
      <div id="excellence-showcase">
        <ExcellenceShowcase 
          awards={awardsShowcaseData} 
          certificates={certificatesData} 
          onViewAward={handleViewAwardDetails}
          onViewCertificate={handleViewCertificateDetails}
        />
      </div>
      <AwardsJourney statsData={{ awardsWon: 50, certificates: 25, yearsOfExcellence: 15, projectsDelivered: 500 }} onContactClick={handleContactClick} onViewProjects={handleViewProjects} />

      <AnimatePresence>
        {activePopupType === 'award' && selectedAward && (
          <AwardPopup isOpen={true} onClose={handleClosePopup} type="award" awardData={selectedAward} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activePopupType === 'certificate' && selectedCertificate && (
          <CertificatePopup isOpen={true} onClose={handleClosePopup} certificateData={selectedCertificate} />
        )}
      </AnimatePresence>

      {showScrollTop && (
        <button style={scrollBtnStyle} onClick={scrollToTop} onMouseEnter={(e) => { e.target.style.background = '#F37346'; e.target.style.transform = 'translateY(-3px)'; }} onMouseLeave={(e) => { e.target.style.background = '#2A2A75'; e.target.style.transform = 'translateY(0)'; }}>
          <ArrowUpIcon />
        </button>
      )}
    </div>
  );
};

export default Awards;