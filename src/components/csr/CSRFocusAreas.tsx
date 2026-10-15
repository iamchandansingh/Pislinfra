import React from 'react';
import { 
  FiBookOpen, 
  FiHeart, 
  FiFeather, 
  FiUsers, 
  FiSmile, 
  FiGlobe, 
  FiShield, 
  FiCheckCircle 
} from 'react-icons/fi';

interface FocusAreaItem {
  id?: string | number;
  title?: string;
  description?: string;
  iconName?: string;
  iconColor?: string;
  image?: any;
}

interface CSRFocusAreasProps {
  areas?: FocusAreaItem[];
}

const defaultAreas: FocusAreaItem[] = [
  {
    id: 'education',
    title: 'Education',
    description: 'Empowering children and youth through quality education and skill development programs.',
    iconName: 'FiBookOpen',
    iconColor: '#6366F1',
    image: '/images/CSR/Education.png',
  },
  {
    id: 'health',
    title: 'Health & Well-being',
    description: 'Improving healthcare accessibility and promoting well-being in communities.',
    iconName: 'FiHeart',
    iconColor: '#EC4899',
    image: '/images/CSR/Health.jpeg',
  },
  {
    id: 'environment',
    title: 'Environment',
    description: 'Promoting sustainability through green initiatives, conservation and responsible practices.',
    iconName: 'FiFeather',
    iconColor: '#22C55E',
    image: '/images/CSR/CSR-(7).png',
  },
  {
    id: 'community',
    title: 'Community Development',
    description: 'Building stronger communities through infrastructure, livelihood and welfare programs.',
    iconName: 'FiUsers',
    iconColor: '#F97316',
    image: '/images/CSR/Community.jpeg',
  },
];

const getIcon = (name?: string, size = 24) => {
  switch (name) {
    case 'FiBookOpen': return <FiBookOpen size={size} />;
    case 'FiHeart': return <FiHeart size={size} />;
    case 'FiFeather': return <FiFeather size={size} />;
    case 'FiUsers': return <FiUsers size={size} />;
    case 'FiSmile': return <FiSmile size={size} />;
    case 'FiGlobe': return <FiGlobe size={size} />;
    case 'FiShield': return <FiShield size={size} />;
    case 'FiCheckCircle': return <FiCheckCircle size={size} />;
    default: return <FiUsers size={size} />;
  }
};

const getImageUrl = (img: any, fallback?: string): string => {
  if (!img) return fallback || '';
  if (typeof img === 'string') return img;
  if (img.url) {
    return img.url.startsWith('http') ? img.url : `${img.url}`;
  }
  return fallback || '';
};

const getTint = (color?: string) => {
  if (!color) return 'rgba(5, 42, 115, 0.08)';
  if (color.startsWith('#') && color.length === 7) {
    return `${color}14`;
  }
  return 'rgba(5, 42, 115, 0.08)';
};

