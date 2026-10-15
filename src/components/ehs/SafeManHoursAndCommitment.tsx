import React, { useState, useEffect, useRef } from 'react';
import { FiTarget, FiBookOpen, FiCheckSquare, FiFeather, FiCheck } from 'react-icons/fi';

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  FiTarget,
  FiBookOpen,
  FiCheckSquare,
  FiFeather,
  FiCheck
};

const chartData = [
  { year: 'Upto 2018', h: 1.8 }, 
  { year: '2018-19', h: 2.7 }, 
  { year: '2019-20', h: 3.6 },
  { year: '2020-21', h: 6.2 }, 
  { year: '2021-22', h: 7.4 }, 
  { year: '2022-23', h: 10.2 }, 
  { year: '2023-24', h: 16.0 }, 
  { year: '2024-25', h: 23.4 },
  { year: '2025-26', h: 31.6 }
];

const AnimatedBar = ({ value, maxValue, label }: { value: number; maxValue: number; label: string }) => {
  const [barPercent, setBarPercent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarPercent(0);
          const target = Math.min(100, Math.max(3.5, (value / maxValue) * 100));
          const timer = setTimeout(() => {
            setBarPercent(target);
          }, 120);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, maxValue]);

  return (
    <div ref={ref} className="animated-bar-col">
      <div 
        className="animated-bar-fill" 
        style={{ 
          height: `${barPercent}%`,
          minHeight: barPercent > 0 ? '6px' : '0px'
        }} 
      >
        <div className="animated-bar-value">{value}M</div>
      </div>
      <div className="chart-year-label">{label}</div>
    </div>
  );
};

