import fs from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// Force every `react` / `react-dom` import to resolve to the .pnpm-canonical
// physical copy. pnpm with `node-linker = hoisted` creates BOTH a top-level
// node_modules/react AND a .pnpm/react@x/node_modules/react as separate
// physical files. CJS modules under .pnpm always resolve to the .pnpm copy;
// without the alias, Vite resolves bare `react` to the hoisted copy → two
// React module instances → "Cannot read properties of null (reading 'useRef')".
const pnpmDir = path.resolve(process.cwd(), 'node_modules/.pnpm');
const reactDirName = fs
  .readdirSync(pnpmDir)
  .find((name) => /^react@\d/.test(name));
const reactDomDirName = fs
  .readdirSync(pnpmDir)
  .find((name) => /^react-dom@\d.*_react@/.test(name));
if (!reactDirName || !reactDomDirName) {
  throw new Error(`Could not find react/react-dom under ${pnpmDir}`);
}
const reactRoot = path.join(pnpmDir, reactDirName, 'node_modules/react');
const reactDomRoot = path.join(
  pnpmDir,
  reactDomDirName,
  'node_modules/react-dom',
);

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
