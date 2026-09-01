import { useState, useEffect } from 'react'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import FeaturedCaseStudy from '../../components/case-studies/FeaturedCaseStudy'
import CaseStudiesGrid from '../../components/case-studies/CaseStudiesGrid'
import ProjectApproach from '../../components/case-studies/ProjectApproach'
import TrustedClients from '../../components/case-studies/TrustedClients'
import { fetchStrapiData } from '../../services/strapi'
import Preloader from '../../components/common/Preloader'

const CaseStudy = () => {
  const [pageData, setPageData] = useState(null)
  const [caseStudiesList, setCaseStudiesList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      try {
        const pData = await fetchStrapiData('case-study-page?populate=seo,heroImage,approachSteps,trustedClients.logo');
        if (pData) {
          setPageData(pData);
        }

        const csData = await fetchStrapiData('case-studies?populate=*&pagination[pageSize]=100&sort=createdAt:asc');
        if (csData) {
          const formatted = csData.map(item => ({
            id: item.documentId || item.id,
            slug: item.slug,
            title: item.title,
            project: item.project,
            developer: item.developer,
            location: item.location,
            plinthArea: item.plinthArea,
            buildUpArea: item.buildUpArea,
            introduction: item.introduction,
            overview: item.overview,
            engagement: item.engagement,
            challenges: item.challenges,
            achievements: item.achievements,
            conclusion: item.conclusion,
            image: item.image ? (item.image.url?.startsWith('http') ? item.image.url : `${item.image.url}`) : null,
            engagementImage: item.engagementImage ? (item.engagementImage.url?.startsWith('http') ? item.engagementImage.url : `${item.engagementImage.url}`) : null,
            challengesImage: item.challengesImage ? (item.challengesImage.url?.startsWith('http') ? item.challengesImage.url : `${item.challengesImage.url}`) : null,
            achievementsImage: item.achievementsImage ? (item.achievementsImage.url?.startsWith('http') ? item.achievementsImage.url : `${item.achievementsImage.url}`) : null,
            seo: item.seo,
          }));
          setCaseStudiesList(formatted);
        }
      } catch (err) {
        console.error("Error fetching case studies:", err);
      } finally {
        setLoading(false);
      }
    };
    
    getData();
  }, []);

  if (loading) return <Preloader />;

  const getImageUrl = (img) => {
    if (!img) return null;
    return img.url?.startsWith('http') ? img.url : `${img.url}`;
  };

  const heroTitle = pageData?.heroTitle || "Case Studies";
  const heroSubtitle = pageData?.heroSubtitle || "Detailed analysis of our major infrastructure projects";
  const heroBreadcrumb = pageData?.heroBreadcrumb || "Projects / Case Study";
  const heroImage = pageData?.heroImage ? getImageUrl(pageData.heroImage) : "https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/optimized_1787757600734_Case-Study.webp";

  const seoData = pageData?.seo || {
    contentType: 'page',
    title: 'Case Studies',
    seoTitle: 'Case Studies',
    seoDescription: "Explore detailed case studies of Pislinfra's major industrial infrastructure projects.",
    slug: 'projects/case-study',
  };

  const featured = caseStudiesList.find(c => c.slug === 'pragati-farukhnagar-logistics-park-phase-i-flipkart' || c.slug === 'pragati-farukhnagar-logistics') || caseStudiesList[0];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <BlogSEO blog={seoData} />
      
      <PageHero 
        title={heroTitle} 
        subtitle={heroSubtitle}
        breadcrumb={heroBreadcrumb}
        bgImage={heroImage}
      />
      {featured ? <FeaturedCaseStudy featured={featured} /> : <FeaturedCaseStudy />}
      {caseStudiesList.length > 0 ? <CaseStudiesGrid caseStudies={caseStudiesList} /> : <CaseStudiesGrid />}
      <ProjectApproach data={pageData} />
      <TrustedClients clients={pageData?.trustedClients} />
    </div>
  )
}

export default CaseStudy;
