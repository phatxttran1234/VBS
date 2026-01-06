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
        'dark-bg': '#0a0a0b',
        'dark-bg-light': '#141416',
        'dark-bg-lighter': '#1c1c1f',
        'dark-surface': '#232326',
        'dark-surface-light': '#2a2a2e',
        'dark-border': '#333338',
        'dark-text': '#f4f4f5',
        'dark-text-secondary': '#a1a1aa',
        'dark-text-muted': '#71717a',
        'accent-teal': '#14b8a6',
        'accent-teal-light': '#2dd4bf',
        'accent-coral': '#f97316',
        'accent-rose': '#f43f5e',
      },
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2s infinite',
        'bounce-subtle': 'bounceSubtle 0.5s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};
