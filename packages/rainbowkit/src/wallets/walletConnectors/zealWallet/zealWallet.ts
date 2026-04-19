import { createWallet } from '../../createWallet';

export const zealWallet = createWallet({
  id: 'zeal',
  name: 'Zeal',
  rdns: 'app.zeal',
  iconUrl: () => import('./zealWallet.svg').then((m) => m.default),
  iconAccent: '#00FFFF',
  iconBackground: '#fff0',
  detect: { flag: 'isZeal' },
  downloadUrls: {
    browserExtension: 'https://zeal.app',
    chrome:
      'https://chromewebstore.google.com/detail/zeal-wallet/heamnjbnflcikcggoiplibfommfbkjpj',
    android: 'https://play.google.com/store/apps/details?id=app.zeal.wallet',
    ios: 'https://testflight.apple.com/join/MP72Ytw8',
    mobile: 'https://zeal.app',
    qrCode: 'https://zeal.app',
  },
  mobileDeepLink: (uri) => `zeal://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://zeal.app' },
    extension: { learnMoreUrl: 'https://zeal.app' },
  },
});
