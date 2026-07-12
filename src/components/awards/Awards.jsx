import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaShieldAlt, FaTrophy, FaHeart, FaWalking, FaStar, FaAward } from 'react-icons/fa';
import clientsData from '../../data/clientsData';

const getLogo = (name) => {
  if (!name) return clientsData[0]?.logo || null;
  
  let client = clientsData.find(c => c.name === name);
  if (client) return client.logo;
  
  client = clientsData.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (client) return client.logo;
  
  client = clientsData.find(c => 
    c.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(c.name.toLowerCase())
  );
  if (client) return client.logo;
  
  return clientsData[0]?.logo || null;
};

const NAVY   = '#28286e';
const ORANGE = '#ff8755';

const awards = [
  { 
    id: 1, company: 'Adani', logo: getLogo('Adani'),
    title: 'Best Safety Conscious Contractor Award', 
    desc: 'Recognized at MPL-Green PVC Projects, Mundra for outstanding safety performance and continuous commitment towards workplace safety excellence.', 
    year: '2025', category: 'Safety Excellence', location: 'Mundra, Gujarat', icon: FaShieldAlt, 
    images: ['/images/awards/adani-Mundra-Petrochem-limmited-Jan-25.png', '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project.png'] 
  },
  { 
    id: 2, company: 'Reliance Industries Limited', logo: getLogo('Reliance Industries Limited'),
    title: '2 Million LTI-Free Safe Manhours Achievement', 
    desc: 'Reliance Jamnagar project achieved 2 million LTI-free safe manhours through exceptional HSE practices and dedicated teamwork.', 
    year: '2024', category: 'HSE Excellence', location: 'Jamnagar, Gujarat', icon: FaTrophy, 
    images: ['/images/awards/Reliance-Jamnagar-HSE.png', '/images/awards/Reliance-Jamnagar-HSE-(2).png'] 
  },
  { 
    id: 3, company: 'Adani', logo: getLogo('Adani'),
    title: '2 Million Safe Man-Hours Award', 
    desc: 'Adani MPL site successfully achieved 2 million safe man-hours, reflecting strong safety culture and zero-harm commitment.', 
    year: '2024', category: 'Safety Milestone', location: 'Mundra, Gujarat', icon: FaAward, 
    images: ['/images/awards/Safety-Excellence-Awards-Adani.png', '/images/awards/Safety-Excellence-Awards-Adani-(2).png', '/images/awards/Mundra-Petrochem-Adani.png'] 
  },
  { 
    id: 4, company: 'Flipkart', logo: getLogo('Flipkart'),
    title: 'Flipkart Safety Excellence Appreciation', 
    desc: 'PISL Patli Project received appreciation from Flipkart for achieving 1.5 million safe man-hours without any LTI incident.', 
    year: '2024', category: 'Safety Appreciation', location: 'Patli, Haryana', icon: FaStar, 
    images: ['/images/awards/NCR-Patli.png'] 
  },
  { 
    id: 5, company: 'Adani', logo: getLogo('Adani'),
    title: '1 Million Safe Hours Milestone', 
    desc: 'Mundra Team successfully crossed 1 million safe working hours with consistent dedication towards safety and operational discipline.', 
    year: '2024', category: 'Safety Milestone', location: 'Mundra, Gujarat', icon: FaTrophy, 
    images: ['/images/awards/adani-Mundra-Petrochem-limmited-july2025.png', '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project-(2).png'] 
  },
  { 
    id: 6, company: 'Adani', logo: getLogo('Adani'),
    title: 'Best Safety Conscious Contractor Recognition', 
    desc: 'Awarded again at MPL-Green PVC Projects for maintaining exceptional HSE standards and safe execution practices.', 
    year: '2025', category: 'Safety Excellence', location: 'Mundra, Gujarat', icon: FaShieldAlt, 
    images: ['/images/awards/Safety-Excellence-Awards-Adani-(3).png', '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project-(2).png'] 
  },
  { 
    id: 7, company: 'Prologis', logo: getLogo('Prologis'),
    title: 'National Safety Week Appreciation', 
    desc: 'PISL PRR Jhamuwas project team was appreciated by the client during the National Safety Week closing ceremony for outstanding safety participation.', 
    year: '2024', category: 'Safety Week', location: 'Jhamuwas, Haryana', icon: FaStar, 
    images: ['/images/awards/Celebrated-National-Safety-PRR-Jhamuwas.png', '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(2).png'] 
  },
  { 
    id: 8, company: 'GAR', logo: getLogo('GAR'),
    title: 'Blood Donation Camp Initiative', 
    desc: 'Successfully conducted a Blood Donation Camp during the 54th National Safety Week Celebration at PRAGATI Mappedu Chennai Project.', 
    year: '2024', category: 'CSR Initiative', location: 'Chennai, Tamil Nadu', icon: FaHeart, 
    images: ['/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(4).png'] 
  },
  { 
    id: 9, company: 'Prologis', logo: getLogo('Prologis'),
    title: 'Early Morning Safety Walk', 
    desc: 'Conducted an early morning safety walk at PRR Jhamuwas Site to strengthen awareness and proactive safety culture.', 
    year: '2024', category: 'Safety Initiative', location: 'Jhamuwas, Haryana', icon: FaWalking, 
    images: ['/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(5).png', '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(6).png'] 
  },
  { 
    id: 10, company: 'AM/NS India (ArcelorMittal Nippon Steel India)', logo: getLogo('AM/NS India (ArcelorMittal Nippon Steel India)'),
    title: 'Safety Skid Awareness Program', 
    desc: 'Organized Safety Skid activity at CRM 02, AMNS Surat to promote hazard awareness and workplace safety engagement.', 
    year: '2024', category: 'Safety Training', location: 'Surat, Gujarat', icon: FaShieldAlt, 
    images: ['/images/awards/Safety-Excellence-Awards-Adani-(2).png'] 
  },
];

