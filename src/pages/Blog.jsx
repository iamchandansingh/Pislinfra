import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHero from '../components/hero/PageHero';
import BlogSEO from '../components/Blog/BlogSEO';
import FeaturedArticleSection from '../components/Blog/FeaturedArticleSection';
import LatestArticlesSection from '../components/Blog/LatestArticlesSection';
import BlogSidebarSection from '../components/Blog/BlogSidebarSection';
import { useBlogs } from '../context/BlogContext';
import { getImageUrl } from '../utils/imageUrl';
import { getPreviewContext } from '../services/wordpress';
import { sortBlogsByDateDesc } from '../utils/formatBlog';
import Preloader from '../components/common/Preloader';

const ITEMS_PER_PAGE = 6;

const Blog = () => {
  const { blogs: BlogDB, blogPage, loading, refreshBlogs } = useBlogs();
  const isPreview = Boolean(getPreviewContext());
  
  const [searchParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isMobile, setIsMobile] = useState(false);
  
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    if (isPreview) {
      refreshBlogs();
    }
  }, [isPreview, refreshBlogs]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter published blogs and sort chronologically (newest first)
  const matchingBlogs = [...BlogDB]
    .filter(b => {
      const status = (b.status || 'published').toLowerCase();
      if (status !== 'published') return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          (b.title || '').toLowerCase().includes(query) ||
          (b.excerpt && b.excerpt.toLowerCase().includes(query)) ||
          (b.tags && b.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(query)))
        );
      }
      return true;
    })
    .sort(sortBlogsByDateDesc);

  // Latest published blog always takes the top Featured slot; previous ones shift down into Latest Articles
  const featuredArticle = matchingBlogs[0] || null;
  const remainingBlogs = matchingBlogs.slice(1);

  // Ordered list used for SEO structured data (newest first)
  const filteredBlogs = matchingBlogs;

  const latestArticles = !searchQuery
    ? remainingBlogs.slice(0, visibleCount)
    : matchingBlogs.slice(0, visibleCount);

  const totalRemainingCount = !searchQuery ? remainingBlogs.length : matchingBlogs.length;
  const hasMore = visibleCount < totalRemainingCount;

  const handleShowAll = () => {
    setVisibleCount(totalRemainingCount);
  };

  const fallbackTitle = "Construction & Infrastructure Insights | Pislinfra";
  const fallbackDescription = "Explore Pislinfra's latest insights on construction, infrastructure, engineering, project management, industry trends and innovative solutions.";
  const fallbackPrimaryKeyword = "Construction & Infrastructure Insights";
  const fallbackFocusKeywords = "Construction & Infrastructure Insights, infrastructure blog, construction insights, warehouse design, industrial development, logistics, project management, Pislinfra";

  // Connect CMS Blog page SEO fields (metaTitle, metaDescription, primaryKeyword, focusKeywords)
  // Safely falls back to existing SEO component or default metadata if fields are empty
  const resolvedTitle = searchQuery 
    ? `Search: "${searchQuery}" - Blog | Pislinfra` 
    : (blogPage?.metaTitle || blogPage?.seo?.seoTitle || fallbackTitle).trim();
  const resolvedDescription = searchQuery 
    ? `${filteredBlogs.length} results found for "${searchQuery}"` 
    : (blogPage?.metaDescription || blogPage?.seo?.seoDescription || fallbackDescription).trim();
  const resolvedPrimaryKeyword = (blogPage?.primaryKeyword || blogPage?.seo?.primaryKeyword || fallbackPrimaryKeyword).trim();
  const resolvedFocusKeywords = (blogPage?.focusKeywords || blogPage?.seo?.focusKeywords || fallbackFocusKeywords).trim();

  const seoData = {
    contentType: 'blog',
    slug: '',
    canonicalUrl: 'https://pislinfra.com/blog',
    ogType: 'website',
    twitterCardType: 'summary_large_image',
    schemaType: 'Blog',
    breadcrumbSchema: true,
    organizationSchema: true,
    ...(blogPage?.seo || {}),
    title: 'Blog',
    articleSection: 'Blog',
    seoTitle: resolvedTitle,
    seoDescription: resolvedDescription,
    primaryKeyword: resolvedPrimaryKeyword,
    focusKeywords: resolvedFocusKeywords,
    seoKeywords: blogPage?.seo?.seoKeywords || resolvedFocusKeywords,
    ogTitle: searchQuery ? `Search: "${searchQuery}" - Blog | Pislinfra` : (blogPage?.ogTitle || blogPage?.seo?.ogTitle || resolvedTitle),
    ogDescription: searchQuery ? `${filteredBlogs.length} results found for "${searchQuery}"` : (blogPage?.ogDescription || blogPage?.seo?.ogDescription || resolvedDescription),
    ogImage: getImageUrl(blogPage?.seo?.ogImage || blogPage?.heroImage, 'https://pislinfra.com/images/hero/Blog.png'),
    twitterTitle: searchQuery ? `Search: "${searchQuery}" - Blog | Pislinfra` : (blogPage?.twitterTitle || blogPage?.seo?.twitterTitle || resolvedTitle),
    twitterDescription: searchQuery ? `${filteredBlogs.length} results found for "${searchQuery}"` : (blogPage?.twitterDescription || blogPage?.seo?.twitterDescription || resolvedDescription),
    twitterImage: getImageUrl(blogPage?.seo?.twitterImage || blogPage?.heroImage, 'https://pislinfra.com/images/hero/Blog.png'),
    tags: ['Blog', 'Infrastructure', 'Construction', 'Insights', 'News'],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Pislinfra Infrastructure & Construction Insights Blog",
      "description": "Comprehensive engineering, warehousing, logistics, and EPC construction insights published by Pislinfra.",
      "numberOfItems": filteredBlogs.length,
      "itemListElement": filteredBlogs.map((b, idx) => {
        const rawImg = b.featuredImage || b.image || '/images/hero/Blog.png';
        const resolvedRawImg = getImageUrl(rawImg, '/images/hero/Blog.png');
        const absoluteImage = resolvedRawImg.startsWith('http') ? resolvedRawImg : `https://pislinfra.com${resolvedRawImg.startsWith('/') ? '' : '/'}${resolvedRawImg}`;
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
              "name": b.author || b.authorName || "Pislinfra Team"
            },
            "url": `https://pislinfra.com/blog/${b.slug}`
          }
        };
      })
    }
  };

  if (loading) return <Preloader />;

  const showSidebar = blogPage?.showSidebar !== false;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      
      <BlogSEO blog={seoData} />

      {blogPage?.showHero !== false && (
        <PageHero 
          title={searchQuery ? `Search: "${searchQuery}"` : (blogPage?.heroTitle || "Blog")} 
          subtitle={searchQuery ? `${filteredBlogs.length} results found` : (blogPage?.heroSubtitle || "Insights, news & updates from Pislinfra")} 
          breadcrumb={blogPage?.heroBreadcrumb || "Blog"} 
          bgImage={getImageUrl(blogPage?.heroImage, "/images/hero/Blog.png")} 
        />
      )}

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
            
            <div className={`blog-main-content${showSidebar ? '' : ' full-width'}`}>
              {blogPage?.showFeatured !== false && !searchQuery && featuredArticle && (
                <FeaturedArticleSection article={featuredArticle} />
              )}
              {blogPage?.showLatest !== false && (
                <>
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
                </>
              )}
            </div>

            {showSidebar && (
              <div className="blog-sidebar-wrapper">
                <BlogSidebarSection blogs={filteredBlogs} />
              </div>
            )}

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

          .blog-main-content.full-width {
            width: 100%;
          }
        }
      `}</style>

    </div>
  );
};

export default Blog;