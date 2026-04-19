import { isSafari } from '../../../utils/browsers';
import { createWallet } from '../../createWallet';

export const tokenaryWallet = createWallet({
  id: 'tokenary',
  name: 'Tokenary',
  iconUrl: () => import('./tokenaryWallet.svg').then((m) => m.default),
  iconBackground: '#ffffff',
  detect: { flag: 'isTokenary' },
  hidden: () => !isSafari(),
  downloadUrls: {
    ios: 'https://tokenary.io/get',
    mobile: 'https://tokenary.io',
    qrCode: 'https://tokenary.io/get',
    safari: 'https://tokenary.io/get',
    browserExtension: 'https://tokenary.io/get',
  },
});
