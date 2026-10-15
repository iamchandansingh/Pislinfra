import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

interface ApproachStep {
  id?: number | string;
  step?: string;
  stepNumber?: string;
  title: string;
  description: string;
}

interface ProjectApproachProps {
  data?: {
    approachTitle?: string;
    ctaTitle?: string;
    ctaSubtitle?: string;
    ctaButtonText?: string;
    ctaButtonLink?: string;
    approachSteps?: ApproachStep[];
  };
}

const defaultSteps: ApproachStep[] = [
  { id: 1, step: '01', title: 'Understand', description: 'We deeply understand the client\'s needs.' },
  { id: 2, step: '02', title: 'Plan', description: 'We create smart, feasible and efficient plans.' },
  { id: 3, step: '03', title: 'Execute', description: 'We execute with precision and strict quality control.' },
  { id: 4, step: '04', title: 'Deliver', description: 'We deliver on time with safety and quality.' },
  { id: 5, step: '05', title: 'Optimize', description: 'We ensure long-term value and sustainability.' },
];

const ProjectApproachCTA: React.FC<ProjectApproachProps> = ({ data }) => {
  const navigate = useNavigate();

  const title = data?.approachTitle || 'Our Approach That Delivers Results';
  const ctaTitle = data?.ctaTitle || 'Have a Project in Mind?';
  const ctaSubtitle = data?.ctaSubtitle || "Let's build something extraordinary together.";
  const ctaBtnText = data?.ctaButtonText || 'Get In Touch';
  const ctaBtnLink = data?.ctaButtonLink || '/contact-us';

  const rawSteps = data?.approachSteps && data.approachSteps.length > 0 ? data.approachSteps : defaultSteps;
  const steps = rawSteps.map((s, idx) => ({
    id: s.id || idx + 1,
    step: s.stepNumber || s.step || `0${idx + 1}`,
    title: s.title,
    description: s.description,
  }));

  return (
    <section className="project-approach-section">
      <div className="project-approach-wrapper">
        <div className="approach-container">
          
          {/* Left: Approach Steps */}
          <div className="approach-left">
            <h2 className="approach-heading">
              {title}
            </h2>

            {/* Desktop Horizontal Timeline */}
            <div className="approach-desktop-timeline">
              <div className="timeline-line" />
              <div className="timeline-grid">
                {steps.map((step) => (
                  <div key={step.id} className="timeline-step">
                    <div className="timeline-node">
                      {step.step}
                    </div>
                    <h4 className="timeline-title">{step.title}</h4>
                    <p className="timeline-desc">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Connected Vertical Timeline */}
            <div className="approach-mobile-timeline">
              {steps.map((step, idx) => (
                <div key={step.id} className="mobile-step-row">
                  <div className="mobile-node-col">
                    <div className="mobile-node">
                      {step.step}
                    </div>
                    {idx < steps.length - 1 && <div className="mobile-connector-line" />}
                  </div>
                  <div className="mobile-content-col">
                    <h4 className="mobile-step-title">{step.title}</h4>
                    <p className="mobile-step-desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: CTA Box */}
          <div className="approach-cta-box">
            <h3 className="approach-cta-title">{ctaTitle}</h3>
            <p className="approach-cta-desc">{ctaSubtitle}</p>
            <button 
              type="button"
              onClick={() => navigate(ctaBtnLink)} 
              className="approach-cta-btn"
            >
              {ctaBtnText} <FiArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>

      <style>{`
        .project-approach-section {
          width: 100%;
          padding: 24px 0 32px 0;
          background-color: #FFFFFF;
        }
        .project-approach-wrapper {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
        }
        .approach-container {
          background-color: #F8FAFC;
          border-radius: 20px;
          border: 1px solid #EEF2F7;
          padding: 32px 28px;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: stretch;
          box-sizing: border-box;
        }
        .approach-left {
          min-width: 0;
        }
        .approach-heading {
          font-size: clamp(24px, 2.8vw, 32px);
          font-weight: 800;
          color: #0A2A66;
          margin: 0 0 28px 0;
          font-family: 'Inter', sans-serif;
          line-height: 1.22;
          letter-spacing: -0.5px;
        }

        /* Desktop Timeline */
        .approach-desktop-timeline {
          position: relative;
          display: block;
        }
        .timeline-line {
          position: absolute;
          top: 19px;
          left: 20px;
          right: 20px;
          height: 0;
          border-top: 2px dashed #FFD6BF;
          z-index: 0;
        }
        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          position: relative;
          z-index: 1;
        }
        .timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-width: 0;
        }
        .timeline-node {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #FFFFFF;
          border: 2px solid #FF6B35;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FF6B35;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 2px 8px rgba(255,107,53,0.12);
          margin-bottom: 10px;
          z-index: 2;
        }
        .timeline-title {
          font-size: 15.5px;
          font-weight: 700;
          color: #0A2A66;
          margin: 0 0 4px 0;
          font-family: 'Inter', sans-serif;
        }
        .timeline-desc {
          font-size: 12px;
          font-weight: 400;
          line-height: 1.5;
          color: #64748B;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }

        /* Mobile Timeline (Hidden on Desktop) */
        .approach-mobile-timeline {
          display: none;
        }

        /* CTA Box */
        .approach-cta-box {
          background: linear-gradient(135deg, #001B5B 0%, #0A2A66 100%);
          border-radius: 16px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 260px;
          box-sizing: border-box;
        }
        .approach-cta-title {
          font-size: 22px;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.25;
          margin: 0 0 8px 0;
          font-family: 'Inter', sans-serif;
        }
        .approach-cta-desc {
          font-size: 13.5px;
          color: rgba(255,255,255,0.85);
          line-height: 1.6;
          margin: 0 0 20px 0;
          font-family: 'Inter', sans-serif;
        }
        .approach-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 44px;
          padding: 0 22px;
          background-color: #FF6B35;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          align-self: flex-start;
          transition: none !important;
          box-shadow: 0 4px 12px rgba(255,107,53,0.25);
        }

        /* Responsive Breakpoints */
        @media (max-width: 992px) {
          .approach-container {
            grid-template-columns: 1fr !important;
            gap: 26px !important;
            padding: 24px 20px !important;
          }
          .approach-desktop-timeline {
            display: none !important;
          }
          .approach-mobile-timeline {
            display: flex !important;
            flex-direction: column !important;
          }
          .mobile-step-row {
            display: flex;
            align-items: stretch;
            gap: 16px;
          }
          .mobile-node-col {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 38px;
            flex-shrink: 0;
          }
          .mobile-node {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #FFFFFF;
            border: 2px solid #FF6B35;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FF6B35;
            font-size: 13.5px;
            font-weight: 700;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 2px 8px rgba(255,107,53,0.12);
            flex-shrink: 0;
          }
          .mobile-connector-line {
            width: 2px;
            flex: 1;
            min-height: 22px;
            border-left: 2px dashed #FFD6BF;
            margin: 4px 0;
          }
          .mobile-content-col {
            flex: 1;
            padding-bottom: 22px;
            min-width: 0;
          }
          .mobile-step-title {
            font-size: 16px;
            font-weight: 700;
            color: #0A2A66;
            margin: 4px 0 3px 0;
            font-family: 'Inter', sans-serif;
          }
          .mobile-step-desc {
            font-size: 13px;
            color: #64748B;
            line-height: 1.5;
            margin: 0;
            font-family: 'Inter', sans-serif;
          }
          .approach-cta-box {
            min-height: auto !important;
            padding: 22px 20px !important;
          }
          .approach-cta-title {
            font-size: 20px !important;
          }
          .approach-cta-btn {
            width: 100% !important;
            max-width: 260px !important;
          }
        }

        @media (max-width: 480px) {
          .project-approach-wrapper {
            padding: 0 12px !important;
          }
          .approach-container {
            padding: 18px 14px !important;
            border-radius: 16px !important;
          }
          .approach-heading {
            font-size: clamp(21px, 5.2vw, 25px) !important;
            margin-bottom: 18px !important;
          }
          .mobile-step-row {
            gap: 12px !important;
          }
          .mobile-node {
            width: 32px !important;
            height: 32px !important;
            font-size: 12px !important;
          }
          .mobile-step-title {
            font-size: 15px !important;
          }
          .mobile-step-desc {
            font-size: 12.5px !important;
          }
          .approach-cta-box {
            padding: 18px 16px !important;
          }
          .approach-cta-title {
            font-size: 18.5px !important;
          }
          .approach-cta-desc {
            font-size: 12.5px !important;
            margin-bottom: 14px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ProjectApproachCTA;