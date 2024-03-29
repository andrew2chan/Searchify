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
        body: ['Hedvig Letters San'],
        rounded: ['Protest Riot', 'sans-serif']
      },
      flex: {
        '2': '2',
        '3': '3'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': {transform: 'translateX(100%)' }
        }
      },
      animation: {
        marquee: 'marquee 20s linear infinite'
      },
      screens: {
        'md-min': {'min': '640px'},
        'sm-max': {'max': '639px'}
      }
    },
  },
  plugins: [],
}

