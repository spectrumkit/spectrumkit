import { createWallet } from '../../createWallet';

export const berasigWallet = createWallet({
  id: 'berasig',
  name: 'BeraSig',
  rdns: 'app.berasig',
  iconUrl: () => import('./berasigWallet.svg').then((m) => m.default),
  iconBackground: '#ffffff',
  detect: { namespace: 'berasig.ethereum' },
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=io.berasig.ios',
    ios: 'https://apps.apple.com/us/app/berasig-wallet-on-berachain/id6502052535',
    qrCode: 'https://berasig.com',
    mobile: 'https://berasig.com',
    browserExtension:
      'https://chromewebstore.google.com/detail/berasig/ckedkkegjbflcfblcjklibnedmfjppbj',
  },
  instructions: {
    extension: { learnMoreUrl: 'https://berasig.com' },
  },
});
