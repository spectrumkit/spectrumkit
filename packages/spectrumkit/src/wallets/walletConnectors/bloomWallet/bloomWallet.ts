import { createWallet } from '../../createWallet';

export const bloomWallet = createWallet({
  id: 'bloom',
  name: 'Bloom Wallet',
  iconAccent: '#000',
  iconBackground: '#000',
  iconUrl: () => import('./bloomWallet.svg').then((m) => m.default),
  downloadUrls: {
    desktop: 'https://bloomwallet.io/',
  },
  desktopDeepLink: (uri) =>
    `bloom://wallet-connect/wc?uri=${encodeURIComponent(uri)}`,
  instructions: {
    desktop: { learnMoreUrl: 'https://bloomwallet.io/' },
  },
});
