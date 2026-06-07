import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
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
        <Outlet />
      </main>
      
      {/* Footer - FULL WIDTH */}
      <Footer />
    </div>
  );
};

export default Layout;