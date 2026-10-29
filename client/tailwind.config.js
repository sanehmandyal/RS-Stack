/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAFA',        // Clean off-white background
        surface: '#FFFFFF',   // Pure White surface
        surface2: '#F4F5F7',  // Elevated neutral 100
        primary: {
          DEFAULT: '#C2410C', // Core Red-Orange (Terracotta / Vermilion)
          50: '#FFF7ED',      // Warm peach tint
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',     // Bright Orange
          500: '#F97316',     // True Radiant Orange
          600: '#EA580C',     // Vivid Red-Orange
          700: '#C2410C',     // Core Primary Red-Orange
          800: '#9A3412',     // Burnt Crimson
          900: '#7C2D12',     // Deep Flame
          950: '#431407',
        },
        brandRed: {
          DEFAULT: '#DC2626',
          light: '#EF4444',
          dark: '#B91C1C',
          deep: '#991B1B',
        },
        brandOrange: {
          DEFAULT: '#EA580C',
          light: '#F97316',
          amber: '#F59E0B',
          dark: '#C2410C',
        },
        secondary: '#EA580C', // Vibrant Sunset Orange
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
