/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        josefin: ['Josefin Sans', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        blancha: ['Blancha', 'sans-serif'], // Primary wedding font
        quintella: ['Quintella', 'serif'], // For names
        sacramento: ['Sacramento', 'cursive'], // For invitation text
        sangbleu: ['SangBleu', 'serif'], // For bible text
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        whatsapp: {
          600: 'var(--whatsapp-600)',
          900: 'var(--whatsapp-900)',
        },
      },
      spacing: {
        'wedding-xs': '0.5rem',
        'wedding-sm': '1rem',
        'wedding-md': '1.5rem',
        'wedding-lg': '2rem',
        'wedding-xl': '3rem',
        'wedding-2xl': '4rem',
      },
      fontSize: {
        'wedding-xs': '0.75rem',
        'wedding-sm': '0.875rem',
        'wedding-base': '1rem',
        'wedding-lg': '1.25rem',
        'wedding-xl': '1.5rem',
        'wedding-2xl': '2rem',
        'wedding-3xl': '2.5rem',
        'wedding-4xl': '3rem',
      },
      borderRadius: {
        sm: 'var(--radius-sm, 0.375rem)',
        md: 'var(--radius-md, 0.5rem)',
        lg: 'var(--radius-lg, 0.75rem)',
        xl: 'var(--radius-xl, 1rem)',
      },
      animation: {
        'slide-in-from-right': 'slide-in-from-right 300ms ease-out',
        fadeIn: 'fadeIn 0.5s ease-in',
        'pulse-ring': 'pulse-ring 2s infinite',
      },
      keyframes: {
        'slide-in-from-right': {
          from: { opacity: '0', transform: 'translateX(10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
// This configuration file sets up Tailwind CSS with custom themes, colors, fonts, and animations.
// It includes dark mode support, extends the default theme with custom properties, and adds animations for UI elements.
// The content paths ensure that Tailwind processes the necessary files for class generation.
// The configuration also includes custom colors for charts and a WhatsApp theme, enhancing the visual consistency of the application.
