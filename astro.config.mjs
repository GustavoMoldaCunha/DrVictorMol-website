// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site =
  process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.victormol.com.br';

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
