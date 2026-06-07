import React, { useState, useEffect, useRef } from 'react';
import { FiShield, FiBookOpen, FiUsers, FiFeather } from 'react-icons/fi';

const features = [
  { id: '1', icon: <FiShield size={24} />, title: 'Proactive Risk Management', desc: 'Identifying and mitigating risks before they occur.' },
  { id: '2', icon: <FiBookOpen size={24} />, title: 'Continuous Training', desc: 'Building awareness and capability at every level.' },
  { id: '3', icon: <FiUsers size={24} />, title: 'Leadership Involvement', desc: 'Strong leadership driving a culture of safety.' },
  { id: '4', icon: <FiFeather size={24} />, title: 'Safe & Sustainable Future', desc: 'Protecting people, environment and communities.' },
];

const chartData = [
  { year: '2018', h: 1.8 }, { year: '2019-20', h: 2.7 }, { year: '2020-21', h: 3.6 },
  { year: '2021-22', h: 6.2 }, { year: '2022-23', h: 10.2 }, { year: '2023-24', h: 16.0 }, { year: '2024-25', h: 18.4 },
];

const AnimatedBar = ({ value, maxValue, label }: { value: number; maxValue: number; label: string }) => {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset and start animation
          setHeight(0);
          const targetHeight = (value / maxValue) * 260;
          
          // Small delay then animate
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
    <div ref={ref} style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#052A73', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>{value}M</div>
      <div style={{ 
        width: '36px', 
        height: `${height}px`, 
        background: 'linear-gradient(180deg, #22C55E 0%, #16A34A 100%)', 
        borderRadius: '4px 4px 0 0', 
        minHeight: height > 0 ? '6px' : '0px', 
        boxShadow: '0 2px 6px rgba(34,197,94,0.15)',
        transition: 'height 3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }} />
      <div style={{ fontSize: '10px', fontWeight: 500, color: '#64748B', marginTop: '6px', fontFamily: 'Inter, sans-serif', position: 'absolute', bottom: '-28px' }}>{label}</div>
    </div>
  );
};

const SafeManHoursAndCommitment = () => (
  <div style={{ width: '100%', padding: '40px 0', backgroundColor: '#FFF' }}>
    <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto' }}>
      <div className="ec" style={{
        backgroundColor: '#FAFBFC', border: '1px solid #EEF2F7', borderRadius: '20px',
        padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr',
      }}>
        
        <div style={{ paddingRight: '28px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#052A73', lineHeight: 1.2, margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>Safe Man Hours Growth</h2>
          <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: '0 0 20px 0', fontFamily: 'Inter, sans-serif' }}>Our consistent focus on safety has helped us achieve industry-leading safe man hours over the years.</p>
          
          <div style={{ display: 'flex', height: '320px', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '12px', paddingBottom: '28px', paddingTop: '24px', width: '50px', flexShrink: 0 }}>
              {[20, 15, 10, 5, 0].map(v => (
                <div key={v} style={{ fontSize: '11px', fontWeight: 500, color: '#94A3B8', textAlign: 'right', fontFamily: 'Inter, sans-serif' }}>{v}M</div>
              ))}
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', background: 'linear-gradient(180deg, rgba(34,197,94,0.04) 0%, rgba(34,197,94,0) 100%)', borderRadius: '8px', border: '1px solid #E5E7EB', borderBottom: '2px solid #E5E7EB', padding: '20px 10px 40px 10px', position: 'relative' }}>
              {[0, 5, 10, 15, 20].map(v => (
                <div key={v} style={{ position: 'absolute', left: 0, right: 0, bottom: `${(v / 20) * 260 + 40}px`, borderTop: '1px dashed #E5E7EB', opacity: 0.4 }} />
              ))}
              {chartData.map((d, i) => (
                <AnimatedBar key={i} value={d.h} maxValue={20} label={d.year} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ paddingLeft: '28px', borderLeft: '2px solid rgba(34,197,94,0.5)' }}>
          <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#052A73', lineHeight: 1.2, margin: '0 0 12px 0', fontFamily: 'Inter, sans-serif' }}>At PISL, safety is not just a priority, it's a core value.</h3>
          <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#64748B', margin: '0 0 20px 0', fontFamily: 'Inter, sans-serif' }}>We are spreading the "ZERO HARM IS POSSIBLE" belief by eliminating all injuries and work-related ill health through prevention, training and continuous improvement.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map(f => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#22C55E', display: 'flex' }}>{f.icon}</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#052A73', margin: '0 0 2px 0', fontFamily: 'Inter, sans-serif' }}>{f.title}</h4>
                  <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#64748B', margin: 0, fontFamily: 'Inter, sans-serif' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
    <style>{`@media (max-width: 1100px) { .ec { grid-template-columns: 1fr !important; } }`}</style>
  </div>
);

export default SafeManHoursAndCommitment;