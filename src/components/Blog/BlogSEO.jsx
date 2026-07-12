// src/components/Blog/BlogSEO.jsx

import { useEffect } from 'react';

const BlogSEO = ({ blog }) => {
  useEffect(() => {
    if (!blog) return;

    // ==================== DETECT CONTENT TYPE ====================
    const isCaseStudy = blog.contentType === 'case-study' || blog.articleSection === 'Case Studies';
    const isBlog = blog.contentType === 'blog' || blog.articleSection === 'Blog';
    const isPage = blog.contentType === 'page';
    
    const parentPath = isCaseStudy ? '/projects/case-study' : isBlog ? '/blog' : '';
    const parentName = isCaseStudy ? 'Case Studies' : isBlog ? 'Blog' : '';
    const siteName = 'Pislinfra';

    // ==================== FALLBACK LOGIC ====================
    const seoTitle = blog.seoTitle || blog.title;
    const seoDescription = blog.seoDescription || blog.excerpt?.substring(0, 160);
    const ogTitle = blog.ogTitle || blog.seoTitle || blog.title;
    const ogDescription = blog.ogDescription || blog.seoDescription || blog.excerpt?.substring(0, 160);
    const ogImage = blog.ogImage || blog.featuredImage || blog.image || '/logo.png';
    
    // Canonical URL
    let canonicalUrl = blog.canonicalUrl || '';
    if (!canonicalUrl) {
      const origin = window.location.origin;
      if (isCaseStudy || isBlog) {
        canonicalUrl = `${origin}${parentPath}/${blog.slug}`;
      } else {
        canonicalUrl = blog.slug ? `${origin}/${blog.slug}` : origin;
      }
    }
    
    const twitterTitle = blog.twitterTitle || blog.seoTitle || blog.title;
    const twitterDescription = blog.twitterDescription || blog.seoDescription || blog.excerpt?.substring(0, 160);
    const twitterImage = blog.twitterImage || blog.ogImage || blog.featuredImage || blog.image || '/logo.png';

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
    setMetaTag('keywords', blog.seoKeywords);

    // ==================== ROBOTS META ====================
    const robotsRules = [];
    if (blog.noIndex) robotsRules.push('noindex'); else robotsRules.push('index');
    if (blog.noFollow) robotsRules.push('nofollow'); else robotsRules.push('follow');
    if (blog.noArchive) robotsRules.push('noarchive');
    if (blog.noSnippet) robotsRules.push('nosnippet');
    if (blog.maxSnippet !== undefined) robotsRules.push(`max-snippet:${blog.maxSnippet}`);
    if (blog.maxImagePreview) robotsRules.push(`max-image-preview:${blog.maxImagePreview}`);
    if (blog.maxVideoPreview !== undefined && blog.maxVideoPreview >= 0) robotsRules.push(`max-video-preview:${blog.maxVideoPreview}`);
    setMetaTag('robots', robotsRules.join(', '));

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
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:type', blog.ogType || (isCaseStudy || isBlog ? 'article' : 'website'), true);
    setMetaTag('og:site_name', siteName, true);

    // ==================== TWITTER CARD TAGS ====================
    setMetaTag('twitter:card', blog.twitterCardType || 'summary_large_image');
    setMetaTag('twitter:title', twitterTitle);
    setMetaTag('twitter:description', twitterDescription);
    setMetaTag('twitter:image', twitterImage);

    // ==================== ARTICLE META (only for blog/case-study) ====================
    if (isCaseStudy || isBlog) {
      if (blog.publishDate) {
        setMetaTag('article:published_time', new Date(blog.publishDate).toISOString(), true);
      }
      if (blog.updatedDate) {
        setMetaTag('article:modified_time', new Date(blog.updatedDate).toISOString(), true);
      }
      if (blog.articleSection) {
        setMetaTag('article:section', blog.articleSection, true);
      }
      if (blog.tags) {
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
        blog.tags.forEach(tag => {
          const element = document.createElement('meta');
          element.setAttribute('property', 'article:tag');
          element.setAttribute('content', tag);
          document.head.appendChild(element);
        });
      }
    }

    // ==================== JSON-LD SCHEMA MARKUP ====================
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());

    // Schema based on content type
    if (blog.schemaType) {
      const schemaType = isPage ? 'WebSite' : blog.schemaType || 'Article';
      
      const schema = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        name: schemaType === 'WebSite' || schemaType === 'Organization' ? siteName : undefined,
        headline: (isCaseStudy || isBlog) ? (blog.headline || blog.title) : undefined,
        description: seoDescription,
        image: ogImage,
        datePublished: (isCaseStudy || isBlog) ? blog.publishDate : undefined,
        dateModified: (isCaseStudy || isBlog) ? (blog.updatedDate || blog.publishDate) : undefined,
        author: (isCaseStudy || isBlog) ? {
          '@type': 'Organization',
          name: blog.authorName || blog.author?.name || 'Pislinfra Team',
          url: blog.authorUrl || `${window.location.origin}/about`,
        } : undefined,
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${window.location.origin}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        url: isPage ? canonicalUrl : undefined,
      };
      
      // Remove undefined values
      Object.keys(schema).forEach(key => schema[key] === undefined && delete schema[key]);
      
      addJsonLd(schema);
    }

    // FAQ Schema
    if (blog.faqSchema && blog.faqSchema.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: blog.faqSchema.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };
      addJsonLd(faqSchema);
    }

    // Breadcrumb Schema (Dynamic)
    if (blog.breadcrumbSchema) {
      const itemListElement = [
        { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
      ];
      
      if (parentName && parentPath) {
        itemListElement.push({ 
          '@type': 'ListItem', position: 2, 
          name: parentName, 
          item: `${window.location.origin}${parentPath}` 
        });
        itemListElement.push({ 
          '@type': 'ListItem', position: 3, 
          name: blog.title, 
          item: canonicalUrl 
        });
      } else {
        itemListElement.push({ 
          '@type': 'ListItem', position: 2, 
          name: blog.title, 
          item: canonicalUrl 
        });
      }
      
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement,
      };
      addJsonLd(breadcrumbSchema);
    }

    // Organization Schema
    if (blog.organizationSchema) {
      const orgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteName,
        url: window.location.origin,
        logo: `${window.location.origin}/logo.png`,
      };
      addJsonLd(orgSchema);
    }

    // ==================== IMAGE ALT HELPER ====================
    if (blog.imageAlt || blog.imageTitle) {
      window.__BLOG_IMAGE_DATA__ = {
        alt: blog.imageAlt || blog.title,
        title: blog.imageTitle || blog.title,
        caption: blog.imageCaption || '',
        license: blog.imageLicense || '',
      };
    }

    // ==================== CLEANUP ====================
    return () => {
      document.title = 'Pislinfra';
      removeMetaTag('description');
      removeMetaTag('keywords');
      removeMetaTag('robots');
      removeMetaTag('og:title', true);
      removeMetaTag('og:description', true);
      removeMetaTag('og:image', true);
      removeMetaTag('og:url', true);
      removeMetaTag('og:type', true);
      removeMetaTag('og:site_name', true);
      removeMetaTag('twitter:card');
      removeMetaTag('twitter:title');
      removeMetaTag('twitter:description');
      removeMetaTag('twitter:image');
      document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
      document.querySelectorAll('meta[property="article:published_time"]').forEach(el => el.remove());
      document.querySelectorAll('meta[property="article:modified_time"]').forEach(el => el.remove());
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