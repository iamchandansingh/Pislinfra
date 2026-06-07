import PageHero from '../../components/hero/PageHero'
import { FaRulerCombined, FaHardHat, FaArrowRight } from 'react-icons/fa'

const ServicesPage = () => {
  return (
    <div>
      {/* Hero */}
      <PageHero 
        title="Our Services" 
        subtitle="Comprehensive infrastructure solutions tailored to your needs"
        breadcrumb="Services"
        bgImage="/images/hero/Service.png"
      />

      {/* Section 1 - Design */}
      <section style={{ padding: '100px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center'
          }} className="service-grid">
            
            {/* Left - Image */}
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              height: '450px',
              boxShadow: '0 20px 40px rgba(40,41,111,0.1)'
            }}>
              <img 
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Design Services"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Right - Content */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '3px', background: '#ff904e', borderRadius: '2px' }} />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#ff904e', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Our Services
                </span>
              </div>
              
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 42px)',
                fontWeight: 900,
                color: '#28296F',
                margin: '0 0 20px 0',
                letterSpacing: '-1px',
                lineHeight: 1.2
              }}>
                Design
              </h2>

              <p style={{
                fontSize: '15px',
                color: '#64748b',
                lineHeight: 1.8,
                margin: '0 0 24px 0',
                fontWeight: 500
              }}>
                Our team of dedicated architects and designers collaboratively envision and execute projects that redefine skylines and set new standards in architectural excellence. From conceptualisation to realisation, our vertical design approach ensures every project stands as a testament to our commitment to shaping environments that not only stand tall but also enrich lives.
              </p>

              <p style={{
                fontSize: '15px',
                color: '#64748b',
                lineHeight: 1.8,
                margin: '0 0 32px 0',
                fontWeight: 500
              }}>
                Explore our portfolio and witness the transformative power of design that reaches for the sky.
              </p>

              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                backgroundColor: '#28296F',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff904e'
                  e.currentTarget.style.gap = '16px'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#28296F'
                  e.currentTarget.style.gap = '10px'
                }}
              >
                <FaRulerCombined style={{ fontSize: '16px' }} />
                Learn More
                <FaArrowRight style={{ fontSize: '14px' }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Construction */}
      <section style={{ padding: '100px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center'
          }} className="service-grid">
            
            {/* Left - Content */}
            <div style={{ order: 1 }} className="service-content-order">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '3px', background: '#ff904e', borderRadius: '2px' }} />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#ff904e', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Our Services
                </span>
              </div>
              
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 42px)',
                fontWeight: 900,
                color: '#28296F',
                margin: '0 0 20px 0',
                letterSpacing: '-1px',
                lineHeight: 1.2
              }}>
                Construction
              </h2>

              <p style={{
                fontSize: '15px',
                color: '#64748b',
                lineHeight: 1.8,
                margin: '0 0 24px 0',
                fontWeight: 500
              }}>
                We specialise in the vertical of construction that builds the backbone of industries. Our expertise lies in creating robust and efficient spaces that cater to the unique needs of warehousing and industrial operations. With a keen focus on functionality, durability, and optimised space utilisation, we construct vertical structures that seamlessly integrate with the industrial landscape.
              </p>

              <p style={{
                fontSize: '15px',
                color: '#64748b',
                lineHeight: 1.8,
                margin: '0 0 32px 0',
                fontWeight: 500
              }}>
                Our dedicated team of professionals brings years of experience to the table, ensuring that every project is meticulously planned and executed to deliver exceptional results. From large-scale warehouses to specialised industrial facilities, we are committed to constructing vertical spaces that facilitate streamlined operations, enhance productivity, and contribute to the growth of businesses.
              </p>

              <p style={{
                fontSize: '15px',
                color: '#64748b',
                lineHeight: 1.8,
                margin: '0 0 32px 0',
                fontWeight: 500
              }}>
                Explore our portfolio to witness how our construction vertical has played a pivotal role in shaping the industrial infrastructure.
              </p>

              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                backgroundColor: '#28296F',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff904e'
                  e.currentTarget.style.gap = '16px'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#28296F'
                  e.currentTarget.style.gap = '10px'
                }}
              >
                <FaHardHat style={{ fontSize: '16px' }} />
                Learn More
                <FaArrowRight style={{ fontSize: '14px' }} />
              </button>
            </div>

            {/* Right - Image */}
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              height: '450px',
              boxShadow: '0 20px 40px rgba(40,41,111,0.1)',
              order: 2
            }} className="service-image-order">
              <img 
                src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Construction Services"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#28296F' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.6,
            margin: 0,
            fontStyle: 'italic'
          }}>
            "It is not the beauty of a building you should look at, it is the construction of the foundation that will stand the test of time."
          </p>
          <div style={{
            width: '60px',
            height: '3px',
            background: '#ff904e',
            margin: '24px auto 0',
            borderRadius: '2px'
          }} />
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .service-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .service-content-order {
            order: 2 !important;
          }
          .service-image-order {
            order: 1 !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ServicesPage