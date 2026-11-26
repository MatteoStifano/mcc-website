import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.monopoli-coders-club.com',

  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    // Italian at /, English at /en/
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'it',
        locales: { it: 'it-IT', en: 'en-GB' },
      },
    }),
  ],

  markdown: {
    shikiConfig: {
      // Both palettes are emitted as CSS variables; blog.css picks one per theme
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
