import { isAndroid } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

const getUri = (uri: string) =>
  isAndroid()
    ? uri
    : `https://app.bifrostwallet.com/wc?uri=${encodeURIComponent(uri)}`;

export const bifrostWallet = createWallet({
  id: 'bifrostWallet',
  i18nId: 'bifrost',
  name: 'Bifrost Wallet',
  rdns: 'com.bifrostwallet',
  iconUrl: () => import('./bifrostWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { flag: 'isBifrost' },
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=com.bifrostwallet.app',
    ios: 'https://apps.apple.com/us/app/bifrost-wallet/id1577198351',
    qrCode: 'https://bifrostwallet.com/#download-app',
  },
  mobileDeepLink: getUri,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: {
      learnMoreUrl:
        'https://support.bifrostwallet.com/en/articles/6886814-how-to-use-walletconnect',
    },
  },
});
