import React, { useState } from 'react';
import { MapPin, User, Maximize2, Calendar, Layers } from 'lucide-react';
import projectsData from '../../data/projectsData';

const OurPresence = () => {
  const [activeLocation, setActiveLocation] = useState(null);

  const ongoingProjects = projectsData || [];

  const findProject = (location) => {
    if (!ongoingProjects.length) return null;
    return ongoingProjects.find(p => 
      p.location === location || 
      p.location?.includes(location) || 
      location.includes(p.location?.split(',')[0])
    ) || null;
  };

  const getProjectInfo = (location) => {
    const project = findProject(location);
    if (project) {
      return {
        title: project.name,
        location: `${project.location}, ${project.state}`,
        client: project.client,
        area: project.area,
        timeline: project.timeline || 'WIP',
        scope: project.scope
      };
    }
    return null;
  };

  const locations = [
    { id: 1, label: "Jamnagar, GJ", top: 51, left: 11, side: "left", arrow: 100, region: "WEST", info: getProjectInfo("Jamnagar") },
    { id: 2, label: "Mundra, GJ", top: 49, left: 11, side: "left", arrow: 100, region: "WEST", info: getProjectInfo("Mundra") },
    { id: 3, label: "Neemrana, RJ", top: 32, left: 30, side: "left", arrow: 160, region: "WEST", info: getProjectInfo("Neemrana") },
    { id: 4, label: "Surat, GJ", top: 56, left: 21, side: "left", arrow: 130, region: "WEST", info: getProjectInfo("Hazira") },
    { id: 5, label: "Dahej, GJ", top: 53, left: 20, side: "right", arrow: 350, region: "WEST", info: getProjectInfo("Dahej") },
    { id: 6, label: "Sanand, GJ", top: 49, left: 19, side: "right", arrow: 350, region: "WEST", info: getProjectInfo("GIDC Sanand") },
    { id: 7, label: "Ludhiana, PB", top: 22, left: 27, side: "left", arrow: 160, region: "NORTH", info: getProjectInfo("Ludhiana") },
    { id: 8, label: "Nuh, HR", top: 33, left: 32, side: "right", arrow: 200, region: "NORTH", info: getProjectInfo("Nuh") },
    { id: 9, label: "Najibabad, UP", top: 27, left: 36, side: "right", arrow: 160, region: "NORTH", info: getProjectInfo("Najibabad") },
    { id: 10, label: "Dhanbad, JH", top: 46, left: 60, side: "right", arrow: 145, region: "EAST", info: getProjectInfo("Dhanbad") },
    { id: 11, label: "Pune, MH", top: 63, left: 23, side: "left", arrow: 130, region: "SOUTH", info: getProjectInfo("Pune") },
    { id: 12, label: "Bangalore, KA", top: 80, left: 34, side: "left", arrow: 160, region: "SOUTH", info: getProjectInfo("Bangalore") },
    { id: 13, label: "Hyderabad, TG", top: 67, left: 38, side: "right", arrow: 100, region: "SOUTH", info: getProjectInfo("Hyderabad") },
    { id: 14, label: "Chennai, TN", top: 81, left: 42, side: "right", arrow: 90, region: "SOUTH", info: getProjectInfo("Chennai") },
    { id: 15, label: "Coimbatore, TN", top: 87, left: 33, side: "right", arrow: 120, region: "SOUTH", info: getProjectInfo("Coimbatore") },
  ].filter(loc => loc.info !== null);

  const regions = [
    { id: 'NORTH', title: 'NORTH GRID', color: '#ff733b' },
    { id: 'WEST', title: 'WEST CORRIDOR', color: '#ff8755' },
    { id: 'EAST', title: 'EAST & CENTRAL', color: '#2b5bc7' },
    { id: 'SOUTH', title: 'SOUTH SEGMENT', color: '#ff733b' },
  ];

  const handleToggleActive = (e, locId) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveLocation(prev => (prev === locId ? null : locId));
  };

  const LocationMarker = ({ loc }) => {
    const isActive = activeLocation === loc.id;
    const lineY = 20; 
    const color = '#ff8755';
    const arrowX = loc.side === 'left' ? -loc.arrow : loc.arrow;
    
    const markerOffsetX = 25;
    const finalArrowX = markerOffsetX + arrowX;
    const textX = loc.side === 'left' ? finalArrowX - 8 : finalArrowX + 8;
    const anchor = loc.side === 'left' ? 'end' : 'start';

    return (
      <div 
        onClick={(e) => handleToggleActive(e, loc.id)}
        style={{ 
          position: 'absolute', 
          top: `${loc.top}%`, 
          left: `${loc.left}%`, 
          cursor: 'pointer', 
          zIndex: isActive ? 600 : 40,
          width: '50px',
          height: '50px',
          transform: 'translate(-25px, -20px)',
          backgroundColor: 'transparent'
        }}
      >
        {isActive && loc.info && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{
              position: 'absolute', 
              bottom: '52px',
              left: loc.side === 'left' ? `${finalArrowX - 10}px` : `${finalArrowX + 10}px`,
              transform: loc.side === 'left' ? 'translateX(-88%)' : 'translateX(-12%)',
              width: '210px', 
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(12px)', 
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(226,232,240,0.95)', 
              borderRadius: '8px',
              padding: '10px', 
              boxShadow: '0 12px 24px -8px rgba(15,23,42,0.18)',
              cursor: 'default', 
              animation: 'popIn 0.22s cubic-bezier(0.34, 1.4, 0.64, 1)', 
              zIndex: 700
            }}
          >
            <h4 style={{ margin: '0 0 6px', fontSize: '11.5px', fontWeight: '800', color: '#0f172a', lineHeight: 1.25 }}>
              {loc.info.title}
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5px', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#475569' }}>
                <MapPin size={10.5} style={{ color: '#94a3b8', flexShrink: 0 }} />
                <span style={{ color: '#94a3b8', width: '52px', flexShrink: 0 }}>Location:</span>
                <strong style={{ color: '#334155' }}>{loc.info.location}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#475569' }}>
                <User size={10.5} style={{ color: '#94a3b8', flexShrink: 0 }} />
                <span style={{ color: '#94a3b8', width: '52px', flexShrink: 0 }}>Client:</span>
                <strong style={{ color: '#334155' }}>{loc.info.client}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#475569' }}>
                <Maximize2 size={10.5} style={{ color: '#94a3b8', flexShrink: 0 }} />
                <span style={{ color: '#94a3b8', width: '52px', flexShrink: 0 }}>Area:</span>
                <strong style={{ color: '#334155' }}>{loc.info.area}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#475569' }}>
                <Calendar size={10.5} style={{ color: '#94a3b8', flexShrink: 0 }} />
                <span style={{ color: '#94a3b8', width: '52px', flexShrink: 0 }}>Timeline:</span>
                <strong style={{ color: '#334155' }}>{loc.info.timeline}</strong>
              </div>
              <div style={{ display: 'flex', gap: '5px', marginTop: '2px', backgroundColor: '#f8fafc', padding: '5px', borderRadius: '5px', fontSize: '9.5px', color: '#334155', lineHeight: 1.25, border: '1px solid #f1f5f9' }}>
                <Layers size={10.5} style={{ color: '#64748b', flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '7.5px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1px' }}>Scope</strong>
                  {loc.info.scope}
                </div>
              </div>
            </div>
          </div>
        )}

        <svg style={{ position: 'absolute', overflow: 'visible', width: '100%', height: '100%', pointerEvents: 'auto' }}>
          <circle cx={markerOffsetX} cy={lineY} r={isActive ? 14 : 7} fill="none" stroke={color} strokeWidth="1.5" className={isActive ? "glow-active" : "glow-normal"} style={{ pointerEvents: 'none' }} />
          {isActive && <circle cx={markerOffsetX} cy={lineY} r="20" fill="none" stroke={color} strokeWidth="1" className="glow-outer" style={{ pointerEvents: 'none' }} />}
          
          <line 
            x1={markerOffsetX} y1={lineY} x2={finalArrowX} y2={lineY} 
            stroke={isActive ? '#ff5500' : '#cbd5e1'} 
            strokeWidth={isActive ? "3.5" : "1.8"} 
            strokeDasharray={loc.arrow}
            strokeDashoffset={isActive ? 0 : 0}
            className={isActive ? "arrow-grow-active arrow-pulse-smooth" : ""}
            style={{ transition: 'stroke-width 0.15s ease', cursor: 'pointer' }} 
          />
          
          <circle 
            cx={finalArrowX} cy={lineY} 
            r={isActive ? 3.5 : 2} 
            fill={isActive ? '#ff5500' : color} 
            className={isActive ? "title-reveal-active" : ""}
            style={{ cursor: 'pointer' }} 
          />
          
          <circle cx={markerOffsetX} cy={lineY} r={isActive ? 6.5 : 4} fill={isActive ? '#ff8d4b' : color} stroke="#fff" strokeWidth="2" style={{ filter: isActive ? `drop-shadow(0 0 6px ${color})` : 'none', transition: 'all 0.15s ease', cursor: 'pointer' }} />
          
          <text 
            x={textX} 
            y={lineY + 4} 
            fontSize={isActive ? "12.5px" : "10px"} 
            fontWeight={isActive ? "900" : "600"} 
            fill={isActive ? '#ff5500' : "#1e293b"} 
            textAnchor={anchor} 
            className={isActive ? "title-reveal-active" : ""}
            style={{ 
              fontFamily: 'system-ui, sans-serif', 
              textShadow: '0 1px 3px #fff, 0 0 5px #fff', 
              transition: 'all 0.15s ease',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            {loc.label.split(',')[0]}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <section style={{ padding: '100px 24px', backgroundColor: '#fafafa', overflow: 'hidden' }} onClick={() => setActiveLocation(null)}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px', alignItems: 'start' }} className="presence-grid" onClick={(e) => e.stopPropagation()}>
        
        {/* LEFT */}
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: '750', color: '#0f172a', marginBottom: '12px', letterSpacing: '-1px', lineHeight: 1.1 }}>OUR <span style={{ color: '#ff8755' }}>PRESENCE</span></h2>
          <p style={{ color: '#64748b', fontSize: '15.5px', lineHeight: '1.65', marginBottom: '36px' }}> Explore active nodes, glowing network lines, smart region clusters, and real-time telemetry signals powering nationwide monitoring </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {regions.map((region) => {
              const list = locations.filter(loc => loc.region === region.id);
              if (!list.length) return null;
              return (
                <div key={region.id} style={{ padding: '14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  <div style={{ fontSize: '10px', color: region.color, fontWeight: '900', marginBottom: '8px', letterSpacing: '0.8px' }}>{region.title}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px', fontSize: '12px' }}>
                    {list.map((loc, i, arr) => (
                      <span key={loc.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <button 
                          onClick={(e) => handleToggleActive(e, loc.id)}
                          style={{ 
                            border: 'none', 
                            background: activeLocation === loc.id ? '#ff8755' : 'transparent', 
                            color: activeLocation === loc.id ? '#fff' : '#475569', 
                            fontWeight: activeLocation === loc.id ? '800' : '600', 
                            fontSize: '11.5px', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            cursor: 'pointer',
                            transition: 'all 0.12s ease'
                          }}
                          className="region-pill-trigger"
                        >
                          {loc.label.split(',')[0]}
                        </button>
                        {i < arr.length - 1 && <span style={{ color: '#cbd5e1', marginLeft: '4px', pointerEvents: 'none' }}>•</span>}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT - MAP (Phone pe hide) */}
        <div className="map-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <img src="/indiaHigh.svg" alt="India Infrastructure Grid Layout" style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.96, userSelect: 'none' }} />
            
            {locations.map((loc) => (
              <LocationMarker key={loc.id} loc={loc} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .presence-grid { grid-template-columns: 1fr !important; gap: 50px !important; } }
        @media (max-width: 768px) { .map-wrapper { display: none !important; } }
        @keyframes popIn { 0% { opacity: 0; transform: translateY(10px) scale(0.97); filter: blur(2px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
        
        @keyframes glowNormal { 0%,100%{transform:scale(1); opacity:0.25} 50%{transform:scale(1.35); opacity:0.45} }
        .glow-normal { animation: glowNormal 3s ease-in-out infinite; transform-origin: 25px 20px; }
        
        @keyframes glowActive { 0%,100%{transform:scale(1); opacity:0.35} 50%{transform:scale(1.22); opacity:0.65} }
        .glow-active { animation: glowActive 2s ease-in-out infinite; transform-origin: 25px 20px; }
        
        @keyframes glowOuter { 0%{transform:scale(0.5); opacity:0} 30%{opacity:0.35} 100%{transform:scale(1.35); opacity:0} }
        .glow-outer { animation: glowOuter 1.6s cubic-bezier(0.16, 1, 0.3, 1) infinite; transform-origin: 25px 20px; }
        
        @keyframes lineGrowIn {
          0% { stroke-dashoffset: 100%; }
          100% { stroke-dashoffset: 0; }
        }
        .arrow-grow-active { animation: lineGrowIn 2s cubic-bezier(0.25, 1, 0.5, 1) forwards !important; }

        @keyframes titleReveal {
          0% { opacity: 0; filter: blur(1px); }
          50% { opacity: 0; }
          100% { opacity: 1; filter: blur(0); }
        }
        .title-reveal-active { animation: titleReveal 2s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

        @keyframes ambientLinePulse {
          0%, 100% { stroke: #ff5500; filter: drop-shadow(0 0 1px rgba(255,85,0,0.1)); }
          50% { stroke: #ff2200; filter: drop-shadow(0 0 6px rgba(255,50,0,0.6)); }
        }
        .arrow-pulse-smooth { animation: ambientLinePulse 2s ease-in-out infinite; }

        .region-pill-trigger:hover { color: #ff8755 !important; background-color: rgba(255,135,85,0.06) !important; }
      `}</style>
    </section>
  );
};

export default OurPresence;