const SafeManHoursAndCommitment = ({ features, title }: { features?: any[]; title?: string }) => {
  const defaultFeatures = [
    { id: '1', iconName: 'FiTarget', title: 'Strategic EHS Planning', description: 'Implementing proactive safety methodologies.' },
    { id: '2', iconName: 'FiBookOpen', title: 'Advanced Training Modules', description: 'Interactive hazard identification workshops.' },
    { id: '3', iconName: 'FiCheckSquare', title: 'Strict Safety Audits', description: 'Rigorous compliance checking.' },
    { id: '4', iconName: 'FiFeather', title: 'Safe & Sustainable Future', description: 'Protecting people, environment and communities.' },
  ];

  const featuresData = features && features.length > 0 ? features : defaultFeatures;

  return (
    <div className="ehs-commitment-wrapper">
      <style>{`
        .ehs-commitment-wrapper {
          width: 100%;
          padding: 40px 0;
          background-color: #FFFFFF;
        }
        .ehs-commitment-inner {
          width: 98%;
          max-width: 1370px;
          margin: 0 auto;
        }
        .ehs-commitment-container {
          background-color: #FAFBFC;
          border: 1px solid #EEF2F7;
          border-radius: 20px;
          padding: 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }
        .ehs-chart-col {
          display: flex;
          flex-direction: column;
        }
        .ehs-chart-title {
          font-size: clamp(20px, 2.4vw, 28px);
          font-weight: 800;
          color: #052A73;
          line-height: 1.25;
          margin: 0 0 4px 0;
          font-family: 'Inter', sans-serif;
        }
        .ehs-chart-change {
          font-size: clamp(13px, 1.6vw, 15px);
          font-weight: 700;
          color: #16A34A;
          margin: 0 0 16px 0;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ehs-chart-desc {
          font-size: clamp(12.5px, 1.4vw, 13.5px);
          color: #64748B;
          line-height: 1.55;
          margin: 0 0 20px 0;
          font-family: 'Inter', sans-serif;
        }
        .ehs-chart-wrapper {
          display: flex;
          height: 330px;
          position: relative;
          width: 100%;
        }
        .ehs-y-axis {
          width: 44px;
          flex-shrink: 0;
          position: relative;
          height: 100%;
        }
        .ehs-y-axis-labels {
          position: absolute;
          top: 30px;
          bottom: 56px;
          left: 0;
          right: 0;
        }
        .ehs-y-label {
          position: absolute;
          right: 8px;
          transform: translateY(50%);
          font-size: 11px;
          font-weight: 600;
          color: #94A3B8;
          font-family: 'Inter', sans-serif;
          line-height: 1;
        }
        .ehs-bar-container {
          flex: 1;
          position: relative;
          height: 100%;
          background: linear-gradient(180deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.005) 100%);
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.02);
        }
        .ehs-plot-area {
          position: absolute;
          top: 30px;
          bottom: 56px;
          left: 6px;
          right: 6px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .ehs-grid-line {
          position: absolute;
          left: 0;
          right: 0;
          border-top: 1px dashed #E2E8F0;
          pointer-events: none;
        }
        .animated-bar-col {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          position: relative;
          z-index: 2;
          padding: 0 2px;
        }
        .animated-bar-value {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 4px;
          font-size: 10.5px;
          font-weight: 800;
          color: #052A73;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
          letter-spacing: -0.2px;
          pointer-events: none;
        }
        .animated-bar-fill {
          position: relative;
          width: clamp(14px, 2.2vw, 28px);
          background: linear-gradient(180deg, #22C55E 0%, #16A34A 100%);
          border-radius: 4px 4px 0 0;
          box-shadow: 0 2px 6px rgba(34, 197, 94, 0.2);
          transition: height 2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .chart-year-label {
          position: absolute;
          top: 100%;
          margin-top: 8px;
          font-size: 9.5px;
          font-weight: 600;
          color: #64748B;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
          transform: rotate(-45deg);
          transform-origin: 100% 0;
          right: 50%;
        }

        .ehs-text-col {
          padding-left: 28px;
          border-left: 2px solid rgba(34, 197, 94, 0.4);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .ehs-text-title {
          font-size: clamp(20px, 2.3vw, 26px);
          font-weight: 800;
          color: #052A73;
          line-height: 1.25;
          margin: 0 0 12px 0;
          font-family: 'Inter', sans-serif;
        }
        .ehs-text-desc {
          font-size: clamp(12.5px, 1.4vw, 13.5px);
          line-height: 1.65;
          color: #64748B;
          margin: 0 0 20px 0;
          font-family: 'Inter', sans-serif;
        }
        .ehs-features-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ehs-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .ehs-feature-icon-box {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 10px;
          background-color: #ECFDF5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #22C55E;
        }
        .ehs-feature-title {
          font-size: 15px;
          font-weight: 700;
          color: #052A73;
          margin: 0 0 2px 0;
          font-family: 'Inter', sans-serif;
        }
        .ehs-feature-desc {
          font-size: 12px;
          line-height: 1.5;
          color: #64748B;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }

        @media (max-width: 1100px) {
          .ehs-commitment-container {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .ehs-text-col {
            padding-left: 0;
            border-left: none;
            padding-top: 32px;
            border-top: 1px solid #E2E8F0;
          }
        }

        @media (max-width: 768px) {
          .ehs-commitment-wrapper {
            padding: 0 16px 28px 16px !important;
            box-sizing: border-box !important;
          }
          .ehs-commitment-inner {
            width: 100% !important;
          }
          .ehs-commitment-container {
            padding: 20px 14px !important;
            border-radius: 16px !important;
            gap: 28px !important;
          }
          .ehs-chart-title {
            font-size: clamp(19px, 5vw, 24px) !important;
            line-height: 1.25 !important;
          }
          .ehs-chart-change {
            font-size: clamp(12.5px, 3.4vw, 14px) !important;
            margin-bottom: 12px !important;
          }
          .ehs-chart-desc {
            font-size: 12.5px !important;
            margin-bottom: 18px !important;
          }
          .ehs-chart-wrapper {
            height: 310px !important;
          }
          .ehs-y-axis {
            width: 32px !important;
          }
          .ehs-y-axis-labels {
            top: 26px !important;
            bottom: 54px !important;
          }
          .ehs-y-label {
            font-size: 9.5px !important;
            right: 4px !important;
          }
          .ehs-plot-area {
            top: 26px !important;
            bottom: 54px !important;
            left: 3px !important;
            right: 3px !important;
          }
          .animated-bar-col {
            padding: 0 1px !important;
          }
          .animated-bar-value {
            font-size: clamp(8px, 2.3vw, 9.5px) !important;
            margin-bottom: 3px !important;
          }
          .animated-bar-fill {
            width: clamp(13px, 3.3vw, 18px) !important;
            border-radius: 3px 3px 0 0 !important;
          }
          .chart-year-label {
            font-size: clamp(7.5px, 2.1vw, 9px) !important;
            margin-top: 6px !important;
            transform: rotate(-48deg) !important;
            transform-origin: 100% 0 !important;
            right: 50% !important;
          }
          .ehs-text-col {
            padding-top: 24px !important;
          }
          .ehs-text-title {
            font-size: clamp(18px, 4.8vw, 22px) !important;
            line-height: 1.25 !important;
            margin-bottom: 10px !important;
          }
          .ehs-text-desc {
            font-size: 12.5px !important;
            line-height: 1.6 !important;
            margin-bottom: 18px !important;
          }
          .ehs-features-list {
            gap: 12px !important;
          }
          .ehs-feature-item {
            gap: 10px !important;
          }
          .ehs-feature-icon-box {
            width: 38px !important;
            height: 38px !important;
            min-width: 38px !important;
            border-radius: 9px !important;
          }
          .ehs-feature-icon-box svg {
            width: 20px !important;
            height: 20px !important;
          }
          .ehs-feature-title {
            font-size: 14px !important;
            margin-bottom: 2px !important;
          }
          .ehs-feature-desc {
            font-size: 11.5px !important;
            line-height: 1.45 !important;
          }
        }

        @media (max-width: 360px) {
          .ehs-commitment-container {
            padding: 16px 10px !important;
          }
          .ehs-y-axis {
            width: 26px !important;
          }
          .ehs-y-label {
            font-size: 8.5px !important;
            right: 2px !important;
          }
          .animated-bar-fill {
            width: 11px !important;
          }
          .animated-bar-value {
            font-size: 7.5px !important;
            letter-spacing: -0.4px !important;
          }
          .chart-year-label {
            font-size: 7.5px !important;
          }
        }
      `}</style>

      <div className="ehs-commitment-inner">
        <div className="ehs-commitment-container">
          
          <div className="ehs-chart-col">
            <h2 className="ehs-chart-title">{title || "Safe Man Hours Growth"}</h2>
            <p className="ehs-chart-change">Change From Last Month 7,37,083</p>
            <p className="ehs-chart-desc">Our consistent focus on safety has helped us achieve industry-leading safe man hours over the years.</p>
            
            <div className="ehs-chart-wrapper">
              <div className="ehs-y-axis">
                <div className="ehs-y-axis-labels">
                  {[40, 30, 20, 10, 0].map(v => (
                    <div 
                      key={v} 
                      className="ehs-y-label"
                      style={{ bottom: `${(v / 40) * 100}%` }}
                    >
                      {v}M
                    </div>
                  ))}
                </div>
              </div>

              <div className="ehs-bar-container">
                <div className="ehs-plot-area">
                  {[0, 10, 20, 30, 40].map(v => (
                    <div 
                      key={v} 
                      className="ehs-grid-line"
                      style={{ bottom: `${(v / 40) * 100}%` }} 
                    />
                  ))}
                  {chartData.map((d, i) => (
                    <AnimatedBar key={i} value={d.h} maxValue={40} label={d.year} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="ehs-text-col">
            <h3 className="ehs-text-title">At Pislinfra, safety is not just a priority, it's a core value.</h3>
            <p className="ehs-text-desc">We are spreading the "ZERO HARM IS POSSIBLE" belief by eliminating all injuries and work-related ill health through prevention, training and continuous improvement.</p>
            
            <div className="ehs-features-list">
              {featuresData.map((f, i) => {
                const Icon = iconMap[f.iconName] || FiCheck;
                return (
                  <div key={i} className="ehs-feature-item">
                    <div className="ehs-feature-icon-box">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 className="ehs-feature-title">{f.title}</h4>
                      <p className="ehs-feature-desc">{f.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SafeManHoursAndCommitment;
