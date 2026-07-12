import React from 'react';
import { FiMapPin } from 'react-icons/fi';

interface AwardsTimelineItemProps {
  image: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  title: string;
  location: string;
  description?: string;
  align?: 'left' | 'right';
}

const AwardsTimelineItem: React.FC<AwardsTimelineItemProps> = ({
  image,
  badge,
  badgeBg,
  badgeColor,
  title,
  location,
  description,
  align = 'left',
}) => {
  return (
    <div
      className="award-card"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #EEF2F7',
        borderRadius: '18px',
        overflow: 'hidden',
        width: '100%',
        boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 18px 40px rgba(0,0,0,0.08)';
        const img = e.currentTarget.querySelector('.card-image') as HTMLElement;
        if (img) img.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.05)';
        const img = e.currentTarget.querySelector('.card-image') as HTMLElement;
        if (img) img.style.transform = 'scale(1)';
      }}
    >
      
      {/* Image Section */}
      <div style={{
        width: '100%',
        height: '220px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div
          className="card-image"
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.3s ease',
          }}
        />
        {/* Bottom Gradient Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Content Section */}
      <div style={{ padding: '24px' }}>
        
        {/* Badge */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: '32px',
          padding: '0 12px',
          borderRadius: '999px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          backgroundColor: badgeBg,
          color: badgeColor,
        }}>
          {badge}
        </span>

        {/* Title */}
        <h3 style={{
          fontSize: '30px',
          fontWeight: 800,
          color: '#052A73',
          lineHeight: 1.2,
          letterSpacing: '-0.5px',
          margin: '16px 0 0 0',
          fontFamily: 'Inter, sans-serif',
        }}>
          {title}
        </h3>

        {/* Location */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '14px',
        }}>
          <FiMapPin size={16} color="#64748B" />
          <span style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#64748B',
            fontFamily: 'Inter, sans-serif',
          }}>
            {location}
          </span>
        </div>

        {/* Description (Optional) */}
        {description && (
          <p style={{
            fontSize: '15px',
            fontWeight: 400,
            color: '#64748B',
            lineHeight: 1.8,
            margin: '16px 0 0 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            {description}
          </p>
        )}

      </div>

    </div>
  );
};

export default AwardsTimelineItem;