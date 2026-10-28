/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F8FAFC',        // Clean light slate background
        surface: '#FFFFFF',   // Pure White surface
        surface2: '#F1F5F9',  // Elevated slate 100
        primary: {
          DEFAULT: '#1D4ED8', // Trusted Corporate Sapphire Blue
          600: '#1E40AF',     // Deep Navy Blue
          700: '#172554',
          300: '#60A5FA',
          50: '#EFF6FF',
          100: '#DBEAFE',
        },
        secondary: '#0284C7', // Ocean Blue (High trust & clarity)
        ink: '#0F172A',       // Rich Slate 900 text
        muted: '#64748B',     // Slate 500 readable muted text
        border: '#E2E8F0',    // Clean slate border
      },
      fontFamily: { sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'] },
      boxShadow: {
        glow: '0 0 0 1px rgba(29,78,216,.2), 0 8px 30px -4px rgba(29,78,216,.25)',
        card: '0 1px 3px 0 rgba(0,0,0,.04), 0 10px 25px -5px rgba(15,23,42,.06)',
        glass: '0 8px 32px 0 rgba(31,38,135,0.07), inset 0 1px 1px 0 rgba(255,255,255,0.85)',
        'glass-hover': '0 20px 40px -15px rgba(29,78,216,0.12), inset 0 1px 2px 0 rgba(255,255,255,1)',
        bubble: '0 10px 30px -5px rgba(37,99,235,0.2), inset 0 2px 4px 0 rgba(255,255,255,0.8), inset 0 -2px 4px 0 rgba(0,0,0,0.05)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'bubble-float': {
          '0%,100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '33%': { transform: 'translate3d(15px, -24px, 0) scale(1.04) rotate(2deg)' },
          '66%': { transform: 'translate3d(-18px, -12px, 0) scale(0.97) rotate(-2deg)' },
        },
        'bubble-float-slow': {
          '0%,100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(-25px, -35px, 0) scale(1.08)' },
        },
        'bubble-drift': {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(30px,-25px,0) scale(1.06)' },
        },
        drift: { '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' }, '50%': { transform: 'translate3d(24px,-18px,0) scale(1.08)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        pulseGlow: {
          '0%,100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.06)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'marching-ants': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '24' },
        },
        'marching-ants-reverse': {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'bubble-float': 'bubble-float 9s ease-in-out infinite',
        'bubble-slow': 'bubble-float-slow 15s ease-in-out infinite',
        'bubble-drift': 'bubble-drift 18s ease-in-out infinite',
        drift: 'drift 16s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-glow': 'pulseGlow 8s ease-in-out infinite',
        'spin-slow': 'spin-slow 32s linear infinite',
        'spin-reverse': 'spin-reverse 32s linear infinite',
        'spin-medium': 'spin-slow 20s linear infinite',
        'spin-medium-reverse': 'spin-reverse 20s linear infinite',
        'marching-ants': 'marching-ants 1.2s linear infinite',
        'marching-ants-reverse': 'marching-ants-reverse 1.2s linear infinite',
        radar: 'radar-sweep 6s linear infinite',
      },
    },
  },
  plugins: [],
};
