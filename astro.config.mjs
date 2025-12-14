import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://maheshreddy32825.github.io',
  output: 'static',
  trailingSlash: 'always', // important for GitHub Pages
});
