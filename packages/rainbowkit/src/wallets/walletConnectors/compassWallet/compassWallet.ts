import { createWallet } from '../../createWallet';

export const compassWallet = createWallet({
  id: 'compass',
  name: 'Compass Wallet',
  rdns: 'io.leapwallet.CompassWallet',
  iconUrl: () => import('./compassWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { namespace: 'compassEvm' },
  downloadUrls: {
    chrome:
      'https://chromewebstore.google.com/detail/compass-wallet-for-sei/anokgmphncpekkhclmingpimjmcooifb',
    browserExtension: 'https://compasswallet.io/download',
  },
  instructions: {
    extension: { learnMoreUrl: 'https://compasswallet.io/download' },
  },
});
