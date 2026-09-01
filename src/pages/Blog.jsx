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

  // Filter and Sort: Featured article / Newest first, then all remaining latest articles
  const filteredBlogs = [...BlogDB]
    .filter(b => {
      if (b.status !== 'published') return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          b.title.toLowerCase().includes(query) ||
          (b.excerpt && b.excerpt.toLowerCase().includes(query)) ||
          (b.tags && b.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(query)))
        );
      }
      return true;
    })
    .sort((a, b) => {
      // 1. Explicit featured flag takes priority
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // 2. Newest blog (by createdAt or publishDate) comes first
      const timeA = new Date(a.createdAt || a.publishDate || 0).getTime();
      const timeB = new Date(b.createdAt || b.publishDate || 0).getTime();
      return timeB - timeA;
    });

  const featuredArticle = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const latestArticles = !searchQuery 
    ? filteredBlogs.slice(1, visibleCount + 1) 
    : filteredBlogs.slice(0, visibleCount);

  const totalRemainingCount = !searchQuery ? Math.max(0, filteredBlogs.length - 1) : filteredBlogs.length;
  const hasMore = visibleCount < totalRemainingCount;

  const handleShowAll = () => {
    setVisibleCount(totalRemainingCount);
  };

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
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Pislinfra Infrastructure & Construction Insights Blog",
      "description": "Comprehensive engineering, warehousing, logistics, and EPC construction insights published by Pislinfra.",
      "numberOfItems": filteredBlogs.length,
      "itemListElement": filteredBlogs.map((b, idx) => {
        const rawImg = b.featuredImage || b.image || '/images/hero/Blog.png';
        const absoluteImage = rawImg.startsWith('http') ? rawImg : `https://pislinfra.com${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
        return {
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "BlogPosting",
            "headline": b.title,
            "name": b.title,
            "description": b.excerpt,
            "image": {
              "@type": "ImageObject",
              "url": absoluteImage,
              "contentUrl": absoluteImage,
              "name": b.title,
              "author": {
                "@type": "Organization",
                "name": "Pragati Infra Solutions Pvt. Ltd."
              }
            },
            "datePublished": b.publishDate,
            "author": {
              "@type": "Organization",
              "name": b.authorName || "Pislinfra Team"
            },
            "url": `https://pislinfra.com/blog/${b.slug}`
          }
        };
      })
    }
  };

  if (loading) return <Preloader />;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      
      <BlogSEO blog={seoData} />

      <PageHero 
        title={searchQuery ? `Search: "${searchQuery}"` : (blogPage?.heroTitle || "Blog")} 
        subtitle={searchQuery ? `${filteredBlogs.length} results found` : (blogPage?.heroSubtitle || "Insights, news & updates from Pislinfra")} 
        breadcrumb={blogPage?.heroBreadcrumb || "Blog"} 
        bgImage={blogPage?.heroImage?.url ? (blogPage.heroImage.url.startsWith('http') ? blogPage.heroImage.url : `${blogPage.heroImage.url}`) : "/images/hero/Blog.png"} 
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
              {!searchQuery && featuredArticle && <FeaturedArticleSection article={featuredArticle} />}
              <LatestArticlesSection articles={latestArticles} />
              
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
                      padding: '12px 32px',
                      backgroundColor: '#FF6B00',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(255, 107, 0, 0.25)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E55F00';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FF6B00';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Load More Articles
                  </button>
                </div>
              )}
            </div>

            <div className="blog-sidebar-wrapper">
              <BlogSidebarSection blogs={filteredBlogs} />
            </div>

          </div>
        </div>
      </section>

      <style>{`
        .blog-layout {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .blog-main-content {
          width: 100%;
        }

        .blog-sidebar-wrapper {
          width: 100%;
        }

        @media (min-width: 1024px) {
          .blog-layout {
            flex-direction: row;
            gap: 32px;
          }

          .blog-main-content {
            width: 70%;
          }

          .blog-sidebar-wrapper {
            width: 30%;
          }
        }

        @media (min-width: 1200px) {
          .blog-layout {
            gap: 40px;
          }

          .blog-main-content {
            width: 72%;
          }

          .blog-sidebar-wrapper {
            width: 28%;
          }
        }
      `}</style>

    </div>
  );
};

export default Blog;