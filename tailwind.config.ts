import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337'
        },
        accent: {
          500: '#10b981',
          600: '#059669'
        },
        brand: {
          red: '#ef4444',
          pink: '#ec4899',
          yellow: '#f59e0b',
          green: '#10b981',
          blue: '#3b82f6',
          purple: '#8b5cf6'
        }
      }
    }
  },
  plugins: []
} satisfies Config
