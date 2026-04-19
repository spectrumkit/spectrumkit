import { createWallet } from '../../createWallet';

export const frameWallet = createWallet({
  id: 'frame',
  name: 'Frame',
  rdns: 'sh.frame',
  iconUrl: () => import('./frameWallet.svg').then((m) => m.default),
  iconBackground: '#121C20',
  detect: { flag: 'isFrame' },
  downloadUrls: {
    browserExtension: 'https://frame.sh/',
  },
  instructions: {
    extension: {
      learnMoreUrl:
        'https://docs.frame.sh/docs/Getting%20Started/Installation/',
    },
  },
});
