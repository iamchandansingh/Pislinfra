import React from 'react';
import { FiShield, FiCheckCircle } from 'react-icons/fi';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';
const FONT = 'Inter, sans-serif';

const SafetyCulture = ({ title, desc }) => {
  const ppeItems = [
    'Hard hat / Safety helmet',
    'High visibility vest',
    'Safety glasses with side shields',
    'Steel-toe safety boots',
    'Hearing protection (as needed)',
    'Cut-resistant gloves',
    'Full-length work pants',
    'Face shield (as needed)'
  ];

  return (
    <div className="safety-culture-wrapper">
      <style>{`
        .safety-culture-wrapper {
          font-family: ${FONT};
          padding: 70px 24px;
          max-width: 1370px;
          margin: 0 auto;
          background-color: #ffffff;
        }

        .safety-culture-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }

        /* Worker Image Box */
        .safety-worker-box {
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(10, 42, 102, 0.07);
          height: 640px;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          border: 1px solid #EEF2F7;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .safety-worker-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 24px;
          display: block;
        }

        /* Content Column */
        .safety-culture-content {
          padding-left: 10px;
        }

        .safety-culture-header {
          margin-bottom: 28px;
        }

        .safety-culture-title {
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 800;
          color: ${NAVY};
          margin: 0 0 14px;
          letter-spacing: -0.8px;
          line-height: 1.2;
        }

        .safety-culture-desc {
          font-size: 15px;
          line-height: 1.7;
          color: #475569;
          margin: 0 0 14px;
        }

        .safety-culture-subdesc {
          font-size: 14.5px;
          line-height: 1.7;
          color: #64748b;
          margin: 0;
        }

        /* PTP Card */
        .safety-ptp-card {
          background: #f8fafc;
          border-radius: 14px;
          padding: 20px 22px;
          border: 1px solid #e2e8f0;
          border-left: 4px solid ${NAVY};
          margin-bottom: 22px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .safety-ptp-title {
          font-size: 16.5px;
          font-weight: 700;
          color: ${NAVY};
          margin: 0 0 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .safety-ptp-desc {
          font-size: 13.5px;
          line-height: 1.65;
          color: #64748b;
          margin: 0;
        }

        /* PPE Card */
        .safety-ppe-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 20px 22px;
          border: 1px solid #e2e8f0;
          border-left: 4px solid ${ORANGE};
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .safety-ppe-title {
          font-size: 16.5px;
          font-weight: 700;
          color: ${NAVY};
          margin: 0 0 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .safety-ppe-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px 16px;
          font-size: 13px;
          color: #475569;
        }

        .safety-ppe-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .safety-ppe-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: ${NAVY};
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .safety-culture-wrapper {
            padding: 40px 16px 48px 16px !important;
          }
          .safety-culture-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .safety-worker-box {
            height: clamp(280px, 72vw, 380px) !important;
            border-radius: 14px !important;
          }
          .safety-worker-img {
            padding: 16px !important;
          }
          .safety-culture-content {
            padding-left: 0 !important;
          }
          .safety-culture-title {
            font-size: clamp(22px, 5.5vw, 28px) !important;
            margin-bottom: 12px !important;
          }
          .safety-culture-desc {
            font-size: 13.5px !important;
            line-height: 1.6 !important;
            margin-bottom: 12px !important;
          }
          .safety-culture-subdesc {
            font-size: 13px !important;
            line-height: 1.6 !important;
          }
          .safety-ptp-card {
            padding: 16px 16px !important;
            margin-bottom: 18px !important;
          }
          .safety-ptp-title {
            font-size: 15px !important;
          }
          .safety-ptp-desc {
            font-size: 12.5px !important;
          }
          .safety-ppe-card {
            padding: 16px 16px !important;
          }
          .safety-ppe-title {
            font-size: 15px !important;
          }
        }

        @media (max-width: 520px) {
          .safety-ppe-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          .safety-ppe-item {
            font-size: 12.5px !important;
          }
        }

        @media (max-width: 360px) {
          .safety-culture-wrapper {
            padding: 32px 12px 40px 12px !important;
          }
          .safety-worker-box {
            height: 260px !important;
          }
          .safety-culture-title {
            font-size: 21px !important;
          }
        }
      `}</style>

      <div className="safety-culture-grid">
        
        {/* LEFT: Worker Image */}
        <div className="safety-worker-box">
          <img 
            src="/images/safety/safety.png"
            alt="PISL Safety Worker" 
            className="safety-worker-img"
            loading="lazy"
          />
        </div>

        {/* RIGHT: Content */}
        <div className="safety-culture-content">
          
          {/* Safety Culture Heading */}
          <div className="safety-culture-header">
            <h2 className="safety-culture-title">
              {title || <>Safety <span style={{ color: NAVY }}>Culture</span></>}
            </h2>
            
            <p className="safety-culture-desc">
              {desc || "Safety is built through awareness, responsibility, and teamwork. Every individual is encouraged to follow proactive safety practices, maintain workplace discipline, and contribute towards a safer environment across every project."}
            </p>
            
            <p className="safety-culture-subdesc">
              Continuous training sessions, toolbox talks, safety briefings, and operational planning help strengthen safety standards while protecting workers, teams, and surrounding communities.
            </p>
          </div>

          {/* Pre-Task Planning */}
          <div className="safety-ptp-card">
            <h3 className="safety-ptp-title">
              <FiShield size={17} color={NAVY} />
              Pre-Task Planning Resources
            </h3>
            <p className="safety-ptp-desc">
              The Pre-Task Planning (PTP) process ensures employees and subcontractors take ownership of safety goals, identify risks before work begins, and execute tasks with proper preparation and accountability.
            </p>
          </div>

          {/* PPE Guidelines */}
          <div className="safety-ppe-card">
            <h3 className="safety-ppe-title">
              <FiCheckCircle size={17} color={ORANGE} />
              PPE Requirements
            </h3>
            <div className="safety-ppe-grid">
              {ppeItems.map((item, i) => (
                <div key={i} className="safety-ppe-item">
                  <span className="safety-ppe-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SafetyCulture;