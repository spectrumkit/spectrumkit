import { isAndroid, isIOS } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

const getUri = (uri: string) =>
  isAndroid()
    ? uri
    : isIOS()
      ? `rainbow://wc?uri=${encodeURIComponent(uri)}&connector=spectrumkit`
      : `https://rnbwapp.com/wc?uri=${encodeURIComponent(
          uri,
        )}&connector=spectrumkit`;

export const rainbowWallet = createWallet({
  id: 'rainbow',
  name: 'Rainbow',
  rdns: 'me.rainbow',
  iconUrl: () => import('./rainbowWallet.svg').then((m) => m.default),
  iconBackground: '#0c2f78',
  detect: { flag: 'isRainbow' },
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=me.rainbow&referrer=utm_source%3Dspectrumkit&utm_source=spectrumkit',
    ios: 'https://apps.apple.com/app/apple-store/id1457119021?pt=119997837&ct=spectrumkit&mt=8',
    mobile: 'https://rainbow.download?utm_source=spectrumkit',
    qrCode: 'https://rainbow.download?utm_source=spectrumkit&utm_medium=qrcode',
    browserExtension: 'https://rainbow.me/extension?utm_source=spectrumkit',
  },
  mobileDeepLink: getUri,
  qrUriTransform: getUri,
  instructions: {
    qrCode: {
      learnMoreUrl:
        'https://learn.rainbow.me/connect-to-a-website-or-app?utm_source=spectrumkit&utm_medium=connector&utm_campaign=learnmore',
    },
  },
});
