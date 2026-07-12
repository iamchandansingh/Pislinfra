import { useState } from 'react'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import ProjectCard from '../../components/cards/ProjectCard'
import projectsData from '../../data/projectsData'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

const OngoingProjects = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16
  
  const totalPages = Math.ceil(projectsData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = projectsData.slice(startIndex, endIndex)

  const seoData = {
    contentType: 'page',
    title: 'Ongoing Projects',
    seoTitle: 'Ongoing Projects | Pislinfra',
    seoDescription: 'Explore Pislinfra\'s ongoing industrial construction projects across India. Warehousing, logistics parks & infrastructure development currently under execution.',
    seoKeywords: 'ongoing projects, industrial construction, warehouse projects, logistics park, infrastructure development, current projects, Pislinfra',
    slug: 'projects/ongoing',
    canonicalUrl: 'https://pislinfra.com/projects/ongoing',
    ogTitle: 'Ongoing Projects - Industrial Construction | Pislinfra',
    ogDescription: 'Current industrial & infrastructure projects under development across India.',
    ogImage: 'https://pislinfra.com/images/hero/Ongoing-Projects.png',
    ogType: 'website',
    twitterTitle: 'Ongoing Projects | Pislinfra',
    twitterDescription: 'Industrial construction projects currently under execution.',
    twitterImage: 'https://pislinfra.com/images/hero/Ongoing-Projects.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Projects', 'Ongoing', 'Construction', 'Industrial', 'Infrastructure'],
  };

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title="Ongoing Projects" 
        subtitle="Current projects under development across India"
        breadcrumb="Projects / Ongoing"
        bgImage="/images/hero/Ongoing-Projects.png"
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
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#2a2a75', margin: 0 }}>
              Ongoing Projects
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
              <ProjectCard key={project.id} project={project} />
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

export default OngoingProjects