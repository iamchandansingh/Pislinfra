import React from 'react';

const ContactMapSection: React.FC = () => {
  return (
    <section style={{ width: '100%', marginTop: '40px', marginBottom: 0, paddingBottom: 0 }}>
      <div style={{
        width: '95%',
        maxWidth: '1400px',
        margin: '0 auto',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}>
        
        <div 
          style={{
            width: '100%',
            height: '300px',
            overflow: 'hidden',
            borderRadius: '20px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
          }}
          className="map-container"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.3815692500916!2d77.0426737!3d28.437911900000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18fae8f0defd%3A0x55b9cef2752f0172!2sPragati%20Infra%20Solutions%20Pvt.%20Ltd!5e0!3m2!1sen!2sin!4v1778654882506!5m2!1sen!2sin"
            style={{ border: 0, display: 'block', width: '100%', height: '100%' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="PISL Infra Office Location"
          />
        </div>

      </div>

      {/* Responsive */}
      <style>{`
        @media (min-width: 640px) {
          .map-container {
            height: 380px;
          }
        }
        @media (min-width: 1024px) {
          .map-container {
            height: 420px;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactMapSection;