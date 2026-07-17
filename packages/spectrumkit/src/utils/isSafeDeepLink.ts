// Defense-in-depth for wallet deep-link navigation.
//
// Deep-link URIs are handed to `window.open` / `location.href` / a detached
// <a>.click(). Most connectors build them from a fixed scheme plus an
// `encodeURIComponent`-escaped WalletConnect URI, but some (geminiWallet,
// iopayWallet) pass the URI through unchanged, so this guard is the only
// control on that path. It keeps the guarantee even if a custom or future
// connector returns a script-executing scheme.
//
// The URI is parsed before it is inspected. This matters: a browser strips
// leading C0 controls and *all* embedded tabs/newlines before resolving a
// scheme, so `"\x01javascript:"` and `"java\nscript:"` both navigate to
// `javascript:`. Matching a scheme against the raw string misses those;
// reading `URL.protocol` sees what the browser will actually act on.
//
// The scheme is then allowlisted by shape, with the script-executing schemes
// denied explicitly. An allowlist is used rather than a bare denylist so a
// scheme nobody thought of cannot slip through. Legitimate wallet schemes
// (`https:`, `wc:`, `zilpay:`, `bnc:`, `imtokenv2:`, ...) are unaffected.
const SCHEME_SHAPE = /^[a-z][a-z0-9+.-]*:$/;

const SCRIPTABLE_SCHEMES = new Set([
  'javascript:',
  'data:',
  'vbscript:',
  'blob:',
  'filesystem:',
  'view-source:',
]);

export function isSafeDeepLink(uri: string | undefined | null): uri is string {
  if (typeof uri !== 'string' || uri.length === 0) return false;

  let protocol: string;
  try {
    // Throws on relative URIs (e.g. `//evil.com`), which are never valid
    // deep links — a wallet URI always carries its own scheme.
    protocol = new URL(uri).protocol;
  } catch {
    return false;
  }

  return SCHEME_SHAPE.test(protocol) && !SCRIPTABLE_SCHEMES.has(protocol);
}
