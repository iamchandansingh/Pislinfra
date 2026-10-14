import React, { useState, useEffect } from 'react';
import SEO from '../components/common/SEO';
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
import { fetchStrapiData, STRAPI_URL, getLocalDataSync } from '../services/strapi';
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
  const [data, setData] = useState(() => getInitialCached('pisl_home_page', null) || getLocalDataSync('home-page'));
  const [ongoing, setOngoing] = useState(() => getInitialCached('pisl_ongoing_projects', defaultOngoing));
  const [completed, setCompleted] = useState(() => getInitialCached('pisl_completed_projects', defaultCompleted));
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState(() => getInitialCached('pisl_clients', clientsData));
  const [awards, setAwards] = useState(() => sortAwardsByFeaturedAndDate(getInitialCached('pisl_awards', awardsAndCertifications)));
  const [markers, setMarkers] = useState(() => getInitialCached('pisl_coverage_markers', coverageMarkersData));
  
  useEffect(() => {
    const loadData = async (force = false) => {
      try {
        const [homeRes, ongoingRes, completedRes, clientsRes, awardsRes, markersRes] = await Promise.all([
          fetchStrapiData('home-page?populate=*', { forceFresh: force }),
          fetchStrapiData('ongoing-projects?populate=*&pagination[pageSize]=100', { forceFresh: force }),
          fetchStrapiData('completed-projects?populate=*&pagination[pageSize]=100', { forceFresh: force }),
          fetchStrapiData('clients?pagination[pageSize]=100&sort=order:asc', { forceFresh: force }),
          fetchStrapiData('awards?populate=*&sort=createdAt:desc', { forceFresh: force }),
          fetchStrapiData('coverage-markers?populate=*&pagination[pageSize]=100', { forceFresh: force })
        ]);
        
        if (homeRes) {
          setData(homeRes);
          try { window.localStorage.setItem('pisl_home_page', JSON.stringify(homeRes)); } catch (e) {}
        }
        const parsedMarkers = Array.isArray(markersRes)
          ? markersRes
          : (markersRes?.data && Array.isArray(markersRes.data) ? markersRes.data : []);
        if (parsedMarkers.length > 0) {
          setMarkers(parsedMarkers);
          try { window.localStorage.setItem('pisl_coverage_markers', JSON.stringify(parsedMarkers)); } catch (e) {}
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

        if (ongoingRes && Array.isArray(ongoingRes) && ongoingRes.length > 0) {
          const filteredOngoing = ongoingRes.filter(p => {
            const n = (p.name || p.title || '').toLowerCase();
            return !n.includes('humsafar') && !n.includes('logistics park llp');
          });
          const mappedOngoing = filteredOngoing.map(p => {
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

            const localImgs = matchLocal.images && matchLocal.images.length > 0 ? matchLocal.images : (matchLocal.image ? [matchLocal.image] : ['/images/hero/Ongoing-Projects.png']);
            const finalImages = extractProjectImages(p, localImgs);

            const markerMatch = matchMarker(p, parsedMarkers);
            const mCx = markerMatch ? (markerMatch.cx ?? markerMatch.attributes?.cx) : null;
            const mCy = markerMatch ? (markerMatch.cy ?? markerMatch.attributes?.cy) : null;
            const hasValidMarker = (mCx != null && mCx !== '' && !isNaN(Number(mCx)) && Number(mCx) > 0 && mCy != null && mCy !== '' && !isNaN(Number(mCy)) && Number(mCy) > 0);
            const finalCx = hasValidMarker ? Number(mCx) : (p.cx != null && Number(p.cx) > 0 ? Number(p.cx) : (matchLocal.cx || null));
            const finalCy = hasValidMarker ? Number(mCy) : (p.cy != null && Number(p.cy) > 0 ? Number(p.cy) : (matchLocal.cy || null));

            return {
              id: p.documentId || p.id,
              name: pName || matchLocal.name,
              state: p.state || matchLocal.state || 'Gujarat',
              city: p.location || p.city || matchLocal.location || matchLocal.city || 'Gujarat',
              location: p.location || p.city || matchLocal.location || matchLocal.city || 'Gujarat',
              status: 'Ongoing',
              category: p.category || matchLocal.category || 'Industrial',
              area: p.area || matchLocal.area || 'N/A',
              client: p.client || matchLocal.client || 'Pislinfra Client',
              scope: p.scope || matchLocal.scope || 'Civil Work & Infrastructure',
              timeline: p.timeline || matchLocal.timeline || 'Ongoing',
              cx: finalCx,
              cy: finalCy,
              hasMarker: hasValidMarker,
              showOnMap: hasValidMarker,
              progress: p.progress != null ? p.progress : (matchLocal.progress || 75),
              images: finalImages,
              image: finalImages[0]
            };
          });
          setOngoing(mappedOngoing);
          try { window.localStorage.setItem('pisl_ongoing_projects', JSON.stringify(mappedOngoing)); } catch (e) {}
        }
        
        if (completedRes && Array.isArray(completedRes) && completedRes.length > 0) {
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

            const localImgs = matchLocal.images && matchLocal.images.length > 0 ? matchLocal.images : (matchLocal.image ? [matchLocal.image] : ['/images/hero/Completed-Projects.png']);
            const finalImages = extractProjectImages(p, localImgs);

            const markerMatch = matchMarker(p, parsedMarkers);
            const mCx = markerMatch ? (markerMatch.cx ?? markerMatch.attributes?.cx) : null;
            const mCy = markerMatch ? (markerMatch.cy ?? markerMatch.attributes?.cy) : null;
            const hasValidMarker = (mCx != null && mCx !== '' && !isNaN(Number(mCx)) && Number(mCx) > 0 && mCy != null && mCy !== '' && !isNaN(Number(mCy)) && Number(mCy) > 0);
            const finalCx = hasValidMarker ? Number(mCx) : (p.cx != null && Number(p.cx) > 0 ? Number(p.cx) : (matchLocal.cx || null));
            const finalCy = hasValidMarker ? Number(mCy) : (p.cy != null && Number(p.cy) > 0 ? Number(p.cy) : (matchLocal.cy || null));

            return {
              id: p.documentId || p.id,
              name: pName || matchLocal.name,
              state: p.state || matchLocal.state || 'Haryana',
              city: p.location || p.city || matchLocal.location || matchLocal.city || 'Haryana',
              location: p.location || p.city || matchLocal.location || matchLocal.city || 'Haryana',
              status: 'Completed',
              category: p.category || matchLocal.category || 'Warehousing',
              area: p.area || matchLocal.area || 'N/A',
              client: p.client || matchLocal.client || 'Pislinfra Client',
              scope: p.scope || matchLocal.scope || 'Turnkey Construction',
              timeline: p.timeline || matchLocal.timeline || 'Completed',
              cx: finalCx,
              cy: finalCy,
              hasMarker: hasValidMarker,
              showOnMap: hasValidMarker,
              progress: 100,
              images: finalImages,
              image: finalImages[0]
            };
          });

          const existingSlugs = new Set(mappedCompleted.map(p => slugify(p.name)));
          const missingCompleted = defaultCompleted.filter(p => !existingSlugs.has(slugify(p.name)));
          const allCompleted = [...mappedCompleted, ...missingCompleted];
          setCompleted(allCompleted);
          try { window.localStorage.setItem('pisl_completed_projects', JSON.stringify(allCompleted)); } catch (e) {}
        }
        
        if (clientsRes && Array.isArray(clientsRes)) {
          setClients(clientsRes);
          try { window.localStorage.setItem('pisl_clients', JSON.stringify(clientsRes)); } catch (e) {}
        }
        if (awardsRes && Array.isArray(awardsRes)) {
          const sortedAwards = sortAwardsByFeaturedAndDate(awardsRes);
          setAwards(sortedAwards);
          try { window.localStorage.setItem('pisl_awards', JSON.stringify(sortedAwards)); } catch (e) {}
        }

        // On localhost: Auto-save fresh coverage-markers directly to local disk
        if (typeof window !== 'undefined' && parsedMarkers.length > 0 && window.location.hostname === 'localhost') {
          try {
            fetch('/__api/save-main-backup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ endpoint: 'coverage-markers', data: parsedMarkers })
            }).catch(() => {});
          } catch (e) {}
        }
        
      } catch (err) {
        console.error("Failed to load home page data from Strapi", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    const handleFocus = () => {
      loadData(true);
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadData(true);
      }
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleVisibility);

    let isPolling = false;
    let lastSig = '';
    const pollFast = async () => {
      if (isPolling) return;
      isPolling = true;
      try {
        const [ogRes, compRes, markRes] = await Promise.all([
          fetch(`${STRAPI_URL}/api/ongoing-projects?fields[0]=updatedAt&sort=updatedAt:desc&pagination[pageSize]=1`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache, no-store' }
          }),
          fetch(`${STRAPI_URL}/api/completed-projects?fields[0]=updatedAt&sort=updatedAt:desc&pagination[pageSize]=1`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache, no-store' }
          }),
          fetch(`${STRAPI_URL}/api/coverage-markers?fields[0]=updatedAt&sort=updatedAt:desc&pagination[pageSize]=1`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache, no-store' }
          })
        ]);
        if (ogRes.ok && compRes.ok) {
          const [ogJson, compJson, markJson] = await Promise.all([
            ogRes.json(),
            compRes.json(),
            markRes && markRes.ok ? markRes.json() : Promise.resolve(null)
          ]);
          const currentSig = `${ogJson?.data?.[0]?.updatedAt}_${ogJson?.meta?.pagination?.total}_${compJson?.data?.[0]?.updatedAt}_${compJson?.meta?.pagination?.total}_${markJson?.data?.[0]?.updatedAt}_${markJson?.meta?.pagination?.total}`;
          if (lastSig && lastSig !== currentSig) {
            loadData(true);
          }
          lastSig = currentSig;
        }
      } catch (e) {} finally {
        isPolling = false;
      }
    };

    const intervalId = setInterval(pollFast, 60000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(intervalId);
    };
  }, []);

  const homeSeoData = {
    contentType: 'page',
    title: data?.seo?.seoTitle || 'Pislinfra | Industrial Infrastructure & EPC Company India',
    seoTitle: data?.seo?.seoTitle || 'Pislinfra | Industrial Infrastructure & EPC Company India',
    seoDescription: data?.seo?.seoDescription || 'Pislinfra delivers warehousing, logistics parks, and industrial construction solutions, with 17+ years of experience and 16M+ sq. ft. delivered.',
    seoKeywords: data?.seo?.seoKeywords || 'Pislinfra, industrial infrastructure, construction company, warehousing, logistics park, industrial development, warehouse construction India, turnkey EPC company India, PEB warehouse construction, Grade-A warehouse builder, industrial park developers NCR, civil engineering contractors India, factory shed construction, pre-engineered buildings India, commercial construction company, BTS warehouse developers, logistics park infrastructure, heavy industrial construction, Pragati Infra Solutions, warehouse contractors Delhi NCR Haryana Gujarat',
    slug: '',
    canonicalUrl: 'https://pislinfra.com/',
    ogTitle: data?.seo?.ogTitle || 'Pislinfra | Industrial Infrastructure & EPC Company India',
    ogDescription: data?.seo?.ogDescription || 'Pislinfra delivers warehousing, logistics parks, and industrial construction solutions, with 17+ years of experience and 16M+ sq. ft. delivered.',
    ogImage: data?.seo?.ogImage || 'https://pislinfra.com/logo.png',
    ogType: 'website',
    twitterTitle: data?.seo?.twitterTitle || 'Pislinfra | Industrial & Warehouse Infrastructure',
    twitterDescription: data?.seo?.twitterDescription || 'Turnkey industrial construction and EPC solutions with 16M+ sq ft delivered in India.',
    twitterImage: data?.seo?.twitterImage || 'https://pislinfra.com/logo.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'WebSite',
    breadcrumbSchema: false,
    organizationSchema: true,
    tags: ['Industrial Construction', 'Warehousing', 'Logistics Parks', 'Turnkey EPC', 'PEB Buildings', 'India'],
    ...data?.seo
  };

  return (
    <>
      <BlogSEO blog={homeSeoData} />

      <div>
        <HeroVideo />
        <AboutUs data={data} />
        <StatsSection data={data} />
        <Services data={data} />
        <CoverageMap data={data} mapMarkers={markers.length > 0 ? markers : (data?.mapMarkers || [])} ongoingProjects={ongoing} completedProjects={completed} />
        <Industries data={data} />
        <Awards awardsData={awards.length > 0 ? awards : undefined} data={data} />
        <Clients clientsData={clients.length > 0 ? clients : undefined} data={data} />
        <HSESection data={data} />
      </div>
    </>
  );
};

export default Home;
