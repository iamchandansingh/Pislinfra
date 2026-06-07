import React from 'react';
import { FiTool, FiClipboard, FiSearch, FiBell, FiMapPin, FiUserCheck } from 'react-icons/fi';

interface Program {
  id: string;
  icon: React.ReactNode;
  iconColor: string;
  title: string;
}

const programs: Program[] = [
  { id: 'ppe', icon: <FiTool size={32} strokeWidth={1.8} />, iconColor: '#2563EB', title: 'PPE Compliance' },
  { id: 'toolbox', icon: <FiClipboard size={32} strokeWidth={1.8} />, iconColor: '#F97316', title: 'Toolbox Talks' },
  { id: 'inspections', icon: <FiSearch size={32} strokeWidth={1.8} />, iconColor: '#22C55E', title: 'Site Inspections & Audits' },
  { id: 'drills', icon: <FiBell size={32} strokeWidth={1.8} />, iconColor: '#EF4444', title: 'Emergency Drills' },
  { id: 'behavior', icon: <FiMapPin size={32} strokeWidth={1.8} />, iconColor: '#84CC16', title: 'Behavior Based Safety' },
  { id: 'reporting', icon: <FiUserCheck size={32} strokeWidth={1.8} />, iconColor: '#A855F7', title: 'Incident Reporting & Learning' },
];

const EHSSafetyPrograms: React.FC = () => {
  return (
    <div style={{ width: '100%', padding: '28px 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #EEF2F7', borderRadius: '18px', padding: '32px' }}>
          
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#052A73', lineHeight: 1.2, letterSpacing: '-0.5px', margin: 0, fontFamily: 'Inter, sans-serif' }}>Our Safety Programs</h2>
          <p style={{ fontSize: '13px', fontWeight: 400, color: '#64748B', lineHeight: 1.5, margin: '8px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Structured programs that promote safety culture and drive zero harm.</p>

          <div className="pc" style={{ marginTop: '24px', backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '14px', overflow: 'hidden', display: 'flex' }}>
            {programs.map((program, index) => (
              <React.Fragment key={program.id}>
                <div className="pi" style={{ flex: 1, padding: '26px 18px', display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: '#FFFFFF', minWidth: 0 }}>
                  <span style={{ color: program.iconColor, display: 'flex', lineHeight: 0, flexShrink: 0 }}>{program.icon}</span>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', lineHeight: 1.3, margin: 0, fontFamily: 'Inter, sans-serif' }}>{program.title}</h3>
                </div>
                {index < programs.length - 1 && <div style={{ width: '1px', backgroundColor: '#EEF2F7', flexShrink: 0 }} />}
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>
      <style>{`@media (max-width: 1200px) { .pc { flex-wrap: wrap; } .pi { min-width: calc(33.33% - 1px); flex: unset; } } @media (max-width: 900px) { .pi { min-width: calc(50% - 1px); } } @media (max-width: 600px) { .pi { min-width: 100%; } }`}</style>
    </div>
  );
};

export default EHSSafetyPrograms;