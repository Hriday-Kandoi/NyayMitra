import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1A2744',
        saffron: '#E07B39',
        'light-navy': '#EEF1F8',
        muted: '#6B7A9A',
      },
    },
  },
  plugins: [],
}
export default config
