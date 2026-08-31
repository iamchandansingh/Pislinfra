import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BlogDB from '../../data/BlogDB';

const LatestArticlesSection = ({ articles: inputArticles }) => {
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

  const articles = (inputArticles || []).map(blog => ({
      id: blog.id,
      category: blog.category,
      title: blog.title,
      date: new Date(blog.publishDate).toLocaleDateString('en-US', {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
      description: blog.excerpt,
      image: blog.featuredImage,
      badgeBg: '#EEF4FF',
      badgeColor: '#2563EB',
      slug: blog.slug
    }));

  if (articles.length === 0) {
    return (
      <div className="no-articles-wrapper">
        <p className="no-articles-text">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="latest-articles-wrapper">
      
      {/* Section Heading */}
      <h2 className="latest-heading">Latest Articles</h2>

      {/* Articles Grid */}
      <div className="articles-grid">
        {articles.map((article) => (
          <div
            key={article.id}
            className="article-card"
            onClick={() => navigate(`/blog/${article.slug}`)}
          >
            {/* Image */}
            <div
              className="article-image"
              style={{
                backgroundImage: `url(${article.image})`,
              }}
            />

            {/* Content */}
            <div className="article-content">
              
              {/* Meta Row */}
              <div className="article-meta">
                <span className="article-category">
                  {article.category}
                </span>
                <span className="article-date">
                  {article.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="article-title">
                {article.title}
              </h3>

              {/* Description */}
              <p className="article-description">
                {article.description}
              </p>

              {/* Read More */}
              <div className="article-read-more-wrapper">
                <span className="article-read-more">
                  Read More
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Responsive Styles */}
      <style>{`
        /* ===== BASE (Mobile First) ===== */
        .latest-articles-wrapper {
          width: 100%;
          margin-top: 20px;
        }

        .latest-heading {
          font-size: 20px;
          font-weight: 700;
          line-height: 1.2;
          color: #1E2A5A;
          font-family: Inter, sans-serif;
          margin: 0 0 12px 0;
          text-align: left;
          padding-left: 0;
        }

        .no-articles-wrapper {
          width: 100%;
          margin-top: 20px;
          text-align: center;
          padding: 20px 16px;
        }

        .no-articles-text {
          font-size: 13px;
          color: #64748B;
          font-family: Inter, sans-serif;
        }

        /* Grid */
        .articles-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        /* Card */
        .article-card {
          background-color: #FFFFFF;
          border: 1px solid #E5EAF2;
          border-radius: 10px;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          box-shadow: 0 1px 4px rgba(15,23,42,0.02);
          cursor: pointer;
        }

        .article-card:active {
          transform: scale(0.98);
        }

        /* Image */
        .article-image {
          height: 160px;
          background-size: cover;
          background-position: center;
          background-color: #F1F5F9;
          flex-shrink: 0;
        }

        /* Content */
        .article-content {
          padding: 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .article-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          flex-wrap: wrap;
          gap: 6px;
        }

        .article-category {
          display: inline-flex;
          align-items: center;
          height: 20px;
          padding: 0 8px;
          background-color: #0B1450;
          color: #FFFFFF;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .article-date {
          font-size: 10px;
          font-weight: 500;
          color: #64748B;
          font-family: Inter, sans-serif;
        }

        .article-title {
          font-size: 15px;
          font-weight: 700;
          color: #1E2A5A;
          line-height: 1.3;
          margin: 0 0 5px 0;
          font-family: Inter, sans-serif;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .article-description {
          font-size: 11px;
          font-weight: 400;
          line-height: 1.5;
          color: #64748B;
          font-family: Inter, sans-serif;
          margin: 0 0 8px 0;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .article-read-more-wrapper {
          display: flex;
          align-items: center;
          margin-top: auto;
        }

        .article-read-more {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #FF6B35;
          font-size: 11px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          text-decoration: none;
          transition: transform 0.2s;
        }

        .article-read-more:hover {
          transform: translateX(3px);
        }


        /* ===== Tablet (640px+) ===== */
        @media (min-width: 640px) {
          .latest-heading {
            font-size: 22px;
            margin-bottom: 14px;
          }

          .articles-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }

          .article-card {
            border-radius: 12px;
          }

          .article-image {
            height: 170px;
          }

          .article-content {
            padding: 14px;
          }

          .article-category {
            height: 22px;
            padding: 0 10px;
            font-size: 10px;
          }

          .article-date {
            font-size: 11px;
          }

          .article-title {
            font-size: 16px;
            margin-bottom: 6px;
          }

          .article-description {
            font-size: 12px;
            line-height: 1.6;
          }

          .article-read-more {
            font-size: 12px;
          }
        }


        /* ===== Desktop (1024px+) ===== */
        @media (min-width: 1024px) {
          .latest-heading {
            font-size: 24px;
            margin-bottom: 16px;
          }

          .articles-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }

          .article-card {
            border-radius: 14px;
          }

          .article-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(15,23,42,0.05);
          }

          .article-card:active {
            transform: translateY(-4px) scale(0.99);
          }

          .article-image {
            height: 160px;
          }

          .article-content {
            padding: 14px;
          }

          .article-category {
            height: 22px;
            padding: 0 10px;
            font-size: 10px;
          }

          .article-title {
            font-size: 15px;
          }

          .article-description {
            font-size: 11px;
          }

          .article-read-more {
            font-size: 11px;
          }
        }


        /* ===== Large Desktop (1200px+) ===== */
        @media (min-width: 1200px) {
          .articles-grid {
            gap: 18px;
          }

          .article-image {
            height: 175px;
          }

          .article-content {
            padding: 16px;
          }

          .article-category {
            height: 24px;
            padding: 0 12px;
            font-size: 10px;
          }

          .article-date {
            font-size: 11px;
          }

          .article-title {
            font-size: 16px;
            margin-bottom: 8px;
          }

          .article-description {
            font-size: 12px;
          }

          .article-read-more {
            font-size: 12px;
            gap: 5px;
          }
        }


        /* ===== Small Mobile (480px) ===== */
        @media (max-width: 480px) {
          .latest-heading {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .articles-grid {
            gap: 10px;
          }

          .article-card {
            border-radius: 8px;
          }

          .article-image {
            height: 140px;
          }

          .article-content {
            padding: 10px;
          }

          .article-category {
            height: 18px;
            padding: 0 6px;
            font-size: 8px;
          }

          .article-date {
            font-size: 9px;
          }

          .article-title {
            font-size: 14px;
            -webkit-line-clamp: 2;
          }

          .article-description {
            font-size: 10px;
            -webkit-line-clamp: 2;
          }

          .article-read-more {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default LatestArticlesSection;