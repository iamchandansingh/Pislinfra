import React from 'react';
import { Wallet, TrendingUp, GraduationCap, HeartPulse, Scale, Target } from 'lucide-react';

// Types
interface BenefitItem {
  id: string;
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
}

// Benefits Data
const benefitsData: BenefitItem[] = [
  {
    id: 'salary',
    icon: <Wallet size={28} strokeWidth={2} />,
    iconColor: '#FF6B35',
    title: 'Competitive Salary',
    description: 'Industry-leading pay and performance incentives.',
  },
  {
    id: 'growth',
    icon: <TrendingUp size={28} strokeWidth={2} />,
    iconColor: '#FF6B35',
    title: 'Career Growth',
    description: 'Clear career path and opportunities for advancement.',
  },
  {
    id: 'learning',
    icon: <GraduationCap size={28} strokeWidth={2} />,
    iconColor: '#1E2A5A',
    title: 'Learning Programs',
    description: 'Continuous learning through training and certifications.',
  },
  {
    id: 'health',
    icon: <HeartPulse size={28} strokeWidth={2} />,
    iconColor: '#FF6B35',
    title: 'Health Benefits',
    description: 'Comprehensive health insurance for you and your family.',
  },
  {
    id: 'balance',
    icon: <Scale size={28} strokeWidth={2} />,
    iconColor: '#1E2A5A',
    title: 'Work-Life Balance',
    description: 'Flexible policies and support for personal well-being.',
  },
  {
    id: 'impact',
    icon: <Target size={28} strokeWidth={2} />,
    iconColor: '#FF6B35',
    title: 'Make an Impact',
    description: 'Work on meaningful projects that build a better India.',
  },
];

// Main Component
const CareerBenefitsSection: React.FC = () => {
  return (
    <section style={{ width: '100%', backgroundColor: '#FFFFFF', padding: '48px 0' }}>
      <div style={{ 
        width: '97%', 
        maxWidth: '1350px', 
        margin: '0 auto',
        paddingLeft: '12px', 
        paddingRight: '12px',
        boxSizing: 'border-box',
      }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '38px',
            fontWeight: 700,
            color: '#1E2A5A',
            margin: '0 0 12px 0',
            lineHeight: 1.2,
          }}>
            Why Join <span style={{ color: '#FF6B35' }}>PISL?</span>
          </h2>
          
          {/* Orange Underline */}
          <div style={{
            width: '50px',
            height: '4px',
            backgroundColor: '#FF6B35',
            borderRadius: '999px',
            margin: '0 auto',
          }} />
        </div>

        {/* Benefits Grid */}
        <div className="benefits-grid">
          {benefitsData.map((benefit) => (
            <div
              key={benefit.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EAEFF5',
                borderRadius: '16px',
                padding: '24px 16px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Icon Circle */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EEF2F7',
                boxShadow: '0 4px 12px rgba(15,23,42,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: benefit.iconColor, display: 'flex', lineHeight: 0 }}>
                  {benefit.icon}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#1E2A5A',
                marginTop: '16px',
                marginBottom: '8px',
                lineHeight: 1.3,
              }}>
                {benefit.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '13px',
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#64748B',
                margin: 0,
              }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Responsive Grid Styles */}
      <style>{`
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 16px;
        }
        @media (min-width: 480px) {
          .benefits-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
        @media (min-width: 768px) {
          .benefits-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }
        @media (min-width: 1100px) {
          .benefits-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 20px;
          }
        }
      `}</style>
    </section>
  );
};

export default CareerBenefitsSection;