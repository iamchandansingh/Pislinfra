import React from 'react';
import { Building2, Award, Users, MapPin } from 'lucide-react';

// Types
interface StatItem {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  number: string;
  label: string;
}

// Stats Data
const statsData: StatItem[] = [
  {
    id: 'projects',
    icon: <Building2 size={28} strokeWidth={2.2} />,
    iconBg: '#F3F0FF',
    iconColor: '#5B4DFF',
    number: '500+',
    label: 'Projects Delivered',
  },
  {
    id: 'experience',
    icon: <Award size={28} strokeWidth={2.2} />,
    iconBg: '#FFF4E8',
    iconColor: '#FF9F1C',
    number: '15+',
    label: 'Years of Experience',
  },
  {
    id: 'clients',
    icon: <Users size={28} strokeWidth={2.2} />,
    iconBg: '#ECFDF3',
    iconColor: '#16A34A',
    number: '250+',
    label: 'Happy Clients',
  },
  {
    id: 'branches',
    icon: <MapPin size={28} strokeWidth={2.2} />,
    iconBg: '#FFF1F2',
    iconColor: '#FF4D4F',
    number: '7+',
    label: 'Pan-India Branches',
  },
];

// Divider Component
const Divider: React.FC = () => (
  <div className="hidden lg:block" style={{ width: '1px', height: '80px', backgroundColor: '#E5E7EB' }} />
);

// Main Component
const CompanyStatsSection: React.FC = () => {
  return (
    <section style={{ width: '100%', marginTop: '40px', marginBottom: '40px' }}>
      <div style={{
        width: '95%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0',
      }}>
        
        {/* Single Stats Container */}
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EEF2F7',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
            height: '130px',
            padding: '0 40px',
          }}
        >
          {/* Desktop: Flex Row */}
          <div className="hidden lg:flex items-center justify-between h-full">
            {statsData.map((stat, index) => (
              <React.Fragment key={stat.id}>
                {/* Stat Item */}
                <div className="flex items-center gap-4">
                  {/* Icon Circle */}
                  <div 
                    className="w-[60px] h-[60px] rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: stat.iconBg }}
                  >
                    <span style={{ color: stat.iconColor, display: 'flex', lineHeight: 0 }}>
                      {stat.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <div style={{
                      fontSize: '38px',
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      color: '#1E2A5A',
                    }}>
                      {stat.number}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      color: '#475569',
                      marginTop: '2px',
                    }}>
                      {stat.label}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {index < statsData.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </div>

          {/* Tablet & Mobile: Grid Layout */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 h-full py-4 content-center">
            {statsData.map((stat) => (
              <div key={stat.id} className="flex items-center gap-4 justify-center md:justify-start">
                {/* Icon Circle */}
                <div 
                  className="w-[60px] h-[60px] rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: stat.iconBg }}
                >
                  <span style={{ color: stat.iconColor, display: 'flex', lineHeight: 0 }}>
                    {stat.icon}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <div style={{
                    fontSize: '42px',
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    color: '#1E2A5A',
                  }}>
                    {stat.number}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: '#475569',
                    marginTop: '2px',
                  }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CompanyStatsSection;