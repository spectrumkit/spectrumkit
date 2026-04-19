import { createWallet } from '../../createWallet';

export const trustWallet = createWallet({
  id: 'trust',
  i18nId: 'trust',
  name: 'Trust Wallet',
  rdns: 'com.trustwallet.app',
  iconUrl: () => import('./trustWallet.svg').then((m) => m.default),
  iconAccent: '#3375BB',
  iconBackground: '#fff',
  // Trust Wallet uses different flags on mobile vs desktop.
  detect: {
    mobile: { flag: 'isTrust' },
    desktop: { flag: 'isTrustWallet' },
  },
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp',
    ios: 'https://apps.apple.com/us/app/trust-crypto-bitcoin-wallet/id1288339409',
    mobile: 'https://trustwallet.com/download',
    qrCode: 'https://trustwallet.com/download',
    chrome:
      'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
    browserExtension: 'https://trustwallet.com/browser-extension',
  },
  mobileDeepLink: (uri) => `trust://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://trustwallet.com/' },
    extension: { learnMoreUrl: 'https://trustwallet.com/browser-extension' },
  },
});
