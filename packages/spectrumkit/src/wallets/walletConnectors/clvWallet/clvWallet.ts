import { createWallet } from '../../createWallet';

export const clvWallet = createWallet({
  id: 'clv',
  name: 'CLV',
  iconUrl: () => import('./clvWallet.svg').then((m) => m.default),
  iconAccent: '#BDFDE2',
  iconBackground: '#fff',
  detect: { namespace: 'clover' },
  downloadUrls: {
    chrome:
      'https://chrome.google.com/webstore/detail/clv-wallet/nhnkbkgjikgcigadomkphalanndcapjk',
    ios: 'https://apps.apple.com/app/clover-wallet/id1570072858',
    mobile: 'https://apps.apple.com/app/clover-wallet/id1570072858',
    qrCode: 'https://clv.org/',
  },
  mobileDeepLink: (uri) => uri,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://clv.org/' },
    extension: { learnMoreUrl: 'https://clv.org/' },
  },
});
