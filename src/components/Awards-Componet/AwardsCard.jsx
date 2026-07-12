import React, { useState, useCallback } from 'react';

// Simple SVG Icons
const TrophyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#2A2A75]/10">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TagIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const BadgeCheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const AwardsCard = ({ award = {}, onOpen }) => {
  const [imageError, setImageError] = useState(false);

  const awardData = {
    id: 1,
    title: 'Best Infrastructure Company',
    year: '2025',
    category: 'Infrastructure Excellence',
    awardedBy: 'Industry Excellence Council',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop',
    status: 'Winner',
    awardDate: 'March 2025',
    ...award,
  };

  const statusColors = {
    'Winner': 'bg-green-50 text-green-600 border-green-200',
    'Finalist': 'bg-amber-50 text-amber-600 border-amber-200',
    'Recognized': 'bg-blue-50 text-blue-600 border-blue-200',
    'Excellence': 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const statusClass = statusColors[awardData.status] || 'bg-blue-50 text-blue-600 border-blue-200';

  const handleCardClick = useCallback(() => {
    if (onOpen) onOpen(awardData);
  }, [onOpen, awardData]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${awardData.title}`}
      className="w-full max-w-[320px] h-[400px] bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden cursor-pointer flex flex-col outline-none hover:border-[#F37346]/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 font-['Inter',sans-serif]"
    >
      
      {/* Image Area */}
      <div className="h-[200px] bg-gradient-to-br from-white to-[#F8FAFC] relative overflow-hidden flex items-center justify-center">
        {imageError ? (
          <div className="flex items-center justify-center w-full h-full">
            <TrophyIcon />
          </div>
        ) : (
          <img
            src={awardData.image}
            alt={awardData.title}
            className="w-full h-full object-contain p-5"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Year Badge */}
        <div className="absolute top-4 right-4 bg-[#F37346] text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-[0_4px_12px_rgba(243,115,70,0.25)] flex items-center gap-1.5">
          <CalendarIcon /> {awardData.year}
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        
        {/* Title */}
        <h3 className="text-[17px] font-bold text-[#2A2A75] mb-2 leading-[1.3] line-clamp-2">
          {awardData.title}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {awardData.category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-[#2A2A75] rounded-full text-[11px] font-semibold border border-indigo-100">
              <TagIcon /> {awardData.category}
            </span>
          )}
          {awardData.status && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusClass}`}>
              <BadgeCheckIcon /> {awardData.status}
            </span>
          )}
        </div>

        {/* Awarded By */}
        {awardData.awardedBy && (
          <p className="text-[12px] text-gray-500 mb-1 flex items-center gap-1.5">
            <ShieldIcon /> {awardData.awardedBy}
          </p>
        )}

        {/* Date */}
        {awardData.awardDate && (
          <p className="text-[11px] text-gray-400 flex items-center gap-1">
            <CalendarIcon /> {awardData.awardDate}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2A2A75] text-white rounded-xl text-xs font-semibold cursor-pointer border-none shadow-sm hover:bg-[#F37346] transition-colors"
          >
            View Details <ArrowRightIcon />
          </button>
          
          <div className="text-[#F37346] text-lg opacity-60">
            ↗
          </div>
        </div>

      </div>
    </div>
  );
};

export const sampleAwards = [
  { id: 1, title: 'Best Infrastructure Company', year: '2025', category: 'Infrastructure Excellence', awardedBy: 'Industry Excellence Council', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop', awardDate: 'March 2025', status: 'Winner' },
  { id: 2, title: 'Safety Excellence Award', year: '2024', category: 'Safety & Compliance', awardedBy: 'National Safety Council', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop', awardDate: 'June 2024', status: 'Winner' },
  { id: 3, title: 'Innovation in Construction', year: '2024', category: 'Innovation', awardedBy: 'Construction Forum', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop', awardDate: 'September 2024', status: 'Recognized' },
  { id: 4, title: 'Quality Management Excellence', year: '2023', category: 'Quality Assurance', awardedBy: 'Quality Council of India', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop', awardDate: 'November 2023', status: 'Excellence' },
  { id: 5, title: 'Green Building Leadership', year: '2023', category: 'Sustainability', awardedBy: 'Green Building Council', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop', awardDate: 'July 2023', status: 'Winner' },
  { id: 6, title: 'Project Management Excellence', year: '2022', category: 'Project Management', awardedBy: 'PMI India', image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop', awardDate: 'December 2022', status: 'Finalist' },
];

export default AwardsCard;