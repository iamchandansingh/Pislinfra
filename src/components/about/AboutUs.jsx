import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

/* ─── CORPORATE BRAND COLORS ─────────────────────────────────────────────── */
const NAVY = '#28296F';

const renderAboutTitle = (title) => {
  if (!title) {
    return "About Our Expertise";
  }
  if (typeof title === 'string' && title.includes('<')) {
    return <span dangerouslySetInnerHTML={{ __html: title }} />;
  }
  return title;
};

/* ─── MAIN ABOUT US COMPONENT ────────────────────────────────────────────── */
const AboutUs = ({ data }) => {
  const navigate = useNavigate();

  // 5 Premium PISL Reference Images
  const images = [
    "/images/Overview/53.png",
    "/images/Overview/56.png",
    "/images/Overview/62.png",
    "/images/Overview/58.png",
    "/images/Overview/43.png"
  ];

  return (
    <section className="pisl-about-modern-section" style={{ 
      backgroundColor: '#FFFFFF', 
      padding: '70px 0', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <div className="pisl-container pisl-about-grid" style={{ 
        maxWidth: '1360px', 
        margin: '0 auto', 
        padding: '0 24px', 
        display: 'grid', 
        gridTemplateColumns: '45% 55%', 
        gap: '48px', 
        alignItems: 'center' 
      }}>
        
        {/* ── LEFT COLUMN: Smooth Slide Image Frame (6s interval) ── */}
        <div className="pisl-image-frame" style={{ 
          position: 'relative', 
          width: '100%', 
          height: '360px', 
          borderRadius: '20px', 
          overflow: 'hidden', 
          boxShadow: '0 16px 36px -12px rgba(40, 41, 111, 0.12)',
          background: '#f1f5f9',
          border: '1px solid #e2e8f0'
        }}>
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop={true}
            speed={900}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              el: '.pisl-about-pagination',
            }}
            style={{ width: '100%', height: '100%' }}
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx} style={{ width: '100%', height: '100%' }}>
                <img 
                  src={img} 
                  alt="Pislinfrastructure Excellence" 
                  loading={idx === 0 ? "eager" : "lazy"}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    objectPosition: 'center',
                    display: 'block' 
                  }} 
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Subtle slide indicator dots */}
          <div className="pisl-about-pagination" />
        </div>

        {/* ── RIGHT COLUMN: Clean Typography Block (No borders) ── */}
        <motion.div 
          onClick={() => navigate('/about')}
          initial={{ opacity: 0, y: 15 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          whileHover={{ x: 4 }}
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="pisl-clickable-block"
          style={{
            display: 'block',
            textDecoration: 'none', 
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            border: 'none',
            background: 'transparent',
            boxShadow: 'none'
          }}
        >
          {/* Main Title */}
          <h2 className="pisl-title" style={{ 
            fontSize: 'clamp(28px, 3.2vw, 36px)', 
            fontWeight: 800, 
            color: NAVY, 
            lineHeight: '1.2', 
            letterSpacing: '-0.8px', 
            margin: '0 0 16px 0',
            transition: 'opacity 0.3s ease'
          }}>
            {renderAboutTitle(data?.aboutTitle)}
          </h2>

          {/* Content Paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p className="pisl-desc-p" style={{ fontSize: '15px', color: '#475569', lineHeight: '1.75', margin: 0, fontWeight: 500 }}>
              {data?.aboutDesc ? data.aboutDesc.split('\n')[0] : "We at Pislinfra are recognised as India's leading construction company, providing services to well-reputed clientele in various sectors. We are committed to excellence, specializing in the full-cycle development of high-quality industrial and warehousing assets."}
            </p>
            <p className="pisl-desc-p" style={{ fontSize: '15px', color: '#475569', lineHeight: '1.75', margin: 0, fontWeight: 500 }}>
              {data?.aboutDesc && data.aboutDesc.includes('\n') ? data.aboutDesc.split('\n')[1] : "A client-first approach anchors our mission. As we expand our footprint nationwide, we proactively address the evolving business requirements of our clients, ensuring optimum operational efficiency."}
            </p>
          </div>

          {/* Explore Pislinfra Button in Blue */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/about');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 24px',
                backgroundColor: NAVY,
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.3px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(40, 41, 111, 0.22)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e1f58';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(40, 41, 111, 0.32)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = NAVY;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(40, 41, 111, 0.22)';
              }}
            >
              <span>Explore Pislinfra</span>
              <span style={{ fontSize: '16px', transition: 'transform 0.2s ease' }}>→</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Global Style overrides for micro-interactions & responsiveness */}
      <style>{`
        .pisl-clickable-block:hover .pisl-title {
          opacity: 0.88;
        }
        
        .pisl-image-frame .swiper {
          width: 100% !important;
          height: 100% !important;
        }
        .pisl-image-frame .swiper-wrapper {
          height: 100% !important;
        }
        .pisl-image-frame .swiper-slide {
          width: 100% !important;
          height: 100% !important;
        }
        .pisl-about-pagination {
          position: absolute !important;
          bottom: 12px !important;
          left: 0 !important;
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 6px !important;
          z-index: 10 !important;
          pointer-events: auto !important;
        }
        .pisl-about-pagination .swiper-pagination-bullet {
          width: 6px !important;
          height: 6px !important;
          border-radius: 3px !important;
          background: rgba(255, 255, 255, 0.75) !important;
          opacity: 1 !important;
          margin: 0 !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
        }
        .pisl-about-pagination .swiper-pagination-bullet-active {
          width: 18px !important;
          background: #28296F !important;
        }
        
        @media (max-width: 992px) {
          .pisl-about-modern-section {
            padding: 48px 0 !important;
          }
          .pisl-about-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
            padding: 0 20px !important;
          }
          .pisl-image-frame {
            height: 280px !important;
            border-radius: 16px !important;
          }
          .pisl-title {
            font-size: clamp(24px, 4vw, 30px) !important;
            margin-bottom: 12px !important;
          }
        }

        @media (max-width: 640px) {
          .pisl-about-modern-section {
            padding: 34px 0 !important;
          }
          .pisl-about-grid {
            gap: 20px !important;
            padding: 0 16px !important;
          }
          .pisl-image-frame {
            height: clamp(190px, 52vw, 230px) !important;
            border-radius: 14px !important;
          }
          .pisl-title {
            font-size: clamp(22px, 6vw, 26px) !important;
            letter-spacing: -0.5px !important;
            margin-bottom: 10px !important;
          }
          .pisl-desc-p {
            font-size: 13.5px !important;
            line-height: 1.65 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutUs;