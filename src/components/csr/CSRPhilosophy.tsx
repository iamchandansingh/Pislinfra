import React from 'react';
import { FiDownload } from 'react-icons/fi';

const CSRPhilosophy: React.FC = () => {
  return (
    <div style={{ width: '100%', padding: '50px 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        
        <div className="phil-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '50px',
          alignItems: 'center',
        }}>
          
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: '#FF6B35', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>Our Philosophy</span>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#052A73', lineHeight: 1.15, letterSpacing: '-1px', margin: '10px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Creating Sustainable<br />Communities</h2>
            <p style={{ fontSize: '14px', fontWeight: 400, color: '#64748B', lineHeight: 1.7, maxWidth: '500px', margin: '18px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Our CSR philosophy is built on the foundation of sustainable development, inclusive growth, and social equity. We focus on initiatives that empower communities, enhance quality of life, and contribute to a better, greener future.</p>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', height: '46px', padding: '0 22px', backgroundColor: '#FF6B35', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginTop: '22px' }}>
              <FiDownload size={14} /> Download CSR Policy
            </button>
          </div>

          <div style={{ 
            height: '340px', 
            width: '100%',
            maxWidth: '100%',
            borderRadius: '14px', 
            overflow: 'hidden', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
            backgroundImage: 'url(https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
          }} />

        </div>

      </div>
      <style>{`@media (max-width: 1024px) { .phil-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
    </div>
  );
};

export default CSRPhilosophy;