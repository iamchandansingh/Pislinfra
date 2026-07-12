import React from 'react';

interface TimelineYearNodeProps {
  year: string;
  color: string;
}

const TimelineYearNode: React.FC<TimelineYearNodeProps> = ({ year, color }) => {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      
      {/* Year Circle */}
      <div
        className="year-circle"
        style={{
          width: '72px',
          height: '72px',
          backgroundColor: '#FFFFFF',
          border: `3px solid ${color}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          cursor: 'default',
          zIndex: 2,
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = `0 8px 20px ${color}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Year Text */}
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '28px',
          fontWeight: 800,
          color: color,
          lineHeight: 1,
        }}>
          {year}
        </span>
      </div>

      {/* Connector Dot Below */}
      <div style={{
        width: '12px',
        height: '12px',
        backgroundColor: color,
        borderRadius: '50%',
        marginTop: '8px',
        zIndex: 1,
      }} />

    </div>
  );
};

export default TimelineYearNode;