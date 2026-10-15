import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

interface ContactCardData {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  primaryText: string;
  secondaryText?: string;
  href?: string;
}

const ContactCard: React.FC<{ card: ContactCardData }> = ({ card }) => {
  const isLink = Boolean(card.href);
  const Component = isLink ? 'a' : 'div';
  const isExternal = Boolean(card.href && card.href.startsWith('http'));
  const linkProps = isLink
    ? {
        href: card.href,
        ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
      }
    : {};

  return (
    <Component
      {...linkProps}
      className="contact-card-item"
    >
      <div 
        className="contact-card-icon-wrap" 
        style={{ backgroundColor: card.iconBg }}
      >
        <span style={{ color: card.iconColor, display: 'flex', lineHeight: 0 }}>
          {card.icon}
        </span>
      </div>

      <div className="contact-card-content">
        <h3 className="contact-card-title">{card.title}</h3>
        <p className="contact-card-primary">{card.primaryText}</p>
        {card.secondaryText && (
          <p className="contact-card-secondary">{card.secondaryText}</p>
        )}
      </div>
    </Component>
  );
};

interface ContactCardsSectionProps {
  pageData?: {
    phone?: string;
    email?: string;
    address?: string;
    mapUrl?: string;
  };
}

const ContactCardsSection: React.FC<ContactCardsSectionProps> = ({ pageData }) => {
  const contactCards: ContactCardData[] = [
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
      iconColor: '#16A34A',
      primaryText: pageData?.address || '31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122018',
      href: pageData?.mapUrl || 'https://maps.app.goo.gl/yrFiVHJsAwLp461c9',
    },
  ];

  return (
    <div className="contact-cards-wrapper">
      <div className="cards-grid">
        {contactCards.map((card) => (
          <div key={card.id} className="card-cell">
            <ContactCard card={card} />
          </div>
        ))}
      </div>

      <style>{`
        .contact-cards-wrapper {
          width: 95%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          position: relative;
          z-index: 10;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          align-items: stretch;
          box-sizing: border-box;
        }

        .card-cell {
          display: flex;
          width: 100%;
        }

        .contact-card-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          text-decoration: none;
          color: inherit;
          background-color: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #EAEFF5;
          padding: 20px 18px;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
          cursor: pointer;
          box-sizing: border-box;
          width: 100%;
          min-height: 100px;
          transition: none !important;
          transform: none !important;
        }

        .contact-card-item:hover {
          transform: none !important;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04) !important;
          border-color: #EAEFF5 !important;
        }

        .contact-card-icon-wrap {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .contact-card-content {
          flex: 1;
          min-width: 0;
        }

        .contact-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #1E2A5A;
          margin: 0 0 5px 0;
          line-height: 1.3;
          font-family: 'Inter', sans-serif;
        }

        .contact-card-primary {
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          margin: 0 0 4px 0;
          line-height: 1.45;
          word-break: break-word;
          font-family: 'Inter', sans-serif;
        }

        .contact-card-secondary {
          font-size: 12.5px;
          font-weight: 400;
          color: #64748B;
          margin: 0;
          line-height: 1.4;
          font-family: 'Inter', sans-serif;
        }

        /* ===== Tablet (>= 768px) ===== */
        @media (min-width: 768px) {
          .cards-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }
        }

        /* ===== Desktop (>= 1024px) ===== */
        @media (min-width: 1024px) {
          .cards-grid {
            gap: 20px !important;
          }
          .contact-card-item {
            padding: 22px 20px;
          }
        }

        /* ===== Mobile (<= 767px) ===== */
        @media (max-width: 767px) {
          .contact-cards-wrapper {
            padding: 0 14px !important;
          }
          .cards-grid {
            gap: 12px !important;
          }
          .contact-card-item {
            padding: 16px 14px !important;
            border-radius: 14px !important;
            gap: 14px !important;
            min-height: auto !important;
          }
          .contact-card-icon-wrap {
            width: 44px !important;
            height: 44px !important;
            min-width: 44px !important;
            border-radius: 10px !important;
          }
          .contact-card-icon-wrap svg {
            width: 20px !important;
            height: 20px !important;
          }
          .contact-card-title {
            font-size: 14.5px !important;
            margin-bottom: 4px !important;
          }
          .contact-card-primary {
            font-size: 13.5px !important;
            margin-bottom: 3px !important;
            line-height: 1.4 !important;
          }
          .contact-card-secondary {
            font-size: 12px !important;
          }
        }

        /* Small Phones (<= 360px) */
        @media (max-width: 360px) {
          .contact-cards-wrapper {
            padding: 0 10px !important;
          }
          .contact-card-item {
            padding: 14px 10px !important;
            gap: 10px !important;
          }
          .contact-card-icon-wrap {
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
          }
          .contact-card-icon-wrap svg {
            width: 18px !important;
            height: 18px !important;
          }
          .contact-card-title {
            font-size: 13.5px !important;
          }
          .contact-card-primary {
            font-size: 12.5px !important;
          }
          .contact-card-secondary {
            font-size: 11px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactCardsSection;
