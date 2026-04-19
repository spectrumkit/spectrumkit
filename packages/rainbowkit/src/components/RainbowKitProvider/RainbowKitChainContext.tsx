import React, {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { useConfig } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import { provideRainbowKitChains } from './provideRainbowKitChains';
import { useIsMounted } from './useIsMounted';

export interface RainbowKitChain extends Chain {
  iconUrl?: string | (() => Promise<string>) | null;
  iconBackground?: string;
}

interface RainbowKitChainContextValue {
  chains: RainbowKitChain[];
  initialChainId?: number;
}

const RainbowKitChainContext = createContext<RainbowKitChainContextValue>({
  chains: [],
});

interface RainbowKitChainProviderProps {
  initialChain?: Chain | number;
  children: ReactNode;
}

export function RainbowKitChainProvider(props: RainbowKitChainProviderProps) {
  // useConfig() throws WagmiProviderNotFoundError on SSR. Serve default
  // (empty) chains on server + first hydration; swap in real chains once
  // the client is mounted.
  const mounted = useIsMounted();
  if (!mounted) {
    return (
      <RainbowKitChainContext.Provider
        value={{
          chains: [],
          initialChainId:
            typeof props.initialChain === 'number'
              ? props.initialChain
              : props.initialChain?.id,
        }}
      >
        {props.children}
      </RainbowKitChainContext.Provider>
    );
  }
  return <RainbowKitChainProviderClient {...props} />;
}

function RainbowKitChainProviderClient({
  children,
  initialChain,
}: RainbowKitChainProviderProps) {
  const { chains } = useConfig();

  return (
    <RainbowKitChainContext.Provider
      value={useMemo(
        () => ({
          chains: provideRainbowKitChains(chains),
          initialChainId:
            typeof initialChain === 'number' ? initialChain : initialChain?.id,
        }),
        [chains, initialChain],
      )}
    >
      {children}
    </RainbowKitChainContext.Provider>
  );
}

export const useRainbowKitChains = () =>
  useContext(RainbowKitChainContext).chains;

export const useInitialChainId = () =>
  useContext(RainbowKitChainContext).initialChainId;

export const useRainbowKitChainsById = () => {
  const rainbowkitChains = useRainbowKitChains();

  return useMemo(() => {
    const rainbowkitChainsById: Record<number, RainbowKitChain> = {};

    for (const rkChain of rainbowkitChains) {
      rainbowkitChainsById[rkChain.id] = rkChain;
    }

    return rainbowkitChainsById;
  }, [rainbowkitChains]);
};
