import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    open: true, // Abrir automáticamente en el navegador
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Optimizaciones para producción
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react'],
          http: ['axios'],
        },
      },
    },
  },
  // Configuración para desarrollo
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
})