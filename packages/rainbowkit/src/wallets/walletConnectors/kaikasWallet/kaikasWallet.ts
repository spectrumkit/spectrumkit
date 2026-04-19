import { createWallet } from '../../createWallet';

export const kaikasWallet = createWallet({
  id: 'kaikas',
  name: 'Kaikas Wallet',
  iconUrl: () => import('./kaikasWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { namespace: 'klaytn' },
  downloadUrls: {
    chrome:
      'https://chromewebstore.google.com/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi',
    browserExtension: 'https://app.kaikas.io',
    qrCode: 'https://app.kaikas.io',
    ios: 'https://apps.apple.com/us/app/kaikas-mobile-crypto-wallet/id1626107061',
    android: 'https://play.google.com/store/apps/details?id=io.klutch.wallet',
    mobile: 'https://app.kaikas.io',
  },
  mobileDeepLink: (uri) =>
    `kaikas://walletconnect?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: {
      learnMoreUrl: 'https://kaikas.io',
      steps: ['install', 'create', 'refresh'],
    },
    extension: { learnMoreUrl: 'https://kaikas.io' },
  },
});
