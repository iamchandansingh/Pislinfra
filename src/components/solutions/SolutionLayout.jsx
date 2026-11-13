import React from 'react'
import PageHero from '../hero/PageHero'
import BlogSEO from '../Blog/BlogSEO'

const SolutionLayout = ({ seoData, hero, intro, mainFeature, grids, children }) => {
  return (
    <div>
      <BlogSEO blog={seoData} />
      
      {hero && hero.show !== false && (
        <PageHero 
          title={hero.title} 
          subtitle={hero.subtitle}
          breadcrumb={hero.breadcrumb}
          bgImage={hero.bgImage}
        />
      )}
      
      {/* Main Top Content Section (Intro & Main Feature) */}
      {((intro && intro.text) || (mainFeature && mainFeature.text)) && (
        <section style={{ padding: '70px 16px 40px', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '1350px', margin: '0 auto' }}>
            
            {/* Optional Intro Paragraph */}
            {intro && intro.text && (
              <div style={{ maxWidth: '900px', margin: '0 auto 50px', textAlign: 'center' }}>
                {intro.title && (
                  <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px' }}>
                    {intro.title}
                  </h2>
                )}
                <div style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.9' }}>
                  {intro.text}
                </div>
              </div>
            )}

            {/* Main Feature: 2 Column Layout (Text + Image) */}
            {mainFeature && mainFeature.text && (
              <div className="solution-row" style={{ display: 'grid', gridTemplateColumns: (mainFeature.image || mainFeature.imageTopContent) ? '1fr 1fr' : '1fr', gap: '48px', alignItems: mainFeature.alignItems || (mainFeature.imageTopContent ? 'start' : 'center'), marginBottom: '20px' }}>
                <div>
                  {mainFeature.title && (
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px' }}>
                      {mainFeature.title}
                    </h2>
                  )}
                  <div style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8' }}>
                    {mainFeature.text}
                  </div>
                </div>
                {(mainFeature.image || mainFeature.imageTopContent) && (
                  <div>
                    {mainFeature.imageTopContent && (
                      <div style={{ marginBottom: '20px' }}>
                        {mainFeature.imageTopContent}
                      </div>
                    )}
                    {mainFeature.image && (
                      <div style={{ borderRadius: '16px', overflow: 'hidden', height: mainFeature.imageHeight || (mainFeature.imageOverlayContent ? '410px' : (mainFeature.imageTopContent ? '320px' : '400px')), border: mainFeature.imageBorder || '2px solid #0a2a66', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'relative' }}>
                        <img
                          src={mainFeature.image}
                          alt={typeof mainFeature.title === 'string' ? mainFeature.title : 'Pragati Infra Solutions Infrastructure Services'}
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                        />
                        {mainFeature.imageOverlayContent && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(10, 42, 102, 0.96) 0%, rgba(10, 42, 102, 0.82) 65%, rgba(10, 42, 102, 0) 100%)',
                            padding: '36px 24px 22px',
                            zIndex: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end'
                          }}>
                            {typeof mainFeature.imageOverlayContent === 'string' ? (
                              <>
                                <div style={{ width: '36px', height: '3px', backgroundColor: '#ff8755', borderRadius: '2px', marginBottom: '10px' }} />
                                <p style={{ margin: 0, color: '#ffffff', fontSize: '14px', lineHeight: '1.75', fontWeight: '400' }}>
                                  {mainFeature.imageOverlayContent}
                                </p>
                              </>
                            ) : (
                              mainFeature.imageOverlayContent
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Dynamic Grids (Full-Width Bands or Standard Sections) */}
      {grids && grids.map((grid, index) => {
        const isFull = Boolean(grid.fullWidth);
        const gridContent = (
          <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '0 16px' }}>
            {grid.badge && (
              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: grid.badgeColor || '#ffffff',
                  backgroundColor: grid.badgeBg || 'rgba(255, 135, 85, 0.95)',
                  padding: '5px 14px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {grid.badge}
                </span>
              </div>
            )}
            {grid.title && (
              <h2 style={{ fontSize: grid.compact ? '26px' : '28px', fontWeight: 'bold', color: grid.titleColor || '#2a2a75', marginBottom: '16px', textAlign: 'center' }}>
                {grid.title}
              </h2>
            )}
            {grid.description && (
              <div style={{ color: grid.descColor || '#4b5563', fontSize: grid.compact ? '14.5px' : '15px', lineHeight: '1.8', maxWidth: '800px', margin: grid.compact ? '0 auto 28px' : '0 auto 40px', textAlign: 'center' }}>
                {grid.description}
              </div>
            )}
            <div
              className={`solution-grid ${grid.gridClass || ''}`}
              style={{
                display: grid.centeredItems ? 'flex' : 'grid',
                flexWrap: grid.centeredItems ? 'wrap' : undefined,
                justifyContent: grid.centeredItems ? 'center' : undefined,
                gridTemplateColumns: grid.centeredItems ? undefined : (grid.columns || `repeat(auto-fit, minmax(${grid.minWidth || '340px'}, 1fr))`),
                gap: grid.gap || (grid.compact ? '20px' : '24px'),
                marginTop: grid.title || grid.description ? (grid.compact ? '24px' : '40px') : '0'
              }}
            >
              {(grid.items || []).map((item, i) => {
                const isNoBorder = grid.borderless || grid.cardBorder === 'none';
                const isNoOrange = grid.noOrangeBorder || grid.cardBottomBorder === 'none';
                const isVerticalCard = Boolean(grid.boxLayout || grid.vertical);
                const bWidth = grid.borderWidth || '1px';
                const bColor = grid.cardBorder || '#f0f0f0';
                return (
                  <div
                    key={i}
                    className={grid.cardClass || ''}
                    style={{
                      padding: grid.cardPadding || (grid.compact ? '24px 22px' : '32px'),
                      backgroundColor: grid.cardBg || '#fafbfc',
                      borderRadius: grid.cardRadius || '14px',
                      borderTop: isNoBorder ? 'none' : `${bWidth} solid ${bColor}`,
                      borderLeft: isNoBorder ? 'none' : `${bWidth} solid ${bColor}`,
                      borderRight: isNoBorder ? 'none' : `${bWidth} solid ${bColor}`,
                      borderBottom: isNoBorder ? 'none' : (isNoOrange ? `${bWidth} solid ${bColor}` : (grid.cardBottomBorder || (grid.compact ? '3px solid #ff8755' : '4px solid #ff8755'))),
                      display: 'flex',
                      flexDirection: isVerticalCard ? 'column' : 'row',
                      alignItems: grid.vertical ? 'center' : 'flex-start',
                      gap: isVerticalCard ? '16px' : (grid.compact ? '14px' : '16px'),
                      textAlign: grid.vertical ? 'center' : 'left',
                      boxShadow: grid.cardShadow || (grid.compact ? '0 4px 20px rgba(0,0,0,0.06)' : 'none'),
                      flex: grid.centeredItems ? '0 1 calc(33.333% - 16px)' : undefined,
                      minWidth: grid.centeredItems ? '300px' : undefined,
                      maxWidth: grid.centeredItems ? '380px' : undefined,
                      ...(grid.cardStyle || {})
                    }}
                  >
                    {isVerticalCard && grid.showNumbers ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%'
                      }}>
                        <div
                          className={grid.circleAnimation ? "pisl-circle-anim-wrap" : ""}
                          style={{
                            position: 'relative',
                            width: grid.circleAnimation ? (grid.compact ? '48px' : '52px') : (grid.compact ? '44px' : '48px'),
                            height: grid.circleAnimation ? (grid.compact ? '48px' : '52px') : (grid.compact ? '44px' : '48px'),
                            borderRadius: grid.circleAnimation ? '50%' : '12px',
                            backgroundColor: grid.iconBg || '#fff5f0',
                            border: grid.circleAnimation ? '2px solid #ff8755' : '1px solid #ffd5c2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            animation: grid.circleAnimation ? 'pislCirclePulse 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite' : undefined,
                          }}
                        >
                          {grid.circleAnimation && (
                            <div
                              className="pisl-circle-spin-ring"
                              style={{
                                position: 'absolute',
                                inset: '-6px',
                                borderRadius: '50%',
                                border: '2px dashed rgba(255, 135, 85, 0.65)',
                                animation: 'pislCircleSpin 10s linear infinite',
                                pointerEvents: 'none'
                              }}
                            />
                          )}
                          <item.icon
                            style={{
                              color: grid.iconColor || '#ff8755',
                              fontSize: grid.compact ? '20px' : '22px'
                            }}
                          />
                        </div>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '800',
                          color: '#cbd5e1',
                          letterSpacing: '1px',
                          fontFamily: 'monospace'
                        }}>
                          0{i + 1}
                        </span>
                      </div>
                    ) : (
                      <div
                        className={grid.circleAnimation ? "pisl-circle-anim-wrap" : ""}
                        style={{
                          position: 'relative',
                          width: grid.vertical ? (grid.compact ? '48px' : '60px') : (grid.compact ? '40px' : '48px'),
                          height: grid.vertical ? (grid.compact ? '48px' : '60px') : (grid.compact ? '40px' : '48px'),
                          borderRadius: grid.circleAnimation ? '50%' : (grid.compact ? '10px' : '14px'),
                          backgroundColor: grid.iconBg || '#fff5f0',
                          border: grid.circleAnimation ? '2px solid #ff8755' : undefined,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          margin: grid.vertical ? '0 auto 12px' : '0',
                          animation: grid.circleAnimation ? 'pislCirclePulse 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite' : undefined,
                        }}
                      >
                        {grid.circleAnimation && (
                          <div
                            className="pisl-circle-spin-ring"
                            style={{
                              position: 'absolute',
                              inset: '-6px',
                              borderRadius: '50%',
                              border: '2px dashed rgba(255, 135, 85, 0.65)',
                              animation: 'pislCircleSpin 10s linear infinite',
                              pointerEvents: 'none'
                            }}
                          />
                        )}
                        <item.icon
                          style={{
                            color: grid.iconColor || '#ff8755',
                            fontSize: grid.vertical ? (grid.compact ? '20px' : '24px') : (grid.compact ? '18px' : '20px')
                          }}
                        />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: isVerticalCard ? '17px' : (grid.vertical ? (grid.compact ? '17px' : '20px') : (grid.compact ? '16px' : '18px')),
                          fontWeight: 'bold',
                          color: '#1e293b',
                          marginBottom: '8px',
                          lineHeight: '1.4'
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          color: '#64748b',
                          fontSize: grid.compact ? '13.5px' : '14px',
                          lineHeight: grid.compact ? '1.65' : '1.7',
                          margin: 0
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

        return (
          <section
            key={index}
            className={grid.containerClass || ''}
            style={{
              position: 'relative',
              width: '100%',
              padding: isFull ? (grid.sectionPadding || '75px 0') : '40px 0',
              overflow: 'hidden',
              border: 'none',
              ...(isFull ? {} : { backgroundColor: grid.sectionBg || 'white' }),
              ...(grid.containerStyle || {})
            }}
          >
            {grid.bgImage && (
              <>
                <img
                  src={grid.bgImage}
                  alt={typeof grid.title === 'string' ? grid.title : 'Warehouse Infrastructure'}
                  loading="lazy"
                  decoding="async"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    filter: grid.imageFilter || 'brightness(0.9) contrast(1.05)',
                    zIndex: 0,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: grid.bgOverlay || 'linear-gradient(135deg, rgba(10, 42, 102, 0.74) 0%, rgba(30, 32, 95, 0.80) 100%)',
                    zIndex: 1,
                  }}
                />
              </>
            )}

            <div style={{ position: 'relative', zIndex: 2 }}>
              {gridContent}
            </div>
          </section>
        );
      })}

      {children && (
        <section style={{ padding: '0 16px 60px', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '1350px', margin: '0 auto' }}>
            {children}
          </div>
        </section>
      )}

      <style>{`
        @keyframes pislCircleSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pislCirclePulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 135, 85, 0.5);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(255, 135, 85, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 135, 85, 0);
          }
        }
        @media (max-width: 900px) {
          .solution-row { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 768px) {
          .warehouse-considerations-section {
            padding: 28px 16px !important;
            border-radius: 16px !important;
          }
        }
        @media (max-width: 600px) {
          .solution-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

export default SolutionLayout
