/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#1e3a8a',
          mid: '#2563eb',
          light: '#eaf2ff',
        },
        accent: { DEFAULT: '#f59e0b', light: '#fffbeb' },
        success: { DEFAULT: '#22c55e', bg: '#ecfdf3' },
        danger: { DEFAULT: '#ef4444', bg: '#fef2f2' },
        warning: { DEFAULT: '#f59e0b', bg: '#fffbeb' },
        info: { DEFAULT: '#0ea5e9', bg: '#f0f9ff' },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
