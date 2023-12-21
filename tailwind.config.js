/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      gridAutoRows: {
        '1minfill': 'min-content 1fr'
      },
      fontFamily: {
        body: ['Hedvig Letters San']
      }
    },
  },
  plugins: [],
}

