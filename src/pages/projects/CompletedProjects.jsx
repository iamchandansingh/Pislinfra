import { useState, useEffect } from 'react'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import ProjectCard from '../../components/cards/ProjectCard'
import { fetchStrapiData, getLocalDataSync } from '../../services/strapi'
import { getImageUrl } from '../../utils/imageUrl'
import Preloader from '../../components/common/Preloader'
import localCompletedProjects from '../../data/completedProjects'

const slugify = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const CompletedProjects = () => {
  const [pageData, setPageData] = useState(() => getLocalDataSync('completed-page'))
  const [projectsList, setProjectsList] = useState(localCompletedProjects)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getLocalDataSync('completed-page');
      if (fresh) setPageData(fresh);
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const getData = async (forceFresh = false) => {
      try {
        const [pData, projData] = await Promise.all([
          fetchStrapiData('completed-page?populate=*', { forceFresh }),
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

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Preloader />;

  const heroTitle = pageData?.heroTitle || "Completed Projects";
  const heroSubtitle = pageData?.heroSubtitle || "Successfully delivered infrastructure projects across India";
  const heroBreadcrumb = pageData?.heroBreadcrumb || "Projects / Completed";
  const heroImage = pageData?.heroImage ? getImageUrl(pageData.heroImage, "/images/hero/Completed-Projects.png") : "/images/hero/Completed-Projects.png";

  const fallbackTitle = 'Completed Projects & Project Portfolio | Pislinfra';
  const fallbackDescription = "Explore Pislinfra's completed projects across industrial, warehousing and infrastructure sectors, showcasing quality, safety and successful project delivery.";

  // Connect CMS Completed Projects page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = (pageData?.metaTitle || pageData?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (pageData?.metaDescription || pageData?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (pageData?.primaryKeyword || pageData?.seo?.primaryKeyword || 'Completed Construction Projects').trim();
  const resolvedFocusKeywords = (pageData?.focusKeywords || pageData?.seo?.focusKeywords || '').trim();

  const seoData = {
    contentType: 'page',
    ...(pageData?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: pageData?.seo?.seoKeywords || resolvedFocusKeywords || 'Completed Construction Projects, completed projects, industrial construction, warehouse projects, logistics park, infrastructure portfolio, delivered projects, Pislinfra',
    slug: 'projects/completed',
    canonicalUrl: 'https://pislinfra.com/projects/completed',
    ogTitle: pageData?.ogTitle || pageData?.seo?.ogTitle || resolvedTitle,
    ogDescription: pageData?.ogDescription || pageData?.seo?.ogDescription || resolvedDescription,
    ogImage: pageData?.seo?.ogImage || (pageData?.heroImage?.url ? getImageUrl(pageData.heroImage) : 'https://pislinfra.com/images/hero/Completed-Projects.png'),
    ogType: 'website',
    twitterTitle: pageData?.twitterTitle || pageData?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: pageData?.twitterDescription || pageData?.seo?.twitterDescription || resolvedDescription,
    twitterImage: pageData?.seo?.twitterImage || (pageData?.heroImage?.url ? getImageUrl(pageData.heroImage) : 'https://pislinfra.com/images/hero/Completed-Projects.png'),
    twitterCardType: 'summary_large_image',
    schemaType: 'CollectionPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Projects', 'Completed', 'Construction', 'Industrial', 'Portfolio', 'Pislinfra'],
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
