const { colors, primary } = require('./src/constants/colors');
const { platformSelect } = require('nativewind/theme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '2rem',
      },
      colors: {
        neutral: {
          150: '#f0f0f0',
        },

        border: colors.border,
        input: colors.input,
        ring: colors.ring,

        navigator: colors.navigatorBackground,

        background: colors.background,
        foreground: colors.foreground,

        primary: {
          50: primary[50],
          100: primary[100],
          200: primary[200],
          300: primary[300],
          400: primary[400],
          500: primary[500],
          600: primary[600],
          700: primary[700],
          800: primary[800],
          900: primary[900],
          950: primary[950],

          DEFAULT: primary[500],
          foreground: colors.primaryForeground,
        },
        secondary: {
          DEFAULT: colors.secondary,
          foreground: colors.secondaryForeground,
        },
        accent: {
          DEFAULT: colors.accent,
          foreground: colors.accentForeground,
        },
        muted: {
          DEFAULT: colors.muted,
          foreground: colors.mutedForeground,
        },
        destructive: {
          DEFAULT: colors.destructive,
          foreground: colors.destructiveForeground,
        },
        success: {
          DEFAULT: colors.success,
          foreground: colors.successForeground,
        },
        card: {
          DEFAULT: colors.card,
          foreground: colors.cardForeground,
          border: colors.cardBorder,
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.font-thin': {
          fontFamily: platformSelect({
            android: 'sans-serif-thin',
          }),
        },
        '.font-extralight': {
          fontFamily: platformSelect({
            android: 'sans-serif-thin',
          }),
        },
        '.font-light': {
          fontFamily: platformSelect({
            android: 'sans-serif-light',
          }),
        },
        '.font-medium': {
          fontFamily: platformSelect({
            android: 'sans-serif-medium',
          }),
        },
        '.font-semibold': {
          fontFamily: platformSelect({
            android: 'sans-serif',
          }),
          fontWeight: platformSelect({
            android: 'bold',
          }),
        },
      });
    }),
  ],
};
