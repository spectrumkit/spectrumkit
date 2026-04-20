import { useEffect, useState } from 'react';

/**
 * Returns true only after the first client render. Use to gate hooks that
 * require a browser-only context (e.g. wagmi's WagmiProvider) so SSR doesn't
 * throw WagmiProviderNotFoundError. We use useState+useEffect rather than
 * useSyncExternalStore because the latter behaves inconsistently under
 * React 19 hydration in test environments.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
