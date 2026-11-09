import React, { useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import clientsData from '../../data/clientsData';
import { getImageUrl } from '../../utils/imageUrl';

const LOCAL_GALLERY_FALLBACKS: Record<string, string> = {
  'ppe training session': '/images/EHS/PPE-Training-Session.png',
  'site safety inspection': '/images/EHS/Site-Safety-Inspection.png',
  'fire safety drill': '/images/EHS/Fire-Safety-Drill.png',
  'emergency mock drill': '/images/EHS/Emergency-Mock-Drill.png',
};

const defaultGalleryItems = [
  { id: '1', title: 'PPE Training Session',   image: '/images/EHS/PPE-Training-Session.png' },
  { id: '2', title: 'Site Safety Inspection', image: '/images/EHS/Site-Safety-Inspection.png' },
  { id: '3', title: 'Fire Safety Drill',      image: '/images/EHS/Fire-Safety-Drill.png' },
  { id: '4', title: 'Emergency Mock Drill',   image: '/images/EHS/Emergency-Mock-Drill.png' },
];

const resolveGalleryImage = (item: any, index: number): string => {
  const fallback = defaultGalleryItems[index % defaultGalleryItems.length]?.image || '/images/EHS/PPE-Training-Session.png';
  if (!item) return fallback;

  const itemTitle = (item.title || defaultGalleryItems[index]?.title || '').toLowerCase().trim();
  const knownPath = LOCAL_GALLERY_FALLBACKS[itemTitle];

  // If item.image is a direct string path that exists
  if (typeof item.image === 'string' && item.image.trim()) {
    const trimmed = item.image.trim();
    if (trimmed.startsWith('/images/EHS/')) return trimmed;
  }

  // If img object from Strapi or CMS
  const imgObj = item.image || item.img;
  if (imgObj) {
    if (typeof imgObj === 'string' && imgObj.trim()) {
      if (imgObj.startsWith('/images/EHS/')) return imgObj;
      const url = getImageUrl(imgObj, knownPath || fallback);
      if (url && !url.includes('undefined')) return url;
    } else if (typeof imgObj === 'object') {
      // Prefer original url over non-existent medium/small format prefixes
      const directUrl = imgObj.url || imgObj.attributes?.url;
      if (directUrl && typeof directUrl === 'string') {
        const resolvedDirect = getImageUrl(directUrl, knownPath || fallback);
        if (resolvedDirect && !resolvedDirect.includes('undefined')) return resolvedDirect;
      }
      const resolved = getImageUrl(imgObj, knownPath || fallback);
      if (resolved && !resolved.includes('undefined')) return resolved;
    }
  }

  return knownPath || fallback;
};

const CertificationsAndEHSAction = ({ gallery, title }: { gallery?: any[]; title?: string }) => {
  const activeGallery = gallery && gallery.length > 0 
    ? gallery.map((g, i) => ({ 
        id: g.id || i, 
        title: g.title || defaultGalleryItems[i]?.title, 
        image: resolveGalleryImage(g, i) 
      })) 
    : defaultGalleryItems;

  const displayTitle = title && !title.toLowerCase().startsWith('certifications')
    ? title
    : 'EHS in Action';

  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const allClients = ['Adani', 'Reliance Industries Limited', 'AM/NS India (ArcelorMittal Nippon Steel India)', 'Flipkart', 'Amazon', 'DHL'];
  const clientLogos = allClients.map(name => clientsData.find(c => c.name === name)).filter(Boolean);

  useEffect(() => {
    if (clientLogos.length <= 3) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 3 >= clientLogos.length ? 0 : prev + 3));
    }, 3000);
    return () => clearInterval(interval);
  }, [clientLogos.length]);

  const visibleClients = clientLogos.slice(currentSlide, currentSlide + 3);
  while (visibleClients.length < 3 && clientLogos.length > 0) {
    visibleClients.push(clientLogos[visibleClients.length % clientLogos.length]);
  }

  return (
    <div className="ehs-action-wrapper">
      <style>{`
        .ehs-action-wrapper {
          width: 100%;
          padding: 20px 0 36px 0;
          background-color: #FFFFFF;
          font-family: 'Inter', sans-serif;
        }
        .ehs-action-inner {
          width: 98%;
          max-width: 1370px;
          margin: 0 auto;
        }
        .ehs-action-split {
          display: grid;
          grid-template-columns: 44% 56%;
          gap: 24px;
          align-items: stretch;
        }
        .ehs-action-card {
          background-color: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
        }
        .ehs-card-title {
          font-size: clamp(20px, 2.5vw, 24px);
          font-weight: 800;
          color: #052A73;
          line-height: 1.2;
          margin: 0 0 6px 0;
          letter-spacing: -0.4px;
        }
        .ehs-card-subtitle {
          font-size: 12.5px;
          font-weight: 400;
          color: #64748B;
          line-height: 1.5;
          margin: 0 0 16px 0;
        }
        .cert-clients-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .client-logo-box {
          background-color: #F8FAFC;
          border: 1px solid #EEF2F7;
          border-radius: 12px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 65px;
          box-sizing: border-box;
        }
        .client-logo-img {
          max-width: 82%;
          max-height: 38px;
          object-fit: contain;
          display: block;
        }
        .client-name-text {
          font-size: 11px;
          font-weight: 600;
          color: #1E293B;
          margin: 6px 0 0 0;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          min-height: 28px;
        }
        .cert-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 40px;
          padding: 0 18px;
          border: 2px solid #DCE7F5;
          background-color: #FFFFFF;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          color: #052A73;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          margin-top: 18px;
          align-self: flex-start;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .cert-view-btn:hover {
          background-color: #F8FAFC;
          border-color: #CBD5E1;
        }
        .ehs-gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: auto;
        }
        .gallery-img-thumb {
          height: 160px;
          border-radius: 10px;
          overflow: hidden;
          background-color: #F1F5F9;
          position: relative;
        }
        .gallery-img-tag {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }
        .gallery-card-item:hover .gallery-img-tag {
          transform: scale(1.04);
        }
        .gallery-item-title {
          font-size: 11.5px;
          font-weight: 600;
          color: #1E293B;
          line-height: 1.35;
          margin: 8px 0 0 0;
        }

        @media (max-width: 1100px) {
          .ehs-action-split {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }

        @media (max-width: 768px) {
          .ehs-action-wrapper {
            padding: 0 16px 28px 16px !important;
            box-sizing: border-box !important;
          }
          .ehs-action-inner {
            width: 100% !important;
          }
          .ehs-action-split {
            gap: 16px !important;
          }
          .ehs-action-card {
            padding: 20px 14px !important;
            border-radius: 16px !important;
          }
          .ehs-card-title {
            font-size: clamp(19px, 5vw, 24px) !important;
            margin-bottom: 4px !important;
          }
          .ehs-card-subtitle {
            font-size: 12px !important;
            margin-bottom: 14px !important;
          }
          .cert-clients-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
          }
          .client-logo-box {
            height: 54px !important;
            padding: 6px !important;
            border-radius: 10px !important;
          }
          .client-logo-img {
            max-width: 85% !important;
            max-height: 32px !important;
          }
          .client-name-text {
            font-size: 10px !important;
            min-height: 25px !important;
          }
          .cert-view-btn {
            margin-top: 14px !important;
            height: 38px !important;
            font-size: 11.5px !important;
            padding: 0 14px !important;
          }
          .ehs-gallery-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
            margin-top: 6px !important;
          }
          .gallery-img-thumb {
            height: clamp(110px, 30vw, 135px) !important;
            border-radius: 8px !important;
          }
          .gallery-item-title {
            font-size: 11.5px !important;
            line-height: 1.3 !important;
            margin-top: 6px !important;
          }
        }

        @media (max-width: 360px) {
          .ehs-action-card {
            padding: 16px 10px !important;
          }
          .cert-clients-grid {
            gap: 6px !important;
          }
          .client-logo-box {
            height: 48px !important;
          }
          .client-logo-img {
            max-height: 28px !important;
          }
          .client-name-text {
            font-size: 9.5px !important;
          }
          .gallery-img-thumb {
            height: 105px !important;
          }
          .gallery-item-title {
            font-size: 10.5px !important;
          }
        }
      `}</style>

      <div className="ehs-action-inner">
        <div className="ehs-action-split">
          
          {/* LEFT: Certifications & Standards */}
          <div className="ehs-action-card">
            <h2 className="ehs-card-title">Certifications & Standards</h2>
            <p className="ehs-card-subtitle">Aligned with global EHS standards and best practices.</p>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="cert-clients-grid">
                {visibleClients.filter(Boolean).map((client: any, i: number) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div className="client-logo-box">
                      <img 
                        src={client.logo} 
                        alt={client.name} 
                        loading="lazy" 
                        decoding="async" 
                        className="client-logo-img" 
                      />
                    </div>
                    <p className="client-name-text">{client.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/about/awards')}
              className="cert-view-btn"
              type="button"
            >
              View All Certifications <FiArrowRight size={12} />
            </button>
          </div>

          {/* RIGHT: EHS in Action Gallery */}
          <div className="ehs-action-card">
            <h2 className="ehs-card-title">{displayTitle}</h2>
            <p className="ehs-card-subtitle">Building a strong safety culture on every site.</p>
            
            <div className="ehs-gallery-grid">
              {activeGallery.map((item: any, idx: number) => {
                const fallbackSrc = defaultGalleryItems[idx % defaultGalleryItems.length]?.image || '/images/EHS/PPE-Training-Session.png';
                return (
                  <div key={item.id} className="gallery-card-item">
                    <div className="gallery-img-thumb">
                      <img 
                        src={item.image || fallbackSrc} 
                        alt={item.title || 'EHS in Action'} 
                        loading="lazy" 
                        decoding="async"
                        className="gallery-img-tag"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.endsWith(fallbackSrc)) {
                            target.src = fallbackSrc;
                          }
                        }}
                      />
                    </div>
                    <p className="gallery-item-title">{item.title}</p>
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

export default CertificationsAndEHSAction;