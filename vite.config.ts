import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Importa tailwindcss VITE plugin, pero sin tipos explícitos
// Usa ts-ignore para evitar error de tipo en este caso
// Si no lo tienes instalado, npm install -D @tailwindcss/vite
// @ts-ignore
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Opcional: Si quieres ESLint en Vite, usa vite-plugin-eslint
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    react(), // sin la opción eslint aquí
    eslint({ 
      // configura eslint aquí, ej:
      failOnError: false, // no falla el build por errores eslint
      emitWarning: true,
    }),
    tailwindcss(),
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
});
