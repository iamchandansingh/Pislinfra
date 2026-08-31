import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchStrapiData } from '../services/strapi';
import { formatStrapiBlogs } from '../utils/formatBlog';
import fallbackDB from '../data/BlogDB';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [blogPage, setBlogPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const [blogData, pageData] = await Promise.all([
          fetchStrapiData('blogs?populate=*&pagination[pageSize]=100').catch(() => null),
          fetchStrapiData('blog-page?populate=seo,heroImage').catch(() => null)
        ]);
        if (blogData && blogData.length > 0) {
          setBlogs(formatStrapiBlogs(blogData));
        } else {
          setBlogs(fallbackDB);
        }
        if (pageData) {
          setBlogPage(pageData);
        }
      } catch (e) {
        setBlogs(fallbackDB);
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
