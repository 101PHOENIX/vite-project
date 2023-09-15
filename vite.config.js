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
        secure: false,
      },
    },
    https: {
      https: true,
      key: './vite-project-privateKey.key',
      cert: './vite-project.crt',
    },
    middlewares: [
      (req, res, next) => {
        if (req.url === '/.well-known/pki-validation/FC5416B47AE03F5B990E77CDD517F784.txt') {
          // Burada yetkilendirme dosyanızı okuyarak istemciye sunabilirsiniz.
          res.statusCode = 200;
          res.end('Bu, yetkilendirme dosyasının içeriği olabilir.');
        } else {
          next();
        }
      },
    ],
  },
});
