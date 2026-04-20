import type { DefaultWalletOptions } from '../../Wallet';
import { isAndroid } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

export type ReadyWalletOptions = DefaultWalletOptions;

export const readyWallet = createWallet({
  id: 'ready',
  name: 'Ready',
  iconUrl: () => import('./readyWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=im.argent.contractwalletclient',
    ios: 'https://apps.apple.com/us/app/argent/id1358741926',
    mobile: 'https://www.ready.co/app',
    qrCode: 'https://www.ready.co/app',
  },
  mobileDeepLink: (uri) =>
    isAndroid() ? uri : `argent://app/wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://www.ready.co/' },
  },
});
