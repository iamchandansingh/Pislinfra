import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiGrid, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';

interface CaseStudy { id: number; title: string; category: string; location: string; area: string; completed: string; duration: string; image: string; }
interface Category { id: string; label: string; }

const categories: Category[] = [
  { id: 'all', label: 'All' }, { id: 'industrial', label: 'Industrial' }, { id: 'logistics', label: 'Logistics' },
  { id: 'warehousing', label: 'Warehousing' }, { id: 'manufacturing', label: 'Manufacturing' }, { id: 'infrastructure', label: 'Infrastructure' },
];

const caseStudies: CaseStudy[] = [
  { id: 1, title: 'Sunsat Warehousing Pvt. Ltd.', category: 'Warehousing', location: 'Haryana', area: '850,000 Sq. Ft.', completed: '2024', duration: '10 Months', image: 'https://images.pexels.com/photos/3777190/pexels-photo-3777190.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 2, title: 'Pragati Probiotics Logistics Park', category: 'Logistics', location: 'Neemrana, Rajasthan', area: '1.2 Million Sq. Ft.', completed: '2025', duration: '14 Months', image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 3, title: 'Ludhiana Logistics Park LLP', category: 'Logistics', location: 'Ludhiana, Punjab', area: '650,000 Sq. Ft.', completed: '2024', duration: '12 Months', image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 4, title: 'Mega Industrial Manufacturing Plant', category: 'Manufacturing', location: 'Sanand, Gujarat', area: '1.6 Million Sq. Ft.', completed: '2025', duration: '18 Months', image: 'https://images.pexels.com/photos/159306/pexels-photo-159306.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 5, title: 'Steel Structure Distribution Center', category: 'Industrial', location: 'Pune, Maharashtra', area: '500,000 Sq. Ft.', completed: '2024', duration: '8 Months', image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 6, title: 'Infrastructure Development Project', category: 'Infrastructure', location: 'Dahej, Gujarat', area: '2.1 Million Sq. Ft.', completed: '2025', duration: '16 Months', image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

const CaseStudiesGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudies = caseStudies.filter((study) => {
    const matchesCategory = activeCategory === 'All' || study.category === activeCategory;
    const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) || study.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ width: '100%', padding: '20px 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
        
        <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0A2A66', marginBottom: '20px', fontFamily: 'Inter, sans-serif' }}>All Case Studies</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.label)} style={{
                  height: '40px', padding: '0 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', border: isActive ? 'none' : '1px solid #E5E7EB',
                  backgroundColor: isActive ? '#0A2A66' : '#FFFFFF', color: isActive ? '#FFFFFF' : '#4B5563',
                  boxShadow: isActive ? '0 4px 12px rgba(10,42,102,0.12)' : 'none',
                }}>{cat.label}</button>
              );
            })}
          </div>
          <div style={{ position: 'relative', width: '280px' }}>
            <FiSearch size={16} color="#6B7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search case studies..."
              style={{ width: '100%', height: '40px', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0 12px 0 36px', fontSize: '13px', color: '#111827', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', backgroundColor: '#FFFFFF' }} />
          </div>
        </div>

        <div className="studies-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {filteredStudies.map((study) => (
            <div key={study.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #EEF2F7', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div style={{ height: '180px', position: 'relative' }}>
                <div style={{ width: '100%', height: '100%', backgroundImage: `url(${study.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#0A2A66', color: '#FFFFFF', padding: '5px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>{study.category}</span>
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', lineHeight: 1.3, margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>{study.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '14px' }}>
                  <FiMapPin size={16} color="#6B7280" />
                  <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{study.location}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '12px 0', marginBottom: '12px' }}>
                  <div style={{ textAlign: 'center', borderRight: '1px solid #E5E7EB' }}>
                    <FiGrid size={18} color="#0A2A66" style={{ marginBottom: '4px' }} />
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 2px 0', fontFamily: 'Inter, sans-serif' }}>Area</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: 'Inter, sans-serif' }}>{study.area}</p>
                  </div>
                  <div style={{ textAlign: 'center', borderRight: '1px solid #E5E7EB' }}>
                    <FiCalendar size={18} color="#0A2A66" style={{ marginBottom: '4px' }} />
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 2px 0', fontFamily: 'Inter, sans-serif' }}>Completed</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: 'Inter, sans-serif' }}>{study.completed}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <FiClock size={18} color="#0A2A66" style={{ marginBottom: '4px' }} />
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 2px 0', fontFamily: 'Inter, sans-serif' }}>Duration</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: 'Inter, sans-serif' }}>{study.duration}</p>
                  </div>
                </div>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0A2A66', fontSize: '13px', fontWeight: 700, textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>
                  Read Case Study <FiArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button style={{ height: '44px', padding: '0 24px', backgroundColor: '#FFFFFF', color: '#0A2A66', border: '2px solid #0A2A66', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            View All Case Studies <FiArrowRight size={14} />
          </button>
        </div>

      </div>
      <style>{`@media (max-width: 1100px) { .studies-grid { grid-template-columns: repeat(2, 1fr) !important; } } @media (max-width: 700px) { .studies-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default CaseStudiesGrid;