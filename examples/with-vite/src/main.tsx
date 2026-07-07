import './global.css';
import '@spectrumkit/spectrumkit/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { SpectrumKitProvider } from '@spectrumkit/spectrumkit';

import App from './App';
import { config } from './wagmi';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SpectrumKitProvider>
          <App />
        </SpectrumKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
