import React from 'react';
import { FiGrid, FiAward, FiCheckCircle } from 'react-icons/fi';

interface FilterItem {
  id: string; label: string; icon: React.ReactNode; count?: number;
}

interface AwardsFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number; awards: number; certificates: number;
    safety: number; sustainability: number; innovation: number;
    leadership: number; community: number;
  };
}

const filterItems: FilterItem[] = [
  { id: 'all', label: 'All', icon: <FiGrid size={14} /> },
  { id: 'awards', label: 'Awards', icon: <FiAward size={14} /> },
  { id: 'certificates', label: 'Certificates', icon: <FiCheckCircle size={14} /> },
];

const AwardsFilters: React.FC<AwardsFiltersProps> = ({ activeFilter, onFilterChange, counts }) => (
  <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
    {filterItems.map((item) => {
      const isActive = activeFilter === item.id;
      const count = counts[item.id as keyof typeof counts] || 0;
      return (
        <button key={item.id} onClick={() => onFilterChange(item.id)} style={{
          height: '40px', padding: '0 16px', borderRadius: '999px',
          backgroundColor: isActive ? '#052A73' : '#FFFFFF',
          border: isActive ? '1px solid #052A73' : '1px solid #E5EAF2',
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          cursor: 'pointer', transition: 'all 0.2s ease',
          boxShadow: isActive ? '0 4px 12px rgba(5,42,115,0.12)' : 'none',
          fontFamily: 'Inter, sans-serif', color: isActive ? '#FFFFFF' : '#334155',
        }}>
          <span style={{ color: isActive ? '#FFFFFF' : '#64748B', display: 'flex', lineHeight: 0 }}>{item.icon}</span>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.label}</span>
          <span style={{ minWidth: '22px', height: '22px', borderRadius: '999px', backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(5,42,115,0.08)', color: isActive ? '#FFFFFF' : '#052A73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, padding: '0 5px' }}>{count}</span>
        </button>
      );
    })}
  </div>
);

export default AwardsFilters;