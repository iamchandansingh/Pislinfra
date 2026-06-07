import React from 'react';
import { FiBookOpen, FiHeart, FiFeather, FiUsers } from 'react-icons/fi';

interface FocusArea {
  id: string;
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  image: string;
}

const focusAreas: FocusArea[] = [
  {
    id: 'education',
    icon: <FiBookOpen size={26} />,
    iconColor: '#6366F1',
    title: 'Education',
    description: 'Empowering children and youth through quality education and skill development programs.',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'health',
    icon: <FiHeart size={26} />,
    iconColor: '#EC4899',
    title: 'Health & Well-being',
    description: 'Improving healthcare accessibility and promoting well-being in communities.',
    image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'environment',
    icon: <FiFeather size={26} />,
    iconColor: '#22C55E',
    title: 'Environment',
    description: 'Promoting sustainability through green initiatives, conservation and responsible practices.',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'community',
    icon: <FiUsers size={26} />,
    iconColor: '#F97316',
    title: 'Community Development',
    description: 'Building stronger communities through infrastructure, livelihood and welfare programs.',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const CSRFocusAreas: React.FC = () => {
  return (
    <div style={{ width: '100%', padding: '30px 0 50px', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: '#FF6B35', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>Our Focus Areas</span>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#052A73', textAlign: 'center', lineHeight: 1.15, margin: '10px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Areas Where We Make A Difference</h2>
          <div style={{ width: '50px', height: '3px', backgroundColor: '#FF6B35', borderRadius: '999px', margin: '14px auto 0' }} />
        </div>

        <div className="focus-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '36px' }}>
          {focusAreas.map((area) => (
            <div key={area.id} style={{
              backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '16px',
              overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column',
            }}>
              
              {/* Icon + Title + Description */}
              <div style={{ padding: '20px 16px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: area.iconColor, display: 'flex', lineHeight: 0 }}>{area.icon}</span>
                  </div>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#052A73', textAlign: 'center', margin: '0 0 10px 0', fontFamily: 'Inter, sans-serif' }}>{area.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, textAlign: 'center', margin: 0, fontFamily: 'Inter, sans-serif' }}>{area.description}</p>
              </div>

              {/* Separate Image Container - ROUND */}
              <div style={{ padding: '0 16px 16px' }}>
                <div style={{
                  width: '100%',
                  height: '180px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  backgroundImage: `url(${area.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />
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