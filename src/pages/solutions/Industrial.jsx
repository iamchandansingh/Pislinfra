import React, { useState, useEffect } from 'react'
import { fetchStrapiData } from '../../services/strapi'
import { getImageUrl } from '../../utils/imageUrl'
import SolutionLayout from '../../components/solutions/SolutionLayout'
import industrialBg from '../../assets/images/Project/complete/Pataudi-HR/flipkart-sampka-pataudi-hr.png'
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



const defaultIndustrialData = {
  title: "Industrial Development",
  introText: "PISL provides EPC, construction, infrastructure development, and industrial solutions across India.",
  mainFeatureTitle: "What is Industrial Development?",
  mainFeatureText: "Industrial development encompasses civil engineering, structural steel, foundation works, and utility infrastructure designed for factories and processing plants.",
  features: [
    { title: "Heavy Structural Steel", desc: "Engineered PEB & heavy structural fabrication.", icon: "FaBuilding" },
    { title: "Turnkey EPC Services", desc: "End-to-end design, civil construction, and commissioning.", icon: "FaCogs" },
    { title: "Safety & Compliance", desc: "Highest international safety protocols and ISO standard compliance.", icon: "FaShieldAlt" }
  ],
  whyPislTitle: "Why Choose PISL for Industrial Construction?",
  whyPislText: "With over two decades of proven experience, PISL has delivered landmark industrial facilities across India."
};

