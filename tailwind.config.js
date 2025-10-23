/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'cupid-bg': '#fff0f4',
        'cupid-primary': '#622135',
        'cupid-secondary': '#631f38',
        'cupid-tertiary': '#ff7aa2',
        'cupid-light': '#e6f7ff',
        'cupid-red': '#ffd6dd',
        'cupid-pink': '#ffe6ef',
      },
    },
  },
  plugins: [],
};
