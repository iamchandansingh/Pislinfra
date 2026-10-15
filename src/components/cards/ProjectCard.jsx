import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import { HiOutlineShieldCheck } from 'react-icons/hi2';
import clientsData from '../../data/clientsData';
import { getImageUrl, getProjectSlug } from '../../utils/imageUrl';

const getClientInfo = (clientName) => {
  if (!clientName) return [];
  
  const clientNames = clientName
    .split(/[,/&]|\band\b/i)
    .map(n => n.trim())
    .filter(n => n.length > 0);

  return clientNames.map(name => {
    let client = clientsData.find(c => c.name === name);
    if (client) return { logo: client.logo, name: client.name };
    
    client = clientsData.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (client) return { logo: client.logo, name: client.name };
    
    client = clientsData.find(c => 
      c.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(c.name.toLowerCase())
    );
    if (client) return { logo: client.logo, name: client.name };
    
    const shortNames = {
      'Adani Group': 'Adani',
      'Reliance': 'Reliance Industries Limited',
      'Reliance Industries': 'Reliance Industries Limited',
      'RIL': 'Reliance Industries Limited',
      'AMNS': 'AM/NS India (ArcelorMittal Nippon Steel India)',
      'ArcelorMittal': 'AM/NS India (ArcelorMittal Nippon Steel India)',
      'AM/NS': 'AM/NS India (ArcelorMittal Nippon Steel India)',
      'PRR Group': 'Prologis',
      'PRR': 'Prologis',
      'Pislinfra': 'GAR',
      'PISL': 'GAR',
      'Engineers India': 'EIL (Engineers India Limited)',
      'EIL': 'EIL (Engineers India Limited)',
      'CPWD': 'CPWD (Central Public Works Department)',
    };
    
    const mappedName = shortNames[name];
    if (mappedName) {
      client = clientsData.find(c => c.name === mappedName);
      if (client) return { logo: client.logo, name: client.name };
    }
    
    client = clientsData.find(c => 
      c.name.toLowerCase().includes(name.toLowerCase().split('(')[0].trim())
    );
    if (client) return { logo: client.logo, name: client.name };
    
    return { logo: null, name: name };
  });
};

