import { createWallet } from '../../createWallet';

export const kresusWallet = createWallet({
  id: 'kresus-wallet',
  i18nId: 'kresus',
  name: 'Kresus Wallet',
  iconUrl: () => import('./kresusWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=com.kresus.superapp',
    ios: 'https://apps.apple.com/us/app/kresus-crypto-nft-superapp/id6444355152',
    qrCode: 'https://kresusconnect.kresus.com/download',
  },
  mobileDeepLink: (uri) =>
    `com.kresus.superapp://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://kresus.com/' },
  },
});
