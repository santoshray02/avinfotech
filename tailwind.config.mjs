/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        'ink-navy': '#0F172A',
        saffron: { DEFAULT: '#EA580C', warm: '#F59E0B', soft: '#FED7AA' },
        sand: '#FEF3C7',
        canvas: '#F8FAFC',
        slate: { DEFAULT: '#64748B', border: '#E2E8F0' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display': ['clamp(2.25rem, 4.5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h2': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      maxWidth: { content: '72rem', prose: '44rem' },
      borderRadius: { card: '12px' },
      boxShadow: { card: '0 1px 2px rgba(15,23,42,.04), 0 4px 12px rgba(15,23,42,.04)' },
    },
  },
  plugins: [],
};
