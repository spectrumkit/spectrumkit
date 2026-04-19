import { isIOS } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

const getUri = (uri: string) =>
  isIOS() ? `xportal://wc?uri=${encodeURIComponent(uri)}` : uri;

export const xPortalWallet = createWallet({
  id: 'xportal',
  name: 'xPortal',
  rdns: 'com.elrond.maiar.wallet',
  iconUrl: () => import('./xPortalWallet.svg').then((m) => m.default),
  iconAccent: '#23f7dd',
  iconBackground: '#23f7dd',
  detect: { flag: 'isxPortal' },
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=com.elrond.maiar.wallet',
    ios: 'https://apps.apple.com/us/app/xportal-btc-crypto-wallet/id1519405832',
    qrCode: 'https://xportal.com/app',
  },
  mobileDeepLink: getUri,
  qrUriTransform: getUri,
  instructions: {
    qrCode: {
      learnMoreUrl:
        'https://help.xportal.com/en/articles/7038000-register-create-account',
    },
  },
});
