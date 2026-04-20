import { createWallet } from '../../createWallet';

export const backpackWallet = createWallet({
  id: 'backpack',
  name: 'Backpack',
  rdns: 'app.backpack.mobile',
  iconUrl: () => import('./backpackWallet.svg').then((m) => m.default),
  iconBackground: '#ffffff',
  detect: { namespace: 'backpack.ethereum' },
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=app.backpack.mobile',
    browserExtension: 'https://backpack.app/download',
    chrome:
      'https://chromewebstore.google.com/detail/backpack/aflkmfhebedbjioipglgcbcmnbpgliof',
    ios: 'https://apps.apple.com/app/backpack-wallet-exchange/id6445964121',
    mobile: 'https://backpack.app/download',
    qrCode: 'https://backpack.app/download',
  },
  instructions: {
    extension: {
      learnMoreUrl: 'https://support.backpack.exchange/support/wallet',
    },
  },
});
