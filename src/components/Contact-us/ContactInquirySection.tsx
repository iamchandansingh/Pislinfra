import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Clock, Building2, CheckCircle } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa6';

const SERVICE_OPTIONS = [
  { value: 'industrial-construction', label: 'Industrial Construction' },
  { value: 'warehouse-construction', label: 'Warehouse Construction' },
  { value: 'logistics-parks', label: 'Logistics Parks' },
  { value: 'infrastructure-development', label: 'Infrastructure Development' },
  { value: 'other', label: 'Other' },
];

const OFFICE_INFO = {
  title: 'Head Office', company: 'PISL',
  address: ['31 P, adj. to Medanta, Medicity,', 'Islampur Colony, Sector 38,', 'Gurugram, Haryana 122018'],
  phone: '{pageData?.phone || "085270 40411"}', email: '{pageData?.email || "info@pislinfra.com"}',
};

const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', color: '#28286e', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease', backgroundColor: '#FFFFFF', boxSizing: 'border-box' as const };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '3px', fontFamily: 'Inter, sans-serif' };
const errorStyle = { color: '#EF4444', fontSize: '11px', marginTop: '2px', fontFamily: 'Inter, sans-serif' };

const ContactInquirySection = ({ pageData }) => {
  const [formData, setFormData] = useState({ fullName: '', companyName: '', email: '', phone: '', serviceRequired: '', subject: '', projectDetails: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Required';
    if (!formData.serviceRequired) newErrors.serviceRequired = 'Required';
    if (!formData.projectDetails.trim()) newErrors.projectDetails = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      
      if (result.success) {
        setIsSubmitted(true);
        setTimeout(() => { 
          setIsSubmitted(false); 
          setFormData({ fullName: '', companyName: '', email: '', phone: '', serviceRequired: '', subject: '', projectDetails: '' }); 
        }, 3000);
      } else {
        setSubmitError(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{ width: '100%', backgroundColor: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      <div className="contact-inquiry-wrapper" style={{ width: '95%', maxWidth: '1370px', margin: '0 auto', padding: '0' }}>
        <div className="contact-layout" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Form Container */}
          <div className="contact-form" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px 16px', boxShadow: '0 4px 12px rgba(15,23,42,0.04)' }}>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#28286e', margin: '0 0 3px 0' }}>{pageData?.inquiryTitle || "We'd Love to Hear From You"}</h2>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>{pageData?.inquirySubtitle || "Tell us about your project and our team will get back to you within 24 business hours."}</p>
            </div>

            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#EEFDF3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><CheckCircle size={20} color="#22C55E" /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#28286e', marginBottom: '3px' }}>Thank You!</h3>
                <p style={{ color: '#64748B', maxWidth: '300px', margin: '0 auto', fontSize: '12px' }}>Your inquiry has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'grid', gap: '10px' }}>
                  
                  {submitError && (
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '8px 12px', color: '#DC2626', fontSize: '12px' }}>
                      {submitError}
                    </div>
                  )}
                  
                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                    <div>
                      <label style={labelStyle}>Full Name <span style={{ color: '#EF4444' }}>*</span></label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" style={inputStyle} />
                      {errors.fullName && <p style={errorStyle}>{errors.fullName}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Company Name</label>
                      <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your Company Ltd." style={inputStyle} />
                    </div>
                  </div>

                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                    <div>
                      <label style={labelStyle}>Email <span style={{ color: '#EF4444' }}>*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@company.com" style={inputStyle} />
                      {errors.email && <p style={errorStyle}>{errors.email}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Phone <span style={{ color: '#EF4444' }}>*</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" style={inputStyle} />
                      {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                    <div>
                      <label style={labelStyle}>Service Required <span style={{ color: '#EF4444' }}>*</span></label>
                      <select name="serviceRequired" value={formData.serviceRequired} onChange={handleChange} style={inputStyle}>
                        <option value="">Select Service</option>
                        {SERVICE_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                      </select>
                      {errors.serviceRequired && <p style={errorStyle}>{errors.serviceRequired}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Subject</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="E.g., Warehouse project" style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Project Details <span style={{ color: '#EF4444' }}>*</span></label>
                    <textarea name="projectDetails" value={formData.projectDetails} onChange={handleChange} placeholder="Tell us more about your project" maxLength={500} rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} />
                    {errors.projectDetails && <p style={errorStyle}>{errors.projectDetails}</p>}
                  </div>

                  <div>
                    <button type="submit" disabled={isSubmitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: isSubmitting ? 'wait' : 'pointer', fontFamily: 'Inter, sans-serif', background: 'linear-gradient(135deg, #ff8d4b, #e67a3e)', color: '#FFFFFF', opacity: isSubmitting ? 0.7 : 1, width: '100%', justifyContent: 'center' }}>
                      {isSubmitting ? 'Submitting...' : (<>Submit Inquiry <Send size={14} /></>)}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar Container */}
          <div className="contact-sidebar">
            <div style={{ background: 'linear-gradient(135deg, #28286e, #1e1e52)', borderRadius: '16px', padding: '20px 18px', color: '#FFFFFF', boxShadow: '0 12px 24px rgba(40,40,110,0.12)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,141,75,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={18} color="#ff8d4b" />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 2px 0' }}>{OFFICE_INFO.title}</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{OFFICE_INFO.company}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                <MapPin size={16} color="#ff8d4b" style={{ marginTop: '2px', flexShrink: 0 }} />
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>{pageData?.address || "31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122018"}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Phone size={16} color="#ff8d4b" style={{ flexShrink: 0 }} />
                <a href={`tel:${(pageData?.phone || "085270 40411").replace(/\s/g, '')}`} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{pageData?.phone || "085270 40411"}</a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Mail size={16} color="#ff8d4b" style={{ flexShrink: 0 }} />
                <a href={`mailto:${pageData?.email || "info@pislinfra.com"}`} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{pageData?.email || "info@pislinfra.com"}</a>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '14px', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} color="#ff8d4b" /> Business Hours</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Mon – Sat</span><span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>9:00 AM – 6:00 PM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Sunday</span><span style={{ color: '#F87171', fontWeight: 500 }}>Closed</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '14px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 8px 0' }}>Follow Us</h4>
                <a href="https://linkedin.com/company/pislinfra" target="_blank" rel="noopener noreferrer"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0A66C2'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'scale(1)'; }}
                  aria-label="LinkedIn">
                  <FaLinkedin size={18} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 639px) {
          .contact-inquiry-wrapper { padding-bottom: 24px !important; }
        }
        @media (min-width: 640px) {
          .form-row { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 1024px) {
          .contact-layout { 
            flex-direction: row !important; 
            align-items: stretch !important;
          }
          .contact-form { 
            flex: 2.2; 
            padding: 24px 22px !important; 
          }
          .contact-sidebar { 
            flex: 1.8; 
            min-width: 380px;
            max-width: 480px;
          }
        }
        @media (min-width: 1280px) {
          .contact-form { 
            flex: 2;
          }
          .contact-sidebar { 
            flex: 2;
            min-width: 420px;
            max-width: 520px;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactInquirySection;