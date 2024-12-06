import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        background: '#000000', // Black background
        textLight: '#FFFFFF', // White text
        textGray: '#D3D3D3', // Light gray text
        primary: '#0C1821', // Deep navy for primary elements
        secondary: '#1B2A41', // Secondary navy
        accent: '#324A5F', // Blue-gray accent
      },
    }
  },

  plugins: [typography, forms, containerQueries]
} satisfies Config;
