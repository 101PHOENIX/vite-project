import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://oaidalleapiprodscus.blob.core.windows.net/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    https: {
      key: './vite-project-privateKey.key',
      cert: './vite-project.crt',
    },
  },
});
