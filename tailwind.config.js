/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hunter': '#466D4B',
        'cambridge': '#779E7B',
        'blush': '#CB7286',
        'linen': '#EFE4DB',
        'smoke': '#F4F4F4',
        'verdigris': '#3CA6A6',
        'cherry': '#E9A6B3',
        primary: {
          DEFAULT: '#CB7286',
          dark: '#466D4B',
          light: '#E9A6B3',
        },
        secondary: {
          DEFAULT: '#779E7B',
          dark: '#3CA6A6',
          light: '#EFE4DB',
        },
        background: {
          DEFAULT: '#F4F4F4',
          alt: '#EFE4DB',
        },
        accent: {
          50: 'var(--accent-50)',
          100: 'var(--accent-100)',
          200: 'var(--accent-200)',
          300: 'var(--accent-300)',
          400: 'var(--accent-400)',
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
          700: 'var(--accent-700)',
          800: 'var(--accent-800)',
          900: 'var(--accent-900)',
        },
        neutral: {
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}