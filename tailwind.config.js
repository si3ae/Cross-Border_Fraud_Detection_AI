/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // design.md Visual Identity
        paper: '#FDF5E6',      // background (Old Lace)
        flow: '#B22222',       // flow edges (red)
        ink: '#4A6FA5',        // shared_attribute edges
        demoted: '#9CA3AF',    // verification-failed (gray)
      },
      fontFamily: {
        mono: ['"Courier Prime"', '"Special Elite"', 'monospace'],
      },
    },
  },
  plugins: [],
}