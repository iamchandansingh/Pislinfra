import React, { useState, useEffect } from 'react';

interface StrapiImage {
  url?: string;
  name?: string;
}

interface CSRPhilosophyProps {
  title?: string;
  description?: string;
  images?: Array<string | StrapiImage>;
}

const defaultImages = [
  '/images/CSR/CSR-(5).png',
  '/images/CSR/CSR-(3).png',
  '/images/CSR/CSR-(1).png',
];

const pillars = [
  { label: 'Sustainable Development', icon: '🌱' },
  { label: 'Inclusive Growth', icon: '🤝' },
  { label: 'Social Equity', icon: '⚖️' },
];

const getImageUrl = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (img.url) {
    return img.url.startsWith('http') ? img.url : `${img.url}`;
  }
  return '';
};

const CSRPhilosophy: React.FC<CSRPhilosophyProps> = ({ title, description, images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const rawImages = images && images.length > 0 
    ? images.map(img => getImageUrl(img)).filter(Boolean)
    : [];
  const csrImages = rawImages.length > 0 ? rawImages : defaultImages;

  useEffect(() => {
    if (csrImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % csrImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [csrImages.length]);

  const formattedTitle = title || 'Creating Sustainable\nCommunities';

  return (
    <section className="csr-phil-section">
      <div className="csr-phil-container">
        <div className="phil-grid">
          
          <div className="csr-phil-content">
            <div className="csr-phil-badge">OUR CSR PHILOSOPHY</div>
            <h2 className="csr-phil-title">
              {formattedTitle.split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br className="csr-phil-br" />}
                </React.Fragment>
              ))}
            </h2>
            <p className="csr-phil-desc">
              {description || 'Our CSR philosophy is built on the foundation of sustainable development, inclusive growth, and social equity. We focus on initiatives that empower communities, enhance quality of life, and contribute to a better, greener future.'}
            </p>

            <div className="csr-phil-pillars">
              {pillars.map((item, idx) => (
                <div key={idx} className="csr-phil-pill">
                  <span className="csr-phil-pill-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="csr-phil-slider-wrap">
            <div className="csr-phil-slider">
              {csrImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`CSR Philosophy ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="csr-phil-img"
                  style={{
                    opacity: currentSlide === index ? 1 : 0,
                    pointerEvents: currentSlide === index ? 'auto' : 'none',
                  }}
                />
              ))}

              {csrImages.length > 1 && (
                <div className="csr-phil-dots">
                  {csrImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`csr-phil-dot ${index === currentSlide ? 'active' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <style>{`
        .csr-phil-section {
          width: 100%;
          padding: 50px 0;
          background-color: #FFFFFF;
        }
        .csr-phil-container {
          width: 98%;
          max-width: 1370px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .phil-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 50px;
          align-items: center;
          box-sizing: border-box;
        }
        .csr-phil-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
        }
        .csr-phil-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #FF6B35;
          background: #FFF4EE;
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 12px;
          font-family: 'Inter', sans-serif;
        }
        .csr-phil-title {
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          color: #052A73;
          line-height: 1.18;
          letter-spacing: -0.6px;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }
        .csr-phil-desc {
          font-size: 14.5px;
          font-weight: 400;
          color: #64748B;
          line-height: 1.7;
          max-width: 540px;
          margin: 16px 0 0 0;
          font-family: 'Inter', sans-serif;
        }
        .csr-phil-pillars {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }
        .csr-phil-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
          font-family: 'Inter', sans-serif;
        }
        .csr-phil-pill-icon {
          font-size: 13px;
          line-height: 1;
        }
        .csr-phil-slider-wrap {
          width: 100%;
          min-width: 0;
        }
        .csr-phil-slider {
          height: 360px;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(5, 42, 115, 0.08);
          position: relative;
          border: 2px solid rgba(255, 107, 53, 0.25);
          background: #F1F5F9;
        }
        .csr-phil-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: opacity 0.8s ease-in-out;
        }
        .csr-phil-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 2;
          background: rgba(15, 23, 42, 0.45);
          padding: 5px 10px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
        }
        .csr-phil-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.65);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .csr-phil-dot.active {
          width: 22px;
          border-radius: 4px;
          background: #FF6B35;
        }

        @media (max-width: 1024px) {
          .csr-phil-section {
            padding: 38px 0;
          }
          .csr-phil-container {
            padding: 0 20px;
          }
          .phil-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .csr-phil-slider {
            height: 320px;
          }
        }

        @media (max-width: 768px) {
          .csr-phil-section {
            padding: 26px 0 !important;
          }
          .csr-phil-container {
            padding: 0 16px !important;
          }
          .phil-grid {
            gap: 20px !important;
          }
          .csr-phil-badge {
            margin-bottom: 8px !important;
            font-size: 10.5px !important;
            padding: 4px 10px !important;
          }
          .csr-phil-title {
            font-size: clamp(22px, 5.8vw, 27px) !important;
            line-height: 1.22 !important;
          }
          .csr-phil-desc {
            font-size: 13.5px !important;
            line-height: 1.65 !important;
            margin-top: 10px !important;
          }
          .csr-phil-pillars {
            gap: 8px !important;
            margin-top: 16px !important;
          }
          .csr-phil-pill {
            font-size: 11.5px !important;
            padding: 5px 10px !important;
          }
          .csr-phil-slider {
            height: clamp(210px, 56vw, 280px) !important;
            border-radius: 14px !important;
          }
        }

        @media (max-width: 380px) {
          .csr-phil-container {
            padding: 0 12px !important;
          }
          .csr-phil-title {
            font-size: 20px !important;
          }
          .csr-phil-desc {
            font-size: 13px !important;
          }
          .csr-phil-slider {
            height: 195px !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CSRPhilosophy;
