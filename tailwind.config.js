/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'logo-blue': '#2563eb',
        'logo-blue-light': '#3b82f6',
        'logo-blue-lighter': '#60a5fa',
        'logo-blue-lightest': '#dbeafe',
        'logo-blue-bg': '#eff6ff',
        // Dark mode colors
        'dark-bg': '#0f172a',
        'dark-bg-light': '#1e293b',
        'dark-bg-lighter': '#334155',
        'dark-text': '#f1f5f9',
        'dark-text-secondary': '#cbd5e1',
      },
    },
  },
  plugins: [],
};
