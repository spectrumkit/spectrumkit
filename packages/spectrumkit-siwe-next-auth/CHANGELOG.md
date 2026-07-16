# @spectrumkit/spectrumkit-siwe-next-auth

## 0.0.2

### Patch Changes

- Fix deep-link guard bypass, stylesheet tree-shaking, and a missing peer dependency.

  - **Harden `isSafeDeepLink` against URL normalization.** The guard matched a
    scheme denylist against the raw string, but a browser strips leading C0
    controls and _all_ embedded tabs/newlines before resolving a scheme. So
    `"\x01javascript:…"`, `"java\nscript:…"` and `"da\tta:text/html,…"` passed the
    guard and still executed as `javascript:` / `data:` at the `window.open` /
    `location.href` sinks. The URI is now parsed with `new URL()` first — so the
    normalization has already happened — and its `protocol` checked against a
    scheme-shape allowlist with the script-executing schemes denied. This also
    closes `blob:`, which the denylist never covered, and rejects relative URIs.
    Regression tests cover each bypass.

  - **Fix `sideEffects` so consumers keep the stylesheet.** The old
    `sideEffects: ["src/css/reset.css.ts"]` listed only a source path, which is not
    in the published tarball, so a consumer's bundler saw no side-effectful file and
    could tree-shake away `@spectrumkit/spectrumkit/styles.css`. Now declares
    `["src/css/reset.css.ts", "*.css", "dist/*.css"]`: the css globs protect the
    published stylesheet for consumers, and the `src/css/reset.css.ts` entry is
    retained because esbuild uses it during the library's own build to keep the CSS
    reset ordered first. Dropping that entry (an earlier iteration of this fix
    shipped `["*.css", "dist/*.css"]`) let the reset's `background: none` sort after
    the component rules and win the cascade, rendering the accent-colored
    ConnectButton transparent — caught by driving the example in a browser, not by
    the unit suite.

  - **Declare `viem` as a peer dependency of
    `@spectrumkit/spectrumkit-siwe-next-auth`.** The package imports
    `createSiweMessage` from `viem/siwe` at runtime but never declared `viem`.
    It resolved by hoisting alone, and failed under strict resolvers (Yarn PnP,
    pnpm without hoisting).

  - **Stop shipping broken types silently.** `typegen` ran `tsc
--emitDeclarationOnly || true` in both packages, which swallows type errors
    while `tsc` still emits `.d.ts`. Dropped the `|| true`.

  - Add `types` to the `wallets` subpath proxy so `@spectrumkit/spectrumkit/wallets`
    resolves types under `moduleResolution: node10`.

  - Remove the unused `@gemini-wallet/core` dependency. The Gemini connector is
    implemented via `getInjectedConnector` and never imported the SDK.

  - Rewrite `@spectrumkit/spectrumkit-siwe-next-auth`'s README, which documented
    `RainbowKitSiweNextAuthProvider` / `RainbowKitProvider` / wagmi v1's
    `WagmiConfig` — none of which exist. It now matches the real API and documents
    the required server-side `authorize()` verification (domain, nonce, and
    signature checks), on which every security guarantee of the SIWE flow depends.

- fdda1a0: Security & supply-chain hardening.

  - **Drop deprecated `@metamask/sdk`**, replace with the maintained
    `@metamask/connect-evm@^2.1.0` that wagmi v8's `metaMask` connector actually
    requires (it was declared as an optional peer but never installed). Updated
    the MetaMask connector to the wagmi 8 / connect-evm parameter API
    (`ui.headless`, `analytics.enabled`; removed the obsolete
    `checkInstallationImmediately`).
  - **Remove `ua-parser-js`** (single-maintainer package with a prior npm
    account-takeover incident). Its only use — OS detection in `platforms.ts` —
    is now done via native `navigator.userAgent` parsing with identical behavior,
    eliminating the dependency entirely.
  - **Harden wallet deep-link navigation**: guard the `getMobileUri` /
    `getDesktopUri` sinks against script-executing schemes (`javascript:`,
    `data:`, `vbscript:`) via a new `isSafeDeepLink` check before `window.open` /
    `location.href` navigation. Defense-in-depth for custom connectors;
    legitimate wallet schemes are unaffected.
  - **Fix `@spectrumkit/spectrumkit-siwe-next-auth`'s peer dependency** on
    `@spectrumkit/spectrumkit`, which pinned a stale `2.2.x` range that no
    published version satisfies, to `0.0.x`.
