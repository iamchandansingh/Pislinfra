import React, { useState } from 'react';

interface YearData {
  year: string;
  total: number;
  description: string;
  color: string;
}

interface AwardsYearSidebarProps {
  onYearClick?: (year: string) => void;
  activeYear?: string;
}

const yearsData: YearData[] = [
  { year: '2025', total: 10, description: 'Remarkable achievements and milestones.', color: '#22C55E' },
  { year: '2024', total: 9, description: 'Celebrating our progress and achievements.', color: '#3B82F6' },
  { year: '2023', total: 8, description: 'Recognitions that reinforce our leadership.', color: '#8B5CF6' },
  { year: '2022', total: 7, description: 'Milestones that mark our growth and impact.', color: '#F97316' },
];

const AwardsYearSidebar: React.FC<AwardsYearSidebarProps> = ({ onYearClick, activeYear = '2025' }) => {
  const totalAllAwards = yearsData.reduce((sum, y) => sum + y.total, 0);
  const [clickedYear, setClickedYear] = useState<string | null>(null);

  const handleClick = (year: string) => {
    if (onYearClick) onYearClick(year);
    setClickedYear(year);
    setTimeout(() => setClickedYear(null), 600);
    
    setTimeout(() => {
      const el = document.getElementById(`year-${year}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - 80;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div style={{ width: '260px', position: 'sticky', top: '120px', height: 'fit-content', flexShrink: 0 }} className="year-sidebar">
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '20px', padding: '24px', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
        
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#052A73', margin: 0, fontFamily: 'Inter, sans-serif' }}>Awards Timeline</h3>
        <p style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4, margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Explore our recognitions across the years.</p>

        <div style={{ marginTop: '20px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '28px', top: 0, bottom: 0, width: '2px', backgroundColor: '#E2E8F0', borderRadius: '999px', zIndex: 0 }} className="timeline-line" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {yearsData.map((yearData) => {
              const isActive = activeYear === yearData.year;
              const justClicked = clickedYear === yearData.year;
              
              return (
                <div key={yearData.year} onClick={() => handleClick(yearData.year)} style={{
                  display: 'flex', gap: '12px', position: 'relative', marginBottom: '20px',
                  cursor: 'pointer', padding: '8px 10px',
                  backgroundColor: isActive ? `${yearData.color}08` : 'transparent',
                  borderRadius: '12px',
                  transform: justClicked ? 'scale(1.03)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 1,
                }}>
                  <div style={{
                    width: '56px', height: '56px', minWidth: '56px', borderRadius: '50%',
                    backgroundColor: isActive ? yearData.color : '#FFFFFF',
                    border: `3px solid ${yearData.color}`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    boxShadow: isActive ? `0 0 0 5px ${yearData.color}12` : 'none',
                    transform: justClicked ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: isActive ? '#FFFFFF' : yearData.color, fontFamily: 'Inter, sans-serif' }}>
                      {yearData.year}
                    </span>
                  </div>
                  <div style={{ flex: 1, paddingTop: '6px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#052A73', lineHeight: 1.3, margin: '0 0 2px 0', fontFamily: 'Inter, sans-serif' }}>{yearData.total} Awards</h4>
                    <p style={{ fontSize: '10px', color: '#64748B', lineHeight: 1.4, margin: '0', fontFamily: 'Inter, sans-serif' }}>{yearData.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '14px', background: 'linear-gradient(135deg, #052A73 0%, #0B248F 100%)', borderRadius: '12px', padding: '14px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', margin: '0 0 2px 0', fontFamily: 'Inter, sans-serif' }}>Total Awards</p>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>{totalAllAwards}+</div>
          <p style={{ fontSize: '10px', lineHeight: 1.4, color: 'rgba(255,255,255,0.75)', margin: '6px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Recognitions earned through excellence.</p>
        </div>

      </div>
      <style>{`@media (max-width: 1100px) { .year-sidebar { width: 100% !important; position: static !important; } .timeline-line { display: none; } }`}</style>
    </div>
  );
};

export default AwardsYearSidebar;