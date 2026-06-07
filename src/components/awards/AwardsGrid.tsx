import React from 'react';
import { FiAward } from 'react-icons/fi';
import AwardsCard from './AwardsCard';

interface AwardItem {
  id: string; image: string; badge: string; badgeBg: string; badgeColor: string;
  title: string; location: string; description: string; category: string;
  type: 'award' | 'certificate';
}

interface AwardsGridProps { awards: AwardItem[]; loading?: boolean; }

const AwardsGrid: React.FC<AwardsGridProps> = ({ awards, loading = false }) => {
  if (loading) return <div style={{ marginTop: 28 }}><div className="ag" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>{[1,2,3,4].map(i => <div key={i} style={{ height: 200, borderRadius: 18, background: '#F8FAFC' }} />)}</div></div>;
  if (!awards || awards.length === 0) return <div style={{ textAlign: 'center', padding: '60px 20px', marginTop: 28 }}><FiAward size={64} color="#CBD5E1" /><h3 style={{ fontSize: 24, fontWeight: 700, color: '#052A73', fontFamily: 'Inter, sans-serif' }}>No Awards Found</h3></div>;
  
  return (
    <div style={{ marginTop: 28 }}>
      <div className="ag" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {awards.slice(0, 4).map(a => <AwardsCard key={a.id} {...a} />)}
      </div>
      <style>{`@media (max-width: 1000px) { .ag { grid-template-columns: repeat(2, 1fr) !important; } } @media (max-width: 550px) { .ag { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default AwardsGrid;