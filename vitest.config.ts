import fs from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// Force every `react` / `react-dom` import to resolve to the single hoisted
// physical copy. The repo pins `node-linker = hoisted` (see .npmrc), which
// flattens one canonical node_modules/react into the workspace root. Aliasing
// bare `react`/`react-dom` to it keeps every consumer on one module instance,
// avoiding "Cannot read properties of null (reading 'useRef')" from duplicate
// React copies.
const reactRoot = path.resolve(process.cwd(), 'node_modules/react');
const reactDomRoot = path.resolve(process.cwd(), 'node_modules/react-dom');
if (!fs.existsSync(reactRoot) || !fs.existsSync(reactDomRoot)) {
  throw new Error(
    `Could not find hoisted react/react-dom under ${process.cwd()}/node_modules`,
  );
}

// Custom loader for JSON files
function customJsonLoader() {
  return {
    name: 'custom-json-loader',
    transform(_code: any, id: any) {
      if (id.endsWith('.json')) {
        const jsonContent = fs.readFileSync(id, 'utf8');
        return `export default ${JSON.stringify(jsonContent)};`;
      }
      // Return null (not `code`) so the bundler keeps its own handling of the
      // module. Rolldown (Vitest 4) re-parses a returned string without the
      // .tsx loader context, which breaks JSX in test files.
      return null;
    },
  };
}

export default {
  plugins: [react(), vanillaExtractPlugin(), customJsonLoader()],
  resolve: {
    alias: {
      react: reactRoot,
      'react-dom': reactDomRoot,
    },
    dedupe: ['react', 'react-dom', '@tanstack/react-query', 'wagmi'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./packages/spectrumkit/test/setup.ts'],
    watch: false,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.conductor/**',
      '**/examples/with-next-mint-nft/contract/**',
    ],
    server: {
      deps: {
        inline: [
          'react',
          'react-dom',
          /^react-dom\//,
          'wagmi',
          /^@wagmi\//,
          '@tanstack/react-query',
        ],
      },
    },
  },
};
