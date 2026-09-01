import React, { useState, useEffect } from 'react'
import { fetchStrapiData } from '../../services/strapi'
import { getImageUrl } from '../../utils/imageUrl'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import warehouseBg from '../../assets/images/Project/complete/Bilaspur-NCR/amazon-del5-billaspur-hr-5.png'
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



const defaultWarehouseData = {
  title: "Warehousing Solutions",
  introText: "Pislinfra specializes in designing and constructing LEED-certified warehousing facilities.",
  mainFeatureTitle: "Grade-A Warehousing",
  mainFeatureText: "High-bay warehousing with FM2 floor specifications, thermal insulation, and energy-efficient systems.",
  grids: { items: [] }
};

const Warehouse = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchStrapiData('solution-pages?filters[slug]=warehouse&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=grids.items&populate[3]=seo');
        if (response && response.length > 0) {
          setData(response[0]);
        } else {
          setData(defaultWarehouseData);
        }
      } catch (err) {
        setData(defaultWarehouseData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !data) return <Preloader />;

  const seoData = {
    contentType: 'page',
    title: data.title || "Warehousing Solutions",
    seoTitle: data.seo?.seoTitle || "Modern Warehouse Design & LEED Certified Construction | Pislinfra",
    seoDescription: data.seo?.seoDescription || "India's premier warehouse construction company. High-bay pre-engineered steel buildings, FM2 floor specification, LEED gold certified green warehousing, and cold chain facilities.",
    seoKeywords: data.seo?.seoKeywords || "warehouse construction company India, PEB warehouse contractor, FM2 superflat flooring, LEED certified green warehouse, cold storage construction, Pislinfra warehouse",
    slug: 'solutions/warehouse',
    canonicalUrl: data.seo?.canonicalUrl || "https://pislinfra.com/solutions/warehouse",
    ogTitle: data.seo?.ogTitle || "Modern Warehouse Design & LEED Certified Construction | Pislinfra",
    ogDescription: data.seo?.ogDescription || "India's premier warehouse construction company. High-bay PEB buildings, FM2 floor specs, and LEED gold green warehousing.",
    ogImage: getImageUrl(data.seo?.ogImage || data.heroImage, 'https://pislinfra.com/images/hero/Warehouse.png'),
    ogType: data.seo?.ogType || 'website',
    twitterTitle: data.seo?.twitterTitle || "Modern Warehouse Design & LEED Certified Construction | Pislinfra",
    twitterDescription: data.seo?.twitterDescription || "India's premier warehouse construction company. High-bay PEB buildings, FM2 floor specs, and LEED gold green warehousing.",
    twitterImage: getImageUrl(data.seo?.twitterImage || data.heroImage, 'https://pislinfra.com/images/hero/Warehouse.png'),
    twitterCardType: data.seo?.twitterCardType || 'summary_large_image',
    schemaType: data.seo?.schemaType || 'Service',
    breadcrumbSchema: data.seo?.breadcrumbSchema !== undefined ? data.seo.breadcrumbSchema : true,
    organizationSchema: data.seo?.organizationSchema !== undefined ? data.seo.organizationSchema : true,
    tags: data.seo?.tags ? data.seo.tags.split(',').map(t => t.trim()) : ['Warehouse Construction', 'LEED Certified Warehousing', 'PEB Industrial Buildings', 'FM2 Superflat Floors', 'Cold Storage Facilities'],
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
        title: "Warehouse Contractors",
        subtitle: "State-of-the-art storage & distribution centers",
        breadcrumb: "Solutions / Warehouse",
        bgImage: data.heroImage ? getImageUrl(data.heroImage, warehouseBg) : warehouseBg
      }}
      mainFeature={{
        title: (
          <span>
            {(() => {
              const words = (data.mainFeatureTitle || "Design-Build Solutions").split(' ');
              if (words.length === 1) return <span style={{ color: '#0a2a66' }}>{words[0]}</span>;
              const firstPart = words.slice(0, words.length - 1).join(' ');
              const lastPart = words.slice(-1).join(' ');
              return <>{firstPart} <span style={{ color: '#0a2a66' }}>{lastPart}</span></>;
            })()}
          </span>
        ),
        text: data.mainFeatureText ? (
          <div style={{ marginBottom: '16px', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: data.mainFeatureText.replace(/### (.*?)\n/g, '<h3 style="font-size: 22px; font-weight: bold; color: #2a2a75; margin-bottom: 16px; margin-top: 32px;">$1</h3>').replace(/\n\n/g, '<br/><br/>') }} />
        ) : null,
        image: data.mainFeatureImage ? getImageUrl(data.mainFeatureImage, warehouseBg) : null
      }}
      grids={dynamicGrids}
    />
  )
}

export default Warehouse