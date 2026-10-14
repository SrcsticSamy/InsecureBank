/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F6F5F0',
        ivory: '#FFFFFF',
        stone: '#ECEAE2',
        obsidian: '#111315',
        slate: '#5A5D64',
        alpine: {
          DEFAULT: '#0A3622',
          hover: '#072618',
          light: '#E6ECE8',
        },
        brass: {
          DEFAULT: '#8C6D3F',
          hover: '#735730',
          light: '#F4EFE6',
        },
        crimson: {
          DEFAULT: '#8B1E1E',
          hover: '#6E1616',
          light: '#F9ECEC',
        },
        borderGrid: '#D6D3CD',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
      },
    },
  },
  plugins: [],
}
