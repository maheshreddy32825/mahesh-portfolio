import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rss from '@astrojs/rss';

export default defineConfig({
  site: 'https://yourdomain.com', // set your URL
  integrations: [sitemap(), rss()],
  markdown: {
    syntaxHighlight: 'prism'
  }
});
