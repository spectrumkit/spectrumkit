import { createWallet } from '../../createWallet';

export const roninWallet = createWallet({
  id: 'ronin',
  name: 'Ronin Wallet',
  rdns: 'com.roninchain.wallet',
  iconUrl: () => import('./roninWallet.svg').then((m) => m.default),
  iconBackground: '#ffffff',
  detect: { namespace: 'ronin.provider' },
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=com.skymavis.genesis',
    ios: 'https://apps.apple.com/us/app/ronin-wallet/id1592675001',
    mobile: 'https://wallet.roninchain.com',
    chrome:
      'https://chrome.google.com/webstore/detail/ronin-wallet/fnjhmkhhmkbjkkabndcnnogagogbneec',
    edge: 'https://microsoftedge.microsoft.com/addons/detail/ronin-wallet/kjmoohlgokccodicjjfebfomlbljgfhk',
    firefox: 'https://addons.mozilla.org/firefox/addon/ronin-wallet',
    browserExtension: 'https://wallet.roninchain.com/',
    qrCode: 'https://wallet.roninchain.com/',
  },
  mobileDeepLink: (uri) => `roninwallet://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://wallet.roninchain.com/' },
    extension: { learnMoreUrl: 'https://wallet.roninchain.com/' },
  },
});
