import React from 'react';
import { FiMapPin, FiAward, FiCheckCircle } from 'react-icons/fi';

interface AwardsCardProps {
  image: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  title: string;
  location: string;
  description: string;
  type: 'award' | 'certificate';
}

const sampleAwards = [
  { id: '1', image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400', badge: 'Safety Excellence', badgeBg: '#DCFCE7', badgeColor: '#16A34A', title: 'Best Safety Conscious Contractor Award', location: 'Mundra, Gujarat', description: 'Recognized for outstanding safety performance.', type: 'award' as const, category: 'safety' },
  { id: '2', image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400', badge: 'HSE Milestone', badgeBg: '#FED7AA', badgeColor: '#EA580C', title: '2 Million LTI-Free Safe Manhours', location: 'Jamnagar, Gujarat', description: 'Achieved 2 million LTI-free safe manhours.', type: 'award' as const, category: 'safety' },
  { id: '3', image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400', badge: 'Sustainability', badgeBg: '#DCFCE7', badgeColor: '#16A34A', title: 'IGBC Green Warehouse Gold Certification', location: 'India', description: 'Received prestigious IGBC Gold Certification.', type: 'certificate' as const, category: 'sustainability' },
  { id: '4', image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400', badge: 'Industry Leader', badgeBg: '#FCE7F3', badgeColor: '#DB2777', title: 'Economic Times Real Estate Award Winner', location: 'India', description: 'Winner at The Economic Times Real Estate Awards.', type: 'award' as const, category: 'leadership' },
];

const AwardsCard: React.FC<AwardsCardProps> = ({ image, badge, badgeBg, badgeColor, title, location, description, type }) => (
  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EAF2', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
    <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
    </div>
    <div style={{ padding: '16px 16px 0' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', textTransform: 'uppercase', backgroundColor: badgeBg, color: badgeColor, display: 'inline-block', fontFamily: 'Inter, sans-serif' }}>{badge}</span>
    </div>
    <div style={{ padding: '8px 16px 0' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#052A73', lineHeight: 1.3, margin: 0, fontFamily: 'Inter, sans-serif' }}>{title}</h3>
    </div>
    <div style={{ padding: '10px 16px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
      <FiMapPin size={14} color="#64748B" />
      <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{location}</span>
      <div style={{ marginLeft: 'auto' }}>
        {type === 'award' ? <FiAward size={16} color="#F59E0B" /> : <FiCheckCircle size={16} color="#22C55E" />}
      </div>
    </div>
  </div>
);

export { sampleAwards };
export default AwardsCard;