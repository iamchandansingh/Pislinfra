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
  
  // ✅ FIXED - public folder use karo
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
    
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
  },
  
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },
})