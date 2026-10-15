import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { fetchStrapiData } from '../../services/strapi';
import { getImageUrl } from '../../utils/imageUrl';
import clientsData from '../../data/clientsData';
import awardsAndCertifications from '../../data/Awards-&-Certifications';
import { sortAwardsByFeaturedAndDate } from '../../utils/awardSort';

const getLogo = (companyName) => {
  if (!companyName) return '/images/clients/default-logo.png';
  const name = companyName.toLowerCase();
  
  if (name.includes('adani')) {
    const adani = clientsData.find(c => c.name.toLowerCase().includes('adani'));
    return adani?.logo || '/images/clients/Adani.png';
  }
  if (name.includes('reliance') || name.includes('ril')) {
    const ril = clientsData.find(c => c.name.toLowerCase().includes('reliance'));
    return ril?.logo || '/images/clients/RIL.png';
  }
  if (name.includes('flipkart')) {
    const flipkart = clientsData.find(c => c.name.toLowerCase().includes('flipkart'));
    return flipkart?.logo || '/images/clients/Flipkart.png';
  }
  if (name.includes('prologis') || name.includes('prr')) {
    const prr = clientsData.find(c => c.name.toLowerCase().includes('prologis') || c.name.toLowerCase().includes('prr'));
    return prr?.logo || '/images/clients/Prologis.png';
  }
  if (name.includes('am/ns') || name.includes('amns') || name.includes('arcelor')) {
    const amns = clientsData.find(c => c.name.toLowerCase().includes('am/ns') || c.name.toLowerCase().includes('amns'));
    return amns?.logo || '/images/clients/AMNS.png';
  }
  if (name.includes('gar')) {
    const gar = clientsData.find(c => c.name.toLowerCase().includes('gar'));
    return gar?.logo || '/images/clients/GAR.png';
  }
  
  const client = clientsData.find(c => c.name && c.name.toLowerCase() === name);
  return client?.logo || '/images/clients/default-logo.png';
};

const defaultAwards = sortAwardsByFeaturedAndDate(awardsAndCertifications.map((item, idx) => ({
  id: item.id || idx + 1,
  company: item.company || 'Industry Leaders',
  title: item.title,
  desc: item.description || item.desc || '',
  year: String(item.year || '2026'),
  category: item.category || 'Excellence',
  location: item.location || 'India',
  featured: Boolean(item.featured || item.isFeatured),
  isFeatured: Boolean(item.featured || item.isFeatured),
  createdAt: item.createdAt || null,
  images: item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : ['/images/about/sustainable-infra-gold.jpg']),
  logo: getLogo(item.company)
})));

const NAVY   = '#0a2a66';
const ORANGE = '#ff8755';

const ImageSlider = ({ images, isHovered }) => {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    if (!images || images.length <= 1 || !isHovered) {
      setCurrent(0);
      return;
    }
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % images.length), 2500);
    return () => clearInterval(timer);
  }, [images, isHovered]);

  if (!images || images.length === 0) return <div style={{ position: 'absolute', inset: 0, background: '#e2e8f0' }} />;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {images.map((img, i) => (
        <img key={i} src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: current === i ? 1 : 0, transition: 'opacity 0.8s ease' }} />
      ))}
    </div>
  );
};

