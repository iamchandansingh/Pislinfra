import React, { useState, useRef, useEffect } from 'react'
import PageHero from '../../components/hero/PageHero'
import AwardsStats from '../../components/awards/AwardsStats'
import AwardsYearSidebar from '../../components/awards/AwardsYearSidebar'
import AwardsAccordion from '../../components/awards/AwardsAccordion'
import { sampleAwards } from '../../components/awards/AwardsCard'

const Awards = () => {
  const [openYear, setOpenYear] = useState('2025')
  const yearRefs = useRef({})

  const handleYearClick = (year) => {
    setOpenYear(year)
  }

  useEffect(() => {
    if (openYear) {
      setTimeout(() => {
        const el = yearRefs.current[openYear]
        if (el) {
          const rect = el.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const targetY = rect.top + scrollTop - 100
          window.scrollTo({ top: targetY, behavior: 'smooth' })
        }
      }, 350)
    }
  }, [openYear])

  const setYearRef = (year) => (el) => {
    yearRefs.current[year] = el
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      
      <PageHero 
        title="Awards & Accolades" 
        subtitle="A legacy of excellence, recognized by industry leaders"
        breadcrumb="About Us / Awards"
        bgImage="/images/hero/Awards-Certification.png"
      />

      <AwardsStats />

      <section style={{ padding: '60px 0', backgroundColor: '#FFFFFF' }}>
        <div style={{ width: '98%', maxWidth: '1370px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          
          <AwardsYearSidebar onYearClick={handleYearClick} activeYear={openYear} />

          <div style={{ flex: 1, minWidth: 0 }}>
            
            <div ref={setYearRef('2025')}>
              <AwardsAccordion year="2025" totalAwards={4} totalCertificates={2} 
                description="A year of remarkable achievements." awards={sampleAwards} 
                color="#22C55E" isOpen={openYear === '2025'}
                onToggle={() => setOpenYear(openYear === '2025' ? '' : '2025')} />
            </div>

            <div ref={setYearRef('2024')}>
              <AwardsAccordion year="2024" totalAwards={3} totalCertificates={2} 
                description="Celebrating our progress." awards={sampleAwards} 
                color="#3B82F6" isOpen={openYear === '2024'}
                onToggle={() => setOpenYear(openYear === '2024' ? '' : '2024')} />
            </div>

            <div ref={setYearRef('2023')}>
              <AwardsAccordion year="2023" totalAwards={3} totalCertificates={1} 
                description="Recognitions that reinforce our leadership." awards={sampleAwards} 
                color="#8B5CF6" isOpen={openYear === '2023'}
                onToggle={() => setOpenYear(openYear === '2023' ? '' : '2023')} />
            </div>

            <div ref={setYearRef('2022')}>
              <AwardsAccordion year="2022" totalAwards={2} totalCertificates={1} 
                description="Milestones that mark our growth." awards={sampleAwards} 
                color="#F97316" isOpen={openYear === '2022'}
                onToggle={() => setOpenYear(openYear === '2022' ? '' : '2022')} />
            </div>

          </div>

        </div>
      </section>

    </div>
  )
}

export default Awards