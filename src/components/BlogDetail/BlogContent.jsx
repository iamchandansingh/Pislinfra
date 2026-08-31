// src/components/BlogDetail/BlogContent.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useBlogs } from '../../context/BlogContext';



const getInternalLinks = (BlogDB) => {
  const links = {};
  BlogDB.forEach(blog => {
    links[blog.title] = `/blog/${blog.slug}`;
  });
  return links;
};

const FAQItem = ({ question, answer }) => {

  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: '1px solid #E5E7EB' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', padding: '14px 0', textAlign: 'left', fontSize: '15px', fontWeight: 700,
          color: '#081B4B', backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#FF6B00'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#081B4B'; }}
      >
        <span style={{ flex: 1 }}>{question}</span>
        {open ? <FiChevronUp size={18} style={{ color: '#FF6B00', flexShrink: 0 }} /> : <FiChevronDown size={18} style={{ color: '#081B4B', flexShrink: 0 }} />}
      </button>
      <div style={{ maxHeight: open ? '2000px' : '0', opacity: open ? 1 : 0, overflow: 'hidden', transition: 'all 0.3s ease' }}>
        <p style={{ paddingBottom: '14px', fontSize: '14px', lineHeight: 1.7, color: '#334155', margin: 0, fontFamily: 'Inter, sans-serif' }}>
          {answer}
        </p>
      </div>
    </div>
  );
};

