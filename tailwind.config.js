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
          50: '#f0f7f0',
          100: '#dcebdf',
          200: '#bbd8c2',
          300: '#91be9b',
          400: '#699e75',
          500: '#4a7c59',
          600: '#3a6347',
          700: '#2f503a',
          800: '#284030',
          900: '#233529',
        },
        secondary: {
          50: '#f7f5f3',
          100: '#ede8e3',
          200: '#ddd2c8',
          300: '#c6b4a6',
          400: '#b09484',
          500: '#8b7355',
          600: '#7d6448',
          700: '#68523c',
          800: '#584535',
          900: '#4b3c2f',
        },
        accent: {
          50: '#fef9e7',
          100: '#fef0c3',
          200: '#fce085',
          300: '#faca47',
          400: '#f8b71e',
          500: '#f39c12',
          600: '#d77706',
          700: '#b35309',
          800: '#91420f',
          900: '#773710',
        },
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c',
        info: '#3498db',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}