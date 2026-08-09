/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F6B62',
          50: '#23e8bdff',
          100: '#C2E4DE',
          200: '#9AD3CA',
          300: '#6DBFB5',
          400: '#3EA99E',
          500: '#0F6B62',
          600: '#0C5750',
          700: '#09433D',
          800: '#062F2B',
          900: '#031B18',
        },
        accent: '#F2794A',
        lime: {
          DEFAULT: '#E8FF8C',
          50: '#FAFEE6',
          100: '#E8FF8C',
          200: '#D6F85E',
          text: '#224000',
        },
        bg: {
          DEFAULT: '#FAF9F6',
          dark: '#0F6B62',
        },
        ink: {
          DEFAULT: '#1A1A18',
          muted: '#5C5C58',
          light: '#9C9C96',
        },
        surface: '#FFFFFF',
        severity: {
          green: '#16A34A',
          'green-bg': '#DCFCE7',
          'green-border': '#86EFAC',
          yellow: '#CA8A04',
          'yellow-bg': '#FEF9C3',
          'yellow-border': '#FDE047',
          red: '#DC2626',
          'red-bg': '#FEE2E2',
          'red-border': '#FCA5A5',
        },
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 4px 24px -2px rgba(15, 107, 98, 0.06), 0 2px 8px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 36px -4px rgba(15, 107, 98, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        glow: '0 0 24px 0 rgba(15,107,98,0.18)',
        'red-glow': '0 0 24px 0 rgba(220,38,38,0.18)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        shimmer: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      },
    },
  },
  plugins: [],
};
