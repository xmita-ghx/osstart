import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#F9FAFB',
          900: '#1F2937',
        },
        indigo: {
          600: '#4F46E5',
        },
        emerald: {
          600: '#059669',
        },
        amber: {
          600: '#D97706',
        },
        rose: {
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.015em',
      },
    },
  },
  plugins: [],
}

export default config
