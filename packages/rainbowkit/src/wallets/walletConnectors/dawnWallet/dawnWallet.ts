import { isIOS } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

export const dawnWallet = createWallet({
  id: 'dawn',
  name: 'Dawn',
  iconUrl: () => import('./dawnWallet.svg').then((m) => m.default),
  iconBackground: '#000000',
  detect: { flag: 'isDawn' },
  hidden: () => !isIOS(),
  downloadUrls: {
    ios: 'https://apps.apple.com/us/app/dawn-ethereum-wallet/id1673143782',
    mobile: 'https://dawnwallet.xyz',
  },
});
