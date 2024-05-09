/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screen: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      fontFamily: {
        blooddrip: ['BloodDrip'],
        godofwar: ['GodOfWar']
      },
      keyframes: {
        loadingtext: {
          '0%': {
            'font-size': '3rem',
            color: '#8C1714',
            'line-height': '3.5rem'
          },
          '50%': {
            'font-size': '4rem',
            color: '#A59C68',
            'line-height': '4.5rem'
          },
          '100%': {
            'font-size': '3rem',
            color: '#8C1714',
            'line-height': '3.5rem'
          }
        },
        rainbowtext: {
          '0%': {
            'background-position': '0 0'
          },
          '50%': {
            'background-position': '100% 0'
          },
          '100%': {
            'background-position': '0 0'
          }
        },
        move: {
          '0%': {
            transform: 'translate(98vw)'
          },
          '100%': {
            transform: 'translate(-100%)'
          }
        },
        move2: {
          '0%': {
            transform: 'translate(-100%)'
          },
          '100%': {
            transform: 'translate(65vw)'
          }
        },
        entrance404: {
          from: {
            width: '0',
            height: '0'
          },
          to: {
            width: 'full',
            height: 'full',
            'box-shadow': '0 0 20rem rgba(255,255,255,1)'
          }
        },
        fadeIn: {
          '0%': { opacity: '0%' },
          '10%': { opacity: '10%' },
          '20%': { opacity: '20%' },
          '30%': { opacity: '30%' },
          '40%': { opacity: '40%' },
          '50%': { opacity: '50%' },
          '60%': { opacity: '60%' },
          '70%': { opacity: '70%' },
          '80%': { opacity: '80%' },
          '90%': { opacity: '90%' },
          '100%': { opacity: '100%' }
        }
      },
      animation: {
        move: 'move 30s linear infinite',
        move2: 'move2 6s linear infinite',
        entrance404first: 'entrance404 3s ease-in-out',
        entrance404second: 'entrance404 3s ease-in-out 3s',
        entrance404third: 'entrance404 3s ease-in-out 6s',
        fadeIn1: 'fadeIn 2.5s linear 9s',
        fadeIn2: 'fadeIn 2.5s linear 11.5s',
        fadeIn3: 'fadeIn 2.5s linear 14s',
        fadeIn4: 'fadeIn 2.5s linear 16.5s',
        fadeIn5: 'fadeIn 2.5s linear 19s',
        rainbowtext: 'rainbowtext 2s linear infinite',
        loadingtext: 'loadingtext 4s linear infinite'
      }
    }
  },

  plugins: []
}
