import { createWallet } from '../../createWallet';

// MEW Wallet uses associated domain instead of a url scheme.
const getUri = (uri: string) =>
  `https://mewwallet.com/wc?uri=${encodeURIComponent(uri)}`;

export const mewWallet = createWallet({
  id: 'mew',
  name: 'MEW wallet',
  iconUrl: () => import('./mewWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { flag: 'isMEWwallet' },
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet&referrer=utm_source%3Drainbow',
    ios: 'https://apps.apple.com/app/apple-store/id1464614025?pt=118781877&mt=8&ct=rainbow',
    mobile: 'https://mewwallet.com',
    qrCode: 'https://mewwallet.com',
  },
  mobileDeepLink: getUri,
  qrUriTransform: getUri,
  instructions: {
    qrCode: {
      learnMoreUrl:
        'https://help.myetherwallet.com/en/articles/5946588-create-and-back-up-your-wallet-with-mew-wallet-ios',
    },
  },
});
