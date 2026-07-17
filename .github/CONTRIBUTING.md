# Contributing to SpectrumKit

Thanks for your interest in contributing! This guide covers the local setup and
the conventions this repo enforces in CI.

## Prerequisites

- **Node.js 22** (see `.nvmrc`)
- **pnpm** — this repo pins `pnpm@10.24.0` via the `packageManager` field. Run
  `corepack enable` once and pnpm will use the pinned version automatically.

## Setup

```bash
pnpm install
```

This is a pnpm monorepo; the publishable packages live under `packages/` and the
runnable demos under `examples/`.

## Development

```bash
pnpm dev            # library watch build + the example app
pnpm dev:lib        # rebuild the library packages only
pnpm dev:example    # library + example app
```

## Checks (run before opening a PR)

```bash
pnpm lint           # Biome lint + format check + typecheck across the workspace
pnpm lint:fix       # auto-fix lint/format issues
pnpm test           # Vitest unit tests
```

CI runs the same checks, so a green `pnpm lint && pnpm test` locally should match.

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
(enforced by commitlint via a git hook). Allowed types: `fix`, `feat`, `test`,
`tooling`, `refactor`, `revert`, `example`, `docs`, `format`, `chore`.

Example: `fix: resolve wallet disconnect issue`

## Changesets

For any user-facing change, add a changeset so the affected packages are versioned
and changelogged on release:

```bash
pnpm changeset
```

Prefer a patch bump unless the change warrants minor/major. Do not edit
`CHANGELOG.md` files by hand — they are generated.

## Localization

Only edit the `en-US.json` locale files. Other languages are managed separately.
