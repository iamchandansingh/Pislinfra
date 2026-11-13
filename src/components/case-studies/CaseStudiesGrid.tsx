import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiGrid, FiCalendar, FiClock } from 'react-icons/fi';
import { getImageUrl } from '../../utils/imageUrl';
import caseStudies from '../../data/caseStudies';

const CaseStudiesGrid: React.FC<any> = ({
  caseStudies: strapiCaseStudies,
  title,
  itemsPerPage: propItemsPerPage,
  emptyStateText,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const parsedPerPage = Number(propItemsPerPage);
  const itemsPerPage = parsedPerPage > 0 ? parsedPerPage : 8;

  const sourceList = Array.isArray(strapiCaseStudies) ? strapiCaseStudies : caseStudies;
  const mappedStudies = sourceList.map((study, index) => ({
    id: study.id || index + 1,
    slug: study.slug,
    title: study.title,
    location: study.location,
    area: study.buildUpArea || study.plinthArea || 'N/A',
    completed: study.completionYear || '2024',
    duration: study.duration || '9 Months',
    image: getImageUrl(study.image, '/images/hero/Case-Study.png'),
    developer: study.developer,
    project: study.project,
    plinthArea: study.plinthArea,
    buildUpArea: study.buildUpArea,
  }));

  const totalPages = Math.ceil(mappedStudies.length / itemsPerPage);
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudies = mappedStudies.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: (document.getElementById('case-studies-grid')?.offsetTop || 100) - 100, behavior: 'smooth' });
  };

  return (
    <div style={{ width: '100%', padding: '20px 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1370px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>

        <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 800, color: '#0A2A66', marginBottom: '24px', fontFamily: 'Inter, sans-serif' }}>
          {title || 'All Case Studies'}
        </h2>

        {currentStudies.length === 0 ? (
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '40px 24px', textAlign: 'center', color: '#64748B', fontSize: '15px', fontFamily: 'Inter, sans-serif' }}>
            {emptyStateText || 'No case studies found.'}
          </div>
        ) : (
          <div id="case-studies-grid" className="studies-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {currentStudies.map((study) => (
              <div key={study.id} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
                onClick={() => navigate(`/projects/case-study/${encodeURIComponent(study.slug)}`)}
              >
                <div>
                  <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={study.image}
                      alt={study.title || 'Case Study Project - Pragati Infra Solutions'}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                    />
                  </div>

                  <div style={{ padding: '16px 18px 12px 18px' }}>
                    <h3 style={{
                      fontSize: 'clamp(14px, 1.3vw, 16px)',
                      fontWeight: 700,
                      color: '#0A2A66',
                      lineHeight: 1.4,
                      margin: '0 0 8px 0',
                      fontFamily: 'Inter, sans-serif',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '44px',
                    }}>
                      {study.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minHeight: '20px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', color: '#FF6B35' }}>
                        <FiMapPin size={13} />
                      </span>
                      <span style={{
                        fontSize: '11.5px',
                        color: '#4B5563',
                        fontWeight: 500,
                        fontFamily: 'Inter, sans-serif',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>{study.location}</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0 18px 18px 18px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    borderTop: '1px solid #E2E8F0',
                    borderBottom: '1px solid #E2E8F0',
                    padding: '12px 0',
                    alignItems: 'stretch',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRight: '1px solid #E2E8F0', padding: '0 4px', minWidth: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', color: '#0A2A66', marginBottom: '4px' }}>
                        <FiGrid size={14} />
                      </span>
                      <p style={{ fontSize: '8.5px', color: '#9CA3AF', margin: '0 0 2px 0', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.3px', fontFamily: 'Inter, sans-serif' }}>Area</p>
                      <p style={{
                        fontSize: 'clamp(9px, 1vw, 11px)',
                        fontWeight: 700,
                        color: '#374151',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>{study.area}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRight: '1px solid #E2E8F0', padding: '0 4px', minWidth: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', color: '#0A2A66', marginBottom: '4px' }}>
                        <FiCalendar size={14} />
                      </span>
                      <p style={{ fontSize: '8.5px', color: '#9CA3AF', margin: '0 0 2px 0', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.3px', fontFamily: 'Inter, sans-serif' }}>Completed</p>
                      <p style={{
                        fontSize: 'clamp(9px, 1vw, 11px)',
                        fontWeight: 700,
                        color: '#374151',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>{study.completed}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 4px', minWidth: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', color: '#0A2A66', marginBottom: '4px' }}>
                        <FiClock size={14} />
                      </span>
                      <p style={{ fontSize: '8.5px', color: '#9CA3AF', margin: '0 0 2px 0', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.3px', fontFamily: 'Inter, sans-serif' }}>Duration</p>
                      <p style={{
                        fontSize: 'clamp(9px, 1vw, 11px)',
                        fontWeight: 700,
                        color: '#374151',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>{study.duration}</p>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px', flexWrap: 'wrap' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  border: page === currentPage ? '2px solid #FF6B35' : '1px solid #E2E8F0',
                  backgroundColor: page === currentPage ? '#FFF5F0' : '#FFFFFF',
                  color: page === currentPage ? '#FF6B35' : '#374151',
                  fontWeight: page === currentPage ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {page}
              </button>
            ))}
          </div>
        )}

      </div>
      <style>{`
        @media (max-width: 1200px) {
          .studies-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .studies-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .studies-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default CaseStudiesGrid;
