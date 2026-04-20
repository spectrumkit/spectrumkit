import { createWallet } from '../../createWallet';

export const safepalWallet = createWallet({
  id: 'safepal',
  name: 'SafePal Wallet',
  iconUrl: () => import('./safepalWallet.svg').then((m) => m.default),
  iconAccent: '#3375BB',
  iconBackground: '#fff',
  detect: { namespace: 'safepalProvider', flag: 'isSafePal' },
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=io.safepal.wallet&referrer=utm_source%3Dspectrumkit%26utm_medium%3Ddisplay%26utm_campaign%3Ddownload',
    ios: 'https://apps.apple.com/app/apple-store/id1548297139?pt=122504219&ct=spectrumkit&mt=8',
    mobile: 'https://www.safepal.com/en/download',
    qrCode: 'https://www.safepal.com/en/download',
    chrome:
      'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
    browserExtension: 'https://www.safepal.com/download?product=2',
  },
  mobileDeepLink: (uri) => `safepalwallet://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://safepal.com/' },
    extension: { learnMoreUrl: 'https://www.safepal.com/download?product=2' },
  },
});
