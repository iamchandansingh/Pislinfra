import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchStrapiData } from '../services/strapi';
import { formatStrapiBlogs } from '../utils/formatBlog';
import fallbackDB from '../data/BlogDB';

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
  
  const [blogPage, setBlogPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const [blogData, pageData] = await Promise.all([
          fetchStrapiData('blogs?populate=*&pagination[pageSize]=100&sort=createdAt:desc').catch(() => null),
          fetchStrapiData('blog-page?populate=seo,heroImage').catch(() => null)
        ]);
        if (blogData && blogData.length > 0) {
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
    };
    loadBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, blogPage, loading }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => useContext(BlogContext);
