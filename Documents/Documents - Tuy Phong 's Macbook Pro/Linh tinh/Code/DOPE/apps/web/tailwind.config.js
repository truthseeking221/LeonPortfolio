/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DOPE brand palette - neon arcade aesthetic
        dope: {
          black: '#0a0a0f',
          dark: '#12121a',
          surface: '#1a1a24',
          border: '#2a2a3a',
          muted: '#6b6b7b',
          text: '#e4e4eb',
          white: '#fafafa',
        },
        neon: {
          green: '#00ff88',
          greenDim: '#00cc6a',
          pink: '#ff3366',
          pinkDim: '#cc2952',
          purple: '#9945ff',
          cyan: '#00d4ff',
          yellow: '#ffd93d',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

