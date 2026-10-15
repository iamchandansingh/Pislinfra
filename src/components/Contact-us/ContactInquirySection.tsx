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

interface ContactInquirySectionProps {
  pageData?: {
    inquiryTitle?: string;
    inquirySubtitle?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
}

const ContactInquirySection: React.FC<ContactInquirySectionProps> = ({ pageData }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    serviceRequired: '',
    subject: '',
    projectDetails: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            fullName: '',
            companyName: '',
            email: '',
            phone: '',
            serviceRequired: '',
            subject: '',
            projectDetails: '',
          });
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

  const phoneValue = pageData?.phone || '085270 40411';
  const emailValue = pageData?.email || 'info@pislinfra.com';
  const addressValue = pageData?.address || '31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122018';

  return (
    <section className="contact-inquiry-section">
      <div className="contact-inquiry-wrapper">
        <div className="contact-layout">

          {/* Form Container */}
          <div className="contact-form">
            <div className="form-header">
              <h2 className="form-title">
                {pageData?.inquiryTitle || "We'd Love to Hear From You"}
              </h2>
              <p className="form-subtitle">
                {pageData?.inquirySubtitle || "Tell us about your project and our team will get back to you within 24 business hours."}
              </p>
            </div>

            {isSubmitted ? (
              <div className="form-success-box">
                <div className="success-icon-wrap">
                  <CheckCircle size={24} color="#22C55E" />
                </div>
                <h3 className="success-title">Thank You!</h3>
                <p className="success-desc">Your inquiry has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-fields-grid">

                  {submitError && (
                    <div className="form-error-banner">
                      {submitError}
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name <span className="required-star">*</span></label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="form-input"
                      />
                      {errors.fullName && <p className="form-error">{errors.fullName}</p>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Your Company Ltd."
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email <span className="required-star">*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className="form-input"
                      />
                      {errors.email && <p className="form-error">{errors.email}</p>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone <span className="required-star">*</span></label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="form-input"
                      />
                      {errors.phone && <p className="form-error">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Service Required <span className="required-star">*</span></label>
                      <select
                        name="serviceRequired"
                        value={formData.serviceRequired}
                        onChange={handleChange}
                        className="form-input form-select"
                      >
                        <option value="">Select Service</option>
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.serviceRequired && <p className="form-error">{errors.serviceRequired}</p>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="E.g., Warehouse project"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Project Details <span className="required-star">*</span></label>
                    <textarea
                      name="projectDetails"
                      value={formData.projectDetails}
                      onChange={handleChange}
                      placeholder="Tell us more about your project"
                      maxLength={500}
                      rows={3}
                      className="form-input form-textarea"
                    />
                    {errors.projectDetails && <p className="form-error">{errors.projectDetails}</p>}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-submit-btn"
                    >
                      {isSubmitting ? 'Submitting...' : (<>Submit Inquiry <Send size={15} /></>)}
                    </button>
                  </div>

                </div>
              </form>
            )}
          </div>

          {/* Sidebar: Head Office */}
          <div className="contact-sidebar">
            <div className="sidebar-card">

              {/* Office Header */}
              <div className="sidebar-header">
                <div className="sidebar-icon-wrap">
                  <Building2 size={20} color="#FF6B35" />
                </div>
                <div>
                  <h3 className="sidebar-title">Head Office</h3>
                  <p className="sidebar-subtitle">PISL</p>
                </div>
              </div>

              {/* Address */}
              <div className="sidebar-row">
                <MapPin size={18} color="#FF6B35" className="sidebar-row-icon" />
                <p className="sidebar-row-text">
                  {addressValue}
                </p>
              </div>

              {/* Phone */}
              <div className="sidebar-row">
                <Phone size={18} color="#FF6B35" className="sidebar-row-icon" />
                <a
                  href={`tel:${phoneValue.replace(/\s/g, '')}`}
                  className="sidebar-row-link"
                >
                  {phoneValue}
                </a>
              </div>

              {/* Email */}
              <div className="sidebar-row">
                <Mail size={18} color="#FF6B35" className="sidebar-row-icon" />
                <a
                  href={`mailto:${emailValue}`}
                  className="sidebar-row-link"
                >
                  {emailValue}
                </a>
              </div>

              {/* Business Hours */}
              <div className="sidebar-divider-section">
                <h4 className="sidebar-section-title">
                  <Clock size={15} color="#FF6B35" /> Business Hours
                </h4>
                <div className="hours-row">
                  <span className="hours-day">Mon – Sat</span>
                  <span className="hours-time">9:00 AM – 6:00 PM</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Sunday</span>
                  <span className="hours-closed">Closed</span>
                </div>
              </div>

              {/* Follow Us */}
              <div className="sidebar-divider-section">
                <h4 className="sidebar-section-title">Follow Us</h4>
                <a
                  href="https://linkedin.com/company/pislinfra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-social-link"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={18} />
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        .contact-inquiry-section {
          width: 100%;
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }

        .contact-inquiry-wrapper {
          width: 95%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
        }

        .contact-layout {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: stretch;
          box-sizing: border-box;
        }

        /* ===== Form Container ===== */
        .contact-form {
          background-color: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #EAEFF5;
          padding: 24px 22px;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
          box-sizing: border-box;
          min-width: 0;
        }

        .form-header {
          margin-bottom: 20px;
        }

        .form-title {
          font-size: clamp(20px, 3.2vw, 25px);
          font-weight: 800;
          color: #1E2A5A;
          margin: 0 0 6px 0;
          line-height: 1.25;
          letter-spacing: -0.3px;
        }

        .form-subtitle {
          font-size: clamp(12.5px, 2vw, 13.5px);
          color: #64748B;
          margin: 0;
          line-height: 1.5;
        }

        .form-fields-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 5px;
          font-family: 'Inter', sans-serif;
        }

        .required-star {
          color: #EF4444;
        }

        .form-input {
          width: 100%;
          min-height: 42px;
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid #D1D5DB;
          font-size: 14px;
          color: #1E2A5A;
          outline: none;
          font-family: 'Inter', sans-serif;
          background-color: #FFFFFF;
          box-sizing: border-box;
          transition: none !important;
          transform: none !important;
        }

        .form-input:focus {
          border-color: #FF6B35;
        }

        .form-select {
          cursor: pointer;
        }

        .form-textarea {
          min-height: 85px;
          resize: vertical;
        }

        .form-error {
          color: #EF4444;
          font-size: 11.5px;
          margin: 3px 0 0 0;
          font-family: 'Inter', sans-serif;
        }

        .form-error-banner {
          background-color: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 8px;
          padding: 8px 12px;
          color: #DC2626;
          font-size: 12px;
        }

        .form-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14.5px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          background-color: #FF6B35;
          color: #FFFFFF;
          width: 100%;
          justify-content: center;
          min-height: 46px;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.22);
          transition: none !important;
          transform: none !important;
        }

        .form-submit-btn:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .form-submit-btn:hover {
          transform: none !important;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.22) !important;
        }

        .form-success-box {
          text-align: center;
          padding: 30px 16px;
        }

        .success-icon-wrap {
          width: 44px;
          height: 44px;
          background-color: #EEFDF3;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px auto;
        }

        .success-title {
          font-size: 19px;
          font-weight: 700;
          color: #1E2A5A;
          margin: 0 0 4px 0;
        }

        .success-desc {
          color: #64748B;
          max-width: 300px;
          margin: 0 auto;
          font-size: 13px;
        }

        /* ===== Sidebar (Head Office) ===== */
        .contact-sidebar {
          box-sizing: border-box;
          min-width: 0;
        }

        .sidebar-card {
          background: linear-gradient(135deg, #1E2A5A 0%, #0F172A 100%);
          border-radius: 16px;
          padding: 24px 20px;
          color: #FFFFFF;
          box-shadow: 0 8px 24px rgba(30, 42, 90, 0.12);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
          min-width: 0;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .sidebar-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background-color: rgba(255, 107, 53, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-title {
          font-size: 17px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 2px 0;
          line-height: 1.25;
        }

        .sidebar-subtitle {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
        }

        .sidebar-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 13px;
        }

        .sidebar-row-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .sidebar-row-text {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.88);
          margin: 0;
          line-height: 1.55;
          word-break: break-word;
        }

        .sidebar-row-link {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.92);
          text-decoration: none;
          line-height: 1.5;
          word-break: break-word;
          transition: none !important;
        }

        .sidebar-divider-section {
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          padding-top: 14px;
          margin-top: 6px;
          margin-bottom: 12px;
        }

        .sidebar-divider-section:last-child {
          margin-bottom: 0;
        }

        .sidebar-section-title {
          font-size: 12.5px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hours-row {
          display: flex;
          justify-content: space-between;
          font-size: 12.5px;
          margin-bottom: 5px;
        }

        .hours-day {
          color: rgba(255, 255, 255, 0.65);
        }

        .hours-time {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 500;
        }

        .hours-closed {
          color: #F87171;
          font-weight: 500;
        }

        .sidebar-social-link {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.12);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          transition: none !important;
          transform: none !important;
        }

        .sidebar-social-link:hover {
          transform: none !important;
          color: #FFFFFF !important;
        }

        /* ===== Responsive Breakpoints ===== */
        @media (min-width: 600px) {
          .form-row {
            grid-template-columns: 1fr 1fr !important;
            gap: 14px !important;
          }
        }

        @media (min-width: 1024px) {
          .contact-layout {
            flex-direction: row !important;
            align-items: stretch !important;
            gap: 24px !important;
          }
          .contact-form {
            flex: 1.5;
            padding: 28px 24px !important;
          }
          .contact-sidebar {
            flex: 1;
            min-width: 360px;
            max-width: 420px;
          }
        }

        /* ===== Mobile (<= 768px) ===== */
        @media (max-width: 768px) {
          .contact-inquiry-wrapper {
            padding: 0 14px !important;
          }
          .contact-layout {
            gap: 16px !important;
          }
          .contact-form {
            padding: 18px 14px !important;
            border-radius: 14px !important;
          }
          .form-header {
            margin-bottom: 16px !important;
          }
          .sidebar-card {
            padding: 20px 16px !important;
            border-radius: 14px !important;
          }
          /* iOS Safari auto-zoom prevention: inputs must be 16px on mobile */
          .form-input,
          .form-select,
          .form-textarea {
            font-size: 16px !important;
            padding: 10px 12px !important;
          }
        }

        /* Small Phones (<= 360px) */
        @media (max-width: 360px) {
          .contact-inquiry-wrapper {
            padding: 0 10px !important;
          }
          .contact-form {
            padding: 14px 10px !important;
          }
          .sidebar-card {
            padding: 16px 12px !important;
          }
          .sidebar-header {
            gap: 10px !important;
          }
          .sidebar-icon-wrap {
            width: 36px !important;
            height: 36px !important;
          }
          .sidebar-title {
            font-size: 15.5px !important;
          }
          .sidebar-row-text,
          .sidebar-row-link {
            font-size: 12.5px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactInquirySection;