import { defineConfig } from 'vite';

// React JSX is compiled by Vite's built-in esbuild (automatic runtime).
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  server: { port: 5173, open: true },
  build: { chunkSizeWarningLimit: 1500 },
});
