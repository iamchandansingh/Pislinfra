import React, { useState, useCallback } from 'react';
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building2,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { FaLinkedin, FaYoutube, FaSquareXTwitter, FaWhatsapp } from 'react-icons/fa6';

// Types
interface FormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  serviceRequired: string;
  subject: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  projectDetails: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  serviceRequired?: string;
  projectDetails?: string;
}

interface ServiceOption {
  value: string;
  label: string;
}

interface ContactMethod {
  id: 'email' | 'phone' | 'whatsapp';
  label: string;
  icon: React.ReactNode;
}

interface SocialLink {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
  hoverBg: string;
}

interface OfficeInfo {
  title: string;
  company: string;
  address: string[];
  phone: string;
  email: string;
}

// Constants
const SERVICE_OPTIONS: ServiceOption[] = [
  { value: 'industrial-construction', label: 'Industrial Construction' },
  { value: 'warehouse-construction', label: 'Warehouse Construction' },
  { value: 'logistics-parks', label: 'Logistics Parks' },
  { value: 'infrastructure-development', label: 'Infrastructure Development' },
  { value: 'civil-engineering', label: 'Civil Engineering' },
  { value: 'turnkey-projects', label: 'Turnkey Projects' },
];

const CONTACT_METHODS: ContactMethod[] = [
  { id: 'email', label: 'Email', icon: <Mail size={16} /> },
  { id: 'phone', label: 'Phone', icon: <Phone size={16} /> },
  { id: 'whatsapp', label: 'WhatsApp', icon: <FaWhatsapp size={16} /> },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <FaLinkedin size={20} />,
    href: 'https://linkedin.com/company/pislinfra',
    hoverBg: '#0A66C2',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: <FaYoutube size={20} />,
    href: 'https://youtube.com/@pislinfra',
    hoverBg: '#FF0000',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: <FaSquareXTwitter size={20} />,
    href: 'https://twitter.com/pislinfra',
    hoverBg: '#000000',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: <FaWhatsapp size={20} />,
    href: 'https://wa.me/918287040111',
    hoverBg: '#25D366',
  },
];

const OFFICE_INFO: OfficeInfo = {
  title: 'Head Office',
  company: 'PISL Infra',
  address: [
    '3rd Floor, Plot No 18,',
    'Maruti Kunj,',
    'Sec 28,',
    'Gurugram,',
    'Haryana 122018',
  ],
  phone: '082870 40111',
  email: 'info@pislinfra.com',
};

const MAX_CHARACTERS = 1000;

// Input Styles
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid #D1D5DB',
  fontSize: '14px',
  color: '#28286e',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'all 0.2s ease',
  backgroundColor: '#FFFFFF',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#334155',
  marginBottom: '6px',
};

const errorStyle: React.CSSProperties = {
  color: '#EF4444',
  fontSize: '12px',
  marginTop: '4px',
};

