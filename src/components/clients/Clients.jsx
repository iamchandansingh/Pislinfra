import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fetchStrapiData } from '../../services/strapi';
import clientsData from '../../data/clientsData';

const NAVY = '#0a2a66';
const ORANGE = '#ff8755';

const getClientLogo = (name, strapiLogoObj) => {
  if (strapiLogoObj?.url) {
    return strapiLogoObj.url.startsWith('http') ? strapiLogoObj.url : `http://localhost:1337${strapiLogoObj.url}`;
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

  const RowSlider = ({ rowClients, direction = 'left', speed = 0.5 }) => {
    const [position, setPosition] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef(null);
    const [totalWidth, setTotalWidth] = useState(0);
    const pauseTimeoutRef = useRef(null);

    useEffect(() => {
      if (containerRef.current) {
        const singleSetWidth = containerRef.current.scrollWidth / 3;
        setTotalWidth(singleSetWidth);
      }
    }, [rowClients]);

    useEffect(() => {
      if (isPaused || totalWidth === 0) return;
      
      const interval = setInterval(() => {
        setPosition(prev => {
          const newPos = direction === 'left' ? prev - speed : prev + speed;
          if (direction === 'left' && newPos <= -totalWidth) return 0;
          if (direction === 'right' && newPos >= 0) return -totalWidth;
          return newPos;
        });
      }, 16);
      return () => clearInterval(interval);
    }, [totalWidth, direction, speed, isPaused]);

    const handleMouseEnter = () => {
      setIsPaused(true);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };

    const handleMouseLeave = () => {
      pauseTimeoutRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 3000);
    };

    if (!rowClients || rowClients.length === 0) return null;

    const tripleClients = [...rowClients, ...rowClients, ...rowClients];

    return (
      <div 
        style={{ overflow: 'hidden', marginBottom: '12px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={containerRef}
          style={{
            display: 'flex',
            gap: '12px',
            transform: `translateX(${position}px)`,
          }}
        >
          {tripleClients.map((client, idx) => (
            <motion.div
              key={`${client.id}-${idx}`}
              whileHover={{ 
                y: -4,
                boxShadow: '0 12px 28px rgba(0,0,0,0.10)',
              }}
              style={{
                background: '#ffffff',
                borderRadius: 12,
                padding: '16px 20px',
                minWidth: 'calc((1370px - 72px) / 7)',
                maxWidth: 'calc((1370px - 72px) / 7)',
                minHeight: 90,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0,
              }}
            >
              <img
                src={client.logo}
                alt={client.name}
                title={client.name}
                style={{
                  maxWidth: '90%',
                  maxHeight: 60,
                  objectFit: 'contain',
                  transition: 'all 0.35s ease',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const rows = [];
  if (clients.length > 0) {
    // If we have fewer than 7 clients, just make one row
    // If more, distribute evenly into rows of 7
    for (let i = 0; i < clients.length; i += 7) {
      rows.push(clients.slice(i, i + 7));
    }
  }

  if (clients.length === 0) return null;

  return (
    <section style={{
      padding: '24px',
      background: '#f8fafc',
    }}>
      <div style={{ maxWidth: 1370, margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <h2 style={{
            fontSize: 'clamp(22px, 3vw, 30px)',
            fontWeight: 800,
            color: NAVY,
            margin: 0,
            letterSpacing: '-0.5px',
            padding: '0 16px',
          }}>
            CLIENTS THAT <span style={{ color: NAVY }}>TRUST US</span>
          </h2>
        </motion.div>

        {rows.map((rowClients, idx) => (
          <RowSlider 
            key={idx} 
            rowClients={rowClients} 
            direction={idx % 2 === 0 ? 'left' : 'right'} 
            speed={0.6 + idx * 0.1}
          />
        ))}

      </div>

      <style>{`
        @media (max-width: 1200px) {
          .clients-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .clients-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .clients-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
};

export default Clients;
