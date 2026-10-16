import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: false,
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#{{primary}}',
        secondary: '#{{secondary}}',
        accent: '#{{accent}}',
      },
      fontSize: {
        'h1': ['32px', { fontWeight: 'bold', lineHeight: '36px' }],
        'h2': ['24px', { fontWeight: 'semibold', lineHeight: '30px' }],
        'h3': ['16px', { fontWeight: 'semibold', lineHeight: '20px' }],
        'body': ['16px', { lineHeight: '20px' }],
        'small': ['14px', { lineHeight: '18px' }],
      },
    },
  },
  plugins: [],
}

export default config