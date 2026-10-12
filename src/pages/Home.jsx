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
import { fetchStrapiData } from '../services/strapi';
import { getImageUrl } from '../utils/imageUrl';
import projectsData from '../data/projectsData';
import completedProjectsData from '../data/completedProjects';
import coverageMarkersData from '../data/coverageMarkersData';
import awardsAndCertifications from '../data/Awards-&-Certifications';
import clientsData from '../data/clientsData';

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

const Home = () => {
  const [data, setData] = useState(null);
  const [ongoing, setOngoing] = useState(defaultOngoing);
  const [completed, setCompleted] = useState(defaultCompleted);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState(clientsData);
  const [awards, setAwards] = useState(awardsAndCertifications);
  const [markers, setMarkers] = useState(coverageMarkersData);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [homeRes, ongoingRes, completedRes, clientsRes, awardsRes, markersRes] = await Promise.all([
          fetchStrapiData('home-page?populate=*'),
          fetchStrapiData('ongoing-projects?populate=*&pagination[pageSize]=100&sort=createdAt:asc'),
          fetchStrapiData('completed-projects?populate=*&pagination[pageSize]=100&sort=createdAt:asc'),
          fetchStrapiData('clients?pagination[pageSize]=100&sort=order:asc'),
          fetchStrapiData('awards?populate=*&sort=order:asc'),
          fetchStrapiData('coverage-markers?populate=*&pagination[pageSize]=100')
        ]);
        
        if (homeRes) setData(homeRes);
        if (markersRes && Array.isArray(markersRes)) setMarkers(markersRes);
        
        const slugify = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

        if (ongoingRes && Array.isArray(ongoingRes) && ongoingRes.length > 0) {
          setOngoing(ongoingRes.map(p => {
            const pName = p.name || p.title || '';
            const matchLocal = projectsData.find(lp => {
              const sL = slugify(lp.name);
              const sP = slugify(pName);
              return sL === sP || (sL && sP && (sL.includes(sP) || sP.includes(sL)));
            }) || {};
            const strapiImgs = Array.isArray(p.images) && p.images.length > 0
              ? p.images.map(img => getImageUrl(img.formats?.large?.url || img.formats?.medium?.url || img.formats?.small?.url || img.url)).filter(Boolean)
              : (p.image ? [getImageUrl(p.image.formats?.large?.url || p.image.url || p.image)] : []);
            const finalImages = strapiImgs.length > 0 
              ? strapiImgs 
              : (matchLocal.images && matchLocal.images.length > 0 ? matchLocal.images : (matchLocal.image ? [matchLocal.image] : ['/images/Project/ongoing/Mundra/adani-copper-smelter-mundra-gj-1.png']));
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
              cx: p.cx != null ? p.cx : matchLocal.cx,
              cy: p.cy != null ? p.cy : matchLocal.cy,
              progress: p.progress != null ? p.progress : (matchLocal.progress || 75),
              images: finalImages,
              image: finalImages[0]
            };
          }));
        }
        
        if (completedRes && Array.isArray(completedRes) && completedRes.length > 0) {
          setCompleted(completedRes.map(p => {
            const pName = p.name || p.title || '';
            const matchLocal = completedProjectsData.find(lp => {
              const sL = slugify(lp.name);
              const sP = slugify(pName);
              return sL === sP || (sL && sP && (sL.includes(sP) || sP.includes(sL)));
            }) || {};
            const strapiImgs = Array.isArray(p.images) && p.images.length > 0
              ? p.images.map(img => getImageUrl(img.formats?.large?.url || img.formats?.medium?.url || img.formats?.small?.url || img.url)).filter(Boolean)
              : (p.image ? [getImageUrl(p.image.formats?.large?.url || p.image.url || p.image)] : []);
            const finalImages = strapiImgs.length > 0 
              ? strapiImgs 
              : (matchLocal.images && matchLocal.images.length > 0 ? matchLocal.images : (matchLocal.image ? [matchLocal.image] : ['/images/Project/completed/Farrukhnagar/welspun-factory-farrukhnagar-hr-1.png']));
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
              cx: p.cx != null ? p.cx : matchLocal.cx,
              cy: p.cy != null ? p.cy : matchLocal.cy,
              progress: 100,
              images: finalImages,
              image: finalImages[0]
            };
          }));
        }
        
        if (clientsRes && Array.isArray(clientsRes)) setClients(clientsRes);
        if (awardsRes && Array.isArray(awardsRes)) setAwards(awardsRes);
        
      } catch (err) {
        console.error("Failed to load home page data from Strapi", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Preloader />;

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
