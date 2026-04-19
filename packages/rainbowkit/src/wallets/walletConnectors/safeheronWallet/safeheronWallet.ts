import { createWallet } from '../../createWallet';

export const safeheronWallet = createWallet({
  id: 'safeheron',
  name: 'Safeheron',
  iconUrl: () => import('./safeheronWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { namespace: 'safeheron', flag: 'isSafeheron' },
  downloadUrls: {
    chrome:
      'https://chrome.google.com/webstore/detail/safeheron/aiaghdjafpiofpainifbgfgjfpclngoh',
    browserExtension: 'https://www.safeheron.com/',
  },
  instructions: {
    extension: { learnMoreUrl: 'https://www.safeheron.com/' },
  },
});
