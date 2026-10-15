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

import { getStrapiMediaUrl } from '../../services/strapi';

const IndustryRecognition = ({ awards: strapiAwards, title, subtitle }) => {
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const activeAwards = strapiAwards && strapiAwards.length > 0 
    ? strapiAwards.map((a, i) => {
        const customImg = getStrapiMediaUrl(a.image);
        return { 
          title: a.title || awards[i % awards.length]?.title, 
          subtitle: a.subtitle || awards[i % awards.length]?.subtitle, 
          text: a.description ? a.description.substring(0, 20) : (awards[i % awards.length]?.text || 'Safety Milestone'), 
          description: a.description || awards[i % awards.length]?.description, 
          image: customImg || awards[i % awards.length]?.image || "" 
        };
      }) 
    : awards;

  return (
    <section className="ehs-awards-section">
      <div style={{ maxWidth: '1370px', margin: '0 auto', position: 'relative' }}>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="ehs-awards-header"
        >
          <h2 className="ehs-awards-title">
            {title ? title : <>Photography <span style={{ color: NAVY }}>With Client</span></>}
          </h2>
          <p className="ehs-awards-subtitle">
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
                spaceBetween: 14,
              },
              480: {
                slidesPerView: 1.35,
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
                <div className="photo-card group slider-card">
                  {/* Background Image */}
                  <div className="card-image-wrap">
                    <img 
                      src={award.image} 
                      alt={award.title}
                      loading="lazy"
                      className="card-image"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="card-overlay" />

                  {/* Ribbon Tag */}
                  <div className="ribbon-tag">
                    <FaTrophy style={{ fontSize: '10px', color: '#fff' }} />
                    <span className="ribbon-text">
                      {award.text}
                    </span>
                  </div>

                  {/* Content (Bottom) */}
                  <div className="card-content">
                    <h4 className="card-title">
                      {award.title}
                    </h4>

                    <p className="card-subtitle">
                      {award.subtitle}
                    </p>

                    {/* Description (Reveals on Hover / Visible on Mobile) */}
                    <div className="card-description">
                      <p className="card-desc-text">
                        {award.description}
                      </p>
                    </div>
                    
                    {/* Hover Accent Line */}
                    <div className="hover-line" />
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
        .ehs-awards-section {
          padding: 64px 20px 48px;
          background-color: #f8fafc;
          font-family: ${FONT};
          overflow: hidden;
        }
        .ehs-awards-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .ehs-awards-title {
          font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 800;
          color: ${NAVY};
          margin: 0 0 6px 0;
          letter-spacing: -1px;
          font-family: ${FONT};
        }
        .ehs-awards-subtitle {
          font-size: 14px;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
          font-family: ${FONT};
        }
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
          transform: translateY(-50%);
          box-shadow: 0 8px 24px rgba(10, 42, 102, 0.25);
        }
        .ehs-nav-btn.swiper-button-disabled {
          opacity: 0.35;
          cursor: not-allowed;
          pointer-events: none;
        }
        .slider-card {
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(10,42,102,0.1);
          cursor: pointer;
          overflow: hidden;
          position: relative;
          height: 350px;
          background-color: #0a2a66;
        }
        .card-image-wrap {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          overflow: hidden;
          background-color: #e2e8f0;
        }
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(10,42,102, 0.95) 0%, rgba(10,42,102, 0.5) 45%, transparent 80%);
          z-index: 2;
          transition: opacity 0.4s ease;
        }
        .ribbon-tag {
          position: absolute;
          top: 16px;
          right: 0px;
          background: ${ORANGE};
          padding: 6px 14px;
          border-radius: 4px 0 0 4px;
          box-shadow: 0 4px 12px rgba(255,135,85,0.4);
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.3s ease;
        }
        .ribbon-text {
          font-size: 9px;
          font-weight: 800;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 24px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transform: translateY(85px);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
        }
        .card-title {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 2px 0;
          line-height: 1.3;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .card-subtitle {
          font-size: 11px;
          font-weight: 700;
          color: ${GOLD};
          margin: 0;
          line-height: 1.4;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .card-description {
          margin-top: 6px;
          opacity: 0;
          transition: opacity 0.4s ease, transform 0.4s ease;
          transform: translateY(15px);
        }
        .card-desc-text {
          font-size: 12px;
          color: rgba(255,255,255,0.88);
          line-height: 1.5;
          margin: 0;
          font-weight: 400;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hover-line {
          height: 3px;
          width: 0%;
          background-color: ${ORANGE};
          margin-top: 10px;
          border-radius: 2px;
          transition: width 0.4s ease;
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
          background: ${ORANGE};
          width: 24px;
          border-radius: 4px;
        }

        @media (max-width: 1024px) {
          .ehs-nav-prev { left: 4px; }
          .ehs-nav-next { right: 4px; }
        }

        @media (max-width: 768px) {
          .ehs-awards-section {
            padding: 28px 16px 36px 16px !important;
          }
          .ehs-awards-header {
            margin-bottom: 20px !important;
          }
          .ehs-awards-title {
            font-size: clamp(20px, 5.2vw, 25px) !important;
            margin-bottom: 4px !important;
          }
          .ehs-awards-subtitle {
            font-size: 12.5px !important;
            line-height: 1.5 !important;
          }
          .ehs-slider-wrapper {
            padding: 0 !important;
          }
          .ehs-nav-btn {
            display: none !important;
          }
          .slider-card {
            height: clamp(320px, 84vw, 360px) !important;
            border-radius: 12px !important;
          }
          .card-overlay { 
            opacity: 0.9 !important; 
            background: linear-gradient(to top, rgba(10,42,102, 0.98) 0%, rgba(10,42,102, 0.75) 45%, rgba(10,42,102, 0.2) 75%, transparent 100%) !important; 
          }
          .card-content { 
            transform: translateY(0) !important;
            padding: 16px 14px 18px 14px !important;
            gap: 4px !important;
          }
          .card-title {
            font-size: 14.5px !important;
            line-height: 1.25 !important;
            margin-bottom: 2px !important;
          }
          .card-subtitle {
            font-size: 10.5px !important;
            letter-spacing: 0.4px !important;
          }
          .card-description { 
            opacity: 1 !important; 
            transform: translateY(0) !important;
            margin-top: 4px !important;
          }
          .card-desc-text {
            font-size: 11.5px !important;
            line-height: 1.4 !important;
            -webkit-line-clamp: 2 !important;
          }
          .hover-line { 
            width: 32px !important; 
            margin-top: 6px !important;
          }
          .ribbon-tag { 
            top: 12px !important;
            padding: 5px 10px !important;
            gap: 5px !important;
          }
          .ribbon-text {
            font-size: 8.5px !important;
          }
          .ehs-awards-pagination {
            margin-top: 18px !important;
          }
        }

        @media (hover: hover) {
          .photo-card:hover .card-image { transform: none !important; }
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