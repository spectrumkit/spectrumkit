import { isIOS } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

const getUri = (uri: string) =>
  isIOS() ? `zerion://wc?uri=${encodeURIComponent(uri)}` : uri;

export const zerionWallet = createWallet({
  id: 'zerion',
  name: 'Zerion',
  rdns: 'io.zerion.wallet',
  iconUrl: () => import('./zerionWallet.svg').then((m) => m.default),
  iconAccent: '#2962ef',
  iconBackground: '#2962ef',
  detect: { namespace: 'zerionWallet', flag: 'isZerion' },
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=io.zerion.android',
    ios: 'https://apps.apple.com/app/apple-store/id1456732565',
    mobile: 'https://link.zerion.io/pt3gdRP0njb',
    qrCode: 'https://link.zerion.io/pt3gdRP0njb',
    chrome:
      'https://chrome.google.com/webstore/detail/klghhnkeealcohjjanjjdaeeggmfmlpl',
    browserExtension: 'https://zerion.io/extension',
  },
  mobileDeepLink: getUri,
  qrUriTransform: getUri,
  instructions: {
    qrCode: {
      learnMoreUrl:
        'https://zerion.io/blog/announcing-the-zerion-smart-wallet/',
    },
    extension: { learnMoreUrl: 'https://help.zerion.io/en/' },
  },
});
