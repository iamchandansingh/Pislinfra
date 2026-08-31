import React, { useState, useEffect, useRef } from 'react';
import * as FiIcons from 'react-icons/fi';

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
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeight(0);
          const targetHeight = (value / maxValue) * 260;
          setTimeout(() => {
            setHeight(targetHeight);
          }, 100);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, maxValue]);

  return (
    <div ref={ref} className="animated-bar-col" style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
      <div className="animated-bar-value" style={{ fontSize: '10px', fontWeight: 700, color: '#052A73', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>{value}M</div>
      <div className="animated-bar-fill" style={{ 
        width: '32px', 
        height: `${height}px`, 
        background: 'linear-gradient(180deg, #22C55E 0%, #16A34A 100%)', 
        borderRadius: '4px 4px 0 0', 
        minHeight: height > 0 ? '6px' : '0px', 
        boxShadow: '0 2px 6px rgba(34,197,94,0.15)',
        transition: 'height 3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }} />
      <div className="chart-year-label" style={{ fontSize: '10px', fontWeight: 500, color: '#64748B', marginTop: '6px', fontFamily: 'Inter, sans-serif', position: 'absolute', bottom: '-28px' }}>{label}</div>
    </div>
  );
};

const SafeManHoursAndCommitment = ({ features, title }) => {
  const defaultFeatures = [
    { id: '1', iconName: 'FiTarget', title: 'Strategic EHS Planning', description: 'Implementing proactive safety methodologies.' },
    { id: '2', iconName: 'FiBookOpen', title: 'Advanced Training Modules', description: 'Interactive hazard identification workshops.' },
    { id: '3', iconName: 'FiCheckSquare', title: 'Strict Safety Audits', description: 'Rigorous compliance checking.' },
    { id: '4', iconName: 'FiFeather', title: 'Safe & Sustainable Future', description: 'Protecting people, environment and communities.' },
  ];

  const featuresData = features && features.length > 0 ? features : defaultFeatures;

  return (
    <div style={{ width: '100%', padding: '40px 0', backgroundColor: '#FFF' }}>
      <style>{`
        .ehs-commitment-container {
          background-color: #FAFBFC;
          border: 1px solid #EEF2F7;
          border-radius: 20px;
          padding: 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        .ehs-chart-col {
          padding-right: 28px;
        }
        .ehs-text-col {
          padding-left: 28px;
          border-left: 2px solid rgba(34,197,94,0.5);
        }
        .ehs-chart-wrapper {
          display: flex;
          height: 320px;
          position: relative;
        }
        .ehs-bar-container {
          flex: 1;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          background: linear-gradient(180deg, rgba(34,197,94,0.04) 0%, rgba(34,197,94,0) 100%);
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          border-bottom: 2px solid #E5E7EB;
          padding: 20px 10px 40px 10px;
          position: relative;
        }
        
        @media (max-width: 1100px) {
          .ehs-commitment-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .ehs-chart-col {
            padding-right: 0;
          }
          .ehs-text-col {
            padding-left: 0;
            border-left: none;
            padding-top: 40px;
            border-top: 2px solid rgba(34,197,94,0.5);
          }
        }
        
        @media (max-width: 768px) {
          .ehs-commitment-container {
            padding: 24px 16px;
            border-radius: 12px;
            gap: 32px;
          }
          .ehs-chart-wrapper {
            height: 280px;
          }
          .ehs-bar-container {
            padding: 10px 2px 40px 2px;
          }
          .animated-bar-fill {
            width: 18px !important;
          }
          .animated-bar-col {
            margin: 0 1px;
          }
          .animated-bar-value {
            font-size: 8px !important;
          }
          .chart-year-label {
            font-size: 7px !important;
            bottom: -32px !important;
            transform: rotate(-45deg);
            transform-origin: top left;
            white-space: nowrap;
          }
          .ehs-text-col {
            padding-top: 24px;
          }
        }
      `}</style>
      <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
        <div className="ehs-commitment-container">
          
          <div className="ehs-chart-col">
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#052A73', lineHeight: 1.2, margin: '0 0 4px 0', fontFamily: 'Inter, sans-serif' }}>{title || "Safe Man Hours Growth"}</h2>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#16A34A', margin: '0 0 20px 0', fontFamily: 'Inter, sans-serif' }}>Change From Last Month 7,37,083</p>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: '0 0 20px 0', fontFamily: 'Inter, sans-serif' }}>Our consistent focus on safety has helped us achieve industry-leading safe man hours over the years.</p>
            
            <div className="ehs-chart-wrapper">
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '12px', paddingBottom: '28px', paddingTop: '24px', width: '50px', flexShrink: 0 }}>
                {[40, 30, 20, 10, 0].map(v => (
                  <div key={v} style={{ fontSize: '11px', fontWeight: 500, color: '#94A3B8', textAlign: 'right', fontFamily: 'Inter, sans-serif' }}>{v}M</div>
                ))}
              </div>

              <div className="ehs-bar-container">
                {[0, 10, 20, 30, 40].map(v => (
                  <div key={v} style={{ position: 'absolute', left: 0, right: 0, bottom: `${(v / 40) * 260 + 40}px`, borderTop: '1px dashed #E5E7EB', opacity: 0.4 }} />
                ))}
                {chartData.map((d, i) => (
                  <AnimatedBar key={i} value={d.h} maxValue={40} label={d.year} />
                ))}
              </div>
            </div>
          </div>

          <div className="ehs-text-col">
            <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#052A73', lineHeight: 1.2, margin: '0 0 12px 0', fontFamily: 'Inter, sans-serif' }}>At PISL, safety is not just a priority, it's a core value.</h3>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#64748B', margin: '0 0 20px 0', fontFamily: 'Inter, sans-serif' }}>We are spreading the "ZERO HARM IS POSSIBLE" belief by eliminating all injuries and work-related ill health through prevention, training and continuous improvement.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {featuresData.map((f, i) => {
                const Icon = FiIcons[f.iconName] || FiIcons.FiCheck;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#22C55E', display: 'flex' }}><Icon size={24} /></span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#052A73', margin: '0 0 2px 0', fontFamily: 'Inter, sans-serif' }}>{f.title}</h4>
                      <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#64748B', margin: 0, fontFamily: 'Inter, sans-serif' }}>{f.description}</p>
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
