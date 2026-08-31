import { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { fetchStrapiData } from '../../services/strapi'
import Preloader from '../../components/common/Preloader'

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

const slugify = (str) => (str || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const ProjectDetail = () => {
  const { id, type } = useParams()
  const location = useLocation()

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
  const projectIdOrSlug = id || ''

  const localPool = projectType === 'completed' ? completedProjects : projectsData;
  const initialMatch = location.state?.projectData || localPool.find(p => {
    return slugify(p.name) === slugify(projectIdOrSlug) || 
           (p.id && p.id.toString() === projectIdOrSlug.toString()) ||
           slugify(p.name).includes(slugify(projectIdOrSlug)) ||
           slugify(projectIdOrSlug).includes(slugify(p.name));
  });

  const [project, setProject] = useState(initialMatch || null)
  const [allProjects, setAllProjects] = useState(localPool)
  const [loading, setLoading] = useState(initialMatch ? false : true)

  useEffect(() => {
    let isMounted = true;
    
    const fetchUltraFast = async () => {
      let endpoint = projectType === 'completed' ? 'completed-projects' : 'ongoing-projects';
      const isDocumentId = projectIdOrSlug.length >= 20 && !projectIdOrSlug.includes('-');
      let foundFast = false;

      // STEP 1: If it's a documentId, fetch directly
      if (isDocumentId) {
        try {
          const projData = await fetchStrapiData(`${endpoint}/${projectIdOrSlug}?populate=*`);
          if (projData && isMounted) {
            const formatted = {
              id: projData.documentId || projData.id,
              category: projData.category,
              name: projData.name,
              location: projData.location,
              state: projData.state,
              area: projData.area,
              client: projData.client,
              timeline: projData.timeline,
              status: projData.projectStatus || projData.status || (projectType === 'completed' ? 'Completed' : 'Ongoing'),
              scope: projData.scope,
              images: projData.images && projData.images.length > 0 
                ? projData.images.map(img => img.url?.startsWith('http') ? img.url : `http://localhost:1337${img.url}`) 
                : (initialMatch?.images || [])
            };
            setProject(formatted);
            setLoading(false);
            foundFast = true;
          }
        } catch(e) {
          console.warn("Fast fetch failed, falling back to full list search...");
        }
      }

      // STEP 2: Fetch all projects
      try {
        const allData = await fetchStrapiData(`${endpoint}?populate=*&pagination[pageSize]=100&sort=createdAt:asc`);
        
        if (allData && Array.isArray(allData) && allData.length > 0 && isMounted) {
          const formattedAll = allData.map(item => {
            const localFallback = localPool.find(lp => slugify(lp.name) === slugify(item.name)) || {};
            const imgs = item.images && item.images.length > 0 
              ? item.images.map(img => img.url?.startsWith('http') ? img.url : `http://localhost:1337${img.url}`)
              : (localFallback.images || []);

            return {
              id: item.documentId || item.id,
              category: item.category || localFallback.category,
              name: item.name || localFallback.name,
              location: item.location || localFallback.location,
              state: item.state || localFallback.state,
              area: item.area || localFallback.area,
              client: item.client || localFallback.client,
              timeline: item.timeline || localFallback.timeline,
              status: item.projectStatus || item.status || (projectType === 'completed' ? 'Completed' : 'Ongoing'),
              scope: item.scope || localFallback.scope,
              images: imgs.length > 0 ? imgs : (localFallback.images || [fallbackImages[0]])
            };
          });
          
          setAllProjects(formattedAll);
          
          // Search project by slug, documentId, or name
          if (!foundFast) {
            let foundProject = formattedAll.find(p => p.id === projectIdOrSlug || p.documentId === projectIdOrSlug);
            if (!foundProject) {
              foundProject = formattedAll.find(p => {
                 const s = slugify(p.name);
                 const targetS = slugify(projectIdOrSlug);
                 return s === targetS || s.includes(targetS) || targetS.includes(s) || p.id.toString() === projectIdOrSlug;
              });
            }
            
            if (foundProject) {
              setProject(foundProject);
            } else if (initialMatch) {
              setProject(initialMatch);
            }
            setLoading(false);
          }
        } else if (initialMatch && isMounted) {
          setProject(initialMatch);
          setLoading(false);
        } else if (isMounted) {
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (isMounted) {
          if (initialMatch) setProject(initialMatch);
          setLoading(false);
        }
      }
    };

    if (projectIdOrSlug) {
      fetchUltraFast();
    } else {
      setLoading(false);
    }
    
    return () => { isMounted = false; };
  }, [projectIdOrSlug, projectType]);

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


  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projectImages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [isHovered, projectImages.length])

  const visibleProjects = [];
  if (relatedProjects.length > 0) {
    for (let i = 0; i < Math.min(4, relatedProjects.length); i++) {
      visibleProjects.push(relatedProjects[(sliderIndex + i) % relatedProjects.length]);
    }
  }
  if (loading) return <Preloader />;

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
      
      <section className="project-detail-section" style={{ padding: '60px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          <Link to={backUrl} className="back-btn"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              color: '#475569', fontWeight: '600', fontSize: '14px',
              textDecoration: 'none', marginBottom: '32px',
              padding: '8px 16px', backgroundColor: '#f1f5f9',
              borderRadius: '20px', transition: 'all 0.3s'
            }}
          >
            <FaArrowLeft /> Back to {projectType === 'completed' ? 'Completed' : 'Ongoing'} Projects
          </Link>

          <div className="project-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            
            {/* Left - Image Slider with Fade Effect */}
            <div>
              <div className="project-image-slider"
                style={{ 
                  position: 'relative', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid #f0f0f0',
                  borderLeft: '4px solid #ff8755',
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

            <div>
              <h2 className="project-title" style={{ fontSize: '36px', fontWeight: '800', color: '#2a2a75', marginBottom: '24px', lineHeight: '1.2' }}>
                {project.name}
              </h2>

              <div className="project-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                
                {/* Location Card */}
                <div className="info-card" style={{
                  padding: '20px', backgroundColor: '#ffffff',
                  borderRadius: '12px', border: '1px solid #e2e8f0',
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '10px',
                    background: '#fff5f0', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaMapMarkerAlt style={{ color: '#ff8755', fontSize: '18px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>
                      Location
                    </div>
                    <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600', lineHeight: '1.4' }}>
                      {project.location}, {project.state}
                    </div>
                  </div>
                </div>

                {/* Client Card */}
                <div className="info-card" style={{
                  padding: '20px', backgroundColor: '#ffffff',
                  borderRadius: '12px', border: '1px solid #e2e8f0',
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '10px',
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
                                width: 30,
                                height: 30,
                                borderRadius: '6px',
                                objectFit: 'contain',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                padding: 2,
                                marginLeft: idx > 0 ? '-6px' : '0',
                                zIndex: 2 - idx,
                              }}
                              title={client.name}
                            />
                          ) : null
                        ))}
                      </div>
                    ) : (
                      <FaBuilding style={{ color: '#ff8755', fontSize: '18px' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>
                      Client
                    </div>
                    <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {project.client}
                    </div>
                  </div>
                </div>

                {/* Area Card */}
                <div className="info-card" style={{
                  padding: '20px', backgroundColor: '#ffffff',
                  borderRadius: '12px', border: '1px solid #e2e8f0',
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '10px',
                    background: '#fff5f0', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaRulerCombined style={{ color: '#ff8755', fontSize: '18px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>
                      Area
                    </div>
                    <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
                      {project.area}
                    </div>
                  </div>
                </div>

                {/* Timeline Card */}
                <div className="info-card" style={{
                  padding: '20px', backgroundColor: '#ffffff',
                  borderRadius: '12px', border: '1px solid #e2e8f0',
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '10px',
                    background: '#fff5f0', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaCalendarAlt style={{ color: '#ff8755', fontSize: '18px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>
                      Timeline
                    </div>
                    <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
                      {project.timeline}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scope of Work */}
              <div className="scope-card" style={{
                padding: '28px', backgroundColor: '#ffffff',
                borderRadius: '12px', border: '1px solid #e2e8f0',
                borderLeft: '4px solid #ff8755',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '8px',
                    background: '#ff8755', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FaClipboardList style={{ color: '#ffffff', fontSize: '16px' }} />
                  </div>
                  <h4 style={{ fontWeight: '800', color: '#0f172a', fontSize: '18px', margin: 0 }}>
                    Scope of Work
                  </h4>
                </div>
                <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
                  {project.scope}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Projects */}
      <section 
        className="more-projects-section"
        style={{ padding: '60px 16px 80px', backgroundColor: '#f9fafb' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '40px'
          }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#2a2a75', margin: 0 }}>
              More Projects
            </h2>
          </div>

          <div className="more-projects-grid" style={{ 
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
                <ProjectCard project={proj || {}} type={projectType} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Responsive Styles */}
      <style>{`
        .back-btn:hover {
          background-color: #e2e8f0 !important;
          color: #1e293b !important;
        }
        
        @media (max-width: 768px) {
          .project-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .project-image-slider {
            height: 280px !important;
          }
          .project-title {
            font-size: 28px !important;
          }
          .project-info-grid {
            grid-template-columns: 1fr !important;
          }
          .more-projects-grid {
            grid-template-columns: repeat(1, 1fr) !important;
          }
          .project-detail-section {
            padding: 40px 16px !important;
          }
          .more-projects-section {
            padding: 40px 16px 60px !important;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .more-projects-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 400px) {
          .project-detail-section {
            padding: 32px 12px !important;
          }
          .more-projects-section {
            padding: 32px 12px 48px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ProjectDetail