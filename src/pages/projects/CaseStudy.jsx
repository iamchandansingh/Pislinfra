import { useState, useEffect } from 'react'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import FeaturedCaseStudy from '../../components/case-studies/FeaturedCaseStudy'
import CaseStudiesGrid from '../../components/case-studies/CaseStudiesGrid'
import ProjectApproach from '../../components/case-studies/ProjectApproach'
import TrustedClients from '../../components/case-studies/TrustedClients'
import { fetchStrapiData, getLocalDataSync } from '../../services/strapi'
import { getImageUrl } from '../../utils/imageUrl.js'
import Preloader from '../../components/common/Preloader'
import localCaseStudies from '../../data/caseStudies'

const CaseStudy = () => {
  const [pageData, setPageData] = useState(() => getLocalDataSync('case-study-page'))
  const [caseStudiesList, setCaseStudiesList] = useState(localCaseStudies)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getLocalDataSync('case-study-page');
      if (fresh) setPageData(fresh);
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const getData = async (forceFresh = false) => {
      try {
        const pData = await fetchStrapiData('case-study-page?populate=seo,heroImage,approachSteps,trustedClients.logo', { forceFresh });
        if (pData && isMounted) {
          setPageData(pData);
        }

        const csData = await fetchStrapiData('case-studies?populate=*&pagination[pageSize]=100&sort=createdAt:asc', { forceFresh });
        if (csData && isMounted) {
          const formatted = csData.map(item => {
            const matchLocal = localCaseStudies.find(lc => lc.slug === item.slug) || {};
            return {
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
              image: item.image ? (item.image.url?.startsWith('http') ? item.image.url : `${item.image.url}`) : matchLocal.image || null,
              engagementImage: item.engagementImage ? (item.engagementImage.url?.startsWith('http') ? item.engagementImage.url : `${item.engagementImage.url}`) : matchLocal.engagementImage || null,
              challengesImage: item.challengesImage ? (item.challengesImage.url?.startsWith('http') ? item.challengesImage.url : `${item.challengesImage.url}`) : matchLocal.challengesImage || null,
              achievementsImage: item.achievementsImage ? (item.achievementsImage.url?.startsWith('http') ? item.achievementsImage.url : `${item.achievementsImage.url}`) : matchLocal.achievementsImage || null,
              seo: item.seo,
            };
          });
          setCaseStudiesList(formatted);
        }
      } catch (err) {
        console.error("Error fetching case studies:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    getData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading && caseStudiesList.length === 0) return <Preloader />;

  const heroTitle = pageData?.heroTitle || "Case Studies";
  const heroSubtitle = pageData?.heroSubtitle || "Detailed analysis of our major infrastructure projects";
  const heroBreadcrumb = pageData?.heroBreadcrumb || "Projects / Case Study";
  const heroImage = pageData?.heroImage ? getImageUrl(pageData.heroImage) : "/images/hero/Case-Study.png";

  const fallbackTitle = 'Project Case Studies & Insights | Pislinfra';
  const fallbackDescription = "Explore Pislinfra's project case studies, highlighting our expertise, execution capabilities, innovative solutions and successful delivery across key sectors.";

  // Connect CMS Case Studies page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = (pageData?.metaTitle || pageData?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (pageData?.metaDescription || pageData?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (pageData?.primaryKeyword || pageData?.seo?.primaryKeyword || 'Construction Project Case Studies').trim();
  const resolvedFocusKeywords = (pageData?.focusKeywords || pageData?.seo?.focusKeywords || '').trim();

  const seoData = {
    contentType: 'page',
    ...(pageData?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: pageData?.seo?.seoKeywords || resolvedFocusKeywords || 'Construction Project Case Studies, industrial EPC case studies, warehouse project insights, infrastructure execution India, Pislinfra case studies',
    slug: 'projects/case-study',
    canonicalUrl: 'https://pislinfra.com/projects/case-study',
    ogTitle: pageData?.ogTitle || pageData?.seo?.ogTitle || resolvedTitle,
    ogDescription: pageData?.ogDescription || pageData?.seo?.ogDescription || resolvedDescription,
    ogImage: pageData?.seo?.ogImage || (pageData?.heroImage ? getImageUrl(pageData.heroImage) : 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/optimized_1787757600734_Case-Study.webp'),
    ogType: 'website',
    twitterTitle: pageData?.twitterTitle || pageData?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: pageData?.twitterDescription || pageData?.seo?.twitterDescription || resolvedDescription,
    twitterImage: pageData?.seo?.twitterImage || (pageData?.heroImage ? getImageUrl(pageData.heroImage) : 'https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/optimized_1787757600734_Case-Study.webp'),
    twitterCardType: 'summary_large_image',
    schemaType: 'CollectionPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Case Studies', 'Industrial Projects', 'Warehousing', 'Infrastructure', 'Pislinfra'],
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
