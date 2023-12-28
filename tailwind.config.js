/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      width : {
        'deafult' : '350px',
        'medium' : '180px'
      }
    },
  },
  plugins: [],
}

