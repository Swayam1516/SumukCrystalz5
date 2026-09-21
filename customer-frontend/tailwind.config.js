/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxe: {
          950: '#07060a',
          900: '#0e0d13',
          850: '#15131e',
          800: '#1d1a29',
          700: '#2b273d',
          600: '#3e3957',
          500: '#58517c',
          400: '#837aa6',
          300: '#b2aad2',
          200: '#dad5ed',
          100: '#f1eff9',
          50: '#faf9fd',
        },
        gold: {
          300: '#fde68a',
          400: '#f5d47a',
          500: '#e5b84c',
          600: '#c69527',
        },
        amethyst: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
