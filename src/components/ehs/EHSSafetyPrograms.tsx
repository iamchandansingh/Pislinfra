import React from 'react';
import { FiTool, FiClipboard, FiSearch, FiBell, FiMapPin, FiUserCheck } from 'react-icons/fi';

interface Program {
  id: string;
  icon: React.ReactNode;
  iconColor: string;
  title: string;
}

const programsData: Program[] = [
  { id: 'ppe', icon: <FiTool size={28} strokeWidth={1.8} />, iconColor: '#2563EB', title: 'PPE Compliance' },
  { id: 'toolbox', icon: <FiClipboard size={28} strokeWidth={1.8} />, iconColor: '#F97316', title: 'Toolbox Talks' },
  { id: 'inspections', icon: <FiSearch size={28} strokeWidth={1.8} />, iconColor: '#22C55E', title: 'Site Inspections & Audits' },
  { id: 'drills', icon: <FiBell size={28} strokeWidth={1.8} />, iconColor: '#EF4444', title: 'Emergency Drills' },
  { id: 'behavior', icon: <FiMapPin size={28} strokeWidth={1.8} />, iconColor: '#84CC16', title: 'Behavior Based Safety' },
  { id: 'reporting', icon: <FiUserCheck size={28} strokeWidth={1.8} />, iconColor: '#A855F7', title: 'Incident Reporting & Learning' },
];

const EHSSafetyPrograms: React.FC<any> = ({ programs, title }) => {
  const activePrograms = programs && programs.length > 0 
    ? programs.map((p, i) => ({ 
        id: p.id || i, 
        icon: programsData[i]?.icon, 
        iconColor: programsData[i]?.iconColor, 
        title: p.title 
      })) 
    : programsData;

  return (
    <div className="ehs-programs-wrapper">
      <style>{`
        .ehs-programs-wrapper {
          width: 100%;
          padding: 24px 0 36px 0;
          background-color: #FFFFFF;
          font-family: 'Inter', sans-serif;
        }
        .ehs-programs-inner {
          width: 98%;
          max-width: 1370px;
          margin: 0 auto;
        }
        .ehs-programs-card {
          background-color: #F8FAFC;
          border: 1px solid #EEF2F7;
          border-radius: 18px;
          padding: 32px;
        }
        .ehs-programs-title {
          font-size: clamp(22px, 3.2vw, 28px);
          font-weight: 800;
          color: #052A73;
          line-height: 1.2;
          letter-spacing: -0.5px;
          margin: 0 0 6px 0;
        }
        .ehs-programs-subtitle {
          font-size: clamp(12.5px, 1.6vw, 13.5px);
          font-weight: 400;
          color: #64748B;
          line-height: 1.5;
          margin: 0 0 24px 0;
        }
        .programs-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          background-color: #EEF2F7;
          border: 1px solid #EEF2F7;
          border-radius: 14px;
          overflow: hidden;
          gap: 1px;
        }
        .program-item {
          padding: 24px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: #FFFFFF;
        }
        .program-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          line-height: 0;
        }
        .program-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #1E293B;
          line-height: 1.35;
          margin: 0;
        }

        @media (max-width: 1200px) {
          .programs-grid { 
            grid-template-columns: repeat(3, 1fr); 
          }
        }

        @media (max-width: 768px) {
          .ehs-programs-wrapper {
            padding: 0 16px 28px 16px !important;
            box-sizing: border-box !important;
          }
          .ehs-programs-inner {
            width: 100% !important;
          }
          .ehs-programs-card {
            padding: 20px 14px !important;
            border-radius: 16px !important;
          }
          .ehs-programs-title {
            font-size: clamp(19px, 5vw, 24px) !important;
            margin-bottom: 4px !important;
          }
          .ehs-programs-subtitle {
            font-size: 12.5px !important;
            margin-bottom: 18px !important;
          }
          .programs-grid { 
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            border-radius: 12px !important;
          }
          .program-item {
            padding: 14px 12px !important;
            gap: 10px !important;
          }
          .program-icon svg {
            width: 22px !important;
            height: 22px !important;
          }
          .program-title {
            font-size: clamp(11.5px, 3.1vw, 13px) !important;
            line-height: 1.3 !important;
          }
        }

        @media (max-width: 360px) {
          .program-item {
            padding: 12px 8px !important;
            gap: 8px !important;
          }
          .program-icon svg {
            width: 20px !important;
            height: 20px !important;
          }
          .program-title {
            font-size: 11px !important;
          }
        }
      `}</style>

      <div className="ehs-programs-inner">
        <div className="ehs-programs-card">
          <h2 className="ehs-programs-title">
            {title || "Our Safety Programs"}
          </h2>
          <p className="ehs-programs-subtitle">
            Structured programs that promote safety culture and drive zero harm.
          </p>

          <div className="programs-grid">
            {activePrograms.map((program) => (
              <div key={program.id} className="program-item">
                <span 
                  className="program-icon"
                  style={{ color: program.iconColor }}
                >
                  {program.icon}
                </span>
                <h3 className="program-title">
                  {program.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EHSSafetyPrograms;