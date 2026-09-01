// src/components/BlogDetail/BlogContent.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiCheckCircle } from 'react-icons/fi';
import { useBlogs } from '../../context/BlogContext';

const getInternalLinks = (BlogDB) => {
  const links = {};
  if (Array.isArray(BlogDB)) {
    BlogDB.forEach(blog => {
      if (blog.title && blog.slug) {
        links[blog.title] = `/blog/${blog.slug}`;
      }
    });
  }
  return links;
};

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div 
      className="faq-item" 
      itemScope 
      itemProp="mainEntity" 
      itemType="https://schema.org/Question" 
      style={{ borderBottom: '1px solid #E5E7EB' }}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', padding: '16px 0', textAlign: 'left', fontSize: '15px', fontWeight: 700,
          color: '#081B4B', backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#FF6B00'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#081B4B'; }}
      >
        <span itemProp="name" className="faq-question" style={{ flex: 1 }}>{question}</span>
        {open ? <FiChevronUp size={18} style={{ color: '#FF6B00', flexShrink: 0 }} /> : <FiChevronDown size={18} style={{ color: '#081B4B', flexShrink: 0 }} />}
      </button>
      <div 
        itemScope 
        itemProp="acceptedAnswer" 
        itemType="https://schema.org/Answer"
        style={{ maxHeight: open ? '2000px' : '0', opacity: open ? 1 : 0, overflow: 'hidden', transition: 'all 0.3s ease' }}
      >
        <p 
          itemProp="text" 
          className="faq-answer"
          data-speakable="true"
          style={{ paddingBottom: '16px', fontSize: '14px', lineHeight: 1.7, color: '#334155', margin: 0, fontFamily: 'Inter, sans-serif' }}
        >
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

const RenderImageBlock = ({ src, alt, caption, keyId }) => {
  if (!src) return null;
  const cleanAlt = alt && !alt.endsWith('.avif') && !alt.endsWith('.png') && !alt.endsWith('.jpg') && !alt.endsWith('.webp') ? alt : 'Pislinfra Infrastructure';
  const showCaption = caption || (alt && !alt.endsWith('.avif') && !alt.endsWith('.png') && !alt.endsWith('.jpg') && !alt.endsWith('.webp') && alt.length > 5 ? alt : null);

  return (
    <figure 
      key={keyId} 
      itemScope 
      itemType="https://schema.org/ImageObject"
      style={{ margin: '28px 0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', backgroundColor: '#F8FAFC' }}
    >
      <img 
        src={src} 
        alt={cleanAlt} 
        title={cleanAlt}
        itemProp="contentUrl"
        loading="lazy" 
        decoding="async"
        style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block', borderRadius: '12px' }} 
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      {showCaption && (
        <figcaption itemProp="caption" style={{ padding: '10px 16px', fontSize: '12.5px', color: '#64748B', backgroundColor: '#F8FAFC', borderTop: '1px solid #EEF2F7', fontStyle: 'italic', textAlign: 'center' }}>
          {showCaption}
        </figcaption>
      )}
    </figure>
  );
};

