import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHero from '../components/hero/PageHero';
import BlogSEO from '../components/Blog/BlogSEO';
import FeaturedArticleSection from '../components/Blog/FeaturedArticleSection';
import LatestArticlesSection from '../components/Blog/LatestArticlesSection';
import BlogSidebarSection from '../components/Blog/BlogSidebarSection';
import { useBlogs } from '../context/BlogContext';
import Preloader from '../components/common/Preloader';



const ITEMS_PER_PAGE = 6;

const Blog = () => {
  const { blogs: BlogDB, blogPage, loading } = useBlogs();
  
  const [searchParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isMobile, setIsMobile] = useState(false);
  
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredBlogs = BlogDB.filter(b => {
    if (b.status !== 'published') return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(query) ||
        b.excerpt.toLowerCase().includes(query) ||
        b.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const seoData = {
    contentType: 'blog',
    title: 'Blog',
    articleSection: 'Blog',
    seoTitle: searchQuery ? `Search: "${searchQuery}" - Blog | Pislinfra` : 'Infrastructure Insights, News & Updates | Pislinfra Blog',
    seoDescription: searchQuery ? `${filteredBlogs.length} results found for "${searchQuery}"` : 'Read expert insights on industrial infrastructure, construction trends, warehousing innovations, and project management from Pislinfra.',
    seoKeywords: 'infrastructure blog, construction insights, warehouse design, industrial development, logistics, project management, Pislinfra',
    slug: '',
    canonicalUrl: 'https://pislinfra.com/blog',
    ogTitle: 'Pislinfra Blog - Infrastructure Insights & Updates',
    ogDescription: 'Expert insights on industrial infrastructure, construction trends & warehousing innovations.',
    ogImage: 'https://pislinfra.com/images/hero/Blog.png',
    ogType: 'website',
    twitterTitle: 'Pislinfra Blog - Infrastructure Insights',
    twitterDescription: 'Read the latest on industrial construction & infrastructure development.',
    twitterImage: 'https://pislinfra.com/images/hero/Blog.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'Blog',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Blog', 'Infrastructure', 'Construction', 'Insights', 'News'],
  };

  const hasMore = visibleCount < filteredBlogs.length;

  const handleShowAll = () => {
    setVisibleCount(filteredBlogs.length);
  };

  if (loading) return <Preloader />;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      
      <BlogSEO blog={seoData} />

      <PageHero 
        title={searchQuery ? `Search: "${searchQuery}"` : (blogPage?.heroTitle || "Blog")} 
        subtitle={searchQuery ? `${filteredBlogs.length} results found` : (blogPage?.heroSubtitle || "Insights, news & updates from PISL INFRA")} 
        breadcrumb={blogPage?.heroBreadcrumb || "Blog"} 
        bgImage={blogPage?.heroImage?.url ? (blogPage.heroImage.url.startsWith('http') ? blogPage.heroImage.url : `http://localhost:1337${blogPage.heroImage.url}`) : "/images/hero/Blog.png"} 
      />

      <div style={{ height: isMobile ? '16px' : '32px', backgroundColor: 'white' }} />

      <section style={{ 
        padding: isMobile ? '0 0 40px' : '0 0 80px', 
        backgroundColor: 'white' 
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          paddingLeft: isMobile ? '12px' : '16px', 
          paddingRight: isMobile ? '12px' : '16px' 
        }}>
          <div className="blog-layout">
            
            <div className="blog-main-content">
              {!searchQuery && filteredBlogs.length > 0 && <FeaturedArticleSection article={filteredBlogs[0]} />}
              <LatestArticlesSection articles={filteredBlogs.slice(!searchQuery ? 1 : 0, visibleCount + (!searchQuery ? 1 : 0))} />
              
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: isMobile ? '24px' : '40px' }}>
                  <button
                    onClick={handleShowAll}
                    className="show-all-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: isMobile ? '10px 24px' : '12px 32px',
                      backgroundColor: '#FF6B35',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: isMobile ? '14px' : '15px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s ease',
                      width: isMobile ? '100%' : 'auto',
                      maxWidth: isMobile ? '320px' : 'none',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E55A00'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FF6B35'; }}
                  >
                    Show All Articles ({filteredBlogs.length})
                  </button>
                </div>
              )}

              {filteredBlogs.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: isMobile ? '40px 20px' : '60px 20px',
                }}>
                  <h3 style={{
                    fontSize: isMobile ? '18px' : '22px',
                    fontWeight: 600,
                    color: '#1E2A5A',
                    marginBottom: '8px',
                  }}>
                    No articles found
                  </h3>
                  <p style={{
                    fontSize: isMobile ? '13px' : '15px',
                    color: '#64748B',
                    margin: 0,
                  }}>
                    Try adjusting your search terms or browse all articles.
                  </p>
                </div>
              )}
            </div>

            <div className="blog-sidebar-wrapper">
              <BlogSidebarSection />
            </div>

          </div>
        </div>
      </section>

      <style>{`
        .blog-layout { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: flex-start; }
        .blog-main-content { min-width: 0; }
        .blog-sidebar-wrapper { max-width: 100%; }
        @media (min-width: 768px) { .blog-layout { gap: 32px; } }
        @media (min-width: 1100px) {
          .blog-layout { grid-template-columns: 1fr 320px; gap: 40px; }
          .blog-sidebar-wrapper { max-width: 320px; position: sticky; top: 100px; }
        }
        @media (min-width: 1400px) {
          .blog-layout { grid-template-columns: 1fr 360px; gap: 48px; }
          .blog-sidebar-wrapper { max-width: 360px; }
        }
        .show-all-btn:hover { background-color: #E55A00 !important; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default Blog;