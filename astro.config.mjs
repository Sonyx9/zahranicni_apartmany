import { defineConfig } from 'astro/config';

// https://astro.build/config
// Produkce: vlastní doména (GitHub Pages + CNAME)
const PROD_SITE = 'https://zahranicniapartmany.cz';
const PROD_BASE = '/';

export default defineConfig({
  site: PROD_SITE,
  base: PROD_BASE,
  output: 'static',
  build: {
    // Složka "assets" místo "_astro"
    assets: 'assets'
  },
  integrations: []
});

