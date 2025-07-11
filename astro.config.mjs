// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind'; // Correct import for Astro's Tailwind integration

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      // You can pass options to Tailwind here if needed, e.g., to configure the base stylesheet
      // base: false, // Set to false if you want to manually import Tailwind's base styles
    }),
  ],
});