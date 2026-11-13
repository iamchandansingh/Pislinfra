import { useState, useEffect } from 'react';
import PageHero from '../../components/hero/PageHero';
import BlogSEO from '../../components/Blog/BlogSEO';
import FeaturedCaseStudy from '../../components/case-studies/FeaturedCaseStudy';
import CaseStudiesGrid from '../../components/case-studies/CaseStudiesGrid';
import ProjectApproach from '../../components/case-studies/ProjectApproach';
import TrustedClients from '../../components/case-studies/TrustedClients';
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../../services/wordpress';
import { getImageUrl } from '../../utils/imageUrl.js';
import { extractNumericId } from '../../utils/formatBlog.js';
import Preloader from '../../components/common/Preloader';
import localCaseStudies from '../../data/caseStudies';

const sortCaseStudiesNewestFirst = (list) => {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const timeA = new Date(a?.createdAt || a?.publishedAt || 0).getTime() || 0;
    const timeB = new Date(b?.createdAt || b?.publishedAt || 0).getTime() || 0;
    if (timeB !== timeA) return timeB - timeA;
    const idA = extractNumericId(a);
    const idB = extractNumericId(b);
    if (idB !== idA) return idB - idA;
    return (a?._idx ?? 0) - (b?._idx ?? 0);
  });
};

const mapWpCaseStudies = (rawList) =>
  sortCaseStudiesNewestFirst(
    rawList.map((item, idx) => {
      const numericOrder = item.order !== undefined && item.order !== null && item.order !== ''
        ? Number(item.order)
        : null;
      const coverSrc = item.image || item.engagementImage || item.challengesImage || item.achievementsImage;

      return {
        id: item.documentId || item.id,
        documentId: item.documentId,
        slug: item.slug,
        title: item.title,
        project: item.project,
        developer: item.developer,
        location: item.location,
        plinthArea: item.plinthArea,
        buildUpArea: item.buildUpArea,
        introduction: item.introduction,
        overview: item.overview,
        engagement: Array.isArray(item.engagement) ? item.engagement : [],
        challenges: Array.isArray(item.challenges) ? item.challenges : [],
        achievements: Array.isArray(item.achievements) ? item.achievements : [],
        conclusion: item.conclusion,
        completionYear: item.completionYear || '',
        duration: item.duration || '',
        featured: Boolean(item.featured),
        order: Number.isFinite(numericOrder) ? numericOrder : null,
        createdAt: item.createdAt || item.publishedAt || null,
        _idx: idx,
        image: getImageUrl(coverSrc, '/images/hero/Case-Study.png'),
        engagementImage: getImageUrl(item.engagementImage, ''),
        challengesImage: getImageUrl(item.challengesImage, ''),
        achievementsImage: getImageUrl(item.achievementsImage, ''),
        seo: item.seo,
      };
    })
  );

