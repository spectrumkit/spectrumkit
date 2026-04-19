import { isAndroid } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

export const oktoWallet = createWallet({
  id: 'Okto',
  i18nId: 'okto',
  name: 'Okto',
  iconUrl: () => import('./oktoWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=im.okto.contractwalletclient',
    ios: 'https://apps.apple.com/in/app/okto-wallet/id6450688229',
    mobile: 'https://okto.tech/',
    qrCode: 'https://okto.tech/',
  },
  mobileDeepLink: (uri) =>
    isAndroid() ? uri : `okto://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://okto.tech/' },
  },
});
