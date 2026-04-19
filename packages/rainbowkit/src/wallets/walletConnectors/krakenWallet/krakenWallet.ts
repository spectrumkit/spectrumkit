import { createWallet } from '../../createWallet';

export const krakenWallet = createWallet({
  id: 'kraken',
  name: 'Kraken Wallet',
  iconUrl: () => import('./krakenWallet.svg').then((m) => m.default),
  iconBackground: '#FFD8EA',
  downloadUrls: {
    ios: 'https://apps.apple.com/us/app/kraken-wallet/id1626327149',
    mobile: 'https://kraken.com/wallet',
    qrCode: 'https://kraken.com/wallet',
  },
  mobileDeepLink: (uri) => `krakenwallet://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://kraken.com/wallet' },
  },
});
