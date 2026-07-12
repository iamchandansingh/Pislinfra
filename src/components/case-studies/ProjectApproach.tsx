import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const timelineSteps = [
  { id: 1, step: '01', title: 'Understand', description: 'We deeply understand the client\'s needs.' },
  { id: 2, step: '02', title: 'Plan', description: 'We create smart, feasible and efficient plans.' },
  { id: 3, step: '03', title: 'Execute', description: 'We execute with precision and strict quality control.' },
  { id: 4, step: '04', title: 'Deliver', description: 'We deliver on time with safety and quality.' },
  { id: 5, step: '05', title: 'Optimize', description: 'We ensure long-term value and sustainability.' },
];

const ProjectApproachCTA = () => {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', padding: '20px 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
        <div className="approach-container" style={{
          backgroundColor: '#F8FAFC', borderRadius: '20px', padding: '28px',
          display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start',
        }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0A2A66', marginBottom: '28px', fontFamily: 'Inter, sans-serif', lineHeight: 1.2 }}>
              Our Approach That Delivers Results
            </h2>
            <div style={{ position: 'relative' }}>
              <div className="timeline-line" style={{ position: 'absolute', top: '18px', left: '18px', right: '18px', height: 0, borderTop: '2px dashed #FFD6BF', zIndex: 0 }} />
              <div className="timeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', position: 'relative', zIndex: 1 }}>
                {timelineSteps.map((step) => (
                  <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '2px solid #FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B35', fontSize: '14px', fontWeight: 700, fontFamily: 'Inter, sans-serif', boxShadow: '0 2px 8px rgba(255,107,53,0.12)', marginBottom: '10px', zIndex: 2 }}>{step.step}</div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0A2A66', margin: '0 0 4px 0', fontFamily: 'Inter, sans-serif' }}>{step.title}</h4>
                    <p style={{ fontSize: '12px', fontWeight: 400, lineHeight: 1.5, color: '#6B7280', margin: 0, fontFamily: 'Inter, sans-serif' }}>{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #001B5B 0%, #0A2A66 100%)', borderRadius: '14px', padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '280px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, margin: '0 0 10px 0', fontFamily: 'Inter, sans-serif' }}>Have a Project in Mind?</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '0 0 18px 0', fontFamily: 'Inter, sans-serif' }}>Let's build something extraordinary together.</p>
            <button onClick={() => navigate('/contact-us')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', height: '44px', padding: '0 22px', backgroundColor: '#FF6B35', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', alignSelf: 'flex-start', boxShadow: '0 4px 12px rgba(255,107,53,0.2)' }}>
              Get In Touch <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 1100px) {
          .approach-container { grid-template-columns: 1fr !important; }
          .timeline-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .timeline-line { display: none; }
        }
        @media (max-width: 700px) {
          .timeline-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .timeline-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ProjectApproachCTA;