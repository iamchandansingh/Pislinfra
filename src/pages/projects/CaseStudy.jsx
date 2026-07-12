import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import FeaturedCaseStudy from '../../components/case-studies/FeaturedCaseStudy'
import CaseStudiesGrid from '../../components/case-studies/CaseStudiesGrid'
import ProjectApproach from '../../components/case-studies/ProjectApproach'
import TrustedClients from '../../components/case-studies/TrustedClients'

const CaseStudy = () => {
  const seoData = {
    contentType: 'page',
    title: 'Case Studies',
    seoTitle: 'Case Studies',
    seoDescription: 'Explore detailed case studies of Pislinfra\'s major industrial infrastructure projects. In-depth analysis of warehouse, logistics park & construction projects.',
    seoKeywords: 'case studies, industrial projects, warehouse case study, logistics park project, construction analysis, infrastructure projects, Pislinfra',
    slug: 'projects/case-study',
    canonicalUrl: 'https://pislinfra.com/projects/case-study',
    ogTitle: 'Case Studies - Industrial Projects Analysis | Pislinfra',
    ogDescription: 'Detailed analysis of our major infrastructure projects across India.',
    ogImage: 'https://pislinfra.com/images/hero/Case-Study.png',
    ogType: 'website',
    twitterTitle: 'Case Studies | Pislinfra',
    twitterDescription: 'In-depth project case studies from our industrial portfolio.',
    twitterImage: 'https://pislinfra.com/images/hero/Case-Study.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Case Studies', 'Projects', 'Industrial', 'Construction', 'Analysis'],
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <BlogSEO blog={seoData} />
      
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