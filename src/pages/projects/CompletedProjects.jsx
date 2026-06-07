import { useState } from 'react'
import PageHero from '../../components/hero/PageHero'
import ProjectCard from '../../components/cards/ProjectCard'
import completedProjects from '../../data/completedProjects'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

const CompletedProjects = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16
  
  const totalPages = Math.ceil(completedProjects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = completedProjects.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <PageHero 
        title="Completed Projects" 
        subtitle="Successfully delivered infrastructure projects across India"
        breadcrumb="Projects / Completed"
        bgImage="/images/hero/Completed-Projects.png"
      />
      
      <section style={{ padding: '60px 16px', backgroundColor: '#f9fafb', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Section Title */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '8px' }}>
              Completed <span style={{ color: '#ff8755' }}>Projects</span>
            </h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: '#ff8755', marginBottom: '16px' }}></div>
          </div>

          {/* 4 Columns Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {currentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} type="completed" />
            ))}
          </div>

          {/* Pagination - Bottom Only */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: '8px', marginTop: '48px',
            }}>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                style={{
                  width: '40px', height: '40px', borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: currentPage === 1 ? '#f9fafb' : 'white',
                  color: currentPage === 1 ? '#d1d5db' : '#374151',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <HiChevronLeft style={{ fontSize: '18px' }} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => handlePageChange(page)}
                  style={{
                    width: '40px', height: '40px', borderRadius: '8px',
                    border: page === currentPage ? '2px solid #ff8755' : '1px solid #e5e7eb',
                    backgroundColor: page === currentPage ? '#fff5f0' : 'white',
                    color: page === currentPage ? '#ff8755' : '#374151',
                    fontWeight: page === currentPage ? '700' : '500',
                    fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  {page}
                </button>
              ))}

              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                style={{
                  width: '40px', height: '40px', borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: currentPage === totalPages ? '#f9fafb' : 'white',
                  color: currentPage === totalPages ? '#d1d5db' : '#374151',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <HiChevronRight style={{ fontSize: '18px' }} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default CompletedProjects