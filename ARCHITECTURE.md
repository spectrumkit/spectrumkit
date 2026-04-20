# Architecture (target for this fork)

Internal design notes. Not the user-facing README.

## North star

**One job:** let a dapp render a wallet-connect UI on top of wagmi v3. Everything else is opt-in.

Today rainbowkit does ~6 things: connect UI, transactions, SIWE, ENS caching (proprietary), i18n,
design system. The fork keeps all those *features* but stops treating them as co-equal —
connect UI is the one thing the library owes you; the rest are optional.

## Target shape

Single package for now (no monorepo split). The internal module boundaries act as the future
split-points if/when we extract packages.

```
src/
  core/                  — headless: state, wagmi bridge, wallet registry. No JSX.
    connectFlow.ts         — state machine (reducer). Replaces the implicit 9-state switch.
    walletRegistry.ts      — merges EIP-6963 + registered connectors + WalletConnect fallback.
    useAccount.ts, useChain.ts, useConnect.ts  — thin wrappers on wagmi v3 hooks.

  ui/                    — visual layer. CSS modules + CSS variables, no vanilla-extract Box.
    ConnectButton.tsx
    ConnectModal.tsx     — one responsive component. No desktop/mobile split.
    AccountModal.tsx
    ChainModal.tsx
    primitives/          — Button, Dialog, Modal, Icon. Replaces <Box>/<Text> everywhere.
    theme.css.ts         — CSS custom properties. Themes are just variable overrides.

  wallets/               — registry + factory.
    createWallet.ts      — the factory that collapses per-wallet boilerplate.
    presets/             — 10 popular wallets using createWallet. Rest stay as-is for now.

  features/              — opt-in, not imported by default.
    transactions/        — moved out of the main provider tree.
    siwe/                — ditto. AuthenticationProvider lives here.
    coolMode/            — the confetti.

  i18n/                  — BYO translator. Ships en_US; consumers pass their own t().

  index.ts               — re-exports keep the public API compatible.
```

## Architectural rules (things to keep true while refactoring)

1. **Wagmi is the boundary.** We do not reimplement connectors, account management, chain
   switching, or signing. We render UI and own the list of wallets we know about. wagmi owns
   state.

2. **EIP-6963 first.** Browser-announced wallets are the primary source of truth for
   "what's installed." Our registry is for metadata (icon, download URL, deep-link scheme) and
   for wallets that don't announce (WalletConnect, Coinbase Wallet popup flow).

3. **No custom design system.** CSS variables for theming. CSS modules for scoped styles.
   No `<Box as="X" padding="16" color="Y">` runtime atom-splitter. If Tailwind lands later,
   fine; we're not blocking it.

4. **One responsive modal.** `DesktopOptions.tsx` (594 LoC) and `MobileOptions.tsx` (512 LoC)
   collapse into a single `<ConnectModal>` driven by media queries. The 9-state FSM becomes
   a reducer used by both.

5. **Factories over repetition.** If a pattern repeats more than 3 times, write the factory.
   Top targets: `createWallet()` for the 74 wallet connectors, `<InstructionList>` for the 3
   duplicate instruction components.

6. **Strict dependency direction.** `ui/` imports `core/`, never the reverse. `features/`
   import `core/` and may add their own providers that compose above `<RainbowKitProvider>`.
   `core/` imports only wagmi/viem/react.

7. **No vendor lock-in.** No Rainbow-proprietary API clients in core. ENS resolution is pure
   wagmi `useEnsName` / `useEnsAvatar`.

8. **Tree-shakable by default.** Every feature that isn't the connect modal must be
   side-effect-free and importable as its own entry.

9. **Public API compatibility.** Existing consumers importing `@spectrumkit/spectrumkit` should
   keep working. Internal refactors are free; public exports are contracts.

## What we're explicitly NOT doing in this fork

- Rewriting from scratch. The 89 tests encode years of wallet-connection edge cases.
  We delete and consolidate, we don't reinvent.
- Dropping any working feature. Every feature stays reachable; some move to optional entries.
- Shipping new features. Scope is: less code, cleaner layering, faster bundle.

## Phased execution plan

Each phase is a testable checkpoint. Tests must be green at the end of each phase.

| Phase | Name | Status | Outcome |
|---|---|---|---|
| 0 | Tag baseline (v0-baseline), write this doc | ✅ done | 89/89 green |
| 1 | Strip dead weight (enhancedProvider, core/network/, useFingerprint) | ✅ done | −261 LoC, vendor lock-in gone |
| 2 | Optimize `universalProfilesWallet.svg` (294KB → 159KB) | ✅ done | −135KB src, −177KB bundle chunk |
| 3 | `InstructionDetail` generic component | ✅ done | 3 dup components → 1 (−140 LoC) |
| 4a | `createWallet()` factory + tests | ✅ done | Factory + 3 unit tests (92/92 green) |
| 4b | Convert 21 wallets to factory | ✅ done | Samples all patterns (injected-only, hybrid, WC-only, hidden, i18nId override) |
| 5 | `useRecentTransactions` → `useSyncExternalStore` | ✅ done | Modern React pattern, −9 LoC |
| 4c | Convert remaining ~40 factory-eligible wallets | pending | mechanical ~2000 LoC to save |
| 6 | Move cool-mode to optional entry | pending | low risk |
| 7 | Collapse Desktop/Mobile to responsive single | pending | high risk, ~500 LoC |
| 8 | Flatten 12 contexts → 1 store | pending | high risk, perf win |
| 9 | Kill runtime `<Box>` prop-splitter | pending | very high risk |

