import React, { useState } from 'react';
import { Search, Folder, Mail } from 'lucide-react';

// Types
interface RecentPost {
  id: number;
  title: string;
  date: string;
  image: string;
}

interface CategoryItem {
  id: string;
  name: string;
  count: number;
}

// Recent Posts Data - Online Images
const recentPosts: RecentPost[] = [
  {
    id: 1,
    title: 'Future of Infrastructure Development in India',
    date: '05 Jun 2026',
    image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 2,
    title: 'Logistics Parks: The Backbone of Supply Chain',
    date: '02 Jun 2026',
    image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 3,
    title: 'Warehouse Automation Trends 2026',
    date: '30 May 2026',
    image: 'https://images.pexels.com/photos/3777190/pexels-photo-3777190.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 4,
    title: 'Safety Standards in Industrial Construction',
    date: '28 May 2026',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 5,
    title: 'Govt Initiatives Boosting Infrastructure Growth',
    date: '26 May 2026',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

// Categories Data
const categories: CategoryItem[] = [
  { id: 'infrastructure', name: 'Infrastructure', count: 12 },
  { id: 'logistics', name: 'Logistics', count: 10 },
  { id: 'warehousing', name: 'Warehousing', count: 8 },
  { id: 'industrial', name: 'Industrial', count: 7 },
  { id: 'safety', name: 'Safety', count: 6 },
  { id: 'government-policy', name: 'Government Policy', count: 5 },
  { id: 'projects', name: 'Projects', count: 9 },
];

// Main Component
const BlogSidebarSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');

  return (
    <aside style={{
      width: '100%',
      maxWidth: '320px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      flexShrink: 0,
      position: 'sticky',
      top: '32px',
    }}
    className="blog-sidebar">
      
      {/* 1. Search + Recent Posts - MERGED */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5EAF2',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 10px rgba(15,23,42,0.03)',
      }}>
        {/* Search */}
        <h3 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#1E2A5A',
          marginBottom: '20px',
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1.2,
        }}>
          Search
        </h3>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs..."
            style={{
              width: '100%',
              height: '44px',
              border: '1px solid #DCE3EC',
              borderRadius: '8px',
              padding: '0 48px 0 14px',
              fontSize: '13px',
              color: '#64748B',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box',
              backgroundColor: '#FFFFFF',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#FF6B35'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#DCE3EC'; }}
          />
          <button
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '44px',
              height: '44px',
              backgroundColor: '#0B1450',
              border: 'none',
              borderRadius: '0 8px 8px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Search"
          >
            <Search size={16} color="#FFFFFF" />
          </button>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: '#EEF2F7',
          marginBottom: '24px',
        }} />

        {/* Recent Posts */}
        <h3 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#1E2A5A',
          marginBottom: '20px',
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1.2,
        }}>
          Recent Posts
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recentPosts.map((post, index) => (
            <div
              key={post.id}
              style={{
                display: 'flex',
                gap: '12px',
                paddingTop: index === 0 ? '0' : '14px',
                paddingBottom: '14px',
                borderBottom: index < recentPosts.length - 1 ? '1px solid #EEF2F7' : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: '72px',
                height: '56px',
                minWidth: '72px',
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: '#F1F5F9',
                backgroundImage: `url(${post.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1E2A5A',
                  margin: '0 0 4px 0',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {post.title}
                </h4>
                <p style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#64748B',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {post.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Categories Widget */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5EAF2',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 10px rgba(15,23,42,0.03)',
      }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#1E2A5A',
          marginBottom: '20px',
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1.2,
        }}>
          Categories
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {categories.map((category, index) => (
            <div
              key={category.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '40px',
                borderBottom: index < categories.length - 1 ? '1px solid #EEF2F7' : 'none',
                cursor: 'pointer',
                color: '#475569',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FF6B35'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Folder size={14} color="#FF6B35" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'inherit', fontFamily: 'Inter, sans-serif' }}>
                  {category.name}
                </span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                {category.count.toString().padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Newsletter Widget */}
      <div style={{
        background: 'linear-gradient(180deg, #0B1450 0%, #182D8C 100%)',
        borderRadius: '12px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: '-20px', right: '-20px',
          width: '120px', height: '120px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10px', right: '10px',
          opacity: 0.08, pointerEvents: 'none',
        }}>
          <Mail size={80} color="#FFFFFF" />
        </div>

        <h3 style={{
          fontSize: '24px', fontWeight: 700, color: '#FFFFFF',
          marginBottom: '12px', fontFamily: 'Inter, sans-serif',
          lineHeight: 1.2, position: 'relative', zIndex: 1,
        }}>
          Subscribe
        </h3>
        <p style={{
          fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)',
          marginBottom: '16px', fontFamily: 'Inter, sans-serif',
          position: 'relative', zIndex: 1,
        }}>
          Get the latest insights delivered to your inbox.
        </p>

        <div style={{ position: 'relative', zIndex: 1, marginBottom: '12px' }}>
          <input
            type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              width: '100%', height: '44px', backgroundColor: '#FFFFFF',
              border: 'none', borderRadius: '8px', padding: '0 14px',
              fontSize: '13px', color: '#1E2A5A', outline: 'none',
              fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          style={{
            width: '100%', height: '44px', backgroundColor: '#FF6B35',
            color: '#FFFFFF', border: 'none', borderRadius: '8px',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
            position: 'relative', zIndex: 1,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F45A22'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FF6B35'; }}
        >
          Subscribe Now
        </button>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .blog-sidebar { max-width: 100% !important; position: static !important; }
        }
      `}</style>
    </aside>
  );
};

export default BlogSidebarSection;