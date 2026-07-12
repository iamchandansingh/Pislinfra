import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import { HiOutlineShieldCheck } from 'react-icons/hi2';
import clientsData from '../../data/clientsData';

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
      'PISL Infra': 'GAR',
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

  const coverImage = project?.images?.[0] 
    || project?.image 
    || 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600';

  const clientInfoList = getClientInfo(project.client);

  const handleClick = (e) => {
    e.stopPropagation();
    const projectType = type || (project.status === 'Ongoing' ? 'ongoing' : 'completed');
    const projectSlug = project.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    navigate(`/project/${projectType}/${projectSlug}`);
  };

  const isOngoing = project.status === 'Ongoing' || type === 'ongoing';
  const accentColor = isOngoing ? '#ff8755' : '#198847';

  return (
    <>
      <div 
        className={`premium-project-card ${isSelected ? 'selected' : ''}`}
        style={{
          borderRadius: '6px',
          overflow: 'hidden',
          border: isSelected ? `2px solid ${accentColor}` : '1px solid #e8ecf1',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
          position: 'relative',
          zIndex: isSelected ? 10 : 1,
        }}
        onClick={handleClick}
      >
        <div style={{
          height: '180px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background Image that scales on hover */}
          <div 
            className="project-card-image"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 60%)',
            pointerEvents: 'none'
          }} />

          {/* Badges */}
          <div style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            zIndex: 5,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '2px',
            fontSize: '9px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            background: isOngoing ? 'rgba(254, 243, 199, 0.95)' : 'rgba(209, 250, 229, 0.95)',
            color: isOngoing ? '#92400e' : '#065f46',
            backdropFilter: 'blur(4px)',
            border: `1px solid ${isOngoing ? 'rgba(253, 230, 138, 0.5)' : 'rgba(167, 243, 208, 0.5)'}`,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
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
              borderRadius: '2px',
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

        <div style={{ padding: '16px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <h3 style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#0f172a',
            margin: '0 0 12px',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {project.name}
          </h3>

          <div style={{ 
            height: '1px', 
            backgroundColor: '#f1f5f9', 
            marginBottom: '12px' 
          }} />

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '6px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
              <FaMapMarkerAlt style={{ color: accentColor, fontSize: '11px', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span style={{ display: 'block', fontSize: '8px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#334155', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.location}, {project.state}</span>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginTop: 'auto',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
            }}>
              {clientInfoList.slice(0, 3).map((client, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid #e2e8f0',
                    marginLeft: idx > 0 ? '-10px' : '0',
                    zIndex: 3 - idx,
                    padding: 4,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
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
                    <FaBuilding style={{ color: '#94a3b8', fontSize: '16px' }} />
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
                fontSize: '11px',
                fontWeight: '700',
                color: '#334155',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {clientInfoList.map(c => c.name).join(', ')}
              </span>
              <span style={{ fontSize: '10px', fontWeight: '500', color: '#94a3b8' }}>{project.timeline || 'N/A'}</span>
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
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease;
        }
        .premium-project-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(10, 42, 102, 0.1);
          border-color: #cbd5e1 !important;
        }
        .premium-project-card.selected {
          box-shadow: 0 12px 32px ${accentColor}30;
        }
        .project-card-image {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .premium-project-card:hover .project-card-image {
          transform: scale(1.08);
        }
      `}</style>
    </>
  );
};

export default ProjectCard;