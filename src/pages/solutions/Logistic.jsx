import React from 'react'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import logisticBg from '../../assets/images/Project/complete/Farrukhnagar,NCR-2/all-cargo-logistics-park-farrukhnagar-hr-2.png'
import { FaPencilRuler, FaHardHat, FaTruck, FaStar, FaCogs, FaChartLine, FaCheckCircle } from 'react-icons/fa'

const Logistic = () => {
  const seoData = {
    contentType: 'page',
    title: 'Logistic Park Development',
    seoTitle: 'Logistic Park Development Solutions | Pislinfra',
    seoDescription: 'Pislinfra specializes in logistic park development across India. Design, procurement & construction of modern warehousing & logistics facilities. 8M+ sq ft delivered.',
    seoKeywords: 'logistic park development, logistics park construction, warehouse logistics, industrial logistics, supply chain infrastructure, logistics hub, Pislinfra',
    slug: 'solutions/logistic',
    canonicalUrl: 'https://pislinfra.com/solutions/logistic',
    ogTitle: 'Logistic Park Development - Warehousing Solutions | Pislinfra',
    ogDescription: 'Expert logistic park development services. Design, procurement & construction of modern logistics facilities.',
    ogImage: 'https://pislinfra.com/images/hero/Service.png',
    ogType: 'website',
    twitterTitle: 'Logistic Park Development | Pislinfra',
    twitterDescription: 'Modern logistics & warehousing solutions across India.',
    twitterImage: 'https://pislinfra.com/images/hero/Service.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Logistics', 'Warehouse', 'Supply Chain', 'Industrial', 'Construction'],
  };

  const services = [
    { icon: FaPencilRuler, title: 'Design', desc: "PISL's design expertise transcends aesthetics, focusing on robust foundations that endure the test of time. Our dedicated architects envision and execute projects that redefine skylines, represent architectural excellence and enrich lives." },
    { icon: FaHardHat, title: 'Construction', desc: 'PISL Infra specialises in constructing industrial backbones with a keen eye on functionality, durability, and space optimisation. Our experienced team ensures meticulous planning and execution, delivering exceptional results. Whether it is large-scale warehouses or specialised facilities, our warehouse contractors contribute to streamlined operations and business growth.' },
    { icon: FaTruck, title: 'Procurement', desc: 'Through smart sourcing, efficient procedures, and high-quality products, PISL\'s procurement sector offers considerable value. We ensure timely and cost-effective procurement with our vast network and industry experience, facilitating the flawless execution of warehousing and industrial initiatives.' },
  ]

  const capabilities = [
    { icon: FaStar, title: 'Cutting-Edge Industrial and Warehousing Spaces', desc: 'PISL sets itself apart by delivering top-notch Grade-A infrastructure tailored for our BTS (Built-To-Suit) clients. Our commitment to excellence permeates every aspect, guaranteeing efficiency and quality in both design and construction for every project.' },
    { icon: FaCogs, title: 'Tech-Driven Innovation', desc: 'PISL welcomes the future through the strategic integration of information technology. We use cutting-edge techniques to expedite procurement procedures and efficiently manage construction timelines. This technological integration allows us to deliver projects with more precision and agility.' },
    { icon: FaCheckCircle, title: 'Precision in Execution', desc: 'At PISL, execution is at the heart of our services. We guarantee our clients a smooth and accurate execution across all of our solutions, ensuring that their investment is maximised and their vision is fulfilled.' },
    { icon: FaChartLine, title: 'Strategic Financial Approach', desc: 'PISL is at the forefront of India\'s thriving warehousing industry, providing not just secure but also profitable financial opportunities. Our dedication to a balanced and prosperous financial perspective is in sync with the industry\'s rapid expansion, assuring a safe investment for our clients.' },
  ]

  return (
    <SolutionLayout
      seoData={seoData}
      hero={{
        title: "Logistic Park Development",
        subtitle: "Modern logistics & warehousing solutions",
        breadcrumb: "Solutions / Logistic",
        bgImage: logisticBg
      }}
      mainFeature={{
        title: <span><span style={{ color: '#0a2a66' }}>Introduction</span></span>,
        text: (
          <p>
            PISL stands as India's premier construction company, renowned for delivering exceptional services across diverse sectors. With a vast portfolio exceeding 8 million sq. ft., PISL embodies enthusiasm, hard work, and integrity. Committed to excellence, we've successfully crafted numerous projects, spanning millions of square metres, over our 13-year journey. Our unwavering ethical standards and strong track record make us a trusted industry leader in logistic park development.
          </p>
        ),
        image: logisticBg
      }}
      grids={[
        {
          title: <span>Services <span style={{ color: '#0a2a66' }}>(Design, Procurement & Construction)</span></span>,
          items: services,
          vertical: true,
          minWidth: '300px'
        },
        {
          title: <span>What Makes Us Different <span style={{ color: '#0a2a66' }}>(Our Capabilities)</span></span>,
          items: capabilities,
          minWidth: '340px'
        }
      ]}
    />
  )
}

export default Logistic