const Industrial = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchStrapiData('solution-pages?filters[slug]=industrial&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=whyPislImage&populate[3]=features&populate[4]=seo');
        if (response && response.length > 0) {
          setData(response[0]);
        } else {
          setData(defaultIndustrialData);
        }
      } catch (err) {
        setData(defaultIndustrialData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !data) return <Preloader />;

    const seoData = {
    contentType: 'page',
    title: data.title,
    seoTitle: data.seo?.seoTitle,
    seoDescription: data.seo?.seoDescription,
    seoKeywords: data.seo?.seoKeywords,
    slug: 'solutions/industrial',
    canonicalUrl: data.seo?.canonicalUrl,
    ogTitle: data.seo?.ogTitle,
    ogDescription: data.seo?.ogDescription,
    ogImage: getImageUrl(data.seo?.ogImage || data.heroImage, ''),
    ogType: data.seo?.ogType || 'website',
    twitterTitle: data.seo?.twitterTitle,
    twitterDescription: data.seo?.twitterDescription,
    twitterImage: getImageUrl(data.seo?.twitterImage || data.heroImage, ''),
    twitterCardType: data.seo?.twitterCardType || 'summary_large_image',
    schemaType: data.seo?.schemaType || 'WebPage',
    breadcrumbSchema: data.seo?.breadcrumbSchema !== undefined ? data.seo.breadcrumbSchema : true,
    organizationSchema: data.seo?.organizationSchema !== undefined ? data.seo.organizationSchema : true,
    tags: data.seo?.tags ? data.seo.tags.split(',').map(t => t.trim()) : ['Industrial', 'Manufacturing', 'Construction', 'Development', 'Factory'],
    noIndex: data.seo?.noIndex || false,
    noFollow: data.seo?.noFollow || false,
    structuredData: data.seo?.structuredData
  };

  const features = data.features || [];

  return (
    <SolutionLayout
      seoData={seoData}
      hero={{
        title: "Industrial Development",
        subtitle: "World-class industrial facilities and manufacturing plants",
        breadcrumb: "Solutions / Industrial",
        bgImage: data.heroImage ? getImageUrl(data.heroImage, industrialBg) : industrialBg
      }}
      intro={{
        text: data.introText ? (<div dangerouslySetInnerHTML={{ __html: data.introText.replace(/\n/g, '<br/>') }} />) : null
      }}
      mainFeature={{
        
        title: (
          <span>
            {(() => {
              const words = (data.mainFeatureTitle || "What is Industrial Development?").split(' ');
              if (words.length <= 2) return <span style={{ color: '#0a2a66' }}>{words.join(' ')}</span>;
              const firstPart = words.slice(0, words.length - 2).join(' ');
              const lastPart = words.slice(-2).join(' ');
              return <>{firstPart} <span style={{ color: '#0a2a66' }}>{lastPart}</span></>;
            })()}
          </span>
        ),
        text: data.mainFeatureText ? (<div style={{ marginBottom: '16px', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: data.mainFeatureText.replace(/### (.*?)\n/g, '<h3 style="font-size: 22px; font-weight: bold; color: #2a2a75; margin-bottom: 16px; margin-top: 32px;">$1</h3>').replace(/\n\n/g, '<br/><br/>') }} />) : null,
        image: getImageUrl(data.mainFeatureImage, industrialBg)
      }}
    >
      <style>{`
        .why-pisl-split-wrapper {
          max-width: 1400px; /* Increased width */
          margin: 80px auto;
          padding: 0 30px; /* Slightly more padding on edges */
          display: flex;
          gap: 40px; /* Increased gap to utilize extra width */
          align-items: stretch; /* Stretches both sides to be equal height! */
        }

        /* Left Side Image container */
        .why-pisl-left {
          width: 40%;
          /* Removed sticky so it acts as a normal flex child stretching to height */
        }

        .why-pisl-image-card {
          position: relative;
          width: 100%;
          height: 100%; /* Fills the stretched column */
          border-radius: 20px;
          overflow: hidden;
          background-image: url('${data.whyPislImage ? getImageUrl(data.whyPislImage, "") : ""}');
          background-size: cover;
          background-position: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 2px solid #ffede5; /* Small orange-tinted border */
          display: flex;
          align-items: flex-end;
        }

        .why-pisl-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(10,42,102,0.1) 0%, rgba(10,42,102,0.7) 40%, rgba(10,42,102,0.95) 100%);
          z-index: 1;
        }

        .why-pisl-image-content {
          position: relative;
          z-index: 2;
          padding: 40px;
          color: #ffffff;
        }

        .why-pisl-image-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: bold;
          color: #ffffff;
          background-color: rgba(255, 135, 85, 0.9);
          padding: 6px 14px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 24px;
          backdrop-filter: blur(4px);
        }

        .why-pisl-image-badge::before {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          background-color: #ffffff;
          border-radius: 50%;
        }

        .why-pisl-left-title {
          font-size: 28px;
          font-weight: bold;
          color: #ffffff;
          margin-bottom: 20px;
          line-height: 1.3;
        }

        .why-pisl-left-title span {
          color: #ff8755;
        }

        .why-pisl-left-desc {
          color: #e2e8f0;
          font-size: 15px;
          line-height: 1.8;
          margin: 0;
        }

        /* Right Side Box Grid (Bento Style) */
        .why-pisl-right {
          width: 60%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .why-pisl-list-card {
          background: #ffffff;
          border: 1px solid #f0f0f0;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column; /* Box type layout */
          align-items: flex-start;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .why-pisl-list-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background-color: #ff8755;
        }

        .why-pisl-list-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          border-color: #ffe8df;
        }
        
        /* Make the 5th card span full width for symmetry */
        .why-pisl-list-card:last-child {
          grid-column: 1 / -1;
          flex-direction: row;
          align-items: flex-start;
        }

        .why-pisl-list-icon-wrap {
          width: 44px;
          height: 44px;
          background-color: #fff5f0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .why-pisl-list-icon {
          color: #ff8755;
          font-size: 20px;
        }

        .why-pisl-list-text {
          flex: 1;
        }

        .why-pisl-list-title {
          font-size: 17px;
          font-weight: bold;
          color: #2a2a75;
          margin-bottom: 6px;
        }

        .why-pisl-list-desc {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }

        /* Tablet & Mobile responsive */
        @media screen and (max-width: 900px) {
          .why-pisl-split-wrapper {
            flex-direction: column;
            margin: 60px auto;
            padding: 0 20px;
            gap: 32px;
          }
          .why-pisl-left, .why-pisl-right {
            width: 100%;
          }
          .why-pisl-right {
            grid-template-columns: 1fr;
          }
          .why-pisl-list-card,
          .why-pisl-list-card:last-child {
            flex-direction: row;
            align-items: flex-start;
          }
          .why-pisl-image-card {
            min-height: 400px;
          }
          .why-pisl-image-content {
            padding: 32px;
          }
        }

        /* Small Phones responsive */
        @media screen and (max-width: 600px) {
          .why-pisl-split-wrapper {
            margin: 40px auto;
            padding: 0 16px;
            gap: 24px;
          }
          .why-pisl-image-card {
            min-height: 350px;
            border-radius: 16px;
          }
          .why-pisl-image-content {
            padding: 24px 20px;
          }
          .why-pisl-left-title {
            font-size: 24px;
            margin-bottom: 12px;
          }
          .why-pisl-left-desc {
            font-size: 14px;
            line-height: 1.6;
          }
          .why-pisl-list-card,
          .why-pisl-list-card:last-child {
            flex-direction: column;
            padding: 20px;
            gap: 12px;
          }
        }
      `}</style>

      {(data.whyPislTitle || (data.features && data.features.length > 0)) && (
      <div className="why-pisl-split-wrapper">
        
        {/* Left Fixed Area */}
        <div className="why-pisl-left">
          <div className="why-pisl-image-card">
            <div className="why-pisl-image-overlay"></div>
            <div className="why-pisl-image-content">
              {data.whyPislBadge && <div className="why-pisl-image-badge">{data.whyPislBadge}</div>}
              <h2 className="why-pisl-left-title" dangerouslySetInnerHTML={{ __html: data.whyPislTitle ? data.whyPislTitle.replace('PISL Infra?', '<span>PISL Infra?</span>') : 'Why <span>PISL Infra?</span>' }}></h2>
              <p className="why-pisl-left-desc">{data.whyPislDesc}</p>
            </div>
          </div>
        </div>

        {/* Right Box Grid Area */}
        <div className="why-pisl-right">
          {features.map((feature, index) => (
            <div key={index} className="why-pisl-list-card">
              <div className="why-pisl-list-icon-wrap">
                {(() => { const Icon = getIcon(feature.icon); return <Icon className="why-pisl-list-icon" />; })()}
              </div>
              <div className="why-pisl-list-text">
                <h3 className="why-pisl-list-title">
                  {feature.title}
                </h3>
                <p className="why-pisl-list-desc">
                  {feature.description || feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
      )}</SolutionLayout>
  )
}

export default Industrial