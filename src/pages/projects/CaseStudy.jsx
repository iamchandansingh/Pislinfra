import PageHero from '../../components/hero/PageHero'
import FeaturedCaseStudy from '../../components/case-studies/FeaturedCaseStudy'
import CaseStudiesGrid from '../../components/case-studies/CaseStudiesGrid'
import ProjectApproach from '../../components/case-studies/ProjectApproach'
import TrustedClients from '../../components/case-studies/TrustedClients'

const CaseStudy = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageHero 
        title="Case Studies" 
        subtitle="Detailed analysis of our major infrastructure projects"
        breadcrumb="Projects / Case Study"
        bgImage="/images/hero/Case-Study.png"
      />
      <FeaturedCaseStudy />
      <CaseStudiesGrid />
      <ProjectApproach />
      <TrustedClients />
    </div>
  )
}

export default CaseStudy