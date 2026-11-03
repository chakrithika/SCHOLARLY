/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          50: '#e9e7ff',
          100: '#cdc8ff',
          200: '#9f95ff',
          300: '#7a6aff',
          400: '#5b48f5',
          500: '#3d2dbd',
          600: '#2a1f96',
          700: '#1c156b',
          800: '#120c44',
          900: '#0a0626',
          950: '#05031a',
        },
        lavender: {
          50: '#f5f0ff',
          100: '#ece0ff',
          200: '#d8c2ff',
          300: '#c2a3ff',
          400: '#ad88ff',
          500: '#936bff',
          600: '#7852f5',
          700: '#5d3fd1',
          800: '#4329a0',
          900: '#2b1a6b',
        },
        neon: {
          pink: '#ff6ad5',
          cyan: '#5cf2ff',
          lime: '#b9ff5c',
          yellow: '#ffe45c',
          purple: '#b07cff',
        },
      },
      fontFamily: {
        pixel: ['system-ui', 'sans-serif'],
        display: ['"Press Start 2P"', 'monospace'],
        body: ['system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 12px rgba(147, 107, 255, 0.55), 0 0 28px rgba(147, 107, 255, 0.25)',
        'glow-pink': '0 0 12px rgba(255, 106, 213, 0.55), 0 0 28px rgba(255, 106, 213, 0.25)',
        'glow-cyan': '0 0 12px rgba(92, 242, 255, 0.55), 0 0 28px rgba(92, 242, 255, 0.25)',
        pixel: '4px 4px 0 0 rgba(10, 6, 38, 0.85)',
        'pixel-lavender': '4px 4px 0 0 rgba(92, 70, 209, 0.9)',
        'pixel-pink': '4px 4px 0 0 rgba(176, 60, 140, 0.9)',
      },
      backgroundImage: {
        'grid-glow':
          'linear-gradient(rgba(147,107,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(147,107,255,0.08) 1px, transparent 1px)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(147,107,255,0.4)' },
          '50%': { boxShadow: '0 0 22px rgba(147,107,255,0.85)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0.2' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'slide-in': {
          from: { transform: 'translateX(-12px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        'rise-in': {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        blink: 'blink 1.1s steps(1) infinite',
        'scan-line': 'scan-line 6s linear infinite',
        'slide-in': 'slide-in 0.25s ease-out',
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        'rise-in': 'rise-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
