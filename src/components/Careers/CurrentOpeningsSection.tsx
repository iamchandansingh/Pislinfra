import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronLeft, ChevronRight, Search, Filter, ChevronDown, MapPin, GraduationCap, Clock } from 'lucide-react';

// Types
interface JobOpening {
  id: number;
  title: string;
  department: string;
  experience: string;
  qualification: string;
  location: string;
}

interface Props {
  openings?: JobOpening[];
  title?: string;
  onApplyNow: (position: string) => void;
}

// Default Job Data
const defaultJobOpenings: JobOpening[] = [
  { id: 1, title: 'Planning & MIS Engineer', department: 'Civil', experience: '2–4 Years', qualification: 'BE – Civil', location: 'PAN India' },
  { id: 2, title: 'Planning & MIS Manager', department: 'Civil', experience: '8–12 Years', qualification: 'BE – Civil | PGP Advantage', location: 'PAN India' },
  { id: 3, title: 'Costing Engineer', department: 'Civil', experience: '0–3 Years', qualification: 'BE – Civil', location: 'PAN India' },
  { id: 4, title: 'Costing Manager', department: 'Civil', experience: '10–12 Years', qualification: 'BE – Civil | PGP Advantage', location: 'PAN India' },
  { id: 5, title: 'Planning Engineer', department: 'Planning', experience: '2–4 Years', qualification: 'Diploma or BE in Civil', location: 'PAN India' },
  { id: 6, title: 'Sr. Planning Engineer', department: 'Planning', experience: '5–7 Years', qualification: 'Diploma or BE in Civil', location: 'PAN India' },
  { id: 7, title: 'Billing Engineer', department: 'Billing', experience: '2–4 Years', qualification: 'Diploma or BE in Civil', location: 'PAN India' },
  { id: 8, title: 'Sr. Billing Engineer', department: 'Billing', experience: '8–12 Years', qualification: 'Diploma or BE in Civil', location: 'PAN India' },
  { id: 9, title: 'Surveyor', department: 'Survey', experience: '1–3 Years', qualification: 'ITI or Diploma in Surveying', location: 'PAN India' },
  { id: 10, title: 'Asst. Surveyor', department: 'Survey', experience: '2–4 Years', qualification: 'ITI or Diploma in Surveying', location: 'PAN India' },
  { id: 11, title: 'Project Manager', department: 'Civil', experience: '12–15 Years', qualification: 'BE – Civil | MBA Advantage', location: 'PAN India' },
  { id: 12, title: 'Site Supervisor', department: 'Construction', experience: '3–5 Years', qualification: 'Diploma in Civil', location: 'PAN India' },
  { id: 13, title: 'Quality Control Engineer', department: 'Quality', experience: '2–4 Years', qualification: 'BE – Civil', location: 'PAN India' },
  { id: 14, title: 'Safety Officer', department: 'Safety', experience: '3–6 Years', qualification: 'Diploma + Safety Certification', location: 'PAN India' },
  { id: 15, title: 'Procurement Engineer', department: 'Procurement', experience: '4–7 Years', qualification: 'BE – Civil/Mechanical', location: 'PAN India' },
  { id: 16, title: 'Design Engineer', department: 'Design', experience: '2–5 Years', qualification: 'BE – Civil | AutoCAD', location: 'PAN India' },
  { id: 17, title: 'Site Engineer', department: 'Civil', experience: '1–3 Years', qualification: 'BE – Civil', location: 'PAN India' },
  { id: 18, title: 'Contract Manager', department: 'Contracts', experience: '8–10 Years', qualification: 'BE – Civil | LLB Advantage', location: 'PAN India' },
  { id: 19, title: 'Estimation Engineer', department: 'Estimation', experience: '3–6 Years', qualification: 'BE – Civil', location: 'PAN India' },
  { id: 20, title: 'Lab Technician', department: 'Quality', experience: '1–2 Years', qualification: 'Diploma in Civil', location: 'PAN India' },
  { id: 21, title: 'Structural Engineer', department: 'Design', experience: '5–8 Years', qualification: 'ME – Structural', location: 'PAN India' },
  { id: 22, title: 'MEP Engineer', department: 'MEP', experience: '3–5 Years', qualification: 'BE – Mechanical/Electrical', location: 'PAN India' },
  { id: 23, title: 'Store Keeper', department: 'Stores', experience: '2–4 Years', qualification: 'Any Graduate', location: 'PAN India' },
  { id: 24, title: 'HR Executive', department: 'HR', experience: '1–3 Years', qualification: 'MBA – HR', location: 'PAN India' },
  { id: 25, title: 'Accountant', department: 'Accounts', experience: '2–4 Years', qualification: 'B.Com/M.Com', location: 'PAN India' },
  { id: 26, title: 'Draftsman', department: 'Design', experience: '2–5 Years', qualification: 'ITI/Diploma in Drafting', location: 'PAN India' },
  { id: 27, title: 'Plant Operator', department: 'Operations', experience: '1–3 Years', qualification: 'ITI/Diploma', location: 'PAN India' },
];

