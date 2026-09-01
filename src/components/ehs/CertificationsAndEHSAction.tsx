import React, { useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import clientsData from '../../data/clientsData';

const CertificationsAndEHSAction = ({ gallery, title }) => {
  const activeGallery = gallery && gallery.length > 0 ? gallery.map((g, i) => ({ id: g.id || i, title: g.title, image: g.image?.url ? "" + g.image.url : g.image?.data?.attributes?.url ? "" + g.image.data.attributes.url : g.image || galleryItems[i]?.image || "" })) : galleryItems;
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const galleryItems = [
  { id: '1', title: 'PPE Training Session',   image: '/images/EHS/PPE-Training-Session.png' },
  { id: '2', title: 'Site Safety Inspection', image: '/images/EHS/Site-Safety-Inspection.png' },
  { id: '3', title: 'Fire Safety Drill',      image: '/images/EHS/Fire-Safety-Drill.png' },
  { id: '4', title: 'Emergency Mock Drill',   image: '/images/EHS/Emergency-Mock-Drill.png' },
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
      <style>{`
        .cert-clients-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .ehs-gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 18px;
        }
        @media (max-width: 1100px) { 
          .split { grid-template-columns: 1fr !important; } 
        }
        @media (max-width: 768px) {
          .ehs-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
        @media (max-width: 480px) {
          .ehs-gallery-grid {
            grid-template-columns: 1fr;
          }
          .cert-clients-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        
        <div className="split" style={{ display: 'grid', gridTemplateColumns: '44% 56%', gap: '24px', alignItems: 'stretch' }}>
          
          {/* LEFT */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#052A73', lineHeight: 1.2, margin: 0, fontFamily: 'Inter, sans-serif' }}>Certifications & Standards</h2>
            <p style={{ fontSize: '12px', fontWeight: 400, color: '#64748B', lineHeight: 1.5, margin: '6px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Aligned with global EHS standards and best practices.</p>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '16px' }}>
              <div className="cert-clients-grid">
                {visibleClients.map((client, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #EEF2F7', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '65px' }}>
                      <img src={client.logo} alt={client.name} style={{ maxWidth: '80%', maxHeight: '40px', objectFit: 'contain' }} />
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#1E293B', margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>{client.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/about/awards')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', height: '40px', padding: '0 18px',
                border: '2px solid #DCE7F5', backgroundColor: '#FFFFFF', borderRadius: '10px',
                fontSize: '12px', fontWeight: 600, color: '#052A73', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', marginTop: '16px', alignSelf: 'flex-start',
              }}
            >
              View All Certifications <FiArrowRight size={12} />
            </button>
          </div>

          {/* RIGHT */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#052A73', lineHeight: 1.2, margin: 0, fontFamily: 'Inter, sans-serif' }}>EHS in Action</h2>
            <p style={{ fontSize: '12px', fontWeight: 400, color: '#64748B', lineHeight: 1.5, margin: '6px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Building a strong safety culture on every site.</p>
            
            <div className="ehs-gallery-grid">
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
    </div>
  );
};

export default CertificationsAndEHSAction;