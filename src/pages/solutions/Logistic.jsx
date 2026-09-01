import React, { useState, useEffect } from 'react'
import { fetchStrapiData } from '../../services/strapi'
import { getImageUrl } from '../../utils/imageUrl'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import logisticBg from '../../assets/images/Project/complete/Farrukhnagar,NCR-2/all-cargo-logistics-park-farrukhnagar-hr-2.png'
import * as FaIcons from 'react-icons/fa';
import * as HiIcons from 'react-icons/hi';
import * as BiIcons from 'react-icons/bi';
import Preloader from '../../components/common/Preloader';

const getIcon = (iconName) => {
  if (!iconName) return FaIcons.FaCircle;
  if (iconName.startsWith('Fa')) return FaIcons[iconName] || FaIcons.FaCircle;
  if (iconName.startsWith('Hi')) return HiIcons[iconName] || FaIcons.FaCircle;
  if (iconName.startsWith('Bi')) return BiIcons[iconName] || FaIcons.FaCircle;
  return FaIcons.FaCircle;
};



const defaultLogisticData = {
  title: "Logistics Parks",
  introText: "Pislinfra builds grade-A logistics parks and distribution hubs across major industrial corridors.",
  mainFeatureTitle: "Modern Logistics Infrastructure",
  mainFeatureText: "Strategic location design, PEB structures, high-load flooring, and integrated security for logistics parks.",
  grids: { items: [] }
};

const Logistic = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchStrapiData('solution-pages?filters[slug]=logistic&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=grids.items&populate[3]=seo');
        if (response && response.length > 0) {
          setData(response[0]);
        } else {
          setData(defaultLogisticData);
        }
      } catch (err) {
        setData(defaultLogisticData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !data) return <Preloader />;

  const seoData = {
    contentType: 'page',
    title: data.title || "Logistics Parks",
    seoTitle: data.seo?.seoTitle || "Grade-A Logistics Parks & Distribution Centers Construction | Pislinfra",
    seoDescription: data.seo?.seoDescription || "Specialized engineering and construction of Grade-A logistics parks, supply chain distribution hubs, multi-modal terminals, and high-efficiency freight facilities across India.",
    seoKeywords: data.seo?.seoKeywords || "logistics park construction, Grade-A distribution hubs, supply chain parks India, freight logistics infrastructure, multi-modal park development, Pislinfra",
    slug: 'solutions/logistic',
    canonicalUrl: data.seo?.canonicalUrl || "https://pislinfra.com/solutions/logistic",
    ogTitle: data.seo?.ogTitle || "Grade-A Logistics Parks & Distribution Centers Construction | Pislinfra",
    ogDescription: data.seo?.ogDescription || "Specialized construction of Grade-A logistics parks, warehousing hubs, and multi-modal distribution centers in India.",
    ogImage: getImageUrl(data.seo?.ogImage || data.heroImage, 'https://pislinfra.com/images/hero/Logistic.png'),
    ogType: data.seo?.ogType || 'website',
    twitterTitle: data.seo?.twitterTitle || "Grade-A Logistics Parks & Distribution Centers Construction | Pislinfra",
    twitterDescription: data.seo?.twitterDescription || "Specialized construction of Grade-A logistics parks, warehousing hubs, and multi-modal distribution centers in India.",
    twitterImage: getImageUrl(data.seo?.twitterImage || data.heroImage, 'https://pislinfra.com/images/hero/Logistic.png'),
    twitterCardType: data.seo?.twitterCardType || 'summary_large_image',
    schemaType: data.seo?.schemaType || 'Service',
    breadcrumbSchema: data.seo?.breadcrumbSchema !== undefined ? data.seo.breadcrumbSchema : true,
    organizationSchema: data.seo?.organizationSchema !== undefined ? data.seo.organizationSchema : true,
    tags: data.seo?.tags ? data.seo.tags.split(',').map(t => t.trim()) : ['Logistics Parks', 'Distribution Centers', 'Freight Infrastructure', 'Supply Chain Hubs', 'Multi-Modal Logistics'],
    noIndex: data.seo?.noIndex || false,
    noFollow: data.seo?.noFollow || false,
    structuredData: data.seo?.structuredData
  };

  const mapGridItems = (items) => {
    if (!items) return [];
    return items.map(item => ({
      icon: getIcon(item.icon),
      title: item.title,
      desc: item.description || item.desc
    }));
  };

  const gridsArray = Array.isArray(data.grids) ? data.grids : (data.grids?.items ? [data.grids] : []);
  const dynamicGrids = gridsArray.map(grid => ({
    title: grid.title ? <span dangerouslySetInnerHTML={{ __html: grid.title.replace(/\((.*?)\)/g, '<span style="color: #0a2a66">($1)</span>') }} /> : '',
    description: grid.description,
    items: mapGridItems(grid.items),
    vertical: grid.vertical,
    minWidth: grid.minWidth,
    cardBg: grid.cardBg,
    cardBorder: grid.cardBorder,
    iconBg: grid.iconBg,
    iconColor: grid.iconColor
  }));

  return (
    <SolutionLayout
      seoData={seoData}
      hero={{
        title: "Logistic Park Development",
        subtitle: "Modern logistics & warehousing solutions",
        breadcrumb: "Solutions / Logistic",
        bgImage: data.heroImage ? getImageUrl(data.heroImage, logisticBg) : logisticBg
      }}
      mainFeature={{
        title: (
          <span>
            {(() => {
              const words = (data.mainFeatureTitle || "Introduction").split(' ');
              if (words.length === 1) return <span style={{ color: '#0a2a66' }}>{words[0]}</span>;
              const firstPart = words.slice(0, words.length - 1).join(' ');
              const lastPart = words.slice(-1).join(' ');
              return <>{firstPart} <span style={{ color: '#0a2a66' }}>{lastPart}</span></>;
            })()}
          </span>
        ),
        text: data.mainFeatureText ? (<div style={{ marginBottom: '16px', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: data.mainFeatureText.replace(/### (.*?)\n/g, '<h3 style="font-size: 22px; font-weight: bold; color: #2a2a75; margin-bottom: 16px; margin-top: 32px;">$1</h3>').replace(/\n\n/g, '<br/><br/>') }} />) : null,
        image: getImageUrl(data.mainFeatureImage, logisticBg)
      }}
      grids={dynamicGrids}
    />
  )
}

export default Logistic