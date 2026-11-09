import React, { useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const ContentLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', width: '100%' }}>
    <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #ff904e', borderRadius: '50%', animation: 'pislSpin 0.7s linear infinite' }} />
    <style>{`@keyframes pislSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── Global Styles & Clean Dynamic Theme Setup ── */}
      <style>{`
        /* Global Theme Setup */
        body {
          margin: 0;
          padding: 0;
          background-color: #f8f9fc; /* Premium Global Background */
          color: #0f172a; /* Premium Dark Text Color */
          font-family: 'Inter', -apple-system, sans-serif; /* Fallback rendering stack */
        }

        /* Pure Functional Hidden Scrollbar System */
        ::-webkit-scrollbar { 
          display: none; 
        }
        * { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
      `}</style>

      {/* Header + Navbar - FULL WIDTH */}
      <Navbar />
      
      {/* Main Content Render Area */}
      <main style={{ flex: 1, backgroundColor: '#f8f9fc' }}>
        <Suspense fallback={<ContentLoader />}>
          <Outlet />
        </Suspense>
      </main>
      
      {/* Footer - FULL WIDTH */}
      <Footer />
    </div>
  );
};

export default Layout;