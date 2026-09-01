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

const Home = () => {
  const [data, setData] = useState(null);
  const [ongoing, setOngoing] = useState(projectsData);
  const [completed, setCompleted] = useState(completedProjectsData);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [awards, setAwards] = useState([]);
  const [markers, setMarkers] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [homeRes, ongoingRes, completedRes, clientsRes, awardsRes, markersRes] = await Promise.all([
          fetchStrapiData('home-page?populate=*'),
          fetchStrapiData('ongoing-projects?populate=*'),
          fetchStrapiData('completed-projects?populate=*'),
          fetchStrapiData('clients?pagination[pageSize]=100&sort=order:asc'),
          fetchStrapiData('awards?populate=*&sort=order:asc'),
          fetchStrapiData('coverage-markers?populate=*&pagination[pageSize]=100')
        ]);
        
        if (homeRes) setData(homeRes);
        if (markersRes && Array.isArray(markersRes)) setMarkers(markersRes);
        
        if (ongoingRes && Array.isArray(ongoingRes) && ongoingRes.length > 0) {
          setOngoing(ongoingRes.map(p => {
            const matchLocal = projectsData.find(lp => lp.name === (p.title || p.name)) || {};
            const strapiImg = getImageUrl(p.image?.url || p.images?.[0]?.url || '');
            const finalImages = strapiImg ? [strapiImg] : (matchLocal.images || matchLocal.image ? [matchLocal.image || matchLocal.images?.[0]] : ['/images/Project/ongoing/Mundra/adani-copper-smelter-mundra-gj-1.png']);
            return {
              id: p.id,
              name: p.title || p.name,
              state: p.state || matchLocal.state || 'Gujarat',
              city: p.location || p.city || matchLocal.location || matchLocal.city,
              location: p.location || p.city || matchLocal.location || matchLocal.city,
              status: 'Ongoing',
              category: p.category || matchLocal.category,
              area: p.area || matchLocal.area,
              client: p.client || matchLocal.client,
              scope: p.scope || matchLocal.scope,
              timeline: p.timeline || matchLocal.timeline,
              cx: p.cx != null ? p.cx : matchLocal.cx,
              cy: p.cy != null ? p.cy : matchLocal.cy,
              progress: p.progress || matchLocal.progress || 75,
              images: finalImages,
              image: finalImages[0]
            };
          }));
        }
        
        if (completedRes && Array.isArray(completedRes) && completedRes.length > 0) {
          setCompleted(completedRes.map(p => {
            const matchLocal = completedProjectsData.find(lp => lp.name === (p.title || p.name)) || {};
            const strapiImg = getImageUrl(p.image?.url || p.images?.[0]?.url || '');
            const finalImages = strapiImg ? [strapiImg] : (matchLocal.images || matchLocal.image ? [matchLocal.image || matchLocal.images?.[0]] : ['/images/Project/completed/Farrukhnagar/welspun-factory-farrukhnagar-hr-1.png']);
            return {
              id: p.id,
              name: p.title || p.name,
              state: p.state || matchLocal.state || 'Haryana',
              city: p.location || p.city || matchLocal.location || matchLocal.city,
              location: p.location || p.city || matchLocal.location || matchLocal.city,
              status: 'Completed',
              category: p.category || matchLocal.category,
              area: p.area || matchLocal.area,
              client: p.client || matchLocal.client,
              scope: p.scope || matchLocal.scope,
              timeline: p.timeline || matchLocal.timeline,
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
    title: data?.seo?.seoTitle || 'Pislinfra | Industrial Infrastructure & Turnkey EPC Company India',
    seoTitle: data?.seo?.seoTitle || 'Pislinfra | Premier Industrial Infrastructure, Warehouse & EPC Company India',
    seoDescription: data?.seo?.seoDescription || 'Pislinfra (Pragati Infra Solutions) is India\'s leading industrial infrastructure, warehouse construction, and turnkey EPC company with 16M+ sq ft delivered across India.',
    seoKeywords: data?.seo?.seoKeywords || 'industrial construction company India, warehouse EPC contractor, PEB warehouse construction, logistics park builder, turnkey civil engineering India, Pislinfra, Pragati Infra Solutions',
    slug: '',
    canonicalUrl: 'https://pislinfra.com/',
    ogTitle: data?.seo?.ogTitle || 'Pislinfra - Turnkey Industrial Infrastructure & EPC Company India',
    ogDescription: data?.seo?.ogDescription || 'Leading industrial construction company specializing in warehousing, logistics parks & EPC solutions across India. 16M+ sq ft delivered.',
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
