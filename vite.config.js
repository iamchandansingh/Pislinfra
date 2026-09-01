import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),
  ],
  
  publicDir: 'public',
  
  build: {
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true,
    
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        dead_code: true,
      },
      mangle: {
        toplevel: true,
      },
    },
    
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react/')) {
              return 'vendor-react';
            }
            if (id.includes('react-icons') || id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('leaflet')) {
              return 'vendor-maps';
            }
            if (id.includes('html2canvas') || id.includes('dompurify')) {
              return 'vendor-utils';
            }
            return 'vendor-core';
          }
          if (id.includes('MainBackupPislinfra.json') || id.includes('coverageMarkersData.js') || id.includes('Awards-&-Certifications.js')) {
            return 'data-store';
          }
        },
      },
    },
    
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
  },
  
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },
})