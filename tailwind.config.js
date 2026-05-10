/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  // Support Tailwind dark: variants when data-theme="dark" is set (DaisyUI integration)
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          foreground: 'var(--color-surface-foreground)',
        },
        border: 'var(--color-border)',
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          foreground: 'var(--color-danger-foreground)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          foreground: 'var(--color-success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          foreground: 'var(--color-warning-foreground)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          foreground: 'var(--color-info-foreground)',
        },
      },
    },
  },
  safelist: [
    'hover:bg-muted',
    'hover:text-foreground',
    'hover:bg-primary/90',
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          'primary':          '#2563eb',
          'primary-content':  '#ffffff',
          'secondary':        '#64748b',
          'secondary-content':'#ffffff',
          'accent':           '#0284c7',
          'accent-content':   '#ffffff',
          'neutral':          '#64748b',
          'neutral-content':  '#ffffff',
          'base-100':         '#ffffff',
          'base-200':         '#f8fafc',
          'base-300':         '#f1f5f9',
          'base-content':     '#0f172a',
          'info':             '#0284c7',
          'info-content':     '#ffffff',
          'success':          '#16a34a',
          'success-content':  '#ffffff',
          'warning':          '#d97706',
          'warning-content':  '#ffffff',
          'error':            '#dc2626',
          'error-content':    '#ffffff',
        },
      },
      {
        dark: {
          'primary':          '#3b82f6',
          'primary-content':  '#ffffff',
          'secondary':        '#94a3b8',
          'secondary-content':'#0f172a',
          'accent':           '#38bdf8',
          'accent-content':   '#0f172a',
          'neutral':          '#1e293b',
          'neutral-content':  '#f8fafc',
          'base-100':         '#0f172a',
          'base-200':         '#1e293b',
          'base-300':         '#334155',
          'base-content':     '#f8fafc',
          'info':             '#38bdf8',
          'info-content':     '#0f172a',
          'success':          '#22c55e',
          'success-content':  '#ffffff',
          'warning':          '#f59e0b',
          'warning-content':  '#ffffff',
          'error':            '#ef4444',
          'error-content':    '#ffffff',
        },
      },
    ],
  },
};
