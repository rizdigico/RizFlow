import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0A0F1A',
          light: '#111827',
          lighter: '#1F2937',
        },
        cyan: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          dark: '#0891B2',
          glow: 'rgba(6, 182, 212, 0.4)',
        },
        blue: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.3)',
        glow: '0 0 20px rgba(6, 182, 212, 0.2)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-blue': '0 0 30px rgba(59, 130, 246, 0.3)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'pulse-glow': 'pulse-glow 3s infinite alternate',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'flow-in': 'flow-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'mesh-pulse': 'mesh-pulse 4s infinite alternate',
        'gradient-shift': 'gradient-shift 4s ease-in-out infinite',
        'scanline': 'scanline 3s linear infinite',
        'scanline-vertical': 'scanline-vertical 2s linear infinite',
        'slide-right': 'slideRight 1s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'scanline-vertical': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'flow-in': {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
        },
        'mesh-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(6, 182, 212, 0.7)' },
          '70%': { boxShadow: '0 0 0 20px rgba(6, 182, 212, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(6, 182, 212, 0)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const meshSvg = (gridSize: number, opacity: number, colorHex: string = '%2306B6D4') => {
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${gridSize}' height='${gridSize}'><path d='M ${gridSize} 0 L 0 0 0 ${gridSize}' fill='none' stroke='${colorHex}' stroke-width='1' stroke-opacity='${opacity}'/></svg>`
        return `url("data:image/svg+xml,${svg}")`
      }

      addUtilities({
        '.mesh-bg': {
          backgroundImage: meshSvg(30, 0.1),
          backgroundSize: '30px 30px',
        },
        '.mesh-bg-dense': {
          backgroundImage: meshSvg(15, 0.05),
          backgroundSize: '15px 15px',
        },
        '.mesh-bg-sparse': {
          backgroundImage: meshSvg(60, 0.15),
          backgroundSize: '60px 60px',
        },
      })
    }),
  ],
}

export default config

