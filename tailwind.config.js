/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        jira: { DEFAULT: '#0052CC', hover: '#0747A6' },
      },
    },
  },
  plugins: [],
};

