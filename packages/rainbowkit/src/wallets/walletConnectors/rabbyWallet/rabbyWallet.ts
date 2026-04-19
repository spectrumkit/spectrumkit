import { createWallet } from '../../createWallet';

export const rabbyWallet = createWallet({
  id: 'rabby',
  name: 'Rabby Wallet',
  rdns: 'io.rabby',
  iconUrl: () => import('./rabbyWallet.svg').then((m) => m.default),
  iconBackground: '#8697FF',
  detect: { flag: 'isRabby' },
  downloadUrls: {
    chrome:
      'https://chrome.google.com/webstore/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch',
    browserExtension: 'https://rabby.io',
  },
  instructions: {
    extension: { learnMoreUrl: 'https://rabby.io/' },
  },
});
