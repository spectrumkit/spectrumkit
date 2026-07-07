---
"@spectrumkit/spectrumkit": patch
"@spectrumkit/spectrumkit-siwe-next-auth": patch
---

Security & supply-chain hardening.

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
