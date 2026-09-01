import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  const activeAwards = strapiAwards && strapiAwards.length > 0 
    ? strapiAwards.map((a, i) => ({ 
        title: a.title, 
        subtitle: a.subtitle, 
        text: a.description ? a.description.substring(0, 20) : awards[i]?.text, 
        description: a.description, 
        image: getAwardUrl(a.image) || awards[i]?.image || "" 
      })) 
    : awards;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [isHovered, setIsHovered] = useState(false);
  const totalPosts = activeAwards.length;

  // Responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) setCardsPerView(1);
      else if (window.innerWidth <= 1024) setCardsPerView(2);
      else setCardsPerView(4);
    };
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalPosts);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalPosts) % totalPosts);
  };

  // Auto-slide effect with pause-on-hover and 3s resume delay
  useEffect(() => {
    let timeoutId;
    let intervalId;

    if (!isHovered) {
      // Wait 3s after hover ends (or on mount) before sliding
      timeoutId = setTimeout(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % totalPosts);

        // Then continue sliding every 2 seconds
        intervalId = setInterval(() => {
          setDirection(1);
          setCurrentIndex((prev) => (prev + 1) % totalPosts);
        }, 2000);
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isHovered, totalPosts]);

  // Generate visible awards dynamically based on index and screen size
  const visibleAwards = Array.from({ length: cardsPerView }).map((_, i) => {
    return awards[(currentIndex + i) % totalPosts];
  });

  return (
    <section style={{
      padding: '80px 24px 60px',
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
            Photography <span style={{ color: NAVY }}> With Client</span>
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
            fontFamily: FONT,
          }}>
            Our commitment to safety, quality, and operational excellence continues to earn recognition across infrastructure and industrial projects.
          </p>
        </motion.div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="nav-arrow left-arrow"
          style={{
            position: 'absolute',
            left: '-20px',
            top: '55%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#ffffff',
            border: `none`,
            boxShadow: '0 8px 24px rgba(10,42,102,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = NAVY;
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            e.currentTarget.querySelector('svg').style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            e.currentTarget.querySelector('svg').style.color = NAVY;
          }}
        >
          <FaChevronLeft style={{ fontSize: '16px', color: NAVY, transition: 'color 0.3s ease' }} />
        </button>

        <button
          onClick={handleNext}
          className="nav-arrow right-arrow"
          style={{
            position: 'absolute',
            right: '-20px',
            top: '55%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#ffffff',
            border: `none`,
            boxShadow: '0 8px 24px rgba(10,42,102,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = NAVY;
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            e.currentTarget.querySelector('svg').style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            e.currentTarget.querySelector('svg').style.color = NAVY;
          }}
        >
          <FaChevronRight style={{ fontSize: '16px', color: NAVY, transition: 'color 0.3s ease' }} />
        </button>

        {/* Awards Slider Container */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'relative',
            padding: '0px', // Absolutely 0 padding
            height: '350px', // Exact height of the cards, no extra space
            overflow: 'hidden', // Contains sliding items
          }}
        >
          <div style={{
            display: 'flex',
            gap: '24px',
            width: '100%',
          }}>
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              {visibleAwards.map((award) => (
                <motion.div
                  layout // This is the magic for sliding items!
                  key={award.title} // Must be unique for AnimatePresence tracking
                  custom={direction}
                  initial={(d) => ({ opacity: 0, x: d > 0 ? 50 : -50, scale: 0.98 })}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={(d) => ({ opacity: 0, x: d > 0 ? -50 : 50, scale: 0.98 })}
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.7 }}
                  style={{
                    borderRadius: '8px', 
                    boxShadow: '0 10px 30px rgba(10,42,102,0.1)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '350px',
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

                  {/* Sleek Industrial Ribbon Tag */}
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

                    {/* New Description (Visible on Hover) */}
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
                        color: 'rgba(255,255,255,0.85)',
                        lineHeight: 1.5,
                        margin: 0,
                        fontWeight: '400'
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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

      <style>{`
        /* Dynamic Flex Widths for Responsiveness */
        .slider-card {
          flex: 0 0 calc(25% - 18px); /* 4 items: 3 gaps of 24px = 72px / 4 = 18px */
        }
        
        @media (max-width: 1024px) {
          .slider-card { 
            flex: 0 0 calc(50% - 12px); /* 2 items: 1 gap of 24px = 24px / 2 = 12px */
          }
          .nav-arrow { 
            display: flex !important; 
            width: 36px !important; 
            height: 36px !important; 
            opacity: 0.9;
          }
          .left-arrow { left: 8px !important; }
          .right-arrow { right: 8px !important; }
        }
        
        @media (max-width: 640px) {
          .slider-card { 
            flex: 0 0 100%; /* 1 item: no gaps */
          }
          /* On mobile, there is no true hover, so show the description and overlay by default */
          .card-overlay { opacity: 0.9 !important; background: linear-gradient(to top, rgba(10,42,102, 1) 0%, rgba(10,42,102, 0.7) 60%, transparent 100%) !important; }
          .card-content { transform: translateY(0) !important; }
          .hover-line { width: 40px !important; }
          .card-description { opacity: 1 !important; transform: translateY(0) !important; }
          .ribbon-tag { transform: translateX(-4px) !important; }
        }
        
        /* Desktop Hover Effects */
        @media (hover: hover) {
          .photo-card:hover .card-image { transform: scale(1.08) !important; }
          .photo-card:hover .card-overlay { opacity: 0.9 !important; background: linear-gradient(to top, rgba(10,42,102, 1) 0%, rgba(10,42,102, 0.7) 60%, transparent 100%) !important; }
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