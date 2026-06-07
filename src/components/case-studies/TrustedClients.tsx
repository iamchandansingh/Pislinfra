import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import clientsData from '../../data/clientsData';

interface Client { id: number; name: string; logo: string; }

const TrustedClients: React.FC = () => {
  const seriesOrder = [
    'Adani', 'AM/NS India (ArcelorMittal Nippon Steel India)', 'Reliance Industries Limited',
    'Flipkart', 'Amazon', 'DHL', 'Prologis', 'Morgan Stanley', 'Lodha', 'PMG',
    'Bosch', 'Blue Dart', 'Myntra', 'Cadbury', 'Daikin', 'Allcargo',
  ];

  const filteredClients = seriesOrder
    .map(name => clientsData.find(c => c.name === name))
    .filter(Boolean) as Client[];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const visibleLogos = 6;

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => prev + 1 >= filteredClients.length ? 0 : prev + 1);
      }, 3000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, filteredClients.length]);

  const handlePrev = () => setCurrentIndex((prev) => prev - 1 < 0 ? filteredClients.length - 1 : prev - 1);
  const handleNext = () => setCurrentIndex((prev) => prev + 1 >= filteredClients.length ? 0 : prev + 1);

  const getVisibleClients = () => {
    const clients = [];
    for (let i = 0; i < visibleLogos; i++) {
      clients.push(filteredClients[(currentIndex + i) % filteredClients.length]);
    }
    return clients;
  };

  return (
    <div style={{ width: '100%', padding: '48px 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{
          backgroundColor: '#FFFFFF', border: '1px solid #EEF2F7', borderRadius: '18px',
          padding: '26px 28px', boxShadow: '0 6px 25px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}>
          
          <button onClick={handlePrev} style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0A2A66', flexShrink: 0 }}>
            <FiChevronLeft size={18} />
          </button>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '55px', overflow: 'hidden', minHeight: '60px' }}>
            {getVisibleClients().map((client, index) => (
              <div key={`${client.id}-${index}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.85, flexShrink: 0 }}>
                <img src={client.logo} alt={client.name} title={client.name} style={{ height: '52px', maxWidth: '130px', objectFit: 'contain' }} />
              </div>
            ))}
          </div>

          <button onClick={handleNext} style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0A2A66', flexShrink: 0 }}>
            <FiChevronRight size={18} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default TrustedClients;