import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronLeft, ChevronRight, Search, Filter, ChevronDown } from 'lucide-react';

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
  onApplyNow: (position: string) => void;
}

// Job Data
const jobOpenings: JobOpening[] = [
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

const CurrentOpeningsSection: React.FC<Props> = ({ onApplyNow }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const itemsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, departmentFilter]);

  const departments = Array.from(new Set(jobOpenings.map(job => job.department))).sort();

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === '' || job.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const totalEntries = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / itemsPerPage));
  
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startEntry = ((currentPage - 1) * itemsPerPage) + 1;
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
    <section style={{ width: '100%', marginTop: isMobile ? '10px' : '15px', marginBottom: isMobile ? '40px' : '60px' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        margin: '0 auto',
        paddingLeft: isMobile ? '16px' : '20px', 
        paddingRight: isMobile ? '16px' : '20px',
        boxSizing: 'border-box'
      }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '20px' : '25px' }}>
          <h2 style={{
            fontSize: isMobile ? '26px' : '32px',
            fontWeight: 700,
            color: '#1E2A5A',
            margin: '0 0 8px 0',
            lineHeight: 1.2,
          }}>
            Current <span style={{ color: '#FF6B35' }}>Openings</span>
          </h2>
          <div style={{
            width: '40px',
            height: '3px',
            backgroundColor: '#FF6B35',
            borderRadius: '999px',
            margin: '0 auto',
          }} />
        </div>

        {/* Filters Section */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          gap: '16px', 
          marginBottom: '24px',
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #E5EAF2',
          boxShadow: '0 2px 12px rgba(15,23,42,0.02)'
        }}>
          {/* Search Input */}
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} color="#64748B" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '46px',
                padding: '0 16px 0 44px',
                borderRadius: '8px',
                border: '1px solid #E5EAF2',
                fontSize: '14px',
                color: '#1E2A5A',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
              onBlur={(e) => e.target.style.borderColor = '#E5EAF2'}
            />
          </div>

          {/* Department Filter */}
          <div style={{ flex: isMobile ? '1' : '0 0 300px', position: 'relative' }}>
            <Filter size={18} color="#64748B" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{
                width: '100%',
                height: '46px',
                padding: '0 16px 0 44px',
                borderRadius: '8px',
                border: '1px solid #E5EAF2',
                fontSize: '14px',
                color: '#1E2A5A',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                appearance: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
              onBlur={(e) => e.target.style.borderColor = '#E5EAF2'}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <ChevronDown size={16} color="#64748B" />
            </div>
          </div>
        </div>

        {/* Container */}
        <div style={{
          backgroundColor: isMobile ? 'transparent' : '#FFFFFF',
          border: isMobile ? 'none' : '1px solid #E5EAF2',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: isMobile ? 'none' : '0 2px 12px rgba(15,23,42,0.03)',
        }}>
          
          {isMobile ? (
            /* Mobile Cards */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paginatedJobs.map((job) => (
                <div key={job.id} style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5EAF2',
                  borderRadius: '10px',
                  padding: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                    <Briefcase size={16} color="#FF6B35" style={{ marginTop: '1px', flexShrink: 0 }} />
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#1E2A5A', lineHeight: 1.3 }}>
                      {job.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#64748B' }}>Department:</span>
                      <span style={{ color: '#1E2A5A', fontWeight: 600 }}>{job.department}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#64748B' }}>Experience:</span>
                      <span style={{ color: '#475569', fontWeight: 500 }}>{job.experience}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#64748B' }}>Qualification:</span>
                      <span style={{ color: '#475569', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{job.qualification}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#64748B' }}>Location:</span>
                      <span style={{ color: '#475569', fontWeight: 500 }}>{job.location}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onApplyNow(job.title)}  // 🔥 CALL PARENT FUNCTION
                    style={{
                      width: '100%',
                      height: '34px',
                      backgroundColor: '#1E2A5A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Desktop Table */
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px' }}>
                <thead>
                  <tr style={{ height: '44px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E5EAF2' }}>
                    {columns.map((col, index) => (
                      <th key={index} style={{
                        fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                        color: '#1E2A5A', padding: '0 16px', textAlign: 'left', whiteSpace: 'nowrap',
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
                        transition: 'background 200ms',
                      }}
                      onMouseEnter={() => setHoveredRow(job.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={{ padding: '0 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <Briefcase size={14} color="#64748B" />
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E2A5A' }}>{job.title}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px', fontWeight: 500, color: '#475569', padding: '0 16px' }}>{job.department}</td>
                      <td style={{ fontSize: '13px', fontWeight: 500, color: '#475569', padding: '0 16px' }}>{job.experience}</td>
                      <td style={{ fontSize: '13px', fontWeight: 500, color: '#475569', padding: '0 16px' }}>{job.qualification}</td>
                      <td style={{ fontSize: '13px', fontWeight: 500, color: '#475569', padding: '0 16px' }}>{job.location}</td>
                      <td style={{ padding: '0 16px' }}>
                        <button 
                          onClick={() => onApplyNow(job.title)}  // 🔥 CALL PARENT FUNCTION
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

          {/* Footer */}
          <div style={{
            height: '50px',
            borderTop: isMobile ? 'none' : '1px solid #E5EAF2',
            backgroundColor: isMobile ? 'transparent' : '#FFFFFF',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '20px 0 0 0' : '0 16px',
            gap: isMobile ? '12px' : '0',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>
              Showing {startEntry}-{endEntry} of {totalEntries} entries
            </span>

            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    width: '32px', height: '32px', borderRadius: '6px', 
                    border: '1px solid #E5EAF2',
                    backgroundColor: currentPage === 1 ? '#F8FAFC' : '#FFFFFF', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1,
                  }}
                >
                  <ChevronLeft size={14} color="#1E2A5A" />
                </button>

                {getPageNumbers().map((page, index) => (
                  page === 'ellipsis' ? (
                    <span key={`e-${index}`} style={{ 
                      width: '32px', height: '32px', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', color: '#64748B',
                    }}>...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: '32px', height: '32px', borderRadius: '6px', 
                        border: currentPage === page ? 'none' : '1px solid #E5EAF2',
                        backgroundColor: currentPage === page ? '#FF6B35' : '#FFFFFF', 
                        color: currentPage === page ? '#FFFFFF' : '#1E2A5A', 
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      {page}
                    </button>
                  )
                ))}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    width: '32px', height: '32px', borderRadius: '6px', 
                    border: '1px solid #E5EAF2',
                    backgroundColor: currentPage === totalPages ? '#F8FAFC' : '#FFFFFF', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                  }}
                >
                  <ChevronRight size={14} color="#1E2A5A" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CurrentOpeningsSection;