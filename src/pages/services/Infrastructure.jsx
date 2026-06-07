import PageHero from '../../components/hero/PageHero'
import { FaCheckCircle, FaClock, FaUsers, FaShieldAlt, FaCogs, FaStar } from 'react-icons/fa'

const Infrastructure = () => {
  const differentiators = [
    {
      icon: FaCogs,
      title: 'Technical Competence',
      desc: 'We have the necessary technical competence and understanding to handle all sorts of tasks.'
    },
    {
      icon: FaUsers,
      title: 'Complete Project Management',
      desc: 'Our warehouse contractors are capable of managing complete projects, including design and construction.'
    },
    {
      icon: FaClock,
      title: 'On-Time Delivery',
      desc: 'We concentrate on designing and completing projects on time.'
    },
    {
      icon: FaStar,
      title: 'Cost-Effective Solutions',
      desc: 'We provide cost-effective, intelligent, and precise solutions to help our clients build best-in-class infrastructure.'
    },
    {
      icon: FaShieldAlt,
      title: 'Trusted Partner',
      desc: 'We are a very trustworthy, knowledgeable, and prestigious building firm.'
    },
    {
      icon: FaCheckCircle,
      title: 'Quality Materials',
      desc: 'To design and construct world-class projects for our clients, we employ the highest quality materials and labour.'
    },
  ]

  return (
    <div>
      <PageHero 
        title="Infrastructure Development" 
        subtitle="Roads, bridges & civil projects"
        breadcrumb="Services / Infrastructure"
        bgImage="https://images.pexels.com/photos/159306/pexels-photo-159306.jpeg?auto=compress&cs=tinysrgb&w=1200"
      />
      
      <section style={{ padding: '80px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Introduction */}
          <div style={{ maxWidth: '900px', margin: '0 auto 60px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px' }}>
              <span style={{ color: '#ff8755' }}>Introduction</span>
            </h2>
            <div style={{ width: '50px', height: '3px', backgroundColor: '#ff8755', margin: '0 auto 20px' }}></div>
            <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.9' }}>
              India's infrastructure firms are the primary drivers of the country's economic growth and advancement. Despite inflation, increasing interest rates, and a slew of other obstacles, the infrastructure sector has grown and expanded impressively. As one of India's major infrastructure corporations, we are well aware of the sector's challenges and requirements. We work on infrastructure projects from start to finish, including engineering, construction, and project management. We realise that when it comes to constructing solid and distinctive projects, governments and businesses desire a highly trustworthy and trusted partner capable of providing great construction design and development services.
            </p>
          </div>

          {/* What is Infrastructure Development + Image */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '60px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px' }}>
                What is <span style={{ color: '#ff8755' }}>Infrastructure Development?</span>
              </h2>
              <div style={{ width: '50px', height: '3px', backgroundColor: '#ff8755', marginBottom: '20px' }}></div>
              <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8' }}>
                Infrastructure development is the systematic enhancement of essential physical and organisational structures within a region. It encompasses the creation, maintenance, and improvement of critical assets such as transportation, utilities, communication, and public facilities. This strategic development promotes economic growth, connectivity, and an improved quality of life for communities.
              </p>
            </div>
            <div style={{ 
              borderRadius: '16px', overflow: 'hidden', height: '400px',
              backgroundImage: 'url(https://images.pexels.com/photos/159306/pexels-photo-159306.jpeg?auto=compress&cs=tinysrgb&w=600)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: '4px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}></div>
          </div>

          {/* What Differentiates Us */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px', textAlign: 'center' }}>
              What <span style={{ color: '#ff8755' }}>Differentiates Us?</span>
            </h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: '#ff8755', margin: '0 auto 20px' }}></div>
            <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto 40px', textAlign: 'center' }}>
              We have managed and implemented projects for governments, MNCs, and agencies as one of India's leading and most reputable infrastructure organisations. At PISL Infra, we go into the smallest of aspects to design, build, and provide attractive and creative infrastructures for our clients.
            </p>
          </div>

          {/* Differentiator Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {differentiators.map((item, i) => (
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
                    <item.icon style={{ color: '#ff8755', fontSize: '20px' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                      {item.desc}
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

export default Infrastructure