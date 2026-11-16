import { defineConfig } from 'vite';

// React JSX is compiled by Vite's built-in esbuild (automatic runtime).
export default defineConfig({
  // Relative asset paths so the build works under any sub-path, e.g. https://<user>.github.io/<repo>/
  // (the app uses hash routing, so no server-side rewrites are needed on GitHub Pages)
  base: './',
  esbuild: { jsx: 'automatic' },
  server: { port: 5173, open: true },
  build: { chunkSizeWarningLimit: 1500 },
});
