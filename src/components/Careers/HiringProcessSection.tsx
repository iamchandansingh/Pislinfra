import React from 'react';

import * as LucideIcons from 'lucide-react';

const getLucideIcon = (iconName: string, size = 24) => {
  if (!iconName) return <LucideIcons.Check size={size} />;
  const IconComponent = (LucideIcons as any)[iconName];
  if (IconComponent) return <IconComponent size={size} />;
  return <LucideIcons.Check size={size} />;
};


// Types
interface ProcessStep {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Process Data
const defaultProcessSteps: ProcessStep[] = [
  {
    id: 1,
    icon: "FileText",
    title: 'Apply Online',
    description: 'Submit your application through our career portal with updated resume.',
  },
  {
    id: 2,
    icon: "ClipboardCheck",
    title: 'Initial Screening',
    description: 'We review your profile and conduct a shortlisting assessment.',
  },
  {
    id: 3,
    icon: "Briefcase",
    title: 'Technical Interview',
    description: 'Discussion with our technical team to assess your skills and experience.',
  },
  {
    id: 4,
    icon: "Users",
    title: 'HR Discussion',
    description: 'HR round to understand your goals, expectations and cultural fit.',
  },
  {
    id: 5,
    icon: "BadgeCheck",
    title: 'Offer Letter',
    description: 'Successful candidates receive the offer letter within 2-5 working days.',
  },
];

// Main Component
const HiringProcessSection = ({ title, steps }: { title?: string, steps?: any[] }) => {
  return (
    <section style={{ 
      width: '100%', 
      marginTop: '20px', 
      marginBottom: '40px',
      padding: '0 16px',
      boxSizing: 'border-box',
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        margin: '0 auto',
      }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#1E2A5A',
            margin: '0 0 10px 0',
            lineHeight: 1.2,
          }}>
            Our Hiring <span style={{ color: '#FF6B35' }}>Process</span>
          </h2>
          
          {/* Orange Underline */}
          <div style={{
            width: '40px',
            height: '3px',
            backgroundColor: '#FF6B35',
            borderRadius: '999px',
            margin: '0 auto',
          }} />
        </div>

        {/* Timeline Container */}
        <div className="timeline-container" style={{ position: 'relative' }}>
          
          {/* Horizontal Connecting Line - Desktop only */}
          <div className="timeline-line" />

          {/* Steps Grid */}
          <div className="process-grid">
            {(steps || defaultProcessSteps).map((step, index) => (
              <div key={step.id} className="process-step">
                
                {/* Step Number + Icon Circle */}
                <div className="step-icon-wrapper">
                  {/* Step Number (Mobile/Tablet) */}
                  <span className="step-number">{String(step.id).padStart(2, '0')}</span>
                  
                  {/* Icon Circle */}
                  <div className="icon-circle">
                    <span style={{ color: '#FF6B35', display: 'flex', lineHeight: 0 }}>
                      {typeof step.icon === "string" ? getLucideIcon(step.icon) : step.icon}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="step-content">
                  {/* Step Number + Title in one line for mobile */}
                  <div className="step-title-row">
                    <span className="step-number-inline">{String(step.id).padStart(2, '0')}</span>
                    <h3 className="step-title">{step.title}</h3>
                  </div>

                  {/* Description */}
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Responsive Styles */}
      <style>{`
        /* ===== DEFAULT: Mobile First (< 640px) ===== */
        .process-grid {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .process-step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 0;
          position: relative;
        }

        /* Vertical connecting line between steps */
        .process-step:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 23px;
          top: 58px;
          bottom: -14px;
          width: 2px;
          background-color: #E5EAF2;
        }

        .step-icon-wrapper {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        .icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #FFFFFF;
          border: 2px solid #FFD6BF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-circle svg {
          width: 20px;
          height: 20px;
        }

        /* Step Number Badge (Top-Right of Circle) */
        .step-number {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #FF6B35;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .step-number-inline {
          display: none;
        }

        .step-content {
          flex: 1;
          padding-top: 2px;
        }

        .step-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .step-title {
          font-size: 16px;
          font-weight: 700;
          color: #1E2A5A;
          margin: 0;
          line-height: 1.3;
        }

        .step-description {
          font-size: 13px;
          font-weight: 400;
          line-height: 1.5;
          color: #64748B;
          margin: 0;
        }

        .timeline-line {
          display: none;
        }


        /* ===== Tablet (640px - 1023px) ===== */
        @media (min-width: 640px) {
          .process-step {
            gap: 16px;
            padding: 16px 0;
          }

          .process-step:not(:last-child)::after {
            left: 28px;
            top: 64px;
            bottom: -16px;
          }

          .icon-circle {
            width: 56px;
            height: 56px;
          }

          .icon-circle svg {
            width: 22px;
            height: 22px;
          }

          .step-number {
            width: 22px;
            height: 22px;
            font-size: 11px;
          }

          .step-title {
            font-size: 17px;
          }

          .step-description {
            font-size: 14px;
          }

          .process-step:not(:last-child)::after {
            left: 28px;
          }
        }


        /* ===== Desktop (1024px+) ===== */
        @media (min-width: 1024px) {
          .process-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 20px;
          }

          .process-step {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 0;
            gap: 0;
          }

          /* Remove vertical lines */
          .process-step:not(:last-child)::after {
            display: none;
          }

          /* Show horizontal connecting line */
          .timeline-line {
            display: block;
            position: absolute;
            top: 32px;
            left: 8%;
            right: 8%;
            height: 2px;
            background-color: #E5EAF2;
            z-index: 0;
          }

          .step-icon-wrapper {
            margin-bottom: 16px;
            z-index: 1;
          }

          .icon-circle {
            width: 64px;
            height: 64px;
            border: 2px solid #FFD6BF;
          }

          .icon-circle svg {
            width: 24px;
            height: 24px;
          }

          .step-number {
            width: 24px;
            height: 24px;
            font-size: 11px;
            top: -8px;
            right: -8px;
          }

          /* Hide inline number, show badge on icon */
          .step-number-inline {
            display: none;
          }

          .step-number {
            display: flex;
          }

          .step-content {
            text-align: center;
            padding-top: 0;
          }

          .step-title-row {
            justify-content: center;
            margin-bottom: 6px;
          }

          .step-title {
            font-size: 16px;
          }

          .step-description {
            font-size: 13px;
            line-height: 1.5;
            max-width: 180px;
            margin: 0 auto;
          }
        }


        /* ===== Large Desktop (1200px+) ===== */
        @media (min-width: 1200px) {
          .process-grid {
            gap: 30px;
          }

          .icon-circle {
            width: 72px;
            height: 72px;
          }

          .icon-circle svg {
            width: 26px;
            height: 26px;
          }

          .step-number {
            width: 26px;
            height: 26px;
            font-size: 12px;
          }

          .step-title {
            font-size: 18px;
          }

          .step-description {
            font-size: 14px;
            max-width: 200px;
          }

          .timeline-line {
            top: 36px;
          }
        }
      `}</style>
    </section>
  );
};

export default HiringProcessSection;