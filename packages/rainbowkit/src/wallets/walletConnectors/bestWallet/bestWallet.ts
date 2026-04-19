import { createWallet } from '../../createWallet';

export const bestWallet = createWallet({
  id: 'bestWallet',
  i18nId: 'best',
  name: 'Best Wallet',
  iconUrl: () => import('./bestWallet.svg').then((m) => m.default),
  iconBackground: '#5961FF',
  downloadUrls: {
    android: 'https://best.sng.link/Dnio2/rto7?_smtype=3',
    ios: 'https://best.sng.link/Dnio2/rto7?_smtype=3',
    mobile: 'https://best.sng.link/Dnio2/rto7?_smtype=3',
    qrCode: 'https://best.sng.link/Dnio2/rto7?_smtype=3',
  },
  mobileDeepLink: (uri) => `bw://connect/wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://best.sng.link/Dnio2/rto7?_smtype=3' },
  },
});
