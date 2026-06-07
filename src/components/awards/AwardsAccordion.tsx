import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiAward } from 'react-icons/fi';
import AwardsFilters from './AwardsFilters';
import AwardsGrid from './AwardsGrid';
import { sampleAwards } from './AwardsCard';

interface AwardItem {
  id: string; image: string; badge: string; badgeBg: string; badgeColor: string;
  title: string; location: string; description: string; category: string;
  type: 'award' | 'certificate'; date?: string;
}

interface AwardsAccordionProps {    
  year: string;
  totalAwards: number;
  totalCertificates: number;
  description: string;
  awards?: AwardItem[];
  defaultOpen?: boolean;
  color?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

const AwardsAccordion: React.FC<AwardsAccordionProps> = ({
  year, totalAwards, totalCertificates, description,
  awards = sampleAwards as AwardItem[],
  defaultOpen = false, color = '#3B82F6',
  isOpen: controlledOpen,
  onToggle,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const [activeFilter, setActiveFilter] = useState('all');
  const total = totalAwards + totalCertificates;
  
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, awards, activeFilter]);

  const handleToggle = () => {
    if (onToggle) onToggle();
    else setInternalOpen(!isOpen);
  };

  const counts = {
    all: awards.length, awards: awards.filter(a => a.type === 'award').length,
    certificates: awards.filter(a => a.type === 'certificate').length,
    safety: awards.filter(a => a.category === 'safety').length,
    sustainability: awards.filter(a => a.category === 'sustainability').length,
    innovation: awards.filter(a => a.category === 'innovation').length,
    leadership: awards.filter(a => a.category === 'leadership').length,
    community: awards.filter(a => a.category === 'community').length,
  };

  const filteredAwards = activeFilter === 'all' ? awards
    : activeFilter === 'awards' ? awards.filter(a => a.type === 'award')
    : activeFilter === 'certificates' ? awards.filter(a => a.type === 'certificate')
    : awards.filter(a => a.category === activeFilter);

  return (
    <div id={`year-${year}`} style={{ 
      backgroundColor: '#FFFFFF', 
      border: `1px solid ${isOpen ? '#D6DFEB' : '#E5EAF2'}`, 
      borderRadius: '20px', 
      overflow: 'hidden', 
      marginTop: '20px',
      boxShadow: isOpen ? '0 8px 25px rgba(0,0,0,0.05)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <button onClick={handleToggle} style={{ 
        height: '90px', padding: '0 24px', display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', cursor: 'pointer', border: 'none', 
        backgroundColor: 'transparent', width: '100%', fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ 
            width: '60px', height: '60px', minWidth: '60px', borderRadius: '50%', 
            backgroundColor: isOpen ? color : `${color}12`, 
            border: `3px solid ${color}`, display: 'flex', alignItems: 'center', 
            justifyContent: 'center', transition: 'all 0.3s ease',
          }}>
            <span style={{ 
              fontSize: '24px', fontWeight: 800, 
              color: isOpen ? '#FFFFFF' : color, 
              fontFamily: 'Inter, sans-serif', transition: 'color 0.3s ease',
            }}>{year.slice(2)}</span>
          </div>
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#052A73', margin: 0, fontFamily: 'Inter, sans-serif' }}>{total} Awards & Certifications</h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>{description}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '18px' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '16px', fontWeight: 700, color: '#052A73', fontFamily: 'Inter, sans-serif' }}>{totalAwards}</div><div style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>Awards</div></div>
            <div style={{ width: '1px', backgroundColor: '#E5EAF2' }} />
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '16px', fontWeight: 700, color: '#052A73', fontFamily: 'Inter, sans-serif' }}>{totalCertificates}</div><div style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>Certs</div></div>
          </div>
          <FiChevronDown size={22} color="#64748B" style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
          }} />
        </div>
      </button>
      
      <div style={{
        height: isOpen ? `${contentHeight}px` : '0px',
        overflow: 'hidden',
        transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isOpen ? 1 : 0,
      }}>
        <div ref={contentRef} style={{ padding: '0 24px 24px' }}>
          <div style={{ height: '1px', backgroundColor: '#EEF2F7', marginBottom: '24px' }} />
          {awards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <FiAward size={40} color="#CBD5E1" />
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#052A73', margin: '10px 0 4px', fontFamily: 'Inter, sans-serif' }}>No Awards Available</h4>
              <p style={{ fontSize: '13px', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>Awards for this year will appear here.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '22px' }}><AwardsFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} /></div>
              <AwardsGrid awards={filteredAwards} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AwardsAccordion;