import { createWallet } from '../../createWallet';

export const mecoWallet = createWallet({
  id: 'meco',
  name: 'MeCo Wallet',
  rdns: 'com.meco.wallet',
  iconUrl: () => import('./mecoWallet.svg').then((m) => m.default),
  iconBackground: '#7443DF',
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=com.memecore.wallet',
    ios: 'https://apps.apple.com/us/app/meco-wallet/id6749523218',
    mobile: 'https://mecowallet.com',
    chrome: 'https://mecowallet.com',
    qrCode: 'https://mecowallet.com',
  },
  mobileDeepLink: (uri) => `mecowallet://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://mecowallet.com/' },
  },
});
