import { RainbowKitProvider, WalletButton } from '@spectrumkit/spectrumkit';
import type { RainbowKitProviderProps } from '@spectrumkit/spectrumkit/dist/components/RainbowKitProvider/RainbowKitProvider';
import React from 'react';

export function RainbowButtonProvider({
  children,
  ...options
}: Omit<
  RainbowKitProviderProps,
  'chains' | 'avatar' | 'initialChain' | 'modalSize' | 'showRecentTransactions'
>) {
  return <RainbowKitProvider {...options}>{children}</RainbowKitProvider>;
}

export const RainbowButton = () => {
  return <WalletButton wallet="rainbow" />;
};

RainbowButton.Custom = WalletButton.Custom;
