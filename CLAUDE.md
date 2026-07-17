# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

SpectrumKit is a pnpm monorepo. It is a fork of RainbowKit, rebranded and trimmed.

Two packages are published to npm:

- **`packages/spectrumkit`** (`@spectrumkit/spectrumkit`) — core library: React components and hooks for wallet connection UI
- **`packages/spectrumkit-siwe-next-auth`** (`@spectrumkit/spectrumkit-siwe-next-auth`) — Sign-In with Ethereum adapter for NextAuth

Everything else is private and never publishes:

- **`packages/example`** — development example app (localhost:3000), the reference for how the two packages wire together
- **`examples/with-next-app`**, **`examples/with-vite`** — standalone integration examples; `with-vite` is deployed to GitHub Pages as the live demo

## Development Commands

### Setup
```bash
pnpm install  # Installs deps; each package's `prepare` builds its dist
```

### Development
```bash
pnpm dev                      # Run lib + example app (localhost:3000)
pnpm dev:lib                  # Watch and rebuild library packages only
pnpm dev:example              # Run lib + example app
```

### Building
```bash
pnpm build                    # Build all packages in dependency order
```

### Testing
```bash
pnpm test                     # Run all unit tests (Vitest)
pnpm test:unit run -t "<name>"  # Run specific test by name
pnpm test:update              # Update test snapshots
pnpm test:watch               # Watch mode
```

### Linting & Formatting
```bash
pnpm lint                     # Biome lint + format check + typecheck all packages
pnpm lint:fix                 # Auto-fix lint + formatting
pnpm format:check             # Check Biome formatting only
pnpm format:fix               # Auto-fix Biome formatting (run before commits)
```

## Architecture

### Core Library (`packages/spectrumkit`)

Built with:
- **Styling**: Vanilla Extract for type-safe CSS-in-JS
- **Build**: Custom esbuild setup (`build.js`) with watch mode
- **Bundling**: ESM with code splitting for tree shaking

Key directories:
- `src/components/` — UI components (ConnectButton, modals, etc.)
- `src/wallets/` — wallet connector definitions and registry
- `src/themes/` — theme system (light, dark, midnight)
- `src/locales/` — internationalization files
- `src/hooks/` — React hooks for wallet interactions
- `src/css/` — Vanilla Extract styles

Build process:
1. TypeScript type generation runs first (`typegen`)
2. esbuild compiles the main entry + wallets separately
3. Vanilla Extract processes CSS with autoprefixer and selector prefixing (`[data-sk]`)
4. SVGs are inlined as data URLs, PNGs as base64

The published `dist/` is large (~4MB) but code-split: wallet connectors are separate
entry points and locales load via dynamic import, so consumers only bundle what they use.
JS is intentionally unminified — the consumer's bundler handles that.

Environment variables (`.env.local`):
- `WALLETCONNECT_PROJECT_ID` — for WalletConnect integration

### Dependencies worth understanding

`packages/spectrumkit` declares several packages it never imports —
`@base-org/account`, `@metamask/connect-evm`, `@safe-global/*`,
`@walletconnect/ethereum-provider`, `porto`. **These are load-bearing.** They are
`optional: true` peers of `@wagmi/connectors`, which pnpm does not auto-install,
so declaring them as real dependencies is what puts them on disk for the
corresponding connectors to require at runtime. A depcheck tool will call them
unused. They are not.

`packages/spectrumkit-siwe-next-auth` declares **no** regular dependencies — only
peers. That is deliberate: it must share the host app's single copy of React,
core, and next-auth. Bringing its own would produce duplicate React contexts and
"Invalid hook call".

Two settings keep the stateful singletons single, and it's worth knowing which does what —
they are often conflated:

- **`pnpm.overrides` (root package.json)** pins `wagmi`, `viem`, `react`, `react-dom`,
  `@tanstack/react-query`, and `@walletconnect/*` to one version each. **This is what
  actually enforces the singletons.** Two copies of `wagmi` means two `WagmiContext`
  objects, so `<WagmiProvider>` fills one and `useConfig` reads the other — i.e.
  `WagmiProviderNotFoundError`. Same shape of bug for React (hook dispatcher) and
  `@walletconnect/core` (two relayer connections, two IndexedDB session stores).
