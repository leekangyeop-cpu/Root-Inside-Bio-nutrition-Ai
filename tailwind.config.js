/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bio: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        earth: {
          50: '#faf9f7',
          100: '#f5f3ef',
          200: '#e8e4db',
          300: '#d4cec0',
          400: '#b8ad9a',
          500: '#9d8f76',
          600: '#7d6f5c',
          700: '#5f564a',
          800: '#4a443c',
          900: '#3a3530',
        }
      },
    },
  },
  plugins: [],
}
