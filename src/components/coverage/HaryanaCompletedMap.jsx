/**
 * =============================================================================
 * FILE: src/components/coverage/HaryanaCompletedMap.jsx
 * FINAL - Haryana Completed Projects Interactive Map & Synchronized Slider
 * =============================================================================
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Building2, Ruler, ClipboardList, User,
  ChevronRight, ChevronLeft, CheckCircle2, X, Activity
} from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import completedProjectsData from '../../data/completedProjects';
import { getImageUrl, getProjectSlug } from '../../utils/imageUrl';
import { getLocalDataSync, fetchWpData } from '../../services/wordpress';

const GREEN = '#198847';
const FALLBACK_IMG = '/images/hero/Completed-Projects.png';

const normalizeCity = (city) => {
  if (!city) return 'Farukhnagar';
  const c = city.trim();
  const mapping = {
    'Farukhnagar': 'Farukhnagar',
    'Farrukhnagar': 'Farukhnagar',
    'Pataudi': 'Pataudi',
    'Bilaspur': 'Bilaspur',
    'Bhorakalan': 'Bhorakalan',
    'Patli': 'Patli',
    'Khor': 'Khor',
    'Luhari': 'Luhari',
    'Manesar': 'Manesar',
    'Jamalpur': 'Jamalpur',
    'Pathreri': 'Pathreri',
    'Dharuhera': 'Dharuhera',
    'Khijuri': 'Khijuri',
    'Tauru': 'Tauru',
    'Palwal': 'Palwal',
    'Nuh': 'Nuh',
    'Delhi-Mumbai Expressway, Nuh': 'Delhi-Mumbai Expressway, Nuh'
  };
  return mapping[c] || c;
};

const LOCATIONS = {
  'Pataudi': { cx: 35, cy: 44 },
  'Patli': { cx: 36, cy: 41 },
  'Tauru': { cx: 42, cy: 50 },
  'Palwal': { cx: 60, cy: 55 },
  'Farukhnagar': { cx: 30, cy: 38 },
  'Farrukhnagar': { cx: 30, cy: 38 },
  'Khijuri': { cx: 31, cy: 55 },
  'Luhari': { cx: 31, cy: 41 },
  'Pathreri': { cx: 36, cy: 51 },
  'Jamalpur': { cx: 39, cy: 41 },
  'Manesar': { cx: 44, cy: 42 },
  'Bilaspur': { cx: 40, cy: 45 },
  'Dharuhera': { cx: 31, cy: 51 },
  'Bhorakalan': { cx: 38, cy: 46 },
  'Khor': { cx: 33, cy: 48 },
  'Delhi-Mumbai Expressway, Nuh': { cx: 48, cy: 58 },
  'Nuh': { cx: 48, cy: 58 }
};

const DOT_R = 14, GAP = 6, FLIP_TH = 180;

/**
 * Compact Project Name Popup
 * Shows only the Project Name (and lists names if city has multiple projects).
 */
const ProjectNamePopup = ({ cityProjects, anchorPx, mapSize, onClose, onProjectClick }) => {
  const popupW = Math.min(220, mapSize.w - 24);
  const flipDown = (anchorPx.y - DOT_R - GAP) < FLIP_TH;
  let left = anchorPx.x - popupW / 2;
  left = Math.max(8, Math.min(left, mapSize.w - popupW - 8));
  const arrowLeft = Math.max(14, Math.min(anchorPx.x - left, popupW - 14));
  const vertStyle = flipDown
    ? { top: anchorPx.y + DOT_R + GAP + 8 }
    : { bottom: mapSize.h - anchorPx.y + DOT_R + GAP + 8 };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: flipDown ? -6 : 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: flipDown ? -4 : 4 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      style={{ position: 'absolute', width: popupW, left, zIndex: 100, pointerEvents: 'all', ...vertStyle }}
    >
      {!flipDown && (
        <div style={{
          position: 'absolute', bottom: -8, left: arrowLeft, transform: 'translateX(-50%)',
          width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
          borderTop: '8px solid #ffffff', pointerEvents: 'none', zIndex: 2
        }} />
      )}
      <div style={{
        background: '#ffffff', borderRadius: 10, border: '1px solid #e2e8f0',
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)', padding: '10px 12px', position: 'relative'
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={{
            position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%',
            background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#64748b', zIndex: 5, padding: 0
          }}
        >
          <X size={11} />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 14 }}>
          {cityProjects.map((project, idx) => (
            <div
              key={project.id || idx}
              onClick={(e) => { e.stopPropagation(); onProjectClick(project); }}
              style={{
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: 6,
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{
                fontSize: 12, fontWeight: 700, color: '#1e293b',
                display: 'block', lineHeight: 1.35
              }}>
                {project.name}
              </span>
              <ChevronRight size={13} color={GREEN} style={{ flexShrink: 0, opacity: 0.7 }} />
            </div>
          ))}
        </div>
      </div>
      {flipDown && (
        <div style={{
          position: 'absolute', top: -8, left: arrowLeft, transform: 'translateX(-50%)',
          width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
          borderBottom: '8px solid #ffffff', pointerEvents: 'none', zIndex: 2
        }} />
      )}
    </motion.div>
  );
};

