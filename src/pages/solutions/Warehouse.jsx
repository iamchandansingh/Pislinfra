import React from 'react'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import warehouseBg from '../../assets/images/Project/complete/Bilaspur-NCR/amazon-del5-billaspur-hr-5.png'
import { FaBuilding, FaBorderAll, FaHome, FaThLarge, FaCogs, FaMapMarkedAlt, FaStar, FaShieldAlt } from 'react-icons/fa'

const Warehouse = () => {
  const seoData = {
    contentType: 'page',
    title: 'Warehouse Contractors',
    seoTitle: 'Warehouse',
    seoDescription: 'Pislinfra is a leading warehouse contractor in India. Expert design-build solutions for industrial storage & distribution centers. Cost-effective warehouse construction.',
    seoKeywords: 'warehouse contractors, warehouse construction, industrial storage, distribution center, design build warehouse, warehouse design, logistics facility, Pislinfra',
    slug: 'solutions/warehouse',
    canonicalUrl: 'https://pislinfra.com/solutions/warehouse',
    ogTitle: 'Warehouse Contractors - Industrial Storage Solutions | Pislinfra',
    ogDescription: 'Leading warehouse contractor in India. Design-build solutions for storage & distribution centers.',
    ogImage: 'https://pislinfra.com/images/hero/Service.png',
    ogType: 'website',
    twitterTitle: 'Warehouse Contractors | Pislinfra',
    twitterDescription: 'Expert warehouse construction & design-build solutions.',
    twitterImage: 'https://pislinfra.com/images/hero/Service.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Warehouse', 'Construction', 'Design Build', 'Industrial', 'Storage', 'Logistics'],
  };

  const designConsiderations = [
    { icon: FaBuilding, title: '1. Floor Systems', desc: 'Choosing the right warehouse floor system necessitates an understanding of concrete kinds, site dynamics, and how a space will be used. Concrete floors can be reinforced or unreinforced, freezer/cooler compatible, shrinkage compensating, and tailored to the user\'s floor loads and equipment route requirements.' },
    { icon: FaBorderAll, title: '2. Exterior Wall Types', desc: 'Selecting warehouse exterior walls considers factors like size and schedule. Large facilities often opt for on-site poured concrete panels, which are cost-effective and have versatile finishes. Precast panels, produced offsite, suit tight schedules and are ideal for installation before the floor slab.' },
    { icon: FaHome, title: '3. Building Structure', desc: 'In planning a warehouse, factors like roof loads, wall cladding, and storage heights must be factored in. Engineered steel joists, rafters, and columns can span considerable distances and support substantial roof loads. For tall storage needs, rack-supported structures optimise space.' },
    { icon: FaThLarge, title: '4. Bay Sizing', desc: 'Bay sizing and rack design are critical elements in the warehouse building. The width and clear height of the structure are used to determine forklift travel pathways, aisle widths and racking layouts. A skilled warehouse contractor is critical to guaranteeing successful construction.' },
    { icon: FaCogs, title: '5. Building Systems', desc: 'Decisions on dock types, sizes, and specifications have significance throughout the design phase. The functional requirements dictate whether mechanical or hydraulic docks are used. Electrical service, HVAC, fire protection, and lighting are all factors to consider with strict adherence to code standards.' },
    { icon: FaMapMarkedAlt, title: '6. Site Design & Selection', desc: 'Guidelines dictate parking ratios, dock size, and office space distribution. PISL\'s expertise guarantees efficient and functional space utilisation. Our site feasibility services empower clients to make informed decisions by providing cost information and aiding in schedule considerations before construction.' },
  ]

  const advantages = [
    { icon: FaStar, title: 'Design-Build Strategy', desc: 'PISL\'s distinctive design-build strategy eliminates the risk of upfront costs by providing customers with a complimentary preliminary design.' },
    { icon: FaShieldAlt, title: 'Integrated Project Delivery', desc: 'Our integrated project delivery strategy unifies design and construction quality, capital expenditure management, and schedule adherence under a single point of contact.' },
    { icon: FaCogs, title: 'Risk Minimisation', desc: 'Our team of construction experts deeply understands each business, strategically minimising risk exposure and delivering optimal value.' },
  ]

  return (
    <SolutionLayout
      seoData={seoData}
      hero={{
        title: "Warehouse Contractors",
        subtitle: "State-of-the-art storage & distribution centers",
        breadcrumb: "Solutions / Warehouse",
        bgImage: warehouseBg
      }}
      mainFeature={{
        title: <span>Design-Build <span style={{ color: '#0a2a66' }}>Solutions</span></span>,
        text: (
          <p>
            PISL stands as the leading warehouse contractor and distribution space nationwide, serving as a reliable contractor for clients nationwide. We are highly competent in offering the best and most cost-effective warehouse design and construction solutions for our clients. This holds true whether it's speculative developments or expansive distribution centres catering to e-commerce end-users, Consumer Packaged Goods (CPGs), and Third-Party Logistics (3PL) providers.
          </p>
        ),
        image: warehouseBg
      }}
      grids={[
        {
          title: <span>Construction <span style={{ color: '#0a2a66' }}>Considerations</span></span>,
          description: "When undertaking warehouse construction, numerous warehouse design and construction intricacies must be taken into account to achieve a successful development. Working with an experienced contractor who is actively involved in the design and early stages of a project ensures optimal results.",
          items: designConsiderations,
          minWidth: '400px'
        },
        {
          title: <span>The PISL <span style={{ color: '#0a2a66' }}>Infra Advantage</span></span>,
          items: advantages,
          vertical: true,
          cardBg: '#fff5f0',
          cardBorder: '#ffd5c2',
          iconBg: '#ff8755',
          iconColor: 'white',
          minWidth: '300px'
        }
      ]}
    />
  )
}

export default Warehouse