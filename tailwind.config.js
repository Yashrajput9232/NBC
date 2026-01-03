/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nbc: {
          cream: '#FEF6E8',
          yellow: '#FFE89B',
          orange: '#FF9D3E',
          brown: '#704214',
          tan: '#D4A574',
        },
      },
    },
  },
  plugins: [],
};
