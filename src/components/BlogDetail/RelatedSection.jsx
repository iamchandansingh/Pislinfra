// src/components/BlogDetail/RelatedSection.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';

// ==================== PROJECT CARD ====================
const ProjectCard = ({ project }) => {
  const projectUrl = project.slug ? `/projects/${project.slug}` : project.url || '#';

  return (
    <Link
      to={projectUrl}
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={project.image || '/placeholder-project.jpg'}
          alt={project.title || 'Related project'}
          style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        {project.category && (
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '12px',
            borderRadius: '9999px',
            backgroundColor: '#FF6B00',
            padding: '3px 10px',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
          }}>
            {project.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        padding: '16px',
        fontFamily: 'Inter, sans-serif',
      }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 700,
          lineHeight: 1.4,
          color: '#081B4B',
          margin: '0 0 6px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {project.title || 'Untitled Project'}
        </h3>
        {project.description && (
          <p style={{
            fontSize: '12px',
            lineHeight: 1.5,
            color: '#64748B',
            margin: '0 0 8px 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {project.description}
          </p>
        )}
        {project.location && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            color: '#94A3B8',
            marginTop: 'auto',
          }}>
            <FiMapPin size={12} style={{ color: '#FF6B00' }} />
            <span>{project.location}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

// ==================== ARTICLE CARD ====================
const ArticleCard = ({ article }) => {
  const articleUrl = article.slug ? `/blog/${article.slug}` : article.url || '#';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Link
      to={articleUrl}
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
        <img
          src={article.image || article.featuredImage || '/placeholder-blog.jpg'}
          alt={article.title || 'Related article'}
          style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        {article.category && (
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '12px',
            borderRadius: '9999px',
            backgroundColor: '#081B4B',
            padding: '3px 10px',
            fontSize: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
          }}>
            {article.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        padding: '16px',
        fontFamily: 'Inter, sans-serif',
      }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 700,
          lineHeight: 1.4,
          color: '#081B4B',
          margin: '0 0 6px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {article.title || 'Untitled Article'}
        </h3>
        <p style={{
          fontSize: '12px',
          lineHeight: 1.5,
          color: '#64748B',
          margin: '0 0 8px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {article.excerpt || article.description || ''}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: '#94A3B8',
          marginTop: 'auto',
        }}>
          {article.publishDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiCalendar size={11} />
              {formatDate(article.publishDate)}
            </span>
          )}
          {article.readTime && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiClock size={11} />
              {article.readTime}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

// ==================== MAIN COMPONENT ====================
const RelatedSection = ({ relatedProjects = [], relatedBlogs = [] }) => {
  const hasProjects = relatedProjects && relatedProjects.length > 0;
  const hasBlogs = relatedBlogs && relatedBlogs.length > 0;

  if (!hasProjects && !hasBlogs) return null;

  return (
    <section style={{
      backgroundColor: '#F8FAFC',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div className="related-container" style={{
        margin: '0 auto',
        width: '100%',
        maxWidth: '1370px',
        padding: '60px 20px',
        boxSizing: 'border-box',
      }}>
        
        {/* ==================== RELATED PROJECTS ==================== */}
        {hasProjects && (
          <div style={{ marginBottom: hasBlogs ? '60px' : '0' }}>
            <div className="related-header" style={{ marginBottom: '32px' }}>
              <span style={{
                display: 'inline-block',
                borderRadius: '9999px',
                backgroundColor: '#FFF0E5',
                padding: '5px 14px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#FF6B00',
              }}>
                Portfolio
              </span>
              <h2 className="related-title" style={{
                fontSize: '30px',
                fontWeight: 800,
                color: '#081B4B',
                margin: '12px 0 0 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                Related Projects
              </h2>
            </div>

            <div className="related-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: '20px',
            }}>
              {relatedProjects.slice(0, 4).map((project, i) => (
                <ProjectCard key={project.id || i} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* ==================== RELATED ARTICLES ==================== */}
        {hasBlogs && (
          <div>
            <div className="related-header" style={{ marginBottom: '32px' }}>
              <span style={{
                display: 'inline-block',
                borderRadius: '9999px',
                backgroundColor: '#EEF2FF',
                padding: '5px 14px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#081B4B',
              }}>
                Insights
              </span>
              <h2 className="related-title" style={{
                fontSize: '30px',
                fontWeight: 800,
                color: '#081B4B',
                margin: '12px 0 0 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                Related Articles
              </h2>
            </div>

            <div className="related-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: '20px',
            }}>
              {relatedBlogs.slice(0, 4).map((article, i) => (
                <ArticleCard key={article.id || i} article={article} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 640px) {
          .related-container {
            padding: 40px 16px !important;
          }
          .related-header {
            margin-bottom: 24px !important;
          }
          .related-title {
            font-size: 24px !important;
            margin-top: 8px !important;
          }
          .related-grid {
            gap: 16px !important;
          }
        }
        @media (max-width: 400px) {
          .related-container {
            padding: 32px 12px !important;
          }
          .related-title {
            font-size: 22px !important;
          }
          .related-grid {
            gap: 12px !important;
          }
        }
        @media (min-width: 640px) {
          .related-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .related-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default RelatedSection;