const TableRenderer = ({ data }) => {
  if (!data || data.length < 2) return null;
  const headers = data[0];
  const rows = data.slice(1);
  return (
    <div className="table-wrapper" style={{ margin: '24px 0', overflowX: 'auto', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#081B4B' }}>
            {headers.map((header, i) => (
              <th key={i} className="table-th" style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', borderBottom: '2px solid #081B4B' }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC', transition: 'background-color 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFF0E5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'; }}
            >
              {row.map((cell, j) => (
                <td key={j} className="table-td" style={{ padding: '10px 16px', color: '#334155', borderBottom: '1px solid #EEF2F7', whiteSpace: j === 0 ? 'nowrap' : 'normal', fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BlogContent = ({ content = '', images = [], faq = [], onContentReady }) => {
  const { blogs: BlogDB, loading } = useBlogs();
  const contentRef = useRef(null);
  const internalLinks = getInternalLinks(BlogDB);

  useEffect(() => {
    if (contentRef.current && onContentReady) {
      const cleanText = content.replace(/\[IMAGE\]/g, '').replace(/\[IMAGE:2\]/g, '').replace(/\*\*/g, '').trim();
      onContentReady(cleanText);
    }
  }, [content, onContentReady]);

  const isHeadingLine = (text) => {
    if (text.length > 100) return false;
    if (text.includes('**')) return false;
    if (text.includes('|')) return false;
    if (/^Q\d+\./i.test(text)) return false;
    if (text.endsWith('?') || text.endsWith(':')) return true;
    const words = text.split(' ');
    if (words.length <= 8 && words.every(w => w[0] === w[0]?.toUpperCase())) return true;
    return false;
  };

  const renderContent = (rawContent) => {
    if (!rawContent) return <p style={{ color: '#64748B', fontFamily: 'Inter, sans-serif' }}>No content available.</p>;
    if (typeof rawContent !== 'string') return null;

    const blocks = rawContent.split('\n\n');
    let imageIndex = 0;
    let isFirstBlock = true;
    let isCollectingTable = false;
    let tableData = [];
    const elements = [];

    blocks.forEach((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return;

      if (trimmed === '[TABLE]') { isCollectingTable = true; tableData = []; return; }
      if (trimmed === '[/TABLE]') {
        isCollectingTable = false;
        if (tableData.length > 0) {
          elements.push(<TableRenderer key={`table-${index}`} data={tableData.map(row => row.split('|').map(cell => cell.trim()))} />);
        }
        tableData = []; return;
      }
      if (isCollectingTable) { tableData.push(trimmed); return; }

      if (isFirstBlock && !trimmed.startsWith('[') && !/^\d+\.\s/.test(trimmed) && !/^[A-Z]\.\s/.test(trimmed) && !trimmed.includes('**') && !/^Q\d+\./i.test(trimmed)) {
        isFirstBlock = false;
        elements.push(<h1 key={`h1-${index}`} className="content-h1" style={{ fontSize: '28px', fontWeight: 800, color: '#081B4B', margin: '0 0 24px 0', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{trimmed}</h1>);
        return;
      }
      isFirstBlock = false;

      if (trimmed === '[IMAGE]') {
        const img = images[imageIndex]; imageIndex++;
        if (img) elements.push(<div key={`img-${index}`} style={{ margin: '20px 0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><img src={img.src || img} alt={img.alt || 'Blog image'} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} /></div>);
        return;
      }

      if (trimmed === '[IMAGE:2]') {
        const img1 = images[imageIndex]; const img2 = images[imageIndex + 1]; imageIndex += 2;
        elements.push(<div key={`img2-${index}`} className="img-two" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px', margin: '20px 0' }}>{img1 && <div style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><img src={img1.src || img1} alt={img1.alt || ''} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} /></div>}{img2 && <div style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><img src={img2.src || img2} alt={img2.alt || ''} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} /></div>}<style>{`@media (min-width: 640px) { .img-two { grid-template-columns: repeat(2, 1fr) !important; } }`}</style></div>);
        return;
      }

      if (isHeadingLine(trimmed) && !/^\d+\.\s/.test(trimmed) && !/^[A-Z]\.\s/.test(trimmed)) {
        const headingId = trimmed.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        elements.push(<h3 key={`h3u-${index}`} id={headingId} className="content-h3" style={{ fontSize: '18px', fontWeight: 700, color: '#081B4B', margin: '24px 0 8px 0', fontFamily: 'Inter, sans-serif', lineHeight: 1.3 }}>{trimmed}</h3>);
        return;
      }

      if (/^\d+\.\s/.test(trimmed)) {
        const headingText = trimmed.replace(/^\d+\.\s/, '');
        const headingId = headingText.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        elements.push(<h2 key={`h2-${index}`} id={headingId} className="content-h2" style={{ fontSize: '22px', fontWeight: 700, color: '#081B4B', margin: '28px 0 8px 0', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{headingText}</h2>);
        return;
      }

      if (/^[A-Z]\.\s/.test(trimmed)) {
        elements.push(<h3 key={`h3-${index}`} className="content-h3" style={{ fontSize: '17px', fontWeight: 700, color: '#081B4B', margin: '18px 0 6px 0', fontFamily: 'Inter, sans-serif', lineHeight: 1.3 }}>{trimmed.replace(/^[A-Z]\.\s/, '')}</h3>);
        return;
      }

      if (/^Q\d+\./i.test(trimmed)) return;

      const renderFormattedText = (text, pIndex) => {
        // Split by both bold and links
        // Regex for **bold** or [text](url)
        const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
        return parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} style={{ fontWeight: 700, color: '#081B4B' }}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
            const match = part.match(/\[(.*?)\]\((.*?)\)/);
            if (match) {
              const linkText = match[1];
              const linkUrl = match[2];
              if (linkUrl.startsWith('/')) {
                return <Link key={i} to={linkUrl} style={{ color: '#FF6B00', fontWeight: 600, textDecoration: 'none' }}>{linkText}</Link>;
              }
              return <a key={i} href={linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#FF6B00', fontWeight: 600, textDecoration: 'none' }}>{linkText}</a>;
            }
          }
          return part;
        });
      };

      if (trimmed.includes('**') || (trimmed.includes('[') && trimmed.includes(']('))) {
        elements.push(<p key={`formatted-${index}`} className="content-p" style={{ fontSize: '14px', lineHeight: 1.7, color: '#334155', margin: '0 0 12px 0', fontFamily: 'Inter, sans-serif' }}>{renderFormattedText(trimmed, index)}</p>);
        return;
      }

      const linkMatch = trimmed.match(/^(Read also|Also Read|You may also like)\s*[–-]\s*(.+)$/i);
      if (linkMatch) {
        const prefix = linkMatch[1]; const blogTitle = linkMatch[2].trim();
        for (const [title, slug] of Object.entries(internalLinks)) {
          if (blogTitle.toLowerCase() === title.toLowerCase()) {
            elements.push(<p key={`link-${index}`} className="content-p" style={{ fontSize: '14px', lineHeight: 1.7, color: '#334155', margin: '16px 0', fontFamily: 'Inter, sans-serif' }}>{prefix} –{' '}<Link to={slug} style={{ color: '#FF6B00', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderBottom = '1px solid #FF6B00'; }} onMouseLeave={(e) => { e.currentTarget.style.borderBottom = '1px solid transparent'; }}>{blogTitle}</Link></p>);
            return;
          }
        }
      }

      elements.push(<p key={`p-${index}`} className="content-p" style={{ fontSize: '14px', lineHeight: 1.7, color: '#334155', margin: '0 0 12px 0', fontFamily: 'Inter, sans-serif' }}>{trimmed}</p>);
    });

    return elements;
  };

  return (
    <article ref={contentRef} className="blog-content-article" style={{ width: '100%', padding: '40px 32px', fontFamily: 'Inter, sans-serif', borderRadius: '14px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', boxSizing: 'border-box' }}>
      {renderContent(content)}
      {faq && faq.length > 0 && (
        <div style={{ marginTop: '36px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#081B4B', margin: '0 0 16px 0', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>Frequently Asked Questions</h2>
          <div style={{ borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', padding: '0 16px' }}>
            {faq.map((item, index) => <FAQItem key={index} question={item.question} answer={item.answer} />)}
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 640px) {
          .blog-content-article { padding: 24px 16px !important; border-radius: 10px !important; }
          .content-h1 { font-size: 22px !important; margin-bottom: 16px !important; }
          .content-h2 { font-size: 18px !important; margin-top: 20px !important; }
          .content-h3 { font-size: 15px !important; margin-top: 16px !important; }
          .content-p { font-size: 13px !important; }
          .table-wrapper { margin: 16px 0 !important; border-radius: 8px !important; }
          .table-th { padding: 8px 10px !important; font-size: 11px !important; }
          .table-td { padding: 8px 10px !important; font-size: 11px !important; }
        }
        @media (max-width: 400px) {
          .blog-content-article { padding: 20px 12px !important; }
          .content-h1 { font-size: 20px !important; }
          .content-h2 { font-size: 16px !important; }
          .content-h3 { font-size: 14px !important; }
          .content-p { font-size: 12px !important; }
        }
      `}</style>
    </article>
  );
};

export default BlogContent;