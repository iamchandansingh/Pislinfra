import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { HiMenuAlt3, HiX, HiChevronDown, HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi'
import { FaBuilding, FaUsers, FaShieldAlt, FaAward, FaHeart } from 'react-icons/fa'

const navigationData = [
  { id: 'home', label: 'Home', href: '/' },
  { 
    id: 'about', label: 'About Us', href: '/about',
    children: [
      { id: 'overview', label: 'Overview / Profile', href: '/about', icon: FaBuilding },
      { id: 'leadership', label: 'Leadership', href: '/about/leadership', icon: FaUsers },
      { id: 'ehs', label: 'EHS', href: '/about/ehs', icon: FaShieldAlt },
      { id: 'awards', label: 'Awards & Certification', href: '/about/awards', icon: FaAward },
      { id: 'csr', label: 'CSR', href: '/about/csr', icon: FaHeart },
      { id: 'safety', label: 'Safety', href: '/about/safety', icon: FaShieldAlt }
    ]
  },
  { 
    id: 'projects', label: 'Projects', href: '/projects',
    children: [
      { id: 'ongoing', label: 'Ongoing Projects', href: '/projects/ongoing', icon: FaBuilding },
      { id: 'completed', label: 'Completed Projects', href: '/projects/completed', icon: FaBuilding },
      { id: 'casestudy', label: 'Case Study', href: '/projects/case-study', icon: FaBuilding }
    ]
  },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'blog', label: 'Blog', href: '/blog' },
  { id: 'careers', label: 'Careers', href: '/careers' },
]

