import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAwardsData from '../../data/Awards-&-Certifications';
import { fetchStrapiData } from '../../services/strapi';
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

const getImageUrl = (imgObj, defaultImg = '') => {
  if (!imgObj) return defaultImg;
  let url = typeof imgObj === 'string' ? imgObj : (imgObj.url || imgObj.data?.attributes?.url);
  if (!url || typeof url !== 'string') return defaultImg;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('/uploads')) return `${import.meta.env.VITE_STRAPI_URL || "http://127.0.0.1:1337"}${url}`;
  return url;
};

const Awards = () => {
  const navigate = useNavigate();

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [activePopupType, setActivePopupType] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [awardsAndCertifications, setAwardsAndCertifications] = useState(defaultAwardsData);
  const [clientAppreciationsData, setClientAppreciationsData] = useState([]);
  const [milestonesData, setMilestonesData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        let pageRes = await fetchStrapiData('awards-page?populate[0]=heroImage&populate[1]=seo').catch(() => null);
        let awardsList = await fetchStrapiData('awards?populate=*&pagination[pageSize]=100&sort=createdAt:desc').catch(() => null);
        let clientAppreciations = await fetchStrapiData('client-appreciations?populate=*&pagination[pageSize]=100&sort=createdAt:desc').catch(() => null);
        let milestonesRes = await fetchStrapiData('milestones?populate=*&pagination[pageSize]=100&sort=year:asc').catch(() => null)
          || await fetchStrapiData('timeline-milestones?populate=*&pagination[pageSize]=100&sort=year:asc').catch(() => null);
        
        if (milestonesRes && Array.isArray(milestonesRes) && milestonesRes.length > 0) {
          const formattedMilestones = milestonesRes.map((m, idx) => ({
            id: m.documentId || m.id || idx + 1,
            year: String(m.year || ''),
            tag: m.tag || m.category || 'Milestone',
            awardsCount: m.awardsCount || `${m.totalAwards || 1} Awards Won`,
            title: m.title,
            desc: m.desc || m.description,
            stats: m.stats || `Total ${m.totalAwards || 1} Awards | Landmark EPC`,
            highlights: m.highlights ? (Array.isArray(m.highlights) ? m.highlights : [m.highlights]) : [],
            image: getImageUrl(m.image || m.coverImage, '/images/about/sustainable-infra-gold.jpg'),
            color: idx % 2 === 0 ? '#1E2A5A' : '#F37346'
          }));
          setMilestonesData(formattedMilestones);
        }

        if (clientAppreciations && clientAppreciations.data) {
          const formattedClientAppreciations = clientAppreciations.data.map((item, index) => ({
            id: item.documentId || item.id,
            company: item.company,
            title: item.title,
            desc: item.desc,
            year: item.year,
            category: item.category,
            location: item.location,
            icon: item.icon,
            images: item.images ? item.images.map(img => getImageUrl(img, '')) : []
          }));
          setClientAppreciationsData(formattedClientAppreciations);
        }

        if (pageRes) {
          setPageData(pageRes);
        }

        if (awardsList && Array.isArray(awardsList) && awardsList.length > 0) {
          const mappedAwards = awardsList.map((strapiItem, i) => {
            const defaultItem = defaultAwardsData.find(d => 
              (d.title || '').trim().toLowerCase() === (strapiItem.title || '').trim().toLowerCase()
            );

            // Extract all image URLs from strapiItem (images array, image obj, imageUrls, image_urls, clientImage)
            const allImgs = [];
            const addImg = (img) => {
              if (!img) return;
              if (Array.isArray(img)) {
                img.forEach(addImg);
                return;
              }
              const formatted = getImageUrl(img, '');
              if (formatted && !allImgs.includes(formatted)) {
                allImgs.push(formatted);
              }
            };

            // 1. Prioritize Strapi Media uploads (images array or image obj) exclusively
            if (strapiItem.images && Array.isArray(strapiItem.images) && strapiItem.images.length > 0) {
              addImg(strapiItem.images);
            } else if (strapiItem.image) {
              addImg(strapiItem.image);
            } else if (strapiItem.imageUrls && Array.isArray(strapiItem.imageUrls) && strapiItem.imageUrls.length > 0) {
              addImg(strapiItem.imageUrls);
            } else if (strapiItem.image_urls && Array.isArray(strapiItem.image_urls) && strapiItem.image_urls.length > 0) {
              addImg(strapiItem.image_urls);
            } else if (strapiItem.clientImage) {
              addImg(strapiItem.clientImage);
            }

            if (allImgs.length === 0 && defaultItem) {
              if (defaultItem.images) addImg(defaultItem.images);
              else {
                if (defaultItem.image) addImg(defaultItem.image);
                if (defaultItem.clientImage) addImg(defaultItem.clientImage);
              }
            }

            const primaryImg = allImgs[0] || defaultItem?.image || '/images/awards/certificate.jpg';
            const secondaryImg = allImgs[1] || defaultItem?.clientImage || primaryImg;

            return {
              id: strapiItem.documentId || strapiItem.id || (defaultItem ? defaultItem.id : i + 1),
              title: strapiItem.title || (defaultItem ? defaultItem.title : 'Award'),
              category: strapiItem.category || (defaultItem ? defaultItem.category : 'Excellence'),
              year: String(strapiItem.year || defaultItem?.year || '2025'),
              company: strapiItem.company || (defaultItem ? defaultItem.company : 'Industry Recognition'),
              location: strapiItem.location || (defaultItem ? defaultItem.location : 'India'),
              description: strapiItem.desc || strapiItem.description || (defaultItem ? defaultItem.description : ''),
              videoUrl: strapiItem.videoUrl || (defaultItem ? defaultItem.videoUrl : null),
              image: primaryImg,
              clientImage: secondaryImg,
              images: allImgs.length > 0 ? allImgs : [primaryImg],
              gallery: allImgs.length > 1 ? allImgs.slice(1) : [],
              pdf: getImageUrl(strapiItem.pdf, defaultItem?.pdf),
            };
          });

          // Strapi live CMS is the master single source of truth
          setAwardsAndCertifications(mappedAwards);
        }
      } catch (err) {
        console.error('Error fetching Awards data', err);
      }
    };
    loadData();
  }, []);

  const seoData = {
    contentType: 'page',
    title: 'Awards & Industry Recognitions | Pislinfra',
    seoTitle: 'Awards & Certifications - Safety Milestones & Industry Honors | Pislinfra',
    seoDescription: 'Explore Pislinfra prestigious awards, US LEED Gold certification, and zero-LTI safety milestones awarded by Adani, Reliance, and leading industry councils.',
    seoKeywords: 'Pislinfra awards, construction awards India, safety excellence awards, Adani best safety contractor, LEED Gold warehousing, industrial EPC honors, turnkey infrastructure accolades, 2026 infrastructure award',
    slug: 'about/awards',
    canonicalUrl: 'https://pislinfra.com/about/awards',
    ogTitle: 'Awards & Accolades - Industry Excellence | Pislinfra',
    ogDescription: 'A legacy of excellence recognized by India\'s top industrial conglomerates. Celebrating safety milestones, LEED Gold warehousing, and turnkey EPC achievements.',
    ogImage: 'https://pislinfra.com/images/hero/Awards-Certification.png',
    ogType: 'website',
    twitterTitle: 'Awards & Certifications | Pislinfra',
    twitterDescription: 'Recognized for safety excellence, green building innovation, and record-breaking industrial EPC execution across India.',
    twitterImage: 'https://pislinfra.com/images/hero/Awards-Certification.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Awards', 'Certifications', 'Safety Excellence', 'LEED Gold', 'Industrial EPC', 'Infrastructure Milestones', 'Pislinfra'],
  };

  const uniqueYears = useMemo(() => {
    const dataYears = (awardsAndCertifications || [])
      .map(item => parseInt(item.year, 10))
      .filter(y => !isNaN(y) && y > 2000);
    
    const minYear = dataYears.length > 0 ? Math.min(...dataYears, 2021) : 2021;
    const maxYear = dataYears.length > 0 ? Math.max(...dataYears, 2026) : 2026;
    
    const allYearsRange = [];
    for (let y = maxYear; y >= minYear; y--) {
      allYearsRange.push(y);
    }
    
    const merged = [...new Set([...allYearsRange, ...dataYears])].sort((a, b) => b - a);
    return ['All', ...merged];
  }, [awardsAndCertifications]);

  const [selectedYear, setSelectedYear] = useState('All');

  const filteredData = useMemo(() => {
    if (selectedYear === 'All' || !selectedYear) return awardsAndCertifications;
    const targetYear = String(selectedYear).trim();
    return awardsAndCertifications.filter(item => String(item.year || '').trim() === targetYear);
  }, [selectedYear, awardsAndCertifications]);

  const latestAchievementData = useMemo(() => {
    const list = filteredData.length > 0 ? filteredData : awardsAndCertifications;
    const targetList = list.filter(item => item.category !== 'Certification');
    const data = targetList.length > 0 ? targetList[0] : (list.length > 0 ? list[0] : null);
    if (!data) return null;
    return {
      id: data.id,
      year: parseInt(data.year, 10) || 2025,
      title: data.title,
      organization: data.company || 'Industry Recognition',
      description: data.description,
      category: data.category || 'Excellence Award',
      location: data.location || 'India',
      presentedBy: data.company || 'Industry Leaders',
      awardImage: data.image || data.clientImage,
      certificateImage: data.clientImage || data.image,
      images: data.images || (data.image ? [data.image] : []),
      gallery: data.gallery || [],
      highlights: [
        data.category || 'Excellence Recognition',
        `Recognized in ${data.year || '2025'}`,
        'Quality Assurance & Safety',
        'Industry Benchmark Standards'
      ],
    };
  }, [filteredData, awardsAndCertifications]);

  const awardsShowcaseData = useMemo(() => {
    return filteredData.filter(item => item.category !== 'Certification').map(item => {
      const images = [];
      if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        images.push(...item.images);
      } else {
        if (item.image) images.push(item.image);
        if (item.clientImage && !images.includes(item.clientImage)) images.push(item.clientImage);
      }
      
      return {
        id: item.id,
        title: item.title,
        name: item.title,
        year: item.year,
        category: item.category || 'Excellence',
        company: item.company,
        location: item.location,
        image: images.length > 0 ? images[0] : 'https://placehold.co/400x300?text=No+Image',
        gallery: images.length > 1 ? images.slice(1) : [],
        images: images,
        description: item.description,
        presentedBy: item.company || 'Industry Leaders'
      };
    });
  }, [filteredData, awardsAndCertifications]);

  const certificatesData = useMemo(() => {
    return filteredData.filter(item => item.category === 'Certification').map(item => {
      const images = [];
      if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        images.push(...item.images);
      } else {
        if (item.image) images.push(item.image);
        if (item.clientImage && !images.includes(item.clientImage)) images.push(item.clientImage);
      }
      
      return {
        id: item.id,
        name: item.title,
        issuer: item.company || 'Industry Authority',
        issueDate: item.year,
        expiryDate: 'Lifetime',
        image: images.length > 0 ? images[0] : 'https://placehold.co/400x300?text=No+Image',
        gallery: images.length > 1 ? images.slice(1) : [],
        images: images,
        description: item.description,
      };
    });
  }, [filteredData, awardsAndCertifications]);

  // Deep-linking URL parameter handler & Dynamic JSON-LD Schema for Googlebot Indexing
  useEffect(() => {
    // 1. Inject Dynamic JSON-LD for Googlebot
    const scriptId = 'awards-individual-jsonld';
    let scriptEl = document.getElementById(scriptId);
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Pislinfra Awards, Accolades & Certifications Index",
      "description": "Official index of all industry recognition awards, US LEED Gold certifications, and zero-LTI safety milestones awarded to Pislinfra.",
      "numberOfItems": awardsAndCertifications.length,
      "itemListElement": awardsAndCertifications.map((item, idx) => {
        const rawImg = item.image || item.clientImage || (item.images && item.images[0]) || '/images/hero/Awards-Certification.png';
        const absoluteImage = rawImg.startsWith('http') ? rawImg : `https://pislinfra.com${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;

        return {
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": item.category === "Certification" ? "EducationalOccupationalCredential" : "Award",
            "name": item.title,
            "description": item.description,
            "image": {
              "@type": "ImageObject",
              "contentUrl": absoluteImage,
              "url": absoluteImage,
              "name": `${item.title} - ${item.category || 'Excellence'} Award`,
              "caption": `${item.title} awarded to Pislinfra in ${item.year || '2026'}. ${item.description || ''}`,
              "representativeOfPage": idx === 0,
              "author": {
                "@type": "Organization",
                "name": "Pragati Infra Solutions Pvt. Ltd."
              },
              "copyrightHolder": {
                "@type": "Organization",
                "name": "Pislinfra"
              }
            },
            "dateCreated": String(item.year || "2026"),
            "category": item.category || "Safety & Infrastructure Excellence",
            "provider": {
              "@type": "Organization",
              "name": item.company || "National Infrastructure & Safety Council"
            },
            "recipient": {
              "@type": "Organization",
              "name": "Pragati Infra Solutions Pvt. Ltd. (PISL Infra)",
              "url": "https://pislinfra.com"
            },
            "url": `https://pislinfra.com/about/awards?award=${encodeURIComponent(item.id || item.title)}`
          }
        };
      })
    };

    scriptEl.textContent = JSON.stringify(structuredData);

    // 2. Check for URL deep-link parameters (?award=... or ?certificate=...)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const awardParam = urlParams.get('award');
      const certParam = urlParams.get('certificate');

      if (awardParam) {
        const found = awardsAndCertifications.find(a => 
          String(a.id) === awardParam || 
          (a.title && a.title.toLowerCase() === decodeURIComponent(awardParam).toLowerCase())
        );
        if (found) {
          setSelectedAward({
            name: found.title,
            image: found.image || found.clientImage,
            certificate: found.clientImage || found.image,
            description: found.description,
            date: found.year,
            location: found.location || 'India',
            organization: found.company || 'Industry Leaders'
          });
          setActivePopupType('award');
        }
      } else if (certParam) {
        const found = awardsAndCertifications.find(a => 
          String(a.id) === certParam || 
          (a.title && a.title.toLowerCase() === decodeURIComponent(certParam).toLowerCase())
        );
        if (found) {
          setSelectedCertificate({
            name: found.title,
            image: found.image || found.clientImage,
            description: found.description,
            issueDate: found.year,
            issuer: found.company || 'Industry Authority'
          });
          setActivePopupType('certificate');
        }
      }
    } catch (e) {
      console.error('URL param parsing error', e);
    }

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [awardsAndCertifications]);

  const handleYearFilterChange = useCallback((year) => setSelectedYear(year), []);
  const handleViewAwardDetails = useCallback((data) => { 
    setSelectedAward(data); 
    setActivePopupType('award'); 
    if (data.name || data.title) {
      const awardId = data.id || data.name || data.title;
      window.history.replaceState(null, '', `?award=${encodeURIComponent(awardId)}`);
    }
  }, []);
  const handleViewCertificateDetails = useCallback((data) => { 
    setSelectedCertificate(data); 
    setActivePopupType('certificate'); 
    if (data.name || data.title) {
      const certId = data.id || data.name || data.title;
      window.history.replaceState(null, '', `?certificate=${encodeURIComponent(certId)}`);
    }
  }, []);
  const handleClosePopup = useCallback(() => { 
    setSelectedAward(null); 
    setSelectedCertificate(null); 
    setActivePopupType(null); 
    window.history.replaceState(null, '', window.location.pathname);
  }, []);
  const handleDownload = useCallback((url) => { if (url) window.open(url, '_blank'); }, []);
  const handleContactClick = useCallback(() => { navigate('/contact-us'); }, [navigate]);
  const handleViewProjects = useCallback(() => { navigate('/projects/completed'); }, [navigate]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [awardsAndCertifications]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const pageStyle = { fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: '#FFFFFF' };
  const scrollBtnStyle = { position: 'fixed', bottom: '32px', right: '32px', width: '48px', height: '48px', borderRadius: '16px', background: '#2A2A75', color: '#FFFFFF', border: 'none', boxShadow: '0 8px 24px rgba(42,42,117,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 999 };

  return (
    <div style={pageStyle}>
      <BlogSEO blog={seoData} />
      
      {/* Search Engine Crawlable Microdata for each Individual Award */}
      <div style={{ display: 'none' }} aria-hidden="true">
        {awardsAndCertifications.map((item, idx) => (
          <article key={item.id || idx} itemScope itemType="https://schema.org/Award">
            <h3 itemProp="name">{item.title}</h3>
            <p itemProp="description">{item.description}</p>
            <span itemProp="dateCreated">{item.year}</span>
            <span itemProp="category">{item.category}</span>
            {item.company && <span itemProp="provider">{item.company}</span>}
            {(item.image || item.clientImage) && <img itemProp="image" src={item.image || item.clientImage} alt={item.title} />}
          </article>
        ))}
      </div>

      <PageHero title={pageData?.title || "Awards & Accolades"} subtitle={pageData?.subtitle || "A legacy of excellence, recognized by industry leaders"} breadcrumb={pageData?.breadcrumb || "About Us / Awards"} bgImage={pageData?.heroImage?.url ? `http://127.0.0.1:1337${pageData.heroImage.url}` : pageData?.heroImage?.data?.attributes?.url ? `http://127.0.0.1:1337${pageData.heroImage.data.attributes.url}` : "/images/hero/Awards-Certification.png"} />
      {latestAchievementData && (
        <LatestAchievement 
          achievements={awardsAndCertifications.filter(a => a.category !== 'Certification').slice(0, 5)} 
          achievementData={latestAchievementData} 
          onViewDetails={handleViewAwardDetails} 
          onDownload={handleDownload} 
          title={pageData?.latestAchievementTitle} 
        />
      )}
      <div id="excellence-showcase">
        <ExcellenceShowcase 
          awards={awardsShowcaseData} 
          allAwards={awardsAndCertifications}
          milestones={milestonesData}
          certificates={certificatesData}
          clientAppreciations={clientAppreciationsData} 
          selectedYear={selectedYear}
          onYearChange={handleYearFilterChange}
          years={uniqueYears}
          onViewAward={handleViewAwardDetails}
          onViewCertificate={handleViewCertificateDetails}
        />
      </div>
      <AwardsJourney statsData={{ awardsWon: pageData?.awardsWon || 50, certificates: pageData?.certificates || 25, yearsOfExcellence: pageData?.yearsOfExcellence || 15, projectsDelivered: pageData?.projectsDelivered || 500 }} onContactClick={handleContactClick} onViewProjects={handleViewProjects} title={pageData?.journeyTitle} desc={pageData?.journeyDesc} />

      {activePopupType === 'award' && selectedAward && (
        <AwardPopup isOpen={true} onClose={handleClosePopup} type="award" awardData={selectedAward} />
      )}
      {activePopupType === 'certificate' && selectedCertificate && (
        <CertificatePopup isOpen={true} onClose={handleClosePopup} certificateData={selectedCertificate} />
      )}

      {showScrollTop && (
        <button style={scrollBtnStyle} onClick={scrollToTop} onMouseEnter={(e) => { e.target.style.background = '#F37346'; e.target.style.transform = 'translateY(-3px)'; }} onMouseLeave={(e) => { e.target.style.background = '#2A2A75'; e.target.style.transform = 'translateY(0)'; }}>
          <ArrowUpIcon />
        </button>
      )}
    </div>
  );
};

export default Awards;