import { createWallet } from '../../createWallet';

export const uniswapWallet = createWallet({
  id: 'uniswap',
  name: 'Uniswap Wallet',
  iconUrl: () => import('./uniswapWallet.svg').then((m) => m.default),
  iconBackground: '#FFD8EA',
  // No injected detection — this is a WalletConnect-only mobile wallet.
  downloadUrls: {
    ios: 'https://apps.apple.com/app/apple-store/id6443944476',
    mobile: 'https://wallet.uniswap.org/',
    qrCode: 'https://wallet.uniswap.org/',
  },
  mobileDeepLink: (uri) => `uniswap://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://wallet.uniswap.org/' },
  },
});
