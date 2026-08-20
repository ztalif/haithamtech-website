// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // WAJIB: tanpa `site`, sitemap & URL absolut (canonical/OG) rusak senyap. Lihat SPEC §8.
  site: 'https://haithamtech.com',
  trailingSlash: 'never',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
