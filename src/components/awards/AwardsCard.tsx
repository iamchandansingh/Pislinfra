import React, { useState, useEffect, useCallback } from 'react';
import {
  FiMapPin, FiAward, FiCheckCircle, FiX,
  FiExternalLink, FiDownload, FiChevronLeft, FiChevronRight, FiCalendar
} from 'react-icons/fi';
import awardsAndCertifications from '../../data/Awards-&-Certifications';

/* ─── Popup Modal ────────────────────────────────────────────── */
const Popup = ({ award, onClose }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const images = [award.image, award.clientImage].filter(Boolean);
  const multi = images.length > 1;

  const prev = useCallback(() => setCurrentImg(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrentImg(i => (i + 1) % images.length), [images.length]);

  // keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(5, 10, 30, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        .popup-scroll::-webkit-scrollbar { width: 5px }
        .popup-scroll::-webkit-scrollbar-track { background: transparent }
        .popup-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px }
        .nav-btn:hover { background: rgba(0,0,0,0.7) !important }
        .close-btn:hover { background: rgba(0,0,0,0.7) !important }
        .thumb-dot:hover { transform: scale(1.3) }
        .action-btn:hover { opacity: 0.88 }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="popup-scroll"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 30px 70px rgba(0,0,0,0.35)',
          animation: 'slideUp 0.25s ease',
        }}
      >
        {/* ── Gallery ── */}
        <div style={{
          position: 'relative',
          height: '320px',
          backgroundColor: '#F1F5F9',
          borderRadius: '20px 20px 0 0',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {images.length > 0 ? (
            <>
              {images.map((src, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${src})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundColor: '#F1F5F9',
                    opacity: currentImg === i ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                  }}
                />
              ))}

              {/* Counter badge */}
              {multi && (
                <div style={{
                  position: 'absolute', top: 14, left: 14,
                  backgroundColor: 'rgba(0,0,0,0.45)',
                  color: '#fff', fontSize: '11px', fontWeight: 500,
                  padding: '3px 10px', borderRadius: '999px',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {currentImg + 1} / {images.length}
                </div>
              )}

              {/* Prev / Next */}
              {multi && (
                <>
                  <button
                    className="nav-btn"
                    onClick={prev}
                    style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.40)', border: 'none', borderRadius: '50%',
                      width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
                    }}
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  <button
                    className="nav-btn"
                    onClick={next}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.40)', border: 'none', borderRadius: '50%',
                      width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
                    }}
                  >
                    <FiChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Thumbnail dots */}
              {multi && (
                <div style={{
                  position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', gap: 8,
                }}>
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className="thumb-dot"
                      onClick={() => setCurrentImg(i)}
                      style={{
                        border: '1.5px solid rgba(255,255,255,0.7)',
                        borderRadius: currentImg === i ? '4px' : '50%',
                        width: currentImg === i ? 20 : 8,
                        height: 8,
                        backgroundColor: currentImg === i ? '#fff' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiAward size={56} color="#CBD5E1" />
            </div>
          )}

          {/* Close */}
          <button
            className="close-btn"
            onClick={onClose}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '50%',
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', transition: 'background 0.2s', zIndex: 2,
            }}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '26px 30px 30px' }}>
          {/* Badge + Year */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '4px 12px',
              borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.6px',
              backgroundColor: award.badgeBg, color: award.badgeColor,
              fontFamily: 'Inter, sans-serif',
            }}>
              {award.badge}
            </span>
            {award.year && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: '12px', color: '#64748B', fontFamily: 'Inter, sans-serif',
              }}>
                <FiCalendar size={12} />
                {award.year}
              </span>
            )}
            <span style={{ marginLeft: 'auto' }}>
              {award.type === 'award'
                ? <FiAward size={18} color="#F59E0B" />
                : <FiCheckCircle size={18} color="#22C55E" />}
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: '22px', fontWeight: 800, color: '#052A73',
            lineHeight: 1.25, margin: '0 0 8px',
            fontFamily: 'Inter, sans-serif',
          }}>
            {award.title}
          </h2>

          {/* Location */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            marginBottom: 16,
          }}>
            <FiMapPin size={13} color="#94A3B8" />
            <span style={{ fontSize: '13px', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
              {award.location}
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: '#F1F5F9', marginBottom: 16 }} />

          {/* Description */}
          <p style={{
            fontSize: '14px', lineHeight: 1.8, color: '#475569',
            margin: '0 0 24px', fontFamily: 'Inter, sans-serif',
          }}>
            {award.description}
          </p>

          {/* Action buttons */}
          {(award.videoUrl || award.pdf) && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {award.videoUrl && (
                <a
                  href={award.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '11px 22px', backgroundColor: '#052A73', color: '#FFFFFF',
                    borderRadius: '10px', textDecoration: 'none', fontSize: '13px',
                    fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'opacity 0.2s',
                  }}
                >
                  <FiExternalLink size={15} />
                  Watch video
                </a>
              )}
              {award.pdf && (
                <a
                  href={award.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '11px 22px', backgroundColor: '#F97316', color: '#FFFFFF',
                    borderRadius: '10px', textDecoration: 'none', fontSize: '13px',
                    fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'opacity 0.2s',
                  }}
                >
                  <FiDownload size={15} />
                  Download PDF
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Card ───────────────────────────────────────────────────── */
const AwardsCard = ({
  image, clientImage, badge, badgeBg, badgeColor,
  title, location, description, type, videoUrl, pdf, year,
}) => {
  const [currentImg, setCurrentImg] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const images = [image, clientImage].filter(Boolean);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImg(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const award = {
    image, clientImage, badge, badgeBg, badgeColor,
    title, location, description, type, videoUrl, pdf, year,
  };

  return (
    <>
      <div
        onClick={() => setShowPopup(true)}
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5EAF2',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          cursor: 'pointer',
          transition: 'transform 0.25s, box-shadow 0.25s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 14px 32px rgba(0,0,0,0.10)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
        }}
      >
        {/* Card image */}
        <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
          {images.length > 0 ? (
            <>
              {images.map((src, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: images.length > 1 ? (currentImg === i ? 1 : 0) : 1,
                    transition: 'opacity 0.8s ease',
                  }}
                />
              ))}
              {images.length > 1 && (
                <div style={{
                  position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', gap: 4,
                }}>
                  {images.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 6, height: 6, borderRadius: '50%',
                        backgroundColor: currentImg === i ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{
              width: '100%', height: '100%', backgroundColor: '#F1F5F9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FiAward size={44} color="#CBD5E1" />
            </div>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: '16px 16px 0' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '4px 10px',
            borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.5px',
            backgroundColor: badgeBg, color: badgeColor,
            display: 'inline-block', fontFamily: 'Inter, sans-serif',
          }}>
            {badge}
          </span>
        </div>
        <div style={{ padding: '8px 16px 0' }}>
          <h3 style={{
            fontSize: '15px', fontWeight: 700, color: '#052A73',
            lineHeight: 1.35, margin: 0, fontFamily: 'Inter, sans-serif',
          }}>
            {title}
          </h3>
        </div>
        <div style={{ padding: '10px 16px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiMapPin size={13} color="#94A3B8" />
          <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
            {location}
          </span>
          <span style={{ marginLeft: 'auto' }}>
            {type === 'award'
              ? <FiAward size={15} color="#F59E0B" />
              : <FiCheckCircle size={15} color="#22C55E" />}
          </span>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <Popup award={award} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
};  

/* ─── Badge config ───────────────────────────────────────────── */
const getBadgeInfo = (category) => {
  const badges = {
    'Award':          { badge: 'Award',          badgeBg: '#FED7AA', badgeColor: '#9A3412' },
    'Certification':  { badge: 'Certified',       badgeBg: '#DCFCE7', badgeColor: '#15803D' },
    'Report':         { badge: 'Report',           badgeBg: '#DBEAFE', badgeColor: '#1D4ED8' },
    'safety':         { badge: 'Safety',           badgeBg: '#DCFCE7', badgeColor: '#15803D' },
    'sustainability': { badge: 'Sustainability',   badgeBg: '#D1FAE5', badgeColor: '#065F46' },
    'leadership':     { badge: 'Leadership',       badgeBg: '#FCE7F3', badgeColor: '#9D174D' },
  };
  return badges[category] || { badge: category, badgeBg: '#F1F5F9', badgeColor: '#475569' };
};

/* ─── Data mapping ───────────────────────────────────────────── */
const sampleAwards = awardsAndCertifications.map((award) => {
  const badgeInfo = getBadgeInfo(award.category);
  return {
    id:          award.id,
    image:       award.image,
    clientImage: award.clientImage,
    badge:       badgeInfo.badge,
    badgeBg:     badgeInfo.badgeBg,
    badgeColor:  badgeInfo.badgeColor,
    title:       award.title,
    location:    award.location || 'India',
    year:        award.year || null,
    description: award.description,
    type:        award.category === 'Certification' ? 'certificate' : 'award',
    videoUrl:    award.videoUrl || null,
    pdf:         award.pdf || null,
  };
});

export { sampleAwards };
export default AwardsCard;