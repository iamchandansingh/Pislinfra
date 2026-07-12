import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogDB from '../data/BlogDB';
import BlogHero from '../components/BlogDetail/BlogHero';
import BlogContent from '../components/BlogDetail/BlogContent';
import BlogSidebar from '../components/BlogDetail/BlogSidebar';
import RelatedSection from '../components/BlogDetail/RelatedSection';
import BlogSEO from '../components/Blog/BlogSEO';

const DEFAULT_IMAGE = '/images/hero/Completed-Projects.png';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const blog = BlogDB.find(b => b.slug === slug);
  const [pdfContent, setPdfContent] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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
    const blocks = typeof content === 'string' ? content.split('\n\n') : content;
    const headings = [];
    blocks.forEach((block) => {
      const str = typeof block === 'string' ? block.trim() : block.content || '';
      if (/^\d+\.\s/.test(str)) {
        const text = str.replace(/^\d+\.\s/, '');
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        headings.push({ id, text });
      }
      if (!/^\d+\.\s/.test(str) && !str.includes('**') && !str.includes('|') && !/^Q\d+\./i.test(str) && str.length < 100 && !str.startsWith('[')) {
        const words = str.split(' ');
        if (words.length <= 8 && words.every(w => w[0] === w[0]?.toUpperCase())) {
          const id = str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          headings.push({ id, text: str });
        }
      }
    });
    return headings;
  };

  const relatedBlogs = BlogDB
    .filter(b => b.category === blog.category && b.slug !== blog.slug)
    .slice(0, 4)
    .map(b => ({
      id: b.id, title: b.title, slug: b.slug, category: b.category,
      excerpt: b.excerpt, publishDate: b.publishDate, readTime: b.readTime,
      image: b.featuredImage || DEFAULT_IMAGE,
    }));

  const headings = extractHeadings(blog.content);

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
                faq={blog.faqSchema?.map(f => ({
                  question: f.question,
                  answer: f.answer,
                }))}
                onContentReady={(cleanText) => setPdfContent(cleanText)}
              />
            </div>

            {/* Sidebar - Right on Desktop, Bottom on Mobile */}
            <div className="blog-detail-sidebar">
              <BlogSidebar
                headings={headings}
                author={{
                  name: blog.author?.name || 'PISL Editorial Team',
                  avatar: blog.author?.avatar || DEFAULT_IMAGE,
                  designation: 'Infrastructure Experts',
                  bio: blog.author?.bio || 'Industry-leading infrastructure development professionals.',
                  linkedin: 'https://www.linkedin.com/company/pisl',
                  email: 'info@pislinfra.com',
                }}
                latestBlogs={relatedBlogs}
                contactInfo={{
                  phone: '082870 40111',
                  email: 'info@pislinfra.com',
                }}
                blogTitle={blog.title}
                blogContent={pdfContent || blog.content}
              />
            </div>
          </div>
        </div>

        <RelatedSection relatedBlogs={relatedBlogs} />
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