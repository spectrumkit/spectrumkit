import { createWallet } from '../../createWallet';

export const oneKeyWallet = createWallet({
  id: 'onekey',
  i18nId: 'one_key',
  name: 'OneKey',
  rdns: 'so.onekey.app.wallet',
  iconAccent: '#00B812',
  iconBackground: '#fff',
  iconUrl: () => import('./oneKeyWallet.svg').then((m) => m.default),
  detect: { namespace: '$onekey.ethereum' },
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=so.onekey.app.wallet',
    browserExtension: 'https://www.onekey.so/download/',
    chrome:
      'https://chrome.google.com/webstore/detail/onekey/jnmbobjmhlngoefaiojfljckilhhlhcj',
    edge: 'https://microsoftedge.microsoft.com/addons/detail/onekey/obffkkagpmohennipjokmpllocnlndac',
    ios: 'https://apps.apple.com/us/app/onekey-open-source-wallet/id1609559473',
    mobile: 'https://www.onekey.so/download/',
    qrCode: 'https://www.onekey.so/download/',
  },
  instructions: {
    extension: {
      learnMoreUrl: 'https://help.onekey.so/hc/en-us/categories/360000170236',
    },
  },
});