const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, [images.length]);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {images.map((img, i) => (
        <img key={i} src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: current === i ? 1 : 0, transition: 'opacity 0.8s ease' }} />
      ))}
    </div>
  );
};

const SliderCard = ({ award, index }) => {
  const Icon = award.icon;
  const [isHovered, setIsHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => {
    if (award.images.length <= 1) return;
    const timer = setInterval(() => setImgIdx(prev => (prev + 1) % award.images.length), 2500);
    return () => clearInterval(timer);
  }, [award.images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        minWidth: '280px', maxWidth: '310px', height: '370px',
        borderRadius: '16px', overflow: 'hidden', position: 'relative',
        flexShrink: 0, cursor: 'pointer',
        boxShadow: isHovered ? '0 16px 36px rgba(40,40,110,0.12)' : '0 4px 12px rgba(40,40,110,0.06)',
        border: `1.5px solid ${isHovered ? ORANGE + '50' : '#e2e8f0'}`,
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ position: 'relative', height: '50%', overflow: 'hidden', background: '#1e293b' }}>
        {award.images.map((img, i) => (
          <img key={i} src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: imgIdx === i ? 1 : 0, transition: 'opacity 0.6s ease' }} />
        ))}
        <span style={{ position: 'absolute', top: '10px', left: '10px', background: ORANGE, color: '#fff', fontSize: '8px', fontWeight: '800', padding: '3px 8px', borderRadius: '100px', textTransform: 'uppercase' }}>{award.category}</span>
        <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.95)', color: NAVY, fontSize: '8px', fontWeight: '800', padding: '3px 8px', borderRadius: '100px' }}>{award.year}</span>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(40,40,110,0.9), transparent)', pointerEvents: 'none' }} />
      </div>
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '5px', height: '50%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img src={award.logo} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain', background: '#fff', borderRadius: '5px', padding: '2px', border: '1px solid #e2e8f0' }} />
          <span style={{ fontSize: '10px', fontWeight: '700', color: NAVY }}>{award.company}</span>
          <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', background: `${ORANGE}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon style={{ fontSize: '10px', color: ORANGE }} /></div>
        </div>
        <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', margin: 0, lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{award.title}</h4>
        <p style={{ fontSize: '11px', color: '#64748b', margin: 0, lineHeight: '1.4', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{award.desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingTop: '5px', borderTop: '1px solid #f1f5f9', fontSize: '10px', color: '#94a3b8' }}>
          <FaMapMarkerAlt size={9} style={{ color: ORANGE }} />{award.location}
        </div>
      </div>
    </motion.div>
  );
};

