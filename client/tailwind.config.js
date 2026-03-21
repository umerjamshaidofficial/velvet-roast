/** @type {import('tailwindcss').Config} */
export default {
  // THIS LINE IS REQUIRED
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'velvet-bean': '#0F0908',
        'velvet-oxblood': '#4A0E0E',
        'velvet-cinnamon': '#8C3B25',
      },
    },
  },
  plugins: [],
}