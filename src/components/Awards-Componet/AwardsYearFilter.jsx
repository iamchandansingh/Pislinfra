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
    <div style={{ paddingTop: '40px', paddingBottom: '0px', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 16px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%' }}>
          
          {/* Prev Button */}
          <button
            onClick={handlePrevClick}
            disabled={isPrevDisabled}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              border: '2px solid #E5E7EB',
              backgroundColor: isPrevDisabled ? '#F9FAFB' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isPrevDisabled ? 'not-allowed' : 'pointer',
              opacity: isPrevDisabled ? 0.3 : 1,
              flexShrink: 0,
            }}
            aria-label="Previous year"
          >
            <HiChevronLeft style={{ fontSize: '22px', color: isPrevDisabled ? '#D1D5DB' : '#2A2A75' }} />
          </button>

          {/* Year Buttons */}
          <div 
            id="year-scroll-container"
            ref={scrollContainerRef}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              flexWrap: 'nowrap', 
              justifyContent: 'flex-start',
              overflowX: 'auto',
              padding: '4px 0',
              flex: 1,
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none',  /* IE and Edge */
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
                  minWidth: '130px',
                  height: '52px',
                  padding: '0 28px',
                  borderRadius: '14px',
                  border: selectedYear === year ? '2px solid #2A2A75' : '2px solid #F3F4F6',
                  backgroundColor: selectedYear === year ? '#2A2A75' : '#FFFFFF',
                  color: selectedYear === year ? '#FFFFFF' : '#4B5563',
                  fontSize: '18px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: selectedYear === year ? '0 4px 16px rgba(42,42,117,0.2)' : 'none',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              border: '2px solid #E5E7EB',
              backgroundColor: isNextDisabled ? '#F9FAFB' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isNextDisabled ? 'not-allowed' : 'pointer',
              opacity: isNextDisabled ? 0.3 : 1,
              flexShrink: 0,
            }}
            aria-label="Next year"
          >
            <HiChevronRight style={{ fontSize: '22px', color: isNextDisabled ? '#D1D5DB' : '#2A2A75' }} />
          </button>

        </div>

      </div>
    </div>
  );
};

export default AwardsYearFilter;