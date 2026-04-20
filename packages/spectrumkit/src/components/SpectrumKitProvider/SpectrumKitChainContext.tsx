import React, {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { useConfig } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import { provideSpectrumKitChains } from './provideSpectrumKitChains';
import { useIsMounted } from './useIsMounted';

export interface SpectrumKitChain extends Chain {
  iconUrl?: string | (() => Promise<string>) | null;
  iconBackground?: string;
}

interface SpectrumKitChainContextValue {
  chains: SpectrumKitChain[];
  initialChainId?: number;
}

const SpectrumKitChainContext = createContext<SpectrumKitChainContextValue>({
  chains: [],
});

interface SpectrumKitChainProviderProps {
  initialChain?: Chain | number;
  children: ReactNode;
}

export function SpectrumKitChainProvider(props: SpectrumKitChainProviderProps) {
  // useConfig() throws WagmiProviderNotFoundError on SSR. Serve default
  // (empty) chains on server + first hydration; swap in real chains once
  // the client is mounted.
  const mounted = useIsMounted();
  if (!mounted) {
    return (
      <SpectrumKitChainContext.Provider
        value={{
          chains: [],
          initialChainId:
            typeof props.initialChain === 'number'
              ? props.initialChain
              : props.initialChain?.id,
        }}
      >
        {props.children}
      </SpectrumKitChainContext.Provider>
    );
  }
  return <SpectrumKitChainProviderClient {...props} />;
}

function SpectrumKitChainProviderClient({
  children,
  initialChain,
}: SpectrumKitChainProviderProps) {
  const { chains } = useConfig();

  return (
    <SpectrumKitChainContext.Provider
      value={useMemo(
        () => ({
          chains: provideSpectrumKitChains(chains),
          initialChainId:
            typeof initialChain === 'number' ? initialChain : initialChain?.id,
        }),
        [chains, initialChain],
      )}
    >
      {children}
    </SpectrumKitChainContext.Provider>
  );
}

export const useSpectrumKitChains = () =>
  useContext(SpectrumKitChainContext).chains;

export const useInitialChainId = () =>
  useContext(SpectrumKitChainContext).initialChainId;

export const useSpectrumKitChainsById = () => {
  const spectrumkitChains = useSpectrumKitChains();

  return useMemo(() => {
    const spectrumkitChainsById: Record<number, SpectrumKitChain> = {};

    for (const rkChain of spectrumkitChains) {
      spectrumkitChainsById[rkChain.id] = rkChain;
    }

    return spectrumkitChainsById;
  }, [spectrumkitChains]);
};
