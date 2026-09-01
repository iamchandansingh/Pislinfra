import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'

const ServicesPage = () => {
  const seoData = {
    contentType: 'page',
    title: 'Our Solutions',
    seoTitle: 'Turnkey Industrial, Warehouse & Infrastructure Solutions | Pislinfra',
    seoDescription: 'Explore Pislinfra comprehensive industrial solutions: Turnkey EPC factory construction, Grade-A logistics parks, LEED warehouses, and heavy civil engineering across India.',
    seoKeywords: 'industrial construction solutions, warehouse EPC company India, logistics park construction, PEB design build, civil infrastructure development, Pislinfra',
    slug: 'solutions',
    canonicalUrl: 'https://pislinfra.com/solutions',
    ogTitle: 'Turnkey Industrial, Warehouse & Infrastructure Solutions | Pislinfra',
    ogDescription: 'Comprehensive industrial construction and infrastructure solutions across India. Design, Build, Logistics, and EPC.',
    ogImage: 'https://pislinfra.com/images/hero/Service.png',
    ogType: 'website',
    twitterTitle: 'Turnkey Industrial, Warehouse & Infrastructure Solutions | Pislinfra',
    twitterDescription: 'Comprehensive industrial construction and infrastructure solutions across India. Design, Build, Logistics, and EPC.',
    twitterImage: 'https://pislinfra.com/images/hero/Service.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'Service',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Industrial Solutions', 'Warehouse Construction', 'Logistics Parks', 'Turnkey EPC', 'Civil Infrastructure'],
  };

  const imgStyle = {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px',
    border: '3px solid #ff8d4b',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
  };

  return (
    <div>
      <BlogSEO blog={seoData} />

      <PageHero 
        title="Our Solutions" 
        subtitle="Comprehensive infrastructure solutions tailored to your needs"
        breadcrumb="Solutions"
        bgImage="/images/hero/Service.png"
      />

      <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' }}>
        
        <div className="service-row" style={sectionStyle}>
          <div style={imageContainerStyle}>
            <img src="/images/Overview/3.png" alt="Design" style={imgStyle} />
          </div>
          <div style={contentStyle}>
            <h2 style={{ color: '#28296F', fontSize: '32px', marginBottom: '20px', fontWeight: 800 }}>Design</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
              Our team of dedicated architects and designers collaboratively envision and execute projects that redefine skylines and set new standards in architectural excellence. From conceptualisation to realisation, our vertical design approach ensures every project stands as a testament to our commitment to shaping environments that not only stand tall but also enrich lives. Explore our portfolio and witness the transformative power of design that reaches for the sky.
            </p>
          </div>
        </div>

        <div className="service-row" style={{ ...sectionStyle, flexDirection: 'row-reverse' }}>
          <div style={imageContainerStyle}>
            <img src="/images/Overview/12.png" alt="Construction" style={imgStyle} />
          </div>
          <div style={contentStyle}>
            <h2 style={{ color: '#28296F', fontSize: '32px', marginBottom: '20px', fontWeight: 800 }}>Construction</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
              We specialise in the vertical of construction that builds the backbone of industries. Our expertise lies in creating robust and efficient spaces that cater to the unique needs of warehousing and industrial operations. With a keen focus on functionality, durability, and optimised space utilisation, we construct vertical structures that seamlessly integrate with the industrial landscape.
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .service-row {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  )
}

const sectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '50px',
  flexWrap: 'wrap'
};

const imageContainerStyle = { flex: '1', minWidth: '300px' };
const contentStyle = { flex: '1', minWidth: '300px' };

export default ServicesPage