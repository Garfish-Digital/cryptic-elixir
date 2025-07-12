/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Crimson Text', 'serif'],
        'body': ['Lora', 'serif'],
        'arapey': ['Arapey', 'serif'],
      },
      colors: {
        // Aged parchment tones
        parchment: {
          light: '#F4F1E8',
          DEFAULT: '#E8E2D5',
        },
        // Faded indigo
        indigo: {
          light: '#2F3349',
          DEFAULT: '#1E1B2E',
        },
        // Dusty charcoal
        charcoal: {
          light: '#3A3A3A',
          DEFAULT: '#2C2C2C',
        },
        // Rich dark leather browns
        leather: {
          light: '#5a4b41',
          DEFAULT: '#2D1810',
        },
        // Metallic accents
        gold: '#D4A574',
        silver: '#B8B8B8',
      },
      backgroundColor: {
        'mystical': 'var(--bg-mystical)',
        'parchment': 'var(--bg-parchment)',
        'indigo': 'var(--bg-indigo)',
      },
      textColor: {
        'mystical': 'var(--text-mystical)',
        'parchment': 'var(--text-parchment)',
        'gold': 'var(--text-gold)',
      },
    },
  },
  plugins: [],
}