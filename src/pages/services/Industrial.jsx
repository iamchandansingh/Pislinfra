import PageHero from '../../components/hero/PageHero'
import { FaStar, FaUsers, FaHandshake, FaCogs } from 'react-icons/fa'

const Industrial = () => {
  const features = [
    {
      icon: FaStar,
      title: 'High-Quality Services',
      desc: 'PISL provides high-quality industrial building services and solutions at competitive rates. Our persistent commitment to quality and strict adherence to rigorous safety standards demonstrate our commitment to providing outstanding value.'
    },
    {
      icon: FaUsers,
      title: 'Expert Team',
      desc: 'Engineers, designers, and labourers at PISL have the knowledge and experience to manage projects of any scale and complexity. Their strengths include managing challenging tasks and guaranteeing effective outcomes.'
    },
    {
      icon: FaHandshake,
      title: 'Trusted Partner',
      desc: 'As a dependable industrial construction company, PISL consistently earns the trust of clients, forming partnerships built on transparency, professionalism, and reliability.'
    },
    {
      icon: FaStar,
      title: 'Client Satisfaction',
      desc: 'PISL prioritises attaining complete client satisfaction and assistance. Our concentrated efforts are focused on understanding and addressing our client\'s specific needs.'
    },
    {
      icon: FaCogs,
      title: 'Continuous Innovation',
      desc: 'PISL is committed to continuous improvement and innovation in our processes and functions. By constantly evolving, we ensure the delivery of effective and cutting-edge services.'
    },
  ]

  return (
    <div>
      <PageHero 
        title="Industrial Development" 
        subtitle="World-class industrial facilities and manufacturing plants"
        breadcrumb="Services / Industrial"
        bgImage="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200"
      />
      
      <section style={{ padding: '80px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Intro */}
          <div style={{ maxWidth: '900px', margin: '0 auto 48px', textAlign: 'center' }}>
            <p style={{ color: '#4b5563', fontSize: '17px', lineHeight: '1.9' }}>
              At PISL's Industrial Development Hub, you can experience the pinnacle of industrial innovation. PISL is a construction pioneer with over a decade of experience. We blend accuracy, cutting-edge technological integration, and a smart financial strategy into every project, resulting in industrial development spaces that not only meet but surpass expectations and establish new standards for excellence.
            </p>
          </div>

          {/* What is + Image */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '60px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px' }}>
                What is <span style={{ color: '#ff8755' }}>Industrial Development?</span>
              </h2>
              <div style={{ width: '50px', height: '3px', backgroundColor: '#ff8755', marginBottom: '20px' }}></div>
              <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8' }}>
                Industrial development is the dynamic process of creating, expanding, and optimising infrastructure and facilities within the industrial sector. It involves the strategic integration of technology, efficient resource management, and innovative warehouse design to foster economic growth, job creation, and the establishment of industrial ecosystems, driving progress and sustainability.
              </p>
            </div>
            <div style={{ 
              borderRadius: '16px', overflow: 'hidden', height: '400px',
              backgroundImage: 'url(https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: '4px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}></div>
          </div>

          {/* Our Unique Methodologies */}
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px' }}>
              Our Unique <span style={{ color: '#ff8755' }}>Methodologies & Approach</span>
            </h2>
            <div style={{ width: '50px', height: '3px', backgroundColor: '#ff8755', marginBottom: '20px' }}></div>
            <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
              Ranked among India's premier industrial construction firms, our commitment extends beyond mere project completion—we consider it incomplete until we precisely fulfil our client's unique requirements.
            </p>
            <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8' }}>
              Our methodologies and approach distinguish us from competitors, as we aspire not just to finish projects but to craft exceptional infrastructure and designs. We specialise in civil construction, which helps us construct mammoths and industries for their specific business goals and objectives.
            </p>
          </div>

          {/* Why PISL */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '8px' }}>
              Why <span style={{ color: '#ff8755' }}>PISL Infra?</span>
            </h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: '#ff8755', margin: '0 auto 20px' }}></div>
            <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto 40px' }}>
              At PISL Infra, we thrive on harnessing the creativity of our focused team of engineers, designers, and workers. This collaborative synergy ensures the generation of fresh, inventive ideas, delivering unparalleled results for our clients across diverse industries.
            </p>
          </div>

          {/* Feature Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {features.map((feature, i) => (
              <div key={i} style={{
                padding: '32px', backgroundColor: '#fafbfc',
                borderRadius: '12px', border: '1px solid #f0f0f0',
                borderBottom: '4px solid #ff8755',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '10px',
                    backgroundColor: '#fff5f0', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <feature.icon style={{ color: '#ff8755', fontSize: '20px' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '8px' }}>
                      {feature.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}

export default Industrial