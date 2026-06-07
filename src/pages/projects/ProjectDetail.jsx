import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHero from '../../components/hero/PageHero'
import ProjectCard from '../../components/cards/ProjectCard'
import projectsData from '../../data/projectsData'
import completedProjects from '../../data/completedProjects'
import clientsData from '../../data/clientsData'
import { 
  FaMapMarkerAlt, FaCalendarAlt, FaRulerCombined, 
  FaClipboardList, FaArrowLeft, FaEye, FaBuilding
} from 'react-icons/fa'

const getClientInfo = (clientName) => {
  if (!clientName) return []
  
  const clientNames = clientName
    .split(/[,/&]|\band\b/i)
    .map(n => n.trim())
    .filter(n => n.length > 0)

  return clientNames.map(name => {
    let client = clientsData.find(c => c.name === name)
    if (client) return { logo: client.logo, name: client.name }
    
    client = clientsData.find(c => c.name.toLowerCase() === name.toLowerCase())
    if (client) return { logo: client.logo, name: client.name }
    
    client = clientsData.find(c => 
      c.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(c.name.toLowerCase())
    )
    if (client) return { logo: client.logo, name: client.name }
    
    const shortNames = {
      'Adani Group': 'Adani',
      'Reliance': 'Reliance Industries Limited',
      'Reliance Industries': 'Reliance Industries Limited',
      'RIL': 'Reliance Industries Limited',
      'AMNS': 'AM/NS India (ArcelorMittal Nippon Steel India)',
      'ArcelorMittal': 'AM/NS India (ArcelorMittal Nippon Steel India)',
      'AM/NS': 'AM/NS India (ArcelorMittal Nippon Steel India)',
      'PRR Group': 'Prologis',
      'PRR': 'Prologis',
      'PISL Infra': 'GAR',
      'PISL': 'GAR',
      'Engineers India': 'EIL (Engineers India Limited)',
      'EIL': 'EIL (Engineers India Limited)',
      'CPWD': 'CPWD (Central Public Works Department)',
    }
    
    const mappedName = shortNames[name]
    if (mappedName) {
      client = clientsData.find(c => c.name === mappedName)
      if (client) return { logo: client.logo, name: client.name }
    }
    
    client = clientsData.find(c => 
      c.name.toLowerCase().includes(name.toLowerCase().split('(')[0].trim())
    )
    if (client) return { logo: client.logo, name: client.name }
    
    return { logo: null, name: name }
  })
}

