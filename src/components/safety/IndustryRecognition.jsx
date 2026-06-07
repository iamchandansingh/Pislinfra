import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const NAVY = '#28286e';
const ORANGE = '#ff8755';
const GOLD = '#f4b400';
const FONT = '"Helvetica Neue", Arial, sans-serif';

const awards = [
  {
    title: 'Best Safety Performance Award',
    subtitle: '5 Million Safe Man-Hours Achievement',
    text: 'Industrial Infrastructure Excellence',
    image: '/images/awards/Safety-Excellence-Awards-Adani.png',
  },
  {
    title: 'Zero Incident Safety Recognition',
    subtitle: 'Outstanding Workplace Safety Standards',
    text: 'Operational Safety Excellence',
    image: '/images/awards/Reliance-Jamnagar-HSE.png',
  },
  {
    title: 'Construction Safety Leadership Award',
    subtitle: 'Advanced Safety Compliance & Training',
    text: 'Project Safety Commitment',
    image: '/images/awards/NCR-Patli.png',
  },
  {
    title: 'Excellence in Safety Management',
    subtitle: 'Proactive Hazard Prevention Practices',
    text: 'Workplace Safety Innovation',
    image: '/images/awards/Mundra-Petrochem-Adani.png',
  },
  {
    title: 'National Safety Achievement',
    subtitle: 'Celebrated Safety Milestone',
    text: 'National Recognition',
    image: '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas.png',
  },
  {
    title: 'Safety Excellence Award',
    subtitle: 'Continuous Safety Improvement',
    text: 'Safety Leadership',
    image: '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(5).png',
  },
  {
    title: 'Green PVC Project Award',
    subtitle: 'Adani Mundra Petrochem Recognition',
    text: 'Environmental Safety',
    image: '/images/awards/adani-Mundra-Petrochem-LTd-Green-Pvc-Project.png',
  },
  {
    title: 'Project Safety Milestone',
    subtitle: 'Outstanding Project Safety Record',
    text: 'Project Excellence',
    image: '/images/awards/2.png',
  },
  {
    title: 'National Safety Award',
    subtitle: 'PRR Jhamuwas Recognition',
    text: 'Safety Achievement',
    image: '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(2).png',
  },
  {
    title: 'Adani Mundra Petrochem Award',
    subtitle: 'January 2025 Recognition',
    text: 'Industrial Safety',
    image: '/images/awards/adani-Mundra-Petrochem-limmited-Jan-25.png',
  },
];

const IndustryRecognition = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const cardsPerView = 4;
  const totalSlides = Math.ceil(awards.length / cardsPerView);

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleDotClick = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const visibleAwards = awards.slice(
    currentSlide * cardsPerView,
    currentSlide * cardsPerView + cardsPerView
  );

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <section style={{
      padding: '80px 24px',
      backgroundColor: '#f8fafc',
      fontFamily: FONT,
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: '800',
            color: NAVY,
            margin: '0 0 12px',
            letterSpacing: '-1px',
            fontFamily: FONT,
          }}>
            Photography <span style={{ color: ORANGE }}> With Client</span>
          </h2>
          <p style={{
            fontSize: '15px',
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
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: '-16px',
            top: '58%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#ffffff',
            border: `2px solid ${NAVY}15`,
            boxShadow: '0 4px 16px rgba(40,40,110,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = NAVY;
            e.currentTarget.style.borderColor = NAVY;
            e.currentTarget.querySelector('svg').style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = `${NAVY}15`;
            e.currentTarget.querySelector('svg').style.color = NAVY;
          }}
        >
          <FaChevronLeft style={{ fontSize: '16px', color: NAVY, transition: 'color 0.3s ease' }} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: '-16px',
            top: '58%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#ffffff',
            border: `2px solid ${NAVY}15`,
            boxShadow: '0 4px 16px rgba(40,40,110,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = NAVY;
            e.currentTarget.style.borderColor = NAVY;
            e.currentTarget.querySelector('svg').style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = `${NAVY}15`;
            e.currentTarget.querySelector('svg').style.color = NAVY;
          }}
        >
          <FaChevronRight style={{ fontSize: '16px', color: NAVY, transition: 'color 0.3s ease' }} />
        </button>

        {/* Awards Grid with Smooth Slide Animation */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '32px',
          minHeight: '380px',
        }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 250, damping: 25 },
                opacity: { duration: 0.2 },
              }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '18px',
                position: 'absolute',
                width: '100%',
              }}
              className="awards-grid"
            >
              {visibleAwards.map((award, index) => (
                <motion.div
                  key={`${currentSlide}-${index}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                  whileHover={{ y: -6, boxShadow: '0 16px 36px rgba(40,40,110,0.1)' }}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 16px rgba(40,40,110,0.04)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'default',
                    overflow: 'hidden',
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: '100%',
                    height: '160px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <img 
                      src={award.image} 
                      alt={award.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(4px)',
                      border: `1.5px solid ${GOLD}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <FaTrophy style={{
                        fontSize: '14px',
                        color: GOLD,
                        filter: 'drop-shadow(0 0 4px rgba(244,180,0,0.5))',
                      }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{
                    padding: '18px 16px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}>
                    <h4 style={{
                      fontSize: '13px',
                      fontWeight: '800',
                      color: NAVY,
                      margin: 0,
                      lineHeight: 1.35,
                      fontFamily: FONT,
                    }}>
                      {award.title}
                    </h4>

                    <p style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0,
                      lineHeight: 1.4,
                      fontFamily: FONT,
                    }}>
                      {award.subtitle}
                    </p>

                    <span style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      color: ORANGE,
                      background: `${ORANGE}10`,
                      padding: '3px 10px',
                      borderRadius: '100px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontFamily: FONT,
                      width: 'fit-content',
                      margin: '0 auto',
                    }}>
                      {award.text}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators (Dots) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
        }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              style={{
                width: currentSlide === i ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                background: currentSlide === i ? ORANGE : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 1000px) {
          .awards-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .awards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default IndustryRecognition;