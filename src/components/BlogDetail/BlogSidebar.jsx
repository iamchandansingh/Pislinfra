// src/components/BlogDetail/BlogSidebar.jsx

import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
  FiFileText, FiDownload, FiPhone, FiMail, FiLinkedin,
  FiArrowRight, FiClock, FiChevronRight, FiPrinter,
} from 'react-icons/fi';

// ==================== TABLE OF CONTENTS ====================
const TableOfContents = ({ headings = [] }) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;
      let current = '';
      headings.forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el && el.offsetTop <= scrollPos) current = heading.id;
      });
      setActiveId(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
  };

  return (
    <div className="sidebar-card" style={{ borderRadius: '14px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#081B4B', margin: '0 0 14px 0', fontFamily: 'Inter, sans-serif' }}>On This Page</h3>
      <nav><ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {headings.map((heading, i) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id || i} style={{ marginBottom: '1px' }}>
              <button onClick={() => handleClick(heading.id)} style={{
                display: 'flex', width: '100%', alignItems: 'center', gap: '8px',
                borderRadius: '6px', padding: '7px 10px', textAlign: 'left',
                fontSize: '13px', fontWeight: isActive ? 600 : 400,
                color: isActive ? '#FF6B00' : '#475569',
                backgroundColor: isActive ? '#FFF0E5' : 'transparent',
                border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s ease',
              }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.color = '#081B4B'; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#475569'; } }}
              >
                <span style={{ height: '5px', width: '5px', flexShrink: 0, borderRadius: '50%', backgroundColor: isActive ? '#FF6B00' : '#CBD5E1' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{heading.text || heading}</span>
              </button>
            </li>
          );
        })}
      </ul></nav>
    </div>
  );
};

// ==================== AUTHOR CARD ====================
const AuthorCard = () => {
  return (
    <div className="sidebar-card" style={{ borderRadius: '14px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', height: '56px', width: '56px', flexShrink: 0, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '50%', border: '2px solid rgba(255,107,0,0.15)', backgroundColor: '#FFF0E5' }}>
          <img src="/logo.png" alt="Pislinfra" style={{ height: '60%', width: '60%', objectFit: 'contain' }} />
        </div>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#081B4B', margin: 0 }}>Pislinfra Team</h4>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>Infrastructure Experts</p>
        </div>
      </div>
      <p style={{ marginTop: '12px', fontSize: '13px', lineHeight: 1.5, color: '#475569' }}>Industrial infrastructure development experts at Pislinfra</p>
      <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
        <a href="https://in.linkedin.com/company/pislinfra" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '9999px', backgroundColor: '#EEF2FF', padding: '7px 14px', fontSize: '11px', fontWeight: 600, color: '#081B4B', textDecoration: 'none', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#081B4B'; e.currentTarget.style.color = '#FFFFFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#EEF2FF'; e.currentTarget.style.color = '#081B4B'; }}
        ><FiLinkedin size={13} /><span>LinkedIn</span></a>
        <a href="mailto:info@pislinfra.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '9999px', backgroundColor: '#FFF0E5', padding: '7px 14px', fontSize: '11px', fontWeight: 600, color: '#FF6B00', textDecoration: 'none', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FF6B00'; e.currentTarget.style.color = '#FFFFFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFF0E5'; e.currentTarget.style.color = '#FF6B00'; }}
        ><FiMail size={13} /><span>Email</span></a>
      </div>
    </div>
  );
};

