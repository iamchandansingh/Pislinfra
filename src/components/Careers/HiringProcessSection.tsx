import React from 'react';
import { FileText, ClipboardCheck, Briefcase, Users, BadgeCheck } from 'lucide-react';

// Types
interface ProcessStep {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Process Data
const processSteps: ProcessStep[] = [
  {
    id: 1,
    icon: <FileText size={24} />,
    title: 'Apply Online',
    description: 'Submit your application through our career portal with updated resume.',
  },
  {
    id: 2,
    icon: <ClipboardCheck size={24} />,
    title: 'Initial Screening',
    description: 'We review your profile and conduct a shortlisting assessment.',
  },
  {
    id: 3,
    icon: <Briefcase size={24} />,
    title: 'Technical Interview',
    description: 'Discussion with our technical team to assess your skills and experience.',
  },
  {
    id: 4,
    icon: <Users size={24} />,
    title: 'HR Discussion',
    description: 'HR round to understand your goals, expectations and cultural fit.',
  },
  {
    id: 5,
    icon: <BadgeCheck size={24} />,
    title: 'Offer Letter',
    description: 'Successful candidates receive the offer letter within 2-5 working days.',
  },
];

// Main Component
const HiringProcessSection: React.FC = () => {
  return (
    <section style={{ width: '100%', marginTop: '70px', marginBottom: '70px' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1350px', 
        margin: '0 auto',
        paddingLeft: '8px', 
        paddingRight: '8px',
      }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: 700,
            color: '#1E2A5A',
            margin: '0 0 16px 0',
            lineHeight: 1.2,
          }}>
            Our Hiring <span style={{ color: '#FF6B35' }}>Process</span>
          </h2>
          
          {/* Orange Underline */}
          <div style={{
            width: '60px',
            height: '4px',
            backgroundColor: '#FF6B35',
            borderRadius: '999px',
            margin: '0 auto',
          }} />
        </div>

        {/* Timeline Container */}
        <div style={{ position: 'relative', padding: '0 20px' }}>
          
          {/* Horizontal Connecting Line - Desktop only */}
          <div style={{
            position: 'absolute',
            top: '36px',
            left: '8%',
            right: '8%',
            height: '2px',
            backgroundColor: '#E5EAF2',
            zIndex: 0,
          }}
          className="timeline-line" />

          {/* Steps - Left to Right Layout */}
          <div className="process-grid">
            {processSteps.map((step) => (
              <div key={step.id} style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '16px',
                position: 'relative',
                zIndex: 1,
                padding: '12px 0',
              }}>
                {/* Step Circle */}
                <div style={{
                  width: '72px',
                  height: '72px',
                  minWidth: '72px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #FFD6BF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}>
                  <span style={{ color: '#FF6B35', display: 'flex', lineHeight: 0 }}>
                    {step.icon}
                  </span>
                </div>

                {/* Content */}
                <div>
                  {/* Title */}
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1E2A5A',
                    marginBottom: '6px',
                    lineHeight: 1.3,
                  }}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: '#64748B',
                    margin: 0,
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Responsive Styles */}
      <style>{`
        .process-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 16px;
        }
        .timeline-line {
          display: none;
        }
        @media (min-width: 768px) {
          .process-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1100px) {
          .process-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 24px;
          }
          .timeline-line {
            display: block;
          }
          .process-grid > div {
            flex-direction: column !important;
            text-align: center;
          }
          .process-grid > div > div:last-child {
            text-align: center;
          }
        }
        @media (max-width: 1099px) {
          .timeline-line {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HiringProcessSection;