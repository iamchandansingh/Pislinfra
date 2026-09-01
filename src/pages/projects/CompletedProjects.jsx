import { useState, useEffect } from 'react'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import ProjectCard from '../../components/cards/ProjectCard'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { fetchStrapiData } from '../../services/strapi'
import Preloader from '../../components/common/Preloader'
import localCompletedProjects from '../../data/completedProjects'

const slugify = (str) => (str || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const CompletedProjects = () => {
  const [pageData, setPageData] = useState(null)
  const [projectsList, setProjectsList] = useState(localCompletedProjects)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100
  
  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      try {
        const pData = await fetchStrapiData('completed-page?populate=seo,heroImage');
        if (pData && isMounted) {
          setPageData(pData);
        }

        const projData = await fetchStrapiData('completed-projects?populate=*&pagination[pageSize]=100&sort=createdAt:asc');
        if (projData && Array.isArray(projData) && projData.length > 0 && isMounted) {
          const formatted = projData.map(item => {
            const matchLocal = localCompletedProjects.find(lp => slugify(lp.name) === slugify(item.name)) || {};
            const imgs = item.images && item.images.length > 0 
              ? item.images.map(img => img.url?.startsWith('http') ? img.url : `${img.url}`)
              : (matchLocal.images || []);

            return {
              id: item.documentId || item.id,
              category: item.category || matchLocal.category,
              name: item.name || matchLocal.name,
              location: item.location || matchLocal.location,
              state: item.state || matchLocal.state,
              area: item.area || matchLocal.area,
              client: item.client || matchLocal.client,
              timeline: item.timeline || matchLocal.timeline,
              status: item.projectStatus || item.status || 'Completed',
              scope: item.scope || matchLocal.scope,
              images: imgs.length > 0 ? imgs : (matchLocal.images || [])
            };
          });
          setProjectsList(formatted);
        }
      } catch (err) {
        console.error("Error fetching completed projects:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    getData();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <Preloader />;
  
  const getImageUrl = (img) => {
    if (!img) return null;
    return img.url?.startsWith('http') ? img.url : `${img.url}`;
  };

  const totalPages = Math.ceil(projectsList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = projectsList.slice(startIndex, endIndex)

  const heroTitle = pageData?.heroTitle || "Completed Projects";
  const heroSubtitle = pageData?.heroSubtitle || "Successfully delivered infrastructure projects across India";
  const heroBreadcrumb = pageData?.heroBreadcrumb || "Projects / Completed";
  const heroImage = pageData?.heroImage ? getImageUrl(pageData.heroImage) : "/images/hero/Completed-Projects.png";

  const seoData = pageData?.seo || {
    contentType: 'page',
    title: 'Completed Projects',
    seoTitle: 'Completed Projects | Pislinfra',
    seoDescription: 'Explore Pislinfra\'s successfully delivered industrial projects - warehousing, logistics parks & infrastructure completed across India. 16M+ sq ft delivered.',
    seoKeywords: 'completed projects, industrial construction, warehouse projects, logistics park, infrastructure portfolio, delivered projects, Pislinfra',
    slug: 'projects/completed',
    canonicalUrl: 'https://pislinfra.com/projects/completed',
    ogTitle: 'Completed Projects - Industrial Portfolio | Pislinfra',
    ogDescription: 'Successfully delivered infrastructure projects across India.',
    ogImage: 'https://pislinfra.com/images/hero/Completed-Projects.png',
    ogType: 'website',
    twitterTitle: 'Completed Projects | Pislinfra',
    twitterDescription: 'Our portfolio of successfully delivered industrial projects.',
    twitterImage: 'https://pislinfra.com/images/hero/Completed-Projects.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Projects', 'Completed', 'Construction', 'Industrial', 'Portfolio'],
  };

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title={heroTitle} 
        subtitle={heroSubtitle}
        breadcrumb={heroBreadcrumb}
        bgImage={heroImage}
      />
      
      <section style={{ padding: '60px 16px', backgroundColor: '#f9fafb', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#2a2a75', margin: 0 }}>
                {heroTitle}
              </h2>
              {pageData?.description && (
                <p style={{ margin: 0, color: '#64748b', fontSize: '16px', maxWidth: '800px' }}>
                  {pageData.description}
                </p>
              )}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f8fafc',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Total Projects:</span>
              <span style={{ fontSize: '16px', color: '#0a2a66', fontWeight: '700' }}>
                {projectsList.length}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="projects-grid">
            {currentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} type="completed" />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '48px' }}>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: currentPage === 1 ? '#f9fafb' : 'white', color: currentPage === 1 ? '#d1d5db' : '#374151', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <HiChevronLeft style={{ fontSize: '18px' }} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => handlePageChange(page)}
                  style={{ width: '40px', height: '40px', borderRadius: '8px', border: page === currentPage ? '2px solid #ff8755' : '1px solid #e5e7eb', backgroundColor: page === currentPage ? '#fff5f0' : 'white', color: page === currentPage ? '#ff8755' : '#374151', fontWeight: page === currentPage ? '700' : '500', fontSize: '14px', cursor: 'pointer' }}
                >
                  {page}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: currentPage === totalPages ? '#f9fafb' : 'white', color: currentPage === totalPages ? '#d1d5db' : '#374151', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <HiChevronRight style={{ fontSize: '18px' }} />
              </button>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 1200px) { .projects-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 900px) { .projects-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .projects-grid { grid-template-columns: repeat(1, 1fr) !important; } }
      `}</style>
    </div>
  )
}

export default CompletedProjects
