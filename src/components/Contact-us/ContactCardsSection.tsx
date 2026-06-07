import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

// Types
interface ContactCardData {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  primaryText: string;
  secondaryText: string;
  href?: string;
}

// Contact Cards Data
const contactCards: ContactCardData[] = [
  {
    id: 'call',
    title: 'Call Us',
    icon: <Phone size={22} />,
    iconBg: '#FFF3EC',
    iconColor: '#FF6B35',
    primaryText: '082870 40111',
    secondaryText: 'Mon - Sat 9:00 AM - 6:00 PM',
    href: 'tel:08287040111',
  },
  {
    id: 'email',
    title: 'Email Us',
    icon: <Mail size={22} />,
    iconBg: '#EEF4FF',
    iconColor: '#2563EB',
    primaryText: 'info@pislinfra.com',
    secondaryText: 'We reply within 24 hours',
    href: 'mailto:info@pislinfra.com',
  },
  {
    id: 'visit',
    title: 'Visit Us',
    icon: <MapPin size={22} />,
    iconBg: '#EEFDF3',
    iconColor: '#22C55E',
    primaryText: '3rd Floor, Plot No 18, Maruti Kunj, Sec 28, Gurugram Haryana 122018',
    secondaryText: '',
    href: 'https://maps.google.com/?q=3rd+Floor+Plot+No+18+Maruti+Kunj+Sec+28+Gurugram+Haryana+122018',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    icon: <MessageCircle size={22} />,
    iconBg: '#EEFDF3',
    iconColor: '#22C55E',
    primaryText: '+91 82870 40111',
    secondaryText: 'Chat with our team',
    href: 'https://wa.me/918287040111',
  },
];

// Individual Contact Card
const ContactCard: React.FC<{ card: ContactCardData }> = ({ card }) => {
  const isLink = Boolean(card.href);
  const Component = isLink ? 'a' : 'div';
  const linkProps = isLink
    ? {
        href: card.href,
        target: card.id !== 'call' && card.id !== 'email' ? '_blank' : undefined,
        rel: card.id !== 'call' && card.id !== 'email' ? 'noopener noreferrer' : undefined,
      }
    : {};

  return (
    <Component
      {...linkProps}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        textDecoration: 'none',
        color: 'inherit',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        padding: '16px 20px',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
        transition: 'all 0.3s ease',
        cursor: isLink ? 'pointer' : 'default',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(15, 23, 42, 0.08)';
        e.currentTarget.style.borderColor = '#D1D5DB';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.04)';
        e.currentTarget.style.borderColor = '#E5E7EB';
      }}
      role={isLink ? 'link' : 'article'}
      aria-label={`${card.title}: ${card.primaryText}`}
    >
      {/* Icon Circle - LEFT */}
      <div
        style={{
          width: '48px',
          height: '48px',
          minWidth: '48px',
          borderRadius: '50%',
          backgroundColor: card.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <span style={{ color: card.iconColor, display: 'flex', lineHeight: 0 }}>
          {card.icon}
        </span>
      </div>

      {/* Content - RIGHT */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#1E2A5A',
            margin: '0 0 3px 0',
            lineHeight: 1.3,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {card.title}
        </h3>

        {/* Primary Text */}
        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#334155',
            margin: '0 0 2px 0',
            lineHeight: 1.4,
            wordBreak: 'break-word',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {card.primaryText}
        </p>

        {/* Secondary Text */}
        <p
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#64748B',
            margin: 0,
            lineHeight: 1.4,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {card.secondaryText}
        </p>
      </div>
    </Component>
  );
};

// Main ContactCardsSection Component
const ContactCardsSection: React.FC = () => {
  return (
    <div
      style={{
        width: '95%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px 0',
      }}
      aria-label="Contact information cards"
    >
      {/* Cards Grid */}
      <div
        className="cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
        }}
        role="list"
      >
        {contactCards.map((card) => (
          <div key={card.id} role="listitem">
            <ContactCard card={card} />
          </div>
        ))}
      </div>

      {/* Responsive Styles */}
      <style>{`
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1200px) {
          .cards-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }
        }
        @media (max-width: 1000px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
        @media (max-width: 550px) {
          .cards-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactCardsSection;