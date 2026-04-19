import { createWallet } from '../../createWallet';

export const magicEdenWallet = createWallet({
  id: 'magicEden',
  name: 'Magic Eden Wallet',
  rdns: 'io.magiceden.wallet',
  iconUrl: () => import('./magicEden.svg').then((m) => m.default),
  iconBackground: '#36114D',
  detect: { namespace: 'magicEden.ethereum' },
  downloadUrls: {
    chrome:
      'https://chromewebstore.google.com/detail/magic-eden-wallet/mkpegjkblkkefacfnmkajcjmabijhclg',
    browserExtension: 'https://wallet.magiceden.io/',
  },
  instructions: {
    extension: { learnMoreUrl: 'https://wallet.magiceden.io/support' },
  },
});
