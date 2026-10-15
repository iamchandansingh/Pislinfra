import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fetchStrapiData } from '../../services/strapi';
import clientsData from '../../data/clientsData';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';

const getClientLogo = (name, strapiLogoObj) => {
  if (strapiLogoObj?.url) {
    return strapiLogoObj.url.startsWith('http') ? strapiLogoObj.url : `${strapiLogoObj.url}`;
  }
  const client = clientsData.find(c => c.name && c.name.toLowerCase() === name.toLowerCase());
  return client?.logo || null;
};

const Clients = ({ clientsData: propClientsData, data: strapiHomeData }) => {
  const [clients, setClients] = useState(clientsData);

  useEffect(() => {
    async function loadData() {
      try {
        if (propClientsData && Array.isArray(propClientsData) && propClientsData.length > 0) {
          const mapped = propClientsData.map(item => ({
            id: item.id || item.name,
            name: item.name,
            logo: getClientLogo(item.name, item.logo)
          })).filter(c => c.logo);
          if (mapped.length > 0) {
            setClients(mapped);
            return;
          }
        }

        const data = await fetchStrapiData('clients?pagination[pageSize]=100&sort=order:asc&populate=*');
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map(item => ({
            id: item.id,
            name: item.name,
            logo: getClientLogo(item.name, item.logo)
          })).filter(c => c.logo); // Only keep those with a valid logo
          if (mapped.length > 0) {
            setClients(mapped);
          }
        }
      } catch (err) {
        console.error("Clients Strapi fetch error:", err);
      }
    }
    loadData();
  }, [propClientsData]);

  const RowSlider = ({ rowClients, direction = 'left', duration = 32 }) => {
    if (!rowClients || rowClients.length === 0) return null;

    // Duplicate clients inside each group (14 cards each) so group is wider than any screen
    const duplicatedClients = [...rowClients, ...rowClients];
    const isLeft = direction === 'left';

    return (
      <div 
        className="pisl-marquee-container"
        style={{ overflow: 'hidden', marginBottom: '12px' }}
      >
        <div
          className={`pisl-marquee-track ${isLeft ? 'scroll-left' : 'scroll-right'}`}
          style={{
            '--marquee-duration': `${duration}s`,
          }}
        >
          {/* Group 1 */}
          <div className="pisl-marquee-group">
            {duplicatedClients.map((client, idx) => (
              <div
                key={`g1-${client.id || client.name}-${idx}`}
                className="client-logo-card"
              >
                <img
                  className="client-logo-img"
                  src={client.logo}
                  alt={`${client.name} - Pislinfra Client`}
                  decoding="async"
                />
              </div>
            ))}
          </div>

          {/* Group 2 (Exact mirror copy for 100% seamless glitch-free infinite loop) */}
          <div className="pisl-marquee-group" aria-hidden="true">
            {duplicatedClients.map((client, idx) => (
              <div
                key={`g2-${client.id || client.name}-${idx}`}
                className="client-logo-card"
              >
                <img
                  className="client-logo-img"
                  src={client.logo}
                  alt=""
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const rows = [];
  if (clients.length > 0) {
    for (let i = 0; i < clients.length; i += 7) {
      rows.push(clients.slice(i, i + 7));
    }
  }

  if (clients.length === 0) return null;

  return (
    <section 
      className="pisl-clients-section"
      style={{
        padding: '40px 24px',
        background: '#f8fafc',
      }}
    >
      <div style={{ maxWidth: 1370, margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pisl-clients-header"
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <h2 
            className="pisl-clients-title"
            style={{
              fontSize: 'clamp(22px, 3vw, 30px)',
              fontWeight: 800,
              color: NAVY,
              margin: 0,
              letterSpacing: '-0.5px',
              padding: '0 16px',
            }}
          >
            CLIENTS THAT <span style={{ color: NAVY }}>TRUST US</span>
          </h2>
        </motion.div>

        {rows.map((rowClients, idx) => (
          <RowSlider 
            key={idx} 
            rowClients={rowClients} 
            direction={idx % 2 === 0 ? 'left' : 'right'} 
            duration={30 + idx * 5}
          />
        ))}

      </div>

      <style>{`
        .pisl-marquee-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin-bottom: 12px;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          contain: paint;
        }

        .pisl-marquee-track {
          display: flex;
          width: max-content;
          user-select: none;
          transform: translateZ(0);
        }

        .pisl-marquee-group {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-right: 12px;
          flex-shrink: 0;
          will-change: transform;
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .scroll-left .pisl-marquee-group {
          animation: pislMarqueeLeft var(--marquee-duration, 32s) linear infinite;
        }

        .scroll-right .pisl-marquee-group {
          animation: pislMarqueeRight var(--marquee-duration, 32s) linear infinite;
        }

        @keyframes pislMarqueeLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }

        @keyframes pislMarqueeRight {
          0% {
            transform: translate3d(-100%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .client-logo-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 16px 20px;
          min-width: calc((1370px - 72px) / 7);
          max-width: calc((1370px - 72px) / 7);
          min-height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          border: 1px solid #f1f5f9;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          flex-shrink: 0;
        }

        .client-logo-img {
          max-width: 90%;
          max-height: 60px;
          object-fit: contain;
          display: block;
        }

        /* Desktop only: pause and subtle lift on mouse hover */
        @media (hover: hover) and (pointer: fine) {
          .pisl-marquee-container:hover .pisl-marquee-group {
            animation-play-state: paused !important;
          }
          .client-logo-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 24px rgba(0,0,0,0.09) !important;
          }
        }

        @media (max-width: 768px) {
          .pisl-clients-section {
            padding: 34px 16px 36px 16px !important;
          }
          .pisl-clients-header {
            margin-bottom: 20px !important;
          }
          .pisl-clients-title {
            font-size: clamp(21px, 5.8vw, 26px) !important;
            letter-spacing: -0.5px !important;
          }
          .pisl-marquee-container {
            margin-bottom: 10px !important;
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%) !important;
            mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%) !important;
          }
          .pisl-marquee-group {
            gap: 10px !important;
            padding-right: 10px !important;
          }
          .client-logo-card {
            min-width: 124px !important;
            max-width: 124px !important;
            min-height: 64px !important;
            padding: 8px 14px !important;
            border-radius: 10px !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.04) !important;
          }
          .client-logo-img {
            max-height: 38px !important;
            max-width: 92% !important;
          }
        }

        @media (max-width: 400px) {
          .pisl-marquee-group {
            gap: 8px !important;
            padding-right: 8px !important;
          }
          .client-logo-card {
            min-width: 114px !important;
            max-width: 114px !important;
            min-height: 60px !important;
            padding: 7px 12px !important;
          }
          .client-logo-img {
            max-height: 34px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Clients;
