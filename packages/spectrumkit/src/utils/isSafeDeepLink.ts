// Defense-in-depth for wallet deep-link navigation.
//
// Deep-link URIs are handed to `window.open` / `location.href` / a detached
// <a>.click(). Today every connector builds them from a fixed scheme plus an
// `encodeURIComponent`-escaped WalletConnect URI, so they are safe. This guard
// keeps that guarantee even if a custom or future connector returns a
// script-executing scheme: `javascript:`, `data:`, and `vbscript:` are the
// schemes that can run code from these sinks. Legitimate wallet schemes
// (`https:`, `zilpay:`, `bnc:`, `imtokenv2:`, ...) are unaffected.
const DANGEROUS_SCHEME = /^\s*(javascript|data|vbscript):/i;

export function isSafeDeepLink(uri: string | undefined | null): uri is string {
  return (
    typeof uri === 'string' && uri.length > 0 && !DANGEROUS_SCHEME.test(uri)
  );
}
