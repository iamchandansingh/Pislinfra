import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import BlogHero from '../components/BlogDetail/BlogHero';
import BlogContent from '../components/BlogDetail/BlogContent';
import BlogSidebar from '../components/BlogDetail/BlogSidebar';
import RelatedSection from '../components/BlogDetail/RelatedSection';
import BlogSEO from '../components/Blog/BlogSEO';
import { useBlogs } from '../context/BlogContext';
import { fetchStrapiData } from '../services/strapi';
import { formatStrapiBlogs } from '../utils/formatBlog';
import Preloader from '../components/common/Preloader';

const DEFAULT_IMAGE = '/images/hero/Completed-Projects.png';

const BlogDetail = () => {
  const { blogs: BlogDB, loading: contextLoading } = useBlogs();
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [directBlog, setDirectBlog] = useState(null);
  const [directLoading, setDirectLoading] = useState(false);
  const [hasAttemptedDirect, setHasAttemptedDirect] = useState(false);
  const [pdfContent, setPdfContent] = useState('');

  const blog = BlogDB.find(b => b.slug === slug) || directBlog;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // If blog is not in initial batch, fetch directly by slug from Strapi before 404
  useEffect(() => {
    if (!blog && !contextLoading && !hasAttemptedDirect) {
      setDirectLoading(true);
      setHasAttemptedDirect(true);
      fetchStrapiData(`blogs?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`)
        .then(res => {
          if (res && res.length > 0) {
            const formatted = formatStrapiBlogs(res);
            if (formatted.length > 0) {
              setDirectBlog(formatted[0]);
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          setDirectLoading(false);
        });
    }
  }, [slug, blog, contextLoading, hasAttemptedDirect]);

  // Show Preloader while data is loading (Never show flash of 404)
  if (contextLoading || directLoading) {
    return <Preloader />;
  }

  if (!blog) {
    return (
      <div style={{
        display: 'flex', minHeight: '60vh', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 20px',
        textAlign: 'center', fontFamily: 'Inter, sans-serif',
      }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#081B4B', margin: 0 }}>404</h1>
        <p style={{ fontSize: '18px', color: '#64748B', marginTop: '16px' }}>Blog post not found</p>
        <button onClick={() => navigate('/blog')} style={{
          marginTop: '24px', borderRadius: '12px', backgroundColor: '#FF6B00',
          padding: '12px 24px', fontSize: '14px', fontWeight: 700, color: '#FFFFFF',
          border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>Back to Blogs</button>
      </div>
    );
  }

  const extractHeadings = (content) => {
    if (!content) return [];
    const normalized = typeof content === 'string' ? content.replace(/\r\n/g, '\n') : '';
    const lines = normalized.split('\n');
    const headings = [];
    const seen = new Set();

    lines.forEach((line) => {
      const str = line.trim();
      if (!str) return;

      // 1. Markdown headings (#, ##, ###)
      const hashMatch = str.match(/^(#{1,6})\s+(.+)$/);
      if (hashMatch) {
        const text = hashMatch[2].replace(/\*\*/g, '').trim();
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        if (text && !seen.has(id)) {
          seen.add(id);
          headings.push({ id, text });
        }
        return;
      }

      // 2. Numbered headings (1. Heading)
      if (/^\d+\.\s/.test(str)) {
        const text = str.replace(/^\d+\.\s/, '').replace(/\*\*/g, '').trim();
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        if (text && !seen.has(id)) {
          seen.add(id);
          headings.push({ id, text });
        }
        return;
      }

      // 3. Capitalized short headings
      if (!str.includes('**') && !str.includes('|') && !/^Q\d+\./i.test(str) && str.length < 90 && !str.startsWith('[') && !str.startsWith('![')) {
        const words = str.split(' ');
        if (words.length >= 2 && words.length <= 8 && words.every(w => w[0] === w[0]?.toUpperCase())) {
          const id = str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          if (!seen.has(id)) {
            seen.add(id);
            headings.push({ id, text: str });
          }
        }
      }
    });
    return headings;
  };

  // Smart 2-Tier Related Posts Engine (Guarantees 4 related articles at bottom)
  const sameCategoryBlogs = [...BlogDB]
    .filter(b => b.status === 'published' && b.slug !== blog.slug && b.category && blog.category && b.category.toLowerCase() === blog.category.toLowerCase())
    .sort((a, b) => new Date(b.publishDate || b.createdAt || 0) - new Date(a.publishDate || a.createdAt || 0));

  const otherBlogs = [...BlogDB]
    .filter(b => b.status === 'published' && b.slug !== blog.slug && !sameCategoryBlogs.some(s => s.slug === b.slug))
    .sort((a, b) => new Date(b.publishDate || b.createdAt || 0) - new Date(a.publishDate || a.createdAt || 0));

  const combinedRelated = [...sameCategoryBlogs, ...otherBlogs].slice(0, 4);

  const relatedBlogs = combinedRelated.map(b => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    category: b.category || 'Infrastructure',
    excerpt: b.excerpt,
    publishDate: b.publishDate || b.createdAt,
    readTime: b.readTime || '5 min read',
    image: b.featuredImage || b.image || DEFAULT_IMAGE,
  }));

  const headings = extractHeadings(blog.content);

  // Safe FAQ parser (supports JSON array or string)
  const parsedFaq = Array.isArray(blog.faqSchema) 
    ? blog.faqSchema.map(f => ({ question: f.question, answer: f.answer }))
    : (typeof blog.faqSchema === 'string' ? (() => {
        try {
          const parsed = JSON.parse(blog.faqSchema);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      })() : []);

  const authorDisplayName = typeof blog.author === 'string' 
    ? blog.author 
    : (blog.author?.name || 'Pislinfra Editorial Team');

  return (
    <>
      <BlogSEO blog={blog} />
      
      <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
        
        <BlogHero
          category={blog.category}
          title={blog.title}
          excerpt={blog.excerpt}
          coverImage={blog.featuredImage || DEFAULT_IMAGE}
        />

        <div style={{ margin: '0 auto', width: '100%', maxWidth: '1370px', padding: '0 20px', boxSizing: 'border-box' }}>
          <div className="blog-detail-layout">
            
            {/* Content - Left on Desktop, Top on Mobile */}
            <div className="blog-detail-content">
              <BlogContent
                content={blog.content}
                images={blog.galleryImages?.map((img, i) => ({
                  src: img || DEFAULT_IMAGE,
                  alt: blog.imageAlt || `${blog.title} - Image ${i + 1}`,
                }))}
                faq={parsedFaq}
                onContentReady={(cleanText) => setPdfContent(cleanText)}
              />
            </div>

            {/* Sidebar - Right on Desktop, Bottom on Mobile */}
            <div className="blog-detail-sidebar">
              <BlogSidebar
                headings={headings}
                author={{
                  name: authorDisplayName,
                  avatar: (typeof blog.author === 'object' && blog.author?.avatar) ? blog.author.avatar : DEFAULT_IMAGE,
                  designation: 'Infrastructure Experts',
                  bio: (typeof blog.author === 'object' && blog.author?.bio) ? blog.author.bio : 'Industry-leading infrastructure development professionals.',
                  linkedin: 'https://www.linkedin.com/company/pislinfra/',
                  email: 'info@pislinfra.com',
                }}
                latestBlogs={relatedBlogs}
                contactInfo={{
                  phone: '085270 40411',
                  email: 'info@pislinfra.com',
                }}
                blogTitle={blog.title}
                blogContent={pdfContent || blog.content}
              />
            </div>
          </div>
        </div>

        {/* ALWAYS SHOW RELATED POSTS AT BOTTOM */}
        {relatedBlogs.length > 0 && (
          <RelatedSection relatedBlogs={relatedBlogs} />
        )}
      </div>

      <style>{`
        /* Mobile First - Stack vertically */
        .blog-detail-layout {
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: flex-start;
        }

        .blog-detail-content {
          width: 100%;
          padding-top: 24px;
        }

        .blog-detail-sidebar {
          width: 100%;
        }

        /* Desktop - Side by side */
        @media (min-width: 1024px) {
          .blog-detail-layout {
            flex-direction: row;
            gap: 32px;
          }

          .blog-detail-content {
            width: 70%;
            padding-top: 40px;
          }

          .blog-detail-sidebar {
            width: 30%;
            min-width: 300px;
            position: sticky;
            top: 100px;
          }
        }

        @media (min-width: 1200px) {
          .blog-detail-layout {
            gap: 40px;
          }

          .blog-detail-content {
            width: 72%;
          }

          .blog-detail-sidebar {
            width: 28%;
            min-width: 320px;
          }
        }
      `}</style>
    </>
  );
};

export default BlogDetail;