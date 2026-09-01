import React, { useState, useRef, useEffect } from 'react';
import { Send, Mail, Phone, Users, Building2, CheckCircle, ChevronDown } from 'lucide-react';

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

// Job Positions List
const defaultJobPositions: string[] = [
  'Planning & MIS Engineer',
  'Planning & MIS Manager',
  'Costing Engineer',
  'Costing Manager',
  'Planning Engineer',
  'Sr. Planning Engineer',
  'Billing Engineer',
  'Sr. Billing Engineer',
  'Surveyor',
  'Asst. Surveyor',
  'Project Manager',
  'Site Supervisor',
  'Quality Control Engineer',
  'Safety Officer',
  'Procurement Engineer',
  'Design Engineer',
  'Site Engineer',
  'Contract Manager',
  'Estimation Engineer',
  'Lab Technician',
  'Structural Engineer',
  'MEP Engineer',
  'Store Keeper',
  'HR Executive',
  'Accountant',
  'Draftsman',
  'Plant Operator',
];

// Info Data
const infoItems: InfoItem[] = [
  {
    id: 'email',
    icon: <Mail size={20} />,
    title: 'Email',
    value: 'careers@pislinfra.com',
  },
  {
    id: 'phone',
    icon: <Phone size={20} />,
    title: 'Phone',
    value: '085270 40411',
  },
  {
    id: 'culture',
    icon: <Users size={20} />,
    title: 'Work Culture',
    value: 'Collaborative • Inclusive • Growth-Oriented',
  },
  {
    id: 'environment',
    icon: <Building2 size={20} />,
    title: 'Work Environment',
    value: 'Modern Infrastructure • Innovation • Safety First',
  },
];

// Initial Form State
const initialFormData: FormData = {
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
};

interface Props {
  jobPositionsList?: string[];
  title?: string;
  subtitle?: string;
  preSelectedPosition?: string;
}

