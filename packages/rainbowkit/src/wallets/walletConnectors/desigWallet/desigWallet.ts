import { createWallet } from '../../createWallet';

export const desigWallet = createWallet({
  id: 'desig',
  name: 'Desig Wallet',
  iconUrl: () => import('./desigWallet.svg').then((m) => m.default),
  iconBackground: '#ffffff',
  detect: { namespace: 'desig.ethereum' },
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=io.desig.app',
    ios: 'https://apps.apple.com/app/desig-wallet/id6450106028',
    qrCode: 'https://desig.io',
    mobile: 'https://desig.io',
    browserExtension:
      'https://chrome.google.com/webstore/detail/desig-wallet/panpgppehdchfphcigocleabcmcgfoca',
  },
  instructions: {
    extension: { learnMoreUrl: 'https://desig.io' },
  },
});
