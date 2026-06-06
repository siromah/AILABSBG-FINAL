import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/craative-bg-ai-/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    outDir: 'build',
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');
          if (normalized.includes('/node_modules/react/') || normalized.includes('/node_modules/react-dom/')) {
            return 'react-vendor';
          }
          if (normalized.includes('/node_modules/react-router-dom/')) {
            return 'router';
          }
          if (normalized.includes('/node_modules/motion/')) {
            return 'motion';
          }
          if (normalized.includes('/node_modules/lucide-react/')) {
            return 'lucide-icons';
          }
          if (normalized.includes('/node_modules/@supabase/')) {
            return 'supabase';
          }
        },
      },
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
