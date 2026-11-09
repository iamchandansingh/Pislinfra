import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLocalDataSync } from '../services/strapi';
import { formatStrapiBlogs } from '../utils/formatBlog';
import fallbackDB from '../data/Blogdb.js';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState(() => {
    const local = getLocalDataSync('blogs');
    if (Array.isArray(local) && local.length > 0) {
      return formatStrapiBlogs(local);
    }
    return fallbackDB || [];
  });
  
  const [blogPage, setBlogPage] = useState(() => getLocalDataSync('blog-page'));
  const [loading, setLoading] = useState(false);

  // Synchronous local refresh: Reads only from local verified data (0ms, zero network)
  const refreshBlogs = useCallback(() => {
    try {
      const localBlogs = getLocalDataSync('blogs');
      if (Array.isArray(localBlogs) && localBlogs.length > 0) {
        setBlogs(formatStrapiBlogs(localBlogs));
      }
      const localPage = getLocalDataSync('blog-page');
      if (localPage) {
        setBlogPage(localPage);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    // Listen for local administrative update events without triggering network polling
    const handleUpdate = (e) => {
      const { endpoint, cleanEndpoint, data } = e.detail || {};
      if ((endpoint && endpoint.includes('blogs')) || (cleanEndpoint && cleanEndpoint.includes('blogs'))) {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(formatStrapiBlogs(data));
        }
      }
      if ((endpoint && endpoint.includes('blog-page')) || (cleanEndpoint && cleanEndpoint.includes('blog-page'))) {
        if (data) {
          setBlogPage(data);
        }
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);

    return () => {
      window.removeEventListener('pisl-data-update', handleUpdate);
    };
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, blogPage, loading, refreshBlogs }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => useContext(BlogContext);
