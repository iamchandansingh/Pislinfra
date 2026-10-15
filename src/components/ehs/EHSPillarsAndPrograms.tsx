import React from 'react';
import { FiShield, FiFeather, FiHeart, FiBell } from 'react-icons/fi';

const pillarsData = [
  { 
    id: 'workplace', 
    icon: <FiShield size={26} />, 
    iconColor: '#1E88E5', 
    bgColor: '#EFF6FF',
    title: 'Workplace Safety', 
    description: 'Ensuring the safety of every individual through robust processes, training and behavioral safety programs.' 
  },
  { 
    id: 'environmental', 
    icon: <FiFeather size={26} />, 
    iconColor: '#22C55E', 
    bgColor: '#F0FDF4',
    title: 'Environmental Stewardship', 
    description: 'Minimizing our environmental footprint through responsible resource use and pollution prevention.' 
  },
  { 
    id: 'health', 
    icon: <FiHeart size={26} />, 
    iconColor: '#F97316', 
    bgColor: '#FFF7ED',
    title: 'Health & Well-being', 
    description: 'Promoting physical and mental well-being of our workforce and ensuring a healthy work environment.' 
  },
  { 
    id: 'emergency', 
    icon: <FiBell size={26} />, 
    iconColor: '#A855F7', 
    bgColor: '#FAF5FF',
    title: 'Emergency Preparedness', 
    description: 'Being prepared for emergencies with well-defined plans, drills and rapid response systems.' 
  },
];

const EHSPillarsAndPrograms = ({ pillars, title }: { pillars?: any[]; title?: string }) => {
  const activePillars = pillars && pillars.length > 0 
    ? pillars.map((p, i) => ({ 
        id: p.id || i, 
        icon: pillarsData[i]?.icon, 
        iconColor: pillarsData[i]?.iconColor, 
        bgColor: pillarsData[i]?.bgColor,
        title: p.title || pillarsData[i]?.title, 
        description: p.description || pillarsData[i]?.description 
      })) 
    : pillarsData;

  return (
    <div className="ehs-pillars-wrapper">
      <style>{`
        .ehs-pillars-wrapper {
          width: 100%;
          padding: 40px 0 50px 0;
          background-color: #FFFFFF;
          font-family: 'Inter', sans-serif;
        }
        .ehs-pillars-inner {
          width: 98%;
          max-width: 1370px;
          margin: 0 auto;
        }
        .ehs-pillars-title {
          font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 800;
          color: #052A73;
          letter-spacing: -0.8px;
          line-height: 1.2;
          margin: 0 0 6px 0;
        }
        .ehs-pillars-subtitle {
          font-size: clamp(13px, 1.8vw, 15px);
          font-weight: 400;
          color: #64748B;
          line-height: 1.6;
          margin: 0 0 28px 0;
        }
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .pillar-card {
          background-color: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .pillar-icon-box {
          width: 50px;
          height: 50px;
          min-width: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pillar-card-title {
          font-size: 17px;
          font-weight: 700;
          color: #052A73;
          line-height: 1.3;
          margin: 0 0 6px 0;
        }
        .pillar-card-desc {
          font-size: 13.5px;
          font-weight: 400;
          color: #64748B;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 1100px) {
          .pillars-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 18px !important;
          }
        }

        @media (max-width: 640px) {
          .ehs-pillars-wrapper {
            padding: 28px 16px 36px 16px !important;
            box-sizing: border-box !important;
          }
          .ehs-pillars-inner {
            width: 100% !important;
          }
          .ehs-pillars-title {
            font-size: clamp(22px, 5.5vw, 26px) !important;
            margin-bottom: 4px !important;
          }
          .ehs-pillars-subtitle {
            font-size: 13px !important;
            margin-bottom: 20px !important;
          }
          .pillars-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .pillar-card {
            padding: 16px 16px !important;
            border-radius: 14px !important;
            gap: 12px !important;
          }
          .pillar-icon-box {
            width: 44px !important;
            height: 44px !important;
            min-width: 44px !important;
            border-radius: 10px !important;
          }
          .pillar-icon-box svg {
            width: 22px !important;
            height: 22px !important;
          }
          .pillar-card-title {
            font-size: 15.5px !important;
            margin-bottom: 4px !important;
          }
          .pillar-card-desc {
            font-size: 12.5px !important;
            line-height: 1.55 !important;
          }
        }

        @media (max-width: 360px) {
          .ehs-pillars-wrapper {
            padding: 24px 12px 32px 12px !important;
          }
          .pillar-card {
            padding: 14px 12px !important;
          }
          .pillar-icon-box {
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
          }
          .pillar-card-title {
            font-size: 14.5px !important;
          }
          .pillar-card-desc {
            font-size: 12px !important;
          }
        }
      `}</style>

      <div className="ehs-pillars-inner">
        <h2 className="ehs-pillars-title">
          {title || "Our EHS Pillars"}
        </h2>
        <p className="ehs-pillars-subtitle">
          Four strong pillars that drive our EHS performance.
        </p>
        
        <div className="pillars-grid">
          {activePillars.map((pillar) => (
            <div 
              key={pillar.id} 
              className="pillar-card"
            >
              <div 
                className="pillar-icon-box"
                style={{ 
                  backgroundColor: pillar.bgColor, 
                  color: pillar.iconColor 
                }}
              >
                {pillar.icon}
              </div>
              <div>
                <h3 className="pillar-card-title">{pillar.title}</h3>
                <p className="pillar-card-desc">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EHSPillarsAndPrograms;