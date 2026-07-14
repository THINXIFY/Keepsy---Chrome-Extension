import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#010207',
        surface: '#0A0D16',
        card: '#11151F',
        primary: '#0057FF',
        secondary: '#0042C2',
        accent: '#2B7FFF',
        muted: '#98A2B3',
        line: '#1A2235',
      },
      fontFamily: { sans: ['Inter var', 'Inter', 'sans-serif'] },
      borderRadius: { panel: '16px' },
    },
  },
  plugins: [],
} satisfies Config
