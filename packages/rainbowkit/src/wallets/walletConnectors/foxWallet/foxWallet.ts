import { createWallet } from '../../createWallet';

export const foxWallet = createWallet({
  id: 'foxwallet',
  i18nId: 'fox',
  name: 'FoxWallet',
  iconUrl: () => import('./foxWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { namespace: 'foxwallet.ethereum' },
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=com.foxwallet.play',
    ios: 'https://apps.apple.com/app/foxwallet-crypto-web3/id1590983231',
    qrCode: 'https://foxwallet.com/download',
  },
  mobileDeepLink: (uri) => `foxwallet://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://foxwallet.com' },
  },
});
