import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BlogDB from '../../data/BlogDB';

const FeaturedArticleSection = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const latestBlog = [...BlogDB]
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))[0];

  if (!latestBlog) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="featured-article-wrapper">
      
      {/* Section Heading */}
      <h2 className="featured-heading">Featured Article</h2>

      {/* Featured Card */}
      <div 
        className="featured-card"
        onClick={() => navigate(`/blog/${latestBlog.slug}`)}
      >
        
        {/* Content Side */}
        <div className="featured-content">
          
          {/* Meta Row */}
          <div className="featured-meta">
            <span className="featured-category">
              {latestBlog.category}
            </span>
            <span className="featured-date">
              {formatDate(latestBlog.publishDate)}
            </span>
          </div>

          {/* Title */}
          <h3 className="featured-title">
            {latestBlog.title}
          </h3>

          {/* Excerpt */}
          <p className="featured-excerpt">
            {latestBlog.excerpt}
          </p>

          {/* Read More Link */}
          <span className="featured-read-more">
            Read Article
            <ArrowRight size={16} />
          </span>

        </div>

        {/* Image Side */}
        <div 
          className="featured-image"
          style={{
            backgroundImage: `url(${latestBlog.featuredImage})`,
          }}
        />

      </div>

      {/* Responsive Styles */}
      <style>{`
        /* ===== BASE (Mobile First) ===== */
        .featured-article-wrapper {
          width: 100%;
          margin-top: 0;
          margin-bottom: 24px;
        }

        .featured-heading {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
          color: #1E2A5A;
          font-family: Inter, sans-serif;
          margin: 0 0 14px 0;
          text-align: left;
          padding-left: 0;
        }

        .featured-card {
          display: flex;
          flex-direction: column;
          background-color: #FFFFFF;
          border: 1px solid #E5EAF2;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 1px 6px rgba(15,23,42,0.03);
          cursor: pointer;
          transition: box-shadow 0.2s, transform 0.2s;
        }

        .featured-card:hover {
          box-shadow: 0 4px 16px rgba(15,23,42,0.08);
          transform: translateY(-2px);
        }

        /* Image - Top on Mobile */
        .featured-image {
          width: 100%;
          height: 200px;
          background-size: cover;
          background-position: center;
          background-color: #1E2A5A;
          order: -1;
        }

        /* Content */
        .featured-content {
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
        }

        .featured-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .featured-category {
          display: inline-flex;
          align-items: center;
          height: 24px;
          padding: 0 10px;
          background-color: #0B1450;
          color: #FFFFFF;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .featured-date {
          font-size: 12px;
          font-weight: 500;
          color: #64748B;
          font-family: Inter, sans-serif;
        }

        .featured-title {
          font-size: 20px;
          font-weight: 700;
          line-height: 1.3;
          color: #1E2A5A;
          font-family: Inter, sans-serif;
          margin: 12px 0 0 0;
        }

        .featured-excerpt {
          font-size: 13px;
          font-weight: 400;
          line-height: 1.6;
          color: #64748B;
          font-family: Inter, sans-serif;
          margin: 8px 0 0 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .featured-read-more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #FF6B35;
          font-size: 13px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          text-decoration: none;
          margin-top: 14px;
          align-self: flex-start;
          transition: transform 0.2s;
        }

        .featured-read-more:hover {
          transform: translateX(4px);
        }


        /* ===== Tablet (640px+) ===== */
        @media (min-width: 640px) {
          .featured-heading {
            font-size: 24px;
            margin-bottom: 16px;
          }

          .featured-card {
            border-radius: 12px;
          }

          .featured-image {
            height: 240px;
          }

          .featured-content {
            padding: 24px 20px;
          }

          .featured-category {
            height: 26px;
            padding: 0 12px;
            font-size: 11px;
          }

          .featured-date {
            font-size: 13px;
          }

          .featured-title {
            font-size: 22px;
            margin-top: 14px;
          }

          .featured-excerpt {
            font-size: 14px;
            margin-top: 10px;
          }

          .featured-read-more {
            font-size: 14px;
            margin-top: 16px;
          }
        }


        /* ===== Desktop (900px+) ===== */
        @media (min-width: 900px) {
          .featured-heading {
            font-size: 28px;
            margin-bottom: 20px;
          }

          .featured-card {
            display: grid;
            grid-template-columns: 1fr 1fr;
            flex-direction: row;
            height: 360px;
          }

          /* Image on Right side for Desktop */
          .featured-image {
            height: 100%;
            min-height: 250px;
            order: 0;
          }

          .featured-content {
            padding: 32px;
            justify-content: center;
          }

          .featured-title {
            font-size: 24px;
            margin-top: 16px;
          }

          .featured-excerpt {
            margin-top: 12px;
          }

          .featured-read-more {
            margin-top: 20px;
          }
        }


        /* ===== Large Desktop (1200px+) ===== */
        @media (min-width: 1200px) {
          .featured-card {
            height: 380px;
          }

          .featured-content {
            padding: 40px;
          }

          .featured-title {
            font-size: 26px;
          }

          .featured-image {
            min-height: 300px;
          }
        }


        /* ===== Small Mobile (480px) ===== */
        @media (max-width: 480px) {
          .featured-heading {
            font-size: 20px;
            margin-bottom: 12px;
          }

          .featured-card {
            border-radius: 8px;
          }

          .featured-image {
            height: 180px;
          }

          .featured-content {
            padding: 16px 14px;
          }

          .featured-meta {
            gap: 8px;
          }

          .featured-category {
            height: 22px;
            padding: 0 8px;
            font-size: 9px;
          }

          .featured-date {
            font-size: 11px;
          }

          .featured-title {
            font-size: 18px;
            margin-top: 10px;
          }

          .featured-excerpt {
            font-size: 12px;
            line-height: 1.5;
            -webkit-line-clamp: 2;
          }

          .featured-read-more {
            font-size: 12px;
            margin-top: 12px;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default FeaturedArticleSection;