## Session 1 net delta

- **55 source files changed** in `packages/spectrumkit/src`
- **−2832 LoC** (3386 deletions, 554 insertions)
- Bundle `dist/` with `MINIFY_CSS=true`: **5.9MB → 5.5MB** (−400KB, −7%)
- `index.js`: **281KB → 271KB** (−10KB)
- `universalProfilesWallet` chunk: **389KB → 212KB** (−177KB, −45%)
- Bonus: two latent i18n-key bugs in `frontierWallet` and `bitgetWallet` fixed incidentally by the factory's key derivation

## Session 2 additional delta (continued cook)

- **93 total source files changed** (+38 over session 1)
- **−4516 LoC net** (5704 deletions, 1188 insertions)
- Wallet-connector source: **5026 → 2339 LoC** (−53%)
- **60 of ~73 wallets converted** to `createWallet` (82%)
- Factory extended with:
  - `DetectOption` for platform-split flags (Trust-style `{ mobile, desktop }`)
  - `desktopDeepLink` for desktop-only WC wallets (Bloom-style)
  - Simpler `installed` logic
- New lock-in test for split-detect behavior (93 tests total, all green)
- Latent bugs fixed: `frontierWallet`, `bitgetWallet`, `safepalWallet` (spread-bug with mis-placed `getUri`/`instructions` at wallet root)

## The createWallet factory (the "framework" for repeated patterns)

File: `src/wallets/createWallet.ts`. 155 LoC that replaces ~80 LoC × dozens of wallets.

Inputs it handles:
- Injected detection: `detect: { flag } | { namespace } | { flag, namespace }`
- Mobile deep-link: `mobileDeepLink: (uri) => string`
- QR URI transform: `qrUriTransform: (uri) => string`
- i18n key prefix override for legacy wallets: `i18nId`
- `hidden: () => boolean` predicate
- Custom step sequences: `instructions.qrCode.steps: ['install','create','refresh']`

The default step i18n keys are derived: `wallet_connectors.{i18nId ?? id}.{qr_code|extension|desktop}.step{N}.{title|description}`.

This is the pattern-capture the user asked for: if I catch myself writing identical boilerplate for the Nth wallet, the answer is extending `createWallet`, not hand-rolling a 22nd copy.

## Wallets converted via createWallet (sessions 1 + 2)

Injected-only: phantom, rabby, brave, enkrypt, dawn (hidden non-iOS), onekey,
nest, backpack, frame, talisman, wigwam, bitski, compass, ctrl (skip — quirk),
desig, magicEden, ramper, safeheron, seif, taho, tokenary (hidden non-Safari).

Hybrid (injected + WalletConnect fallback): bybit, zerion, okx, frontier,
rainbow, bitget, tokenPocket, subwallet, gate, kaia (custom step sequence),
clv, coin98, core, fox, kaikas, novaWallet, ronin, safepal, coin98, zeal,
ZilPay, bifrost, berasig, binance, xPortal.

WalletConnect-only: uniswap, bestWallet, bitverse, imToken (language-conditional),
kraken, kresus, meco, mew, okto, omni, oneInch, paraSwap, ready, valora.

Desktop-only deep-link: bloom.

Platform-split detection (Trust-style): trustWallet.

## Still hand-rolled (intentional)

- SDK-bound: `metaMaskWallet`, `coinbaseWallet`, `safeWallet`, `ledgerWallet`,
  `baseAccount`, `geminiWallet`, `portoWallet`, `walletConnectWallet`,
  `injectedWallet` — these use external SDK connectors.
- `argentWallet` — re-exports `readyWallet` with a different id.
- `ctrlWallet` — detect namespace `ctrl.ethereum` vs connect namespace
  `xfi.ethereum` (legacy XDEFI compat); factory enforces one.
- `iopayWallet` — custom user-agent sniff; semantically different from `isMobile()`.
- `universalProfilesWallet` — uses literal English strings instead of i18n keys.

Each of these is ~40-80 lines. Converting any of them would either lose
behavior or require a factory extension for a single wallet. Not worth the
factory surface.

## Personal engineering framework for this work

Common patterns I keep running. Codified here so I'm consistent:

- **After every non-trivial edit:** `cd /Users/mla/_greek/rainbow/rainbowkit && pnpm -s test 2>&1 | tail -10`
- **Never edit a wallet connector without grepping its usage** first. Several have cross-references.
- **When deleting a module:** grep for its export names everywhere before `rm`. The `enhancedProvider` was referenced from ENS hooks — that's the kind of thing that breaks silent type checks until someone calls it.
- **Commit after each green phase.** The tag `v0-baseline` is the rollback point.
- **Before refactoring a component, read it end-to-end.** Skimming misses the real coupling.
