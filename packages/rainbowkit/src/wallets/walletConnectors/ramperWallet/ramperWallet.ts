import { createWallet } from '../../createWallet';

export const ramperWallet = createWallet({
  id: 'ramper',
  name: 'Ramper Wallet',
  iconUrl: () => import('./ramperWallet.svg').then((m) => m.default),
  iconAccent: '#CDA349',
  iconBackground: '#fff',
  detect: { namespace: 'ramper2.provider' },
  downloadUrls: {
    chrome:
      'https://chromewebstore.google.com/detail/ramper-wallet/nbdhibgjnjpnkajaghbffjbkcgljfgdi',
    browserExtension: 'https://www.ramper.xyz/download',
  },
  instructions: {
    extension: { learnMoreUrl: 'https://www.ramper.xyz' },
  },
});
