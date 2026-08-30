import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

const rawPort = process.env.PORT ?? '5173';
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? '/';

function copyDotPublicFiles(): Plugin {
  return {
    name: 'copy-dot-public-files',
    closeBundle() {
      const from = path.resolve(import.meta.dirname, 'public/.htaccess');
      const to = path.resolve(import.meta.dirname, 'dist/.htaccess');
      if (fs.existsSync(from)) fs.copyFileSync(from, to);
    },
  };
}

const devPlugins =
  process.env.NODE_ENV !== 'production'
    ? [
        (await import('@replit/vite-plugin-runtime-error-modal')).default(),
        ...(process.env.REPL_ID !== undefined
          ? [
              (await import('@replit/vite-plugin-cartographer')).cartographer({
                root: path.resolve(import.meta.dirname, '..'),
              }),
              (await import('@replit/vite-plugin-dev-banner')).devBanner(),
            ]
          : []),
      ]
    : [];

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss(), copyDotPublicFiles(), ...devPlugins],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'motion';
          if (id.includes('node_modules/lucide-react')) return 'icons';
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': { target: 'http://127.0.0.1:4000', changeOrigin: true },
      '/uploads': { target: 'http://127.0.0.1:4000', changeOrigin: true },
      '/admin': { target: 'http://127.0.0.1:4000', changeOrigin: true },
      '/sitemap.xml': { target: 'http://127.0.0.1:4000', changeOrigin: true },
    },
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': { target: 'http://127.0.0.1:4000', changeOrigin: true },
      '/uploads': { target: 'http://127.0.0.1:4000', changeOrigin: true },
      '/admin': { target: 'http://127.0.0.1:4000', changeOrigin: true },
      '/sitemap.xml': { target: 'http://127.0.0.1:4000', changeOrigin: true },
    },
  },
});
