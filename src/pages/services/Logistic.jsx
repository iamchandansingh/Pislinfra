import PageHero from '../../components/hero/PageHero'
import { FaPencilRuler, FaHardHat, FaTruck, FaStar, FaCogs, FaChartLine, FaCheckCircle } from 'react-icons/fa'

const Logistic = () => {
  const services = [
    {
      icon: FaPencilRuler,
      title: 'Design',
      desc: "PISL's design expertise transcends aesthetics, focusing on robust foundations that endure the test of time. Our dedicated architects envision and execute projects that redefine skylines, represent architectural excellence and enrich lives."
    },
    {
      icon: FaHardHat,
      title: 'Construction',
      desc: 'PISL Infra specialises in constructing industrial backbones with a keen eye on functionality, durability, and space optimisation. Our experienced team ensures meticulous planning and execution, delivering exceptional results. Whether it is large-scale warehouses or specialised facilities, our warehouse contractors contribute to streamlined operations and business growth.'
    },
    {
      icon: FaTruck,
      title: 'Procurement',
      desc: 'Through smart sourcing, efficient procedures, and high-quality products, PISL\'s procurement sector offers considerable value. We ensure timely and cost-effective procurement with our vast network and industry experience, facilitating the flawless execution of warehousing and industrial initiatives.'
    },
  ]

  const capabilities = [
    {
      icon: FaStar,
      title: 'Cutting-Edge Industrial and Warehousing Spaces',
      desc: 'PISL sets itself apart by delivering top-notch Grade-A infrastructure tailored for our BTS (Built-To-Suit) clients. Our commitment to excellence permeates every aspect, guaranteeing efficiency and quality in both design and construction for every project.'
    },
    {
      icon: FaCogs,
      title: 'Tech-Driven Innovation',
      desc: 'PISL welcomes the future through the strategic integration of information technology. We use cutting-edge techniques to expedite procurement procedures and efficiently manage construction timelines. This technological integration allows us to deliver projects with more precision and agility.'
    },
    {
      icon: FaCheckCircle,
      title: 'Precision in Execution',
      desc: 'At PISL, execution is at the heart of our services. We guarantee our clients a smooth and accurate execution across all of our solutions, ensuring that their investment is maximised and their vision is fulfilled.'
    },
    {
      icon: FaChartLine,
      title: 'Strategic Financial Approach',
      desc: 'PISL is at the forefront of India\'s thriving warehousing industry, providing not just secure but also profitable financial opportunities. Our dedication to a balanced and prosperous financial perspective is in sync with the industry\'s rapid expansion, assuring a safe investment for our clients.'
    },
  ]

  return (
    <div>
      <PageHero 
        title="Logistic Park Development" 
        subtitle="Modern logistics & warehousing solutions"
        breadcrumb="Services / Logistic"
        bgImage="https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1200"
      />
      
      <section style={{ padding: '80px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Introduction + Image */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '60px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px' }}>
                <span style={{ color: '#ff8755' }}>Introduction</span>
              </h2>
              <div style={{ width: '50px', height: '3px', backgroundColor: '#ff8755', marginBottom: '20px' }}></div>
              <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.9' }}>
                PISL stands as India's premier construction company, renowned for delivering exceptional services across diverse sectors. With a vast portfolio exceeding 8 million sq. ft., PISL embodies enthusiasm, hard work, and integrity. Committed to excellence, we've successfully crafted numerous projects, spanning millions of square metres, over our 13-year journey. Our unwavering ethical standards and strong track record make us a trusted industry leader in logistic park development.
              </p>
            </div>
            <div style={{ 
              borderRadius: '16px', overflow: 'hidden', height: '380px',
              backgroundImage: 'url(https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: '4px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}></div>
          </div>

          {/* Services Section */}
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '8px', textAlign: 'center' }}>
              Services <span style={{ color: '#ff8755' }}>(Design, Procurement & Construction)</span>
            </h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: '#ff8755', margin: '0 auto 40px' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {services.map((service, i) => (
                <div key={i} style={{
                  padding: '32px', backgroundColor: '#fafbfc',
                  borderRadius: '12px', border: '1px solid #f0f0f0',
                  borderBottom: '4px solid #ff8755', textAlign: 'center',
                }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '14px',
                    backgroundColor: '#fff5f0', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <service.icon style={{ color: '#ff8755', fontSize: '24px' }} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '12px' }}>
                    {service.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities Section */}
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '8px', textAlign: 'center' }}>
              What Makes Us Different <span style={{ color: '#ff8755' }}>(Our Capabilities)</span>
            </h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: '#ff8755', margin: '0 auto 40px' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              {capabilities.map((cap, i) => (
                <div key={i} style={{
                  padding: '32px', backgroundColor: '#fafbfc',
                  borderRadius: '12px', border: '1px solid #f0f0f0',
                  borderLeft: '4px solid #ff8755',
                  display: 'flex', alignItems: 'flex-start', gap: '16px',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '10px',
                    backgroundColor: '#fff5f0', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <cap.icon style={{ color: '#ff8755', fontSize: '20px' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '8px' }}>
                      {cap.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                      {cap.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Logistic