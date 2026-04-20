import { createWallet } from '../../createWallet';

export const braveWallet = createWallet({
  id: 'brave',
  name: 'Brave Wallet',
  rdns: 'com.brave.wallet',
  iconUrl: () => import('./braveWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { flag: 'isBraveWallet' },
  // Intentionally no download prompt — users either have Brave or they don't.
});