const ProjectDetail = () => {
  const { id, type } = useParams()

  const fallbackImages = [
    'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/159306/pexels-photo-159306.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3777190/pexels-photo-3777190.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [sliderIndex, setSliderIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [viewedProjects, setViewedProjects] = useState([])

  const projectType = type || 'ongoing'
  const projectIdOrSlug = id

  const allProjects = projectType === 'completed' ? completedProjects : projectsData
  
  const project = allProjects.find(p => {
    if (projectIdOrSlug && !isNaN(projectIdOrSlug)) {
      return p.id === parseInt(projectIdOrSlug)
    }
    if (projectIdOrSlug) {
      const slug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return slug === projectIdOrSlug
    }
    return false
  })

  const projectImages = project?.images?.length > 0 
    ? project.images 
    : fallbackImages

  const relatedProjects = allProjects.filter(p => p.id !== project?.id)

  useEffect(() => {
    if (project) {
      const saved = JSON.parse(localStorage.getItem('viewedProjects') || '[]')
      const updated = [project, ...saved.filter(p => p.id !== project.id)].slice(0, 10)
      localStorage.setItem('viewedProjects', JSON.stringify(updated))
      setViewedProjects(updated.map(p => p.id))
    }
  }, [project])

  useEffect(() => {
    if (isPaused || relatedProjects.length === 0) return
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % relatedProjects.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isPaused, relatedProjects.length])

  const visibleProjects = []
  for (let i = 0; i < 4; i++) {
    visibleProjects.push(relatedProjects[(sliderIndex + i) % relatedProjects.length])
  }

  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projectImages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [isHovered, projectImages.length])

  if (!project) {
    return (
      <div>
        <PageHero title="Project Not Found" breadcrumb="Projects" bgImage={fallbackImages[0]} />
        <section style={{ padding: '80px 16px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '16px' }}>
            Project not found for: {projectType} / {projectIdOrSlug}
          </p>
          <Link to="/coverage" style={{ color: '#ff8755', fontWeight: '600' }}>Back to Coverage Map</Link>
        </section>
      </div>
    )
  }

  const clientInfoList = getClientInfo(project.client)
  const hasAnyLogo = clientInfoList.some(c => c.logo)
  const backUrl = projectType === 'completed' ? '/projects/completed' : '/projects/ongoing'

  return (
    <div>
      <PageHero 
        title={project.name}
        subtitle={`${project.category} Project`}
        breadcrumb={`Projects / ${project.status}`}
        bgImage={projectImages[0]}
      />
      
      <section style={{ padding: '60px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          <Link to={backUrl}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              color: '#ff8755', fontWeight: '600', fontSize: '14px',
              textDecoration: 'none', marginBottom: '32px',
            }}
          >
            <FaArrowLeft /> Back to {projectType === 'completed' ? 'Completed' : 'Ongoing'} Projects
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            
            {/* Left - Image Slider with Fade Effect */}
            <div>
              <div 
                style={{ 
                  position: 'relative', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid #f0f0f0',
                  height: '420px',
                  cursor: 'default',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {projectImages.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: currentSlide === index ? 1 : 0,
                      transition: 'opacity 1s ease-in-out',
                    }}
                  />
                ))}

                <span style={{
                  position: 'absolute', bottom: '16px', right: '16px', zIndex: 2,
                  padding: '4px 12px', backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                }}>
                  {currentSlide + 1} / {projectImages.length}
                </span>
              </div>

              {/* Dots Navigation */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                {projectImages.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => setCurrentSlide(index)}
                    style={{
                      width: index === currentSlide ? '20px' : '8px', 
                      height: '8px',
                      borderRadius: '4px', 
                      border: 'none', 
                      cursor: 'pointer',
                      backgroundColor: index === currentSlide ? '#ff8755' : '#d1d5db',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right - Details */}
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '24px' }}>
                {project.name}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                
                {/* Location Card */}
                <div style={{
                  padding: '16px', backgroundColor: '#f8fafc',
                  borderRadius: '10px', border: '1px solid #f0f0f0',
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '8px',
                    background: '#fff5f0', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaMapMarkerAlt style={{ color: '#ff8755', fontSize: '16px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.5px' }}>
                      Location
                    </div>
                    <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '500', lineHeight: '1.4' }}>
                      {project.location}, {project.state}
                    </div>
                  </div>
                </div>

                {/* Client Card */}
                <div style={{
                  padding: '16px', backgroundColor: '#f8fafc',
                  borderRadius: '10px', border: '1px solid #f0f0f0',
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '8px',
                    background: '#fff5f0', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    overflow: 'hidden',
                  }}>
                    {hasAnyLogo ? (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 0,
                      }}>
                        {clientInfoList.slice(0, 2).map((client, idx) => (
                          client.logo ? (
                            <img 
                              key={idx}
                              src={client.logo} 
                              alt={client.name}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: '5px',
                                objectFit: 'contain',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                padding: 1,
                                marginLeft: idx > 0 ? '-5px' : '0',
                                zIndex: 2 - idx,
                              }}
                              title={client.name}
                            />
                          ) : null
                        ))}
                      </div>
                    ) : (
                      <FaBuilding style={{ color: '#ff8755', fontSize: '16px' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.5px' }}>
                      Client
                    </div>
                    <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {project.client}
                    </div>
                  </div>
                </div>

                {/* Area Card */}
                <div style={{
                  padding: '16px', backgroundColor: '#f8fafc',
                  borderRadius: '10px', border: '1px solid #f0f0f0',
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '8px',
                    background: '#fff5f0', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaRulerCombined style={{ color: '#ff8755', fontSize: '16px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.5px' }}>
                      Area
                    </div>
                    <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>
                      {project.area}
                    </div>
                  </div>
                </div>

                {/* Timeline Card */}
                <div style={{
                  padding: '16px', backgroundColor: '#f8fafc',
                  borderRadius: '10px', border: '1px solid #f0f0f0',
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '8px',
                    background: '#fff5f0', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaCalendarAlt style={{ color: '#ff8755', fontSize: '16px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.5px' }}>
                      Timeline
                    </div>
                    <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>
                      {project.timeline}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scope of Work */}
              <div style={{
                padding: '20px', backgroundColor: '#fff5f0',
                borderRadius: '10px', border: '1px solid #ffd5c2',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '8px',
                    background: '#ff8755', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FaClipboardList style={{ color: '#ffffff', fontSize: '14px' }} />
                  </div>
                  <h4 style={{ fontWeight: 'bold', color: '#2a2a75', fontSize: '15px', margin: 0 }}>
                    Scope of Work
                  </h4>
                </div>
                <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                  {project.scope}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Projects */}
      <section 
        style={{ padding: '60px 16px 80px', backgroundColor: '#f9fafb' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a2a75', marginBottom: '8px' }}>
            More <span style={{ color: '#ff8755' }}>Projects</span>
          </h2>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#ff8755', marginBottom: '32px' }}></div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '20px',
          }}>
            {visibleProjects.map((proj) => (
              <div key={proj.id} style={{ position: 'relative' }}>
                {viewedProjects.includes(proj.id) && (
                  <div style={{
                    position: 'absolute', top: '8px', right: '8px', zIndex: 3,
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '3px 10px', backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white', borderRadius: '20px', fontSize: '10px',
                    fontWeight: '500',
                  }}>
                    <FaEye style={{ fontSize: '10px' }} /> Viewed
                  </div>
                )}
                <ProjectCard project={proj} type={projectType} />
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}

export default ProjectDetail