import { useState, useEffect } from 'react'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import ProjectCard from '../../components/cards/ProjectCard'
import { HiChevronLeft, HiChevronRight, HiCheckCircle, HiExclamation } from 'react-icons/hi'
import { fetchStrapiData, STRAPI_URL } from '../../services/strapi'
import { getImageUrl } from '../../utils/imageUrl'
import Preloader from '../../components/common/Preloader'
import localProjectsData from '../../data/projectsData'

const slugify = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const OngoingProjects = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [projectsData, setProjectsData] = useState(localProjectsData)
  const [pageData, setPageData] = useState(null)
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

    const handleFocus = () => {
      getData(true);
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        getData(true);
      }
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleVisibility);

    let isPolling = false;
    let lastSig = '';
    const pollFast = async () => {
      if (!isMounted || isPolling) return;
      isPolling = true;
      try {
        const res = await fetch(`${STRAPI_URL}/api/ongoing-projects?fields[0]=updatedAt&sort=updatedAt:desc&pagination[pageSize]=1`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store' }
        });
        if (res.ok) {
          const json = await res.json();
          const latestTs = json?.data?.[0]?.updatedAt;
          const total = json?.meta?.pagination?.total;
          const currentSig = `${latestTs}_${total}`;
          if (lastSig && lastSig !== currentSig) {
            getData(true);
          }
          lastSig = currentSig;
        }
      } catch (e) {} finally {
        isPolling = false;
      }
    };

    const intervalId = setInterval(pollFast, 60000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(intervalId);
    };
  }, []);

  if (loading) return <Preloader />;

  const totalPages = Math.ceil(projectsData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = projectsData.slice(startIndex, endIndex)

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
    setCurrentPage(page)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

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
      
      <section style={{ padding: '60px 16px', backgroundColor: '#f9fafb', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {pageData?.description && (
            <div style={{ marginBottom: '40px', fontSize: '16px', color: '#475569', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }} dangerouslySetInnerHTML={{ __html: pageData.description.replace(/\n/g, '<br />') }} />
          )}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#2a2a75', margin: 0 }}>
              {pageData?.heroTitle || "Ongoing Projects"}
            </h2>
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
                {projectsData.length}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="projects-grid">
            {currentProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                type="ongoing"
              />
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default OngoingProjects