import { Link } from 'react-router-dom'
import { HiHome } from 'react-icons/hi'

const PageHero = ({ title, subtitle, breadcrumb, bgImage }) => {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      padding: '80px 16px',
      overflow: 'hidden',
    }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.4)',
        zIndex: 0,
      }}></div>

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(42,42,117,0.9) 0%, rgba(0,0,0,0.6) 100%)',
        zIndex: 1,
      }}></div>

      {/* Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 2, 
        maxWidth: '1300px', 
        margin: '0 auto',
        paddingLeft: '0px',
        paddingRight: '0px',
      }}>
        
        {/* Breadcrumb */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '20px', 
          fontSize: '14px', 
          color: '#b3b5ff' 
        }}>
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            color: '#b3b5ff', 
            textDecoration: 'none',
            transition: 'color 0.3s'
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff8755'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#b3b5ff'}
          >
            <HiHome /> Home
          </Link>
          <span style={{ color: '#8888ff' }}>/</span>
          <span style={{ color: '#ff8755' }}>{breadcrumb}</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: subtitle ? '8px' : '0',
        }}>
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p style={{ color: '#b3b5ff', fontSize: '16px', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

export default PageHero