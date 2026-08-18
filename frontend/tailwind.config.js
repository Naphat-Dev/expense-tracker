/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        paper: '#F3F4F6',
        surface: '#FFFFFF',
        line: '#E5E7EB',
        muted: '#6B7280',
        navy: {
          DEFAULT: '#0F172A',
          2: '#1E293B',
        },
        primary: {
          DEFAULT: '#1E3A5F',
          dark: '#152E4A',
          light: '#4B6478',
          soft: '#EEF0F3',
          border: '#D1D5DB',
        },
        sage: '#1F5C45',
        clay: '#8B3A3A',
      },
      fontFamily: {
        display: ['"Noto Sans Thai"', '"Inter"', 'system-ui', 'sans-serif'],
        body: ['"Noto Sans Thai"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(17, 24, 39, 0.05)',
        elevated: '0 4px 12px rgba(17, 24, 39, 0.08)',
      },
    },
  },
}
