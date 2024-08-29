/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      'white': '#ffffff',
      'black': '#1d1e1d',
      'grey': '#f2f2f2',
      'green': '#54e5c4',
      'red': '#ff847c',
      'purple': '#c0a7d1',
      'yellow': '#fff8a0',
      'blue': '#3fc2e0'
    },
    fontFamily: {
      vampiro: ["Vampiro One", "system-ui"],
      contrail: ["Contrail One", "sans-serif"],
    },
    extend: {
      dropShadow: {
        'title': '6px 4px 0px #1d1e1d',
        'subtitle': '5px 3px 0px #1d1e1d',
        'bold': '10px 10px 0 #1d1e1d',
      },
      backgroundImage: {
        'game-background': "url('/assets/gameBackground.svg')",
      }
    },
  },
  plugins: [],
}

