import { useState, useEffect } from 'react'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import ProjectCard from '../../components/cards/ProjectCard'
import { fetchStrapiData, STRAPI_URL } from '../../services/strapi'
import { getImageUrl } from '../../utils/imageUrl'
import Preloader from '../../components/common/Preloader'
import localCompletedProjects from '../../data/completedProjects'

const slugify = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const CompletedProjects = () => {
  const [pageData, setPageData] = useState(null)
  const [projectsList, setProjectsList] = useState(localCompletedProjects)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    let isMounted = true;
    const getData = async (forceFresh = false) => {
      try {
        const [pData, projData] = await Promise.all([
          fetchStrapiData('completed-page?populate=seo,heroImage', { forceFresh }),
          fetchStrapiData('completed-projects?populate=*&pagination[pageSize]=100', { forceFresh })
        ]);

        if (pData && isMounted) {
          setPageData(pData);
        }

        if (projData && Array.isArray(projData) && projData.length > 0 && isMounted) {
          const formatted = projData.map(item => {
            const matchLocal = localCompletedProjects.find(lp => {
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
              status: item.projectStatus || item.status || 'Completed',
              scope: item.scope || matchLocal.scope,
              images: imgs.length > 0 ? imgs : (matchLocal.images || [])
            };
          });

          const existingSlugs = new Set(formatted.map(p => slugify(p.name)));
          const missingCompleted = localCompletedProjects.filter(p => !existingSlugs.has(slugify(p.name)));
          setProjectsList([...formatted, ...missingCompleted]);
        }
      } catch (err) {
        console.error("Error fetching completed projects:", err);
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
        const res = await fetch(`${STRAPI_URL}/api/completed-projects?fields[0]=updatedAt&sort=updatedAt:desc&pagination[pageSize]=1`, {
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

    const intervalId = setInterval(pollFast, 10000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(intervalId);
    };
  }, []);

  if (loading) return <Preloader />;

  const heroTitle = pageData?.heroTitle || "Completed Projects";
  const heroSubtitle = pageData?.heroSubtitle || "Successfully delivered infrastructure projects across India";
  const heroBreadcrumb = pageData?.heroBreadcrumb || "Projects / Completed";
  const heroImage = pageData?.heroImage ? getImageUrl(pageData.heroImage, "/images/hero/Completed-Projects.png") : "/images/hero/Completed-Projects.png";

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
            {projectsList.map((project) => (
              <ProjectCard key={project.id} project={project} type="completed" />
            ))}
          </div>
          
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
