import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const pages = [
  'index', 'news', 'article', 'discussions', 'thread',
  'questions', 'question', 'events', 'community',
  'market', 'company', 'notifications', 'ecobalyse',
];

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        pages.map(p => [p, resolve(__dirname, `${p}.html`)])
      ),
    },
  },
  server: {
    port: 3000,
    open: '/index.html',
  },
};
