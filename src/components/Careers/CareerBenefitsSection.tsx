import React from 'react';
import { Wallet, TrendingUp, GraduationCap, HeartPulse, Scale, Target, Check } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>> = {
  Wallet,
  TrendingUp,
  GraduationCap,
  HeartPulse,
  Scale,
  Target,
  Check
};

const getLucideIcon = (iconName: string, size = 26, color?: string) => {
  const IconComponent = iconMap[iconName] || Check;
  return <IconComponent size={size} strokeWidth={2} color={color} />;
};

const defaultBenefitsData = [
  { id: 'salary', icon: "Wallet", iconColor: '#FF6B35', title: 'Competitive Salary', description: 'Industry-leading pay and performance incentives.' },
  { id: 'growth', icon: "TrendingUp", iconColor: '#FF6B35', title: 'Career Growth', description: 'Clear career path and opportunities for advancement.' },
  { id: 'learning', icon: "GraduationCap", iconColor: '#1E2A5A', title: 'Learning Programs', description: 'Continuous learning through training and certifications.' },
  { id: 'health', icon: "HeartPulse", iconColor: '#FF6B35', title: 'Health Benefits', description: 'Comprehensive health insurance for you and your family.' },
  { id: 'balance', icon: "Scale", iconColor: '#1E2A5A', title: 'Work-Life Balance', description: 'Flexible policies and support for personal well-being.' },
  { id: 'impact', icon: "Target", iconColor: '#FF6B35', title: 'Make an Impact', description: 'Work on meaningful projects that build a better India.' },
];

const cleanTitle = (rawTitle?: string) => {
  if (!rawTitle) return 'Why Join PISL?';
  return rawTitle.replace(/<[^>]*>?/gm, '').trim();
};

const CareerBenefitsSection = ({ title, benefits }: { title?: string, benefits?: any[] }) => {
  const benefitsList = (benefits && benefits.length > 0) ? benefits : defaultBenefitsData;

  return (
    <section className="career-benefits-section">
      <div className="career-benefits-container">
        
        <div className="career-benefits-header">
          <h2 className="career-benefits-title">
            {cleanTitle(title)}
          </h2>
        </div>

        <div className="benefits-grid">
          {benefitsList.map((benefit) => {
            const isOrange = benefit.iconColor === '#FF6B35';
            const bgTint = isOrange ? 'rgba(255, 107, 53, 0.08)' : 'rgba(30, 42, 90, 0.08)';
            const iconCol = benefit.iconColor || (isOrange ? '#FF6B35' : '#1E2A5A');

            return (
              <div key={benefit.id} className="benefit-card">
                <div 
                  className="benefit-icon-wrap"
                  style={{ backgroundColor: bgTint }}
                >
                  <span style={{ color: iconCol, display: 'flex', lineHeight: 0 }}>
                    {typeof benefit.icon === "string" 
                      ? getLucideIcon(benefit.icon, 24, iconCol) 
                      : benefit.icon}
                  </span>
                </div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-desc">{benefit.description}</p>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        .career-benefits-section {
          width: 100%;
          background-color: #FFFFFF;
          padding: 40px 0;
          font-family: 'Inter', sans-serif;
        }
        .career-benefits-container {
          width: 95%;
          max-width: 1370px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
        }
        .career-benefits-header {
          text-align: center;
          margin-bottom: 34px;
        }
        .career-benefits-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #1E2A5A;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        /* Desktop Grid */
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          box-sizing: border-box;
        }

        .benefit-card {
          background-color: #FFFFFF;
          border: 1px solid #EAEFF5;
          border-radius: 14px;
          padding: 22px 14px 18px 14px;
          text-align: center;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          height: 100%;
          transition: none !important;
          transform: none !important;
        }
        .benefit-card:hover {
          transform: none !important;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03) !important;
          border-color: #EAEFF5 !important;
        }
        .benefit-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 12px;
        }
        .benefit-title {
          font-size: 15px;
          font-weight: 700;
          color: #1E2A5A;
          margin: 0 0 6px 0;
          line-height: 1.3;
        }
        .benefit-desc {
          font-size: 12px;
          line-height: 1.5;
          color: #64748B;
          margin: 0;
        }

        /* Tablet (768px - 1100px) */
        @media (max-width: 1100px) {
          .benefits-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }
        }

        /* Mobile (<= 768px): 2x3 Grid */
        @media (max-width: 768px) {
          .career-benefits-section {
            padding: 24px 0 !important;
          }
          .career-benefits-container {
            padding: 0 14px !important;
          }
          .career-benefits-header {
            margin-bottom: 22px !important;
          }
          .career-benefits-title {
            font-size: clamp(24px, 6vw, 32px) !important;
          }
          .benefits-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
          .benefit-card {
            padding: 16px 10px 14px 10px !important;
            border-radius: 12px !important;
          }
          .benefit-icon-wrap {
            width: 44px !important;
            height: 44px !important;
            margin-bottom: 10px !important;
          }
          .benefit-icon-wrap svg {
            width: 22px !important;
            height: 22px !important;
          }
          .benefit-title {
            font-size: clamp(13px, 3.6vw, 14.5px) !important;
            margin-bottom: 4px !important;
          }
          .benefit-desc {
            font-size: clamp(11px, 2.8vw, 11.5px) !important;
            line-height: 1.45 !important;
          }
        }

        /* Small Phones (<= 360px) */
        @media (max-width: 360px) {
          .career-benefits-container {
            padding: 0 10px !important;
          }
          .benefits-grid {
            gap: 8px !important;
          }
          .benefit-card {
            padding: 14px 8px 12px 8px !important;
          }
          .benefit-icon-wrap {
            width: 38px !important;
            height: 38px !important;
          }
          .benefit-icon-wrap svg {
            width: 19px !important;
            height: 19px !important;
          }
          .benefit-title {
            font-size: 12.5px !important;
          }
          .benefit-desc {
            font-size: 10.5px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CareerBenefitsSection;