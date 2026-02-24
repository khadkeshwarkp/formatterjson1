import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dt: {
          bg: 'var(--dt-bg)',
          soft: 'var(--dt-soft)',
          card: 'var(--dt-card)',
          surface: 'var(--dt-surface)',
          sidebar: 'var(--dt-sidebar)',
          border: 'var(--dt-border)',
          accent: 'var(--dt-accent)',
          'accent-hover': 'var(--dt-accent-hover)',
          text: 'var(--dt-text)',
          'text-muted': 'var(--dt-text-muted)',
          'text-dim': 'var(--dt-text-dim)',
          success: 'var(--dt-success)',
          error: 'var(--dt-error)',
          warning: 'var(--dt-warning)',
          tab: 'var(--dt-tab)',
          'tab-active': 'var(--dt-tab-active)',
          glass: 'var(--dt-glass)',
          'glass-border': 'var(--dt-glass-border)',
        },
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'dt': '16px',
        'dt-lg': '20px',
      },
      boxShadow: {
        'dt-panel': '0 20px 40px -26px var(--dt-shadow-lg), 0 10px 24px -18px var(--dt-shadow-sm)',
        'dt-soft': '0 10px 24px -18px var(--dt-shadow-sm)',
        'dt-sidebar-active': 'inset 2px 0 0 0 var(--dt-accent)',
      },
      animation: {
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%, 45%, 75%': { transform: 'translateX(-4px)' },
          '30%, 60%, 90%': { transform: 'translateX(4px)' },
        },
      },
      transitionDuration: {
        '200': '200ms',
      },
      backdropBlur: {
        'dt': '20px',
        'dt-sm': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
