import React from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiChevronRight } from 'react-icons/fi';

const BlogHero = ({
  category = 'INFRASTRUCTURE INSIGHTS',
  title = 'Future of Infrastructure Development in India',
  excerpt = "Exploring key trends, opportunities and innovations shaping India's infrastructure future.",
  coverImage = '/blog/default-cover.png',
}) => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#081B4B',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Background Layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ height: '100%', width: '100%' }}
        >
          <img
            src={coverImage}
            alt={title}
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            loading="eager"
          />
        </motion.div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(8,27,75,0.75) 0%, rgba(8,27,75,0.85) 50%, rgba(8,27,75,0.98) 100%)',
        }} />
      </div>

      {/* Content Container */}
      <div className="blog-hero-content" style={{
        position: 'relative',
        zIndex: 10,
        margin: '0 auto',
        display: 'flex',
        height: '100%',
        width: '100%',
        maxWidth: '1370px',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        minHeight: '350px',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingBottom: '48px',
        boxSizing: 'border-box',
      }}>
        
        {/* Breadcrumb */}
        <motion.nav
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingTop: '24px',
            marginBottom: 'auto',
          }}
          aria-label="Breadcrumb"
        >
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >
            <FiHome size={13} />
            <span>Home</span>
          </a>
          <FiChevronRight size={13} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
          <a
            href="/blog"
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >
            Blog
          </a>
          <FiChevronRight size={13} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
          <span style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.8)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '200px',
          }}>
            {title}
          </span>
        </motion.nav>

        {/* Category Badge */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUpVariants}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            width: 'fit-content',
            borderRadius: '9999px',
            backgroundColor: '#FF6B00',
            padding: '8px 16px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#FFFFFF',
          }}>
            {category}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          style={{
            marginTop: '20px',
            maxWidth: '900px',
            fontSize: '26px',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.01em',
            color: '#FFFFFF',
            margin: '20px 0 0 0',
          }}
        >
          {title}
        </motion.h1>

        {/* Excerpt */}
        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          style={{
            marginTop: '12px',
            maxWidth: '672px',
            fontSize: '15px',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.65)',
            margin: '12px 0 0 0',
          }}
        >
          {excerpt}
        </motion.p>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .blog-hero-content {
            min-height: 260px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-bottom: 32px !important;
          }
          .blog-hero-content nav {
            gap: 6px !important;
            padding-top: 16px !important;
          }
          .blog-hero-content nav a,
          .blog-hero-content nav span {
            font-size: 11px !important;
          }
          .blog-hero-content nav span:last-child {
            max-width: 100px !important;
          }
          .blog-hero-content h1 {
            font-size: 20px !important;
            margin-top: 14px !important;
          }
          .blog-hero-content p {
            font-size: 12px !important;
            margin-top: 8px !important;
            line-height: 1.5 !important;
          }
          .blog-hero-content span[style*="background-color: #FF6B00"] {
            padding: 6px 12px !important;
            font-size: 9px !important;
          }
        }

        @media (max-width: 400px) {
          .blog-hero-content {
            min-height: 220px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
            padding-bottom: 24px !important;
          }
          .blog-hero-content h1 {
            font-size: 18px !important;
            margin-top: 10px !important;
          }
          .blog-hero-content p {
            font-size: 11px !important;
          }
          .blog-hero-content nav span:last-child {
            max-width: 70px !important;
          }
        }

        @media (min-width: 640px) {
          .blog-hero-content {
            min-height: 420px !important;
            padding-bottom: 64px !important;
          }
        }

        @media (min-width: 1024px) {
          .blog-hero-content {
            min-height: 500px !important;
            padding-bottom: 80px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default BlogHero;