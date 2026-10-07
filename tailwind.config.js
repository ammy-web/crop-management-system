/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d', // Deep Green
          950: '#052e16', // Ultra Deep Forest Green
        },
        secondary: {
          DEFAULT: '#84cc16', // Leaf Green
          dark: '#65a30d',
        },
        accent: {
          DEFAULT: '#eab308', // Earthy Yellow/Orange
          dark: '#ca8a04',
        },
        background: '#f8fafc', // Very Light Gray / Off White
        surface: '#ffffff', // Cards
        text: {
          main: '#1f2937', // Dark Green/Charcoal
          light: '#6b7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
