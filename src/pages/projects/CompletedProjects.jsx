import { useState, useEffect } from 'react';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import ProjectCard from '../../components/cards/ProjectCard';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../../services/wordpress';
import { getImageUrl } from '../../utils/imageUrl';
import Preloader from '../../components/common/Preloader';
import localCompletedProjects from '../../data/completedProjects';

const CompletedProjects = () => {
  const isPreview = Boolean(getPreviewContext());
  const [pageData, setPageData] = useState(() => (isPreview ? null : getLocalDataSync('completed-page')));
  const [projectsList, setProjectsList] = useState(() => (isPreview ? [] : localCompletedProjects));
  const [liveClients, setLiveClients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(() => isPreview);
  const [dataRevision, setDataRevision] = useState(0);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (isPreview) return;
      const cleanEndpoint = e?.detail?.cleanEndpoint || '';
      const fresh = getLocalDataSync('completed-page');
      if (fresh) setPageData(fresh);
      if (!cleanEndpoint || cleanEndpoint.startsWith('completed-projects') || cleanEndpoint.startsWith('clients')) {
        setDataRevision((prev) => prev + 1);
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, [isPreview]);

  useEffect(() => {
    let isMounted = true;
    const getData = async (forceFresh = isPreview) => {
      try {
        const [pData, projData, clientsRes] = await Promise.all([
          fetchWpData('completed-page?populate=*', { forceFresh }),
          fetchWpData('completed-projects?populate=*&pagination[pageSize]=100', { forceFresh }),
          fetchWpData('clients?pagination[pageSize]=100&sort=order:asc&populate=*', { forceFresh }),
        ]);

        if (pData && isMounted) {
          setPageData(pData);
        }

        if (Array.isArray(clientsRes) && isMounted) {
          setLiveClients(clientsRes);
        }

        if (Array.isArray(projData) && isMounted) {
          const formatted = projData.map((item, idx) => {
            const rawImgs = Array.isArray(item.images) && item.images.length > 0
              ? item.images
              : (item.image ? [item.image] : []);
            const imgs = rawImgs.map((img) => getImageUrl(img)).filter(Boolean);
            const numericOrder = item.order !== undefined && item.order !== null && item.order !== ''
              ? Number(item.order)
              : null;

            return {
              id: item.documentId || item.id,
              documentId: item.documentId,
              slug: item.slug || '',
              category: item.category || '',
              name: item.name || item.title || '',
              location: item.location || '',
              state: item.state || '',
              area: item.area || '',
              client: item.client || '',
              timeline: item.timeline || '',
              status: item.projectStatus || item.status || 'Completed',
              scope: item.scope || '',
              order: Number.isFinite(numericOrder) ? numericOrder : null,
              _idx: idx,
              images: imgs,
            };
          });

          formatted.sort((a, b) => {
            const aOrd = a.order !== null && a.order > 0 ? a.order : Number.MAX_SAFE_INTEGER;
            const bOrd = b.order !== null && b.order > 0 ? b.order : Number.MAX_SAFE_INTEGER;
            if (aOrd !== bOrd) return aOrd - bOrd;
            return a._idx - b._idx;
          });

          setProjectsList(formatted);
        }
      } catch (err) {
        console.error('Error fetching completed projects:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getData(isPreview);

    return () => {
      isMounted = false;
    };
  }, [dataRevision, isPreview]);

  const showCategoryFilter = Boolean(pageData?.showCategoryFilter);
  const categories = ['All', ...Array.from(new Set(projectsList.map((p) => (p.category || '').trim()).filter(Boolean)))];
  const filteredProjects = showCategoryFilter && selectedCategory !== 'All'
    ? projectsList.filter((p) => (p.category || '').trim() === selectedCategory)
    : projectsList;

  const configuredPerPage = Number(pageData?.itemsPerPage);
  const itemsPerPage = configuredPerPage > 0 ? configuredPerPage : (filteredProjects.length || 1);
  const totalPages = configuredPerPage > 0 ? Math.ceil(filteredProjects.length / itemsPerPage) : 1;

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  if (loading) return <Preloader />;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = configuredPerPage > 0 ? filteredProjects.slice(startIndex, endIndex) : filteredProjects;

  const heroTitle = pageData?.heroTitle || 'Completed Projects';
  const heroSubtitle = pageData?.heroSubtitle || 'Successfully delivered infrastructure projects across India';
  const heroBreadcrumb = pageData?.heroBreadcrumb || 'Projects / Completed';
  const heroImage = pageData?.heroImage ? getImageUrl(pageData.heroImage, '/images/hero/Completed-Projects.png') : '/images/hero/Completed-Projects.png';

  const fallbackTitle = 'Completed Projects & Project Portfolio | Pislinfra';
  const fallbackDescription = "Explore Pislinfra's completed projects across industrial, warehousing and infrastructure sectors, showcasing quality, safety and successful project delivery.";

  const resolvedTitle = (pageData?.metaTitle || pageData?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (pageData?.metaDescription || pageData?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (pageData?.primaryKeyword || pageData?.seo?.primaryKeyword || 'Completed Construction Projects').trim();
  const resolvedFocusKeywords = (pageData?.focusKeywords || pageData?.seo?.focusKeywords || '').trim();
  const resolvedOgImage = getImageUrl(pageData?.seo?.ogImage || pageData?.ogImage || pageData?.heroImage, 'https://pislinfra.com/images/hero/Completed-Projects.png');
  const resolvedTwitterImage = getImageUrl(pageData?.seo?.twitterImage || pageData?.twitterImage || pageData?.heroImage, resolvedOgImage);

  const seoData = {
    contentType: 'page',
    slug: 'projects/completed',
    canonicalUrl: 'https://pislinfra.com/projects/completed',
    ogType: 'website',
    twitterCardType: 'summary_large_image',
    schemaType: 'CollectionPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Projects', 'Completed', 'Construction', 'Industrial', 'Portfolio', 'Pislinfra'],
    ...(pageData?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: pageData?.seo?.seoKeywords || resolvedFocusKeywords || 'Completed Construction Projects, completed projects, industrial construction, warehouse projects, logistics park, infrastructure portfolio, delivered projects, Pislinfra',
    canonicalUrl: pageData?.seo?.canonicalUrl || 'https://pislinfra.com/projects/completed',
    ogTitle: pageData?.ogTitle || pageData?.seo?.ogTitle || resolvedTitle,
    ogDescription: pageData?.ogDescription || pageData?.seo?.ogDescription || resolvedDescription,
    ogImage: resolvedOgImage,
    twitterTitle: pageData?.twitterTitle || pageData?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: pageData?.twitterDescription || pageData?.seo?.twitterDescription || resolvedDescription,
    twitterImage: resolvedTwitterImage,
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const showHero = pageData?.showHero !== false;
  const showDescription = pageData?.showDescription !== false;
  const showSectionHeader = pageData?.showSectionHeader !== false;
  const showCounter = pageData?.showCounter !== false;
  const sectionHeading = (pageData?.sectionTitle || heroTitle).trim();
  const counterLabel = (pageData?.totalCountLabel || 'Total Projects:').trim();
  const emptyStateMessage = (pageData?.emptyStateText || 'No completed projects found.').trim();

  return (
    <div>
      <BlogSEO blog={seoData} />

      {showHero && (
        <PageHero
          title={heroTitle}
          subtitle={heroSubtitle}
          breadcrumb={heroBreadcrumb}
          bgImage={heroImage}
        />
      )}

      <section className="completed-projects-section">
        <div className="completed-projects-container">
          {(showSectionHeader || (showDescription && pageData?.description)) && (
            <div className="completed-header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {showSectionHeader && (
                  <h2 className="completed-title">
                    {sectionHeading}
                  </h2>
                )}
                {showDescription && pageData?.description && (
                  <p className="completed-desc">
                    {pageData.description}
                  </p>
                )}
              </div>

              {showSectionHeader && showCounter && (
                <div className="completed-counter-badge">
                  <span className="counter-label">{counterLabel}</span>
                  <span className="counter-val">
                    {filteredProjects.length}
                  </span>
                </div>
              )}
            </div>
          )}

          {showCategoryFilter && categories.length > 1 && (
            <div className="completed-filter-bar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`completed-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {currentProjects.length === 0 ? (
            <div className="completed-empty-state">
              {emptyStateMessage}
            </div>
          ) : (
            <div className="projects-grid">
              {currentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  type="completed"
                  clientsList={liveClients}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="completed-pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-nav-btn"
                aria-label="Previous page"
              >
                <HiChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`page-num-btn ${page === currentPage ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-nav-btn"
                aria-label="Next page"
              >
                <HiChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .completed-projects-section {
          padding: 60px 16px;
          background-color: #f9fafb;
          min-height: 60vh;
        }
        .completed-projects-container {
          max-width: 1400px;
          margin: 0 auto;
        }
        .completed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .completed-title {
          font-size: 36px;
          font-weight: bold;
          color: #2a2a75;
          margin: 0;
        }
        .completed-desc {
          margin: 0;
          color: #64748b;
          font-size: 16px;
          max-width: 800px;
        }
        .completed-counter-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: #f8fafc;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .counter-label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }
        .counter-val {
          font-size: 16px;
          color: #0a2a66;
          font-weight: 700;
        }
        .completed-filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }
        .completed-filter-btn {
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid #cbd5e1;
          background-color: #ffffff;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
        }
        .completed-filter-btn.active {
          border-color: #ff8755;
          background-color: #fff5f0;
          color: #ff8755;
        }
        .completed-empty-state {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 48px 24px;
          text-align: center;
          font-size: 15px;
          color: #64748b;
          font-family: 'Inter', sans-serif;
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .completed-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 40px;
          flex-wrap: wrap;
        }
        .page-nav-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background-color: #ffffff;
          color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .page-nav-btn:disabled {
          background-color: #f9fafb;
          color: #d1d5db;
          cursor: not-allowed;
        }
        .page-num-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background-color: #ffffff;
          color: #374151;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
        }
        .page-num-btn.active {
          border: 2px solid #ff8755;
          background-color: #fff5f0;
          color: #ff8755;
          font-weight: 700;
        }
        @media (max-width: 1200px) { .projects-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 900px) { .projects-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .projects-grid { grid-template-columns: repeat(1, 1fr) !important; } }
      `}</style>
    </div>
  );
};

export default CompletedProjects;
