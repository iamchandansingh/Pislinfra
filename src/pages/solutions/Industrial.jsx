import React from 'react'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import industrialBg from '../../assets/images/Project/complete/Pataudi-HR/flipkart-sampka-pataudi-hr.png'
import { FaStar, FaUsers, FaHandshake, FaCogs } from 'react-icons/fa'

const Industrial = () => {
  const seoData = {
    contentType: 'page',
    title: 'Industrial Development',
    seoTitle: 'Industrial Development| Pislinfra',
    seoDescription: 'Pislinfra delivers world-class industrial facilities & manufacturing plants. Expert in industrial construction, design-build solutions & infrastructure development across India.',
    seoKeywords: 'industrial development, industrial construction, manufacturing plants, industrial facilities, factory construction, industrial infrastructure, Pislinfra',
    slug: 'solutions/industrial',
    canonicalUrl: 'https://pislinfra.com/solutions/industrial',
    ogTitle: 'Industrial Development - Manufacturing Facilities | Pislinfra',
    ogDescription: 'World-class industrial facilities & manufacturing plants. Expert construction services.',
    ogImage: 'https://pislinfra.com/images/hero/Service.png',
    ogType: 'website',
    twitterTitle: 'Industrial Development | Pislinfra',
    twitterDescription: 'Industrial construction & manufacturing facility experts.',
    twitterImage: 'https://pislinfra.com/images/hero/Service.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Industrial', 'Manufacturing', 'Construction', 'Development', 'Factory'],
  };

  const features = [
    { icon: FaStar, title: 'High-Quality Services', desc: 'PISL provides high-quality industrial building services and solutions at competitive rates. Our persistent commitment to quality and strict adherence to rigorous safety standards demonstrate our commitment to providing outstanding value.' },
    { icon: FaUsers, title: 'Expert Team', desc: 'Engineers, designers, and labourers at PISL have the knowledge and experience to manage projects of any scale and complexity. Their strengths include managing challenging tasks and guaranteeing effective outcomes.' },
    { icon: FaHandshake, title: 'Trusted Partner', desc: 'As a dependable industrial construction company, PISL consistently earns the trust of clients, forming partnerships built on transparency, professionalism, and reliability.' },
    { icon: FaStar, title: 'Client Satisfaction', desc: 'PISL prioritises attaining complete client satisfaction and assistance. Our concentrated efforts are focused on understanding and addressing our client\'s specific needs.' },
    { icon: FaCogs, title: 'Continuous Innovation', desc: 'PISL is committed to continuous improvement and innovation in our processes and functions. By constantly evolving, we ensure the delivery of effective and cutting-edge services.' },
  ]

  return (
    <SolutionLayout
      seoData={seoData}
      hero={{
        title: "Industrial Development",
        subtitle: "World-class industrial facilities and manufacturing plants",
        breadcrumb: "Solutions / Industrial",
        bgImage: industrialBg
      }}
      intro={{
        text: (
          <p>
            At PISL's Industrial Development Hub, you can experience the pinnacle of industrial innovation. PISL is a construction pioneer with over a decade of experience. We blend accuracy, cutting-edge technological integration, and a smart financial strategy into every project, resulting in industrial development spaces that not only meet but surpass expectations and establish new standards for excellence.
          </p>
        )
      }}
      mainFeature={{
        title: <span>What is <span style={{ color: '#0a2a66' }}>Industrial Development?</span></span>,
        text: (
          <>
            <p style={{ marginBottom: '16px' }}>
              Industrial development is the dynamic process of creating, expanding, and optimising infrastructure and facilities within the industrial sector. It involves the strategic integration of technology, efficient resource management, and innovative warehouse design to foster economic growth, job creation, and the establishment of industrial ecosystems, driving progress and sustainability.
            </p>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px', marginTop: '32px' }}>
              Our Unique <span style={{ color: '#0a2a66' }}>Methodologies & Approach</span>
            </h3>
            <p style={{ marginBottom: '16px' }}>
              Ranked among India's premier industrial construction firms, our commitment extends beyond mere project completion—we consider it incomplete until we precisely fulfil our client's unique requirements.
            </p>
            <p>
              Our methodologies and approach distinguish us from competitors, as we aspire not just to finish projects but to craft exceptional infrastructure and designs. We specialise in civil construction, which helps us construct mammoths and industries for their specific business goals and objectives.
            </p>
          </>
        ),
        image: industrialBg
      }}
    >
      <style>{`
        .why-pisl-split-wrapper {
          max-width: 1400px; /* Increased width */
          margin: 80px auto;
          padding: 0 30px; /* Slightly more padding on edges */
          display: flex;
          gap: 40px; /* Increased gap to utilize extra width */
          align-items: stretch; /* Stretches both sides to be equal height! */
        }

        /* Left Side Image container */
        .why-pisl-left {
          width: 40%;
          /* Removed sticky so it acts as a normal flex child stretching to height */
        }

        .why-pisl-image-card {
          position: relative;
          width: 100%;
          height: 100%; /* Fills the stretched column */
          border-radius: 20px;
          overflow: hidden;
          background-image: url('/images/Project/complete/Bengaluru-KA/logos-india-industrial-park-bengaluru-ka-6.png');
          background-size: cover;
          background-position: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 2px solid #ffede5; /* Small orange-tinted border */
          display: flex;
          align-items: flex-end;
        }

        .why-pisl-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(10,42,102,0.1) 0%, rgba(10,42,102,0.7) 40%, rgba(10,42,102,0.95) 100%);
          z-index: 1;
        }

        .why-pisl-image-content {
          position: relative;
          z-index: 2;
          padding: 40px;
          color: #ffffff;
        }

        .why-pisl-image-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: bold;
          color: #ffffff;
          background-color: rgba(255, 135, 85, 0.9);
          padding: 6px 14px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 24px;
          backdrop-filter: blur(4px);
        }

        .why-pisl-image-badge::before {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          background-color: #ffffff;
          border-radius: 50%;
        }

        .why-pisl-left-title {
          font-size: 28px;
          font-weight: bold;
          color: #ffffff;
          margin-bottom: 20px;
          line-height: 1.3;
        }

        .why-pisl-left-title span {
          color: #ff8755;
        }

        .why-pisl-left-desc {
          color: #e2e8f0;
          font-size: 15px;
          line-height: 1.8;
          margin: 0;
        }

        /* Right Side Box Grid (Bento Style) */
        .why-pisl-right {
          width: 60%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .why-pisl-list-card {
          background: #ffffff;
          border: 1px solid #f0f0f0;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column; /* Box type layout */
          align-items: flex-start;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .why-pisl-list-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background-color: #ff8755;
        }

        .why-pisl-list-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          border-color: #ffe8df;
        }
        
        /* Make the 5th card span full width for symmetry */
        .why-pisl-list-card:last-child {
          grid-column: 1 / -1;
          flex-direction: row;
          align-items: flex-start;
        }

        .why-pisl-list-icon-wrap {
          width: 44px;
          height: 44px;
          background-color: #fff5f0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .why-pisl-list-icon {
          color: #ff8755;
          font-size: 20px;
        }

        .why-pisl-list-text {
          flex: 1;
        }

        .why-pisl-list-title {
          font-size: 17px;
          font-weight: bold;
          color: #2a2a75;
          margin-bottom: 6px;
        }

        .why-pisl-list-desc {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }

        /* Tablet & Mobile responsive */
        @media screen and (max-width: 900px) {
          .why-pisl-split-wrapper {
            flex-direction: column;
            margin: 60px auto;
            padding: 0 20px;
            gap: 32px;
          }
          .why-pisl-left, .why-pisl-right {
            width: 100%;
          }
          .why-pisl-right {
            grid-template-columns: 1fr;
          }
          .why-pisl-list-card,
          .why-pisl-list-card:last-child {
            flex-direction: row;
            align-items: flex-start;
          }
          .why-pisl-image-card {
            min-height: 400px;
          }
          .why-pisl-image-content {
            padding: 32px;
          }
        }

        /* Small Phones responsive */
        @media screen and (max-width: 600px) {
          .why-pisl-split-wrapper {
            margin: 40px auto;
            padding: 0 16px;
            gap: 24px;
          }
          .why-pisl-image-card {
            min-height: 350px;
            border-radius: 16px;
          }
          .why-pisl-image-content {
            padding: 24px 20px;
          }
          .why-pisl-left-title {
            font-size: 24px;
            margin-bottom: 12px;
          }
          .why-pisl-left-desc {
            font-size: 14px;
            line-height: 1.6;
          }
          .why-pisl-list-card,
          .why-pisl-list-card:last-child {
            flex-direction: column;
            padding: 20px;
            gap: 12px;
          }
        }
      `}</style>

      <div className="why-pisl-split-wrapper">
        
        {/* Left Fixed Area */}
        <div className="why-pisl-left">
          <div className="why-pisl-image-card">
            <div className="why-pisl-image-overlay"></div>
            <div className="why-pisl-image-content">
              <div className="why-pisl-image-badge">Core Advantages</div>
              <h2 className="why-pisl-left-title">
                Why <span>PISL Infra?</span>
              </h2>
              <p className="why-pisl-left-desc">
                At PISL Infra, we thrive on harnessing the creativity of our focused team of engineers, designers, and workers. This collaborative synergy ensures the generation of fresh, inventive ideas, delivering unparalleled results for our clients across diverse industries.
              </p>
            </div>
          </div>
        </div>

        {/* Right Box Grid Area */}
        <div className="why-pisl-right">
          {features.map((feature, index) => (
            <div key={index} className="why-pisl-list-card">
              <div className="why-pisl-list-icon-wrap">
                <feature.icon className="why-pisl-list-icon" />
              </div>
              <div className="why-pisl-list-text">
                <h3 className="why-pisl-list-title">
                  {feature.title}
                </h3>
                <p className="why-pisl-list-desc">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </SolutionLayout>
  )
}

export default Industrial