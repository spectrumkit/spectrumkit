<p align="center">
  <img src="assets/spectrumkit-icon.svg" width="128" height="128" alt="SpectrumKit logo" />
</p>

# SpectrumKit &nbsp; [![Version](https://img.shields.io/npm/v/@spectrumkit/spectrumkit?colorA=1f2937&colorB=3b82f6&labelColor=1f2937)](https://www.npmjs.com/package/@spectrumkit/spectrumkit)

> Forked from [rainbow-me/rainbowkit](https://github.com/rainbow-me/rainbowkit). Adds wagmi v3 support, a `createWallet()` factory that collapses the wallet-connector boilerplate, and an aggressive simplification pass. Original copyright preserved in `LICENSE`.

**The best way to connect a wallet**

SpectrumKit is a [React](https://reactjs.org/) library that makes it easy to add wallet connection to your dapp.

- 🔥 Out-of-the-box wallet management
- ✅ Easily customizable
- 🦄 Built on top of [wagmi](https://wagmi.sh) and [viem](https://viem.sh)

## Quick start

Install SpectrumKit and its peer dependencies:

```bash
npm install @spectrumkit/spectrumkit wagmi viem @tanstack/react-query
```

Wrap your app with the providers and drop in a `ConnectButton`. Get a free
WalletConnect `projectId` from [WalletConnect Cloud](https://cloud.walletconnect.com):

```tsx
import '@spectrumkit/spectrumkit/styles.css';

import {
  ConnectButton,
  SpectrumKitProvider,
  getDefaultConfig,
} from '@spectrumkit/spectrumkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'My dApp',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [mainnet],
});
const queryClient = new QueryClient();

export function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SpectrumKitProvider>
          <ConnectButton />
        </SpectrumKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Try it out

- **Live demo:** [spectrumkit.github.io/spectrumkit](https://spectrumkit.github.io/spectrumkit/)
- **Runnable examples:** see the [`examples/`](./examples/) folder in this repo.

SpectrumKit is built on [wagmi](https://wagmi.sh) and [viem](https://viem.sh); their
docs cover the underlying hooks and configuration.

## Examples

The following examples are provided in the [examples](./examples/) folder of this repo.

- `with-next-app` — Next.js App Router
- `with-vite` — Vite + React

### Running examples

To run an example locally, install dependencies.

```bash
pnpm install
```

Then go into an example directory, eg: `with-vite`.

```bash
cd examples/with-vite
```

Then run the dev script.

```bash
pnpm run dev
```

## Contributing

Please follow our [contributing guidelines](/.github/CONTRIBUTING.md).

## License

Licensed under the MIT License, Copyright © 2022-present [Rainbow](https://rainbow.me).

See [LICENSE](/LICENSE) for more information.
