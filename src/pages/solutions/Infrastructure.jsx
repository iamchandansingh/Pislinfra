import React from 'react'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import infraBg from '../../assets/images/Project/complete/Bilaspur-NCR/amazon-del5-billaspur-hr-6.png'
import { FaClock, FaCheckCircle, FaUserTie, FaHardHat } from 'react-icons/fa'

const Infrastructure = () => {
  const seoData = {
    contentType: 'page',
    title: 'Infrastructure Development',
    seoTitle: 'Infrastructure Development | Pislinfra',
    seoDescription: 'Pislinfra offers comprehensive infrastructure development services. From planning to execution, we build robust infrastructure projects across India.',
    seoKeywords: 'infrastructure development, infrastructure projects, civil engineering, construction planning, infrastructure company, Pislinfra',
    slug: 'solutions/infrastructure',
    canonicalUrl: 'https://pislinfra.com/solutions/infrastructure',
    ogTitle: 'Infrastructure Development Services | Pislinfra',
    ogDescription: 'Comprehensive infrastructure development from planning to execution.',
    ogImage: 'https://pislinfra.com/images/hero/Service.png',
    ogType: 'website',
    twitterTitle: 'Infrastructure Development | Pislinfra',
    twitterDescription: 'Robust infrastructure projects across India.',
    twitterImage: 'https://pislinfra.com/images/hero/Service.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Infrastructure', 'Development', 'Civil Engineering', 'Construction'],
  };

  const differentiators = [
    { icon: FaClock, title: 'Timely Delivery', desc: 'At PISL Infra, punctual project completion is our hallmark. We understand the importance of timelines and are committed to delivering results efficiently without compromising on quality.' },
    { icon: FaCheckCircle, title: 'Quality Construction', desc: 'Our unwavering dedication to delivering high-quality building services sets us apart. We uphold strict standards to ensure that every aspect of our work meets or exceeds industry expectations.' },
    { icon: FaUserTie, title: 'Professional Management', desc: 'A team of highly qualified and experienced individuals forms the backbone of our operations. Their expertise ensures precision and excellence in every phase of the construction process.' },
    { icon: FaHardHat, title: 'Safety Commitment', desc: 'Safety is non-negotiable at PISL Infra. We adhere strictly to safety requirements, prioritising the well-being of our team, clients, and the community in every project we undertake.' }
  ]

  return (
    <SolutionLayout
      seoData={seoData}
      hero={{
        title: "Infrastructure Development",
        subtitle: "Building the foundation for tomorrow's growth",
        breadcrumb: "Solutions / Infrastructure",
        bgImage: infraBg
      }}
      intro={{
        text: (
          <p>
            Experience the zenith of construction prowess with PISL Infra's Infrastructure Development. Armed with a profound understanding of industry requirements, we are well-equipped to undertake major commercial building projects nationwide. We specialise in offering premium yet affordable factory construction services. From factory sheds to diverse manufacturing facilities, our services align with our clients' business goals.
          </p>
        )
      }}
      mainFeature={{
        title: <span>Introduction to <span style={{ color: '#0a2a66' }}>Infrastructure Development</span></span>,
        text: (
          <>
            <p style={{ marginBottom: '16px' }}>
              Infrastructure development is the foundational framework that sustains a society's operational functions and enhances the quality of life. The scope encompasses the design, construction, and maintenance of essential facilities like roads, bridges, water supply systems, and energy networks. Beyond mere physical structures, it acts as the catalyst for economic growth and societal progress.
            </p>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px', marginTop: '32px' }}>
              Services Offered by <span style={{ color: '#0a2a66' }}>PISL Infra</span>
            </h3>
            <p style={{ marginBottom: '16px' }}>
              PISL Infra stands out for providing quality services efficiently and affordably. We offer world-class services, ensuring adherence to the most recent construction technology guidelines. Customer satisfaction is our goal, and we try to do the best possible for our clients. PISL has emerged as the premier company for manufacturing and infrastructure development nationwide.
            </p>
            <p>
              We take pride in building world-class manufacturing infrastructures. We firmly believe our construction process makes us a one-stop solution for major infrastructure developments. The company works closely with the stakeholders and clients to design effective and robust spaces. PISL works towards optimising resources without compromising the quality of final products.
            </p>
          </>
        ),
        image: infraBg
      }}
    >
      <style>{`
        .why-pisl-split-wrapper {
          max-width: 1400px;
          margin: 80px auto;
          padding: 0 30px;
          display: flex;
          gap: 40px;
          align-items: stretch;
        }

        .why-pisl-left {
          width: 40%;
        }

        .why-pisl-image-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          background-image: url('/images/Project/complete/Bengaluru-KA/logos-india-industrial-park-bengaluru-ka.png');
          background-size: cover;
          background-position: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 2px solid #ffede5;
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
          flex-direction: column;
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
          .why-pisl-list-card {
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
          .why-pisl-list-card {
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
                What Differentiates <span>Us?</span>
              </h2>
              <p className="why-pisl-left-desc">
                Our steadfast dedication to essential distinguishing qualities demonstrates our commitment to attaining operational excellence and maintaining the highest industry standards.
              </p>
            </div>
          </div>
        </div>

        {/* Right Box Grid Area */}
        <div className="why-pisl-right">
          {differentiators.map((feature, index) => (
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

export default Infrastructure