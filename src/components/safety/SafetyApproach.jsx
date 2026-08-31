import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';
const FONT = 'Inter, sans-serif';

const SafetyApproach = ({ approaches, title, subtitle }) => {
  const activeTimeline = approaches && approaches.length > 0 ? approaches.map(a => ({ year: a.year, position: a.position, points: a.points || [] })) : timelineData;
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
  }, []);

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

  return (
    <div style={{ 
      fontFamily: FONT, 
      padding: '80px 28px', 
      maxWidth: '1370px', 
      margin: '0 auto', 
      backgroundColor: '#ffffff' 
    }}>
      
      <div className="approach-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.8fr 1fr', 
        gap: '40px', 
        alignItems: 'center' 
      }}>
        
        {/* LEFT: TIMELINE */}
        <div className="timeline-container" style={{ position: 'relative', padding: '260px 0', minHeight: '520px' }}>
          
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
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = isEven 
                        ? '0 20px 40px rgba(10,42,102,0.25)' 
                        : '0 20px 40px rgba(0,0,0,0.1)';
                      e.currentTarget.parentElement.querySelector('.timeline-dot').style.transform = 'translateY(-50%) scale(1.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = isEven 
                        ? '0 10px 30px rgba(10,42,102,0.15)' 
                        : '0 10px 30px rgba(0,0,0,0.06)';
                      e.currentTarget.parentElement.querySelector('.timeline-dot').style.transform = 'translateY(-50%) scale(1)';
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
          style={{ paddingLeft: '20px' }}
        >
          <h2 style={{ 
            fontSize: 'clamp(28px, 4vw, 36px)', 
            fontWeight: '900', 
            color: NAVY, 
            marginBottom: '16px', 
            letterSpacing: '-1px',
            lineHeight: 1.1
          }}>
            {title || "Safety 360° Journey"}
          </h2>
          <p style={{ 
            color: '#64748b', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' 
          }}>{subtitle || "Since introducing Safety 360° in 2018, we've continued to raise the bar by launching new proactive initiatives, promoting deep collaboration, and fostering a culture of shared responsibility across all project sites."}</p>
          
          <div style={{ 
            width: '100%', 
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(10,42,102,0.15)',
            position: 'relative',
            height: '320px',
            background: '#0a2a66'
          }}>
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
                    transform: currentImg === i ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 4s ease-out'
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
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .approach-grid {
            grid-template-columns: 1fr !important;
          }
          .timeline-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SafetyApproach;