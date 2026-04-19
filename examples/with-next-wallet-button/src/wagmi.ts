import { connectorsForWallets } from '@spectrumkit/spectrumkit';
import { rainbowWallet, readyWallet } from '@spectrumkit/spectrumkit/wallets';
import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { baseAccount, metaMask } from 'wagmi/connectors';

const projectId = 'YOUR_PROJECT_ID';
const appName = 'RainbowKit demo';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [rainbowWallet, readyWallet],
    },
  ],
  {
    projectId,
    appName,
  },
);

export const config = createConfig({
  connectors: [
    ...connectors,
    metaMask({
      dappMetadata: { name: appName },
    }),
    baseAccount({
      appName,
    }),
  ],
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  multiInjectedProviderDiscovery: false,
  ssr: true,
});
