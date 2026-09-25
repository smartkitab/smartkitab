/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-brown': '#795238',
        'cream-bg': '#FAF6EF',
        'light-cream': '#F3EBDD',
        'dark-green': '#365314',
        'accent-coral': '#E07A5F',
        primaryBrown: '#795238',
        creamBackground: '#FAF6EF',
        lightCream: '#F3EBDD',
        darkGreen: '#365314',
        accentCoral: '#E07A5F',
      },
    },
  },
  plugins: [],
};