const Awards = ({ awardsData: propAwardsData, data: strapiHomeData }) => {
  const navigate = useNavigate();
  const [awards, setAwards] = useState(defaultAwards);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getFullUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${url}`;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const processAwardItem = (item) => {
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

          if (item.images && Array.isArray(item.images) && item.images.length > 0) {
            addImg(item.images);
          } else if (item.image) {
            addImg(item.image);
          } else if (item.imageUrls && Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
            addImg(item.imageUrls);
          } else if (item.image_urls && Array.isArray(item.image_urls) && item.image_urls.length > 0) {
            addImg(item.image_urls);
          } else if (item.clientImage) {
            addImg(item.clientImage);
          }

          const imageArray = allImgs.length > 0 ? allImgs : ['/images/awards/certificate.jpg'];

          return {
            id: item.documentId || item.id,
            title: item.title || 'Award Title',
            category: item.category || 'Award',
            year: item.year || new Date().getFullYear(),
            desc: item.desc || item.description || 'Award Description',
            company: item.company || 'Pragati Infra Solutions Pvt. Ltd.',
            location: item.location || 'India',
            featured: Boolean(item.featured || item.isFeatured),
            isFeatured: Boolean(item.featured || item.isFeatured),
            createdAt: item.createdAt || null,
            images: imageArray,
            logo: item.logo ? getImageUrl(item.logo, getLogo(item.company)) : getLogo(item.company)
          };
        };

        if (propAwardsData && Array.isArray(propAwardsData) && propAwardsData.length > 0) {
          const mapped = sortAwardsByFeaturedAndDate(propAwardsData.map(processAwardItem));
          if (mapped.length > 0) {
            setAwards(mapped);
            return;
          }
        }

        const data = await fetchStrapiData('awards?populate=*&sort=createdAt:desc');
        const rawList = Array.isArray(data) ? data : (data?.data || null);
        if (rawList && rawList.length > 0) {
          const mapped = rawList.map(processAwardItem);
          const existingTitles = new Set(mapped.map(a => (a.title || '').trim().toLowerCase()));
          const missing = defaultAwards.filter(d => !existingTitles.has((d.title || '').trim().toLowerCase()));
          setAwards(sortAwardsByFeaturedAndDate([...mapped, ...missing]));
        }
      } catch (err) {
        console.error("Awards Strapi fetch error:", err);
      }
    }
    loadData();
  }, [propAwardsData]);

  const gridAwards = awards.slice(0, 6);

  useEffect(() => {
    if (gridAwards.length === 0) return;
    const timer = setInterval(() => setActiveIndex(prev => (prev + 1) % gridAwards.length), 5000);
    return () => clearInterval(timer);
  }, [gridAwards.length]);

  if (awards.length === 0) return null;

  return (
    <section className="pisl-awards-section" style={{ padding: '45px 24px', background: '#f4f6fa' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="pisl-awards-header"
          style={{ 
            marginBottom: 24, 
            textAlign: 'center' 
          }}
        >
          <h2 className="pisl-awards-title" style={{ fontSize: 'clamp(24px, 3.5vw, 32px)', fontWeight: 800, color: NAVY, margin: 0, letterSpacing: '-1px' }}>
            Awards and <span style={{ color: ORANGE }}>Certification</span>
          </h2>
        </motion.div>

        {/* DESKTOP: Expanding Cards */}
        <div className="awards-expand-desktop" style={{ display: 'flex', gap: 14, height: 420, width: '100%', marginBottom: 20 }}>
          {gridAwards.map((award, index) => {
            const isActive = hoveredIndex === index || (hoveredIndex === null && activeIndex === index);
            return (
              <motion.div 
                key={award.id} 
                layout 
                onClick={() => {
                  if (isActive) {
                    navigate('/about/awards');
                  } else {
                    setActiveIndex(index);
                  }
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ 
                  position: 'relative', height: '100%', borderRadius: 20, overflow: 'hidden', 
                  cursor: 'pointer', 
                  flex: isActive ? 8 : 1, 
                  transition: 'flex 0.6s cubic-bezier(0.16, 1, 0.3, 1)', 
                  boxShadow: isActive ? '0 20px 40px rgba(10,42,102,0.2)' : '0 4px 10px rgba(10,42,102,0.04)' 
                }}>
                <ImageSlider images={award.images} isHovered={isActive} />
                <div style={{ position: 'absolute', inset: 0, background: isActive ? 'linear-gradient(90deg, rgba(10,42,102,0.96) 0%, rgba(10,42,102,0.75) 50%, rgba(10,42,102,0.15) 100%)' : 'linear-gradient(to top, rgba(10,42,102,0.95) 0%, rgba(10,42,102,0.25) 100%)', transition: 'background 0.6s ease' }} />
                
                {/* Collapsed */}
                <div style={{ position: 'absolute', inset: '20px 0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', opacity: isActive ? 0 : 1, pointerEvents: 'none', transition: 'opacity 0.3s ease', padding: '0 4px' }}>
                  <span className="v-title" style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '1.2px', textTransform: 'uppercase', whiteSpace: 'nowrap', writingMode: 'vertical-rl', transform: 'rotate(180deg)', marginBottom: 12, maxHeight: '65%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{award.title}</span>
                  <img src={award.logo} alt="" style={{ width: 32, height: 32, objectFit: 'contain', background: '#fff', borderRadius: 8, padding: 3, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
                </div>

                {/* Expanded */}
                <div style={{ position: 'absolute', inset: 0, padding: '28px 32px', display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none', transition: 'opacity 0.4s ease 0.2s' }}>
                  <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={award.logo} alt="" style={{ width: 40, height: 40, objectFit: 'contain', background: '#fff', borderRadius: 8, padding: 3, boxShadow: '0 4px 10px rgba(0,0,0,0.12)' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: '-0.2px' }}>{award.company}</p>
                        <span style={{ background: ORANGE, color: '#fff', padding: '2px 8px', borderRadius: 100, fontSize: 8.5, fontWeight: 800, textTransform: 'uppercase', display: 'inline-block', marginTop: 2 }}>{award.category} {award.year ? `· ${award.year}` : ''}</span>
                      </div>
                    </div>
                    <h3 style={{ fontSize: 19, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', letterSpacing: '-0.3px' }}>{award.title}</h3>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{award.desc}</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.15)', padding: '5px 10px', borderRadius: 100, backdropFilter: 'blur(10px)', width: 'fit-content' }}>
                        <FaMapMarkerAlt style={{ color: ORANGE, fontSize: 10 }} />
                        <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{award.location}</span>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/about/awards');
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '5px 12px',
                          background: ORANGE,
                          color: '#fff',
                          border: 'none',
                          borderRadius: '100px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 3px 10px rgba(243,115,70,0.3)',
                          transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Explore Award <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* MOBILE: 2x2 Clean Grid */}
        <div className="awards-all-mobile" style={{ display: 'none' }}>
          <div className="awards-mobile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
            {awards.slice(0, 4).map((award) => (
              <div 
                key={award.id} 
                onClick={() => navigate('/about/awards')}
                className="awards-mobile-card"
                style={{ 
                  background: '#ffffff', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 12px rgba(10,42,102,0.06)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div className="awards-mobile-img-wrap" style={{ height: '135px', overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                  {award.images && award.images.length > 0 ? (
                    <img src={award.images[0]} alt={award.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                  )}
                  {award.category && (
                    <span style={{ 
                      position: 'absolute', top: '8px', left: '8px', 
                      background: 'rgba(10,42,102,0.88)', backdropFilter: 'blur(4px)', 
                      color: '#fff', padding: '3px 8px', borderRadius: '4px', 
                      fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', 
                      letterSpacing: '0.4px', zIndex: 2 
                    }}>
                      {award.category}
                    </span>
                  )}
                </div>
                <div className="awards-mobile-card-content" style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <img src={award.logo} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px', background: '#fff', border: '1px solid #e2e8f0', padding: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', fontWeight: '800', color: NAVY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{award.company}</span>
                  </div>
                  <h4 style={{ 
                    fontSize: '12px', fontWeight: '800', color: '#1e293b', 
                    margin: '0 0 6px', lineHeight: '1.35', 
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden', minHeight: '32px' 
                  }}>
                    {award.title}
                  </h4>
                  <div style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    fontSize: '10px', color: '#64748b', marginTop: 'auto', paddingTop: '6px', 
                    borderTop: '1px solid #f1f5f9' 
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                      <FaMapMarkerAlt size={9} style={{ color: ORANGE, flexShrink: 0 }} />{award.location}
                    </span>
                    <span style={{ color: ORANGE, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      View <ChevronRight size={11} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button on Mobile */}
          <div className="awards-mobile-btn-wrap" style={{ marginTop: '18px', textAlign: 'center' }}>
            <button
              onClick={() => navigate('/about/awards')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                backgroundColor: NAVY,
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.2px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(10,42,102,0.18)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>View All Awards & Certifications</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .pisl-awards-section {
            padding: 34px 16px 38px 16px !important;
          }
          .pisl-awards-header {
            margin-bottom: 20px !important;
          }
          .pisl-awards-title {
            font-size: clamp(21px, 5.8vw, 26px) !important;
            letter-spacing: -0.5px !important;
          }
          .awards-expand-desktop { display: none !important; }
          .awards-all-mobile { display: block !important; }
        }

        @media (max-width: 640px) {
          .awards-mobile-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .awards-mobile-card {
            border-radius: 12px !important;
          }
          .awards-mobile-img-wrap {
            height: clamp(115px, 32vw, 135px) !important;
          }
          .awards-mobile-btn-wrap button {
            width: 100% !important;
            justify-content: center !important;
            padding: 11px 16px !important;
            font-size: 13px !important;
          }
        }

        @media (max-width: 360px) {
          .awards-mobile-grid {
            gap: 8px !important;
          }
          .awards-mobile-img-wrap {
            height: 105px !important;
          }
          .awards-mobile-card-content {
            padding: 8px 8px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Awards;
