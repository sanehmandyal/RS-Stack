/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080B14',
        surface: '#101625',
        surface2: '#161d31',
        primary: { DEFAULT: '#795BFF', 600: '#6847f0', 300: '#a392ff' },
        secondary: '#28C7FA',
        ink: '#F7F8FC',
        muted: '#A5AEC0',
      },
      fontFamily: { sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'] },
      boxShadow: {
        glow: '0 0 0 1px rgba(121,91,255,.35), 0 8px 40px -8px rgba(121,91,255,.45)',
        card: '0 1px 0 0 rgba(255,255,255,.06) inset, 0 20px 40px -24px rgba(0,0,0,.6)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        drift: { '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' }, '50%': { transform: 'translate3d(24px,-18px,0) scale(1.08)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: { float: 'float 7s ease-in-out infinite', drift: 'drift 16s ease-in-out infinite', shimmer: 'shimmer 1.6s infinite' },
    },
  },
  plugins: [],
};
