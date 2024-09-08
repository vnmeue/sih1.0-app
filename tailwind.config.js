/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'poppins': ["Poppins", "sans-serif"]
      },
      zIndex: {
        '1500': '1500',
      },
    },
  },
  plugins: [],
}