// ==================== DOWNLOAD BLOG AS PDF ====================
const DownloadBlogPDF = ({ title = '', content = '' }) => {

  const handleDownloadPDF = () => {
    if (!content || content.length === 0) {
      alert('No content available to download');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    
    const cleanContent = content
      .replace(/\[IMAGE\]/g, '')
      .replace(/\[IMAGE:2\]/g, '')
      .replace(/\*\*/g, '')
      .trim();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 25;

    doc.setFontSize(20);
    doc.setTextColor(8, 27, 75);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(title, pageWidth - margin * 2);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 10 + 5;

    doc.setDrawColor(255, 107, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Author: Pislinfra Team | Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y);
    y += 15;

    const paragraphs = cleanContent.split('\n\n');
    
    paragraphs.forEach((para) => {
      const trimmed = para.trim();
      if (!trimmed) return;
      if (y > 260) { doc.addPage(); y = 20; }

      if (/^\d+\.\s/.test(trimmed)) {
        doc.setFontSize(14); doc.setTextColor(8, 27, 75); doc.setFont('helvetica', 'bold');
        const h = doc.splitTextToSize(trimmed.replace(/^\d+\.\s/, ''), pageWidth - margin * 2);
        doc.text(h, margin, y); y += h.length * 7 + 5;
      } else if (/^Q\d+\./i.test(trimmed)) {
        const lines = trimmed.split('\n');
        doc.setFontSize(11); doc.setTextColor(8, 27, 75); doc.setFont('helvetica', 'bold');
        const q = doc.splitTextToSize(lines[0], pageWidth - margin * 2);
        doc.text(q, margin, y); y += q.length * 6 + 3;
        doc.setFontSize(10); doc.setTextColor(80, 80, 80); doc.setFont('helvetica', 'normal');
        const a = doc.splitTextToSize(lines.slice(1).join(' '), pageWidth - margin * 2);
        doc.text(a, margin, y); y += a.length * 5 + 8;
      } else {
        doc.setFontSize(10); doc.setTextColor(60, 60, 60); doc.setFont('helvetica', 'normal');
        const t = doc.splitTextToSize(trimmed, pageWidth - margin * 2);
        doc.text(t, margin, y); y += t.length * 5 + 4;
      }
    });

    y += 10;
    doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y); y += 8;
    doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    doc.text(`© ${new Date().getFullYear()} PISL - Pragati Infra Solutions. All Rights Reserved.`, margin, y);

    const fileName = title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="sidebar-card" style={{ overflow: 'hidden', borderRadius: '14px', background: 'linear-gradient(135deg, #081B4B 0%, #0C2769 50%, #081B4B 100%)', padding: '18px', color: '#FFFFFF', boxShadow: '0 6px 20px rgba(8,27,75,0.15)', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', height: '42px', width: '42px', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.12)', marginBottom: '10px' }}>
        <FiPrinter size={22} style={{ color: '#FFFFFF' }} />
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0' }}>Download Blog</h3>
      <p style={{ fontSize: '12px', lineHeight: 1.5, color: 'rgba(255,255,255,0.7)', margin: '0 0 14px 0' }}>Save this article as PDF</p>
      <button onClick={handleDownloadPDF} style={{ display: 'inline-flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '10px', backgroundColor: '#FF6B00', padding: '10px 16px', fontSize: '13px', fontWeight: 700, color: '#FFFFFF', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'Inter, sans-serif' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E55A00'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FF6B00'; }}
      ><FiDownload size={16} /><span>Download PDF</span></button>
    </div>
  );
};

// ==================== LATEST ARTICLES ====================
const LatestArticles = ({ latestBlogs = [], onArticleClick }) => {
  if (!latestBlogs || latestBlogs.length === 0) return null;
  const formatDate = (dateStr) => { try { return new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return dateStr; } };
  return (
    <div className="sidebar-card" style={{ borderRadius: '14px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#081B4B', margin: '0 0 14px 0' }}>Latest Articles</h3>
      <div>
        {latestBlogs.slice(0, 3).map((article, i) => (
          <a key={article.id || i} href={article.slug ? `/blog/${article.slug}` : '#'} onClick={(e) => { if (onArticleClick) { e.preventDefault(); onArticleClick(article); } }}
            style={{ display: 'flex', gap: '10px', borderRadius: '10px', padding: '6px', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s ease', marginBottom: i < Math.min(latestBlogs.length, 3) - 1 ? '12px' : '0' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <div style={{ display: 'flex', height: '56px', width: '56px', flexShrink: 0, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '10px', backgroundColor: '#F1F5F9' }}>
              {article.image ? <img src={article.image} alt={article.title} style={{ height: '100%', width: '100%', objectFit: 'cover' }} /> : <FiFileText size={18} style={{ color: '#CBD5E1' }} />}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3, color: '#081B4B', margin: '0 0 4px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.title}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94A3B8' }}><FiClock size={10} /><span>{formatDate(article.date || article.publishDate)}</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#CBD5E1' }}><FiChevronRight size={14} /></div>
          </a>
        ))}
      </div>
    </div>
  );
};

// ==================== CONTACT CARD ====================
const ContactCard = () => (
  <div className="sidebar-card" style={{ borderRadius: '14px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', fontFamily: 'Inter, sans-serif' }}>
    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#081B4B', margin: '0 0 2px 0' }}>Need Help?</h3>
    <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>Talk With Our Experts</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <a href="tel:08287040111" style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '10px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#F8FAFC', padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#081B4B', textDecoration: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.backgroundColor = '#FFF0E5'; e.currentTarget.style.color = '#FF6B00'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.color = '#081B4B'; }}
      >
        <div style={{ display: 'flex', height: '36px', width: '36px', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#EEF2FF' }}><FiPhone size={16} style={{ color: '#081B4B' }} /></div>
        <div style={{ textAlign: 'left' }}><p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Phone</p><p style={{ fontWeight: 700, margin: 0 }}>082870 40111</p></div>
        <FiArrowRight size={14} style={{ marginLeft: 'auto', color: '#CBD5E1' }} />
      </a>
      <a href="mailto:info@pislinfra.com" style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '10px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#F8FAFC', padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#081B4B', textDecoration: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.backgroundColor = '#FFF0E5'; e.currentTarget.style.color = '#FF6B00'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.color = '#081B4B'; }}
      >
        <div style={{ display: 'flex', height: '36px', width: '36px', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#FFF0E5' }}><FiMail size={16} style={{ color: '#FF6B00' }} /></div>
        <div style={{ textAlign: 'left' }}><p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Email</p><p style={{ fontWeight: 700, margin: 0 }}>info@pislinfra.com</p></div>
        <FiArrowRight size={14} style={{ marginLeft: 'auto', color: '#CBD5E1' }} />
      </a>
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================
const BlogSidebar = ({ headings = [], latestBlogs = [], onArticleClick, blogTitle = '', blogContent = '' }) => {
  return (
    <aside className="blog-sidebar-detail" style={{ width: '100%', fontFamily: 'Inter, sans-serif', paddingTop: '40px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TableOfContents headings={headings} />
        <AuthorCard />
        <DownloadBlogPDF title={blogTitle} content={blogContent} />
        <LatestArticles latestBlogs={latestBlogs} onArticleClick={onArticleClick} />
        <ContactCard />
      </div>
      <style>{`
        @media (max-width: 640px) {
          .blog-sidebar-detail { padding-top: 24px !important; }
          .sidebar-card { padding: 14px !important; border-radius: 10px !important; }
          .sidebar-card h3 { font-size: 15px !important; margin-bottom: 10px !important; }
        }
        @media (max-width: 400px) {
          .blog-sidebar-detail { padding-top: 20px !important; }
          .sidebar-card { padding: 12px !important; }
          .sidebar-card h3 { font-size: 14px !important; }
        }
      `}</style>
    </aside>
  );
};

export default BlogSidebar;