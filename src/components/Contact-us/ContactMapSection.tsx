import React, { useState } from 'react';

const mapUrls = {
  pisl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4111.383109649327!2d77.04011967608486!3d28.437951575771567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d186f05748af3%3A0xbaa90ee047826118!2sPISL!5e1!3m2!1sen!2sin!4v1783320683329!5m2!1sen!2sin",
  pragati: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8222.886710135568!2d77.03643219994618!3d28.436401233687548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18fae8f0defd%3A0x55b9cef2752f0172!2sPragati%20Infra%20Solutions%20Pvt.%20Ltd!5e1!3m2!1sen!2sin!4v1783320644153!5m2!1sen!2sin"
};

const ContactMapSection = () => {
  const [activeMap, setActiveMap] = useState('pisl');

  return (
    <section className="contact-map-wrapper" style={{ width: '100%', margin: 0, padding: 0, marginTop: 0, paddingTop: 0, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '95%', maxWidth: '1370px', margin: '0 auto', padding: 0, marginTop: 0, paddingTop: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
        
        {/* Map Container */}
        <div className="map-container" style={{
          position: 'relative', width: '100%', height: '280px', overflow: 'hidden',
          borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(15,23,42,0.06)', marginTop: 0
        }}>
          {/* Toggle Buttons */}
          <div style={{
            position: 'absolute', top: '16px', right: '16px', zIndex: 10,
            display: 'flex', gap: '8px', backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '6px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(4px)'
          }}>
            <button 
              onClick={() => setActiveMap('pisl')}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.3s', backgroundColor: activeMap === 'pisl' ? '#28286e' : 'transparent',
                color: activeMap === 'pisl' ? '#FFFFFF' : '#4b5563'
              }}
            >
              PISL
            </button>
            <button 
              onClick={() => setActiveMap('pragati')}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.3s', backgroundColor: activeMap === 'pragati' ? '#28286e' : 'transparent',
                color: activeMap === 'pragati' ? '#FFFFFF' : '#4b5563'
              }}
            >
              Pragati Infra
            </button>
          </div>

          <iframe
            src={mapUrls[activeMap]}
            style={{ border: 0, display: 'block', width: '100%', height: '100%' }}
            allowFullScreen 
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title={`${activeMap === 'pisl' ? 'PISL' : 'Pragati Infra Solutions'} Office Location`}
          />
        </div>

      </div>

      <style>{`
        @media (max-width: 767px) {
          .contact-map-wrapper { padding-bottom: 24px !important; }
        }
        @media (min-width: 640px) { 
          .map-container { height: 350px !important; }
        }
        @media (min-width: 992px) { 
          .map-container { height: 450px !important; }
          .maps-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default ContactMapSection;