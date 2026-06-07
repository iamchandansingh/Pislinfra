import React from 'react';
import { ArrowRight, Bookmark } from 'lucide-react';

// Types
interface Article {
  id: number;
  category: string;
  title: string;
  date: string;
  description: string;
  image: string;
  badgeBg: string;
  badgeColor: string;
}

// Articles Data
const articles: Article[] = [
  {
    id: 1,
    category: 'Infrastructure',
    title: 'Future of Infrastructure Development in India',
    date: '05 Jun 2026',
    description: 'Exploring the latest trends and technologies shaping the infrastructure sector.',
    image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600',
    badgeBg: '#EEF4FF',
    badgeColor: '#2563EB',
  },
  {
    id: 2,
    category: 'Logistics',
    title: 'Logistics Parks: Backbone of Supply Chain',
    date: '02 Jun 2026',
    description: 'Understanding the growing importance of modern logistics infrastructure.',
    image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600',
    badgeBg: '#FFF4EC',
    badgeColor: '#FF6B35',
  },
  {
    id: 3,
    category: 'Warehousing',
    title: 'Warehouse Automation Trends 2026',
    date: '30 May 2026',
    description: 'Latest automation technologies transforming warehouse operations.',
    image: 'https://images.pexels.com/photos/3777190/pexels-photo-3777190.jpeg?auto=compress&cs=tinysrgb&w=600',
    badgeBg: '#ECFDF3',
    badgeColor: '#16A34A',
  },
  {
    id: 4,
    category: 'Industrial',
    title: 'Industrial Corridor Expansion Opportunities',
    date: '28 May 2026',
    description: 'New industrial corridors creating investment opportunities across regions.',
    image: 'https://images.pexels.com/photos/159306/pexels-photo-159306.jpeg?auto=compress&cs=tinysrgb&w=600',
    badgeBg: '#FFF7ED',
    badgeColor: '#EA580C',
  },
  {
    id: 5,
    category: 'Safety',
    title: 'Modern Safety Standards in Construction',
    date: '25 May 2026',
    description: 'Ensuring workplace safety through modern protocols and equipment.',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    badgeBg: '#FEF2F2',
    badgeColor: '#DC2626',
  },
  {
    id: 6,
    category: 'Projects',
    title: 'Major Infrastructure Projects to Watch',
    date: '22 May 2026',
    description: 'Upcoming mega infrastructure projects transforming India\'s landscape.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600',
    badgeBg: '#F3F0FF',
    badgeColor: '#7C3AED',
  },
];

// Main Component
const LatestArticlesSection: React.FC = () => {
  return (
    <div style={{ width: '100%', marginTop: '40px' }}>
      
      {/* Section Header */}
      <h2 style={{
        fontSize: '40px',
        fontWeight: 700,
        lineHeight: 1.2,
        color: '#1E2A5A',
        fontFamily: 'Inter, sans-serif',
        marginBottom: '28px',
      }}>
        Latest Articles
      </h2>

      {/* Articles Grid - 3 Columns */}
      <div className="articles-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
      }}>
        {articles.map((article) => (
          <div
            key={article.id}
            className="article-card"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5EAF2',
              borderRadius: '14px',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 10px rgba(15,23,42,0.03)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(15,23,42,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(15,23,42,0.03)';
            }}
          >
            {/* TOP - Image */}
            <div style={{
              height: '200px',
              backgroundImage: `url(${article.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#F1F5F9',
              flexShrink: 0,
            }} />

            {/* BOTTOM - Content */}
            <div style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}>
              
              {/* Row 1 - Badge LEFT + Date RIGHT */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}>
                {/* Category Badge - LEFT */}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '26px',
                  padding: '0 12px',
                  backgroundColor: '#0B1450',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {article.category}
                </span>

                {/* Date - RIGHT */}
                <span style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#64748B',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {article.date}
                </span>
              </div>

              {/* Row 2 - Title */}
              <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#1E2A5A',
                lineHeight: 1.4,
                marginBottom: '10px',
                fontFamily: 'Inter, sans-serif',
              }}>
                {article.title}
              </h3>

              {/* Row 3 - Description */}
              <p style={{
                fontSize: '13px',
                fontWeight: 400,
                lineHeight: 1.7,
                color: '#64748B',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '16px',
                flex: 1,
              }}>
                {article.description}
              </p>

              {/* Row 4 - Read More + Bookmark */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto',
              }}>
                <a
                  href="#"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#FF6B35',
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    textDecoration: 'none',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  Read More
                  <ArrowRight size={14} />
                </a>

                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FF6B35';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94A3B8';
                  }}
                  aria-label="Bookmark article"
                >
                  <Bookmark size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Responsive */}
      <style>{`
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .articles-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .articles-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default LatestArticlesSection;