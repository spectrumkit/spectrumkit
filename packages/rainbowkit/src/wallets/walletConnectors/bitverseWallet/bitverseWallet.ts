import { createWallet } from '../../createWallet';

export const bitverseWallet = createWallet({
  id: 'bitverse',
  name: 'Bitverse Wallet',
  iconUrl: () => import('./bitverseWallet.svg').then((m) => m.default),
  iconBackground: '#171728',
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=com.bitverse.app&pli=1',
    ios: 'https://apps.apple.com/us/app/bitverse-discover-web3-wealth/id1645515614',
    qrCode: 'https://www.bitverse.zone/download',
  },
  mobileDeepLink: (uri) =>
    `bitverseapp://open/wallet/wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://www.bitverse.zone' },
  },
});
