import React, { useState, useEffect, useCallback } from 'react';
import BlogSEO from '../components/Blog/BlogSEO';
import HeroVideo from '../components/hero/HeroVideo';
import AboutUs from '../components/about/AboutUs';
import StatsSection from '../components/about/StatsSection';
import Services from '../components/solutions/Services';
import CoverageMap from '../components/coverage/CoverageMap';
import Industries from '../components/industries/Industries';
import Clients from '../components/clients/Clients';
import Awards from '../components/Home/Awards';
import HSESection from '../components/Home/HSESection';
import Preloader from '../components/common/Preloader';
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../services/wordpress';
import { getImageUrl } from '../utils/imageUrl';
import projectsData from '../data/projectsData';
import completedProjectsData from '../data/completedProjects';
import coverageMarkersData from '../data/coverageMarkersData';
import awardsAndCertifications from '../data/Awards-&-Certifications';
import clientsData from '../data/clientsData';
import { sortAwardsByFeaturedAndDate } from '../utils/awardSort';

const extractProjectImages = (p, fallbackList = []) => {
  if (!p) return fallbackList;
  let imgs = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    imgs = p.images;
  } else if (p.images?.data && Array.isArray(p.images.data) && p.images.data.length > 0) {
    imgs = p.images.data;
  } else if (p.attributes?.images?.data && Array.isArray(p.attributes.images.data) && p.attributes.images.data.length > 0) {
    imgs = p.attributes.images.data;
  } else if (Array.isArray(p.attributes?.images) && p.attributes.images.length > 0) {
    imgs = p.attributes.images;
  } else if (p.image) {
    imgs = Array.isArray(p.image) ? p.image : [p.image];
  } else if (p.attributes?.image) {
    imgs = Array.isArray(p.attributes.image) ? p.attributes.image : [p.attributes.image];
  }

  const validUrls = imgs.map(img => getImageUrl(img)).filter(Boolean);
  if (validUrls.length > 0) return validUrls;
  return fallbackList;
};

const defaultOngoing = projectsData.map(p => ({
  ...p,
  city: p.city || p.location || 'Gujarat',
  location: p.location || p.city || 'Gujarat',
  image: p.image || (p.images && p.images[0]) || '',
  images: p.images || (p.image ? [p.image] : [])
}));

const defaultCompleted = completedProjectsData.map(p => ({
  ...p,
  city: p.city || p.location || 'Haryana',
  location: p.location || p.city || 'Haryana',
  image: p.image || (p.images && p.images[0]) || '',
  images: p.images || (p.image ? [p.image] : [])
}));

const getInitialCached = (key, fallback) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) return parsed;
      }
    } catch (e) {}
  }
  return fallback;
};