const Awards = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sliderRef = useRef(null);
  const gridAwards = awards.slice(0, 6);
  const sliderAwards = awards.slice(6, 10);

  useEffect(() => {
    const timer = setInterval(() => setActiveIndex(prev => (prev + 1) % gridAwards.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ padding: '80px 24px', background: '#f4f6fa' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 30px)', fontWeight: 700, color: NAVY, margin: 0, letterSpacing: '-1px' }}>
            Awards and <span style={{ color: ORANGE }}>Certification</span>
          </h2>
        </motion.div>
        <div style={{ display: 'flex', gap: 14, height: 380, width: '100%', marginBottom: 36 }}>
          {gridAwards.map((award, index) => {
            const isActive = hoveredIndex === index || (hoveredIndex === null && activeIndex === index);
            return (
              <motion.div key={award.id} layout onClick={() => setActiveIndex(index)} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}
                style={{ position: 'relative', height: '100%', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', flex: isActive ? 8 : 1, transition: 'flex 0.6s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: isActive ? '0 20px 40px rgba(40,40,110,0.2)' : '0 4px 10px rgba(40,40,110,0.04)' }}>
                <ImageSlider images={award.images} />
                <div style={{ position: 'absolute', inset: 0, background: isActive ? 'linear-gradient(90deg, rgba(40,40,110,0.95) 0%, rgba(40,40,110,0.7) 45%, rgba(40,40,110,0.1) 100%)' : 'linear-gradient(to top, rgba(40,40,110,0.95) 0%, rgba(40,40,110,0.2) 100%)', transition: 'background 0.6s ease' }} />
                <div style={{ position: 'absolute', inset: '20px 0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', opacity: isActive ? 0 : 1, pointerEvents: 'none', transition: 'opacity 0.3s ease', padding: '0 6px' }}>
                  <span className="v-title" style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap', writingMode: 'vertical-rl', transform: 'rotate(180deg)', marginBottom: 14 }}>{award.title}</span>
                  <img src={award.logo} alt="" style={{ width: 32, height: 32, objectFit: 'contain', background: '#fff', borderRadius: 8, padding: 3 }} />
                </div>
                <div style={{ position: 'absolute', inset: 0, padding: '24px 32px', display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none', transition: 'opacity 0.4s ease 0.2s' }}>
                  <div style={{ minWidth: 340, maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={award.logo} alt="" style={{ width: 38, height: 38, objectFit: 'contain', background: '#fff', borderRadius: 8, padding: 4 }} />
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 900, color: '#fff' }}>{award.company}</p>
                        <span style={{ background: ORANGE, color: '#fff', padding: '2px 8px', borderRadius: 100, fontSize: 8, fontWeight: 800, textTransform: 'uppercase' }}>{award.category} · {award.year}</span>
                      </div>
                    </div>
                    <h3 style={{ fontSize: 19, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>{award.title}</h3>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>{award.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', padding: '5px 10px', borderRadius: 100, backdropFilter: 'blur(8px)', width: 'fit-content' }}>
                      <FaMapMarkerAlt style={{ color: ORANGE, fontSize: 10 }} />
                      <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{award.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: NAVY, margin: '0 0 12px' }}>More <span style={{ color: ORANGE }}>Achievements</span></h3>
          <div ref={sliderRef} style={{ display: 'flex', gap: '12px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
            {sliderAwards.map((award, i) => <SliderCard key={award.id} award={award} index={i} />)}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          div[style*="height: 380px"] { flex-direction: column !important; height: auto !important; }
          .v-title { writing-mode: horizontal-tb !important; transform: rotate(0deg) !important; margin-bottom: 0 !important; margin-top: 8px !important; }
        }
      `}</style>
    </section>
  );
};

export default Awards;