import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createServer } from 'http';

const serveAuthFile = () => {
  const server = createServer((req, res) => {
    if (req.url === '/.well-known/pki-validation/FC5416B47AE03F5B990E77CDD517F784.txt') {
      // Auth dosyasını yanıt olarak gönderin.
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('İşte Auth dosyasının içeriği');
    } else {
      // Diğer istekleri işleme devam et.
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Dosya bulunamadı');
    }
  });

  server.listen(80); // Sunucu HTTP 80 portunda çalışıyor olmalı
};

// Vite yapılandırma ayarlarını tanımlayın
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
    middlewares: [serveAuthFile], // Auth dosyasını sunacak işlevi ekleyin
  },
});
