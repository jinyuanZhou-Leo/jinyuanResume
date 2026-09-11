// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  server: { port: 4321 },
  vite: {
    // Keep one dev server on the canonical port and prebundle the visible React island.
    server: { strictPort: true },
    optimizeDeps: { include: ['swr', 'three', 'postprocessing'] },
  },
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  devToolbar: { enabled: false },
});
