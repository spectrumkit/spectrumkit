import { createWallet } from '../../createWallet';

export const oneInchWallet = createWallet({
  id: '1inch',
  name: '1inch Wallet',
  iconUrl: () => import('./oneInchWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=io.oneinch.android',
    ios: 'https://apps.apple.com/us/app/1inch-crypto-defi-wallet/id1546049391',
    mobile: 'https://1inch.io/wallet',
    qrCode: 'https://1inch.io/wallet',
  },
  mobileDeepLink: (uri) => `oneinch://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://1inch.io/wallet' },
  },
});
