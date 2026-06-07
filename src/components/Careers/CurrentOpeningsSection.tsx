import React from 'react';
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

// Types
interface JobOpening {
  id: number;
  title: string;
  department: string;
  experience: string;
  qualification: string;
  location: string;
}

// Job Data
const jobOpenings: JobOpening[] = [
  {
    id: 1,
    title: 'Planning & MIS Engineer',
    department: 'Civil',
    experience: '2–4 Years',
    qualification: 'BE – Civil',
    location: 'PAN India',
  },
  {
    id: 2,
    title: 'Planning & MIS Manager',
    department: 'Civil',
    experience: '8–12 Years',
    qualification: 'BE – Civil | PGP Advantage',
    location: 'PAN India',
  },
  {
    id: 3,
    title: 'Costing Engineer',
    department: 'Civil',
    experience: '0–3 Years',
    qualification: 'BE – Civil',
    location: 'PAN India',
  },
  {
    id: 4,
    title: 'Costing Manager',
    department: 'Civil',
    experience: '10–12 Years',
    qualification: 'BE – Civil | PGP Advantage',
    location: 'PAN India',
  },
  {
    id: 5,
    title: 'Planning Engineer',
    department: 'Planning',
    experience: '2–4 Years',
    qualification: 'Diploma or BE in Civil',
    location: 'PAN India',
  },
  {
    id: 6,
    title: 'Sr. Planning Engineer',
    department: 'Planning',
    experience: '5–7 Years',
    qualification: 'Diploma or BE in Civil',
    location: 'PAN India',
  },
  {
    id: 7,
    title: 'Billing Engineer',
    department: 'Billing',
    experience: '2–4 Years',
    qualification: 'Diploma or BE in Civil',
    location: 'PAN India',
  },
  {
    id: 8,
    title: 'Sr. Billing Engineer',
    department: 'Billing',
    experience: '8–12 Years',
    qualification: 'Diploma or BE in Civil',
    location: 'PAN India',
  },
  {
    id: 9,
    title: 'Surveyor',
    department: 'Survey',
    experience: '1–3 Years',
    qualification: 'ITI or Diploma in Surveying',
    location: 'PAN India',
  },
  {
    id: 10,
    title: 'Asst. Surveyor',
    department: 'Survey',
    experience: '2–4 Years',
    qualification: 'ITI or Diploma in Surveying',
    location: 'PAN India',
  },
];

// Table Header Columns
const columns = [
  'Job Title',
  'Department',
  'Experience',
  'Qualification',
  'Location',
  'Action',
];

// Main Component
const CurrentOpeningsSection: React.FC = () => {
  return (
    <section style={{ width: '100%', marginTop: '70px', marginBottom: '70px' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1350px', 
        margin: '0 auto',
        paddingLeft: '8px', 
        paddingRight: '8px',
      }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: 700,
            color: '#1E2A5A',
            margin: '0 0 16px 0',
            lineHeight: 1.2,
          }}>
            Current <span style={{ color: '#FF6B35' }}>Openings</span>
          </h2>
          
          {/* Orange Underline */}
          <div style={{
            width: '60px',
            height: '4px',
            backgroundColor: '#FF6B35',
            borderRadius: '999px',
            margin: '0 auto',
          }} />
        </div>

        {/* Table Wrapper */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5EAF2',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
        }}>
          
          {/* Scrollable Table Container */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              
              {/* Table Header */}
              <thead>
                <tr style={{
                  height: '56px',
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid #E5EAF2',
                }}>
                  {columns.map((col, index) => (
                    <th key={index} style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: '#1E2A5A',
                      padding: '0 20px',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {jobOpenings.map((job) => (
                  <tr key={job.id} style={{
                    height: '58px',
                    borderBottom: '1px solid #EEF2F7',
                    backgroundColor: '#FFFFFF',
                    transition: 'background 200ms',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAFBFD'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}>
                    
                    {/* Job Title */}
                    <td style={{ padding: '0 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Briefcase size={16} color="#64748B" />
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#1E2A5A',
                        }}>
                          {job.title}
                        </span>
                      </div>
                    </td>

                    {/* Department */}
                    <td style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#475569',
                      padding: '0 20px',
                    }}>
                      {job.department}
                    </td>

                    {/* Experience */}
                    <td style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#475569',
                      padding: '0 20px',
                    }}>
                      {job.experience}
                    </td>

                    {/* Qualification */}
                    <td style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#475569',
                      padding: '0 20px',
                    }}>
                      {job.qualification}
                    </td>

                    {/* Location */}
                    <td style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#475569',
                      padding: '0 20px',
                    }}>
                      {job.location}
                    </td>

                    {/* Apply Button */}
                    <td style={{ padding: '0 20px' }}>
                      <button style={{
                        height: '34px',
                        padding: '0 16px',
                        backgroundColor: '#1E2A5A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'background 200ms',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#152048'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1E2A5A'; }}>
                        Apply Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div style={{
            height: '64px',
            borderTop: '1px solid #E5EAF2',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
          }}>
            {/* Showing entries */}
            <span style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#64748B',
            }}>
              Showing 1-10 of 27 entries
            </span>

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid #E5EAF2',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 200ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}>
                <ChevronLeft size={16} color="#1E2A5A" />
              </button>

              <button style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#FF6B35',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}>
                1
              </button>

              <button style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid #E5EAF2',
                backgroundColor: '#FFFFFF',
                color: '#1E2A5A',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'background 200ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}>
                2
              </button>

              <button style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid #E5EAF2',
                backgroundColor: '#FFFFFF',
                color: '#1E2A5A',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'background 200ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}>
                3
              </button>

              <button style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid #E5EAF2',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 200ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}>
                <ChevronRight size={16} color="#1E2A5A" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CurrentOpeningsSection;