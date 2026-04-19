import { isAndroid } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

export const okxWallet = createWallet({
  id: 'okx',
  name: 'OKX Wallet',
  rdns: 'com.okex.wallet',
  iconUrl: () => import('./okxWallet.svg').then((m) => m.default),
  iconAccent: '#000',
  iconBackground: '#000',
  detect: { namespace: 'okxwallet' },
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=com.okinc.okex.gp',
    ios: 'https://itunes.apple.com/app/id1327268470?mt=8',
    mobile: 'https://okx.com/download',
    qrCode: 'https://okx.com/download',
    chrome:
      'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
    edge: 'https://microsoftedge.microsoft.com/addons/detail/okx-wallet/pbpjkcldjiffchgbbndmhojiacbgflha',
    firefox: 'https://addons.mozilla.org/firefox/addon/okexwallet/',
    browserExtension: 'https://okx.com/download',
  },
  mobileDeepLink: (uri) =>
    isAndroid() ? uri : `okex://main/wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://okx.com/web3/' },
    extension: { learnMoreUrl: 'https://okx.com/web3/' },
  },
});
