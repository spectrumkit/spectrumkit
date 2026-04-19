import { createWallet } from '../../createWallet';

export const wigwamWallet = createWallet({
  id: 'wigwam',
  name: 'Wigwam',
  rdns: 'com.wigwam.wallet',
  iconBackground: '#80EF6E',
  iconUrl: () => import('./wigwamWallet.svg').then((m) => m.default),
  detect: { namespace: 'wigwamEthereum', flag: 'isWigwam' },
  downloadUrls: {
    chrome:
      'https://chromewebstore.google.com/detail/wigwam-%E2%80%94-web3-wallet/lccbohhgfkdikahanoclbdmaolidjdfl',
    browserExtension: 'https://wigwam.app',
  },
  instructions: {
    extension: { learnMoreUrl: 'https://wigwam.app/' },
  },
});