const CaseStudy = () => {
  const isPreview = Boolean(getPreviewContext());
  const [pageData, setPageData] = useState(() => (isPreview ? null : getLocalDataSync('case-study-page')));
  const [caseStudiesList, setCaseStudiesList] = useState(() => {
    if (isPreview) return [];
    const localSynced = getLocalDataSync('case-studies');
    if (Array.isArray(localSynced) && localSynced.length > 0) {
      return mapWpCaseStudies(localSynced);
    }
    return sortCaseStudiesNewestFirst(localCaseStudies);
  });
  const [liveClients, setLiveClients] = useState([]);
  const [loading, setLoading] = useState(() => isPreview);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (isPreview) return;
      const cleanEndpoint = e?.detail?.cleanEndpoint || '';
      const fresh = getLocalDataSync('case-study-page');
      if (fresh) setPageData(fresh);
      if (cleanEndpoint.startsWith('case-studies') && Array.isArray(e?.detail?.data)) {
        setCaseStudiesList(mapWpCaseStudies(e.detail.data));
      } else if (cleanEndpoint.startsWith('clients') && Array.isArray(e?.detail?.data)) {
        setLiveClients(e.detail.data);
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);
    return () => window.removeEventListener('pisl-data-update', handleUpdate);
  }, [isPreview]);

  useEffect(() => {
    let isMounted = true;
    const getData = async (forceFresh = isPreview) => {
      try {
        const [pData, csData, clientsRes] = await Promise.all([
          fetchWpData('case-study-page?populate=seo,heroImage,approachSteps,trustedClients.logo', { forceFresh }),
          fetchWpData('case-studies?populate=*&pagination[pageSize]=100&sort=createdAt:desc', { forceFresh }),
          fetchWpData('clients?pagination[pageSize]=100&sort=order:asc&populate=*', { forceFresh }),
        ]);

        if (pData && isMounted) {
          setPageData(pData);
        }

        if (Array.isArray(clientsRes) && isMounted) {
          setLiveClients(clientsRes);
        }

        if (Array.isArray(csData) && isMounted) {
          setCaseStudiesList(mapWpCaseStudies(csData));
        }
      } catch (err) {
        console.error('Error fetching case studies:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getData(isPreview);

    return () => {
      isMounted = false;
    };
  }, [isPreview]);

  if (loading) return <Preloader />;

  const heroTitle = pageData?.heroTitle || 'Case Studies';
  const heroSubtitle = pageData?.heroSubtitle || 'Detailed analysis of our major infrastructure projects';
  const heroBreadcrumb = pageData?.heroBreadcrumb || 'Projects / Case Study';
  const heroImage = pageData?.heroImage ? getImageUrl(pageData.heroImage, '/images/hero/Case-Study.png') : '/images/hero/Case-Study.png';

  const fallbackTitle = 'Project Case Studies & Insights | Pislinfra';
  const fallbackDescription = "Explore Pislinfra's project case studies, highlighting our expertise, execution capabilities, innovative solutions and successful delivery across key sectors.";

  const resolvedTitle = (pageData?.metaTitle || pageData?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (pageData?.metaDescription || pageData?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (pageData?.primaryKeyword || pageData?.seo?.primaryKeyword || 'Construction Project Case Studies').trim();
  const resolvedFocusKeywords = (pageData?.focusKeywords || pageData?.seo?.focusKeywords || '').trim();
  const resolvedOgImage = getImageUrl(pageData?.seo?.ogImage || pageData?.ogImage || pageData?.heroImage, '/images/hero/Case-Study.png');
  const resolvedTwitterImage = getImageUrl(pageData?.seo?.twitterImage || pageData?.twitterImage || pageData?.heroImage, resolvedOgImage);

  const seoData = {
    contentType: 'page',
    slug: 'projects/case-study',
    canonicalUrl: 'https://pislinfra.com/projects/case-study',
    ogType: 'website',
    twitterCardType: 'summary_large_image',
    schemaType: 'CollectionPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Case Studies', 'Industrial Projects', 'Warehousing', 'Infrastructure', 'Pislinfra'],
    ...(pageData?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: pageData?.seo?.seoKeywords || resolvedFocusKeywords || 'Construction Project Case Studies, industrial EPC case studies, warehouse project insights, infrastructure execution India, Pislinfra case studies',
    canonicalUrl: pageData?.seo?.canonicalUrl || 'https://pislinfra.com/projects/case-study',
    ogTitle: pageData?.ogTitle || pageData?.seo?.ogTitle || resolvedTitle,
    ogDescription: pageData?.ogDescription || pageData?.seo?.ogDescription || resolvedDescription,
    ogImage: resolvedOgImage,
    twitterTitle: pageData?.twitterTitle || pageData?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: pageData?.twitterDescription || pageData?.seo?.twitterDescription || resolvedDescription,
    twitterImage: resolvedTwitterImage,
  };

  // Latest published case study takes the top Featured slot; earlier ones appear below in the grid
  const featured = caseStudiesList[0] || null;
  const gridCaseStudies = caseStudiesList.length > 1 ? caseStudiesList.slice(1) : caseStudiesList;

  const showHero = pageData?.showHero !== false;
  const showFeatured = pageData?.showFeatured !== false;
  const showGrid = pageData?.showGrid !== false;
  const showApproach = pageData?.showApproach !== false;
  const showTrustedClients = pageData?.showTrustedClients !== false;
  const trustedClientsPool = liveClients.length > 0
    ? liveClients
    : (Array.isArray(pageData?.trustedClients) ? pageData.trustedClients : null);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <BlogSEO blog={seoData} />

      {showHero && (
        <PageHero
          title={heroTitle}
          subtitle={heroSubtitle}
          breadcrumb={heroBreadcrumb}
          bgImage={heroImage}
        />
      )}
      {showFeatured && featured && (
        <FeaturedCaseStudy featured={featured} badgeText={pageData?.featuredBadge} />
      )}
      {showGrid && (
        <CaseStudiesGrid
          caseStudies={gridCaseStudies}
          title={pageData?.gridTitle}
          itemsPerPage={pageData?.gridItemsPerPage}
          emptyStateText={pageData?.emptyStateText}
        />
      )}
      {showApproach && <ProjectApproach data={pageData} />}
      {showTrustedClients && <TrustedClients clients={trustedClientsPool} isPreview={isPreview} />}
    </div>
  );
};

export default CaseStudy;
