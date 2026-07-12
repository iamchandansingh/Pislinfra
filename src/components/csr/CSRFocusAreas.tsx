import React from 'react';
import { FiBookOpen, FiHeart, FiFeather, FiUsers } from 'react-icons/fi';

const focusAreas = [
  {
    id: 'education',
    icon: <FiBookOpen size={26} />,
    iconColor: '#6366F1',
    title: 'Education',
    description: 'Empowering children and youth through quality education and skill development programs.',
    image: '/images/CSR/Education.png',
  },
  {
    id: 'health',
    icon: <FiHeart size={26} />,
    iconColor: '#EC4899',
    title: 'Health & Well-being',
    description: 'Improving healthcare accessibility and promoting well-being in communities.',
    image: '/images/CSR/Health.jpeg',
  },
  {
    id: 'environment',
    icon: <FiFeather size={26} />,
    iconColor: '#22C55E',
    title: 'Environment',
    description: 'Promoting sustainability through green initiatives, conservation and responsible practices.',
    image: '/images/CSR/CSR-(7).png',
  },
  {
    id: 'community',
    icon: <FiUsers size={26} />,
    iconColor: '#F97316',
    title: 'Community Development',
    description: 'Building stronger communities through infrastructure, livelihood and welfare programs.',
    image: '/images/CSR/Community.jpeg',
  },
];

const CSRFocusAreas = () => {
  return (
    <div style={{ width: '100%', padding: '30px 0 50px', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        
        <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#052A73', textAlign: 'center', lineHeight: 1.15, margin: '0 0 36px 0', fontFamily: 'Inter, sans-serif' }}>Areas Where We Make A Difference</h2>

        <div className="focus-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {focusAreas.map((area) => (
            <div key={area.id} style={{
              backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '16px',
              overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column',
            }}>
              
              <div style={{ padding: '20px 16px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: area.iconColor, display: 'flex', lineHeight: 0 }}>{area.icon}</span>
                  </div>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#052A73', textAlign: 'center', margin: '0 0 10px 0', fontFamily: 'Inter, sans-serif' }}>{area.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, textAlign: 'center', margin: 0, fontFamily: 'Inter, sans-serif' }}>{area.description}</p>
              </div>

              <div style={{ padding: '0 16px 16px' }}>
                <img
                  src={area.image}
                  alt={area.title}
                  style={{
                    width: '100%',
                    height: '180px',
                    borderRadius: '14px',
                    objectFit: 'cover',
                  }}
                />
              </div>

            </div>
          ))}
        </div>

      </div>
      <style>{`@media (max-width: 1200px) { .focus-grid { grid-template-columns: repeat(2, 1fr) !important; } } @media (max-width: 640px) { .focus-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default CSRFocusAreas;