const columns = ['Job Title', 'Department', 'Experience', 'Qualification', 'Location', 'Action'];

const CurrentOpeningsSection: React.FC<Props> = ({ onApplyNow, openings, title }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const itemsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  const allJobs = openings && openings.length > 0 ? openings : defaultJobOpenings;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, departmentFilter]);

  const departments = Array.from(new Set(allJobs.map(job => job.department))).sort();

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = (job.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === '' || job.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const totalEntries = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / itemsPerPage));
  
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startEntry = totalEntries === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      if (totalPages > 1) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <section className="current-openings-section">
      <div className="current-openings-container">
        
        {/* Section Header */}
        <div className="openings-header">
          <h2 className="openings-title">
            Current <span style={{ color: '#FF6B35' }}>Openings</span>
          </h2>
          <div className="openings-divider" />
        </div>

        {/* Filters Section */}
        <div className="openings-filter-card">
          {/* Search Input */}
          <div className="openings-search-wrap">
            <Search size={18} color="#64748B" className="search-icon" />
            <input
              type="text"
              placeholder="Search job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="openings-search-input"
            />
          </div>

          {/* Department Filter */}
          <div className="openings-select-wrap">
            <Filter size={18} color="#64748B" className="filter-icon" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="openings-select"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="select-arrow">
              <ChevronDown size={16} color="#64748B" />
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="openings-content-box">
          
          {/* 1. Mobile Cards View (CSS handled, zero hydration flash) */}
          <div className="openings-mobile-cards">
            {paginatedJobs.length === 0 ? (
              <div className="no-jobs-box">
                <p>No job openings found matching your criteria.</p>
              </div>
            ) : (
              paginatedJobs.map((job) => (
                <div key={job.id} className="opening-mobile-card">
                  <div className="opening-mobile-card-header">
                    <div className="opening-mobile-title-wrap">
                      <Briefcase size={16} color="#FF6B35" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span className="opening-mobile-title">{job.title}</span>
                    </div>
                    <span className="opening-dept-badge">{job.department}</span>
                  </div>

                  <div className="opening-mobile-meta-grid">
                    <div className="opening-meta-item">
                      <Clock size={13} color="#64748B" style={{ flexShrink: 0 }} />
                      <span className="meta-text">{job.experience}</span>
                    </div>
                    <div className="opening-meta-item">
                      <MapPin size={13} color="#64748B" style={{ flexShrink: 0 }} />
                      <span className="meta-text">{job.location}</span>
                    </div>
                    <div className="opening-meta-item full-width">
                      <GraduationCap size={13} color="#64748B" style={{ flexShrink: 0 }} />
                      <span className="meta-text">{job.qualification}</span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => onApplyNow(job.title)}
                    className="opening-apply-btn"
                  >
                    Apply Now
                  </button>
                </div>
              ))
            )}
          </div>

          {/* 2. Desktop Table View */}
          <div className="openings-desktop-table">
            {paginatedJobs.length === 0 ? (
              <div className="no-jobs-box">
                <p>No job openings found matching your criteria.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px' }}>
                  <thead>
                    <tr style={{ height: '44px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E5EAF2' }}>
                      {columns.map((col, index) => (
                        <th key={index} style={{
                          fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                          color: '#1E2A5A', padding: '0 16px', textAlign: 'left', whiteSpace: 'nowrap',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedJobs.map((job) => (
                      <tr 
                        key={job.id} 
                        style={{ 
                          height: '46px', 
                          borderBottom: '1px solid #EEF2F7', 
                          backgroundColor: hoveredRow === job.id ? '#FAFBFD' : '#FFFFFF', 
                        }}
                        onMouseEnter={() => setHoveredRow(job.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td style={{ padding: '0 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <Briefcase size={14} color="#64748B" />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E2A5A', fontFamily: 'Inter, sans-serif' }}>{job.title}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '13px', fontWeight: 500, color: '#475569', padding: '0 16px', fontFamily: 'Inter, sans-serif' }}>{job.department}</td>
                        <td style={{ fontSize: '13px', fontWeight: 500, color: '#475569', padding: '0 16px', fontFamily: 'Inter, sans-serif' }}>{job.experience}</td>
                        <td style={{ fontSize: '13px', fontWeight: 500, color: '#475569', padding: '0 16px', fontFamily: 'Inter, sans-serif' }}>{job.qualification}</td>
                        <td style={{ fontSize: '13px', fontWeight: 500, color: '#475569', padding: '0 16px', fontFamily: 'Inter, sans-serif' }}>{job.location}</td>
                        <td style={{ padding: '0 16px' }}>
                          <button 
                            type="button"
                            onClick={() => onApplyNow(job.title)}
                            style={{
                              height: '30px', 
                              padding: '0 14px', 
                              backgroundColor: '#1E2A5A', 
                              color: '#FFFFFF',
                              border: 'none', 
                              borderRadius: '5px', 
                              fontSize: '12px', 
                              fontWeight: 600, 
                              cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif', 
                              transition: 'none',
                            }}
                          >
                            Apply Now
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="openings-footer">
            <span className="openings-entries-count">
              Showing {startEntry}-{endEntry} of {totalEntries} entries
            </span>

            {totalPages > 1 && (
              <div className="openings-pagination-btns">
                <button 
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="page-step-btn"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={15} color="#1E2A5A" />
                </button>

                {getPageNumbers().map((page, index) => (
                  page === 'ellipsis' ? (
                    <span key={`e-${index}`} className="page-ellipsis">...</span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`page-index-btn ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  )
                ))}

                <button 
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="page-step-btn"
                  aria-label="Next page"
                >
                  <ChevronRight size={15} color="#1E2A5A" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        .current-openings-section {
          width: 100%;
          padding: 10px 0 20px 0;
          font-family: 'Inter', sans-serif;
        }
        .current-openings-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
        }
        .openings-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .openings-title {
          font-size: clamp(24px, 3.5vw, 32px);
          font-weight: 700;
          color: #1E2A5A;
          margin: 0 0 8px 0;
          line-height: 1.2;
          letter-spacing: -0.4px;
          font-family: 'Inter', sans-serif;
        }
        .openings-divider {
          width: 40px;
          height: 3px;
          background-color: #FF6B35;
          border-radius: 999px;
          margin: 0 auto;
        }

        /* Filter Section */
        .openings-filter-card {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          background-color: #FFFFFF;
          padding: 16px 20px;
          border-radius: 12px;
          border: 1px solid #E5EAF2;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.02);
          box-sizing: border-box;
        }
        .openings-search-wrap {
          flex: 1;
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .openings-search-input {
          width: 100%;
          height: 44px;
          padding: 0 16px 0 42px;
          border-radius: 8px;
          border: 1px solid #E5EAF2;
          font-size: 14px;
          color: #1E2A5A;
          outline: none;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          background-color: #FAFBFC;
        }
        .openings-search-input:focus {
          border-color: #FF6B35;
          background-color: #FFFFFF;
        }

        .openings-select-wrap {
          flex: 0 0 280px;
          position: relative;
        }
        .filter-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .openings-select {
          width: 100%;
          height: 44px;
          padding: 0 36px 0 42px;
          border-radius: 8px;
          border: 1px solid #E5EAF2;
          font-size: 14px;
          color: #1E2A5A;
          outline: none;
          box-sizing: border-box;
          background-color: #FAFBFC;
          cursor: pointer;
          appearance: none;
          font-family: 'Inter', sans-serif;
        }
        .openings-select:focus {
          border-color: #FF6B35;
          background-color: #FFFFFF;
        }
        .select-arrow {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        /* Content Box */
        .openings-content-box {
          background-color: #FFFFFF;
          border: 1px solid #E5EAF2;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(15, 23, 42, 0.03);
          box-sizing: border-box;
        }

        /* Desktop Table View */
        .openings-desktop-table {
          display: block;
        }
        .openings-mobile-cards {
          display: none;
        }

        .no-jobs-box {
          padding: 36px 20px;
          text-align: center;
          color: #64748B;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
        }

        /* Mobile Card Styling */
        .opening-mobile-card {
          background-color: #FFFFFF;
          border: 1px solid #EEF2F7;
          border-radius: 12px;
          padding: 16px 14px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-sizing: border-box;
          transition: none !important;
        }
        .opening-mobile-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }
        .opening-mobile-title-wrap {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          min-width: 0;
          flex: 1;
        }
        .opening-mobile-title {
          font-size: 15px;
          font-weight: 700;
          color: #1E2A5A;
          line-height: 1.35;
          font-family: 'Inter', sans-serif;
        }
        .opening-dept-badge {
          font-size: 11px;
          font-weight: 700;
          color: #FF6B35;
          background: #FFF4EE;
          padding: 3px 9px;
          border-radius: 6px;
          flex-shrink: 0;
          font-family: 'Inter', sans-serif;
        }
        .opening-mobile-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          background: #F8FAFC;
          border: 1px solid #EEF2F7;
          border-radius: 8px;
          padding: 10px 12px;
          box-sizing: border-box;
        }
        .opening-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }
        .opening-meta-item.full-width {
          grid-column: span 2;
        }
        .meta-text {
          font-size: 12px;
          color: #475569;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: 'Inter', sans-serif;
        }
        .opening-apply-btn {
          width: 100%;
          height: 42px;
          background-color: #1E2A5A;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: none !important;
        }

        /* Footer & Pagination */
        .openings-footer {
          min-height: 52px;
          border-top: 1px solid #E5EAF2;
          background-color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          box-sizing: border-box;
          gap: 12px;
        }
        .openings-entries-count {
          font-size: 13px;
          font-weight: 500;
          color: #64748B;
          font-family: 'Inter', sans-serif;
        }
        .openings-pagination-btns {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }
        .page-step-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #E5EAF2;
          background-color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: none !important;
        }
        .page-step-btn:disabled {
          background-color: #F8FAFC;
          cursor: not-allowed;
          opacity: 0.5;
        }
        .page-index-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #E5EAF2;
          background-color: #FFFFFF;
          color: #1E2A5A;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: none !important;
          font-family: 'Inter', sans-serif;
        }
        .page-index-btn.active {
          border: none;
          background-color: #FF6B35;
          color: #FFFFFF;
        }
        .page-ellipsis {
          width: 28px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: #64748B;
        }

        /* Mobile Breakpoint (<= 768px) */
        @media (max-width: 768px) {
          .current-openings-container {
            padding: 0 12px !important;
          }
          .openings-filter-card {
            flex-direction: column !important;
            gap: 10px !important;
            padding: 14px !important;
            border-radius: 10px !important;
          }
          .openings-select-wrap {
            flex: 1 1 100% !important;
          }
          .openings-content-box {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }
          .openings-desktop-table {
            display: none !important;
          }
          .openings-mobile-cards {
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
          }
          .openings-footer {
            flex-direction: column !important;
            align-items: center !important;
            border-top: none !important;
            background-color: transparent !important;
            padding: 16px 0 0 0 !important;
            gap: 12px !important;
          }
          .openings-pagination-btns {
            justify-content: center !important;
          }
        }

        /* Extra small phones (<= 380px) */
        @media (max-width: 380px) {
          .current-openings-container {
            padding: 0 10px !important;
          }
          .opening-mobile-card {
            padding: 14px 12px !important;
          }
          .opening-mobile-title {
            font-size: 14px !important;
          }
          .meta-text {
            font-size: 11px !important;
          }
          .page-index-btn, .page-step-btn {
            width: 28px !important;
            height: 28px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CurrentOpeningsSection;