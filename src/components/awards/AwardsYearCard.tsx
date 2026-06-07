import React from 'react';
import { FiAward, FiCheckCircle, FiStar } from 'react-icons/fi';

interface AwardsYearCardProps {
  year: string;
  totalAwards: number;
  totalCertificates: number;
  description: string;
  children?: React.ReactNode;
  color?: string;
}

const AwardsYearCard: React.FC<AwardsYearCardProps> = ({
  year, totalAwards, totalCertificates, description, children, color = '#22C55E',
}) => {
  const total = totalAwards + totalCertificates;

  return (
    <div id={`year-${year}`} style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }} className="year-header">
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: `${color}12`, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color, fontFamily: 'Inter, sans-serif' }}>{year.slice(2)}</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>Year {year}</span>
          </div>

          <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#052A73', lineHeight: 1.1, letterSpacing: '-1px', margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>{total} Awards & Certifications</h2>
          <p style={{ fontSize: '13px', fontWeight: 400, color: '#64748B', lineHeight: 1.5, maxWidth: '700px', margin: 0, fontFamily: 'Inter, sans-serif' }}>{description}</p>
        </div>

        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E5EAF2', borderRadius: '12px', padding: '14px', width: '160px', flexShrink: 0, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#052A73', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>{totalAwards}</div>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#64748B', margin: '2px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Awards</p>
          </div>
          <div style={{ width: '1px', backgroundColor: '#E5EAF2' }} />
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#052A73', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>{totalCertificates}</div>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#64748B', margin: '2px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Certs</p>
          </div>
        </div>

      </div>

      <div style={{ marginTop: '20px', height: '1px', backgroundColor: '#EEF2F7' }} />

      {children && <div style={{ marginTop: '20px' }}>{children}</div>}

      <div style={{ marginTop: '20px', backgroundColor: '#F8FAFC', border: '1px solid #EEF2F7', borderRadius: '10px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FiAward size={13} color="#F59E0B" /> Awards: <strong style={{ color: '#052A73' }}>{totalAwards}</strong>
        </span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FiCheckCircle size={13} color="#22C55E" /> Certs: <strong style={{ color: '#052A73' }}>{totalCertificates}</strong>
        </span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FiStar size={13} color={color} /> Score: <strong style={{ color }}>Excellent</strong>
        </span>
      </div>

    </div>
  );
};

export default AwardsYearCard;