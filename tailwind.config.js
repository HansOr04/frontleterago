/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores de Leterago basados en las imágenes
        'leterago': {
          'primary': '#1e3a8a',     // Azul oscuro principal
          'secondary': '#3b82f6',   // Azul medio
          'light': '#93c5fd',       // Azul claro
          'accent': '#e91e63',      // Rosa/magenta
          'purple': '#6366f1',      // Violeta
          'dark': '#1e293b',        // Gris oscuro
          'gray': '#64748b',        // Gris medio
        },
        // Gradientes para la matriz
        'matrix': {
          'blue-1': '#1e3a8a',
          'blue-2': '#1e40af', 
          'blue-3': '#2563eb',
          'blue-4': '#3b82f6',
          'blue-5': '#60a5fa',
          'blue-6': '#93c5fd',
          'blue-7': '#bfdbfe',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}