import React from 'react'
import PageHero from '../components/hero/PageHero'
import FeaturedArticleSection from '../components/Blog/FeaturedArticleSection'
import LatestArticlesSection from '../components/Blog/LatestArticlesSection'
import BlogSidebarSection from '../components/Blog/BlogSidebarSection'
import BlogPaginationSection from '../components/Blog/BlogPaginationSection'

const Blog = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Hero */}
      <PageHero 
        title="Blog" 
        subtitle="Insights, news & updates from PISL INFRA" 
        breadcrumb="Blog" 
        bgImage="/images/hero/Blog.png" 
      />

      {/* Gap after Hero */}
      <div style={{ height: '32px', backgroundColor: 'white' }} />

      {/* Main Content */}
      <section style={{ padding: '0 0 80px', backgroundColor: 'white' }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          paddingLeft: '16px', 
          paddingRight: '16px' 
        }}>
          <div className="blog-layout" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 320px', 
            gap: '40px', 
            alignItems: 'flex-start',
          }}>
            
            {/* Left Content */}
            <div style={{ minWidth: 0 }}>
              <FeaturedArticleSection />
              <LatestArticlesSection />
              <BlogPaginationSection />
            </div>

            {/* Right Sidebar */}
            <div className="blog-sidebar-wrapper">
              <BlogSidebarSection />
            </div>

          </div>
        </div>
      </section>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1100px) {
          .blog-layout {
            grid-template-columns: 1fr !important;
          }
          .blog-sidebar-wrapper {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Blog