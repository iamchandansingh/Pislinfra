import React, { useState, useCallback, useRef, useEffect } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const AwardsYearFilter = ({ onYearChange, initialYear = 2025, years = [2025, 2024, 2023] }) => {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const scrollContainerRef = useRef(null);
  const buttonRefs = useRef({});

  useEffect(() => {
    const activeButton = buttonRefs.current[selectedYear];
    const container = scrollContainerRef.current;
    
    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      const scrollLeft = container.scrollLeft + (buttonRect.left - containerRect.left) - (containerRect.width / 2) + (buttonRect.width / 2);
      
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [selectedYear]);

  const handleYearChange = useCallback((year) => {
    if (year === selectedYear) return;
    setSelectedYear(year);
    if (onYearChange) onYearChange(year);
  }, [selectedYear, onYearChange]);

  const isPrevDisabled = selectedYear === years[0];
  const isNextDisabled = selectedYear === years[years.length - 1];

  const handlePrevClick = () => {
    const idx = years.indexOf(selectedYear);
    if (idx > 0) handleYearChange(years[idx - 1]);
  };

  const handleNextClick = () => {
    const idx = years.indexOf(selectedYear);
    if (idx < years.length - 1) handleYearChange(years[idx + 1]);
  };

  return (
    <div style={{ paddingTop: '24px', paddingBottom: '10px', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
          
          {/* Prev Button */}
          <button
            onClick={handlePrevClick}
            disabled={isPrevDisabled}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1.5px solid #E2E8F0',
              backgroundColor: isPrevDisabled ? '#F8FAFC' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isPrevDisabled ? 'not-allowed' : 'pointer',
              opacity: isPrevDisabled ? 0.35 : 1,
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
            aria-label="Previous year"
          >
            <HiChevronLeft style={{ fontSize: '18px', color: isPrevDisabled ? '#94A3B8' : '#1E2A5A' }} />
          </button>

          {/* Year Buttons */}
          <div 
            id="year-scroll-container"
            ref={scrollContainerRef}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              flexWrap: 'nowrap', 
              justifyContent: 'flex-start',
              overflowX: 'auto',
              padding: '4px 0',
              flex: 1,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style dangerouslySetInnerHTML={{__html: `
              #year-scroll-container::-webkit-scrollbar {
                display: none;
              }
            `}} />
            {years.map((year) => (
              <button
                key={year}
                ref={(el) => (buttonRefs.current[year] = el)}
                onClick={() => handleYearChange(year)}
                style={{
                  flexShrink: 0,
                  minWidth: '95px',
                  height: '40px',
                  padding: '0 20px',
                  borderRadius: '100px',
                  border: selectedYear === year ? '1.5px solid #1E2A5A' : '1px solid #E2E8F0',
                  backgroundColor: selectedYear === year ? '#1E2A5A' : '#FFFFFF',
                  color: selectedYear === year ? '#FFFFFF' : '#64748B',
                  fontSize: '13.5px',
                  fontWeight: selectedYear === year ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: selectedYear === year ? '0 4px 12px rgba(30,42,90,0.18)' : 'none',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.2s ease'
                }}
                aria-label={`Filter by year ${year}`}
                aria-pressed={selectedYear === year}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextClick}
            disabled={isNextDisabled}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1.5px solid #E2E8F0',
              backgroundColor: isNextDisabled ? '#F8FAFC' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isNextDisabled ? 'not-allowed' : 'pointer',
              opacity: isNextDisabled ? 0.35 : 1,
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
            aria-label="Next year"
          >
            <HiChevronRight style={{ fontSize: '18px', color: isNextDisabled ? '#94A3B8' : '#1E2A5A' }} />
          </button>

        </div>

      </div>
    </div>
  );
};

export default AwardsYearFilter;