const Home = () => {
  const isPreview = Boolean(getPreviewContext());
  const [data, setData] = useState(() => (isPreview ? null : (getInitialCached('pisl_home_page', null) || getLocalDataSync('home-page'))));
  const [ongoing, setOngoing] = useState(() => (isPreview ? [] : getInitialCached('pisl_ongoing_projects', defaultOngoing)));
  const [completed, setCompleted] = useState(() => (isPreview ? [] : getInitialCached('pisl_completed_projects', defaultCompleted)));
  const [loading, setLoading] = useState(isPreview);
  const [clients, setClients] = useState(() => (isPreview ? [] : getInitialCached('pisl_clients', clientsData)));
  const [awards, setAwards] = useState(() => (isPreview ? [] : sortAwardsByFeaturedAndDate(getInitialCached('pisl_awards', awardsAndCertifications))));
  const [markers, setMarkers] = useState(() => (isPreview ? [] : getInitialCached('pisl_coverage_markers', coverageMarkersData)));

  const shouldWaitForHero = !data ? true : data?.showHero !== false;
  const [heroReady, setHeroReady] = useState(() => !shouldWaitForHero);
  const [preloaderFading, setPreloaderFading] = useState(false);
  const [preloaderDismissed, setPreloaderDismissed] = useState(() => !shouldWaitForHero);

  const handleHeroReady = useCallback(() => {
    setHeroReady(true);
  }, []);

  useEffect(() => {
    if (data && data?.showHero === false) {
      setHeroReady(true);
    }
  }, [data]);

  // Safety timeout: never block the page indefinitely if video stalls or codec fails
  useEffect(() => {
    if (heroReady) return;
    const safetyTimer = setTimeout(() => {
      setHeroReady(true);
    }, 6000);
    return () => clearTimeout(safetyTimer);
  }, [heroReady]);

  const isDataReady = !loading || Boolean(data);
  useEffect(() => {
    if (!isDataReady || !heroReady || preloaderDismissed) return;
    setPreloaderFading(true);
    const hideTimer = setTimeout(() => {
      setPreloaderDismissed(true);
    }, 320);
    return () => clearTimeout(hideTimer);
  }, [isDataReady, heroReady, preloaderDismissed]);
  
  useEffect(() => {
    const loadData = async (force = false) => {
      try {
        const shouldForce = force || isPreview;
        const [homeRes, ongoingRes, completedRes, clientsRes, awardsRes, markersRes] = await Promise.all([
          fetchWpData('home-page?populate=*', { forceFresh: shouldForce }),
          fetchWpData('ongoing-projects?populate=*&pagination[pageSize]=100', { forceFresh: shouldForce }),
          fetchWpData('completed-projects?populate=*&pagination[pageSize]=100', { forceFresh: shouldForce }),
          fetchWpData('clients?pagination[pageSize]=100&sort=order:asc&populate=*', { forceFresh: shouldForce }),
          fetchWpData('awards?populate=*&sort=createdAt:desc', { forceFresh: shouldForce }),
          fetchWpData('coverage-markers?populate=*&pagination[pageSize]=100', { forceFresh: shouldForce })
        ]);
        
        if (homeRes) {
          setData(homeRes);
          if (!isPreview) {
            try { window.localStorage.setItem('pisl_home_page', JSON.stringify(homeRes)); } catch (e) {}
          }
        }
        const parsedMarkers = Array.isArray(markersRes)
          ? markersRes
          : (markersRes?.data && Array.isArray(markersRes.data) ? markersRes.data : null);
        if (Array.isArray(parsedMarkers)) {
          setMarkers(parsedMarkers);
          if (!isPreview) {
            try { window.localStorage.setItem('pisl_coverage_markers', JSON.stringify(parsedMarkers)); } catch (e) {}
          }
        }
        
        const slugify = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

        const matchMarker = (p, markersList) => {
          if (!p || !markersList || !Array.isArray(markersList)) return null;
          const pName = (p.name || p.title || p.projectName || '').trim();
          const pSlug = slugify(pName);
          const pCity = slugify(p.location || p.city || '');
          const pState = slugify(p.state || '');

          // 1. Exact Name + City match (e.g. PMG Logistics Park + Neemrana vs PMG Logistics Park + Hyderabad)
          let match = markersList.find(m => {
            const mName = slugify(m.projectName || m.name || m.title || m.attributes?.projectName || '');
            const mCity = slugify(m.city || m.location || m.attributes?.city || '');
            if (mName === pSlug || (mName && pSlug && (mName.includes(pSlug) || pSlug.includes(mName)))) {
              if (mCity && pCity && (mCity === pCity || mCity.includes(pCity) || pCity.includes(mCity))) {
                return true;
              }
            }
            return false;
          });

          if (match) return match;

          // 2. Exact Name + State match
          match = markersList.find(m => {
            const mName = slugify(m.projectName || m.name || m.title || m.attributes?.projectName || '');
            const mState = slugify(m.state || m.attributes?.state || '');
            if (mName === pSlug || (mName && pSlug && (mName.includes(pSlug) || pSlug.includes(mName)))) {
              if (mState && pState && (mState === pState || mState.includes(pState) || pState.includes(mState))) {
                return true;
              }
            }
            return false;
          });

          if (match) return match;

          // 3. Name match only
          return markersList.find(m => {
            const mName = slugify(m.projectName || m.name || m.title || m.attributes?.projectName || '');
            return mName === pSlug;
          });
        };

        if (Array.isArray(ongoingRes)) {
          const mappedOngoing = ongoingRes.map(p => {
            const pName = p.name || p.title || '';
            const matchLocal = projectsData.find(lp => {
              const sL = slugify(lp.name);
              const sP = slugify(pName);
              const locL = slugify(lp.location || lp.city || '');
              const locP = slugify(p.location || p.city || '');
              if (sL === sP) {
                if (locL && locP) return locL === locP;
                return true;
              }
              return false;
            }) || {};

            const markerMatch = matchMarker(p, parsedMarkers);
            const markerImgs = (markerMatch?.images && Array.isArray(markerMatch.images) && markerMatch.images.length > 0) ? markerMatch.images : [];
            const localImgs = markerImgs.length > 0
              ? markerImgs
              : (matchLocal.images && matchLocal.images.length > 0 ? matchLocal.images : (matchLocal.image ? [matchLocal.image] : ['/images/hero/Ongoing-Projects.png']));
            const finalImages = extractProjectImages(p, localImgs);

            const mCx = markerMatch ? (markerMatch.cx ?? markerMatch.attributes?.cx) : null;
            const mCy = markerMatch ? (markerMatch.cy ?? markerMatch.attributes?.cy) : null;
            const hasValidMarker = (mCx != null && mCx !== '' && !isNaN(Number(mCx)) && Number(mCx) > 0 && mCy != null && mCy !== '' && !isNaN(Number(mCy)) && Number(mCy) > 0);
            const finalCx = hasValidMarker ? Number(mCx) : (p.cx != null && Number(p.cx) > 0 ? Number(p.cx) : (matchLocal.cx || null));
            const finalCy = hasValidMarker ? Number(mCy) : (p.cy != null && Number(p.cy) > 0 ? Number(p.cy) : (matchLocal.cy || null));

            const pSlug = p.slug || getProjectSlug({ ...p, name: pName, location: p.location || p.city, state: p.state });

            return {
              id: p.documentId || p.id,
              slug: pSlug,
              name: pName,
              state: p.state || '',
              city: p.location || p.city || '',
              location: p.location || p.city || '',
              status: 'Ongoing',
              category: p.category || 'Industrial',
              area: p.area || 'N/A',
              client: p.client || 'Pislinfra Client',
              scope: p.scope || 'Civil Work & Infrastructure',
              timeline: p.timeline || 'Ongoing',
              cx: finalCx,
              cy: finalCy,
              hasMarker: hasValidMarker,
              showOnMap: hasValidMarker,
              progress: p.progress != null ? p.progress : 75,
              images: finalImages,
              image: finalImages[0]
            };
          });
          setOngoing(mappedOngoing);
          if (!isPreview) {
            try { window.localStorage.setItem('pisl_ongoing_projects', JSON.stringify(mappedOngoing)); } catch (e) {}
          }
        }
        
        if (Array.isArray(completedRes)) {
          const mappedCompleted = completedRes.map(p => {
            const pName = p.name || p.title || '';
            const matchLocal = completedProjectsData.find(lp => {
              const sL = slugify(lp.name);
              const sP = slugify(pName);
              const locL = slugify(lp.location || lp.city || '');
              const locP = slugify(p.location || p.city || '');
              if (sL === sP) {
                if (locL && locP) return locL === locP;
                return true;
              }
              return false;
            }) || {};

            const markerMatch = matchMarker(p, parsedMarkers);
            const markerImgs = (markerMatch?.images && Array.isArray(markerMatch.images) && markerMatch.images.length > 0) ? markerMatch.images : [];
            const localImgs = markerImgs.length > 0
              ? markerImgs
              : (matchLocal.images && matchLocal.images.length > 0 ? matchLocal.images : (matchLocal.image ? [matchLocal.image] : ['/images/hero/Completed-Projects.png']));
            const finalImages = extractProjectImages(p, localImgs);

            const mCx = markerMatch ? (markerMatch.cx ?? markerMatch.attributes?.cx) : null;
            const mCy = markerMatch ? (markerMatch.cy ?? markerMatch.attributes?.cy) : null;
            const hasValidMarker = (mCx != null && mCx !== '' && !isNaN(Number(mCx)) && Number(mCx) > 0 && mCy != null && mCy !== '' && !isNaN(Number(mCy)) && Number(mCy) > 0);
            const finalCx = hasValidMarker ? Number(mCx) : (p.cx != null && Number(p.cx) > 0 ? Number(p.cx) : (matchLocal.cx || null));
            const finalCy = hasValidMarker ? Number(mCy) : (p.cy != null && Number(p.cy) > 0 ? Number(p.cy) : (matchLocal.cy || null));

            const pSlug = p.slug || getProjectSlug({ ...p, name: pName, location: p.location || p.city, state: p.state });

            return {
              id: p.documentId || p.id,
              slug: pSlug,
              name: pName,
              state: p.state || '',
              city: p.location || p.city || '',
              location: p.location || p.city || '',
              status: 'Completed',
              category: p.category || 'Warehousing',
              area: p.area || 'N/A',
              client: p.client || 'Pislinfra Client',
              scope: p.scope || 'Turnkey Construction',
              timeline: p.timeline || 'Completed',
              cx: finalCx,
              cy: finalCy,
              hasMarker: hasValidMarker,
              showOnMap: hasValidMarker,
              progress: 100,
              images: finalImages,
              image: finalImages[0]
            };
          });

          setCompleted(mappedCompleted);
          if (!isPreview) {
            try { window.localStorage.setItem('pisl_completed_projects', JSON.stringify(mappedCompleted)); } catch (e) {}
          }
        }
        
        if (clientsRes && Array.isArray(clientsRes)) {
          setClients(clientsRes);
          if (!isPreview) {
            try { window.localStorage.setItem('pisl_clients', JSON.stringify(clientsRes)); } catch (e) {}
          }
        }
        if (awardsRes && Array.isArray(awardsRes)) {
          const sortedAwards = sortAwardsByFeaturedAndDate(awardsRes);
          setAwards(sortedAwards);
          if (!isPreview) {
            try { window.localStorage.setItem('pisl_awards', JSON.stringify(sortedAwards)); } catch (e) {}
          }
        }

        // On localhost: Auto-save fresh coverage-markers directly to local disk only when freshly fetched
        if (!isPreview && force && import.meta.env.DEV && typeof window !== 'undefined' && Array.isArray(parsedMarkers) && parsedMarkers.length > 0 && window.location.hostname === 'localhost') {
          try {
            fetch('/__api/save-main-backup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ endpoint: 'coverage-markers', data: parsedMarkers })
            }).catch(() => {});
          } catch (e) {}
        }
        
      } catch (err) {
        console.error("Failed to load home page data from WP", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    const handleDataUpdate = (e) => {
      if (isPreview) return;
      const { cleanEndpoint, data: updatedData } = e.detail || {};
      if (!updatedData) return;
      if (cleanEndpoint && (cleanEndpoint.startsWith('ongoing-projects') || cleanEndpoint.startsWith('completed-projects') || cleanEndpoint.startsWith('coverage-markers'))) {
        loadData(false);
      } else if (cleanEndpoint && cleanEndpoint.startsWith('home-page')) {
        setData(updatedData);
      }
    };

    window.addEventListener('pisl-data-update', handleDataUpdate);

    return () => {
      window.removeEventListener('pisl-data-update', handleDataUpdate);
    };
  }, [isPreview]);

  if (loading && !data) {
    return <Preloader timeout={7000} />;
  }

  const fallbackTitle = 'Pislinfra | Industrial Infrastructure & EPC Company India';
  const fallbackDescription = 'Pislinfra delivers warehousing, logistics parks, and industrial construction solutions, with 17+ years of experience and 16M+ sq. ft. delivered.';

  // Connect CMS homepage SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to default metadata if WP is offline or fields are empty
  const resolvedTitle = (data?.metaTitle || data?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = (data?.metaDescription || data?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (data?.primaryKeyword || data?.seo?.primaryKeyword || '').trim();
  const resolvedFocusKeywords = (data?.focusKeywords || data?.seo?.focusKeywords || '').trim();
  const resolvedOgImage = getImageUrl(data?.seo?.ogImage || data?.ogImage, 'https://pislinfra.com/logo.png');
  const resolvedTwitterImage = getImageUrl(data?.seo?.twitterImage || data?.twitterImage, resolvedOgImage);

  const homeSeoData = {
    contentType: 'page',
    slug: '',
    canonicalUrl: 'https://pislinfra.com/',
    ogType: 'website',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebSite',
    breadcrumbSchema: false,
    organizationSchema: true,
    tags: ['Industrial Construction', 'Warehousing', 'Logistics Parks', 'Turnkey EPC', 'PEB Buildings', 'India'],
    ...(data?.seo || {}),
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: data?.seo?.seoKeywords || resolvedFocusKeywords || 'Pislinfra, industrial infrastructure, construction company, warehousing, logistics park, industrial development, warehouse construction India, turnkey EPC company India, PEB warehouse construction, Grade-A warehouse builder, industrial park developers NCR, civil engineering contractors India, factory shed construction, pre-engineered buildings India, commercial construction company, BTS warehouse developers, logistics park infrastructure, heavy industrial construction, Pragati Infra Solutions, warehouse contractors Delhi NCR Haryana Gujarat',
    canonicalUrl: data?.seo?.canonicalUrl || 'https://pislinfra.com/',
    ogTitle: data?.ogTitle || data?.seo?.ogTitle || resolvedTitle,
    ogDescription: data?.ogDescription || data?.seo?.ogDescription || resolvedDescription,
    ogImage: resolvedOgImage,
    twitterTitle: data?.twitterTitle || data?.seo?.twitterTitle || resolvedTitle,
    twitterDescription: data?.twitterDescription || data?.seo?.twitterDescription || resolvedDescription,
    twitterImage: resolvedTwitterImage,
  };

  return (
    <>
      <BlogSEO blog={homeSeoData} />

      {!preloaderDismissed && <Preloader timeout={7000} fadeOut={preloaderFading} />}

      <div>
        {data?.showHero !== false && (
          <HeroVideo 
            bannerImage={getImageUrl(data?.heroImage, '/images/hero/11.png')}
            heroImage={getImageUrl(data?.heroImage, '/images/hero/11.png')}
            videoSrc={getImageUrl(data?.heroVideo, '/videos/PISL-WEBSITE.mp4')}
            onReady={handleHeroReady}
          />
        )}
        {data?.showAbout !== false && <AboutUs data={data} />}
        {data?.showStats !== false && <StatsSection data={data} />}
        {data?.showServices !== false && <Services data={data} />}
        {data?.showCoverage !== false && (
          <CoverageMap data={data} mapMarkers={markers} ongoingProjects={ongoing} completedProjects={completed} asHomeSection={true} />
        )}
        {data?.showIndustries !== false && <Industries data={data} />}
        {data?.showAwards !== false && <Awards awardsData={awards} clientsList={clients} data={data} isPreview={isPreview} />}
        {data?.showClients !== false && <Clients clientsData={clients} data={data} isPreview={isPreview} />}
        {data?.showHse !== false && <HSESection data={data} />}
      </div>
    </>
  );
};

export default Home;
