import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import clientsData from '../../data/clientsData';

const Clients = () => {
  const seriesOrder = [
    'Reliance Industries Limited',
    'AM/NS India (ArcelorMittal Nippon Steel India)',
    'Adani',
    'GAR',
    'Morgan Stanley',
    'Prologis',
    'Lodha',
    'PMG',
    'CPWD (Central Public Works Department)',
    'VinFast',
    'SEMAC',
    'Rajratan',
    'Oswal Group',
    'Avitech',
    'Amazon',
    'Flipkart',
    'Ecom Express',
    'Daikin',
    'Bosch',
    'Allcargo',
    'Myntra',
    'Cadbury',
    'Blue Dart',
    'DHL',
    'Haryana Government',
    'Stellar',
    'Lodha Group',
    'LOGOS',
  ];

  const filteredClients = seriesOrder
    .map(name => clientsData.find(c => c.name === name))
    .filter(Boolean);

  const RowSlider = ({ clients, direction = 'left', speed = 0.5 }) => {
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
    }, [clients]);

    useEffect(() => {
      if (isPaused) return;
      
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

    const tripleClients = [...clients, ...clients, ...clients];

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
                padding: '36px 20px',
                minWidth: 'calc((1370px - 72px) / 7)',
                maxWidth: 'calc((1370px - 72px) / 7)',
                minHeight: 120,
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
                  maxHeight: 80,
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
  for (let i = 0; i < filteredClients.length; i += 7) {
    rows.push(filteredClients.slice(i, i + 7));
  }

  return (
    <section style={{
      padding: '80px 24px',
      background: '#f8fafc',
    }}>
      <div style={{ maxWidth: 1370, margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 34px)',
            fontWeight: 900,
            color: '#28286e',
            margin: 0,
            letterSpacing: '-0.5px',
            padding: '0 16px',
          }}>
            CLIENTS THAT <span style={{ color: '#ff8755' }}>TRUST US</span>
          </h2>
        </motion.div>

        {rows.map((rowClients, idx) => (
          <RowSlider 
            key={idx} 
            clients={rowClients} 
            direction={idx % 2 === 0 ? 'left' : 'right'} 
            speed={0.6 + idx * 0.1}
          />
        ))}

      </div>

      <style>{`
        @media (max-width: 1370px) {
          .clients-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 1024px) {
          .clients-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .clients-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .clients-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
};

export default Clients;