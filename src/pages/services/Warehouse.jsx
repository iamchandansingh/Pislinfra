import PageHero from '../../components/hero/PageHero'
import { FaBuilding, FaBorderAll, FaHome, FaThLarge, FaCogs, FaMapMarkedAlt, FaStar, FaShieldAlt } from 'react-icons/fa'

const Warehouse = () => {
  const designConsiderations = [
    {
      icon: FaBuilding,
      title: '1. Floor Systems',
      desc: 'Choosing the right warehouse floor system necessitates an understanding of concrete kinds, site dynamics, and how a space will be used. Concrete floors can be reinforced or unreinforced, freezer/cooler compatible, shrinkage compensating, and tailored to the user\'s floor loads and equipment route requirements.'
    },
    {
      icon: FaBorderAll,
      title: '2. Exterior Wall Types',
      desc: 'Selecting warehouse exterior walls considers factors like size and schedule. Large facilities often opt for on-site poured concrete panels, which are cost-effective and have versatile finishes. Precast panels, produced offsite, suit tight schedules and are ideal for installation before the floor slab.'
    },
    {
      icon: FaHome,
      title: '3. Building Structure',
      desc: 'In planning a warehouse, factors like roof loads, wall cladding, and storage heights must be factored in. Engineered steel joists, rafters, and columns can span considerable distances and support substantial roof loads. For tall storage needs, rack-supported structures optimise space.'
    },
    {
      icon: FaThLarge,
      title: '4. Bay Sizing',
      desc: 'Bay sizing and rack design are critical elements in the warehouse building. The width and clear height of the structure are used to determine forklift travel pathways, aisle widths and racking layouts. A skilled warehouse contractor is critical to guaranteeing successful construction.'
    },
    {
      icon: FaCogs,
      title: '5. Building Systems',
      desc: 'Decisions on dock types, sizes, and specifications have significance throughout the design phase. The functional requirements dictate whether mechanical or hydraulic docks are used. Electrical service, HVAC, fire protection, and lighting are all factors to consider with strict adherence to code standards.'
    },
    {
      icon: FaMapMarkedAlt,
      title: '6. Site Design & Selection',
      desc: 'Guidelines dictate parking ratios, dock size, and office space distribution. PISL\'s expertise guarantees efficient and functional space utilisation. Our site feasibility services empower clients to make informed decisions by providing cost information and aiding in schedule considerations before construction.'
    },
  ]

  const advantages = [
    {
      icon: FaStar,
      title: 'Design-Build Strategy',
      desc: 'PISL\'s distinctive design-build strategy eliminates the risk of upfront costs by providing customers with a complimentary preliminary design.'
    },
    {
      icon: FaShieldAlt,
      title: 'Integrated Project Delivery',
      desc: 'Our integrated project delivery strategy unifies design and construction quality, capital expenditure management, and schedule adherence under a single point of contact.'
    },
    {
      icon: FaCogs,
      title: 'Risk Minimisation',
      desc: 'Our team of construction experts deeply understands each business, strategically minimising risk exposure and delivering optimal value.'
    },
  ]

  return (
    <div>
      <PageHero 
        title="Warehouse Contractors" 
        subtitle="State-of-the-art storage & distribution centers"
        breadcrumb="Services / Warehouse"
        bgImage="https://images.pexels.com/photos/3777190/pexels-photo-3777190.jpeg?auto=compress&cs=tinysrgb&w=1200"
      />
      
      <section style={{ padding: '80px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Design-Build Solutions + Image */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '60px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px' }}>
                Design-Build <span style={{ color: '#ff8755' }}>Solutions</span>
              </h2>
              <div style={{ width: '50px', height: '3px', backgroundColor: '#ff8755', marginBottom: '20px' }}></div>
              <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.9' }}>
                PISL stands as the leading warehouse contractor and distribution space nationwide, serving as a reliable contractor for clients nationwide. We are highly competent in offering the best and most cost-effective warehouse design and construction solutions for our clients. This holds true whether it's speculative developments or expansive distribution centres catering to e-commerce end-users, Consumer Packaged Goods (CPGs), and Third-Party Logistics (3PL) providers.
              </p>
            </div>
            <div style={{ 
              borderRadius: '16px', overflow: 'hidden', height: '380px',
              backgroundImage: 'url(https://images.pexels.com/photos/3777190/pexels-photo-3777190.jpeg?auto=compress&cs=tinysrgb&w=600)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: '4px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}></div>
          </div>

          {/* Warehouse Construction Considerations */}
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '16px', textAlign: 'center' }}>
              Construction <span style={{ color: '#ff8755' }}>Considerations</span>
            </h2>
            <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto 40px', textAlign: 'center' }}>
              When undertaking warehouse construction, numerous warehouse design and construction intricacies must be taken into account to achieve a successful development. Working with an experienced contractor who is actively involved in the design and early stages of a project ensures optimal results.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              {designConsiderations.map((item, i) => (
                <div key={i} style={{
                  padding: '28px', backgroundColor: '#fafbfc',
                  borderRadius: '12px', border: '1px solid #f0f0f0',
                  borderLeft: '4px solid #ff8755',
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    backgroundColor: '#fff5f0', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <item.icon style={{ color: '#ff8755', fontSize: '18px' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '6px' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PISL Advantage */}
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '8px', textAlign: 'center' }}>
              The PISL <span style={{ color: '#ff8755' }}>Infra Advantage</span>
            </h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: '#ff8755', margin: '0 auto 40px' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {advantages.map((adv, i) => (
                <div key={i} style={{
                  padding: '32px', backgroundColor: '#fff5f0',
                  borderRadius: '12px', border: '1px solid #ffd5c2',
                  textAlign: 'center', borderBottom: '4px solid #ff8755',
                }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '14px',
                    backgroundColor: '#ff8755', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <adv.icon style={{ color: 'white', fontSize: '24px' }} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '10px' }}>
                    {adv.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    {adv.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Warehouse