import { isAndroid } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

export const valoraWallet = createWallet({
  id: 'valora',
  name: 'Valora',
  iconUrl: () => import('./valoraWallet.svg').then((m) => m.default),
  iconBackground: '#FFFFFF',
  downloadUrls: {
    ios: 'https://apps.apple.com/app/id1520414263?mt=8',
    android: 'https://play.google.com/store/apps/details?id=co.clabs.valora',
    mobile: 'https://valora.xyz',
    qrCode: 'https://valora.xyz',
  },
  mobileDeepLink: (uri) =>
    isAndroid() ? uri : `celo://wallet/wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://valora.xyz/' },
  },
});
