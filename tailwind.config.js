/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        mint: {
          50: '#F0FFF7',
          100: '#E0FFF0',
          200: '#C2FAE0',
          300: '#98FB98',
          400: '#85F0C0',
          500: '#66EBB0', // This is your primary mint-500
          600: '#52D09A',
          700: '#3DAB84',
          800: '#28876E',
          900: '#146258',
        },
        emerald: {
            300: '#41d472ff',
            400: '#40d171ff',
            500: '#50C878',
            600: '#2ed365ff',
        }
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
  themes: ["light", "dark", "cupcake"], 
  },
}