import { getDefaultConfig } from '@spectrumkit/spectrumkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
});