// Main Component
const ContactInquirySection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    serviceRequired: '',
    subject: '',
    preferredContact: 'email',
    projectDetails: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#ff8d4b';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 141, 75, 0.1)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#D1D5DB';
    e.currentTarget.style.boxShadow = 'none';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s()-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.serviceRequired) newErrors.serviceRequired = 'Please select a service';
    if (!formData.projectDetails.trim()) newErrors.projectDetails = 'Project details are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        fullName: '', companyName: '', email: '', phone: '',
        serviceRequired: '', subject: '',
        preferredContact: 'email', projectDetails: '',
      });
    }, 3000);
  };

  return (
    <section style={{ width: '100%', backgroundColor: '#F8FAFC' }} aria-labelledby="contact-inquiry-heading">
      <div style={{
        width: '95%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px 0',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', alignItems: 'start' }}>
          
          {/* LEFT - Contact Form */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E5E7EB',
            padding: '40px',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
          }}>
            {/* Form Header */}
            <div style={{ marginBottom: '32px' }}>
              <span style={{
                display: 'inline-block', fontSize: '12px', fontWeight: 600,
                color: '#ff8d4b', backgroundColor: '#fff5f0',
                padding: '4px 12px', borderRadius: '9999px',
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px',
              }}>
                Send an Inquiry
              </span>
              <h2 id="contact-inquiry-heading" style={{ fontSize: '32px', fontWeight: 800, color: '#28286e', margin: '0 0 8px 0' }}>
                We'd Love to Hear From You
              </h2>
              <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
                Tell us about your project and our team will get back to you within 24 business hours.
              </p>
            </div>

            {/* Form */}
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{
                  width: '64px', height: '64px', backgroundColor: '#EEFDF3',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 24px',
                }}>
                  <CheckCircle size={32} color="#22C55E" />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#28286e', marginBottom: '8px' }}>Thank You!</h3>
                <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                  Your inquiry has been submitted successfully. Our team will contact you within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'grid', gap: '20px' }}>
                  
                  {/* Row 1 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Full Name <span style={{ color: '#EF4444' }}>*</span></label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                        placeholder="John Doe" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                      {errors.fullName && <p style={errorStyle}>{errors.fullName}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Company Name</label>
                      <input type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                        placeholder="Your Company Ltd." style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Email Address <span style={{ color: '#EF4444' }}>*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange}
                        placeholder="john@company.com" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                      {errors.email && <p style={errorStyle}>{errors.email}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number <span style={{ color: '#EF4444' }}>*</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        placeholder="+91 98765 43210" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                      {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Row 3 - Service Required + Subject */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Service Required <span style={{ color: '#EF4444' }}>*</span></label>
                      <select name="serviceRequired" value={formData.serviceRequired} onChange={handleChange} style={inputStyle}>
                        <option value="">Select Service</option>
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.serviceRequired && <p style={errorStyle}>{errors.serviceRequired}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Subject / Reference</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                        placeholder="E.g., Warehouse project in Mumbai" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                  </div>

                  {/* Row 4 - Preferred Contact Method */}
                  <div>
                    <label style={labelStyle}>Preferred Contact Method</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {CONTACT_METHODS.map((method) => (
                        <button key={method.id} type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, preferredContact: method.id }))}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
                            fontWeight: 500, border: 'none', cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                            backgroundColor: formData.preferredContact === method.id ? '#ff8d4b' : '#F1F5F9',
                            color: formData.preferredContact === method.id ? '#FFFFFF' : '#64748B',
                          }}>
                          {method.icon} {method.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row 5 - Project Details */}
                  <div>
                    <label style={labelStyle}>Project Details <span style={{ color: '#EF4444' }}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <textarea name="projectDetails" value={formData.projectDetails} onChange={handleChange}
                        placeholder="Tell us more about your project, requirements, timeline etc."
                        maxLength={MAX_CHARACTERS} rows={5}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        onFocus={handleFocus} onBlur={handleBlur} />
                      <span style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '12px', color: '#94A3B8', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                        {formData.projectDetails.length} / {MAX_CHARACTERS}
                      </span>
                    </div>
                    {errors.projectDetails && <p style={errorStyle}>{errors.projectDetails}</p>}
                  </div>

                  {/* Submit Button */}
                  <div style={{ paddingTop: '8px' }}>
                    <button type="submit" disabled={isSubmitting}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '14px 32px', borderRadius: '12px', fontSize: '15px',
                        fontWeight: 600, border: 'none', cursor: isSubmitting ? 'wait' : 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        background: 'linear-gradient(135deg, #ff8d4b, #e67a3e)',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 12px rgba(255, 141, 75, 0.3)',
                        transition: 'all 0.2s',
                        opacity: isSubmitting ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.transform = 'translateY(0)'; }}>
                      {isSubmitting ? 'Submitting...' : (
                        <>Submit Inquiry <Send size={16} /></>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT - Sidebar */}
          <div>
            {/* Head Office Card */}
            <div style={{
              background: 'linear-gradient(135deg, #28286e, #1e1e52)',
              borderRadius: '24px', padding: '32px', color: '#FFFFFF',
              boxShadow: '0 20px 40px rgba(40, 40, 110, 0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  backgroundColor: 'rgba(255, 141, 75, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Building2 size={20} color="#ff8d4b" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 2px 0' }}>Head Office</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{OFFICE_INFO.company}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <MapPin size={20} color="#ff8d4b" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>
                    {OFFICE_INFO.address.join(' ')}
                  </p>
                  <a href="https://maps.google.com/?q=3rd+Floor+Plot+No+18+Maruti+Kunj+Sec+28+Gurugram+Haryana+122018"
                    target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '12px', color: '#ff8d4b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    View on Map <ChevronRight size={12} />
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Phone size={20} color="#ff8d4b" style={{ flexShrink: 0 }} />
                <a href={`tel:${OFFICE_INFO.phone.replace(/\s/g, '')}`}
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                  {OFFICE_INFO.phone}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Mail size={20} color="#ff8d4b" style={{ flexShrink: 0 }} />
                <a href={`mailto:${OFFICE_INFO.email}`}
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                  {OFFICE_INFO.email}
                </a>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#ff8d4b" /> Business Hours
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Monday – Saturday</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>9:00 AM – 6:00 PM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Sunday</span>
                  <span style={{ color: '#EF4444', fontWeight: 500 }}>Closed</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 12px 0' }}>Follow Us</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {SOCIAL_LINKS.map((social) => (
                    <a key={social.id} href={social.href} target="_blank" rel="noopener noreferrer"
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = social.hoverBg;
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      aria-label={social.name}>
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInquirySection;