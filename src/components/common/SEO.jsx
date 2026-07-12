// src/components/blog/BlogSEO.jsx

import { useEffect } from 'react';

const BlogSEO = ({ blog }) => {
  useEffect(() => {
    if (!blog) return;

    // ==================== FALLBACK LOGIC ====================
    const seoTitle = blog.seoTitle || blog.title;
    const seoDescription = blog.seoDescription || blog.excerpt?.substring(0, 160);
    const ogTitle = blog.ogTitle || blog.seoTitle || blog.title;
    const ogDescription = blog.ogDescription || blog.seoDescription || blog.excerpt?.substring(0, 160);
    const ogImage = blog.ogImage || blog.featuredImage;
    const canonicalUrl = blog.canonicalUrl || `${window.location.origin}/blog/${blog.slug}`;
    const twitterTitle = blog.twitterTitle || blog.seoTitle || blog.title;
    const twitterDescription = blog.twitterDescription || blog.seoDescription || blog.excerpt?.substring(0, 160);
    const twitterImage = blog.twitterImage || blog.ogImage || blog.featuredImage;
    const siteName = blog.ogSiteName || 'PISL - Pragati Infra Solutions';

    // ==================== TITLE TAG ====================
    document.title = seoTitle;

    // ==================== META TAG HELPER ====================
    const setMetaTag = (name, content, isProperty = false) => {
      if (content === undefined || content === null || content === '') return;
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
      const element = document.querySelector(`meta[${attr}="${name}"]`);
      if (element) element.remove();
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
    setMetaTag('og:type', blog.ogType || 'article', true);
    setMetaTag('og:site_name', siteName, true);

    // ==================== TWITTER CARD TAGS ====================
    setMetaTag('twitter:card', blog.twitterCardType || 'summary_large_image');
    setMetaTag('twitter:title', twitterTitle);
    setMetaTag('twitter:description', twitterDescription);
    setMetaTag('twitter:image', twitterImage);

    // ==================== ARTICLE META ====================
    if (blog.publishDate) {
      setMetaTag('article:published_time', new Date(blog.publishDate).toISOString(), true);
    }
    if (blog.updatedDate) {
      setMetaTag('article:modified_time', new Date(blog.updatedDate).toISOString(), true);
    }
    if (blog.articleSection) {
      setMetaTag('article:section', blog.articleSection, true);
    }
    blog.tags?.forEach(tag => {
      // Add article:tag meta
      const element = document.createElement('meta');
      element.setAttribute('property', 'article:tag');
      element.setAttribute('content', tag);
      document.head.appendChild(element);
    });

    // ==================== JSON-LD SCHEMA MARKUP ====================
    
    // Remove existing JSON-LD scripts
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());

    // Article Schema
    if (blog.schemaType) {
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': blog.schemaType || 'Article',
        headline: blog.headline || blog.title,
        description: seoDescription,
        image: ogImage,
        datePublished: blog.publishDate,
        dateModified: blog.updatedDate || blog.publishDate,
        author: {
          '@type': 'Person',
          name: blog.authorName || blog.author?.name,
          url: blog.authorUrl || `${window.location.origin}/about`,
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${window.location.origin}/images/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      };
      addJsonLd(articleSchema);
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

    // Breadcrumb Schema
    if (blog.breadcrumbSchema) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: window.location.origin,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${window.location.origin}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: blog.title,
            item: canonicalUrl,
          },
        ],
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
        logo: `${window.location.origin}/images/logo.png`,
        sameAs: [
          'https://www.linkedin.com/company/pisl',
          'https://twitter.com/pisl',
        ],
      };
      addJsonLd(orgSchema);
    }

    // ==================== IMAGE ALT HELPER ====================
    // Store image data for components to use
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
      document.title = 'PISL - Pragati Infra Solutions';
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
      document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
      delete window.__BLOG_IMAGE_DATA__;
    };
  }, [blog]);

  return null;
};

// Helper to add JSON-LD
const addJsonLd = (schema) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

export default BlogSEO;