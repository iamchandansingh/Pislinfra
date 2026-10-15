import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';
const FONT = 'Inter, sans-serif';

const SafetyApproach = ({ approaches, title, subtitle }) => {
  const [currentImg, setCurrentImg] = useState(0);
  
  const images = [
    "/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(5).png",
    "/images/awards/1.png",
    "/images/awards/2.png"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  const timelineData = [
    {
      year: "2018", position: "top",
      points: [
        "Corporate rollout of Safety 360° program",
        "5-worker lunches program fosters conversations",
        "Partner with ClarkDietrich"
      ]
    },
    {
      year: "2019", position: "bottom",
      points: [
        "Added Safety Moments to all meetings",
        "After Action Reviews added",
        "Introduced crisis management"
      ]
    },
    {
      year: "2020", position: "top",
      points: [
        "STOBG Safety Council first meeting",
        "COVID-19 protocol best practices",
        "Corporate Pandemic Plan"
      ]
    },
    {
      year: "2021", position: "bottom",
      points: [
        "Directors evaluate safety technology",
        "Independent assessment of Safety Program"
      ]
    },
    {
      year: "2022", position: "top",
      points: [
        "Superintendent Roundtable created",
        "Good Catch/Close Call initiative"
      ]
    },
    {
      year: "2023", position: "bottom",
      points: [
        "Safety 360° training added to orientations",
        "Launch of Safety 360° Awards",
        "Safety subcommittees formed"
      ]
    },
    {
      year: "2024", position: "top",
      points: [
        "Safety helmets replace hard hats",
        "Company-wide A4 glove policy",
        "Partnership with Otto Tech Systems"
      ]
    }
  ];

  const activeTimeline = approaches && approaches.length > 0 
    ? approaches.map(a => ({ year: a.year, position: a.position, points: a.points || [] })) 
    : timelineData;

  return (
    <div className="safety-approach-section">
      <style>{`
        .safety-approach-section {
          font-family: ${FONT};
          padding: 80px 28px;
          max-width: 1370px;
          margin: 0 auto;
          background-color: #ffffff;
        }

        .approach-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .approach-right-col {
          padding-left: 20px;
        }

        .approach-title {
          font-size: clamp(26px, 3.8vw, 36px);
          font-weight: 900;
          color: ${NAVY};
          margin-bottom: 14px;
          letter-spacing: -0.8px;
          line-height: 1.15;
        }

        .approach-subtitle {
          color: #64748b;
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 28px;
        }

        .approach-slider-box {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(10, 42, 102, 0.15);
          position: relative;
          height: 320px;
          background: #0a2a66;
        }

        /* Desktop timeline */
        .timeline-container {
          position: relative;
          padding: 260px 0;
          min-height: 520px;
        }

        /* Mobile Vertical Timeline */
        .mobile-timeline-container {
          display: none;
          position: relative;
          margin-top: 28px;
          padding-left: 20px;
        }

        .mobile-timeline-track {
          position: absolute;
          left: 7px;
          top: 14px;
          bottom: 24px;
          width: 2.5px;
          background: linear-gradient(180deg, ${NAVY} 0%, #16a34a 50%, ${ORANGE} 100%);
          border-radius: 2px;
        }

        .mobile-timeline-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-timeline-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          padding-left: 18px;
        }

        .mobile-timeline-node {
          position: absolute;
          left: -20px;
          top: 14px;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          border: 3px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          z-index: 3;
        }

        .mobile-timeline-node-inner {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .mobile-timeline-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #EEF2F7;
          border-left-width: 4px;
          border-radius: 12px;
          padding: 14px 16px;
          box-shadow: 0 3px 12px rgba(10, 42, 102, 0.04);
          box-sizing: border-box;
        }

        .mobile-timeline-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px dashed #F1F5F9;
        }

        .mobile-timeline-year {
          font-size: 17px;
          font-weight: 900;
          letter-spacing: -0.4px;
        }

        .mobile-timeline-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .mobile-timeline-points {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .mobile-timeline-point {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .mobile-timeline-point-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .mobile-timeline-point-text {
          font-size: 12.5px;
          line-height: 1.5;
          color: #475569;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .safety-approach-section {
            padding: 36px 16px 44px 16px !important;
          }
          .approach-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .timeline-container {
            display: none !important;
          }
          .approach-right-col {
            padding-left: 0 !important;
            width: 100% !important;
          }
          .approach-title {
            font-size: clamp(22px, 5.5vw, 28px) !important;
            margin-bottom: 10px !important;
          }
          .approach-subtitle {
            font-size: 13px !important;
            line-height: 1.6 !important;
            margin-bottom: 20px !important;
          }
          .approach-slider-box {
            height: clamp(190px, 52vw, 240px) !important;
            border-radius: 14px !important;
            box-shadow: 0 12px 30px rgba(10, 42, 102, 0.12) !important;
          }
          .mobile-timeline-container {
            display: block !important;
          }
        }

        @media (max-width: 360px) {
          .safety-approach-section {
            padding: 32px 12px 40px 12px !important;
          }
          .mobile-timeline-container {
            padding-left: 16px !important;
          }
          .mobile-timeline-card {
            padding: 12px 12px !important;
          }
          .mobile-timeline-year {
            font-size: 15.5px !important;
          }
          .mobile-timeline-point-text {
            font-size: 12px !important;
          }
        }
      `}</style>
      
      <div className="approach-grid">
        
        {/* LEFT: DESKTOP TIMELINE */}
        <div className="timeline-container">
          
          {/* Main Horizontal Gradient Line */}
          <div style={{ 
            position: 'absolute', 
            left: 0, right: 0, 
            top: '50%', 
            height: '4px', 
            background: `linear-gradient(90deg, rgba(10,42,102,0.1) 0%, ${NAVY} 50%, ${ORANGE} 100%)`, 
            transform: 'translateY(-50%)', 
            zIndex: 1,
            borderRadius: '4px',
          }} />

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            zIndex: 2 
          }}>
            {activeTimeline.map((item, index) => {
              const isTop = item.position === 'top';
              const isEven = index % 2 === 0;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: isTop ? -20 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  key={index} 
                  style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    width: '13%', position: 'relative' 
                  }}
                >
                  
                  {/* Dot on the Timeline */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: isEven ? NAVY : ORANGE,
                    border: '3px solid #fff',
                    boxShadow: `0 0 10px ${isEven ? 'rgba(10,42,102,0.4)' : 'rgba(255,135,85,0.6)'}`,
                    zIndex: 4,
                    transition: 'transform 0.3s ease'
                  }} className="timeline-dot" />

                  {/* Connecting Line (Vertical) */}
                  <div style={{
                    position: 'absolute',
                    top: isTop ? 'auto' : '50%',
                    bottom: isTop ? '50%' : 'auto',
                    width: '2px', 
                    height: '32px',
                    background: `linear-gradient(to ${isTop ? 'top' : 'bottom'}, ${isEven ? NAVY : ORANGE}, rgba(255,255,255,0))`, 
                    opacity: 0.6,
                    zIndex: 2
                  }} />

                  {/* Content Card */}
                  <div style={{
                    position: 'absolute',
                    [isTop ? 'bottom' : 'top']: 'calc(50% + 30px)',
                    width: '140px',
                    background: isEven 
                      ? `linear-gradient(145deg, ${NAVY}, #11367a)` 
                      : '#ffffff',
                    color: isEven ? '#fff' : '#334155',
                    padding: '16px 14px', 
                    borderRadius: '12px',
                    boxShadow: isEven 
                      ? '0 10px 30px rgba(10,42,102,0.15)' 
                      : '0 10px 30px rgba(0,0,0,0.06)',
                    fontSize: '11.5px', 
                    lineHeight: '1.5',
                    border: isEven ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f1f5f9',
                    borderTop: isEven ? `2px solid ${ORANGE}` : `2px solid ${NAVY}`,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
                    cursor: 'default',
                    zIndex: 3
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = isEven 
                        ? '0 20px 40px rgba(10,42,102,0.25)' 
                        : '0 20px 40px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = isEven 
                        ? '0 10px 30px rgba(10,42,102,0.15)' 
                        : '0 10px 30px rgba(0,0,0,0.06)';
                    }}
                  >
                    <div style={{ 
                      fontSize: '18px', fontWeight: '900', marginBottom: '10px', 
                      display: 'inline-block', letterSpacing: '-0.5px', 
                      color: isEven ? '#fff' : NAVY
                    }}>
                      {item.year}
                      <div style={{ 
                        height: '2px', width: '20px', 
                        backgroundColor: isEven ? ORANGE : NAVY, 
                        marginTop: '4px', borderRadius: '2px' 
                      }}/>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {item.points.map((pt, pIdx) => (
                        <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <span style={{ 
                            width: '4px', height: '4px', borderRadius: '50%', 
                            backgroundColor: isEven ? ORANGE : NAVY,
                            marginTop: '5.5px', flexShrink: 0
                          }} />
                          <span style={{ 
                            margin: 0, 
                            color: isEven ? 'rgba(255,255,255,0.9)' : '#475569',
                            fontWeight: isEven ? '400' : '500'
                          }}>
                            {pt}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: TEXT & SLIDER */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="approach-right-col"
        >
          <h2 className="approach-title">
            {title || "Safety 360° Journey"}
          </h2>
          <p className="approach-subtitle">
            {subtitle || "Since introducing Safety 360° in 2018, we've continued to raise the bar by launching new proactive initiatives, promoting deep collaboration, and fostering a culture of shared responsibility across all project sites."}
          </p>
          
          <div className="approach-slider-box">
            {images.map((img, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                opacity: currentImg === i ? 1 : 0,
                transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: currentImg === i ? 2 : 1
              }}>
                <img 
                  src={img} 
                  alt={`Safety ${i + 1}`} 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'cover',
                  }} 
                />
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(to top, rgba(10,42,102,0.6) 0%, transparent 40%)'
                }}/>
              </div>
            ))}
            
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: 5
            }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  aria-label={`Slide ${i + 1}`}
                  style={{
                    width: currentImg === i ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: currentImg === i ? ORANGE : 'rgba(255,255,255,0.4)',
                    boxShadow: currentImg === i ? '0 2px 8px rgba(255,135,85,0.6)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: 0
                  }}
                />
              ))}
            </div>
          </div>

          {/* MOBILE VERTICAL TIMELINE */}
          <div className="mobile-timeline-container">
            <div className="mobile-timeline-track" />
            
            <div className="mobile-timeline-list">
              {activeTimeline.map((item, index) => {
                const isEven = index % 2 === 0;
                const accentColor = isEven ? NAVY : ORANGE;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
                    className="mobile-timeline-item"
                  >
                    {/* Node on vertical track */}
                    <div 
                      className="mobile-timeline-node"
                      style={{ 
                        borderColor: accentColor,
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <div 
                        className="mobile-timeline-node-inner"
                        style={{ backgroundColor: accentColor }}
                      />
                    </div>

                    {/* Timeline card */}
                    <div 
                      className="mobile-timeline-card"
                      style={{
                        borderLeftColor: accentColor
                      }}
                    >
                      <div className="mobile-timeline-card-header">
                        <span 
                          className="mobile-timeline-year"
                          style={{ color: accentColor }}
                        >
                          {item.year}
                        </span>
                        <span 
                          className="mobile-timeline-badge"
                          style={{
                            backgroundColor: isEven ? 'rgba(10,42,102,0.08)' : 'rgba(255,135,85,0.12)',
                            color: accentColor
                          }}
                        >
                          Milestone 0{index + 1}
                        </span>
                      </div>

                      <div className="mobile-timeline-points">
                        {item.points.map((pt, pIdx) => (
                          <div key={pIdx} className="mobile-timeline-point">
                            <span 
                              className="mobile-timeline-point-dot"
                              style={{ backgroundColor: accentColor }}
                            />
                            <span className="mobile-timeline-point-text">
                              {pt}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </motion.div>

      </div>
    </div>
  );
};

export default SafetyApproach;