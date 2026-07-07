import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Set VITE_BASE=/spectrumkit/ when building for the GitHub Pages project site.
  base: process.env.VITE_BASE ?? '/',
  build: {
    target: 'es2020',
  },
  plugins: [react()],
});
