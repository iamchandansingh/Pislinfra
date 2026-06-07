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
    <div style={{
      borderRadius: '12px',
      overflow: 'hidden',
      border: isSelected ? `2px solid ${accentColor}` : '1px solid #e8ecf1',
      backgroundColor: '#ffffff',
      boxShadow: isSelected 
        ? `0 12px 32px ${accentColor}20` 
        : '0 1px 4px rgba(0, 0, 0, 0.04)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      zIndex: isSelected ? 10 : 1,
    }}
      onClick={handleClick}
    >
      <div style={{
        height: '180px',
        backgroundImage: `url(${coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%)',
        }} />

        <div style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          zIndex: 5,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 8px',
          borderRadius: '3px',
          fontSize: '8px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
          background: isOngoing ? '#fef3c7' : '#d1fae5',
          color: isOngoing ? '#92400e' : '#065f46',
          border: `0.5px solid ${isOngoing ? '#fde68a' : '#a7f3d0'}`,
        }}>
          <span style={{ 
            width: 5, 
            height: 5, 
            borderRadius: '50%', 
            backgroundColor: isOngoing ? '#f59e0b' : '#10b981',
            flexShrink: 0,
          }} />
          {isOngoing ? 'Ongoing' : 'Completed'}
        </div>
        
        {isSelected && (
          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 5,
            background: accentColor,
            color: '#ffffff',
            padding: '2px 8px',
            borderRadius: '3px',
            fontSize: '7px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}>
            <FaMapMarkerAlt size={7} /> Active
          </div>
        )}
      </div>

      <div style={{ padding: '14px 16px 16px' }}>
        
        <h3 style={{
          fontSize: '14px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 10px',
          lineHeight: '1.35',
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
          marginBottom: '10px' 
        }} />

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px',
          marginBottom: '10px',
        }}>
          <FaMapMarkerAlt style={{ color: accentColor, fontSize: '10px', flexShrink: 0 }} />
          <span style={{ 
            color: '#64748b', 
            fontSize: '11px', 
            fontWeight: '500',
          }}>
            {project.location}, {project.state}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
          }}>
            {clientInfoList.slice(0, 3).map((client, idx) => (
              <div
                key={idx}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid #e2e8f0',
                  marginLeft: idx > 0 ? '-10px' : '0',
                  zIndex: 3 - idx,
                  padding: 5,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
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
                  <FaBuilding style={{ color: '#94a3b8', fontSize: '18px' }} />
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

          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#475569',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {clientInfoList.map(c => c.name).join(', ')}
          </span>

          {clientInfoList.some(c => c.logo) && (
            <HiOutlineShieldCheck 
              size={13} 
              style={{ color: '#22c55e', flexShrink: 0 }} 
              title="Verified Client"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;