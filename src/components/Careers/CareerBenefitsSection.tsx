import React from 'react';

import * as LucideIcons from 'lucide-react';

const getLucideIcon = (iconName: string, size = 28, color?: string) => {
  if (!iconName) return <LucideIcons.Check size={size} strokeWidth={2} color={color} />;
  const IconComponent = (LucideIcons as any)[iconName];
  if (IconComponent) return <IconComponent size={size} strokeWidth={2} color={color} />;
  return <LucideIcons.Check size={size} strokeWidth={2} color={color} />;
};


const defaultBenefitsData = [
  { id: 'salary', icon: "Wallet", iconColor: '#FF6B35', title: 'Competitive Salary', description: 'Industry-leading pay and performance incentives.' },
  { id: 'growth', icon: "TrendingUp", iconColor: '#FF6B35', title: 'Career Growth', description: 'Clear career path and opportunities for advancement.' },
  { id: 'learning', icon: "GraduationCap", iconColor: '#1E2A5A', title: 'Learning Programs', description: 'Continuous learning through training and certifications.' },
  { id: 'health', icon: "HeartPulse", iconColor: '#FF6B35', title: 'Health Benefits', description: 'Comprehensive health insurance for you and your family.' },
  { id: 'balance', icon: "Scale", iconColor: '#1E2A5A', title: 'Work-Life Balance', description: 'Flexible policies and support for personal well-being.' },
  { id: 'impact', icon: "Target", iconColor: '#FF6B35', title: 'Make an Impact', description: 'Work on meaningful projects that build a better India.' },
];

const CareerBenefitsSection = ({ title, benefits }: { title?: string, benefits?: any[] }) => {
  return (
    <section style={{ width: '100%', backgroundColor: '#FFFFFF', padding: '48px 0', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '95%', maxWidth: '1370px', margin: '0 auto', paddingLeft: '12px', paddingRight: '12px', boxSizing: 'border-box' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: '#1E2A5A', margin: '0 0 10px 0', lineHeight: 1.2 }} dangerouslySetInnerHTML={{ __html: title || 'Why Join <span style="color: #FF6B35">PISL?</span>' }} />
          <div style={{ width: '40px', height: '3px', backgroundColor: '#FF6B35', borderRadius: '999px', margin: '0 auto' }} />
        </div>

        <div className="benefits-grid">
          {(benefits || defaultBenefitsData).map((benefit) => (
            <div key={benefit.id} style={{
              backgroundColor: '#FFFFFF', border: '1px solid #EAEFF5', borderRadius: '14px',
              padding: '20px 14px', textAlign: 'center', boxShadow: '0 4px 16px rgba(15,23,42,0.03)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box',
            }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', boxShadow: '0 3px 10px rgba(15,23,42,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: benefit.iconColor, display: 'flex', lineHeight: 0 }}>{typeof benefit.icon === "string" ? getLucideIcon(benefit.icon, 28, benefit.iconColor || "#FF6B35") : benefit.icon}</span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2A5A', marginTop: '12px', marginBottom: '6px' }}>{benefit.title}</h3>
              <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#64748B', margin: 0 }}>{benefit.description}</p>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .benefits-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 14px; }
        @media (min-width: 480px) { .benefits-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 768px) { .benefits-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; } }
        @media (min-width: 1100px) { .benefits-grid { grid-template-columns: repeat(6, 1fr); gap: 18px; } }
      `}</style>
    </section>
  );
};

export default CareerBenefitsSection;