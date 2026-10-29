/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F8FAFC',        // Clean light slate background
        surface: '#FFFFFF',   // Pure White surface
        surface2: '#F1F5F9',  // Elevated slate 100
        primary: {
          DEFAULT: '#059669', // Growora Core Emerald
          50: '#ECFDF5',      // Mint wash
          100: '#D1FAE5',     // Light emerald
          200: '#A7F3D0',     // Soft emerald
          300: '#6EE7B7',     // Mint accent
          400: '#34D399',
          500: '#10B981',     // Vibrant emerald
          600: '#059669',     // Core Growora Green
          700: '#047857',     // Deep emerald
          800: '#065F46',     // Forest emerald
          900: '#064E3B',     // Obsidian emerald
          950: '#022C22',
        },
        secondary: '#10B981', // Emerald accent
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
        glow: '0 4px 20px -2px rgba(5, 150, 105, 0.22)',
        'glow-lg': '0 10px 30px -4px rgba(5, 150, 105, 0.28)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
