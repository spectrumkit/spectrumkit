import { createWallet } from '../../createWallet';

export const coin98Wallet = createWallet({
  id: 'coin98',
  name: 'Coin98 Wallet',
  rdns: 'com.coin98',
  iconUrl: () => import('./coin98Wallet.svg').then((m) => m.default),
  iconAccent: '#CDA349',
  iconBackground: '#fff',
  detect: { namespace: 'coin98.provider', flag: 'isCoin98' },
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=coin98.crypto.finance.media',
    ios: 'https://apps.apple.com/vn/app/coin98-super-app/id1561969966',
    mobile: 'https://coin98.com/wallet',
    qrCode: 'https://coin98.com/wallet',
    chrome:
      'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
    browserExtension: 'https://coin98.com/wallet',
  },
  mobileDeepLink: (uri) => uri,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://coin98.com/wallet' },
    extension: { learnMoreUrl: 'https://coin98.com/wallet' },
  },
});
