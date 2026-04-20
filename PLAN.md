# Resume plan — RainbowKit wagmi-v3 fork

> Read this first when resuming. Also see `ARCHITECTURE.md` in the same dir for the
> architectural vision doc. This file is the "where are we right now" snapshot.

## Working directory

`/Users/mla/_greek/rainbow/rainbowkit`

- Branch: `wagmi-v3-work`
- Safety tag: `v0-baseline` (pre-any-refactor state, use `git checkout v0-baseline` to roll back)
- Upstream baseline: `phelix/daniel/wagmi-v3` (the stalled PR #2627 for wagmi v3 support)

## Current numeric state — 2026-04-19

- **Tests:** 92/92 passing (was 93/93 before `packages/rainbow-button/` was deleted)
- **Typecheck:** clean (`pnpm --filter @spectrumkit/spectrumkit typecheck`)
- **Build:** clean (`pnpm --filter @spectrumkit/spectrumkit build`)
- **Dev server:** HTTP 200, but **example index.tsx never client-mounts**.
  SSR renders the static heading wrappers (Custom buttons / Wallet buttons /
  Custom wallet buttons) but no `useEffect` ever fires — `mounted` stays
  false → the gated `{ready && (...)}` content never appears, no buttons
  render, no console errors. Bisect confirmed this is **pre-existing in main**
  (post-rename, not caused by Tier 6 cleanup). Production `next build && next
  start` may behave differently — investigate next.
- **60 of ~73 wallets converted to `createWallet()` factory** (82%)
- **Repo size:** ~13M of source after Tier 6 cleanup (was ~115M with `site/`
  + 11 examples + 2 sibling packages).

## How the duplicate-package blocker was resolved

pnpm with `node-linker = hoisted` plus `@wagmi/connectors`'s 7 optional peers
caused multiple physical copies of `wagmi`, `@wagmi/core`, `react`, and
`@tanstack/react-query` under `node_modules/.pnpm/<pkg>@<ver>_<peerHash>/`.
Different copies ⇒ different React Context objects ⇒ `WagmiProviderNotFoundError`,
`No QueryClient set`, `Cannot read properties of null (reading 'useRef')`.

Fix is three-part:

1. **`pnpm.overrides` + `resolutions`** in root `package.json` pin `wagmi`,
   `@wagmi/core`, `@wagmi/connectors`, `@tanstack/react-query` to single
   versions so pnpm doesn't multi-version them.
2. **`scripts/dedupReact.js`** runs as `postinstall`. It picks ONE canonical
   `.pnpm/<pkg>@<ver>_<peerHash>/` closure per package and symlinks
   `node_modules/<pkg>` plus every `packages/*/node_modules/<pkg>` to it.
   Idempotent — safe to re-run.
3. **`vitest.config.ts`** aliases `react` and `react-dom` to absolute paths
   under `.pnpm/`, plus `dedupe` and `server.deps.inline` for the singletons.
   Without this, vitest's transform pipeline and Node's CJS resolver pick
   different physical files for `react`.

Plus a latent infinite-render bug surfaced once dedup landed:
`transactionStore.getTransactions` returned a fresh `[]` literal every call,
which `useSyncExternalStore` saw as a snapshot change. Fixed by returning a
module-level `EMPTY_TRANSACTIONS` constant.

If `pnpm install` ever runs without the postinstall (e.g. `--ignore-scripts`),
re-run `node ./scripts/dedupReact.js` manually.

## What got done (keep)

### Surgical deletions (done, tested)
- `packages/rainbowkit/src/core/network/` (enhancedProvider + rainbowFetch — Rainbow's proprietary API; dead unless you have their key)
- `packages/rainbowkit/src/core/react-query/createQuery.ts`
- `packages/rainbowkit/src/components/RainbowKitProvider/useFingerprint.ts`
- `packages/rainbowkit/src/wallets/walletConnectors/coinbaseWallet/` (per user — Coinbase deprecated the standalone wallet)
- Dead `connector.id === 'coinbase'` branch in `useWalletConnectors.ts`
- `coinbaseWalletExtension` type in `types/utils.ts`
- Removed `esbuild-plugin-replace` + the `__buildVersion` / `__rainbowProviderApiKey` replace pass from `build.js`

### The `createWallet()` factory (done, tested)
- `packages/rainbowkit/src/wallets/createWallet.ts` — the reusable factory that eats the wallet-connector boilerplate.
- `packages/rainbowkit/src/wallets/createWallet.test.ts` — 4 lock-in tests covering: injected-only, hybrid (WC fallback), custom step sequence override, platform-split `detect` (Trust-style).
- Factory features supported:
  - `detect: { flag, namespace }` — simple injected detection
  - `detect: { mobile: {...}, desktop: {...} }` — Trust-style platform-split
  - `mobileDeepLink: (uri) => string` — per-OS deep-link template
  - `desktopDeepLink: (uri) => string` — desktop-app protocol URL (Bloom-style)
  - `qrUriTransform: (uri) => string` — optional WC URI transform
  - `i18nId: string` — override for legacy snake_case keys (oneKey → `one_key`)
  - `hidden: () => boolean` — platform gate (dawn non-iOS, tokenary non-Safari)
  - `instructions.{extension,qrCode,desktop}.steps` — optional override of step sequence

### 60 wallets converted via the factory
Typical saving: 80-100 → 15-25 lines per wallet.
Still hand-rolled (each has a reason documented in `ARCHITECTURE.md`):
- SDK-bound (9): metaMaskWallet, coinbaseWallet (DELETED), safeWallet, ledgerWallet, baseAccount, geminiWallet, portoWallet, walletConnectWallet, injectedWallet
- argentWallet (re-exports readyWallet)
- ctrlWallet (namespace mismatch quirk — detect `ctrl.ethereum`, connect `xfi.ethereum`)
- iopayWallet (user-agent sniff different from isMobile)
- universalProfilesWallet (literal English instruction strings, not i18n keys)

### SSR safety wrappers (added, but controversial)
Added `useIsMounted()` hook at `packages/rainbowkit/src/components/RainbowKitProvider/useIsMounted.ts` and wrapped these with SSR-bail-out patterns:
- `RainbowKitProvider` (splits off `WagmiEffects` child that only mounts client-side)
- `RainbowKitChainProvider`
- `ModalProvider`
- `TransactionStoreProvider`
- `AuthenticationProvider`
- `ConnectButton`, `ConnectButtonRenderer`
- `WalletButton`, `WalletButtonRenderer`

These fixed the original `WagmiProviderNotFoundError` on SSR. But they don't help with the deeper duplicate-wagmi issue.

### Other simplifications (done, tested)
- `InstructionMobileDetail` + `InstructionExtensionDetail` + `InstructionDesktopDetail` in `ConnectDetails.tsx` → single generic `<InstructionDetail variant="mobile|extension|desktop">` (−140 LoC)
- `useRecentTransactions` hand-rolled store subscription → `useSyncExternalStore` (modern React idiom)
- `universalProfilesWallet.svg` optimized with `svgo` (294KB → 159KB source; 389KB → 212KB bundle chunk)
- Simplified `installed` logic in `createWallet` from 4-ternary pyramid to one line

### Latent bugs fixed incidentally by factory migration
- `frontierWallet` QR instructions used `wallet_connectors.im_token.*` keys (copy-paste from imToken) — factory auto-derives correct keys
- `bitgetWallet` extension step 3's `title` referenced `.step3.description` instead of `.step3.title` — factory generates correct keys
- `safepalWallet` spread `qrCode` fields onto wallet root instead of under `qrCode` — factory places correctly

## What's next — pick from the backlog

The dedup blocker is resolved. The next session can either:

- Pick a Tier 1 item (low-risk wallet conversions, dependency cleanup) — see backlog below.
- Tackle a Tier 2/3 structural simplification once you're ready for browser-QA work.

Before any larger refactor, sanity-check the green state:

```
pnpm install && pnpm test            # expect 93/93
pnpm --filter @spectrumkit/spectrumkit build
pnpm --filter example dev            # http://localhost:3000 should render the demo
```

## Full cleanup backlog

Grouped by tier (tier = effort × risk ÷ value). Items with file paths are
ready to work on; verify paths still exist before acting on stale recs.

### Tier 1 — Finish the factory pass (low risk)

- [ ] **Convert remaining factory-eligible wallets.** 13 still hand-rolled
  (see "Still hand-rolled" in `ARCHITECTURE.md`). Most have real reasons
  to stay. `coin98Wallet` has a quirk (detect namespace ≠ connect namespace)
  — worth a look. `universalProfilesWallet` uses literal strings instead of
  i18n keys; could extend factory with a `literalSteps` escape hatch.

- [ ] **Move `@coinbase/wallet-sdk` out of rainbowkit deps.** coinbaseWallet
  connector is deleted but the SDK dep is still there as a transitive
  `@wagmi/connectors` peer. Try removing — if nothing breaks, great.

- [ ] **Move `useCoolMode` (207 LoC)** at
  `packages/rainbowkit/src/components/RainbowKitProvider/useCoolMode.ts` to
  an optional entry `@spectrumkit/spectrumkit/cool-mode` so consumers who don't
  use the emoji-confetti effect don't ship the code.

### Tier 2 — Structural simplifications (medium risk)

- [ ] **Split `ConnectDetails.tsx` (~950 LoC) into separate files.** After
  our 3→1 `<InstructionDetail>` pass, it's still a giant. Self-contained
  sub-components at lines ~67, 191, 420, 617, 734: `GetDetail`,
  `ConnectDetail`, `DownloadOptionsDetail`, `DownloadDetail`, etc. Each
  could be its own file.

- [ ] **Collapse Desktop/Mobile options into one responsive component.**
  `packages/rainbowkit/src/components/ConnectOptions/DesktopOptions.tsx` (594 LoC)
  and `MobileOptions.tsx` (512 LoC) are ~80% the same state machine with
  different layout. Single component + media-query-driven CSS + one
  state machine. Est. −500 LoC. HIGH risk — needs browser QA.

- [ ] **Flatten 12 nested Context providers → 1 store.**
  `RainbowKitProvider.tsx:112–168`. Replace with a single zustand store or
  one mega-context. Perf + clarity wins.
  Contexts involved: `RainbowKitChainProvider`, `WalletButtonProvider`,
  `I18nProvider`, `CoolModeContext`, `ModalSizeProvider`,
  `ShowRecentTransactionsContext`, `TransactionStoreProvider`, `AvatarContext`,
  `AppContext`, `ThemeIdContext`, `ShowBalanceProvider`, `ModalProvider`.

- [ ] **Re-audit all `@ts-expect-error` / `@ts-ignore`** (14 occurrences).
  Several flagged as wagmi-v2 quirks that might be fixable under v3:
  - `useWalletConnectors.ts:90` — "Web3Modal v1 error name"
  - `useWalletConnectors.ts:92` — "Web3Modal v2 error message"
  - `useWalletConnectors.ts:110,116` — provider typing
  - `transactionStore.ts:156` — "types changed with viem@1.1.0"

- [ ] **Modernize `transactionStore.ts` (hand-rolled event emitter).** Swap
  `Set<() => void>` listeners pattern for zustand OR keep leaning on
  `useSyncExternalStore` (already done in `useRecentTransactions.ts`). The
  store itself at `packages/rainbowkit/src/transactions/transactionStore.ts:69`
  is still the old pattern.

- [ ] **Make state machine explicit.** The 9-state `WalletStep` enum
  (`DesktopOptions.tsx:48-58`) drives both desktop and mobile flows via a
  plain `useState` + `switch`. Convert to a reducer, or if you're bold,
  xstate. Would pair well with the Desktop/Mobile collapse.

### Tier 3 — Scope creep extraction (medium risk)

rainbowkit is actually ~6 products in a trench coat. Each could be its own
opt-in entry.

- [ ] **Extract `transactions/` to `@spectrumkit/spectrumkit/transactions` entry.**
  Currently wired into main provider tree unconditionally. Most apps track
  their own transactions. ~500 LoC could become optional.

- [ ] **Extract auth/SIWE.** `AuthenticationContext.tsx` is wired into the
  main provider tree, even though `rainbowkit-siwe-next-auth` is a separate
  package. Decouple the core so SIWE adapters are truly optional.

- [ ] **Strip i18n to BYO-translator hook.** 22 locale JSON files → keep
  `en_US.json` fallback only, let consumers pass their own translator
  function. `packages/rainbowkit/src/locales/` is 1.3MB source, inflates
  ~3x in bundle chunks due to JSON unicode-escape bloat.

- [ ] **Open the chain registry (`provideRainbowKitChains.ts`, 362 LoC).**
  Hardcodes metadata for 77 chains. Replace with
  `defineChainMeta(chain, { iconUrl, iconBackground })` so consumers
  register their own. Ship 5–10 default chains. Kills the
  "add new chain → new rainbowkit release" coupling that causes this repo
  to barely be maintained.

### Tier 4 — Design system overhaul (very high risk, highest payoff)

- [ ] **Kill runtime `<Box>` prop-splitter.**
  `packages/rainbowkit/src/components/Box/Box.ts` uses a runtime `for...in`
  loop over 20+ props at every render, called in 246 sites. Replace with
  compile-time classNames via codemod, or rip `<Box>` entirely and use CSS
  modules. ≥2 days of deep work with thorough browser QA.

- [ ] **Drop vanilla-extract + sprinkles.** ~588 LoC of
  `css/sprinkles.css.ts`, `atoms.ts`, `touchableStyles.css.ts` etc. become
  dead once `<Box>` goes. Replace with CSS modules + CSS custom properties
  for theming.

- [ ] **Simplify theming.** 3-theme (light/dark/midnight) × 7-accent-color
  system is 320 LoC across 4 files in `packages/rainbowkit/src/themes/`.
  Themes as CSS-variable overrides would be ~80 LoC + ~20 LoC runtime toggle.

### Tier 5 — Asset + bundle hygiene (low risk, easy)

- [ ] **Optimize remaining large wallet SVGs.**
  - `universalProfilesWallet.svg` still 159KB after one svgo pass (from 294KB).
    Has 919 `<stop>` elements — autogenerated, probably re-exportable cleaner.
  - Other big SVGs: `frameWallet.svg` (39KB), `mecoWallet.svg` (38KB),
    `oneInchWallet.svg` (31KB). Find with
    `find packages/rainbowkit/src -name "*.svg" -size +10k`.

- [ ] **Fix 3x locale chunk bloat.** `ru_RU.json` source is 65KB but
  `ru_RU-*.js` in dist is 199KB — esbuild expands `\u` unicode escapes at
  build. Fix: convert source JSONs to raw UTF-8, or emit locales as dynamic
  JSON fetches.

- [ ] **Bundle audit.** `pnpm --filter @spectrumkit/spectrumkit build &&
  du -sh packages/rainbowkit/dist/**/*.js | sort -h | tail -20` to see
  what's eating bytes.

### Tier 6 — Repo-level cleanup (low risk)

- [ ] **Delete unused sibling packages** (or document why kept):
  - `packages/rainbow-button/` — standalone button component
  - `packages/rainbowkit-siwe-next-auth/` — only if SIWE extracted (Tier 3)
  - `packages/create-rainbowkit/` — scaffolder CLI, probably unused for a fork
  - `packages/example/` — keep 1 for smoke testing
  - `examples/*` — 13 example apps, keep 1–2, delete rest

- [ ] **Remove `site/` docs.** Rainbow's own docs site is at rainbow.me —
  a fork doesn't need a duplicate docs site.

- [ ] **Consolidate workspace layout.** Collapse `packages/rainbowkit/*` to
  single top-level package if siblings are dropped. Simpler mental model,
  fewer pnpm peer-dep-closure conflicts.

### Tier 7 — Fork identity (judgement call)

Do these before publishing anything. After publish = breaking.

- [ ] **Rename package.** `@spectrumkit/spectrumkit` → `@greek/walletkit` or
  whatever matches the rest of `/Users/mla/_greek/`. Touch points:
  - `packages/rainbowkit/package.json:2`
  - All `workspace:*` refs
  - All `@spectrumkit/spectrumkit` imports in consumer code
  - `CLAUDE.md`, `ARCHITECTURE.md`, `PLAN.md`

- [ ] **Rename CSS data attribute.** `[data-sk]` is the theme root selector
  (`RainbowKitProvider.tsx:37`). Rename to avoid collision if a consumer
  uses both forks side-by-side.

- [ ] **Rename localStorage keys.** `rk-transactions`, `rk-recent-wallets`,
  `rk-version`. Consider a migration-on-first-load if you want existing
  user data (pending txs, recent wallets) to carry over.

## Files added/changed by the dedup fix

- `package.json` — added `pnpm.overrides` + `resolutions` for `wagmi`,
  `@wagmi/core`, `@wagmi/connectors`, `@tanstack/react-query`. Added
  `postinstall: node ./scripts/dedupReact.js`.
- `scripts/dedupReact.js` — postinstall script that symlinks workspace
  copies of singleton packages to one canonical `.pnpm/` closure.
- `vitest.config.ts` — react/react-dom alias to absolute `.pnpm` path,
  `resolve.dedupe`, and `test.server.deps.inline` for singletons.
- `packages/rainbowkit/src/transactions/transactionStore.ts` — `getTransactions`
  now returns a stable `EMPTY_TRANSACTIONS` constant when no txs exist,
  preventing the `useSyncExternalStore` infinite render loop.

## Recovery commands if things go sideways

- Full rollback to pre-work: `git checkout v0-baseline -- .` (don't lose PLAN.md / ARCHITECTURE.md — save first)
- Lost changes via stash accident? Check `git fsck --lost-found` for dangling commits. A `WIP on wagmi-v3-work` commit is the stash. Apply with `git diff <parent> <dangling> > /tmp/p.patch && git apply /tmp/p.patch`
- Reinstall from clean: `rm -rf node_modules packages/*/node_modules site/node_modules && pnpm install`

## Files of interest

- `ARCHITECTURE.md` — the architectural vision + session log
- `packages/rainbowkit/src/wallets/createWallet.ts` — the factory
- `packages/rainbowkit/src/wallets/createWallet.test.ts` — factory tests
- `packages/rainbowkit/src/components/RainbowKitProvider/useIsMounted.ts` — SSR guard hook
- Any file under `src/wallets/walletConnectors/*/` matching `grep -l "from '\.\./\.\./createWallet'"` — a factory-converted wallet

## Key references for new context

- Wagmi peer-dep duplication is a known pnpm pathology. Root cause: `@wagmi/connectors` has 7 optional peers, and every workspace package's closure hashes differently.
- Porto (an optional wagmi connector) is what drags `@tanstack/react-query@5.59.0` into the picture.
- The original PR #2627 (phelix/daniel/wagmi-v3) never fully worked as a running dev server either — confirmed by testing the pristine baseline.
- Published consumers of rainbowkit don't hit the peer-dup issue because they only install one rainbowkit copy. This is monorepo-specific.

## What NOT to do

- Don't `git reset --hard` anything — my system already denied this once. Use `git checkout -- <file>` for specific files.
- Don't `git stash drop` without verifying `git stash apply` succeeded.
- Don't use `shamefully-hoist = true` — breaks 34 tests. Use `node-linker = hoisted` instead if you go that route (less nuclear).
- Don't re-add `useFingerprint`, `enhancedProvider`, or the removed wallet SDK deps even for dedup convenience — they were deleted for good reasons (dead code / vendor lock-in / pre-factory boilerplate).
