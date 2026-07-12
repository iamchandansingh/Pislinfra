// src/components/Blog/BlogContent.jsx

import React from 'react';

const BlogContent = ({ content, galleryImages = [] }) => {
  const formatContent = (rawContent) => {
    const paragraphs = rawContent.split('\n\n');
    
    return paragraphs.map((para, index) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // Main heading with number (1. Title)
      if (trimmed.match(/^\d+\.\s/)) {
        const title = trimmed.replace(/^\d+\.\s/, '');
        return (
          <h2 key={index} style={{
            fontSize: '24px', fontWeight: 700, color: '#052A73',
            margin: '32px 0 12px', fontFamily: 'Inter, sans-serif', lineHeight: 1.3,
          }}>{title}</h2>
        );
      }

      // Sub heading with letter (A. Title)
      if (trimmed.match(/^[A-Z]\.\s/)) {
        const title = trimmed.replace(/^[A-Z]\.\s/, '');
        return (
          <h3 key={index} style={{
            fontSize: '20px', fontWeight: 700, color: '#052A73',
            margin: '24px 0 10px', fontFamily: 'Inter, sans-serif', lineHeight: 1.3,
          }}>{title}</h3>
        );
      }

      // FAQ Q&A format
      if (trimmed.startsWith('Q') && trimmed.includes('?')) {
        const lines = trimmed.split('\n');
        const question = lines[0];
        const answer = lines.slice(1).join('\n');
        return (
          <div key={index} style={{
            backgroundColor: '#F8FAFC', border: '1px solid #EEF2F7',
            borderRadius: '12px', padding: '20px', margin: '24px 0',
          }}>
            <h4 style={{
              fontSize: '16px', fontWeight: 700, color: '#052A73',
              margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif',
            }}>{question}</h4>
            <p style={{
              fontSize: '15px', lineHeight: 1.7, color: '#475569',
              margin: 0, fontFamily: 'Inter, sans-serif',
            }}>{answer}</p>
          </div>
        );
      }

      // Bold text markers (**text**)
      if (trimmed.includes('**')) {
        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} style={{
            fontSize: '16px', lineHeight: 1.8, color: '#475569',
            margin: '0 0 16px 0', fontFamily: 'Inter, sans-serif',
          }}>
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} style={{ color: '#052A73', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      }

      // Bullet points (* text)
      if (trimmed.startsWith('* ')) {
        return (
          <li key={index} style={{
            fontSize: '15px', lineHeight: 1.7, color: '#475569',
            margin: '0 0 8px 20px', fontFamily: 'Inter, sans-serif',
          }}>{trimmed.replace('* ', '')}</li>
        );
      }

      // Regular paragraph
      return (
        <p key={index} style={{
          fontSize: '16px', lineHeight: 1.8, color: '#475569',
          margin: '0 0 16px 0', fontFamily: 'Inter, sans-serif',
        }}>{trimmed}</p>
      );
    });
  };

  return (
    <div>
      <div className="blog-content">{formatContent(content)}</div>
      
      {galleryImages && galleryImages.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{
            fontSize: '22px', fontWeight: 700, color: '#052A73',
            margin: '0 0 20px 0', fontFamily: 'Inter, sans-serif',
          }}>Gallery</h3>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {galleryImages.map((img, index) => (
              <div key={index} style={{
                borderRadius: '12px', overflow: 'hidden', height: '250px',
              }}>
                <img src={img} alt={`Gallery ${index + 1}`} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogContent;