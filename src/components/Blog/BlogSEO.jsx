// src/components/Blog/BlogSEO.jsx

import { useEffect } from 'react';

const BlogSEO = ({ blog }) => {
  useEffect(() => {
    if (!blog) return;

    // ==================== DETECT CONTENT TYPE ====================
    const isCaseStudy = blog.contentType === 'case-study' || blog.articleSection === 'Case Studies';
    const isBlog = blog.contentType === 'blog' || blog.articleSection === 'Blog' || (!blog.contentType && blog.slug);
    const isPage = blog.contentType === 'page';
    
    const parentPath = isCaseStudy ? '/projects/case-study' : isBlog ? '/blog' : '';
    const parentName = isCaseStudy ? 'Case Studies' : isBlog ? 'Blog' : '';
    const siteName = 'Pislinfra';
    const siteUrl = window.location.origin || 'https://pislinfra.com';

    // ==================== FALLBACK LOGIC ====================
    const seoTitle = blog.seoTitle || `${blog.title} | Pislinfra`;
    const rawExcerpt = blog.seoDescription || blog.excerpt || (typeof blog.content === 'string' ? blog.content.substring(0, 160) : '');
    const seoDescription = rawExcerpt.replace(/[\n\r]+/g, ' ').trim().substring(0, 160);
    const ogTitle = blog.ogTitle || blog.seoTitle || blog.title;
    const ogDescription = blog.ogDescription || seoDescription;
    const rawImage = blog.ogImage || blog.featuredImage || blog.image || '/images/hero/Blog.png';
    const absoluteImage = rawImage.startsWith('http') ? rawImage : `${siteUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
    
    // Canonical URL
    let canonicalUrl = blog.canonicalUrl || '';
    if (!canonicalUrl) {
      if (isCaseStudy || isBlog) {
        canonicalUrl = `${siteUrl}${parentPath}/${blog.slug}`;
      } else {
        canonicalUrl = blog.slug ? `${siteUrl}/${blog.slug}` : siteUrl;
      }
    }
    
    const twitterTitle = blog.twitterTitle || seoTitle;
    const twitterDescription = blog.twitterDescription || seoDescription;
    const twitterImage = blog.twitterImage || absoluteImage;
    const publishDate = blog.publishDate || '2026-01-01';
    const updatedDate = blog.updatedDate || blog.publishDate || new Date().toISOString().split('T')[0];
    const authorName = blog.authorName || blog.author?.name || 'Pragati Infra Solutions Pvt. Ltd.';

    // ==================== TITLE TAG ====================
    document.title = seoTitle;

    // ==================== META TAG HELPER ====================
    const setMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const removeMetaTag = (name, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      document.querySelectorAll(`meta[${attr}="${name}"]`).forEach(el => el.remove());
    };

    // ==================== CORE SEO META TAGS ====================
    setMetaTag('description', seoDescription);
    setMetaTag('keywords', blog.seoKeywords || (Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || 'warehouse construction, industrial infrastructure, PEB buildings'));
    setMetaTag('author', authorName);

    // ==================== ROBOTS & CRAWLER DIRECTIVES ====================
    setMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('googlebot-news', 'index, follow');
    setMetaTag('bingbot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // ==================== VOICE SEARCH & GOOGLE ASSISTANT TAGS ====================
    setMetaTag('voice-search-enabled', 'true');
    setMetaTag('speakable', 'true');
    setMetaTag('google-assistant-ready', 'true');

    // ==================== AI SEARCH ENGINE CITATIONS ====================
    setMetaTag('citation_title', blog.title);
    setMetaTag('citation_author', authorName);
    setMetaTag('citation_publication_date', publishDate);
    setMetaTag('citation_online_date', updatedDate);
    setMetaTag('citation_fulltext_html_url', canonicalUrl);
    setMetaTag('citation_language', blog.language || 'en');

    // ==================== CANONICAL URL ====================
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);

    // ==================== OPEN GRAPH TAGS ====================
    setMetaTag('og:title', ogTitle, true);
    setMetaTag('og:description', ogDescription, true);
    setMetaTag('og:image', absoluteImage, true);
    setMetaTag('og:image:secure_url', absoluteImage, true);
    setMetaTag('og:image:alt', blog.imageAlt || blog.title, true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:type', blog.ogType || (isCaseStudy || isBlog ? 'article' : 'website'), true);
    setMetaTag('og:site_name', siteName, true);
    setMetaTag('og:locale', 'en_IN', true);

    // ==================== TWITTER CARD TAGS ====================
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:site', '@Pislinfra');
    setMetaTag('twitter:creator', '@Pislinfra');
    setMetaTag('twitter:title', twitterTitle);
    setMetaTag('twitter:description', twitterDescription);
    setMetaTag('twitter:image', twitterImage);
    setMetaTag('twitter:image:alt', blog.imageAlt || blog.title);

    // ==================== ARTICLE META ====================
    if (isCaseStudy || isBlog) {
      setMetaTag('article:published_time', new Date(publishDate).toISOString(), true);
      setMetaTag('article:modified_time', new Date(updatedDate).toISOString(), true);
      setMetaTag('article:author', authorName, true);
      setMetaTag('article:section', blog.articleSection || blog.category || 'Industrial Construction', true);

      if (blog.tags) {
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
        const tagsArray = Array.isArray(blog.tags) ? blog.tags : (typeof blog.tags === 'string' ? blog.tags.split(',').map(t => t.trim()) : []);
        tagsArray.forEach(tag => {
          const element = document.createElement('meta');
          element.setAttribute('property', 'article:tag');
          element.setAttribute('content', tag);
          document.head.appendChild(element);
        });
      }
    }

    // ==================== JSON-LD SCHEMA MARKUP ====================
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());

    // 1. Google Assistant / Voice Search Speakable Specification Schema
    const speakableSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      'url': canonicalUrl,
      'name': blog.title,
      'description': seoDescription,
      'speakable': {
        '@type': 'SpeakableSpecification',
        'cssSelector': [
          '#speakable-summary',
          '.speakable-quick-answer',
          '.blog-hero-title',
          '.blog-hero-excerpt',
          '.content-h2',
          '.content-p',
          '.faq-answer'
        ],
        'xpath': [
          '/html/head/title',
          '/html/head/meta[@name=\'description\']/@content'
        ]
      }
    };
    addJsonLd(speakableSchema);

    // 2. High-Resolution Google Images Schema (ImageObject)
    const imageObjectSchema = {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      '@id': `${absoluteImage}#primaryimage`,
      'url': absoluteImage,
      'contentUrl': absoluteImage,
      'thumbnailUrl': absoluteImage,
      'width': 1200,
      'height': 630,
      'caption': blog.imageCaption || blog.excerpt || blog.title,
      'name': blog.imageTitle || blog.title,
      'description': blog.imageAlt || blog.title,
      'representativeOfPage': true,
      'license': `${siteUrl}/privacy-policy`,
      'acquireLicensePage': `${siteUrl}/contact-us`,
      'creditText': 'Pragati Infra Solutions Pvt. Ltd.',
      'creator': {
        '@type': 'Organization',
        'name': 'Pislinfra',
        'url': siteUrl
      },
      'copyrightNotice': `© ${new Date().getFullYear()} Pragati Infra Solutions Pvt. Ltd.`
    };
    addJsonLd(imageObjectSchema);

    // 3. BlogPosting / Article Schema
    const blogPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      'isPartOf': {
        '@type': 'WebSite',
        'name': siteName,
        'url': siteUrl
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      'headline': blog.headline || blog.title,
      'name': blog.title,
      'description': seoDescription,
      'image': imageObjectSchema,
      'datePublished': publishDate,
      'dateModified': updatedDate,
      'inLanguage': blog.language || 'en-IN',
      'wordCount': blog.wordCount || (blog.content ? blog.content.split(/\s+/).length : 1200),
      'keywords': blog.seoKeywords || (Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags),
      'articleSection': blog.articleSection || blog.category || 'Industrial Construction & Infrastructure',
      'author': {
        '@type': 'Organization',
        'name': authorName,
        'url': `${siteUrl}/about`,
        'logo': `${siteUrl}/logo.png`
      },
      'publisher': {
        '@type': 'Organization',
        'name': siteName,
        'url': siteUrl,
        'logo': {
          '@type': 'ImageObject',
          'url': `${siteUrl}/logo.png`,
          'width': 512,
          'height': 512
        }
      },
      'speakable': {
        '@type': 'SpeakableSpecification',
        'cssSelector': ['#speakable-summary', '.blog-hero-title', '.blog-hero-excerpt', '.content-h2']
      }
    };
    addJsonLd(blogPostingSchema);

    // 4. BreadcrumbList Schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': siteUrl },
        { '@type': 'ListItem', 'position': 2, 'name': parentName || 'Blog', 'item': `${siteUrl}${parentPath || '/blog'}` },
        { '@type': 'ListItem', 'position': 3, 'name': blog.title, 'item': canonicalUrl }
      ]
    };
    addJsonLd(breadcrumbSchema);

    // 5. FAQ Schema (Extract from blog.faqSchema or parse from content)
    let faqsToInclude = Array.isArray(blog.faqSchema) && blog.faqSchema.length > 0 ? blog.faqSchema : [];
    
    // Auto-extract FAQs from content if missing
    if (faqsToInclude.length === 0 && typeof blog.content === 'string') {
      const qMatches = blog.content.match(/Q\d+[:.]\s*(.*?)\n+A\d*[:.]?\s*(.*?)(?=\n+Q\d+|$)/gis);
      if (qMatches && qMatches.length > 0) {
        faqsToInclude = qMatches.slice(0, 5).map(m => {
          const parts = m.split(/\n+A\d*[:.]?\s*/i);
          return {
            question: parts[0]?.replace(/^Q\d+[:.]\s*/i, '').trim(),
            answer: parts[1]?.trim()
          };
        }).filter(f => f.question && f.answer);
      }
    }

    if (faqsToInclude.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqsToInclude.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      };
      addJsonLd(faqSchema);
    }

    // 6. Organization Knowledge Graph Schema
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      'name': 'Pragati Infra Solutions Pvt. Ltd.',
      'alternateName': ['Pislinfra', 'PISL'],
      'url': siteUrl,
      'logo': `${siteUrl}/logo.png`,
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+91-124-400-0000',
        'contactType': 'customer support',
        'areaServed': 'IN',
        'availableLanguage': ['en', 'hi']
      },
      'sameAs': [
        'https://www.linkedin.com/company/pislinfra',
        'https://twitter.com/Pislinfra',
        'https://www.facebook.com/pislinfra'
      ]
    };
    addJsonLd(orgSchema);

    // ==================== IMAGE ALT HELPER ====================
    window.__BLOG_IMAGE_DATA__ = {
      alt: blog.imageAlt || blog.title,
      title: blog.imageTitle || blog.title,
      caption: blog.imageCaption || blog.excerpt || blog.title,
      license: `${siteUrl}/privacy-policy`,
    };

    // ==================== CLEANUP ====================
    return () => {
      document.title = 'Pislinfra';
      removeMetaTag('description');
      removeMetaTag('keywords');
      removeMetaTag('author');
      removeMetaTag('robots');
      removeMetaTag('googlebot');
      removeMetaTag('googlebot-news');
      removeMetaTag('bingbot');
      removeMetaTag('voice-search-enabled');
      removeMetaTag('speakable');
      removeMetaTag('google-assistant-ready');
      removeMetaTag('citation_title');
      removeMetaTag('citation_author');
      removeMetaTag('citation_publication_date');
      removeMetaTag('citation_online_date');
      removeMetaTag('citation_fulltext_html_url');
      removeMetaTag('citation_language');
      removeMetaTag('og:title', true);
      removeMetaTag('og:description', true);
      removeMetaTag('og:image', true);
      removeMetaTag('og:image:secure_url', true);
      removeMetaTag('og:image:alt', true);
      removeMetaTag('og:image:width', true);
      removeMetaTag('og:image:height', true);
      removeMetaTag('og:url', true);
      removeMetaTag('og:type', true);
      removeMetaTag('og:site_name', true);
      removeMetaTag('og:locale', true);
      removeMetaTag('twitter:card');
      removeMetaTag('twitter:site');
      removeMetaTag('twitter:creator');
      removeMetaTag('twitter:title');
      removeMetaTag('twitter:description');
      removeMetaTag('twitter:image');
      removeMetaTag('twitter:image:alt');
      document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
      document.querySelectorAll('meta[property="article:published_time"]').forEach(el => el.remove());
      document.querySelectorAll('meta[property="article:modified_time"]').forEach(el => el.remove());
      document.querySelectorAll('meta[property="article:author"]').forEach(el => el.remove());
      document.querySelectorAll('meta[property="article:section"]').forEach(el => el.remove());
      document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) canonicalEl.remove();
      delete window.__BLOG_IMAGE_DATA__;
    };
  }, [blog]);

  return null;
};

const addJsonLd = (schema) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

export default BlogSEO;