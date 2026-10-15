import React from 'react';

interface CardItem {
  id?: string | number;
  title?: string;
  description?: string;
  imageLeft?: boolean;
  image?: any;
}

interface CSRInitiativesProps {
  givingBackCards?: CardItem[];
  envCards?: CardItem[];
  celebCards?: CardItem[];
}

const defaultGivingBack: CardItem[] = [
  {
    id: 'happiness',
    title: 'Sharing Happiness Through Winter Support',
    description: 'Essential winter support initiatives helping workers and communities stay safe, warm, and cared for during challenging weather conditions.',
    imageLeft: true,
    image: '/images/CSR/Happiness.jpg',
  },
  {
    id: 'heroes',
    title: 'Supporting Front-Line Heroes',
    description: 'Community outreach programs dedicated to supporting frontline personnel and appreciating their commitment towards public safety and service.',
    imageLeft: false,
    image: '/images/CSR/CSR-(2).png',
  },
];

const defaultEnvironment: CardItem[] = [
  {
    id: 'greener',
    title: 'Promoting Greener Tomorrow',
    description: 'Environmental sustainability initiatives focused on plantation drives, green development, and maintaining healthier project surroundings.',
    imageLeft: true,
    image: '/images/CSR/CSR-(4).png',
  },
  {
    id: 'safety',
    title: 'Health & Safety Precautions',
    description: 'Comprehensive health and safety measures implemented to create safer, cleaner, and healthier workplace environments.',
    imageLeft: false,
    image: '/images/CSR/CSR-(6).png',
  },
];

const defaultCelebrations: CardItem[] = [
  {
    id: 'independence',
    title: 'Independence Day Celebration',
    description: 'Celebrating national pride with flag hoisting ceremonies, cultural performances, and team gatherings across all project sites.',
    image: '/images/CSR/Independence.jpeg',
  },
  {
    id: 'birthday',
    title: 'Team Birthday Celebration',
    description: 'Monthly birthday celebrations bringing teams together to share joy, cake, and memorable moments with colleagues.',
    image: '/images/CSR/Birthday.jpeg',
  },
  {
    id: 'corporate',
    title: 'Corporate Event Celebration',
    description: 'Annual corporate events, award ceremonies, and team-building activities that strengthen our organizational culture and values.',
    image: '/images/CSR/Corporate.png',
  },
];

const getImageUrl = (img: any, fallback?: string): string => {
  if (!img) return fallback || '';
  if (typeof img === 'string') return img;
  if (img.url) {
    return img.url.startsWith('http') ? img.url : `${img.url}`;
  }
  return fallback || '';
};

const SectionTitle = ({ title, badge }: { title: string; badge?: string }) => (
  <div className="init-section-header">
    {badge && <div className="init-badge">{badge}</div>}
    <h2 className="init-title">{title}</h2>
  </div>
);

const CSRInitiatives: React.FC<CSRInitiativesProps> = ({ givingBackCards, envCards, celebCards }) => {
  const gBackCards = givingBackCards && givingBackCards.length > 0 ? givingBackCards : defaultGivingBack;
  const environmentCards = envCards && envCards.length > 0 ? envCards : defaultEnvironment;
  const celebrationCards = celebCards && celebCards.length > 0 ? celebCards : defaultCelebrations;

  return (
    <section className="csr-initiatives-section">
      <div className="csr-init-container">
        
        {/* 1. GIVING IT BACK TO THE SOCIETY */}
        {gBackCards.length > 0 && (
          <div className="init-block">
            <SectionTitle badge="SOCIAL OUTREACH" title="GIVING IT BACK TO THE SOCIETY" />
            <div className="init-grid-2">
              {gBackCards.map((card, idx) => {
                const fallback = defaultGivingBack[idx % defaultGivingBack.length];
                const imgSrc = getImageUrl(card.image, fallback?.image);
                const isImageLeft = card.imageLeft !== false;

                return (
                  <div key={card.id || idx} className={`init-card-2 ${isImageLeft ? 'img-left' : 'img-right'}`}>
                    <div className="init-card-img-wrap">
                      <img src={imgSrc} alt={card.title || 'Initiative'} loading="lazy" className="init-card-img" />
                    </div>
                    <div className="init-card-content">
                      <h3 className="init-card-title">{card.title || fallback?.title}</h3>
                      <p className="init-card-desc">{card.description || fallback?.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. ENVIRONMENT & HEALTH INITIATIVES */}
        {environmentCards.length > 0 && (
          <div className="init-block">
            <SectionTitle badge="HEALTH & ECOLOGY" title="ENVIRONMENT & HEALTH INITIATIVES" />
            <div className="init-grid-2">
              {environmentCards.map((card, idx) => {
                const fallback = defaultEnvironment[idx % defaultEnvironment.length];
                const imgSrc = getImageUrl(card.image, fallback?.image);
                const isImageLeft = card.imageLeft !== false;

                return (
                  <div key={card.id || idx} className={`init-card-2 ${isImageLeft ? 'img-left' : 'img-right'}`}>
                    <div className="init-card-img-wrap">
                      <img src={imgSrc} alt={card.title || 'Initiative'} loading="lazy" className="init-card-img" />
                    </div>
                    <div className="init-card-content">
                      <h3 className="init-card-title">{card.title || fallback?.title}</h3>
                      <p className="init-card-desc">{card.description || fallback?.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. CELEBRATIONS AT PISLINFRA */}
        {celebrationCards.length > 0 && (
          <div className="init-block" style={{ marginBottom: 0 }}>
            <SectionTitle badge="PEOPLE & CULTURE" title="CELEBRATIONS AT PISLINFRA" />
            <div className="init-grid-3">
              {celebrationCards.map((card, idx) => {
                const fallback = defaultCelebrations[idx % defaultCelebrations.length];
                const imgSrc = getImageUrl(card.image, fallback?.image);

                return (
                  <div key={card.id || idx} className="celeb-card">
                    <div className="celeb-card-img-wrap">
                      <img src={imgSrc} alt={card.title || 'Celebration'} loading="lazy" className="celeb-card-img" />
                    </div>
                    <div className="celeb-card-content">
                      <h3 className="celeb-card-title">{card.title || fallback?.title}</h3>
                      <p className="celeb-card-desc">{card.description || fallback?.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      <style>{`
        .csr-initiatives-section {
          width: 100%;
          padding: 34px 0 54px 0;
          background-color: #FFFFFF;
        }
        .csr-init-container {
          width: 98%;
          max-width: 1370px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .init-block {
          margin-bottom: clamp(34px, 5vw, 50px);
        }
        .init-section-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .init-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #FF6B35;
          background: #FFF4EE;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 8px;
          font-family: 'Inter', sans-serif;
        }
        .init-title {
          font-size: clamp(21px, 2.8vw, 26px);
          font-weight: 800;
          color: #052A73;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.4px;
          margin: 0;
          line-height: 1.25;
        }

        /* 2-Column Grid for Horizontal Cards */
        .init-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          box-sizing: border-box;
        }
        .init-card-2 {
          background-color: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          min-height: 190px;
          height: auto;
          box-shadow: 0 4px 14px rgba(5, 42, 115, 0.04);
          box-sizing: border-box;
          transition: none !important;
        }
        .init-card-2.img-right {
          flex-direction: row-reverse;
        }
        .init-card-img-wrap {
          width: 42%;
          min-width: 42%;
          position: relative;
          overflow: hidden;
          background: #F8FAFC;
        }
        .init-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .init-card-content {
          flex: 1;
          padding: 22px 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          box-sizing: border-box;
        }
        .init-card-title {
          font-size: 17px;
          font-weight: 700;
          color: #052A73;
          line-height: 1.32;
          margin: 0 0 8px 0;
          font-family: 'Inter', sans-serif;
        }
        .init-card-desc {
          font-size: 13px;
          color: #64748B;
          line-height: 1.55;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }

        /* 3-Column Grid for Celebrations */
        .init-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          box-sizing: border-box;
        }
        .celeb-card {
          background-color: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(5, 42, 115, 0.05);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          transition: none !important;
        }
        .celeb-card-img-wrap {
          width: 100%;
          height: 200px;
          border-bottom: 3px solid #ff8755;
          background: #F8FAFC;
          overflow: hidden;
        }
        .celeb-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .celeb-card-content {
          padding: 20px 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .celeb-card-title {
          font-size: 19px;
          font-weight: 700;
          color: #052A73;
          line-height: 1.3;
          margin: 0 0 8px 0;
          font-family: 'Inter', sans-serif;
        }
        .celeb-card-desc {
          font-size: 13.5px;
          color: #64748B;
          line-height: 1.6;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }

        /* Tablet Responsive (<= 1024px) */
        @media (max-width: 1024px) {
          .csr-init-container {
            padding: 0 20px;
          }
          .init-grid-2 {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .init-grid-3 {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }

        /* Mobile Responsive (<= 768px) */
        @media (max-width: 768px) {
          .csr-initiatives-section {
            padding: 24px 0 38px 0 !important;
          }
          .csr-init-container {
            padding: 0 16px !important;
          }
          .init-section-header {
            margin-bottom: 18px !important;
          }
          .init-badge {
            font-size: 10px !important;
            padding: 3px 9px !important;
            margin-bottom: 6px !important;
          }
          .init-title {
            font-size: clamp(18px, 5vw, 22px) !important;
          }
          .init-block {
            margin-bottom: 30px !important;
          }

          /* Fixed: No cut-off or squished text on mobile! Stacks cleanly with image on top! */
          .init-card-2 {
            flex-direction: column !important;
            min-height: auto !important;
            height: auto !important;
            border-radius: 14px !important;
          }
          .init-card-img-wrap {
            width: 100% !important;
            min-width: 100% !important;
            height: clamp(160px, 46vw, 195px) !important;
            order: 1 !important;
          }
          .init-card-content {
            width: 100% !important;
            padding: 16px 14px !important;
            order: 2 !important;
          }
          .init-card-title {
            font-size: clamp(16px, 4.2vw, 17.5px) !important;
            margin-bottom: 6px !important;
          }
          .init-card-desc {
            font-size: 12.5px !important;
            line-height: 1.55 !important;
          }

          /* Celebrations mobile */
          .init-grid-3 {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .celeb-card-img-wrap {
            height: clamp(160px, 48vw, 195px) !important;
          }
          .celeb-card-content {
            padding: 16px 14px !important;
          }
          .celeb-card-title {
            font-size: clamp(17px, 4.4vw, 18.5px) !important;
            margin-bottom: 6px !important;
          }
          .celeb-card-desc {
            font-size: 13px !important;
          }
        }

        /* Small Phones (<= 380px) */
        @media (max-width: 380px) {
          .csr-init-container {
            padding: 0 12px !important;
          }
          .init-title {
            font-size: 17.5px !important;
          }
          .init-card-title, .celeb-card-title {
            font-size: 16px !important;
          }
          .init-card-desc, .celeb-card-desc {
            font-size: 12px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CSRInitiatives;
