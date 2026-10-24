import React from 'react';
import { 
  FileText, 
  ClipboardCheck, 
  Briefcase, 
  Users, 
  BadgeCheck, 
  Check, 
  MessageSquare, 
  Award 
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  FileText,
  ClipboardCheck,
  Briefcase,
  Users,
  BadgeCheck,
  Check,
  MessageSquare,
  Award
};

const getLucideIcon = (iconName: string, size = 24) => {
  const IconComponent = iconMap[iconName] || Check;
  return <IconComponent size={size} strokeWidth={2} />;
};

const renderIcon = (icon: any, size = 24) => {
  if (typeof icon === 'string') {
    return getLucideIcon(icon, size);
  }
  if (React.isValidElement(icon)) {
    return icon;
  }
  return <Check size={size} strokeWidth={2} />;
};

// Types
interface ProcessStep {
  id?: number | string;
  icon?: any;
  title: string;
  description?: string;
  desc?: string;
}

interface HiringProcessSectionProps {
  title?: string;
  steps?: ProcessStep[];
}

// Default Process Data
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

const cleanTitle = (rawTitle?: string): string => {
  if (!rawTitle) return 'Our Hiring Process';
  return rawTitle.replace(/<[^>]*>?/gm, '').trim();
};

// Main Component
const HiringProcessSection: React.FC<HiringProcessSectionProps> = ({ title, steps }) => {
  const rawSteps = (steps && steps.length > 0) ? steps : defaultProcessSteps;
  const processSteps = rawSteps.map((step, index) => ({
    id: step.id ?? index + 1,
    stepNumber: String(index + 1).padStart(2, '0'),
    icon: step.icon,
    title: step.title,
    description: step.description || step.desc || '',
  }));

  return (
    <section className="hiring-process-section">
      <div className="hiring-process-container">
        
        {/* Section Header */}
        <div className="hiring-process-header">
          <h2 className="hiring-process-title">
            {cleanTitle(title)}
          </h2>
        </div>

        {/* Desktop Horizontal Timeline (>= 1024px) */}
        <div className="desktop-timeline">
          <div className="desktop-timeline-line" />
          <div className="desktop-process-grid">
            {processSteps.map((step) => (
              <div key={step.id} className="desktop-process-step">
                <div className="step-icon-wrapper">
                  <span className="step-number">{step.stepNumber}</span>
                  <div className="icon-circle">
                    <span className="icon-svg">
                      {renderIcon(step.icon, 26)}
                    </span>
                  </div>
                </div>

                <div className="desktop-step-content">
                  <h3 className="desktop-step-title">{step.title}</h3>
                  <p className="desktop-step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet Connected Vertical Timeline (< 1024px) */}
        <div className="mobile-timeline">
          {processSteps.map((step, index) => (
            <div key={step.id} className="mobile-process-step">
              <div className="mobile-node-col">
                <div className="mobile-icon-wrapper">
                  <span className="mobile-step-number">{step.stepNumber}</span>
                  <div className="mobile-icon-circle">
                    <span className="icon-svg">
                      {renderIcon(step.icon, 22)}
                    </span>
                  </div>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="mobile-connector-line" />
                )}
              </div>

              <div className="mobile-step-content">
                <h3 className="mobile-step-title">{step.title}</h3>
                <p className="mobile-step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .hiring-process-section {
          width: 100%;
          background-color: #FFFFFF;
          padding: 60px 0 70px 0;
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }

        .hiring-process-container {
          width: 95%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
        }

        /* Header */
        .hiring-process-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .hiring-process-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #1E2A5A;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        /* ===== Desktop Timeline (>= 1024px) ===== */
        .desktop-timeline {
          position: relative;
          display: block;
        }

        .desktop-timeline-line {
          position: absolute;
          top: 36px;
          left: 10%;
          right: 10%;
          height: 0;
          border-top: 2px dashed #FFD6BF;
          z-index: 0;
        }

        .desktop-process-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
          position: relative;
          z-index: 1;
        }

        .desktop-process-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-width: 0;
          transition: none !important;
          transform: none !important;
        }

        .step-icon-wrapper {
          position: relative;
          margin-bottom: 16px;
          z-index: 1;
        }

        .icon-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background-color: #FFFFFF;
          border: 2px solid #FFD6BF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(255, 107, 53, 0.12);
          transition: none !important;
          transform: none !important;
        }

        .step-number {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #FF6B35;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 2px 6px rgba(255, 107, 53, 0.3);
        }

        .icon-svg {
          color: #FF6B35;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 0;
        }

        .desktop-step-content {
          text-align: center;
        }

        .desktop-step-title {
          font-size: 16.5px;
          font-weight: 700;
          color: #1E2A5A;
          margin: 0 0 6px 0;
          line-height: 1.3;
        }

        .desktop-step-description {
          font-size: 13px;
          font-weight: 400;
          line-height: 1.55;
          color: #64748B;
          max-width: 195px;
          margin: 0 auto;
        }

        /* ===== Mobile & Tablet Timeline (< 1024px) ===== */
        .mobile-timeline {
          display: none;
          flex-direction: column;
        }

        .mobile-process-step {
          display: flex;
          align-items: stretch;
          gap: 16px;
          transition: none !important;
          transform: none !important;
        }

        .mobile-node-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 50px;
          flex-shrink: 0;
        }

        .mobile-icon-wrapper {
          position: relative;
          width: 50px;
          height: 50px;
          flex-shrink: 0;
        }

        .mobile-icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #FFFFFF;
          border: 2px solid #FFD6BF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.12);
        }

        .mobile-step-number {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 21px;
          height: 21px;
          border-radius: 50%;
          background-color: #FF6B35;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 2px 6px rgba(255, 107, 53, 0.25);
        }

        .mobile-connector-line {
          width: 2px;
          flex: 1;
          min-height: 26px;
          border-left: 2px dashed #FFD6BF;
          margin: 6px 0;
        }

        .mobile-step-content {
          flex: 1;
          min-width: 0;
          padding-bottom: 24px;
        }

        .mobile-step-title {
          font-size: 16px;
          font-weight: 700;
          color: #1E2A5A;
          margin: 2px 0 4px 0;
          line-height: 1.3;
        }

        .mobile-step-description {
          font-size: 13.5px;
          font-weight: 400;
          line-height: 1.55;
          color: #64748B;
          margin: 0;
        }

        /* No hover animations anywhere */
        .desktop-process-step:hover,
        .mobile-process-step:hover,
        .icon-circle:hover,
        .mobile-icon-circle:hover {
          transform: none !important;
          box-shadow: none !important;
        }

        /* ===== Responsive Breakpoints ===== */
        @media (max-width: 1023px) {
          .desktop-timeline {
            display: none !important;
          }
          .mobile-timeline {
            display: flex !important;
          }
        }

        @media (max-width: 768px) {
          .hiring-process-section {
            padding: 40px 0 50px 0 !important;
          }
          .hiring-process-container {
            padding: 0 14px !important;
          }
          .hiring-process-header {
            margin-bottom: 26px !important;
          }
          .hiring-process-title {
            font-size: clamp(24px, 6vw, 32px) !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-process-step {
            gap: 13px !important;
          }
          .mobile-node-col {
            width: 44px !important;
          }
          .mobile-icon-wrapper {
            width: 44px !important;
            height: 44px !important;
          }
          .mobile-icon-circle {
            width: 44px !important;
            height: 44px !important;
          }
          .mobile-step-number {
            width: 19px !important;
            height: 19px !important;
            font-size: 9.5px !important;
            top: -4px !important;
            right: -4px !important;
          }
          .mobile-step-content {
            padding-bottom: 20px !important;
          }
          .mobile-step-title {
            font-size: 15px !important;
            margin-bottom: 3px !important;
          }
          .mobile-step-description {
            font-size: 12.5px !important;
            line-height: 1.5 !important;
          }
        }

        @media (max-width: 360px) {
          .hiring-process-container {
            padding: 0 10px !important;
          }
          .mobile-process-step {
            gap: 10px !important;
          }
          .mobile-node-col {
            width: 40px !important;
          }
          .mobile-icon-wrapper {
            width: 40px !important;
            height: 40px !important;
          }
          .mobile-icon-circle {
            width: 40px !important;
            height: 40px !important;
          }
          .mobile-step-number {
            width: 18px !important;
            height: 18px !important;
            font-size: 9px !important;
          }
          .mobile-step-title {
            font-size: 14px !important;
          }
          .mobile-step-description {
            font-size: 12px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HiringProcessSection;