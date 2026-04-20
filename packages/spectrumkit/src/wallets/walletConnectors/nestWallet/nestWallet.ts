import { createWallet } from '../../createWallet';

export const nestWallet = createWallet({
  id: 'nest',
  i18nId: 'nestwallet',
  name: 'Nest',
  rdns: 'xyz.nestwallet',
  iconUrl: () => import('./nestWallet.svg').then((m) => m.default),
  iconBackground: '#fff0',
  detect: { flag: 'isNestWallet' },
  downloadUrls: {
    browserExtension: 'https://nestwallet.xyz',
  },
  instructions: {
    extension: { learnMoreUrl: 'https://nestwallet.xyz' },
  },
});
