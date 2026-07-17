import './global.css';
import '@spectrumkit/spectrumkit/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import App from './App';
import { config } from './wagmi';

const queryClient = new QueryClient();

// SpectrumKitProvider lives inside App so the showcase can swap its theme prop.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
