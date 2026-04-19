import { createWallet } from '../../createWallet';

export const subWallet = createWallet({
  id: 'subwallet',
  name: 'SubWallet',
  rdns: 'app.subwallet',
  iconUrl: () => import('./subWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { namespace: 'SubWallet' },
  downloadUrls: {
    browserExtension: 'https://www.subwallet.app/download',
    chrome:
      'https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/subwallet/',
    edge: 'https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
    mobile: 'https://www.subwallet.app/download',
    android:
      'https://play.google.com/store/apps/details?id=app.subwallet.mobile',
    ios: 'https://apps.apple.com/us/app/subwallet-polkadot-wallet/id1633050285',
    qrCode: 'https://www.subwallet.app/download',
  },
  mobileDeepLink: (uri) => `subwallet://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://www.subwallet.app/' },
    extension: { learnMoreUrl: 'https://www.subwallet.app/' },
  },
});
