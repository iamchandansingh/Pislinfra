import React from 'react';
import { FiShield, FiFeather, FiHeart, FiBell, FiArrowRight } from 'react-icons/fi';

interface Pillar { id: string; icon: React.ReactNode; iconColor: string; title: string; description: string; }

const pillars: Pillar[] = [
  { id: 'workplace', icon: <FiShield size={36} />, iconColor: '#1E88E5', title: 'Workplace Safety', description: 'Ensuring the safety of every individual through robust processes, training and behavioral safety programs.' },
  { id: 'environmental', icon: <FiFeather size={36} />, iconColor: '#22C55E', title: 'Environmental Stewardship', description: 'Minimizing our environmental footprint through responsible resource use and pollution prevention.' },
  { id: 'health', icon: <FiHeart size={36} />, iconColor: '#F97316', title: 'Health & Well-being', description: 'Promoting physical and mental well-being of our workforce and ensuring a healthy work environment.' },
  { id: 'emergency', icon: <FiBell size={36} />, iconColor: '#A855F7', title: 'Emergency Preparedness', description: 'Being prepared for emergencies with well-defined plans, drills and rapid response systems.' },
];

const EHSPillarsAndPrograms: React.FC = () => {
  return (
    <div style={{ width: '100%', padding: '20px 0 30px', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        
        <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#052A73', letterSpacing: '-1px', lineHeight: 1.1, margin: 0, fontFamily: 'Inter, sans-serif' }}>Our EHS Pillars</h2>
        <p style={{ fontSize: '15px', fontWeight: 400, color: '#64748B', lineHeight: 1.6, margin: '8px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Four strong pillars that drive our EHS performance.</p>
        
        <div className="pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '28px' }}>
          {pillars.map((pillar) => (
            <div key={pillar.id} style={{
              backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '18px',
              padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                <span style={{ color: pillar.iconColor, display: 'flex', lineHeight: 0, marginTop: '2px', flexShrink: 0 }}>{pillar.icon}</span>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#052A73', lineHeight: 1.3, margin: '0 0 6px 0', fontFamily: 'Inter, sans-serif' }}>{pillar.title}</h3>
                  <p style={{ fontSize: '14px', fontWeight: 400, color: '#64748B', lineHeight: 1.7, margin: 0, fontFamily: 'Inter, sans-serif' }}>{pillar.description}</p>
                </div>
              </div>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#052A73', fontSize: '14px', fontWeight: 700, textDecoration: 'none', fontFamily: 'Inter, sans-serif', paddingLeft: '50px' }}>
                Learn more <FiArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>

      </div>
      <style>{`@media (max-width: 1200px) { .pillars-grid { grid-template-columns: repeat(2, 1fr) !important; } } @media (max-width: 640px) { .pillars-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default EHSPillarsAndPrograms;