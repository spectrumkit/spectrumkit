import { createWallet } from '../../createWallet';

export const kaiaWallet = createWallet({
  id: 'kaia',
  name: 'Kaia Wallet',
  iconUrl: () => import('./kaiaWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { namespace: 'klaytn' },
  downloadUrls: {
    chrome:
      'https://chromewebstore.google.com/detail/kaia-wallet/jblndlipeogpafnldhgmapagcccfchpi',
    browserExtension: 'https://app.kaiawallet.io',
    qrCode: 'https://app.kaiawallet.io',
    ios: 'https://apps.apple.com/us/app/kaia-wallet/id6502896387',
    android: 'https://play.google.com/store/apps/details?id=io.klutch.wallet',
    mobile: 'https://app.kaiawallet.io',
  },
  mobileDeepLink: (uri) =>
    `kaikas://walletconnect?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: {
      learnMoreUrl: 'https://kaiawallet.io',
      steps: ['install', 'create', 'refresh'],
    },
    extension: { learnMoreUrl: 'https://kaiawallet.io' },
  },
});
