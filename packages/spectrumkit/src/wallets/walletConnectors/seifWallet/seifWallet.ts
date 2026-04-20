import { createWallet } from '../../createWallet';

export const seifWallet = createWallet({
  id: 'seif',
  name: 'Seif',
  rdns: 'com.passkeywallet.seif',
  iconUrl: () => import('./seifWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { namespace: '__seif' },
  downloadUrls: {
    chrome:
      'https://chromewebstore.google.com/detail/seif/albakdmmdafeafbehmcpoejenbeojejl',
  },
});
