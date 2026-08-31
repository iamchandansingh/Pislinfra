import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchStrapiData } from '../../services/strapi'
import Preloader from '../../components/common/Preloader'
import PageHero from '../../components/hero/PageHero'
import BlogSEO from '../../components/Blog/BlogSEO'
import caseStudies from '../../data/caseStudies'
import { FaBuilding, FaMapMarkerAlt, FaRulerCombined } from 'react-icons/fa'

const imgStyle = {
  width: '100%',
  height: '300px',
  objectFit: 'cover',
  borderRadius: '12px',
  border: '3px solid #ff8d4b',
  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
};

const sectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '50px',
  flexWrap: 'wrap'
};

const imageContainerStyle = { flex: '1', minWidth: '300px' };
const contentStyle = { flex: '1', minWidth: '300px' };
const headingStyle = { color: '#28296F', fontSize: '32px', marginBottom: '20px', fontWeight: 800 };

const CaseStudyDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  const [cs, setCs] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      try {
        const csData = await fetchStrapiData(`case-studies?filters[slug][$eq]=${slug}&populate=*`);
        if (csData && csData.length > 0) {
          const item = csData[0];
          setCs({
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
            engagement: item.engagement || [],
            challenges: item.challenges || [],
            achievements: item.achievements || [],
            conclusion: item.conclusion,
            image: item.image ? (item.image.url?.startsWith('http') ? item.image.url : `http://127.0.0.1:1337${item.image.url}`) : null,
            engagementImage: item.engagementImage ? (item.engagementImage.url?.startsWith('http') ? item.engagementImage.url : `http://127.0.0.1:1337${item.engagementImage.url}`) : null,
            challengesImage: item.challengesImage ? (item.challengesImage.url?.startsWith('http') ? item.challengesImage.url : `http://127.0.0.1:1337${item.challengesImage.url}`) : null,
            achievementsImage: item.achievementsImage ? (item.achievementsImage.url?.startsWith('http') ? item.achievementsImage.url : `http://127.0.0.1:1337${item.achievementsImage.url}`) : null,
            seo: item.seo,
          });
        } else {
          const found = caseStudies.find(c => c.slug === slug);
          setCs(found || null);
        }
      } catch (err) {
        console.error("Error fetching case study details:", err);
        const found = caseStudies.find(c => c.slug === slug);
        setCs(found || null);
      } finally {
        setLoading(false);
      }
    };
    
    getData();
  }, [slug]);

  if (loading) return <Preloader />


  if (!cs) {
    return (
      <div>
        <PageHero title="Not Found" breadcrumb="Projects" bgImage="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200" />
        <section style={{ padding: '80px 16px', textAlign: 'center' }}>
          <button onClick={() => navigate('/projects/case-study')} style={{ color: '#ff8755', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer' }}>← Back</button>
        </section>
      </div>
    )
  }

  // ==================== SEO DATA ====================
  const seoData = {
    ...cs,
    contentType: 'case-study',
  };

  const infoData = [
    { icon: FaBuilding, label: 'PROJECT', value: cs.project },
    { icon: FaBuilding, label: 'DEVELOPER', value: cs.developer },
    { icon: FaMapMarkerAlt, label: 'LOCATION', value: cs.location },
    { icon: FaRulerCombined, label: 'PLINTH AREA', value: cs.plinthArea },
    { icon: FaRulerCombined, label: 'BUILD-UP AREA', value: cs.buildUpArea },
  ]

  return (
    <div>
      <BlogSEO blog={seoData} />
      <PageHero title={cs.title} breadcrumb="Projects / Case Study" bgImage={cs.image} />
      
      <section style={{ padding: '60px 16px', backgroundColor: '#fafbfc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* ===== SECTION 1: Image LEFT + Content RIGHT ===== */}
          <div className="case-row" style={sectionStyle}>
            <div style={imageContainerStyle}>
              <img src={cs.image} alt={cs.title} style={imgStyle} />
            </div>
            <div style={contentStyle}>
              <h3 style={headingStyle}>Project <span style={{ color: '#ff8755' }}>Details</span></h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {infoData.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '12px 16px', backgroundColor: 'white',
                    borderRadius: '10px', border: '1px solid #f0f0f0',
                    transition: 'all 0.3s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ff8755'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,135,85,0.08)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '8px',
                      backgroundColor: '#fff5f0', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <item.icon style={{ color: '#ff8755', fontSize: '14px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#ff8755', fontWeight: '700', letterSpacing: '1px', marginBottom: '2px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== SECTION 2: Content LEFT + Image RIGHT ===== */}
          <div className="case-row" style={{ ...sectionStyle, marginTop: '56px', flexDirection: 'row-reverse' }}>
            <div style={imageContainerStyle}>
              <img src={cs.engagementImage || cs.image} alt="Engagement" style={imgStyle} />
            </div>
            <div style={contentStyle}>
              <h3 style={headingStyle}>
                PISL <span style={{ color: '#10b981' }}>Engagement</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {cs.engagement.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    padding: '8px 12px', backgroundColor: 'white',
                    borderRadius: '6px', border: '1px solid #f0f0f0',
                    fontSize: '13px', color: '#4b5563', lineHeight: '1.5',
                  }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold', flexShrink: 0, marginTop: '1px', fontSize: '12px' }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== SECTION 3: Image LEFT + Content RIGHT ===== */}
          <div className="case-row" style={{ ...sectionStyle, marginTop: '56px' }}>
            <div style={imageContainerStyle}>
              <img src={cs.challengesImage || cs.image} alt="Challenges" style={imgStyle} />
            </div>
            <div style={contentStyle}>
              <h3 style={headingStyle}>
                Project <span style={{ color: '#f59e0b' }}>Challenges</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {cs.challenges.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    padding: '8px 12px', backgroundColor: 'white',
                    borderRadius: '6px', border: '1px solid #f0f0f0',
                    fontSize: '13px', color: '#4b5563', lineHeight: '1.5',
                  }}>
                    <span style={{ color: '#f59e0b', fontWeight: 'bold', flexShrink: 0, marginTop: '1px', fontSize: '12px' }}>!</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== SECTION 4: Content LEFT + Image RIGHT ===== */}
          <div className="case-row" style={{ ...sectionStyle, marginTop: '56px', flexDirection: 'row-reverse' }}>
            <div style={imageContainerStyle}>
              <img src={cs.achievementsImage || cs.image} alt="Achievements" style={imgStyle} />
            </div>
            <div style={contentStyle}>
              <h3 style={headingStyle}>
                Project <span style={{ color: '#ff8755' }}>Achievements</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {cs.achievements.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    padding: '8px 12px', backgroundColor: 'white',
                    borderRadius: '6px', border: '1px solid #f0f0f0',
                    fontSize: '13px', color: '#4b5563', lineHeight: '1.5',
                  }}>
                    <span style={{ color: '#ff8755', fontWeight: 'bold', flexShrink: 0, marginTop: '1px', fontSize: '12px' }}>★</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .case-row {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  )
}

export default CaseStudyDetail