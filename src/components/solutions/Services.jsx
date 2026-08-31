import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../utils/imageUrl';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';

const servicesData = [
  {
    id: 'design',
    title: 'DESIGN',
    desc: 'Our team of dedicated architects and designers collaboratively envision and execute projects that redefine skylines and set new standards in architectural excellence. From conceptualisation to realisation, our vertical design approach ensures every project stands as a testament to our commitment to shaping environments that not only stand tall but also enrich lives.',
    img: '/images/Overview/3.png',
    link: '/solutions'
  },
  {
    id: 'construction',
    title: 'CONSTRUCTION',
    desc: 'We specialise in the vertical of construction that builds the backbone of industries. Our expertise lies in creating robust and efficient spaces that cater to the unique needs of warehousing and industrial operations. From large-scale warehouses to specialised industrial facilities, we are committed to constructing vertical spaces that facilitate streamlined operations.',
    img: '/images/Overview/vpw.png',
    link: '/solutions'
  }
];

const SquareServiceCard = ({ data, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(data.link)}
      style={{
        background: '#FFFFFF',
        borderRadius: '2px',
        overflow: 'hidden',
        boxShadow: '0 16px 32px rgba(0,0,0,0.25)',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: 'Inter, sans-serif',
        cursor: 'pointer',
      }}
    >
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={data.img}
          alt={data.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, ${NAVY}cc 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '12px', left: '16px',
          background: ORANGE, color: '#FFFFFF',
          padding: '5px 14px', borderRadius: '2px',
          fontSize: '12px', fontWeight: 800,
          letterSpacing: '1px',
        }}>
          {data.title}
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <p style={{
          fontSize: '13px', color: '#475569', lineHeight: 1.6,
          margin: 0,
        }}>
          {data.desc}
        </p>
      </div>
    </motion.div>
  );
};

const Services = ({ data }) => {
  const servicesDataMapped = [
    {
      id: 'design',
      title: 'DESIGN',
      desc: data?.items?.[0]?.desc || 'Our team of dedicated architects and designers collaboratively envision and execute projects that redefine skylines and set new standards in architectural excellence. From conceptualisation to realisation, our vertical design approach ensures every project stands as a testament to our commitment to shaping environments that not only stand tall but also enrich lives.',
      img: getImageUrl(data?.items?.[0]?.img) || '/images/Overview/3.png',
      link: '/solutions'
    },
    {
      id: 'construction',
      title: 'CONSTRUCTION',
      desc: data?.items?.[1]?.desc || 'We specialise in the vertical of construction that builds the backbone of industries. Our expertise lies in creating robust and efficient spaces that cater to the unique needs of warehousing and industrial operations. From large-scale warehouses to specialised industrial facilities, we are committed to constructing vertical spaces that facilitate streamlined operations.',
      img: getImageUrl(data?.items?.[1]?.img) || '/images/Overview/vpw.png',
      link: '/solutions'
    }
  ];

  return (
    <section style={{
      padding: '40px 20px',
      background: NAVY,
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: '1370px', margin: '0 auto' }}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <h2 style={{
            fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800,
            color: '#FFFFFF', margin: 0, letterSpacing: '-1px', lineHeight: 1.2,
          }}>
            Our Strategic <span style={{ color: ORANGE }}>Capabilities.</span>
          </h2>
        </motion.div>

        <div className="services-cards" style={{
          display: 'flex', justifyContent: 'center',
          flexWrap: 'wrap', gap: '24px',
        }}>
          {servicesDataMapped.map((data, index) => (
            <SquareServiceCard key={data.id} data={data} index={index} />
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .services-cards { gap: 16px !important; }
        }
      `}</style>
    </section>
  );
};

export default Services;