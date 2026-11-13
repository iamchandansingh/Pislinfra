import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchWpData, getLocalDataSync, getPreviewContext } from '../services/wordpress';
import { formatStrapiBlogs } from '../utils/formatBlog';
import fallbackDB from '../data/Blogdb.js';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const initialPreview = getPreviewContext();
  const isInitialPreviewPage = initialPreview?.type === 'blog-page';
  const isInitialPreviewBlog = initialPreview?.type === 'blogs';

  const [blogs, setBlogs] = useState(() => {
    if (isInitialPreviewBlog) return [];
    const local = getLocalDataSync('blogs');
    if (Array.isArray(local) && local.length > 0) {
      return formatStrapiBlogs(local);
    }
    return fallbackDB || [];
  });
  
  const [blogPage, setBlogPage] = useState(() => (isInitialPreviewPage ? null : getLocalDataSync('blog-page')));
  const [loading, setLoading] = useState(Boolean(isInitialPreviewPage || isInitialPreviewBlog));

  const refreshBlogs = useCallback(async () => {
    const previewCtx = getPreviewContext();
    const forceFreshBlogs = previewCtx?.type === 'blogs';
    const forceFreshPage = previewCtx?.type === 'blog-page';
    if (forceFreshBlogs || forceFreshPage) {
      setLoading(true);
    }
    try {
      const [liveBlogs, livePage] = await Promise.all([
        fetchWpData('blogs?pagination[pageSize]=100&sort=publishDate:desc', { forceFresh: forceFreshBlogs }),
        fetchWpData('blog-page', { forceFresh: forceFreshPage }),
      ]);
      if (Array.isArray(liveBlogs) && liveBlogs.length > 0) {
        setBlogs(formatStrapiBlogs(liveBlogs));
      } else if (!forceFreshBlogs) {
        const localBlogs = getLocalDataSync('blogs');
        if (Array.isArray(localBlogs) && localBlogs.length > 0) {
          setBlogs(formatStrapiBlogs(localBlogs));
        }
      }
      if (livePage) {
        setBlogPage(livePage);
      } else if (!forceFreshPage) {
        const localPage = getLocalDataSync('blog-page');
        if (localPage) setBlogPage(localPage);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBlogs();

    const handleUpdate = (e) => {
      const previewCtx = getPreviewContext();
      const { endpoint, cleanEndpoint, wpEndpoint, data } = e.detail || {};
      const matchKey = wpEndpoint || cleanEndpoint || endpoint || '';
      if (matchKey.includes('blogs') && previewCtx?.type !== 'blogs') {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(formatStrapiBlogs(data));
        }
      }
      if (matchKey.includes('blog-page') && previewCtx?.type !== 'blog-page') {
        if (data) {
          setBlogPage(data);
        }
      }
    };
    window.addEventListener('pisl-data-update', handleUpdate);

    return () => {
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
