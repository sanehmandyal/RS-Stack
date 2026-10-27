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
