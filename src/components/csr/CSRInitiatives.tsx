import React from 'react';

const givingBackCards = [
  { 
    id: 'winter', 
    title: 'Sharing Happiness Through Winter Support', 
    description: 'Essential winter support initiatives helping workers and communities stay safe, warm, and cared for during challenging weather conditions.', 
    image: '/images/CSR/Happiness.jpg', 
    imageLeft: true 
  },
  { 
    id: 'heroes', 
    title: 'Supporting Front-Line Heroes', 
    description: 'Community outreach programs dedicated to supporting frontline personnel and appreciating their commitment towards public safety and service.', 
    image: '/images/awards/Safety-Excellence-Awards-Adani-(2).png' 
  },
];

const environmentCards = [
  { 
    id: 'green', 
    title: 'Promoting Greener Tomorrow', 
    description: 'Environmental sustainability initiatives focused on plantation drives, green development, and maintaining healthier project surroundings.', 
    image: '/images/CSR/CSR-(4).png', 
    imageLeft: true 
  },
  { 
    id: 'health', 
    title: 'Health & Safety Precautions', 
    description: 'Comprehensive health and safety measures implemented to create safer, cleaner, and healthier workplace environments.', 
    image: '/images/EHS/PPE-Training-Session.png' 
  },
];

const celebrationCards = [
  { 
    id: 'independence', 
    title: 'Independence Day Celebration', 
    description: 'Celebrating national pride with flag hoisting ceremonies, cultural performances, and team gatherings across all project sites.', 
    image: '/images/CSR/Independence.jpeg' 
  },
  { 
    id: 'birthday', 
    title: 'Team Birthday Celebration', 
    description: 'Monthly birthday celebrations bringing teams together to share joy, cake, and memorable moments with colleagues.', 
    image: '/images/CSR/Birthday.jpeg' 
  },
  { 
    id: 'corporate', 
    title: 'Corporate Event Celebration', 
    description: 'Annual corporate events, award ceremonies, and team-building activities that strengthen our organizational culture and values.', 
    image: '/images/CSR/Corporate.png' 
  },
];

const SectionTitle = ({ title }) => (
  <div style={{ textAlign: 'center' }}>
    <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#052A73', fontFamily: 'Inter, sans-serif', margin: 0 }}>{title}</h2>
  </div>
);

const CSRInitiatives = () => {
  return (
    <div style={{ width: '100%', padding: '30px 0 50px', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '45px' }}>
          <SectionTitle title="GIVING IT BACK TO THE SOCIETY" />
          <div className="init-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '24px' }}>
            {givingBackCards.map((card) => (
              <div key={card.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '14px', overflow: 'hidden', display: 'flex', height: '180px' }}>
                {card.imageLeft ? (
                  <>
                    <div style={{ width: '40%', minWidth: '40%' }}>
                      <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#052A73', lineHeight: 1.3, margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>{card.title}</h3>
                      <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5, margin: 0, fontFamily: 'Inter, sans-serif' }}>{card.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#052A73', lineHeight: 1.3, margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>{card.title}</h3>
                      <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5, margin: 0, fontFamily: 'Inter, sans-serif' }}>{card.description}</p>
                    </div>
                    <div style={{ width: '40%', minWidth: '40%' }}>
                      <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '45px' }}>
          <SectionTitle title="ENVIRONMENT & HEALTH INITIATIVES" />
          <div className="init-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '24px' }}>
            {environmentCards.map((card) => (
              <div key={card.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '14px', overflow: 'hidden', display: 'flex', height: '180px' }}>
                {card.imageLeft ? (
                  <>
                    <div style={{ width: '40%', minWidth: '40%' }}>
                      <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#052A73', lineHeight: 1.3, margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>{card.title}</h3>
                      <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5, margin: 0, fontFamily: 'Inter, sans-serif' }}>{card.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#052A73', lineHeight: 1.3, margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>{card.title}</h3>
                      <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5, margin: 0, fontFamily: 'Inter, sans-serif' }}>{card.description}</p>
                    </div>
                    <div style={{ width: '40%', minWidth: '40%' }}>
                      <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle title="CELEBRATIONS AT PISL" />
          <div className="init-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '24px' }}>
            {celebrationCards.map((card) => (
              <div key={card.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '100%', height: '220px', borderBottom: '3px solid #ff8755' }}>
                  <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#052A73', lineHeight: 1.3, margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>{card.title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0, fontFamily: 'Inter, sans-serif' }}>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <style>{`@media (max-width: 1024px) { .init-grid-2 { grid-template-columns: 1fr !important; } .init-grid-3 { grid-template-columns: repeat(2, 1fr) !important; } } @media (max-width: 640px) { .init-grid-3 { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default CSRInitiatives;