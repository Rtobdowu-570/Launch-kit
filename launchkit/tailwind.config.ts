import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium color scheme - Vibrant yet sophisticated
        brand: {
          primary: '#6366f1', // Indigo - modern and trustworthy
          secondary: '#8b5cf6', // Purple - creative and innovative
          accent: '#ec4899', // Pink - energetic and bold
          success: '#10b981', // Emerald - positive actions
          warning: '#f59e0b', // Amber - attention
          neutral: '#1e293b', // Slate - professional
        },
        // Semantic Colors with depth - improved contrast
        text: {
          primary: '#0f172a', // Deep slate - high contrast
          secondary: '#334155', // Darker medium slate - better readability
          tertiary: '#64748b', // Darker light slate - improved contrast
          inverse: '#ffffff', // White for dark backgrounds
        },
        bg: {
          base: '#ffffff', // Pure white
          surface: '#f8fafc', // Subtle gray
          elevated: '#ffffff', // White with shadow
          muted: '#f1f5f9', // Soft gray
          dark: '#0f172a', // Dark slate
        },
        border: {
          light: '#e2e8f0', // Very light
          DEFAULT: '#cbd5e1', // Medium
          strong: '#94a3b8', // Stronger contrast
        },
        // Gradient stops for modern effects
        gradient: {
          from: '#6366f1', // Indigo
          via: '#8b5cf6', // Purple
          to: '#ec4899', // Pink
        },
      },
      fontFamily: {
        // Premium fonts
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2.5rem',
        'xl': '4rem',
        '2xl': '6rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config