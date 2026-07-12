import { Link } from 'react-router-dom'
import { HiHome } from 'react-icons/hi'

const PageHero = ({ title, subtitle, breadcrumb, bgImage }) => {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      padding: '60px 16px',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.4)', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(135deg, rgba(42,42,117,0.9) 0%, rgba(0,0,0,0.6) 100%)', zIndex: 1,
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1370px', margin: '0 auto', paddingLeft: '0px', paddingRight: '0px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px', color: '#b3b5ff' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b3b5ff', textDecoration: 'none', transition: 'color 0.3s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff8755'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#b3b5ff'}>
            <HiHome /> Home
          </Link>
          <span style={{ color: '#8888ff' }}>/</span>
          <span style={{ color: '#ff8755', fontWeight: 600 }}>{breadcrumb}</span>
        </div>

        <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'white', marginBottom: subtitle ? '6px' : '0' }}>
          {title}
        </h1>

        {subtitle && (
          <p style={{ color: '#b3b5ff', fontSize: '14px', margin: 0 }}>{subtitle}</p>
        )}
      </div>

      <style>{`
        @media (min-width: 640px) { section { padding: 70px 20px !important; } }
        @media (min-width: 1024px) { section { padding: 80px 24px !important; } }
      `}</style>
    </section>
  )
}

export default PageHero