- **`.npmrc`'s `node-linker = hoisted`** keeps the tree flat, which reduces
  fragmentation. It does **not** guarantee singletons — hoisting gives one package the
  root slot and nests the rest. 57 of 761 packages currently exist at 2+ versions, and
  `clsx` is resolved at `1.2.1` in the root while spectrumkit's own `2.1.1` sits nested
  under `packages/spectrumkit/node_modules`. Hoisting got the wagmi case right by luck
  of resolution order, not by design.

So: don't drop the overrides thinking hoisting covers you — it doesn't. Note also that
`hoisted` disables the phantom-dependency detection that is pnpm's main advantage, which
is why `packages/example` can run `tsc` without declaring `typescript`.

Do not add an override for `@wagmi/core` or `@wagmi/connectors`: `wagmi` pins those
exactly in its own dependencies, so an override there is redundant today and silently
downgrades them the moment `wagmi` is bumped.

### Testing

- Framework: Vitest with jsdom environment
- Setup: `packages/spectrumkit/test/setup.ts`
- Config: Root `vitest.config.ts` with Vanilla Extract plugin
- Tests located alongside source files (`.test.ts` / `.test.tsx`)
- No coverage reporting is configured

## Commit & Release Workflow

### Commit Format
Follow conventional commits as defined in `commitlint.config.js`:
- Types: `fix`, `feat`, `test`, `tooling`, `refactor`, `revert`, `example`, `docs`, `format`, `chore`
- Example: `fix: resolve wallet disconnect issue`

### Changesets
Always create a changeset for user-facing changes:
```bash
pnpm changeset  # Creates markdown file in .changeset/
```
- Prefer patch versions unless the change warrants minor/major
- Never edit CHANGELOG.md files directly (auto-generated)
- Update existing changesets in the same area rather than creating duplicates

### Git Workflow Tools
Use the following tools for git operations:
- **Graphite (`gt`)** - Preferred tool for all git interactions:
  - **Creating commits**: `gt create @username/precise-branch-name -m "commit message"`
    - **Stylize gt branch names like the following**: `@username/fix-feature` or `@username/upgrade-package-v10`
  - **Modifying existing commits**: `gt modify`
    - **Prefer this over adding new commits unless explicitly asked**
    - **Need to stage changes with git add or use --all to stage all changes**
  - **Creating branches**: `gt branch create <branch-name>`
  - **Tracking branches**: `gt track` - Always track branches if they aren't already tracked
  - **Moving branches in stack**: `gt move --onto <target-branch>` - Use when repositioning commits/branches
  - **Submitting/updating pull requests**: `gt submit --stack`
  - **Checking out PRs**: `gt checkout <pr-number>`
  - **Always ask before committing changes or manipulating/resubmitting branches or opening PRs**
  - **Always use gt modify by default when asked to make a commit**
- **GitHub CLI (`gh`)** - For viewing CI/CD status:
  - Use `gh run list` to view workflow runs
  - Use `gh run view` to investigate specific CI failures

### Locale Files
Only modify `en-US.json` locale files. Other language files are managed separately
via Crowdin (`crowdin.yml`).

## CI Pipeline

See `.github/workflows/ci.yml` for the full test plan:
1. Install dependencies
2. Build packages
3. Run linting and formatting checks
4. Run unit tests (`pnpm test`)
5. Build examples

All checks must pass before merging.

## Additional Notes

- Uses Biome for formatting/linting (replaces ESLint + Prettier)
- React 19 and Next.js 16 compatible
- Built on wagmi v3 and viem 2.x
- Node.js >= 22 required
- `rk-` prefixes persist in `data-testid` attributes, `aria-labelledby` ids, and
  localStorage keys (`rk-recent`, `rk-latest-id`). These are deliberate — renaming
  them breaks consumers' tests and users' persisted state.
