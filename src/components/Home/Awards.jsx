import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { fetchStrapiData } from '../../services/strapi';
import { getImageUrl } from '../../utils/imageUrl';
import clientsData from '../../data/clientsData';

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

const defaultAwards = [
  { 
    id: 1, 
    company: 'Adani', 
    title: 'Best Safety Conscious Contractor Award', 
    desc: 'Recognized at MPL-Green PVC Projects, Mundra for outstanding safety performance and continuous commitment towards workplace safety excellence.', 
    year: '2025', 
    category: 'Safety Excellence', 
    location: 'Mundra, Gujarat', 
    images: [
      '/images/awards/adani-Mundra-Petrochem-limmited-Jan-25.png',
      '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project.png'
    ],
    logo: getLogo('Adani')
  },
  { 
    id: 2, 
    company: 'Reliance Industries Limited', 
    title: '2 Million LTI-Free Safe Manhours Achievement', 
    desc: 'Reliance Jamnagar project achieved 2 million LTI-free safe manhours through exceptional HSE practices and dedicated teamwork.', 
    year: '2024', 
    category: 'HSE Excellence', 
    location: 'Jamnagar, Gujarat', 
    images: [
      '/images/awards/Reliance-Jamnagar-HSE.png',
      '/images/awards/Reliance-Jamnagar-HSE-(2).png'
    ],
    logo: getLogo('Reliance')
  },
  { 
    id: 3, 
    company: 'Adani', 
    title: '2 Million Safe Man-Hours Award', 
    desc: 'Adani MPL site successfully achieved 2 million safe man-hours, reflecting strong safety culture and zero-harm commitment.', 
    year: '2024', 
    category: 'Safety Milestone', 
    location: 'Mundra, Gujarat', 
    images: [
      '/images/awards/Safety-Excellence-Awards-Adani.png',
      '/images/awards/Safety-Excellence-Awards-Adani-(2).png',
      '/images/awards/Mundra-Petrochem-Adani.png'
    ],
    logo: getLogo('Adani')
  },
  { 
    id: 4, 
    company: 'Flipkart', 
    title: 'Flipkart Safety Excellence Appreciation', 
    desc: 'PISL Patli Project received appreciation from Flipkart for achieving 1.5 million safe man-hours without any LTI incident.', 
    year: '2024', 
    category: 'Safety Appreciation', 
    location: 'Patli, Haryana', 
    images: [
      '/images/awards/NCR-Patli.png'
    ],
    logo: getLogo('Flipkart')
  },
  { 
    id: 5, 
    company: 'Adani', 
    title: '1 Million Safe Hours Milestone', 
    desc: 'Mundra Team successfully crossed 1 million safe working hours with consistent dedication towards safety and operational discipline.', 
    year: '2024', 
    category: 'Safety Milestone', 
    location: 'Mundra, Gujarat', 
    images: [
      '/images/awards/adani-Mundra-Petrochem-limmited-july2025.png',
      '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project-(2).png'
    ],
    logo: getLogo('Adani')
  },
  { 
    id: 6, 
    company: 'Adani', 
    title: 'Best Safety Conscious Contractor Recognition', 
    desc: 'Awarded again at MPL-Green PVC Projects for maintaining exceptional HSE standards and safe execution practices.', 
    year: '2025', 
    category: 'Safety Excellence', 
    location: 'Mundra, Gujarat', 
    images: [
      '/images/awards/Safety-Excellence-Awards-Adani-(3).png',
      '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project-(2).png'
    ],
    logo: getLogo('Adani')
  },
  { 
    id: 7, 
    company: 'Prologis', 
    title: 'National Safety Week Appreciation', 
    desc: 'PISL PRR Jhamuwas project team was appreciated by the client during the National Safety Week closing ceremony for outstanding safety participation.', 
    year: '2024', 
    category: 'Safety Week', 
    location: 'Jhamuwas, Haryana', 
    images: [
      '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas.png',
      '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(2).png'
    ],
    logo: getLogo('Prologis')
  },
  { 
    id: 8, 
    company: 'GAR', 
    title: 'Blood Donation Camp Initiative', 
    desc: 'Successfully conducted a Blood Donation Camp during the 54th National Safety Week Celebration at PRAGATI Mappedu Chennai Project.', 
    year: '2024', 
    category: 'CSR Initiative', 
    location: 'Chennai, Tamil Nadu', 
    images: [
      '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(3).png',
      '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(4).png'
    ],
    logo: getLogo('GAR')
  },
  { 
    id: 9, 
    company: 'Prologis', 
    title: 'Early Morning Safety Walk', 
    desc: 'Conducted an early morning safety walk at PRR Jhamuwas Site to strengthen awareness and proactive safety culture.', 
    year: '2024', 
    category: 'Safety Initiative', 
    location: 'Jhamuwas, Haryana', 
    images: [
      '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(5).png',
      '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(6).png'
    ],
    logo: getLogo('Prologis')
  },
  { 
    id: 10, 
    company: 'AM/NS India', 
    title: 'Safety Skid Awareness Program', 
    desc: 'Organized Safety Skid activity at CRM 02, AMNS Surat to promote hazard awareness and workplace safety engagement.', 
    year: '2024', 
    category: 'Safety Training', 
    location: 'Surat, Gujarat', 
    images: [
      '/images/awards/Safety-Excellence-Awards-Adani-(2).png'
    ],
    logo: getLogo('AM/NS India')
  }
];

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
    return url.startsWith('http') ? url : `http://localhost:1337${url}`;
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
            images: imageArray,
            logo: item.logo ? getImageUrl(item.logo, getLogo(item.company)) : getLogo(item.company)
          };
        };

        if (propAwardsData && Array.isArray(propAwardsData) && propAwardsData.length > 0) {
          const mapped = propAwardsData.map(processAwardItem);
          if (mapped.length > 0) {
            setAwards(mapped);
            return;
          }
        }

        const data = await fetchStrapiData('awards?populate=*&sort=order:asc');
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map(processAwardItem);
          if (mapped.length > 0) {
            setAwards(mapped);
          }
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
    <section style={{ padding: '45px 24px', background: '#f4f6fa' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          style={{ 
            marginBottom: 24, 
            textAlign: 'center' 
          }}
        >
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 32px)', fontWeight: 800, color: NAVY, margin: 0, letterSpacing: '-1px' }}>
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

        {/* MOBILE: Grid */}
        <div className="awards-all-mobile" style={{ display: 'none' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {awards.map((award) => (
              <div 
                key={award.id} 
                onClick={() => navigate('/about/awards')}
                style={{ 
                  background: '#ffffff', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 12px rgba(10,42,102,0.06)',
                  cursor: 'pointer' 
                }}
              >
                <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                  {award.images && award.images.length > 0 ? (
                    <img src={award.images[0]} alt={award.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                  )}
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <img src={award.logo} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />
                    <span style={{ fontSize: '10px', fontWeight: '700', color: NAVY }}>{award.company}</span>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px', lineHeight: '1.3' }}>{award.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#94a3b8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaMapMarkerAlt size={9} style={{ color: ORANGE }} />{award.location}
                    </span>
                    <span style={{ color: ORANGE, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      View <ChevronRight size={11} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .awards-expand-desktop { display: none !important; }
          .awards-all-mobile { display: block !important; }
        }
        @media (max-width: 480px) {
          .awards-all-mobile > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default Awards;
