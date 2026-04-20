import { isAndroid } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

const getUri = (uri: string) =>
  isAndroid() ? `frontier://wc?uri=${encodeURIComponent(uri)}` : uri;

export const frontierWallet = createWallet({
  id: 'frontier',
  name: 'Frontier Wallet',
  rdns: 'xyz.frontier.wallet',
  iconUrl: () => import('./frontierWallet.svg').then((m) => m.default),
  iconBackground: '#CC703C',
  detect: { namespace: 'frontier.ethereum', flag: 'isFrontier' },
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=com.frontierwallet',
    ios: 'https://apps.apple.com/us/app/frontier-crypto-defi-wallet/id1482380988',
    qrCode: 'https://www.frontier.xyz/download',
    chrome:
      'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
    browserExtension: 'https://www.frontier.xyz/download',
  },
  mobileDeepLink: getUri,
  qrUriTransform: getUri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://help.frontier.xyz/en/' },
    extension: {
      learnMoreUrl:
        'https://help.frontier.xyz/en/articles/6967236-setting-up-frontier-on-your-device',
    },
  },
});
