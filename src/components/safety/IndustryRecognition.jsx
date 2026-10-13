import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';
const GOLD = '#f4b400';
const FONT = 'Inter, sans-serif';

const awards = [
  {
    title: 'Best Safety Performance Award',
    subtitle: '5 Million Safe Man-Hours Achievement',
    text: 'Industrial Excellence',
    description: 'Recognized for achieving 5 million safe man-hours without a single lost-time injury across complex infrastructure sites.',
    image: '/images/awards/Safety-Excellence-Awards-Adani.png',
  },
  {
    title: 'Zero Incident Safety Recognition',
    subtitle: 'Outstanding Workplace Standards',
    text: 'Operational Safety',
    description: 'Awarded for maintaining a flawless zero-incident record while executing high-risk industrial operations and structural installations.',
    image: '/images/awards/Reliance-Jamnagar-HSE.png',
  },
  {
    title: 'Construction Safety Leadership',
    subtitle: 'Advanced Compliance & Training',
    text: 'Safety Commitment',
    description: 'Honored for pioneering advanced safety compliance, deploying cutting-edge training, and leading continuous safety improvement on site.',
    image: '/images/awards/NCR-Patli.png',
  },
  {
    title: 'Excellence in Safety Management',
    subtitle: 'Proactive Hazard Prevention',
    text: 'Workplace Innovation',
    description: 'Demonstrated exceptional safety management by proactively identifying hazards and implementing highly effective preventive control measures.',
    image: '/images/awards/Mundra-Petrochem-Adani.png',
  },
  {
    title: 'National Safety Achievement',
    subtitle: 'Celebrated Safety Milestone',
    text: 'National Recognition',
    description: 'Received national acclaim for surpassing critical safety milestones and setting new benchmarks in the industrial construction sector.',
    image: '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas.png',
  },
  {
    title: 'Safety Excellence Award',
    subtitle: 'Continuous Safety Improvement',
    text: 'Safety Leadership',
    description: 'Acknowledged for outstanding safety leadership, consistent continuous improvement, and an uncompromising commitment to employee well-being.',
    image: '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(5).png',
  },
  {
    title: 'Green PVC Project Award',
    subtitle: 'Adani Mundra Recognition',
    text: 'Environmental Safety',
    description: 'Awarded for strictly adhering to environmental safety regulations and maintaining zero ecological impact during project execution.',
    image: '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project.png',
  },
  {
    title: 'Project Safety Milestone',
    subtitle: 'Outstanding Safety Record',
    text: 'Project Excellence',
    description: 'Recognized for completing major project phases ahead of schedule while strictly maintaining an outstanding overall project safety record.',
    image: '/images/awards/2.png',
  },
  {
    title: 'National Safety Award',
    subtitle: 'PRR Jhamuwas Recognition',
    text: 'Safety Achievement',
    description: 'Secured honors for demonstrating unparalleled safety achievements and maintaining rigorous health and safety protocols nationwide.',
    image: '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(2).png',
  },
  {
    title: 'Adani Mundra Petrochem Award',
    subtitle: 'January 2025 Recognition',
    text: 'Industrial Safety',
    description: 'Officially commended in January 2025 for exceptional industrial safety practices and uncompromising standards at the Mundra facility.',
    image: '/images/awards/adani-Mundra-Petrochem-limmited-Jan-25.png',
  },
];

const getAwardUrl = (img) => {
  if (!img) return "";
  const url = typeof img === 'string' ? img : (img.url || img.data?.attributes?.url);
  if (!url) return "";
  return url.startsWith('http') ? url : `${import.meta.env.VITE_STRAPI_URL || ""}${url}`;
};

