/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sumuk Crystalz5 Design System Palette
        ivory: {
          DEFAULT: '#F8F6F2',
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F8F6F2',
          300: '#F0ECE4',
          400: '#E6E0D4',
        },
        lavender: {
          DEFAULT: '#EAE2F2',
          50: '#FAF8FC',
          100: '#F4EEF8',
          200: '#EAE2F2',
          300: '#D8CBE4',
          400: '#C2B0D3',
          500: '#A690BD',
        },
        purple: {
          DEFAULT: '#79539B',
          50: '#F7F3FA',
          100: '#EAE2F2',
          200: '#D5C4E5',
          300: '#BAA1D4',
          400: '#9B79BE',
          500: '#79539B', // Brand Purple Accent
          600: '#684587',
          700: '#55376F',
          800: '#422A57',
          900: '#2F1E3F',
        },
        gold: {
          DEFAULT: '#C8A65E',
          50: '#FAF7F0',
          100: '#F4ECE0',
          200: '#E8D7BE',
          300: '#DCC19B',
          400: '#D2B37C',
          500: '#C8A65E', // Sacred Gold Accent
          600: '#B69247',
          700: '#947434',
          800: '#725723',
        },
        charcoal: {
          DEFAULT: '#29242D',
          50: '#F6F5F7',
          100: '#E6E5E8',
          200: '#C8C6CD',
          300: '#AAA6B0',
          400: '#8B8593',
          500: '#6D6775',
          600: '#534E5A',
          700: '#3D3843',
          800: '#29242D', // Primary Charcoal Typography
          900: '#1A161D',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'Manrope', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(41, 36, 45, 0.04)',
        glass: '0 4px 20px rgba(41, 36, 45, 0.04)',
        'glass-hover': '0 10px 30px rgba(121, 83, 155, 0.08)',
      },
    },
  },
  plugins: [],
};
