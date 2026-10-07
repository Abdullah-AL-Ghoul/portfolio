import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Admin dashboard — a separate deployment from the public site.
// noindex is enforced via meta + headers (see public/ and vercel.json in this folder).
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['recharts'],
          vendor: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js']
        }
      }
    }
  }
});
