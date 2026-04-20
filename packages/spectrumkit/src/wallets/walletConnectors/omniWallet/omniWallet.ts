import { isAndroid } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

export const omniWallet = createWallet({
  id: 'omni',
  name: 'Omni',
  iconUrl: () => import('./omniWallet.svg').then((m) => m.default),
  iconBackground: '#000',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=fi.steakwallet.app',
    ios: 'https://itunes.apple.com/us/app/id1569375204',
    mobile: 'https://omniwallet.app.link',
    qrCode: 'https://omniwallet.app.link',
  },
  mobileDeepLink: (uri) =>
    isAndroid() ? uri : `omni://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://omni.app/support' },
  },
});
