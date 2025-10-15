/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eduvos: {
          deep: '#0A1931',
          electric: '#2563EB', 
          innovation: '#8B5CF6',
          success: '#10B981',
          warm: '#F59E0B',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.1)',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'neural-glow': 'neural-glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'neural-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)',
          },
        }
      }
    },
  },
  plugins: [],
};
