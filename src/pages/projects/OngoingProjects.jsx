import { useState, useEffect } from 'react'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import ProjectCard from '../../components/cards/ProjectCard'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../../services/wordpress'
import { getImageUrl } from '../../utils/imageUrl'
import Preloader from '../../components/common/Preloader'
import localProjectsData from '../../data/projectsData'

const OngoingProjects = () => {
  const isPreview = Boolean(getPreviewContext())
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [projectsData, setProjectsData] = useState(() => (isPreview ? [] : localProjectsData))
  const [liveClients, setLiveClients] = useState([])
  const [pageData, setPageData] = useState(() => (isPreview ? null : getLocalDataSync('ongoing-page')))
  const [loading, setLoading] = useState(() => isPreview)
  const [dataRevision, setDataRevision] = useState(0)

  const configuredPerPage = Number(pageData?.itemsPerPage)
  const itemsPerPage = configuredPerPage > 0 ? configuredPerPage : 16

  useEffect(() => {
    const handleUpdate = (e) => {
      if (isPreview) return;
      const cleanEndpoint = e?.detail?.cleanEndpoint || '';
      const fresh = getLocalDataSync('ongoing-page');
      if (fresh) setPageData(fresh);
      if (!cleanEndpoint || cleanEndpoint.startsWith('ongoing-projects') || cleanEndpoint.startsWith('clients')) {
        setDataRevision(prev => prev + 1);
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
          fetchWpData('ongoing-page?populate=*', { forceFresh }),
          fetchWpData('ongoing-projects?populate=*&pagination[pageSize]=100', { forceFresh }),
          fetchWpData('clients?pagination[pageSize]=100&sort=order:asc&populate=*', { forceFresh })
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
            const imgs = rawImgs.map(img => getImageUrl(img)).filter(Boolean);
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
              status: item.projectStatus || item.status || 'Ongoing',
              scope: item.scope || '',
              order: Number.isFinite(numericOrder) ? numericOrder : null,
              _idx: idx,
              images: imgs
            };
          });

          formatted.sort((a, b) => {
            const aOrd = a.order !== null && a.order > 0 ? a.order : Number.MAX_SAFE_INTEGER;
            const bOrd = b.order !== null && b.order > 0 ? b.order : Number.MAX_SAFE_INTEGER;
            if (aOrd !== bOrd) return aOrd - bOrd;
            return a._idx - b._idx;
          });

          setProjectsData(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch ongoing projects', err);
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
  const categories = ['All', ...Array.from(new Set(projectsData.map(p => (p.category || '').trim()).filter(Boolean)))];
  const filteredProjects = showCategoryFilter && selectedCategory !== 'All'
    ? projectsData.filter(p => (p.category || '').trim() === selectedCategory)
    : projectsData;

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

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
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const fallbackTitle = 'Ongoing Projects | Pislinfra– Building India’s Future';
  const fallbackDescription = 'Explore Pislinfra\'s ongoing projects across industrial, infrastructure, warehousing and logistics sectors, delivering quality construction solutions across India.';

  // Connect CMS Ongoing Projects page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = (pageData?.metaTitle || pageData?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (pageData?.metaDescription || pageData?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (pageData?.primaryKeyword || pageData?.seo?.primaryKeyword || 'Ongoing Construction Projects').trim();
  const resolvedFocusKeywords = (pageData?.focusKeywords || pageData?.seo?.focusKeywords || '').trim();
  const heroImage = pageData?.heroImage ? getImageUrl(pageData.heroImage, "/images/hero/Ongoing-Projects.png") : "/images/hero/Ongoing-Projects.png";
  const resolvedOgImage = getImageUrl(pageData?.seo?.ogImage || pageData?.heroImage, '/images/hero/Ongoing-Projects.png');
  const resolvedTwitterImage = getImageUrl(pageData?.seo?.twitterImage || pageData?.heroImage, '/images/hero/Ongoing-Projects.png');

  const seoData = {
    contentType: 'page',
    slug: 'projects/ongoing',
    canonicalUrl: 'https://pislinfra.com/projects/ongoing',
    ogType: 'website',
    twitterCardType: 'summary_large_image',
    schemaType: 'CollectionPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Ongoing Projects', 'Industrial Construction', 'Warehousing', 'Infrastructure Sites', 'India Projects'],
    ...(pageData?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: pageData?.seo?.seoKeywords || resolvedFocusKeywords || 'Ongoing Construction Projects, ongoing industrial projects, warehouse construction sites India, PEB manufacturing plants under construction, civil infrastructure ongoing work, Pislinfra projects',
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
  const sectionHeading = (pageData?.sectionTitle || pageData?.heroTitle || 'Ongoing Projects').trim();
  const counterLabel = (pageData?.totalCountLabel || 'Total Projects:').trim();
  const emptyStateMessage = (pageData?.emptyStateText || 'No ongoing projects found.').trim();

  return (
    <div>
      <BlogSEO blog={seoData} />
      
      {showHero && (
        <PageHero 
          title={pageData?.heroTitle || "Ongoing Projects"} 
          subtitle={pageData?.heroSubtitle || "Current projects under development across India"}
          breadcrumb={pageData?.heroBreadcrumb || "Projects / Ongoing"}
          bgImage={heroImage}
        />
      )}
      
      <section className="ongoing-projects-section">
        <div className="ongoing-projects-container">
          
          {showDescription && pageData?.description && (
            <div className="ongoing-desc-box" dangerouslySetInnerHTML={{ __html: pageData.description.replace(/\n/g, '<br />') }} />
          )}

          {showSectionHeader && (
            <div className="ongoing-header">
              <h2 className="ongoing-title">
                {sectionHeading}
              </h2>
              
              {showCounter && (
                <div className="ongoing-counter-badge">
                  <span className="counter-label">{counterLabel}</span>
                  <span className="counter-val">
                    {filteredProjects.length}
                  </span>
                </div>
              )}
            </div>
          )}

          {showCategoryFilter && categories.length > 1 && (
            <div className="ongoing-filter-bar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`ongoing-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {currentProjects.length === 0 ? (
            <div className="ongoing-empty-state">
              {emptyStateMessage}
            </div>
          ) : (
            <div className="projects-grid">
              {currentProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  type="ongoing"
                  clientsList={liveClients}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="ongoing-pagination">
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
        .ongoing-projects-section {
          padding: 40px 16px 60px 16px;
          background-color: #f8fafc;
          min-height: 60vh;
        }
        .ongoing-projects-container {
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }
        .ongoing-desc-box {
          margin-bottom: 24px;
          font-size: 15px;
          color: #475569;
          line-height: 1.65;
          font-family: 'Inter', sans-serif;
        }
        .ongoing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 14px;
        }
        .ongoing-title {
          font-size: clamp(24px, 3.2vw, 36px);
          font-weight: 800;
          color: #2a2a75;
          line-height: 1.2;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }
        .ongoing-counter-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #f8fafc;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-family: 'Inter', sans-serif;
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
        .ongoing-filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }
        .ongoing-filter-btn {
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
        .ongoing-filter-btn.active {
          border-color: #ff8755;
          background-color: #fff5f0;
          color: #ff8755;
        }
        .ongoing-empty-state {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 48px 24px;
          text-align: center;
          font-size: 15px;
          color: #64748b;
          font-family: 'Inter', sans-serif;
        }

        /* Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          box-sizing: border-box;
        }

        /* Pagination */
        .ongoing-pagination {
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
          transition: none !important;
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
          transition: none !important;
        }
        .page-num-btn.active {
          border: 2px solid #ff8755;
          background-color: #fff5f0;
          color: #ff8755;
          font-weight: 700;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
          .projects-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 18px !important;
          }
        }
        @media (max-width: 900px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 600px) {
          .ongoing-projects-section {
            padding: 24px 14px 40px 14px !important;
          }
          .ongoing-header {
            margin-bottom: 20px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .ongoing-title {
            font-size: clamp(22px, 5.5vw, 26px) !important;
          }
          .projects-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .ongoing-pagination {
            margin-top: 30px !important;
            gap: 6px !important;
          }
          .page-nav-btn, .page-num-btn {
            width: 36px !important;
            height: 36px !important;
            font-size: 13px !important;
          }
        }
        @media (max-width: 380px) {
          .ongoing-projects-section {
            padding: 18px 10px 32px 10px !important;
          }
          .ongoing-title {
            font-size: 20px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default OngoingProjects