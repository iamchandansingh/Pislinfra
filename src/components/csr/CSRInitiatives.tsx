import React from 'react';

const getImageUrl = (img) => {
  if (!img) return null;
  return img.url?.startsWith('http') ? img.url : `http://127.0.0.1:1337${img.url}`;
};

const SectionTitle = ({ title }) => (
  <div style={{ textAlign: 'center' }}>
    <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#052A73', fontFamily: 'Inter, sans-serif', margin: 0 }}>{title}</h2>
  </div>
);

const CSRInitiatives = ({ givingBackCards, envCards, celebCards }) => {
  const gBackCards = givingBackCards && givingBackCards.length > 0 ? givingBackCards : [];
  const environmentCards = envCards && envCards.length > 0 ? envCards : [];
  const celebrationCards = celebCards && celebCards.length > 0 ? celebCards : [];

  return (
    <div style={{ width: '100%', padding: '30px 0 50px', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        
        {gBackCards.length > 0 && (
          <div style={{ marginBottom: '45px' }}>
            <SectionTitle title="GIVING IT BACK TO THE SOCIETY" />
            <div className="init-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '24px' }}>
              {gBackCards.map((card, idx) => (
                <div key={card.id || idx} style={{ backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '14px', overflow: 'hidden', display: 'flex', height: '180px' }}>
                  {card.imageLeft ? (
                    <>
                      <div style={{ width: '40%', minWidth: '40%' }}>
                        <img src={getImageUrl(card.image)} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                        <img src={getImageUrl(card.image)} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '45px' }}>
          <SectionTitle title="ENVIRONMENT & HEALTH INITIATIVES" />
          <div className="init-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '24px' }}>
            {environmentCards.map((card, idx) => (
              <div key={card.id || idx} style={{ backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '14px', overflow: 'hidden', display: 'flex', height: '180px' }}>
                {card.imageLeft ? (
                  <>
                    <div style={{ width: '40%', minWidth: '40%' }}>
                      <img src={getImageUrl(card.image)} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                      <img src={getImageUrl(card.image)} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle title="CELEBRATIONS AT PISLINFRA" />
          <div className="init-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '24px' }}>
            {celebrationCards.map((card, idx) => (
              <div key={card.id || idx} style={{ backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '100%', height: '220px', borderBottom: '3px solid #ff8755' }}>
                  <img src={getImageUrl(card.image)} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
