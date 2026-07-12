/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PISL Brand Colors
        navy: {
          DEFAULT: '#28286e',
          50: '#f0f0fa',
          100: '#e0e0f5',
          200: '#c1c1eb',
          300: '#a2a2e0',
          400: '#8383d6',
          500: '#6464cc',
          600: '#4545c2',
          700: '#28286e',
          800: '#1e1e52',
          900: '#141437',
          950: '#0a0a1c',
        },
        orange: {
          DEFAULT: '#ff8d4b',
          50: '#fff5f0',
          100: '#ffebe0',
          200: '#ffd7c1',
          300: '#ffc3a2',
          400: '#ffaf83',
          500: '#ff8d4b',
          600: '#e67a3e',
          700: '#cc6631',
          800: '#b35324',
          900: '#994017',
          950: '#802d0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}