const ProjectCard = ({ project, type, isSelected = false }) => {
  const navigate = useNavigate();

  const isOngoing = project?.status === 'Ongoing' || project?.status === 'ongoing' || type === 'ongoing';
  const defaultFallback = isOngoing ? '/images/hero/Ongoing-Projects.png' : '/images/hero/Completed-Projects.png';
  const rawCover = project?.images?.[0] || project?.image;
  const coverImage = getImageUrl(rawCover, defaultFallback);

  const clientInfoList = getClientInfo(project.client);

  const handleClick = (e) => {
    e.stopPropagation();
    const projectType = type || (isOngoing ? 'ongoing' : 'completed');
    const slug = getProjectSlug(project);
    navigate(`/project/${projectType}/${slug}`, { state: { projectData: project } });
  };

  const accentColor = isOngoing ? '#ff8755' : '#198847';

  return (
    <>
      <div 
        className={`premium-project-card ${isSelected ? 'selected' : ''}`}
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: isSelected ? `2px solid ${accentColor}` : '1px solid #e8ecf1',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
          position: 'relative',
          zIndex: isSelected ? 10 : 1,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 14px rgba(5, 42, 115, 0.04)',
          transition: 'none',
        }}
        onClick={handleClick}
      >
        <div className="project-card-img-wrap" style={{
          height: '185px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#f1f5f9'
        }}>
          {/* Background Image - static, zero hover animation */}
          <img 
            className="project-card-image"
            src={coverImage}
            alt={project.name || "Project"}
            loading="lazy"
            onError={(e) => {
              if (!e.currentTarget.src.includes(defaultFallback)) {
                e.currentTarget.src = defaultFallback;
              }
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'none',
              transform: 'none',
            }}
          />
          
          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.3) 100%)',
            pointerEvents: 'none'
          }} />

          {/* Status Badge on Bottom-Right */}
          <div style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            zIndex: 5,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '9.5px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            background: isOngoing ? 'rgba(254, 243, 199, 0.95)' : 'rgba(209, 250, 229, 0.95)',
            color: isOngoing ? '#92400e' : '#065f46',
            backdropFilter: 'blur(4px)',
            border: `1px solid ${isOngoing ? 'rgba(253, 230, 138, 0.5)' : 'rgba(167, 243, 208, 0.5)'}`,
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
            fontFamily: 'Inter, sans-serif'
          }}>
            <span style={{ 
              width: 6, 
              height: 6, 
              borderRadius: '50%', 
              backgroundColor: isOngoing ? '#f59e0b' : '#10b981',
              flexShrink: 0,
            }} />
            {isOngoing ? 'Ongoing' : 'Completed'}
          </div>
          
          {isSelected && (
            <div style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 5,
              background: accentColor,
              color: '#ffffff',
              padding: '3px 10px',
              borderRadius: '4px',
              fontSize: '8px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>
              <FaMapMarkerAlt size={9} /> Active
            </div>
          )}
        </div>

        <div style={{ padding: '16px 16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <h3 style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#0f172a',
            margin: '0 0 10px',
            lineHeight: '1.38',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif',
            minHeight: '41px'
          }}>
            {project.name}
          </h3>

          <div style={{ 
            height: '1px', 
            backgroundColor: '#f1f5f9', 
            marginBottom: '10px' 
          }} />

          {/* Details: Location */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '6px 8px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #f1f5f9', minWidth: 0 }}>
              <FaMapMarkerAlt style={{ color: accentColor, fontSize: '11px', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: '8px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Location</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#334155', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project.location || project.city || 'Pan India'}{project.state ? `, ${project.state}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Client Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'nowrap',
            marginTop: 'auto',
            paddingTop: '10px',
            borderTop: '1px solid #f8fafc'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0
            }}>
              {clientInfoList.slice(0, 3).map((client, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid #e2e8f0',
                    marginLeft: idx > 0 ? '-10px' : '0',
                    zIndex: 3 - idx,
                    padding: 3,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  }}
                  title={client.name}
                >
                  {client.logo ? (
                    <img 
                      src={client.logo} 
                      alt={client.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <FaBuilding style={{ color: '#94a3b8', fontSize: '15px' }} />
                  )}
                </div>
              ))}
              {clientInfoList.length > 3 && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#64748b',
                  marginLeft: '6px',
                }}>
                  +{clientInfoList.length - 3}
                </span>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontSize: '11.5px',
                fontWeight: '700',
                color: '#334155',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'Inter, sans-serif'
              }}>
                {clientInfoList.map(c => c.name).join(', ') || project.client || 'Pislinfra Client'}
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: '500', color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                {project.timeline || (isOngoing ? 'Under Execution' : 'Completed')}
              </span>
            </div>

            {clientInfoList.some(c => c.logo) && (
              <HiOutlineShieldCheck 
                size={16} 
                style={{ color: '#10b981', flexShrink: 0 }} 
                title="Verified Client"
              />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .premium-project-card {
          box-shadow: 0 4px 14px rgba(5, 42, 115, 0.04) !important;
          transition: none !important;
          transform: none !important;
        }
        .premium-project-card:hover {
          transform: none !important;
          box-shadow: 0 4px 14px rgba(5, 42, 115, 0.04) !important;
          border-color: #e8ecf1 !important;
        }
        .project-card-image {
          transition: none !important;
          transform: none !important;
        }
        .premium-project-card:hover .project-card-image {
          transform: none !important;
        }
        .premium-project-card.selected {
          box-shadow: 0 12px 32px ${accentColor}30 !important;
        }
        @media (max-width: 600px) {
          .project-card-img-wrap {
            height: clamp(170px, 48vw, 200px) !important;
          }
        }
      `}</style>
    </>
  );
};

export default ProjectCard;