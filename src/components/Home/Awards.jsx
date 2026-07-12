import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaShieldAlt, FaTrophy, FaHeart, FaWalking, FaStar, FaAward } from 'react-icons/fa';
import clientsData from '../../data/clientsData';

const getLogo = (name) => {
  const client = clientsData.find(c => c.name === name);
  return client?.logo || clientsData[0].logo;
};

const NAVY   = '#0a2a66';
const ORANGE = '#ff8755';

const awards = [
  { 
    id: 1, 
    company: 'Adani', 
    logo: getLogo('Adani'),
    title: 'Best Safety Conscious Contractor Award', 
    desc: 'Recognized at MPL-Green PVC Projects, Mundra for outstanding safety performance and continuous commitment towards workplace safety excellence.', 
    year: '2025', 
    category: 'Safety Excellence', 
    location: 'Mundra, Gujarat', 
    icon: FaShieldAlt, 
    images: ['/images/awards/adani-Mundra-Petrochem-limmited-Jan-25.png', '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project.png'] 
  },
  { 
    id: 2, 
    company: 'Reliance Industries Limited', 
    logo: getLogo('Reliance Industries Limited'),
    title: '2 Million LTI-Free Safe Manhours Achievement', 
    desc: 'Reliance Jamnagar project achieved 2 million LTI-free safe manhours through exceptional HSE practices and dedicated teamwork.', 
    year: '2024', 
    category: 'HSE Excellence', 
    location: 'Jamnagar, Gujarat', 
    icon: FaTrophy, 
    images: ['/images/awards/Reliance-Jamnagar-HSE.png', '/images/awards/Reliance-Jamnagar-HSE-(2).png'] 
  },
  { 
    id: 3, 
    company: 'Adani', 
    logo: getLogo('Adani'),
    title: '2 Million Safe Man-Hours Award', 
    desc: 'Adani MPL site successfully achieved 2 million safe man-hours, reflecting strong safety culture and zero-harm commitment.', 
    year: '2024', 
    category: 'Safety Milestone', 
    location: 'Mundra, Gujarat', 
    icon: FaAward, 
    images: ['/images/awards/Safety-Excellence-Awards-Adani.png', '/images/awards/Safety-Excellence-Awards-Adani-(2).png', '/images/awards/Mundra-Petrochem-Adani.png'] 
  },
  { 
    id: 4, 
    company: 'Flipkart', 
    logo: getLogo('Flipkart'),
    title: 'Flipkart Safety Excellence Appreciation', 
    desc: 'PISL Patli Project received appreciation from Flipkart for achieving 1.5 million safe man-hours without any LTI incident.', 
    year: '2024', 
    category: 'Safety Appreciation', 
    location: 'Patli, Haryana', 
    icon: FaStar, 
    images: ['/images/awards/NCR-Patli.png'] 
  },
  { 
    id: 5, 
    company: 'Adani', 
    logo: getLogo('Adani'),
    title: '1 Million Safe Hours Milestone', 
    desc: 'Mundra Team successfully crossed 1 million safe working hours with consistent dedication towards safety and operational discipline.', 
    year: '2024', 
    category: 'Safety Milestone', 
    location: 'Mundra, Gujarat', 
    icon: FaTrophy, 
    images: ['/images/awards/adani-Mundra-Petrochem-limmited-july2025.png', '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project-(2).png'] 
  },
  { 
    id: 6, 
    company: 'Adani', 
    logo: getLogo('Adani'),
    title: 'Best Safety Conscious Contractor Recognition', 
    desc: 'Awarded again at MPL-Green PVC Projects for maintaining exceptional HSE standards and safe execution practices.', 
    year: '2025', 
    category: 'Safety Excellence', 
    location: 'Mundra, Gujarat', 
    icon: FaShieldAlt, 
    images: ['/images/awards/Safety-Excellence-Awards-Adani-(3).png', '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project-(2).png'] 
  },
  { 
    id: 7, 
    company: 'Prologis',
    logo: getLogo('Prologis'), 
    title: 'National Safety Week Appreciation', 
    desc: 'PISL PRR Jhamuwas project team was appreciated by the client during the National Safety Week closing ceremony for outstanding safety participation.', 
    year: '2024', 
    category: 'Safety Week', 
    location: 'Jhamuwas, Haryana', 
    icon: FaStar, 
    images: ['/images/awards/Celebrated-National-Safety-PRR-Jhamuwas.png', '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(2).png'] 
  },
  { 
    id: 8, 
    company: 'GAR',
    logo: getLogo('GAR'), 
    title: 'Blood Donation Camp Initiative', 
    desc: 'Successfully conducted a Blood Donation Camp during the 54th National Safety Week Celebration at PRAGATI Mappedu Chennai Project.', 
    year: '2024', 
    category: 'CSR Initiative', 
    location: 'Chennai, Tamil Nadu', 
    icon: FaHeart, 
    images: ['/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(4).png'] 
  },
  { 
    id: 9, 
    company: 'Prologis',
    logo: getLogo('Prologis'), 
    title: 'Early Morning Safety Walk', 
    desc: 'Conducted an early morning safety walk at PRR Jhamuwas Site to strengthen awareness and proactive safety culture.', 
    year: '2024', 
    category: 'Safety Initiative', 
    location: 'Jhamuwas, Haryana', 
    icon: FaWalking, 
    images: ['/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(5).png', '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(6).png'] 
  },
  { 
    id: 10, 
    company: 'AM/NS India (ArcelorMittal Nippon Steel India)',
    logo: getLogo('AM/NS India (ArcelorMittal Nippon Steel India)'), 
    title: 'Safety Skid Awareness Program', 
    desc: 'Organized Safety Skid activity at CRM 02, AMNS Surat to promote hazard awareness and workplace safety engagement.', 
    year: '2024', 
    category: 'Safety Training', 
    location: 'Surat, Gujarat', 
    icon: FaShieldAlt, 
    images: ['/images/awards/Safety-Excellence-Awards-Adani-(2).png'] 
  },
];

