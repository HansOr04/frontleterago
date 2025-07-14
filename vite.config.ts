import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // Remove tailwindcss() - it will work through PostCSS
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://leteragoback.onrender.com',
        changeOrigin: true,
      },
    },
  },
  css: {
    postcss: {
      plugins: []
    }
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorar advertencias de CSS @import
        if (warning.code === 'CSS_WARN') return;
        if (warning.message.includes('@import')) return;
        warn(warning);
      }
    }
  }
});