module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#FFF5EB',
          100: '#FFF1E4',
          600: '#3D1106',
          700: '#280B04',
        },
        'secondary': {
          500: '#FFB501',
          600: '#E67E22',
        },
        'amber': {
          600: '#D97706',
          700: '#B45309',
        },
        'success': {
          500: '#10B981',
          600: '#059669',
        },
        'danger': {
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      fontFamily: {
        'sans': ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        'print': ['Arial', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'fadeInUp': 'fadeInUp 0.3s ease-out forwards',
        'progress': 'progress 3s linear forwards',
        'pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'underline': 'underline 0.3s ease-out forwards',
        'underline-expand': 'underline-expand 0.5s ease-out forwards',
        'pulse-unavailable': 'pulse-unavailable 2s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        progress: {
          from: { width: '0%' },
          to: { width: '100%' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        underline: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        underlineExpand: {
          '0%': { width: '0', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { width: '64px', opacity: '1' },
        },
        pulseUnavailable: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      screens: {
        'print': { 'raw': 'print' },
      },
    },
  },
  variants: {
    extend: {
      display: ['responsive', 'hover', 'focus', 'group-hover', 'print'],
      visibility: ['responsive', 'hover', 'focus', 'group-hover', 'print'],
      backgroundColor: ['responsive', 'hover', 'focus', 'active', 'group-hover', 'print'],
      textColor: ['responsive', 'hover', 'focus', 'active', 'group-hover', 'print'],
      fontFamily: ['responsive', 'print'],
      fontSize: ['responsive', 'print'],
      lineHeight: ['responsive', 'print'],
      borderColor: ['responsive', 'hover', 'focus', 'print'],
      opacity: ['responsive', 'hover', 'focus', 'disabled', 'print'],
      boxShadow: ['responsive', 'hover', 'focus', 'print'],
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.scrollbar-premium': {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(217, 119, 6, 0.3)',
            borderRadius: '9999px',
          },
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.no-print': {
          '@media print': {
            display: 'none !important',
          },
        },
        '.print-only': {
          display: 'none',
          '@media print': {
            display: 'block !important',
          },
        },
        '.break-after': {
          '@media print': {
            'page-break-after': 'always !important',
          },
        },
        '.break-before': {
          '@media print': {
            'page-break-before': 'always !important',
          },
        },
      });
    },
  ],
};