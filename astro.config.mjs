// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
export default defineConfig({
  site: 'https://jyleo.cc',
  integrations: [react()],
  server: { port: 4321 },
  vite: {
    // Keep one dev server on the canonical port and prebundle the visible React island.
    server: { strictPort: true },
    optimizeDeps: { include: ['swr', 'three', 'postprocessing'] },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/three/')) {
              return 'three-vendor';
            }
            if (id.includes('/node_modules/postprocessing/')) {
              return 'postprocessing-vendor';
            }
          },
        },
      },
    },
  },
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  devToolbar: { enabled: false },
});
