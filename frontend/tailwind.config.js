/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f9ff',
          100: '#e8f1ff',
          200: '#d1e3ff',
          300: '#a6c8ff',
          400: '#7cacff',
          500: '#3479ff',
          600: '#1262ff',
          700: '#0047e1',
          800: '#0039b5',
          900: '#003399',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#fff1f0',
          100: '#ffe4e1',
          200: '#ffc9c2',
          300: '#ffa499',
          400: '#ff7b6b',
          500: '#ff4d38',
          600: '#ff2d14',
          700: '#f01c00',
          800: '#c81700',
          900: '#a31400',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', '-apple-system', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.1)',
        'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.2)',
        'soft-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.04), 0 4px 16px -4px rgba(0, 0, 0, 0.04)',
        'soft': '0 2px 12px -4px rgba(0, 0, 0, 0.06), 0 8px 24px -6px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 4px 18px -4px rgba(0, 0, 0, 0.08), 0 12px 32px -8px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        'glass': '16px',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        fadeIn: 'fadeIn 0.5s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
}
