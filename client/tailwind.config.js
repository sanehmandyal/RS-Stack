/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAFA',        // Gallery off-white background
        surface: '#FFFFFF',   // Pure White surface
        surface2: '#F4F5F7',  // Elevated neutral 100
        primary: {
          DEFAULT: '#143D34', // Deep Architectural Forest Pine
          50: '#F2F7F5',      // Clean stone tint
          100: '#E1EDE8',
          200: '#C3DBD2',
          300: '#9BC2B5',
          400: '#6FA494',
          500: '#478372',
          600: '#1E5A4D',
          700: '#143D34',     // Core Primary
          800: '#0E2A24',
          900: '#081915',
          950: '#040E0C',
        },
        secondary: '#B45309', // Burnished Brass / Warm Amber accent
        ink: '#0F172A',       // Rich Obsidian 900 text
        'ink-muted': '#334155', // Slate 700 readable body text
        muted: '#64748B',     // Slate 500 secondary text
        border: '#E2E8F0',    // Clean architectural border
      },
      fontFamily: { sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'] },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        sm: '0 1px 3px 0 rgba(15, 23, 42, 0.07), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        md: '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        lg: '0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
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
