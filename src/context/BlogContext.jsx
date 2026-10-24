import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchStrapiData, getLocalDataSync } from '../services/strapi';
import { formatStrapiBlogs } from '../utils/formatBlog';
import fallbackDB from '../data/Blogdb.js';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const cached = window.localStorage.getItem('pisl_cache_blogs');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return formatStrapiBlogs(parsed);
        }
      } catch (e) {}
    }
    return fallbackDB || [];
  });
  
  const [blogPage, setBlogPage] = useState(() => getLocalDataSync('blog-page'));
  const [loading, setLoading] = useState(false);

  // Fresh Network Fetcher: Always checks live Strapi for latest added blogs
  const refreshBlogs = useCallback(async () => {
    try {
      const [blogData, pageData] = await Promise.all([
        fetchStrapiData('blogs?populate=*&pagination[pageSize]=100&sort=createdAt:desc', { forceFresh: true }).catch(() => null),
        fetchStrapiData('blog-page?populate=seo,heroImage', { forceFresh: true }).catch(() => null)
      ]);
      if (blogData && Array.isArray(blogData) && blogData.length > 0) {
        const formatted = formatStrapiBlogs(blogData);
        setBlogs(formatted);
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.setItem('pisl_cache_blogs', JSON.stringify(blogData));
          } catch (e) {}
        }
      }
      if (pageData) {
        setBlogPage(pageData);
      }
    } catch (e) {
      // Fallback remains active
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Fetch live fresh data on mount
    refreshBlogs();

    // 2. Auto-reload when user returns to this tab (e.g. after adding a blog in Strapi Admin)
    const handleFocus = () => {
      refreshBlogs();
    };
    window.addEventListener('focus', handleFocus);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshBlogs();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 3. Listen to live data update events
    const handleUpdate = (e) => {
      const { endpoint, cleanEndpoint, data } = e.detail || {};
      if ((endpoint && endpoint.includes('blogs')) || (cleanEndpoint && cleanEndpoint.includes('blogs'))) {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(formatStrapiBlogs(data));
        }
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pisl-data-update', handleUpdate);
    };
  }, [refreshBlogs]);

  return (
    <BlogContext.Provider value={{ blogs, blogPage, loading, refreshBlogs }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => useContext(BlogContext);
