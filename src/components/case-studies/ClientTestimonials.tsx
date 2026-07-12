import React from 'react';
import { Star, Building2, Users, Repeat } from 'lucide-react';

// Types
interface Testimonial {
  id: number;
  name: string;
  company: string;
  designation: string;
  rating: number;
  text: string;
  image: string;
}

interface StatCard {
  id: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  iconBg: string;
  iconColor: string;
}

// Testimonials Data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Rajesh Mehta',
    company: 'Adani Group',
    designation: 'Project Director',
    rating: 5,
    text: 'PISL Infra delivered our copper smelter project with exceptional quality and precision. Their team\'s dedication to timelines and safety standards exceeded our expectations.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 2,
    name: 'Anita Sharma',
    company: 'Reliance Industries',
    designation: 'VP - Infrastructure',
    rating: 5,
    text: 'Working with PISL on our solar manufacturing facility was a great experience. Their technical expertise and project management capabilities are truly world-class.',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 3,
    name: 'Vikram Patel',
    company: 'Tata Projects',
    designation: 'Chief Engineer',
    rating: 5,
    text: 'The warehouse project was completed ahead of schedule with outstanding quality. PISL\'s attention to detail and proactive communication made all the difference.',
    image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 4,
    name: 'Priya Nair',
    company: 'JSW Steel',
    designation: 'Head - Projects',
    rating: 5,
    text: 'PISL Infra demonstrated exceptional capability in handling complex industrial construction. Their safety record and quality standards are commendable.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 5,
    name: 'Suresh Kumar',
    company: 'AMNS India',
    designation: 'General Manager',
    rating: 5,
    text: 'From foundation to finish, PISL delivered our steel plant expansion with remarkable efficiency. A truly reliable infrastructure partner.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 6,
    name: 'Deepika Reddy',
    company: 'DP World',
    designation: 'Regional Director',
    rating: 5,
    text: 'Our logistics park project required precision execution and PISL delivered beyond expectations. Highly recommended for large-scale infrastructure projects.',
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

// Stats Data
const statsData: StatCard[] = [
  {
    id: 'satisfaction',
    icon: <Star size={28} />,
    value: '98%',
    label: 'Client Satisfaction',
    iconBg: '#FFF4EC',
    iconColor: '#FF6B35',
  },
  {
    id: 'projects',
    icon: <Building2 size={28} />,
    value: '500+',
    label: 'Projects Delivered',
    iconBg: '#EEF4FF',
    iconColor: '#2563EB',
  },
  {
    id: 'repeat',
    icon: <Repeat size={28} />,
    value: '85%',
    label: 'Repeat Client Rate',
    iconBg: '#ECFDF3',
    iconColor: '#16A34A',
  },
];

// Star Rating Component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          color={i < rating ? '#F59E0B' : '#E5E7EB'}
          fill={i < rating ? '#F59E0B' : '#E5E7EB'}
        />
      ))}
    </div>
  );
};

// Main Component
const ClientTestimonials = () => {
  return (
    <section style={{ width: '100%', padding: '80px 0', backgroundColor: '#FFFFFF' }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: 700,
            color: '#FF6B35',
            backgroundColor: '#FFF4EC',
            padding: '6px 16px',
            borderRadius: '999px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '16px',
            fontFamily: 'Inter, sans-serif',
          }}>
            Client Feedback
          </span>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 44px)',
            fontWeight: 800,
            color: '#1E2A5A',
            margin: '0 0 12px 0',
            fontFamily: 'Inter, sans-serif',
          }}>
            What Our{' '}
            <span style={{ color: '#FF6B35' }}>Clients Say</span>
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#64748B',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
            fontFamily: 'Inter, sans-serif',
          }}>
            Real feedback from clients across industrial, logistics and infrastructure projects 
            who trust us with their most critical developments.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '24px',
          marginBottom: '48px',
        }}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="testimonial-card"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(229, 234, 242, 0.6)',
                borderRadius: '16px',
                padding: '32px 28px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(15,23,42,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,23,42,0.04)';
                e.currentTarget.style.borderColor = 'rgba(229, 234, 242, 0.6)';
              }}
            >
              {/* Decorative Quote */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '20px',
                fontSize: '80px',
                fontWeight: 800,
                color: 'rgba(255, 107, 53, 0.06)',
                fontFamily: 'Georgia, serif',
                lineHeight: 1,
                pointerEvents: 'none',
              }}>
                "
              </div>

              {/* Top - Photo + Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '16px',
              }}>
                {/* Photo */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  minWidth: '56px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #FFF4EC',
                  backgroundImage: `url(${testimonial.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#F1F5F9',
                }} />

                {/* Name + Company */}
                <div style={{ minWidth: 0 }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1E2A5A',
                    margin: '0 0 2px 0',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {testimonial.name}
                  </h4>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#64748B',
                    margin: '0 0 4px 0',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {testimonial.company}
                  </p>
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>

              {/* Designation */}
              <p style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#FF6B35',
                margin: '0 0 14px 0',
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {testimonial.designation}
              </p>

              {/* Testimonial Text */}
              <p style={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.8,
                color: '#475569',
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                fontStyle: 'italic',
              }}>
                "{testimonial.text}"
              </p>

              {/* Bottom Decorative Line */}
              <div style={{
                width: '40px',
                height: '3px',
                backgroundColor: '#FF6B35',
                borderRadius: '999px',
                marginTop: '16px',
                opacity: 0.5,
              }} />
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '20px',
          maxWidth: '900px',
          margin: '0 auto',
        }}
        className="stats-grid">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5EAF2',
                borderRadius: '14px',
                padding: '28px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 10px rgba(15,23,42,0.03)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(15,23,42,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(15,23,42,0.03)';
              }}
            >
              {/* Icon */}
              <div style={{
                width: '60px',
                height: '60px',
                minWidth: '60px',
                borderRadius: '16px',
                backgroundColor: stat.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ color: stat.iconColor, display: 'flex', lineHeight: 0 }}>
                  {stat.icon}
                </span>
              </div>

              {/* Content */}
              <div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#1E2A5A',
                  lineHeight: 1,
                  marginBottom: '4px',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {stat.value}
                </div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#64748B',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Responsive */}
      <style>{`
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 24px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 20px;
        }
        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 768px) {
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1100px) {
          .testimonials-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </section>
  );
};

export default ClientTestimonials;