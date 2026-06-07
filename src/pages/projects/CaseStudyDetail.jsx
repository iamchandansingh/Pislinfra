import { useParams, useNavigate } from 'react-router-dom'
import PageHero from '../../components/hero/PageHero'
import caseStudies from '../../data/caseStudies'
import { FaCheckCircle, FaExclamationTriangle, FaTrophy, FaArrowLeft, FaBuilding, FaMapMarkerAlt, FaRulerCombined } from 'react-icons/fa'

const CaseStudyDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const cs = caseStudies.find(c => c.slug === slug)

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

  const infoData = [
    { icon: FaBuilding, label: 'PROJECT', value: cs.project },
    { icon: FaBuilding, label: 'DEVELOPER', value: cs.developer },
    { icon: FaMapMarkerAlt, label: 'LOCATION', value: cs.location },
    { icon: FaRulerCombined, label: 'PLINTH AREA', value: cs.plinthArea },
    { icon: FaRulerCombined, label: 'BUILD-UP AREA', value: cs.buildUpArea },
  ]

  return (
    <div>
      <PageHero title={cs.title} breadcrumb="Projects / Case Study" bgImage={cs.image} />
      
      <section style={{ padding: '60px 16px', backgroundColor: '#fafbfc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Back Button */}
          <button onClick={() => navigate('/projects/case-study')} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ff8755',
            fontWeight: '600', fontSize: '14px', border: 'none', background: 'none',
            cursor: 'pointer', marginBottom: '24px', padding: '8px 0',
          }}>
            <FaArrowLeft /> Back to Case Studies
          </button>

          {/* ===== PAGE TITLE ===== */}
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
            {cs.title}
          </h2>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#ff8755', marginBottom: '40px' }}></div>

          {/* ===== SECTION 1: Image Left + Info Right ===== */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px',
            marginBottom: '56px', alignItems: 'center',
          }}>
            <div style={{
              borderRadius: '14px', overflow: 'hidden',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)', height: '420px',
              backgroundImage: `url(${cs.image})`, backgroundSize: 'cover',
              backgroundPosition: 'center', border: '3px solid white',
            }}></div>

            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' }}>
                Project <span style={{ color: '#ff8755' }}>Details</span>
              </h3>
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

          {/* ===== SECTION 2: Engagement - Left Content + Right Image ===== */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px',
            marginBottom: '56px', alignItems: 'center',
          }}>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaCheckCircle style={{ color: '#10b981', fontSize: '16px' }} />
                </div>
                PISL Engagement
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {cs.engagement.map((item, i) => (
                  <li key={i} style={{
                    padding: '10px 14px', marginBottom: '6px', backgroundColor: 'white',
                    borderRadius: '8px', border: '1px solid #f0f0f0', fontSize: '13px',
                    color: '#4b5563', lineHeight: '1.5', display: 'flex', gap: '8px',
                  }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold', flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{
              borderRadius: '14px', overflow: 'hidden', height: '340px',
              border: '3px solid white', boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              backgroundImage: `url(${cs.engagementImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
            }}></div>
          </div>

          {/* ===== SECTION 3: Challenges - Left Image + Right Content ===== */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px',
            marginBottom: '56px', alignItems: 'center',
          }}>
            <div style={{
              borderRadius: '14px', overflow: 'hidden', height: '340px',
              border: '3px solid white', boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              backgroundImage: `url(${cs.challengesImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
            }}></div>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaExclamationTriangle style={{ color: '#f59e0b', fontSize: '16px' }} />
                </div>
                Project Challenges
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {cs.challenges.map((item, i) => (
                  <li key={i} style={{
                    padding: '10px 14px', marginBottom: '6px', backgroundColor: 'white',
                    borderRadius: '8px', border: '1px solid #f0f0f0', fontSize: '13px',
                    color: '#4b5563', lineHeight: '1.5', display: 'flex', gap: '8px',
                  }}>
                    <span style={{ color: '#f59e0b', fontWeight: 'bold', flexShrink: 0 }}>!</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ===== SECTION 4: Achievements - Left Content + Right Image ===== */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px',
            marginBottom: '40px', alignItems: 'center',
          }}>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#fff5f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaTrophy style={{ color: '#ff8755', fontSize: '16px' }} />
                </div>
                Project Achievements
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {cs.achievements.map((item, i) => (
                  <li key={i} style={{
                    padding: '10px 14px', marginBottom: '6px', backgroundColor: 'white',
                    borderRadius: '8px', border: '1px solid #f0f0f0', fontSize: '13px',
                    color: '#4b5563', lineHeight: '1.5', display: 'flex', gap: '8px',
                  }}>
                    <span style={{ color: '#ff8755', fontWeight: 'bold', flexShrink: 0 }}>★</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{
              borderRadius: '14px', overflow: 'hidden', height: '340px',
              border: '3px solid white', boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              backgroundImage: `url(${cs.achievementsImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
            }}></div>
          </div>

        </div>
      </section>
    </div>
  )
}

export default CaseStudyDetail