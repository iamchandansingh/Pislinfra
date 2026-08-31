import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactCard = ({ card }) => {
  const isLink = Boolean(card.href);
  const Component = isLink ? 'a' : 'div';
  const linkProps = isLink ? { href: card.href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Component
      {...linkProps}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: 'inherit',
        backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB',
        padding: '20px', boxShadow: '0 4px 12px rgba(15,23,42,0.04)',
        transition: 'all 0.3s ease', cursor: isLink ? 'pointer' : 'default', boxSizing: 'border-box',
        width: '100%', height: '100%', minHeight: '110px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(15,23,42,0.08)';
        e.currentTarget.style.borderColor = '#D1D5DB';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,23,42,0.04)';
        e.currentTarget.style.borderColor = '#E5E7EB';
      }}
    >
      <div style={{
        width: '48px', height: '48px', minWidth: '48px', borderRadius: '50%',
        backgroundColor: card.iconBg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ color: card.iconColor, display: 'flex', lineHeight: 0 }}>{card.icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E2A5A', margin: '0 0 4px 0', lineHeight: 1.3, fontFamily: 'Inter, sans-serif' }}>{card.title}</h3>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#334155', margin: '0 0 4px 0', lineHeight: 1.4, wordBreak: 'break-word', fontFamily: 'Inter, sans-serif' }}>{card.primaryText}</p>
        {card.secondaryText && (
          <p style={{ fontSize: '12px', fontWeight: 400, color: '#64748B', margin: 0, lineHeight: 1.4, fontFamily: 'Inter, sans-serif' }}>{card.secondaryText}</p>
        )}
      </div>
    </Component>
  );
};

const ContactCardsSection = ({ pageData }) => {
  const contactCards = [
    {
      id: 'call',
      title: 'Call Us',
      icon: <Phone size={22} />,
      iconBg: '#FFF3EC',
      iconColor: '#FF6B35',
      primaryText: pageData?.phone || '085270 40411',
      secondaryText: 'Mon – Sat: 9:00 AM – 6:00 PM',
      href: `tel:${pageData?.phone || '08527040411'}`.replace(/\s/g, ''),
    },
    {
      id: 'email',
      title: 'Email Us',
      icon: <Mail size={22} />,
      iconBg: '#EEF4FF',
      iconColor: '#2563EB',
      primaryText: pageData?.email || 'info@pislinfra.com',
      secondaryText: 'We reply within 24 hours',
      href: `mailto:${pageData?.email || 'info@pislinfra.com'}`,
    },
    {
      id: 'visit',
      title: 'Visit Us',
      icon: <MapPin size={22} />,
      iconBg: '#EEFDF3',
      iconColor: '#22C55E',
      primaryText: pageData?.address || '31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122018',
      href: pageData?.mapUrl || 'https://maps.app.goo.gl/yrFiVHJsAwLp461c9',
    },
  ];

  return (
    <div className="contact-cards-wrapper" style={{ width: '95%', maxWidth: '1100px', margin: '0 auto', padding: '24px 0 0 0', position: 'relative', zIndex: 10 }}>
      <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px', alignItems: 'stretch' }}>
        {contactCards.map((card) => (
          <div key={card.id} style={{ display: 'flex' }}><ContactCard card={card} /></div>
        ))}
      </div>
      <style>{`
        @media (max-width: 639px) { .contact-cards-wrapper { padding-bottom: 24px !important; } }
        @media (min-width: 550px) { .cards-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; } }
        @media (min-width: 900px) { .cards-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 18px !important; justify-content: center !important; } }
      `}</style>
    </div>
  );
};

export default ContactCardsSection;