const BlogContent = ({ content = '', images = [], faq = [], onContentReady }) => {
  const { blogs: BlogDB } = useBlogs();
  const contentRef = useRef(null);
  const internalLinks = getInternalLinks(BlogDB);

  useEffect(() => {
    if (contentRef.current && onContentReady) {
      const cleanText = content
        .replace(/!\[(.*?)\]\((.*?)\)/g, '')
        .replace(/<img[^>]*>/gi, '')
        .replace(/^(#{1,6})\s+/gm, '')
        .replace(/\[IMAGE\]/g, '')
        .replace(/\[IMAGE:2\]/g, '')
        .replace(/\*\*/g, '')
        .trim();
      onContentReady(cleanText);
    }
  }, [content, onContentReady]);

  const isHeadingLine = (text) => {
    if (text.length > 90) return false;
    if (text.includes('**')) return false;
    if (text.includes('|')) return false;
    if (/^Q\d+\./i.test(text)) return false;
    if (text.includes('![')) return false;
    if (text.includes('<img')) return false;
    if (text.startsWith('#')) return false;
    if (text.endsWith('?') || text.endsWith(':')) return true;
    const words = text.split(' ');
    if (words.length >= 2 && words.length <= 7 && words.every(w => w[0] === w[0]?.toUpperCase())) return true;
    return false;
  };

  const renderContent = (rawContent) => {
    if (!rawContent) return <p style={{ color: '#64748B', fontFamily: 'Inter, sans-serif' }}>No content available.</p>;
    if (typeof rawContent !== 'string') return null;

    // Normalizing newlines
    const normalized = rawContent.replace(/\r\n/g, '\n');
    const rawBlocks = normalized.split('\n\n');
    let imageIndex = 0;
    let isCollectingTable = false;
    let tableData = [];
    const elements = [];

    rawBlocks.forEach((block, index) => {
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

      // ── CHECK 1: Standalone or multi-line Markdown/HTML image in block ──
      const imgRegex = /!\[(.*?)\]\((.*?)\)|<img\s+[^>]*src=["'](.*?)["'][^>]*>/i;
      if (imgRegex.test(trimmed)) {
        const parts = trimmed.split(/(!\[.*?\]\(.*?\)|<img\s+[^>]*>)/i);
        parts.forEach((part, pIdx) => {
          const pTrim = part.trim();
          if (!pTrim) return;

          // Markdown Image ![alt](url)
          const mdM = pTrim.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (mdM) {
            elements.push(<RenderImageBlock keyId={`img-md-${index}-${pIdx}`} src={mdM[2]} alt={mdM[1]} />);
            return;
          }

          // HTML Image <img src="..." />
          const htmlM = pTrim.match(/<img\s+[^>]*src=["'](.*?)["'][^>]*>/i);
          if (htmlM) {
            elements.push(<RenderImageBlock keyId={`img-html-${index}-${pIdx}`} src={htmlM[1]} alt="Pislinfra Project" />);
            return;
          }

          // Regular text around the image
          elements.push(
            <p key={`p-img-txt-${index}-${pIdx}`} className="content-p" data-speakable="true" style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155', margin: '0 0 16px 0', fontFamily: 'Inter, sans-serif' }}>
              {pTrim}
            </p>
          );
        });
        return;
      }

      // ── CHECK 2: Markdown Headings (#, ##, ###, ####, #####) ──
      const hashHeadingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (hashHeadingMatch) {
        const level = hashHeadingMatch[1].length;
        const headingText = hashHeadingMatch[2].replace(/\*\*/g, '').trim();
        const headingId = headingText.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        if (level === 1 || level === 2) {
          elements.push(
            <h2 
              key={`h2-md-${index}`} 
              id={headingId} 
              className="content-h2" 
              data-speakable="true" 
              style={{ 
                fontSize: level === 1 ? '24px' : '21px', 
                fontWeight: 800, 
                color: '#081B4B', 
                margin: '34px 0 14px 0', 
                fontFamily: 'Inter, sans-serif', 
                letterSpacing: '-0.02em', 
                lineHeight: 1.3 
              }}
            >
              {headingText}
            </h2>
          );
        } else {
          elements.push(
            <h3 
              key={`h3-md-${index}`} 
              id={headingId} 
              className="content-h3" 
              data-speakable="true" 
              style={{ 
                fontSize: level === 3 ? '18px' : '16px', 
                fontWeight: 700, 
                color: '#081B4B', 
                margin: '26px 0 10px 0', 
                fontFamily: 'Inter, sans-serif', 
                lineHeight: 1.3 
              }}
            >
              {headingText}
            </h3>
          );
        }
        return;
      }

      // Google Image optimized image single block [IMAGE]
      if (trimmed === '[IMAGE]') {
        const img = images[imageIndex]; imageIndex++;
        if (img) {
          const imgSrc = typeof img === 'string' ? img : img.src;
          const imgAlt = typeof img === 'string' ? 'Pislinfra industrial infrastructure engineering' : (img.alt || img.title || 'Pislinfra project');
          elements.push(<RenderImageBlock keyId={`img-legacy-${index}`} src={imgSrc} alt={imgAlt} />);
        }
        return;
      }

      // Google Image optimized dual image grid [IMAGE:2]
      if (trimmed === '[IMAGE:2]') {
        const img1 = images[imageIndex]; const img2 = images[imageIndex + 1]; imageIndex += 2;
        const src1 = typeof img1 === 'string' ? img1 : img1?.src;
        const alt1 = typeof img1 === 'string' ? 'Pislinfra industrial construction site' : (img1?.alt || 'Pislinfra construction');
        const src2 = typeof img2 === 'string' ? img2 : img2?.src;
        const alt2 = typeof img2 === 'string' ? 'Pislinfra engineering quality' : (img2?.alt || 'Pislinfra engineering');

        elements.push(
          <div key={`img2-${index}`} className="img-two" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '14px', margin: '24px 0' }}>
            {src1 && (
              <figure itemScope itemType="https://schema.org/ImageObject" style={{ margin: 0, borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <img src={src1} alt={alt1} title={alt1} itemProp="contentUrl" loading="lazy" decoding="async" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
              </figure>
            )}
            {src2 && (
              <figure itemScope itemType="https://schema.org/ImageObject" style={{ margin: 0, borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <img src={src2} alt={alt2} title={alt2} itemProp="contentUrl" loading="lazy" decoding="async" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
              </figure>
            )}
            <style>{`@media (min-width: 640px) { .img-two { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
          </div>
        );
        return;
      }

      // Numbered Heading: 1. Heading Title
      if (/^\d+\.\s/.test(trimmed)) {
        const headingText = trimmed.replace(/^\d+\.\s/, '');
        const headingId = headingText.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        elements.push(
          <h2 key={`h2-${index}`} id={headingId} className="content-h2" data-speakable="true" style={{ fontSize: '21px', fontWeight: 700, color: '#081B4B', margin: '32px 0 12px 0', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            {headingText}
          </h2>
        );
        return;
      }

      // Section Letter Heading: A. Heading Title
      if (/^[A-Z]\.\s/.test(trimmed)) {
        elements.push(
          <h3 key={`h3-${index}`} className="content-h3" data-speakable="true" style={{ fontSize: '17px', fontWeight: 700, color: '#081B4B', margin: '22px 0 8px 0', fontFamily: 'Inter, sans-serif', lineHeight: 1.3 }}>
            {trimmed.replace(/^[A-Z]\.\s/, '')}
          </h3>
        );
        return;
      }

      // Short standalone question / title
      if (isHeadingLine(trimmed)) {
        const headingId = trimmed.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        elements.push(
          <h3 key={`h3u-${index}`} id={headingId} className="content-h3" data-speakable="true" style={{ fontSize: '18px', fontWeight: 700, color: '#081B4B', margin: '24px 0 8px 0', fontFamily: 'Inter, sans-serif', lineHeight: 1.3 }}>
            {trimmed}
          </h3>
        );
        return;
      }

      if (/^Q\d+\./i.test(trimmed)) return;

      const renderFormattedText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
        return parts.map((part, i) => {
          if (!part) return null;
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
        elements.push(
          <p key={`formatted-${index}`} className="content-p" data-speakable="true" style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155', margin: '0 0 16px 0', fontFamily: 'Inter, sans-serif' }}>
            {renderFormattedText(trimmed)}
          </p>
        );
        return;
      }

      const linkMatch = trimmed.match(/^(Read also|Also Read|You may also like)\s*[–-]\s*(.+)$/i);
      if (linkMatch) {
        const prefix = linkMatch[1]; const blogTitle = linkMatch[2].trim();
        for (const [title, slug] of Object.entries(internalLinks)) {
          if (blogTitle.toLowerCase() === title.toLowerCase()) {
            elements.push(
              <p key={`link-${index}`} className="content-p" style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155', margin: '18px 0', fontFamily: 'Inter, sans-serif' }}>
                <FiCheckCircle style={{ color: '#FF6B00', marginRight: '6px', verticalAlign: 'middle' }} />
                {prefix} –{' '}
                <Link to={slug} style={{ color: '#FF6B00', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderBottom = '1px solid #FF6B00'; }} onMouseLeave={(e) => { e.currentTarget.style.borderBottom = '1px solid transparent'; }}>
                  {blogTitle}
                </Link>
              </p>
            );
            return;
          }
        }
      }

      elements.push(
        <p key={`p-${index}`} className="content-p" data-speakable="true" style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155', margin: '0 0 16px 0', fontFamily: 'Inter, sans-serif' }}>
          {trimmed}
        </p>
      );
    });

    return elements;
  };

  return (
    <article 
      ref={contentRef} 
      className="blog-content-article" 
      itemScope 
      itemType="https://schema.org/BlogPosting"
      itemProp="articleBody"
      style={{ width: '100%', padding: '40px 32px', fontFamily: 'Inter, sans-serif', borderRadius: '14px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', boxSizing: 'border-box' }}
    >
      {renderContent(content)}
      {faq && faq.length > 0 && (
        <section 
          className="faq-section" 
          itemScope 
          itemType="https://schema.org/FAQPage"
          style={{ marginTop: '40px', paddingTop: '28px', borderTop: '2px solid #F1F5F9' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#081B4B', margin: '0 0 16px 0', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', padding: '0 16px' }}>
            {faq.map((item, index) => <FAQItem key={index} question={item.question} answer={item.answer} />)}
          </div>
        </section>
      )}
      <style>{`
        @media (max-width: 640px) {
          .blog-content-article { padding: 24px 16px !important; border-radius: 10px !important; }
          .content-h1 { font-size: 22px !important; margin-bottom: 16px !important; }
          .content-h2 { font-size: 18px !important; margin-top: 20px !important; }
          .content-h3 { font-size: 15px !important; margin-top: 16px !important; }
          .content-p { font-size: 13.5px !important; line-height: 1.7 !important; }
          .table-wrapper { margin: 16px 0 !important; border-radius: 8px !important; }
          .table-th { padding: 8px 10px !important; font-size: 11px !important; }
          .table-td { padding: 8px 10px !important; font-size: 11px !important; }
        }
        @media (max-width: 400px) {
          .blog-content-article { padding: 20px 12px !important; }
          .content-h1 { font-size: 20px !important; }
          .content-h2 { font-size: 16px !important; }
          .content-h3 { font-size: 14px !important; }
          .content-p { font-size: 12.5px !important; }
        }
      `}</style>
    </article>
  );
};

export default BlogContent;