/**
 * Map Marker
 * Classic map pin marker in theme color with live radar pulse
 */
const MapMarker = ({ city, cityProjects, isSelected, isHovered, onHover, onLeave, onClick }) => {
  const color = GREEN;
  const isActive = isSelected || isHovered;
  const projectCount = cityProjects.length;
  const firstCity = city || cityProjects[0]?.cityKey || cityProjects[0]?.city || 'Haryana';
  const customCx = cityProjects[0]?.cx;
  const customCy = cityProjects[0]?.cy;
  const loc = (customCx != null && customCy != null && customCx > 0 && customCy > 0)
    ? { cx: customCx, cy: customCy }
    : (LOCATIONS[firstCity] || LOCATIONS[normalizeCity(firstCity)] || { cx: 50, cy: 50 });
  const SIZE = 26;

  return (
    <div
      style={{
        position: 'absolute', left: `${loc.cx}%`, top: `${loc.cy}%`,
        transform: 'translate(-50%,-50%)', cursor: 'pointer', zIndex: isSelected ? 60 : 50, pointerEvents: 'all'
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Live radar/ping animation */}
      <span
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 38, height: 38, borderRadius: '50%', background: color,
          opacity: isSelected ? 0.35 : 0.15,
          animation: 'mmPing 2.4s cubic-bezier(0,.2,.2,1) infinite',
          pointerEvents: 'none'
        }}
      />
      {isSelected && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 38, height: 38, borderRadius: '50%', border: `2px solid ${color}`,
            animation: 'mmGlow 1.6s ease-in-out infinite', pointerEvents: 'none'
          }}
        />
      )}

      {/* Map Pin Marker */}
      <motion.div
        animate={{ scale: isSelected ? 1.25 : 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        style={{
          width: SIZE, height: SIZE, borderRadius: '50%', background: color,
          border: '2.5px solid #ffffff',
          boxShadow: isSelected ? `0 0 0 3px ${color}40, 0 4px 12px rgba(25,136,71,0.3)` : '0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}
      >
        <MapPin size={15} color="#ffffff" strokeWidth={2.4} style={{ flexShrink: 0 }} />
      </motion.div>

      {/* Multi-project count pill */}
      {projectCount > 1 && (
        <div
          style={{
            position: 'absolute', top: -5, right: -10, background: '#ef4444', color: '#ffffff',
            minWidth: 18, height: 18, borderRadius: 10, fontSize: 10, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
            border: '2px solid #ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.25)', pointerEvents: 'none', zIndex: 5
          }}
        >
          {projectCount}
        </div>
      )}
    </div>
  );
};

const CardProject = ({ project, isSelected, onClick }) => {
  const mainImage = getImageUrl(project.image || (project.images && project.images[0]), FALLBACK_IMG);

  return (
    <div
      className={`hcm-card ${isSelected ? 'hcm-card-selected' : ''}`}
      onClick={() => onClick(project)}
      style={{ cursor: 'pointer', boxShadow: 'none' }}
    >
      <div className="hcm-card-image-wrapper" style={{ boxShadow: 'none' }}>
        <img
          src={mainImage}
          alt={project.name}
          className="hcm-card-image"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (!e.currentTarget.src.includes(FALLBACK_IMG)) {
              e.currentTarget.src = FALLBACK_IMG;
            }
          }}
          style={{ boxShadow: 'none' }}
        />
        <div className="hcm-badges-overlay">
          <span className="hcm-badge-status" style={{ background: '#f0fdf4', color: GREEN, border: '1px solid #bbf7d0' }}>
            <CheckCircle2 size={11} />{project.status}
          </span>
        </div>
      </div>
      <div className="hcm-card-content">
        <span className="hcm-badge-cat">{project.category}</span>
        <h3 className="hcm-card-title">{project.name}</h3>
        <div className="hcm-labels-grid">
          <div className="hcm-label-item">
            <MapPin size={12} color={GREEN} />
            <div>
              <span className="hcm-label-head">Location</span>
              <span className="hcm-label-val">{project.city || project.location}, {project.state}</span>
            </div>
          </div>
          <div className="hcm-label-item">
            <Ruler size={12} color={GREEN} />
            <div>
              <span className="hcm-label-head">Build-up Area</span>
              <span className="hcm-label-val">{project.area}</span>
            </div>
          </div>
          <div className="hcm-label-item hcm-label-full">
            <ClipboardList size={12} color={GREEN} />
            <div>
              <span className="hcm-label-head">Scope of Work</span>
              <span className="hcm-label-val">{project.scope}</span>
            </div>
          </div>
          <div className="hcm-label-item hcm-label-full">
            <User size={12} color={GREEN} />
            <div>
              <span className="hcm-label-head">Client</span>
              <span className="hcm-label-val">{project.client}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HaryanaCompletedMap({ completedProjects = null, mapMarkers = [], onClose = null }) {
  const navigate = useNavigate();

  const [liveProjects, setLiveProjects] = useState(() => {
    if (completedProjects && Array.isArray(completedProjects) && completedProjects.length > 0) {
      return completedProjects;
    }
    const cached = getLocalDataSync('completed-projects');
    if (Array.isArray(cached) && cached.length > 0) return cached;
    try {
      const stored = window.localStorage.getItem('pisl_completed_projects');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return completedProjectsData;
  });

  useEffect(() => {
    if (completedProjects && Array.isArray(completedProjects) && completedProjects.length > 0) {
      setLiveProjects(completedProjects);
    }
  }, [completedProjects]);

  useEffect(() => {
    fetchWpData('completed-projects?populate=*&pagination[pageSize]=100')
      .then(res => {
        if (Array.isArray(res) && res.length > 0) setLiveProjects(res);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleUpdate = (e) => {
      const cleanEndpoint = e?.detail?.cleanEndpoint || '';
      if (!cleanEndpoint || cleanEndpoint.startsWith('completed-projects')) {
        const fresh = getLocalDataSync('completed-projects');
        if (Array.isArray(fresh) && fresh.length > 0) {
          setLiveProjects(fresh);
        } else {
          fetchWpData('completed-projects?populate=*&pagination[pageSize]=100', { forceFresh: true })
            .then(res => {
              if (Array.isArray(res) && res.length > 0) setLiveProjects(res);
            })
            .catch(() => {});
        }
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, []);

  const haryanaCompletedProjects = useMemo(() => {
    const pool = (liveProjects && liveProjects.length > 0) ? liveProjects : completedProjectsData;
    return pool
      .filter(p => {
        const st = (p.state || p.attributes?.state || '').toLowerCase();
        return st === 'haryana';
      })
      .map((p, idx) => {
        const pName = p.name || p.title || p.projectName || p.attributes?.name || p.attributes?.title || 'Project';
        const rawLoc = (p.location || p.city || p.attributes?.location || p.attributes?.city || '').trim();
        const stateName = (p.state || p.attributes?.state || 'Haryana').trim();
        const cityKey = normalizeCity(rawLoc);

        let rawImgs = [];
        if (Array.isArray(p.images) && p.images.length > 0) rawImgs = p.images;
        else if (p.images?.data && Array.isArray(p.images.data)) rawImgs = p.images.data;
        else if (p.attributes?.images?.data && Array.isArray(p.attributes.images.data)) rawImgs = p.attributes.images.data;
        else if (Array.isArray(p.attributes?.images)) rawImgs = p.attributes.images;
        else if (p.image) rawImgs = Array.isArray(p.image) ? p.image : [p.image];
        else if (p.attributes?.image) rawImgs = Array.isArray(p.attributes.image) ? p.attributes.image : [p.attributes.image];

        if (rawImgs.length === 0) {
          const matchLocal = completedProjectsData.find(lp => {
            const sL = (lp.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const sP = pName.toLowerCase().replace(/[^a-z0-9]/g, '');
            return sL === sP;
          });
          if (matchLocal?.images?.length > 0) rawImgs = matchLocal.images;
          else if (matchLocal?.image) rawImgs = [matchLocal.image];
        }

        const validImgs = rawImgs.map(img => getImageUrl(img)).filter(Boolean);
        const finalImages = validImgs.length > 0 ? validImgs : [FALLBACK_IMG];

        const slug = p.slug || getProjectSlug({ ...p, name: pName, location: rawLoc, state: stateName });

        return {
          id: p.documentId || p.id || `hr-${idx}`,
          documentId: p.documentId || p.id,
          name: pName,
          state: stateName,
          city: rawLoc,
          cityKey,
          location: rawLoc,
          status: 'Completed',
          category: p.category || p.attributes?.category || 'Industrial Infrastructure',
          area: p.area || p.attributes?.area || 'N/A',
          client: p.client || p.attributes?.client || 'Pislinfra Client',
          scope: p.scope || p.attributes?.scope || 'Civil Work & Infrastructure',
          timeline: p.timeline || p.attributes?.timeline || 'Completed',
          progress: 100,
          cx: (p.cx != null && !isNaN(Number(p.cx)) && Number(p.cx) > 0) ? Number(p.cx) : null,
          cy: (p.cy != null && !isNaN(Number(p.cy)) && Number(p.cy) > 0) ? Number(p.cy) : null,
          images: finalImages,
          image: finalImages[0] || FALLBACK_IMG,
          slug,
        };
      });
  }, [liveProjects]);

  const locationCounts = useMemo(() => {
    const counts = {};
    haryanaCompletedProjects.forEach(p => {
      const key = p.cityKey || 'Farukhnagar';
      if (!counts[key]) counts[key] = [];
      counts[key].push(p);
    });
    return counts;
  }, [haryanaCompletedProjects]);

  const [selectedCity, setSelectedCity] = useState(null);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [popupAnchor, setPopupAnchor] = useState(null);
  const [mapSize, setMapSize] = useState({ w: 0, h: 0 });

  const mapRef = useRef(null);
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const syncMapSize = useCallback(() => {
    if (mapRef.current) {
      const { width, height } = mapRef.current.getBoundingClientRect();
      setMapSize({ w: width, h: height });
    }
  }, []);

  useEffect(() => {
    syncMapSize();
    const ro = new ResizeObserver(syncMapSize);
    if (mapRef.current) ro.observe(mapRef.current);
    return () => ro.disconnect();
  }, [syncMapSize]);

  useEffect(() => {
    if (!selectedCity || mapSize.w === 0) return;
    const cityProjects = locationCounts[selectedCity];
    if (!cityProjects || cityProjects.length === 0) return;
    const customCx = cityProjects[0]?.cx;
    const customCy = cityProjects[0]?.cy;
    const loc = (customCx != null && customCy != null && customCx > 0 && customCy > 0)
      ? { cx: customCx, cy: customCy }
      : (LOCATIONS[selectedCity] || LOCATIONS[normalizeCity(selectedCity)] || { cx: 50, cy: 50 });
    setPopupAnchor({ x: (loc.cx / 100) * mapSize.w, y: (loc.cy / 100) * mapSize.h });
  }, [mapSize, selectedCity, locationCounts]);

  useEffect(() => {
    if (selectedCity) {
      const projs = locationCounts[selectedCity] || [];
      setHighlightedIds(projs.map(p => p.id));
      const firstProj = projs[0];
      if (firstProj) {
        const cardIdx = haryanaCompletedProjects.findIndex(p => p.id === firstProj.id);
        setTimeout(() => {
          if (swiperRef.current && cardIdx >= 0) {
            swiperRef.current.slideTo(cardIdx);
          }
        }, 80);
      }
    } else {
      setHighlightedIds([]);
    }
  }, [selectedCity, locationCounts, haryanaCompletedProjects]);

  const selectedCityProjects = selectedCity ? (locationCounts[selectedCity] || null) : null;

  const handleMarkerClick = (city, projects) => {
    if (selectedCity === city) {
      setSelectedCity(null);
      setPopupAnchor(null);
      return;
    }
    const customCx = projects[0]?.cx;
    const customCy = projects[0]?.cy;
    const loc = (customCx != null && customCy != null && customCx > 0 && customCy > 0)
      ? { cx: customCx, cy: customCy }
      : (LOCATIONS[city] || LOCATIONS[normalizeCity(city)] || { cx: 50, cy: 50 });
    setPopupAnchor({ x: (loc.cx / 100) * mapSize.w, y: (loc.cy / 100) * mapSize.h });
    setSelectedCity(city);
  };

  const closePopup = () => {
    setSelectedCity(null);
    setPopupAnchor(null);
  };

  const handleCardClick = (project) => {
    if (!project) return;
    const slug = project.slug || getProjectSlug(project);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    navigate(`/project/completed/${slug}`, { state: { projectData: project } });
  };

  const handleProjectClickFromPopup = (project) => {
    if (!project) return;
    setHighlightedIds([project.id]);
    const cardIdx = haryanaCompletedProjects.findIndex(p => p.id === project.id);
    if (cardIdx >= 0 && swiperRef.current) {
      swiperRef.current.slideTo(cardIdx);
    }
  };

  return (
    <div className="hcm-layout">
      {/* Left Panel: Map */}
      <div className="hcm-left-panel">
        <div className="hcm-map-container" ref={mapRef}>
          <img
            src="/images/Home/Haryana.png"
            alt="Haryana Map"
            style={{
              width: '130%',
              height: '130%',
              objectFit: 'contain',
              position: 'absolute',
              inset: 0,
              transform: 'translate(-11.5%,-11.5%)',
              pointerEvents: 'none'
            }}
          />
          <div className="hcm-markers-overlay">
            {selectedCity && (
              <div onClick={closePopup} style={{ position: 'absolute', inset: 0, zIndex: 45, pointerEvents: 'all', cursor: 'default' }} />
            )}
            {Object.entries(locationCounts).map(([city, projects]) => (
              <MapMarker
                key={city}
                city={city}
                cityProjects={projects}
                isSelected={selectedCity === city}
                isHovered={hoveredCity === city}
                onHover={() => setHoveredCity(city)}
                onLeave={() => setHoveredCity(null)}
                onClick={() => handleMarkerClick(city, projects)}
              />
            ))}
            <AnimatePresence>
              {selectedCityProjects && popupAnchor && mapSize.w > 0 && (
                <ProjectNamePopup
                  key={selectedCity}
                  cityProjects={selectedCityProjects}
                  anchorPx={popupAnchor}
                  mapSize={mapSize}
                  onClose={closePopup}
                  onProjectClick={handleProjectClickFromPopup}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="hcm-legend">
          <div className="hcm-legend-item">
            <span className="cm-legend-dot" style={{ backgroundColor: GREEN }} />
            <span>Completed ({haryanaCompletedProjects.length})</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Project Slider */}
      <div className="hcm-right-panel">
        <div className="hcm-header">
          <div className="hcm-header-top">
            <div>
              <h1 className="hcm-main-title">
                Haryana <span style={{ color: GREEN }}>Completed</span> Projects
              </h1>
              <p className="hcm-subtitle">Successfully delivered industrial & logistics parks across Haryana.</p>
            </div>
            <div className="hcm-header-right">
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                borderRadius: 10, border: '1.5px solid #198847', background: '#f0fdf4',
                color: GREEN, fontWeight: 700, fontSize: 13
              }}>
                <CheckCircle2 size={14} />Completed
                <span style={{ background: GREEN, color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 800 }}>
                  {haryanaCompletedProjects.length}
                </span>
              </div>
              <div className="hcm-nav-arrows">
                <button ref={prevRef} className="hcm-nav-btn hcm-nav-prev-btn" onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous Slide">
                  <ChevronLeft size={18} />
                </button>
                <button ref={nextRef} className="hcm-nav-btn hcm-nav-next-btn" onClick={() => swiperRef.current?.slideNext()} aria-label="Next Slide">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hcm-content-area">
          {haryanaCompletedProjects.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="hcm-slider-wrapper">
                <Swiper
                  onSwiper={(s) => { swiperRef.current = s; }}
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={16}
                  slidesPerView={2}
                  slidesPerGroup={1}
                  navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                  breakpoints={{
                    0: { slidesPerView: 1, slidesPerGroup: 1 },
                    1024: { slidesPerView: 2, slidesPerGroup: 1 }
                  }}
                  onBeforeInit={(sw) => {
                    sw.params.navigation.prevEl = prevRef.current;
                    sw.params.navigation.nextEl = nextRef.current;
                  }}
                  style={{ paddingBottom: '40px' }}
                >
                  {haryanaCompletedProjects.map(project => (
                    <SwiperSlide key={project.id} style={{ height: 'auto' }}>
                      <div
                        onMouseEnter={() => setHoveredCity(project.cityKey || project.city)}
                        onMouseLeave={() => setHoveredCity(null)}
                        style={{ height: '100%' }}
                      >
                        <CardProject
                          project={project}
                          isSelected={highlightedIds.includes(project.id)}
                          onClick={handleCardClick}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hcm-empty-state">
              <Building2 size={64} />
              <h3>No completed projects found in Haryana</h3>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes mmPing{0%{transform:translate(-50%,-50%) scale(0.5);opacity:0.4;}70%{transform:translate(-50%,-50%) scale(2.3);opacity:0;}100%{transform:translate(-50%,-50%) scale(2.3);opacity:0;}}
        @keyframes mmGlow{0%,100%{opacity:0.9;transform:translate(-50%,-50%) scale(1);}50%{opacity:0.4;transform:translate(-50%,-50%) scale(1.35);}}
        .hcm-layout{display:flex;flex-direction:column;min-height:auto;background:#fff;color:#0f172a;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;max-width:1536px;margin:0 auto;position:relative;isolation:isolate;}
        @media(min-width:1024px){.hcm-layout{flex-direction:row;height:auto;min-height:560px;}}
        .hcm-left-panel{width:100%;min-height:auto;position:relative;background:#f8fafc;border-right:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;padding:24px 20px;}
        @media(min-width:1024px){.hcm-left-panel{width:45%;min-height:100%;align-items:center;justify-content:center;padding:24px 20px;position:relative;}}
        .hcm-map-container{position:relative;width:100%;max-width:540px;aspect-ratio:1/1.3;overflow:visible;}
        .hcm-map-image{width:100%;height:100%;object-fit:contain;position:absolute;inset:0;pointer-events:none;}
        .hcm-markers-overlay{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;}
        .hcm-legend{position:absolute;bottom:24px;left:24px;background:transparent!important;backdrop-filter:none!important;border:none!important;padding:0!important;border-radius:0!important;box-shadow:none!important;z-index:20;}
        .hcm-legend-item{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:#28286e;user-select:none;}
        .cm-legend-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}

        @media(max-width:1023px){
          .hcm-left-panel{padding:24px 16px 20px!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;min-height:auto!important;}
          .hcm-map-container{width:100%!important;max-width:380px!important;margin:0 auto!important;}
          .hcm-legend{position:static!important;margin:12px auto 0!important;display:flex!important;justify-content:center!important;}
          .hcm-header{padding:20px 20px 16px!important;}
          .hcm-content-area{padding:20px 16px!important;}
        }

        @media(max-width:640px){
          .hcm-header{padding:16px 14px 12px!important;}
          .hcm-header-top{flex-direction:column!important;align-items:stretch!important;gap:10px!important;}
          .hcm-header-right{width:100%!important;justify-content:space-between!important;}
          .hcm-content-area{padding:14px 14px 20px!important;}
          .hcm-card-image-wrapper{height:clamp(185px, 50vw, 220px)!important;}
          .hcm-card-content{padding:13px 15px 15px!important;gap:9px!important;}
        }

        .hcm-right-panel{width:100%;display:flex;flex-direction:column;background:#fff;}
        @media(min-width:1024px){.hcm-right-panel{width:55%;}}
        .hcm-header{flex-shrink:0;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);padding:18px 36px 14px;border-bottom:1px solid #e2e8f0;}
        .hcm-header-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;}
        .hcm-main-title{margin:0;font-size:24px;font-weight:900;color:#28286e;letter-spacing:-0.5px;}
        .hcm-subtitle{margin:4px 0 0;color:#64748b;font-size:13px;}
        .hcm-header-right{display:flex;align-items:center;gap:14px;}
        .hcm-content-area{padding:20px 36px;flex:1;display:flex;flex-direction:column;}
        .hcm-slider-wrapper{position:relative;width:100%;height:100%;}
        .hcm-nav-arrows{display:flex;align-items:center;gap:6px;}
        .hcm-nav-btn{width:36px;height:36px;border-radius:8px;background:#fff;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#28286e;transition:all 0.2s;}
        .hcm-nav-btn:hover{background:#f8fafc;border-color:#198847;color:#198847;}
        .hcm-card{background:#fff;border:1px solid #e2e8f0;border-radius:4px;transition:border-color 0.2s;display:flex;flex-direction:column;overflow:hidden;height:100%;box-shadow:none!important;}
        .hcm-card:hover{border-color:#cbd5e1;transform:none!important;box-shadow:none!important;}
        .hcm-card-selected{border:1.5px solid #198847!important;box-shadow:none!important;}
        .hcm-card-image-wrapper{position:relative;width:100%;height:190px;overflow:hidden;flex-shrink:0;background:#f8fafc;border-radius:4px 4px 0 0;box-shadow:none!important;}
        .hcm-card-image{width:100%;height:100%;object-fit:cover;border-radius:4px 4px 0 0;transition:none!important;box-shadow:none!important;}
        .hcm-card:hover .hcm-card-image{transform:none!important;}
        .hcm-badges-overlay{position:absolute;top:10px;left:10px;}
        .hcm-badge-status{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;padding:3px 8px;border-radius:4px;display:flex;align-items:center;gap:4px;backdrop-filter:blur(4px);}
        .hcm-card-content{padding:14px 16px 16px;flex:1;display:flex;flex-direction:column;gap:9px;}
        .hcm-badge-cat{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.6px;padding:2px 7px;border-radius:4px;display:inline-block;background:#f1f5f9;color:#475569;width:fit-content;}
        .hcm-card-title{margin:0;font-size:15px;font-weight:800;color:#28286e;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:38px;}
        .hcm-labels-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
        .hcm-label-item{display:flex;align-items:flex-start;gap:7px;padding:7px 10px;background:#f8fafc;border-radius:4px;border:1px solid #f1f5f9;}
        .hcm-label-full{grid-column:1/-1;}
        .hcm-label-head{font-size:8px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px;display:block;margin-bottom:1px;}
        .hcm-label-val{font-size:11px;font-weight:600;color:#334155;line-height:1.25;}
        .hcm-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 0;color:#94a3b8;text-align:center;flex:1;}
        .hcm-empty-state svg{opacity:0.3;margin-bottom:16px;}
        .hcm-empty-state h3{margin:0;color:#28286e;font-size:20px;font-weight:700;}
        .swiper{width:100%!important;}
        .swiper-wrapper{align-items:stretch!important;}
        .swiper-slide{height:auto!important;}
        .swiper-pagination{position:relative!important;bottom:auto!important;margin-top:16px!important;text-align:center!important;}
        .swiper-pagination-bullet{background:#cbd5e1!important;width:8px!important;height:8px!important;opacity:1!important;transition:all 0.3s!important;margin:0 4px!important;}
        .swiper-pagination-bullet-active{background:#198847!important;width:24px!important;border-radius:4px!important;}
      `}</style>
    </div>
  );
}