const CSRFocusAreas: React.FC<CSRFocusAreasProps> = ({ areas }) => {
  const focusAreas = areas && areas.length > 0 ? areas : defaultAreas;

  return (
    <section className="csr-focus-section">
      <div className="csr-focus-container">
        
        <div className="csr-focus-header">
          <div className="csr-focus-badge">CORE FOCUS SECTORS</div>
          <h2 className="csr-focus-title">Areas Where We Make A Difference</h2>
          <p className="csr-focus-sub">Targeted interventions creating sustainable, inclusive growth and lasting positive outcomes across communities.</p>
        </div>

        <div className="focus-grid">
          {focusAreas.map((area, idx) => {
            const fallback = defaultAreas[idx % defaultAreas.length];
            const iconColor = area.iconColor || fallback?.iconColor || '#6366F1';
            const bgTint = getTint(iconColor);
            const imgSrc = getImageUrl(area.image, fallback?.image);

            return (
              <div key={area.id || idx} className="focus-card">
                
                <div className="focus-card-body">
                  <div className="focus-icon-wrap" style={{ backgroundColor: bgTint, color: iconColor }}>
                    {getIcon(area.iconName, 24)}
                  </div>
                  <h3 className="focus-card-title">{area.title || fallback?.title}</h3>
                  <p className="focus-card-desc">{area.description || fallback?.description}</p>
                </div>

                <div className="focus-card-img-wrap">
                  <img
                    src={imgSrc}
                    alt={area.title || 'Focus Area'}
                    loading="lazy"
                    className="focus-card-img"
                  />
                </div>

              </div>
            );
          })}
        </div>

      </div>
      <style>{`
        .csr-focus-section {
          width: 100%;
          padding: 44px 0 54px 0;
          background-color: #FFFFFF;
        }
        .csr-focus-container {
          width: 98%;
          max-width: 1370px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .csr-focus-header {
          text-align: center;
          margin-bottom: 34px;
        }
        .csr-focus-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #FF6B35;
          background: #FFF4EE;
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 10px;
          font-family: 'Inter', sans-serif;
        }
        .csr-focus-title {
          font-size: clamp(24px, 3.2vw, 34px);
          font-weight: 800;
          color: #052A73;
          line-height: 1.2;
          margin: 0;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.6px;
        }
        .csr-focus-sub {
          font-size: clamp(13px, 1.8vw, 15px);
          color: #64748B;
          line-height: 1.6;
          max-width: 620px;
          margin: 10px auto 0 auto;
          font-family: 'Inter', sans-serif;
        }
        .focus-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          box-sizing: border-box;
        }
        .focus-card {
          background-color: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(5, 42, 115, 0.04);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          transition: none !important;
        }
        .focus-card-body {
          padding: 22px 18px 16px 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .focus-icon-wrap {
          width: 52px;
          height: 52px;
          min-width: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          flex-shrink: 0;
        }
        .focus-icon-wrap svg {
          width: 24px;
          height: 24px;
        }
        .focus-card-title {
          font-size: 20px;
          font-weight: 700;
          color: #052A73;
          line-height: 1.25;
          margin: 0 0 8px 0;
          font-family: 'Inter', sans-serif;
        }
        .focus-card-desc {
          font-size: 13px;
          color: #64748B;
          line-height: 1.6;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }
        .focus-card-img-wrap {
          padding: 0 16px 16px 16px;
          box-sizing: border-box;
          width: 100%;
        }
        .focus-card-img {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          object-fit: cover;
          display: block;
        }

        /* Tablet Responsive (<= 1100px) */
        @media (max-width: 1100px) {
          .focus-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 18px !important;
          }
          .csr-focus-container {
            padding: 0 20px;
          }
        }

        /* Mobile Responsive (<= 768px) */
        @media (max-width: 768px) {
          .csr-focus-section {
            padding: 28px 0 36px 0 !important;
          }
          .csr-focus-container {
            padding: 0 16px !important;
          }
          .csr-focus-header {
            margin-bottom: 24px !important;
          }
          .csr-focus-badge {
            font-size: 10.5px !important;
            padding: 4px 10px !important;
            margin-bottom: 8px !important;
          }
          .csr-focus-title {
            font-size: clamp(22px, 5.5vw, 26px) !important;
            line-height: 1.22 !important;
          }
          .csr-focus-sub {
            font-size: 13px !important;
            margin-top: 8px !important;
          }
          .focus-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .focus-card {
            border-radius: 14px !important;
          }
          .focus-card-body {
            padding: 18px 14px 12px 14px !important;
          }
          .focus-icon-wrap {
            width: 46px !important;
            height: 46px !important;
            min-width: 46px !important;
            border-radius: 12px !important;
            margin-bottom: 10px !important;
          }
          .focus-icon-wrap svg {
            width: 22px !important;
            height: 22px !important;
          }
          .focus-card-title {
            font-size: 18px !important;
            margin-bottom: 6px !important;
          }
          .focus-card-desc {
            font-size: 12.5px !important;
            line-height: 1.55 !important;
          }
          .focus-card-img-wrap {
            padding: 0 14px 14px 14px !important;
          }
          .focus-card-img {
            height: clamp(150px, 44vw, 180px) !important;
            border-radius: 10px !important;
          }
        }

        /* Small Phones (<= 380px) */
        @media (max-width: 380px) {
          .csr-focus-container {
            padding: 0 12px !important;
          }
          .csr-focus-title {
            font-size: 20px !important;
          }
          .focus-card-title {
            font-size: 17px !important;
          }
          .focus-card-desc {
            font-size: 12px !important;
          }
          .focus-card-img {
            height: 140px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CSRFocusAreas;
