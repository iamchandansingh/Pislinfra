import React from 'react';
import { FiMapPin } from 'react-icons/fi';

interface AwardItem {
  id: string;
  year: string;
  yearColor: string;
  side: 'left' | 'right';
  title: string;
  location: string;
  image: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
}

const awardsData: AwardItem[] = [
  {
    id: '1', year: '2025', yearColor: '#22C55E', side: 'left',
    title: 'Best Safety Conscious Contractor Award',
    location: 'Mundra, Gujarat',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Safety Excellence', badgeBg: '#DCFCE7', badgeColor: '#22C55E',
  },
  {
    id: '2', year: '2025', yearColor: '#22C55E', side: 'right',
    title: '2 Million LTI-Free Safe Manhours Achievement',
    location: 'Jamnagar, Gujarat',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'HSE Milestone', badgeBg: '#FED7AA', badgeColor: '#F97316',
  },
  {
    id: '3', year: '2024', yearColor: '#3B82F6', side: 'left',
    title: '2 Million Safe Man-Hours Award',
    location: 'Mundra, Gujarat',
    image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Safety Culture', badgeBg: '#DBEAFE', badgeColor: '#3B82F6',
  },
  {
    id: '4', year: '2024', yearColor: '#3B82F6', side: 'right',
    title: 'IGBC Green Warehouse Gold Certification',
    location: 'India',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Sustainability', badgeBg: '#DCFCE7', badgeColor: '#22C55E',
  },
  {
    id: '5', year: '2023', yearColor: '#8B5CF6', side: 'left',
    title: 'LEED Gold Certified Logistics Park',
    location: 'Haryana, India',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'LEED Gold', badgeBg: '#EDE9FE', badgeColor: '#8B5CF6',
  },
  {
    id: '6', year: '2023', yearColor: '#F97316', side: 'right',
    title: 'Economic Times Real Estate Award Winner',
    location: 'India',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Industry Leader', badgeBg: '#FCE7F3', badgeColor: '#EC4899',
  },
  {
    id: '7', year: '2023', yearColor: '#F97316', side: 'left',
    title: 'Entrepreneur of the Year Recognition',
    location: 'India',
    image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Executive Leadership', badgeBg: '#FFEDD5', badgeColor: '#F97316',
  },
  {
    id: '8', year: '2023', yearColor: '#8B5CF6', side: 'right',
    title: 'Purpose-Driven Infrastructure Leadership',
    location: 'India',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Innovation', badgeBg: '#DBEAFE', badgeColor: '#3B82F6',
  },
  {
    id: '9', year: '2024', yearColor: '#22C55E', side: 'left',
    title: 'National Safety Week Appreciation',
    location: 'Jhajjar, Haryana',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'HSE Engagement', badgeBg: '#DCFCE7', badgeColor: '#22C55E',
  },
  {
    id: '10', year: '2024', yearColor: '#22C55E', side: 'right',
    title: 'Blood Donation Camp Initiative',
    location: 'Chennai, Tamil Nadu',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Social Responsibility', badgeBg: '#FCE7F3', badgeColor: '#EC4899',
  },
  {
    id: '11', year: '2024', yearColor: '#8B5CF6', side: 'left',
    title: 'Early Morning Safety Walk',
    location: 'Jhajjar, Haryana',
    image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Hazard Prevention', badgeBg: '#EDE9FE', badgeColor: '#8B5CF6',
  },
  {
    id: '12', year: '2024', yearColor: '#8B5CF6', side: 'right',
    title: 'Building a Safer & Stronger Tomorrow',
    location: 'Across India',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Community Impact', badgeBg: '#FFE4E6', badgeColor: '#EF4444',
  },
];

const AwardCard: React.FC<{ item: AwardItem }> = ({ item }) => (
  <div style={{
    backgroundColor: '#FFFFFF',
    border: '1px solid #EEF2F7',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
  }}
  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 35px rgba(0,0,0,0.08)'; }}
  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.05)'; }}>
    <div style={{ height: '220px', backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
    <div style={{ padding: '24px' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, padding: '6px 10px', borderRadius: '999px', textTransform: 'uppercase', backgroundColor: item.badgeBg, color: item.badgeColor, fontFamily: 'Inter, sans-serif' }}>{item.badge}</span>
      <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#052A73', lineHeight: 1.2, margin: '14px 0 10px 0', fontFamily: 'Inter, sans-serif' }}>{item.title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <FiMapPin size={14} color="#64748B" />
        <span style={{ fontSize: '14px', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{item.location}</span>
      </div>
    </div>
  </div>
);

const YearCircle: React.FC<{ year: string; color: string }> = ({ year, color }) => (
  <div style={{
    width: '72px', height: '72px', minWidth: '72px',
    borderRadius: '50%', backgroundColor: '#FFFFFF',
    border: `3px solid ${color}`, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '28px', fontWeight: 800, color: color,
    fontFamily: 'Inter, sans-serif', zIndex: 2, position: 'relative',
  }}>
    {year}
  </div>
);

const AwardsTimeline: React.FC = () => {
  // Group by year
  const years = ['2025', '2024', '2023', '2023', '2024', '2024'];
  let cardIndex = 0;

  return (
    <div style={{ width: '100%', padding: '60px 0 80px', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto', position: 'relative' }}>
        
        {/* Center Timeline Line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '2px',
          height: '100%',
          backgroundColor: '#E2E8F0',
          zIndex: 0,
        }}
        className="timeline-line" />

        {/* Timeline Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'relative', zIndex: 1 }}>
          
          {[0, 1, 2, 3, 4, 5].map((groupIndex) => {
            const leftItem = awardsData[cardIndex];
            const rightItem = awardsData[cardIndex + 1];
            cardIndex += 2;

            if (!leftItem) return null;

            return (
              <div key={groupIndex} className="timeline-row" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 1fr',
                alignItems: 'center',
              }}>
                
                {/* Left Card */}
                <div style={{ paddingRight: '30px' }}>
                  <AwardCard item={leftItem} />
                </div>

                {/* Center Year */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <YearCircle year={leftItem.year} color={leftItem.yearColor} />
                </div>

                {/* Right Card */}
                <div style={{ paddingLeft: '30px' }}>
                  {rightItem && <AwardCard item={rightItem} />}
                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .timeline-row {
            grid-template-columns: 1fr !important;
            gap: 20px;
          }
          .timeline-line {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AwardsTimeline;