const ImageSlider = ({ images, isHovered }) => {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    if (images.length <= 1 || !isHovered) {
      setCurrent(0);
      return;
    }
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % images.length), 2500);
    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {images.map((img, i) => (
        <img key={i} src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: current === i ? 1 : 0, transition: 'opacity 0.8s ease' }} />
      ))}
    </div>
  );
};

const Awards = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const gridAwards = awards.slice(0, 6);

  useEffect(() => {
    const timer = setInterval(() => setActiveIndex(prev => (prev + 1) % gridAwards.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ padding: '40px 24px', background: '#f4f6fa' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ marginBottom: 24, textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 800, color: NAVY, margin: 0, letterSpacing: '-1px' }}>
            Awards and <span style={{ color: NAVY }}>Certification</span>
          </h2>
        </motion.div>

        {/* DESKTOP: Expanding Cards */}
        <div className="awards-expand-desktop" style={{ display: 'flex', gap: 14, height: 360, width: '100%', marginBottom: 24 }}>
          {gridAwards.map((award, index) => {
            const isActive = hoveredIndex === index || (hoveredIndex === null && activeIndex === index);
            return (
              <motion.div 
                key={award.id} 
                layout 
                onClick={() => setActiveIndex(index)}
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
                <div style={{ position: 'absolute', inset: 0, background: isActive ? 'linear-gradient(90deg, rgba(10,42,102,0.95) 0%, rgba(10,42,102,0.7) 45%, rgba(10,42,102,0.1) 100%)' : 'linear-gradient(to top, rgba(10,42,102,0.95) 0%, rgba(10,42,102,0.2) 100%)', transition: 'background 0.6s ease' }} />
                
                {/* Collapsed */}
                <div style={{ position: 'absolute', inset: '16px 0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', opacity: isActive ? 0 : 1, pointerEvents: 'none', transition: 'opacity 0.3s ease', padding: '0 4px' }}>
                  <span className="v-title" style={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap', writingMode: 'vertical-rl', transform: 'rotate(180deg)', marginBottom: 10, maxHeight: '60%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{award.title}</span>
                  <img src={award.logo} alt="" style={{ width: 28, height: 28, objectFit: 'contain', background: '#fff', borderRadius: 6, padding: 2 }} />
                </div>

                {/* Expanded - FIXED TEXT SIZE */}
                <div style={{ position: 'absolute', inset: 0, padding: '20px 24px', display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none', transition: 'opacity 0.4s ease 0.2s' }}>
                  <div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={award.logo} alt="" style={{ width: 34, height: 34, objectFit: 'contain', background: '#fff', borderRadius: 6, padding: 3 }} />
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#fff' }}>{award.company}</p>
                        <span style={{ background: ORANGE, color: '#fff', padding: '2px 8px', borderRadius: 100, fontSize: 8, fontWeight: 800, textTransform: 'uppercase' }}>{award.category} · {award.year}</span>
                      </div>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{award.title}</h3>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{award.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.12)', padding: '4px 8px', borderRadius: 100, backdropFilter: 'blur(8px)', width: 'fit-content' }}>
                      <FaMapMarkerAlt style={{ color: ORANGE, fontSize: 9 }} />
                      <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>{award.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* MOBILE: All 10 Cards Grid */}
        <div className="awards-all-mobile" style={{ display: 'none' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {awards.map((award) => (
              <div key={award.id} style={{ background: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(10,42,102,0.04)' }}>
                <div style={{ height: '140px', overflow: 'hidden' }}>
                  <img src={award.images[0]} alt={award.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <img src={award.logo} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />
                    <span style={{ fontSize: '10px', fontWeight: '700', color: NAVY }}>{award.company}</span>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px', lineHeight: '1.3' }}>{award.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#94a3b8' }}>
                    <FaMapMarkerAlt size={9} style={{ color: ORANGE }} />{award.location}
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