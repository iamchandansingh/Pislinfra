import { useState, useEffect } from 'react'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import ProjectCard from '../../components/cards/ProjectCard'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { fetchStrapiData, STRAPI_URL, getLocalDataSync } from '../../services/strapi'
import { getImageUrl } from '../../utils/imageUrl'
import Preloader from '../../components/common/Preloader'
import localProjectsData from '../../data/projectsData'

const slugify = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const OngoingProjects = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [projectsData, setProjectsData] = useState(localProjectsData)
  const [pageData, setPageData] = useState(() => getLocalDataSync('ongoing-page'))
  const [loading, setLoading] = useState(false)
  const itemsPerPage = 16

  useEffect(() => {
    let isMounted = true;
    const getData = async (forceFresh = false) => {
      try {
        const [pData, projData] = await Promise.all([
          fetchStrapiData('ongoing-page?populate=seo,heroImage', { forceFresh }),
          fetchStrapiData('ongoing-projects?populate=*&pagination[pageSize]=100', { forceFresh })
        ]);

        if (pData && isMounted) {
          setPageData(pData);
        }

        if (projData && Array.isArray(projData) && projData.length > 0 && isMounted) {
          const filtered = projData.filter(item => {
            const n = (item.name || item.title || '').toLowerCase();
            return !n.includes('humsafar') && !n.includes('logistics park llp');
          });
          const formatted = filtered.map(item => {
            const matchLocal = localProjectsData.find(lp => {
              if (item.documentId && lp.documentId && item.documentId === lp.documentId) return true;
              const sL = slugify(lp.name);
              const sI = slugify(item.name);
              const locL = slugify(lp.location);
              const locI = slugify(item.location);
              if (sL === sI) {
                if (locL && locI) return locL === locI;
                return true;
              }
              return (sL && sI && (sL.includes(sI) || sI.includes(sL)));
            }) || {};
            const rawImgs = Array.isArray(item.images) && item.images.length > 0
              ? item.images
              : (item.image ? [item.image] : []);
            const strapiImages = rawImgs.map(img => getImageUrl(img)).filter(Boolean);
            const imgs = strapiImages.length > 0 ? strapiImages : (matchLocal.images || (matchLocal.image ? [matchLocal.image] : []));

            return {
              id: item.documentId || item.id,
              documentId: item.documentId,
              category: item.category || matchLocal.category,
              name: item.name || matchLocal.name,
              location: item.location || matchLocal.location,
              state: item.state || matchLocal.state,
              area: item.area || matchLocal.area,
              client: item.client || matchLocal.client,
              timeline: item.timeline || matchLocal.timeline,
              status: item.projectStatus || item.status || 'Ongoing',
              scope: item.scope || matchLocal.scope,
              images: imgs.length > 0 ? imgs : (matchLocal.images || [])
            };
          });
          setProjectsData(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch ongoing projects', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Preloader />;

  const totalPages = Math.ceil(projectsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projectsData.slice(startIndex, endIndex);

  const seoData = {
    contentType: 'page',
    title: pageData?.seo?.seoTitle || 'Ongoing Industrial Construction Projects | Pislinfra',
    seoTitle: pageData?.seo?.seoTitle || 'Ongoing Industrial Projects & Construction Sites in India | Pislinfra',
    seoDescription: pageData?.seo?.seoDescription || 'Explore Pislinfra\'s ongoing industrial construction, warehouse developments, PEB steel plants, and infrastructure sites under execution across India.',
    seoKeywords: pageData?.seo?.seoKeywords || 'ongoing industrial projects, warehouse construction sites India, PEB manufacturing plants under construction, civil infrastructure ongoing work, Pislinfra projects',
    slug: 'projects/ongoing',
    canonicalUrl: 'https://pislinfra.com/projects/ongoing',
    ogTitle: pageData?.seo?.ogTitle || 'Ongoing Industrial Projects & Construction Sites | Pislinfra',
    ogDescription: pageData?.seo?.ogDescription || 'Explore active industrial & warehouse construction projects under development by Pislinfra across India.',
    ogImage: pageData?.heroImage?.url || '/images/hero/Ongoing-Projects.png',
    ogType: 'website',
    twitterTitle: pageData?.seo?.twitterTitle || 'Ongoing Industrial Projects | Pislinfra',
    twitterDescription: pageData?.seo?.twitterDescription || 'Current industrial & infrastructure projects under development across India.',
    twitterImage: pageData?.heroImage?.url || '/images/hero/Ongoing-Projects.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'CollectionPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Ongoing Projects', 'Industrial Construction', 'Warehousing', 'Infrastructure Sites', 'India Projects'],
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const heroImage = pageData?.heroImage ? getImageUrl(pageData.heroImage, "/images/hero/Ongoing-Projects.png") : "/images/hero/Ongoing-Projects.png";

  return (
    <div>
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title={pageData?.heroTitle || "Ongoing Projects"} 
        subtitle={pageData?.heroSubtitle || "Current projects under development across India"}
        breadcrumb={pageData?.heroBreadcrumb || "Projects / Ongoing"}
        bgImage={heroImage}
      />
      
      <section className="ongoing-projects-section">
        <div className="ongoing-projects-container">
          
          {pageData?.description && (
            <div className="ongoing-desc-box" dangerouslySetInnerHTML={{ __html: pageData.description.replace(/\n/g, '<br />') }} />
          )}

          <div className="ongoing-header">
            <h2 className="ongoing-title">
              {pageData?.heroTitle || "Ongoing Projects"}
            </h2>
            
            <div className="ongoing-counter-badge">
              <span className="counter-label">Total Projects:</span>
              <span className="counter-val">
                {projectsData.length}
              </span>
            </div>
          </div>

          <div className="projects-grid">
            {currentProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                type="ongoing"
              />
            ))}
          </div>

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