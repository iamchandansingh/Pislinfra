import React from 'react'
import PageHero from '../hero/PageHero'
import BlogSEO from '../Blog/BlogSEO'

const SolutionLayout = ({ seoData, hero, intro, mainFeature, grids, children }) => {
  return (
    <div>
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title={hero.title} 
        subtitle={hero.subtitle}
        breadcrumb={hero.breadcrumb}
        bgImage={hero.bgImage}
      />
      
      <section style={{ padding: '80px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1350px', margin: '0 auto' }}>
          
          {/* Optional Intro Paragraph */}
          {intro && intro.text && (
            <div style={{ maxWidth: '900px', margin: '0 auto 60px', textAlign: 'center' }}>
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
            <div className="solution-row" style={{ display: 'grid', gridTemplateColumns: mainFeature.image ? '1fr 1fr' : '1fr', gap: '48px', alignItems: 'center', marginBottom: '60px' }}>
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
              {mainFeature.image && (
                <div style={{ borderRadius: '16px', overflow: 'hidden', height: '400px', backgroundImage: `url(${mainFeature.image})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '4px solid #ff8755', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}></div>
              )}
            </div>
          )}

          {/* Dynamic Grids for Features / Advantages / Services */}
          {grids && grids.map((grid, index) => (
            <div key={index} style={{ marginBottom: index === grids.length - 1 ? '0' : '60px' }}>
              {grid.title && (
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px', textAlign: 'center' }}>
                  {grid.title}
                </h2>
              )}
              {grid.description && (
                <div style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto 40px', textAlign: 'center' }}>
                  {grid.description}
                </div>
              )}
              <div className="solution-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${grid.minWidth || '340px'}, 1fr))`, gap: '24px', marginTop: grid.title || grid.description ? '40px' : '0' }}>
                {grid.items.map((item, i) => (
                  <div key={i} style={{ padding: '32px', backgroundColor: grid.cardBg || '#fafbfc', borderRadius: '12px', border: `1px solid ${grid.cardBorder || '#f0f0f0'}`, borderBottom: '4px solid #ff8755', display: grid.vertical ? 'block' : 'flex', alignItems: 'flex-start', gap: '16px', textAlign: grid.vertical ? 'center' : 'left' }}>
                    <div style={{ width: grid.vertical ? '60px' : '48px', height: grid.vertical ? '60px' : '48px', borderRadius: '14px', backgroundColor: grid.iconBg || '#fff5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, margin: grid.vertical ? '0 auto 16px' : '0' }}>
                      <item.icon style={{ color: grid.iconColor || '#ff8755', fontSize: grid.vertical ? '24px' : '20px' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: grid.vertical ? '20px' : '18px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '8px' }}>{item.title}</h3>
                      <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {children}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .solution-row { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 600px) {
          .solution-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

export default SolutionLayout
