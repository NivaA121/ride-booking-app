/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#0a0a14',
          800: '#0f0f1a',
          700: '#1a1a2e',
          600: '#252540',
          500: '#2f2f4a',
          400: '#3a3a5c',
        },
        primary: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        accent: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          cyan: '#22d3ee',
        },
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          hover: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(99, 102, 241, 0.15)',
        'glow': '0 0 30px rgba(99, 102, 241, 0.2)',
        'glow-lg': '0 0 50px rgba(99, 102, 241, 0.25)',
        'glow-green': '0 0 30px rgba(34, 197, 94, 0.3)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
