import React, { useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import clientsData from '../../data/clientsData';

const CertificationsAndEHSAction: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const galleryItems = [
    { id: '1', title: 'Site Safety Inspection', image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '2', title: 'PPE Training Session', image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '3', title: 'Fire Safety Drill', image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '4', title: 'Emergency Mock Drill', image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  const allClients = ['Adani', 'Reliance Industries Limited', 'AM/NS India (ArcelorMittal Nippon Steel India)', 'Flipkart', 'Amazon', 'DHL'];
  const clientLogos = allClients.map(name => clientsData.find(c => c.name === name)).filter(Boolean);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => prev + 3 >= clientLogos.length ? 0 : prev + 3);
    }, 3000);
    return () => clearInterval(interval);
  }, [clientLogos.length]);

  const visibleClients = clientLogos.slice(currentSlide, currentSlide + 3);
  if (visibleClients.length < 3) {
    visibleClients.push(...clientLogos.slice(0, 3 - visibleClients.length));
  }

  return (
    <div style={{ width: '100%', padding: '20px 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        
        <div className="split" style={{ display: 'grid', gridTemplateColumns: '44% 56%', gap: '24px', alignItems: 'stretch' }}>
          
          {/* LEFT */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#052A73', lineHeight: 1.2, margin: 0, fontFamily: 'Inter, sans-serif' }}>Certifications & Standards</h2>
            <p style={{ fontSize: '12px', fontWeight: 400, color: '#64748B', lineHeight: 1.5, margin: '6px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Aligned with global EHS standards and best practices.</p>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {visibleClients.map((client: any, i: number) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #EEF2F7', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '65px' }}>
                      <img src={client.logo} alt={client.name} style={{ maxWidth: '80%', maxHeight: '40px', objectFit: 'contain' }} />
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#1E293B', margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>{client.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', height: '40px', padding: '0 18px',
              border: '2px solid #DCE7F5', backgroundColor: '#FFFFFF', borderRadius: '10px',
              fontSize: '12px', fontWeight: 600, color: '#052A73', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', marginTop: '16px', alignSelf: 'flex-start',
            }}>
              View All Certifications <FiArrowRight size={12} />
            </button>
          </div>

          {/* RIGHT */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#052A73', lineHeight: 1.2, margin: 0, fontFamily: 'Inter, sans-serif' }}>EHS in Action</h2>
            <p style={{ fontSize: '12px', fontWeight: 400, color: '#64748B', lineHeight: 1.5, margin: '6px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Building a strong safety culture on every site.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '18px' }}>
              {galleryItems.map(item => (
                <div key={item.id}>
                  <div style={{ height: '160px', borderRadius: '10px', overflow: 'hidden', backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#1E293B', lineHeight: 1.3, margin: '6px 0 0 0', fontFamily: 'Inter, sans-serif' }}>{item.title}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
      <style>{`@media (max-width: 1100px) { .split { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default CertificationsAndEHSAction;