import { createWallet } from '../../createWallet';

export const phantomWallet = createWallet({
  id: 'phantom',
  name: 'Phantom',
  rdns: 'app.phantom',
  iconUrl: () => import('./phantomWallet.svg').then((m) => m.default),
  iconBackground: '#9A8AEE',
  detect: { namespace: 'phantom.ethereum' },
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=app.phantom',
    ios: 'https://apps.apple.com/app/phantom-solana-wallet/1598432977',
    mobile: 'https://phantom.app/download',
    qrCode: 'https://phantom.app/download',
    chrome:
      'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
    firefox: 'https://addons.mozilla.org/firefox/addon/phantom-app/',
    browserExtension: 'https://phantom.app/download',
  },
  instructions: {
    extension: { learnMoreUrl: 'https://help.phantom.app' },
  },
});
