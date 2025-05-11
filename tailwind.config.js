/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'wiggle': 'wiggle 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0)' },
          '25%': { transform: 'rotate(10deg)' },
          '50%': { transform: 'rotate(-10deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
}; 