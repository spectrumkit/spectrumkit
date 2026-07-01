'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { SpectrumKitProvider } from '@spectrumkit/spectrumkit';

import { config } from '../wagmi';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SpectrumKitProvider>{children}</SpectrumKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
