import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import fs from 'fs';

// Plugin that guarantees _redirects (Cloudflare SPA routing) lands in dist/
const copyRedirectsPlugin = () => ({
  name: 'copy-redirects',
  closeBundle() {
    const src = path.resolve('public/_redirects');
    const dest = path.resolve('dist/_redirects');
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log('[copy-redirects] ✓ Copied public/_redirects → dist/_redirects');
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    copyRedirectsPlugin(),


  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://peto-care-orge-peto-care-server.hf.space',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://peto-care-orge-peto-care-server.hf.space',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {}
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'zustand'],
  },
});
