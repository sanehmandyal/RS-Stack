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
          DEFAULT: '#1D4ED8', // Corporate Sapphire Blue
          600: '#1E40AF',     // Deep Navy Blue
          700: '#172554',
          300: '#60A5FA',
          50: '#EFF6FF',
          100: '#DBEAFE',
        },
        secondary: '#0284C7', // Ocean Blue
        ink: '#0F172A',       // Rich Slate 900 text
        muted: '#64748B',     // Slate 500 readable muted text
        border: '#E2E8F0',    // Clean slate border
      },
      fontFamily: { sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'] },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        sm: '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
        md: '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
        lg: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