const TypewriterTagline = () => {
  const fullText = 'Progressive Innovative Sustainable Limitless'
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex))
        currentIndex++
      } else {
        currentIndex = 0
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <span style={{ fontSize: '15px', color: '#ff8d4b', fontWeight: '600', letterSpacing: '0.5px', display: 'none' }} className="tagline">
      {displayText}
      <span style={{ display: 'inline-block', width: '2px', height: '16px', background: '#ff8d4b', marginLeft: '2px', verticalAlign: 'middle', animation: 'blink 0.6s infinite' }} />
      <style>{`@keyframes blink { 0%,50%{opacity:1} 51%,100%{opacity:0} }`}</style>
    </span>
  )
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    setIsMobileOpen(false)
    setOpenMobileDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileOpen])

  const activeColor = '#ff8d4b'
  const navy = '#28286e'

  return (
    <>
      {/* TOP HEADER BAR */}
      <div style={{ backgroundColor: navy, color: 'white', fontSize: '13px', display: 'none' }} className="md-header">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 auto' }}>
              <HiLocationMarker style={{ color: activeColor, flexShrink: 0, fontSize: '16px' }} />
              <span style={{ lineHeight: '1.4' }}>31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122018</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
              <a href="tel:+918527040411" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', textDecoration: 'none', whiteSpace: 'nowrap' }}><HiPhone style={{ color: activeColor, fontSize: '14px' }} />085270 40411</a>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <a href="mailto:info@pislinfra.com" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', textDecoration: 'none', whiteSpace: 'nowrap' }}><HiMail style={{ color: activeColor, fontSize: '14px' }} />info@pislinfra.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'white', boxShadow: isScrolled ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none', transition: 'box-shadow 0.3s' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}>
              <img src="/logo.png" alt="PISL INFRA" style={{ height: '45px', width: 'auto' }} />
              <TypewriterTagline />
            </Link>

            {/* DESKTOP MENU */}
            <div style={{ display: 'none', alignItems: 'center', gap: '4px' }} className="lg-menu">
              {navigationData.map((item) => (
                <div key={item.id} style={{ position: 'relative' }} onMouseEnter={() => item.children && setOpenDropdown(item.id)} onMouseLeave={() => setOpenDropdown(null)}>
                  {item.children ? (
                    <>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', fontSize: '14px', fontWeight: '500', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'color 0.3s', backgroundColor: 'transparent', color: openDropdown === item.id ? activeColor : '#374151' }}>
                        {item.label}<HiChevronDown style={{ fontSize: '12px', transform: openDropdown === item.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                      </button>
                      {openDropdown === item.id && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', width: '260px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6', padding: '8px 0', zIndex: 50 }}>
                          {item.children.map((child) => (
                            <Link key={child.id} to={child.href} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', fontSize: '14px', color: '#4b5563', textDecoration: 'none', transition: 'all 0.3s', borderRadius: '8px', margin: '0 4px' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = activeColor; e.currentTarget.style.backgroundColor = '#fff5f0' }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                              {child.icon && <child.icon style={{ fontSize: '16px', color: activeColor }} />}{child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink to={item.href} end={item.href === '/'} style={({ isActive }) => ({ padding: '8px 12px', fontSize: '14px', fontWeight: '500', borderRadius: '8px', textDecoration: 'none', backgroundColor: 'transparent', color: isActive ? activeColor : '#374151' })}>
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}
              
              {/* CONTACT US BUTTON */}
              <Link to="/contact-us" style={{
                marginLeft: '12px',
                padding: '10px 22px',
                backgroundColor: navy,
                color: '#FFFFFF',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = activeColor; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = navy; e.currentTarget.style.transform = 'translateY(0)'; }}>
                Contact Us
              </Link>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} style={{ padding: '8px', color: '#374151', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', marginLeft: 'auto' }} className="lg-menu-btn">
              {isMobileOpen ? <HiX style={{ fontSize: '24px' }} /> : <HiMenuAlt3 style={{ fontSize: '24px' }} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileOpen && (
          <div style={{ position: 'fixed', inset: 0, top: '64px', zIndex: 40 }} className="lg-menu-container">
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setIsMobileOpen(false)} />
            <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '320px', maxWidth: '100%', backgroundColor: 'white', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflowY: 'auto' }}>
              <div style={{ backgroundColor: navy, color: 'white', padding: '16px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}><HiLocationMarker style={{ flexShrink: 0, marginTop: '2px' }} /><span>31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122018</span></div>
                <a href="tel:+918527040411" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', textDecoration: 'none', marginBottom: '8px' }}><HiPhone /> 085270 40411</a>
                <a href="mailto:info@pislinfra.com" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', textDecoration: 'none' }}><HiMail /> info@pislinfra.com</a>
              </div>
              <div style={{ padding: '16px' }}>
                {navigationData.map((item) => (
                  <div key={item.id}>
                    {item.children ? (
                      <>
                        <button onClick={() => setOpenMobileDropdown(openMobileDropdown === item.id ? null : item.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: openMobileDropdown === item.id ? activeColor : '#374151', border: 'none', backgroundColor: openMobileDropdown === item.id ? '#fff5f0' : 'transparent', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.3s' }}>{item.label}<HiChevronDown style={{ fontSize: '14px', transform: openMobileDropdown === item.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} /></button>
                        {openMobileDropdown === item.id && (
                          <div style={{ marginLeft: '16px', borderLeft: `2px solid ${activeColor}30`, paddingLeft: '12px', paddingTop: '4px', paddingBottom: '4px' }}>
                            {item.children.map((child) => (<Link key={child.id} to={child.href} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', fontSize: '14px', color: '#4b5563', textDecoration: 'none', borderRadius: '8px', transition: 'all 0.3s' }}>{child.icon && <child.icon style={{ fontSize: '14px', color: activeColor }} />}{child.label}</Link>))}
                          </div>
                        )}
                      </>
                    ) : (
                      <NavLink to={item.href} end={item.href === '/'} style={({ isActive }) => ({ display: 'block', padding: '12px 16px', fontSize: '14px', fontWeight: '500', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.3s', backgroundColor: isActive ? '#fff5f0' : 'transparent', color: isActive ? activeColor : '#374151' })}>{item.label}</NavLink>
                    )}
                  </div>
                ))}
                {/* MOBILE CONTACT US BUTTON */}
                <Link to="/contact-us" style={{
                  display: 'block', marginTop: '12px', padding: '12px 16px',
                  backgroundColor: navy, color: '#FFFFFF', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '600', textDecoration: 'none', textAlign: 'center',
                }}>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @media (min-width: 768px) { .md-header { display: block !important; } .tagline { display: inline !important; } }
          @media (max-width: 1023px) { .lg-menu { display: none !important; } }
          @media (min-width: 1024px) { .lg-menu { display: flex !important; } .lg-menu-btn { display: none !important; } .lg-menu-container { display: none !important; } }
        `}</style>
      </nav>
    </>
  )
}

export default Navbar