import React, { useState } from 'react';
import { Send, Mail, Phone, Users, Building2 } from 'lucide-react';

// Types
interface FormData {
  fullName: string;
  phone: string;
  email: string;
  qualification: string;
  currentSalary: string;
  position: string;
  location: string;
  relocate: string;
  noticePeriod: string;
  description: string;
}

interface InfoItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  value: string;
}

// Info Data
const infoItems: InfoItem[] = [
  {
    id: 'email',
    icon: <Mail size={22} />,
    title: 'Email',
    value: 'careers@pislinfra.com',
  },
  {
    id: 'phone',
    icon: <Phone size={22} />,
    title: 'Phone',
    value: '082870 40111 | 070328 02501',
  },
  {
    id: 'culture',
    icon: <Users size={22} />,
    title: 'Work Culture',
    value: 'Collaborative • Inclusive • Growth-Oriented',
  },
  {
    id: 'environment',
    icon: <Building2 size={22} />,
    title: 'Work Environment',
    value: 'Modern Infrastructure • Innovation • Safety First',
  },
];

// Input Style
const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '48px',
  border: '1px solid #DCE3EC',
  borderRadius: '8px',
  backgroundColor: '#FFFFFF',
  padding: '0 14px',
  fontSize: '14px',
  color: '#1E2A5A',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 500,
  color: '#334155',
  marginBottom: '6px',
};

// Main Component
const CareerApplicationSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    qualification: '',
    currentSalary: '',
    position: '',
    location: '',
    relocate: '',
    noticePeriod: '',
    description: '',
  });

  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'description') setCharCount(value.length);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#FF6B35';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#DCE3EC';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section style={{ width: '100%', marginTop: '70px', marginBottom: '80px' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1350px', 
        margin: '0 auto',
        paddingLeft: '8px', 
        paddingRight: '8px',
      }}>
        
        <div className="application-grid">
          
          {/* LEFT - Application Form */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5EAF2',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
          }}>
            {/* Form Header */}
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#1E2A5A',
                margin: '0 0 6px 0',
              }}>
                Apply For a Position
              </h2>
              <p style={{
                fontSize: '15px',
                color: '#64748B',
                margin: 0,
              }}>
                Fill out the details below to apply for a position.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                
                {/* Full Name */}
                <div>
                  <label style={labelStyle}>Full Name <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" name="fullName" value={formData.fullName}
                    onChange={handleChange} placeholder="Enter your full name"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                {/* Phone Number */}
                <div>
                  <label style={labelStyle}>Phone Number <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="tel" name="phone" value={formData.phone}
                    onChange={handleChange} placeholder="Enter your phone number"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="Enter your email"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                {/* Qualification */}
                <div>
                  <label style={labelStyle}>Qualification</label>
                  <input type="text" name="qualification" value={formData.qualification}
                    onChange={handleChange} placeholder="BE – Civil | PGP Advantage"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                {/* Current Salary */}
                <div>
                  <label style={labelStyle}>Current Salary (CTC per annum) <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" name="currentSalary" value={formData.currentSalary}
                    onChange={handleChange} placeholder="Enter your current salary"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                {/* Position */}
                <div>
                  <label style={labelStyle}>Position Applying For <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" name="position" value={formData.position}
                    onChange={handleChange} placeholder="Sr. Planning Engineer"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                {/* Current Location */}
                <div>
                  <label style={labelStyle}>Current Location <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" name="location" value={formData.location}
                    onChange={handleChange} placeholder="Enter your current location"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                {/* Can you relocate? */}
                <div>
                  <label style={labelStyle}>Can you relocate? <span style={{ color: '#EF4444' }}>*</span></label>
                  <select name="relocate" value={formData.relocate}
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Notice Period */}
                <div>
                  <label style={labelStyle}>Notice Period <span style={{ color: '#EF4444' }}>*</span></label>
                  <select name="noticePeriod" value={formData.noticePeriod}
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select notice period</option>
                    <option value="immediate">Immediate</option>
                    <option value="15days">15 Days</option>
                    <option value="30days">30 Days</option>
                    <option value="60days">60 Days</option>
                    <option value="90days">90 Days</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginTop: '16px' }}>
                <label style={labelStyle}>Short Description</label>
                <div style={{ position: 'relative' }}>
                  <textarea name="description" value={formData.description}
                    onChange={handleChange}
                    placeholder="Briefly describe your experience and why you're a great fit for this role..."
                    maxLength={500}
                    rows={4}
                    style={{
                      ...inputStyle,
                      height: '110px',
                      padding: '14px',
                      resize: 'vertical',
                    }}
                    onFocus={handleFocus} onBlur={handleBlur} />
                  <span style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '12px',
                    fontSize: '12px',
                    color: '#94A3B8',
                    backgroundColor: '#FFFFFF',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}>
                    {charCount}/500
                  </span>
                </div>
              </div>

              {/* Resume Upload */}
              <div style={{ marginTop: '16px' }}>
                <label style={labelStyle}>Upload Resume (PDF/DOC/DOCX – Max 5MB)</label>
                <div style={{ position: 'relative' }}>
                  <input type="file" accept=".pdf,.doc,.docx"
                    style={{
                      width: '100%',
                      height: '48px',
                      border: '1px solid #DCE3EC',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      padding: '12px 14px',
                      fontSize: '14px',
                      color: '#64748B',
                      outline: 'none',
                      fontFamily: 'Inter, sans-serif',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                    }} />
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: '24px' }}>
                <button type="submit" style={{
                  height: '48px',
                  width: '260px',
                  backgroundColor: '#FF6B35',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F45A22'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FF6B35'; }}>
                  SUBMIT APPLICATION <Send size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT - Contact Info Card */}
          <div style={{
            background: 'linear-gradient(180deg, #081C66 0%, #0B1450 100%)',
            borderRadius: '16px',
            padding: '32px',
            color: '#FFFFFF',
            height: '100%',
          }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#FF6B35',
                margin: '0 0 4px 0',
              }}>
                Have Questions?
              </h3>
              <h2 style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: '0 0 12px 0',
              }}>
                We're Here to Help!
              </h2>
              <p style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                Reach out to our recruitment team for any queries related to careers at PISL.
              </p>
            </div>

            {/* Info Items */}
            <div style={{ display: 'grid', gap: '24px' }}>
              {infoItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    minWidth: '48px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ color: '#FF6B35', display: 'flex', lineHeight: 0 }}>
                      {item.icon}
                    </span>
                  </div>

                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.75)',
                      margin: '0 0 2px 0',
                    }}>
                      {item.title}
                    </p>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      margin: 0,
                      lineHeight: 1.4,
                    }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        .application-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 16px;
        }
        @media (min-width: 640px) {
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .form-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1100px) {
          .application-grid {
            grid-template-columns: 1.8fr 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default CareerApplicationSection;