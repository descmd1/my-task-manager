/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [   "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        darkBg: '#1a202c', //dark background
        darkText: '#f7fafc', //dark text
      },
    },
  },
  plugins: [],
}