// Main Component
const CareerApplicationSection: React.FC<Props> = ({ preSelectedPosition, jobPositionsList, title, subtitle }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    if (preSelectedPosition) {
      setFormData(prev => ({ ...prev, position: preSelectedPosition }));
    }
  }, [preSelectedPosition]);
  const [charCount, setCharCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'description') setCharCount(value.length);
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone.trim())) newErrors.phone = 'Enter valid phone number';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Enter valid email';
    if (!formData.currentSalary.trim()) newErrors.currentSalary = 'Current salary is required';
    if (!formData.position) newErrors.position = 'Please select a position';
    if (!formData.location.trim()) newErrors.location = 'Current location is required';
    if (!formData.relocate) newErrors.relocate = 'Please select an option';
    if (!formData.noticePeriod) newErrors.noticePeriod = 'Please select notice period';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('qualification', formData.qualification);
      formDataToSend.append('currentSalary', formData.currentSalary);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('relocate', formData.relocate);
      formDataToSend.append('noticePeriod', formData.noticePeriod);
      formDataToSend.append('description', formData.description);
      
      if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
        formDataToSend.append('resume', fileInputRef.current.files[0]);
      }
      
      const response = await fetch('/send-career-email.php', {
        method: 'POST',
        body: formDataToSend
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmittedName(formData.fullName);
        setSubmitted(true);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        setTimeout(() => {
          setFormData(initialFormData);
          setCharCount(0);
          setErrors({});
          setSubmitted(false);
          setSubmittedName('');
        }, 3000);
      } else {
        setSubmitError(result.message || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input Styles
  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '46px',
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

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: '40px',
  };

  const errorInputStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: '#EF4444',
    backgroundColor: '#FFF5F5',
  };

  const errorSelectStyle: React.CSSProperties = {
    ...selectStyle,
    borderColor: '#EF4444',
    backgroundColor: '#FFF5F5',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: '#334155',
    marginBottom: '5px',
  };

  // Thank You Screen
  if (submitted) {
    return (
      <section style={{ width: '100%', marginTop: '20px', marginBottom: '40px', padding: '0 16px', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5EAF2',
            borderRadius: '16px',
            padding: '48px 32px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#F0FFF4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle size={36} color="#22C55E" />
            </div>
            
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#1E2A5A',
              margin: '0 0 8px 0',
            }}>
              Thank You, {submittedName}! 🎉
            </h2>
            
            <p style={{
              fontSize: '15px',
              color: '#64748B',
              margin: '0',
              lineHeight: 1.6,
            }}>
              Your application has been submitted successfully. Our recruitment team will review your profile and get back to you shortly.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ 
      width: '100%', 
      marginTop: '20px', 
      marginBottom: '40px',
      padding: '0 16px',
      boxSizing: 'border-box',
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        margin: '0 auto',
      }}>
        
        <div className="application-grid">
          
          {/* LEFT - Application Form */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5EAF2',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
          }}>
            {/* Form Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#1E2A5A',
                margin: '0 0 4px 0',
              }}>
                {title || 'Apply For a Position'}
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#64748B',
                margin: 0,
              }}>
                {subtitle || 'Fill out the details below to apply for a position.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {submitError && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', color: '#DC2626', fontSize: '13px', marginBottom: '16px' }}>
                  {submitError}
                </div>
              )}

              <div className="form-grid">
                
                {/* Full Name */}
                <div>
                  <label style={labelStyle}>
                    Full Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName}
                    onChange={handleChange} 
                    placeholder="Enter your full name"
                    style={errors.fullName ? errorInputStyle : inputStyle} 
                    data-error={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label style={labelStyle}>
                    Phone Number <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange} 
                    placeholder="Enter your phone number"
                    style={errors.phone ? errorInputStyle : inputStyle}
                    data-error={!!errors.phone}
                  />
                  {errors.phone && (
                    <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{errors.phone}</span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>
                    Email <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange} 
                    placeholder="Enter your email"
                    style={errors.email ? errorInputStyle : inputStyle}
                    data-error={!!errors.email}
                  />
                  {errors.email && (
                    <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{errors.email}</span>
                  )}
                </div>

                {/* Qualification */}
                <div>
                  <label style={labelStyle}>Qualification</label>
                  <input 
                    type="text" 
                    name="qualification" 
                    value={formData.qualification}
                    onChange={handleChange} 
                    placeholder="BE – Civil | PGP Advantage"
                    style={inputStyle} 
                  />
                </div>

                {/* Current Salary */}
                <div>
                  <label style={labelStyle}>
                    Current Salary (CTC p.a.) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="currentSalary" 
                    value={formData.currentSalary}
                    onChange={handleChange} 
                    placeholder="Enter your current salary"
                    style={errors.currentSalary ? errorInputStyle : inputStyle}
                    data-error={!!errors.currentSalary}
                  />
                  {errors.currentSalary && (
                    <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{errors.currentSalary}</span>
                  )}
                </div>

                {/* Position */}
                <div>
                  <label style={labelStyle}>
                    Position Applying For <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select 
                      name="position" 
                      value={formData.position}
                      onChange={handleChange}
                      style={errors.position ? errorSelectStyle : selectStyle}
                      data-error={!!errors.position}
                    >
                      <option value="">-- Select Position --</option>
                      {(jobPositionsList || defaultJobPositions).map((position) => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', lineHeight: 0 }}>
                      <ChevronDown size={16} color="#64748B" />
                    </span>
                  </div>
                  {errors.position && (
                    <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{errors.position}</span>
                  )}
                </div>

                {/* Current Location */}
                <div>
                  <label style={labelStyle}>
                    Current Location <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input 
                    type="text" name="location" value={formData.location}
                    onChange={handleChange} placeholder="Enter your current location"
                    style={errors.location ? errorInputStyle : inputStyle}
                    data-error={!!errors.location}
                  />
                  {errors.location && (
                    <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{errors.location}</span>
                  )}
                </div>

                {/* Relocate */}
                <div>
                  <label style={labelStyle}>
                    Can you relocate? <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select name="relocate" value={formData.relocate}
                      onChange={handleChange}
                      style={errors.relocate ? errorSelectStyle : selectStyle}
                      data-error={!!errors.relocate}>
                      <option value="">Select option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', lineHeight: 0 }}>
                      <ChevronDown size={16} color="#64748B" />
                    </span>
                  </div>
                  {errors.relocate && (
                    <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{errors.relocate}</span>
                  )}
                </div>

                {/* Notice Period */}
                <div>
                  <label style={labelStyle}>
                    Notice Period <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select name="noticePeriod" value={formData.noticePeriod}
                      onChange={handleChange}
                      style={errors.noticePeriod ? errorSelectStyle : selectStyle}
                      data-error={!!errors.noticePeriod}>
                      <option value="">Select notice period</option>
                      <option value="immediate">Immediate</option>
                      <option value="15days">15 Days</option>
                      <option value="30days">30 Days</option>
                      <option value="60days">60 Days</option>
                      <option value="90days">90 Days</option>
                    </select>
                    <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', lineHeight: 0 }}>
                      <ChevronDown size={16} color="#64748B" />
                    </span>
                  </div>
                  {errors.noticePeriod && (
                    <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{errors.noticePeriod}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginTop: '14px' }}>
                <label style={labelStyle}>Short Description</label>
                <div style={{ position: 'relative' }}>
                  <textarea name="description" value={formData.description}
                    onChange={handleChange}
                    placeholder="Briefly describe your experience and why you're a great fit..."
                    maxLength={500} rows={3}
                    style={{ ...inputStyle, height: '90px', padding: '12px', resize: 'vertical' }}
                  />
                  <span style={{ position: 'absolute', bottom: '6px', right: '10px', fontSize: '11px', color: '#94A3B8', backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: '4px' }}>
                    {charCount}/500
                  </span>
                </div>
              </div>

              {/* Resume */}
              <div style={{ marginTop: '14px' }}>
                <label style={labelStyle}>Upload Resume (PDF/DOC/DOCX – Max 5MB)</label>
                <input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx"
                  style={{ width: '100%', height: '46px', border: '1px solid #DCE3EC', borderRadius: '8px', backgroundColor: '#FFFFFF', padding: '11px 14px', fontSize: '13px', color: '#64748B', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', cursor: 'pointer' }} 
                />
              </div>

              {/* Submit */}
              <div style={{ marginTop: '20px' }}>
                <button type="submit" className="submit-btn" disabled={isSubmitting}
                  style={{ height: '44px', width: '100%', maxWidth: '280px', backgroundColor: '#FF6B35', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: isSubmitting ? 'wait' : 'pointer', fontFamily: 'Inter, sans-serif', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'SUBMITTING...' : (<>SUBMIT APPLICATION <Send size={16} /></>)}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT - Info Card */}
          <div style={{ background: 'linear-gradient(180deg, #081C66 0%, #0B1450 100%)', borderRadius: '16px', padding: '24px', color: '#FFFFFF' }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FF6B35', margin: '0 0 4px 0' }}>Have Questions?</h3>
              <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>We're Here to Help!</h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0 }}>
                Reach out to our recruitment team for any queries related to careers at Pislinfra.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              {infoItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', minWidth: '40px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#FF6B35', display: 'flex', lineHeight: 0 }}>{item.icon}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.75)', margin: '0 0 1px 0' }}>{item.title}</p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', margin: 0, lineHeight: 1.4 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .application-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .submit-btn:hover { background-color: #F45A22 !important; }
        select { appearance: none; -webkit-appearance: none; -moz-appearance: none; }
        select option { padding: 10px; font-size: 14px; }
        select option:first-child { color: #94A3B8; }
        @media (min-width: 640px) {
          .form-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .application-grid > div:first-child { padding: 28px; }
        }
        @media (min-width: 1024px) {
          .application-grid { grid-template-columns: 1.7fr 1fr; gap: 24px; }
          .form-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
          .application-grid > div:first-child { padding: 32px; }
          .application-grid > div:last-child { padding: 32px; }
        }
      `}</style>
    </section>
  );
};

export default CareerApplicationSection;