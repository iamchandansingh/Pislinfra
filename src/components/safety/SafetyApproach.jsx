import React, { useState, useEffect } from 'react';

const NAVY = '#28286e';
const ORANGE = '#ff8755';

const SafetyApproach = () => {
  const [currentImg, setCurrentImg] = useState(0);
  
  const images = [
    "/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(5).png",
    "/images/awards/1.png",
    "/images/awards/2.png"
  ];

  // Auto-slide every 3 seconds
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
        "5-worker lunches program fosters conversations about safety",
        "Partner with ClarkDietrich to reduce lacerations"
      ]
    },
    {
      year: "2019", position: "bottom",
      points: [
        "Added Safety Moments at the beginning of all meetings",
        "After Action Reviews added to evaluate challenges",
        "Introduced crisis management process"
      ]
    },
    {
      year: "2020", position: "top",
      points: [
        "STOBG Safety Council has first meeting",
        "Introduction of COVID-19 protocol and best practices",
        "Release of Corporate Pandemic Preparedness Plan"
      ]
    },
    {
      year: "2021", position: "bottom",
      points: [
        "Safety directors evaluate safety-related technology",
        "Independent assessment of overall Safety Program"
      ]
    },
    {
      year: "2022", position: "top",
      points: [
        "Superintendent Roundtable created for field leaders",
        "Good Catch/Close Call initiative promotes jobsite awareness"
      ]
    },
    {
      year: "2023", position: "bottom",
      points: [
        "Safety 360° training added to project orientations",
        "Launch of Safety 360° Excellence Awards",
        "Safety director subcommittee on Innovation formed"
      ]
    },
    {
      year: "2024", position: "top",
      points: [
        "Safety helmets replace hard hats for all employees",
        "Company-wide A4 cut-resistant glove policy",
        "Partnership with Otto Tech Systems for SmartLadder"
      ]
    }
  ];

  return (
    <div style={{ 
      fontFamily: '"Helvetica Neue", Arial, sans-serif', 
      padding: '60px 28px', 
      maxWidth: '1400px', 
      margin: '0 auto', 
      backgroundColor: '#ffffff' 
    }}>
      
      {/* Header Section */}
      <header style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: 'clamp(28px, 3.5vw, 42px)', 
          fontWeight: '800', 
          color: NAVY, 
          marginBottom: '16px',
          letterSpacing: '-1px'
        }}>
          Pisl Hsc <span style={{ color: ORANGE }}>Journey 2025</span>
        </h1>
        <p style={{ 
          color: '#64748b', 
          lineHeight: '1.7', 
          fontSize: '15px', 
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          Our approach to safety culture in construction is different; for us, safety is a commitment and a passion, not an obligation. This philosophy embraces encouraging behavioral change and taking a 360-degree view of safety on the job and in our personal lives.
        </p>
      </header>

      {/* Main Content Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.8fr 1fr', 
        gap: '40px', 
        alignItems: 'start' 
      }} className="approach-grid">
        
        {/* Left: Timeline Container */}
        <div style={{ position: 'relative', padding: '260px 0', minHeight: '500px' }}>
          
          {/* Main Horizontal Line */}
          <div style={{ 
            position: 'absolute', 
            left: 0, right: 0, 
            top: '50%', 
            height: '5px', 
            backgroundColor: NAVY, 
            transform: 'translateY(-50%)', 
            zIndex: 1,
            borderRadius: '3px',
            opacity: 0.3
          }} />

          {/* Cards Flex Grid */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            zIndex: 2 
          }}>
            {timelineData.map((item, index) => {
              const isTop = item.position === 'top';
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', 
                  width: '13%', position: 'relative' 
                }}>
                  
                  <div style={{
                    position: 'absolute',
                    [isTop ? 'bottom' : 'top']: 'calc(50% + 28px)',
                    width: '135px',
                    backgroundColor: isEven ? NAVY : '#f8fafc',
                    color: isEven ? '#fff' : '#334155',
                    padding: '14px 12px', borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    fontSize: '11px', lineHeight: '1.5',
                    border: isEven ? 'none' : '1px solid #e2e8f0',
                    transition: 'all 0.3s ease', cursor: 'default'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                    }}
                  >
                    <div style={{ 
                      fontSize: '16px', fontWeight: '800', marginBottom: '8px', 
                      borderBottom: `2px solid ${isEven ? ORANGE : NAVY}`, 
                      paddingBottom: '4px', display: 'inline-block',
                      letterSpacing: '-0.3px', color: isEven ? '#fff' : NAVY
                    }}>
                      {item.year}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {item.points.map((pt, pIdx) => (
                        <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <span style={{ 
                            width: '4px', height: '4px', borderRadius: '50%', 
                            backgroundColor: isEven ? ORANGE : NAVY,
                            marginTop: '5px', flexShrink: 0
                          }} />
                          <span style={{ margin: 0, color: isEven ? 'rgba(255,255,255,0.85)' : '#475569' }}>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    position: 'absolute',
                    top: isTop ? 'auto' : '50%',
                    bottom: isTop ? '50%' : 'auto',
                    width: '2px', height: '28px',
                    backgroundColor: NAVY, opacity: 0.4
                  }} />
                  
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Auto-Sliding Images */}
        <div style={{ paddingTop: '20px' }}>
          <h2 style={{ 
            fontSize: '22px', fontWeight: '800', color: NAVY, 
            marginBottom: '16px', letterSpacing: '-0.5px'
          }}>
            Safety 360° <span style={{ color: ORANGE }}>Journey</span>
          </h2>
          <p style={{ 
            color: '#64748b', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' 
          }}>
            Since introducing Safety 360° in 2018, we've continued to raise the bar by launching new safety initiatives, promoting collaboration and shared responsibility.
          </p>
          
          {/* Auto-Sliding Image Container */}
          <div style={{ 
            width: '100%', 
            borderRadius: '12px', 
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(40,40,110,0.1)',
            position: 'relative',
            height: '280px',
            background: '#f1f5f9'
          }}>
            {images.map((img, i) => (
              <img 
                key={i}
                src={img}
                alt={`Safety ${i + 1}`} 
                style={{ 
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover',
                  opacity: currentImg === i ? 1 : 0,
                  transition: 'opacity 0.8s ease'
                }}
              />
            ))}
            
            {/* Slide Indicators */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              zIndex: 5
            }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  style={{
                    width: currentImg === i ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    border: 'none',
                    background: currentImg === i ? ORANGE : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0
                  }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .approach-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SafetyApproach;