const IndustryRecognition = ({ awards: strapiAwards, title, subtitle }) => {
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const activeAwards = strapiAwards && strapiAwards.length > 0 
    ? strapiAwards.map((a, i) => ({ 
        title: a.title || awards[i % awards.length]?.title, 
        subtitle: a.subtitle || awards[i % awards.length]?.subtitle, 
        text: a.description ? a.description.substring(0, 20) : (awards[i % awards.length]?.text || 'Safety Milestone'), 
        description: a.description || awards[i % awards.length]?.description, 
        image: getAwardUrl(a.image) || awards[i % awards.length]?.image || "" 
      })) 
    : awards;

  return (
    <section style={{
      padding: '80px 20px 60px',
      backgroundColor: '#f8fafc',
      fontFamily: FONT,
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: '1370px', margin: '0 auto', position: 'relative' }}>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            fontWeight: '800',
            color: NAVY,
            margin: '0 0 6px',
            letterSpacing: '-1px',
            fontFamily: FONT,
          }}>
            {title ? title : <>Photography <span style={{ color: NAVY }}>With Client</span></>}
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
            fontFamily: FONT,
          }}>
            {subtitle || "Our commitment to safety, quality, and operational excellence continues to earn recognition across infrastructure and industrial projects."}
          </p>
        </motion.div>

        {/* Awards Slider Container */}
        <div className="ehs-slider-wrapper">
          {/* Navigation Arrows */}
          <button
            ref={prevRef}
            className="ehs-nav-btn ehs-nav-prev"
            aria-label="Previous slide"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <FaChevronLeft style={{ fontSize: '15px' }} />
          </button>

          <button
            ref={nextRef}
            className="ehs-nav-btn ehs-nav-next"
            aria-label="Next slide"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <FaChevronRight style={{ fontSize: '15px' }} />
          </button>

          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            pagination={{
              clickable: true,
              el: '.ehs-awards-pagination',
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={activeAwards.length > 4}
            speed={600}
            spaceBetween={24}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            style={{
              paddingTop: '6px',
              paddingBottom: '8px',
            }}
          >
            {activeAwards.map((award, index) => (
              <SwiperSlide key={`${award.title}-${index}`} style={{ height: 'auto' }}>
                <div
                  style={{
                    borderRadius: '8px', 
                    boxShadow: '0 10px 30px rgba(10,42,102,0.1)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '350px',
                    backgroundColor: '#0a2a66',
                  }}
                  className="photo-card group slider-card"
                >
                  {/* Background Image */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    overflow: 'hidden',
                    backgroundColor: '#e2e8f0'
                  }}>
                    <img 
                      src={award.image} 
                      alt={award.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      className="card-image"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(10,42,102, 0.95) 0%, rgba(10,42,102, 0.5) 45%, transparent 80%)',
                    zIndex: 2,
                    transition: 'opacity 0.4s ease',
                  }}
                  className="card-overlay" />

                  {/* Ribbon Tag */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '0px',
                    background: ORANGE,
                    padding: '6px 14px',
                    borderRadius: '4px 0 0 4px',
                    boxShadow: '0 4px 12px rgba(255,135,85,0.4)',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'transform 0.3s ease'
                  }}
                  className="ribbon-tag"
                  >
                    <FaTrophy style={{ fontSize: '10px', color: '#fff' }} />
                    <span style={{ fontSize: '9px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {award.text}
                    </span>
                  </div>

                  {/* Content (Bottom) */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    padding: '24px',
                    zIndex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transform: 'translateY(85px)',
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  className="card-content">
                    <h4 style={{
                      fontSize: '15px',
                      fontWeight: '800',
                      color: '#ffffff',
                      margin: '0 0 2px',
                      lineHeight: 1.3,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      {award.title}
                    </h4>

                    <p style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: GOLD,
                      margin: 0,
                      lineHeight: 1.4,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {award.subtitle}
                    </p>

                    {/* Description (Reveals on Hover / Visible on Mobile) */}
                    <div style={{
                      marginTop: '6px',
                      opacity: 0,
                      transition: 'opacity 0.4s ease, transform 0.4s ease',
                      transform: 'translateY(15px)',
                    }}
                    className="card-description"
                    >
                      <p style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.88)',
                        lineHeight: 1.5,
                        margin: 0,
                        fontWeight: '400',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {award.description}
                      </p>
                    </div>
                    
                    {/* Hover Accent Line */}
                    <div 
                      className="hover-line"
                      style={{
                        height: '3px',
                        width: '0%',
                        backgroundColor: ORANGE,
                        marginTop: '10px',
                        borderRadius: '2px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination Bullets */}
          <div className="ehs-awards-pagination" />
        </div>

      </div>

      <style>{`
        .ehs-slider-wrapper {
          position: relative;
          padding: 0 10px;
        }

        .ehs-nav-btn {
          position: absolute;
          top: calc(50% - 20px);
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(10, 42, 102, 0.08);
          box-shadow: 0 6px 20px rgba(10, 42, 102, 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          color: #0a2a66;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(-50%);
        }

        .ehs-nav-prev {
          left: -20px;
        }

        .ehs-nav-next {
          right: -20px;
        }

        .ehs-nav-btn:hover {
          background: #0a2a66;
          color: #ffffff;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 8px 24px rgba(10, 42, 102, 0.25);
        }

        .ehs-nav-btn.swiper-button-disabled {
          opacity: 0.35;
          cursor: not-allowed;
          pointer-events: none;
        }

        .ehs-awards-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 24px;
          gap: 6px;
        }

        .ehs-awards-pagination .swiper-pagination-bullet {
          background: #cbd5e1;
          width: 8px;
          height: 8px;
          opacity: 1;
          border-radius: 999px;
          transition: all 0.3s ease;
          cursor: pointer;
          margin: 0 !important;
        }

        .ehs-awards-pagination .swiper-pagination-bullet-active {
          background: #ff8755;
          width: 24px;
          border-radius: 4px;
        }

        @media (max-width: 1024px) {
          .ehs-nav-prev { left: 4px; }
          .ehs-nav-next { right: 4px; }
        }

        @media (max-width: 768px) {
          .ehs-slider-wrapper {
            padding: 0;
          }
          .ehs-nav-btn {
            display: none !important;
          }
          .card-overlay { 
            opacity: 0.92 !important; 
            background: linear-gradient(to top, rgba(10,42,102, 1) 0%, rgba(10,42,102, 0.65) 60%, transparent 100%) !important; 
          }
          .card-content { 
            transform: translateY(0) !important; 
          }
          .hover-line { 
            width: 40px !important; 
          }
          .card-description { 
            opacity: 1 !important; 
            transform: translateY(0) !important; 
          }
          .ribbon-tag { 
            transform: translateX(-4px) !important; 
          }
        }

        @media (hover: hover) {
          .photo-card:hover .card-image { transform: scale(1.08) !important; }
          .photo-card:hover .card-overlay { 
            opacity: 0.92 !important; 
            background: linear-gradient(to top, rgba(10,42,102, 1) 0%, rgba(10,42,102, 0.7) 60%, transparent 100%) !important; 
          }
          .photo-card:hover .card-content { transform: translateY(0) !important; }
          .photo-card:hover .hover-line { width: 40px !important; }
          .photo-card:hover .card-description { opacity: 1 !important; transform: translateY(0) !important; }
          .photo-card:hover .ribbon-tag { transform: translateX(-4px) !important; }
        }
      `}</style>
    </section>
  );
};

export default IndustryRecognition;