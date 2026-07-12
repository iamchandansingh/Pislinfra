import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder } from 'lucide-react';
import BlogDB from '../../data/BlogDB';

const BlogSidebarSection = () => {
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

  const recentPosts = [...BlogDB]
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, 5)
    .map(blog => ({
      id: blog.id,
      title: blog.title,
      date: new Date(blog.publishDate).toLocaleDateString('en-US', {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
      image: blog.featuredImage,
      slug: blog.slug,
    }));

  const categoryCounts = {};
  BlogDB.forEach(blog => {
    if (blog.category) {
      categoryCounts[blog.category] = (categoryCounts[blog.category] || 0) + 1;
    }
  });

  const categories = Object.entries(categoryCounts).map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    count,
  }));

  return (
    <aside className="blog-sidebar">
      
      {/* Recent Posts Card */}
      <div className="sidebar-card">
        <h3 className="sidebar-heading">Recent Posts</h3>
        
        <div className="recent-posts-list">
          {recentPosts.length > 0 ? recentPosts.map((post, index) => (
            <div
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className={`recent-post-item ${index === recentPosts.length - 1 ? 'last-item' : ''}`}
            >
              <div
                className="recent-post-image"
                style={{
                  backgroundImage: `url(${post.image})`,
                }}
              />
              <div className="recent-post-content">
                <h4 className="recent-post-title">{post.title}</h4>
                <p className="recent-post-date">{post.date}</p>
              </div>
            </div>
          )) : (
            <p className="no-posts-text">No posts yet</p>
          )}
        </div>
      </div>

      {/* Categories Card */}
      {categories.length > 0 && (
        <div className="sidebar-card">
          <h3 className="sidebar-heading">Categories</h3>
          
          <div className="categories-list">
            {categories.map((category, index) => (
              <div
                key={category.id}
                onClick={() => navigate(`/blog?category=${encodeURIComponent(category.name)}`)}
                className={`category-item ${index === categories.length - 1 ? 'last-item' : ''}`}
              >
                <div className="category-name">
                  <Folder size={13} color="#FF6B35" />
                  <span>{category.name}</span>
                </div>
                <span className="category-count">
                  {String(category.count).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        /* ===== BASE (Mobile First) ===== */
        .blog-sidebar {
          width: 100%;
          max-width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex-shrink: 0;
          position: static;
        }

        .sidebar-card {
          background-color: #FFFFFF;
          border: 1px solid #E5EAF2;
          border-radius: 10px;
          padding: 16px;
          box-shadow: 0 1px 4px rgba(15,23,42,0.02);
        }

        .sidebar-heading {
          font-size: 18px;
          font-weight: 700;
          color: #1E2A5A;
          margin: 0 0 12px 0;
          font-family: Inter, sans-serif;
          line-height: 1.2;
        }

        /* Recent Posts */
        .recent-posts-list {
          display: flex;
          flex-direction: column;
        }

        .recent-post-item {
          display: flex;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #EEF2F7;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .recent-post-item:hover {
          opacity: 0.8;
        }

        .recent-post-item:first-child {
          padding-top: 0;
        }

        .recent-post-item.last-item {
          border-bottom: none;
          padding-bottom: 0;
        }

        .recent-post-image {
          width: 60px;
          height: 48px;
          min-width: 60px;
          border-radius: 6px;
          overflow: hidden;
          background-color: #F1F5F9;
          background-size: cover;
          background-position: center;
        }

        .recent-post-content {
          flex: 1;
          min-width: 0;
        }

        .recent-post-title {
          font-size: 12px;
          font-weight: 600;
          color: #1E2A5A;
          margin: 0 0 3px 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-family: Inter, sans-serif;
        }

        .recent-post-date {
          font-size: 11px;
          font-weight: 500;
          color: #64748B;
          margin: 0;
          font-family: Inter, sans-serif;
        }

        .no-posts-text {
          font-size: 12px;
          color: #94A3B8;
          font-family: Inter, sans-serif;
          text-align: center;
          padding: 12px 0;
          margin: 0;
        }

        /* Categories */
        .categories-list {
          display: flex;
          flex-direction: column;
        }

        .category-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 38px;
          border-bottom: 1px solid #EEF2F7;
          cursor: pointer;
          color: #475569;
          transition: color 0.2s;
        }

        .category-item:hover {
          color: #FF6B35;
        }

        .category-item.last-item {
          border-bottom: none;
        }

        .category-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .category-name span {
          font-size: 13px;
          font-weight: 500;
          color: inherit;
          font-family: Inter, sans-serif;
        }

        .category-count {
          font-size: 12px;
          font-weight: 600;
          color: #64748B;
          font-family: Inter, sans-serif;
        }


        /* ===== Tablet (640px+) ===== */
        @media (min-width: 640px) {
          .blog-sidebar {
            gap: 20px;
          }

          .sidebar-card {
            padding: 20px;
            border-radius: 12px;
          }

          .sidebar-heading {
            font-size: 20px;
            margin-bottom: 14px;
          }

          .recent-post-image {
            width: 70px;
            height: 52px;
            min-width: 70px;
          }

          .recent-post-title {
            font-size: 13px;
          }
        }


        /* ===== Desktop (1100px+) ===== */
        @media (min-width: 1100px) {
          .blog-sidebar {
            max-width: 320px;
            position: sticky;
            top: 100px;
            gap: 20px;
          }

          .sidebar-heading {
            font-size: 22px;
            margin-bottom: 16px;
          }

          .recent-post-image {
            width: 64px;
            height: 48px;
            min-width: 64px;
          }

          .recent-post-title {
            font-size: 12px;
          }

          .category-item {
            height: 36px;
          }
        }


        /* ===== Large Desktop (1400px+) ===== */
        @media (min-width: 1400px) {
          .blog-sidebar {
            max-width: 360px;
          }

          .sidebar-heading {
            font-size: 24px;
          }

          .recent-post-image {
            width: 72px;
            height: 54px;
            min-width: 72px;
          }

          .recent-post-title {
            font-size: 13px;
          }
        }


        /* ===== Small Mobile (480px) ===== */
        @media (max-width: 480px) {
          .blog-sidebar {
            gap: 12px;
          }

          .sidebar-card {
            padding: 14px;
          }

          .sidebar-heading {
            font-size: 17px;
            margin-bottom: 10px;
          }

          .recent-post-image {
            width: 52px;
            height: 42px;
            min-width: 52px;
          }

          .recent-post-title {
            font-size: 11px;
          }

          .recent-post-date {
            font-size: 10px;
          }

          .category-name span {
            font-size: 12px;
          }
        }
      `}</style>
    </aside>
  );
};

export default BlogSidebarSection;