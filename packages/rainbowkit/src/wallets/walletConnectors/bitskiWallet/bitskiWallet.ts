import { createWallet } from '../../createWallet';

export const bitskiWallet = createWallet({
  id: 'bitski',
  name: 'Bitski',
  iconUrl: () => import('./bitskiWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { flag: 'isBitski' },
  downloadUrls: {
    chrome:
      'https://chrome.google.com/webstore/detail/bitski/feejiigddaafeojfddjjlmfkabimkell',
    browserExtension: 'https://bitski.com',
  },
  instructions: {
    extension: {
      learnMoreUrl:
        'https://bitski.zendesk.com/hc/articles/12803972818836-How-to-install-the-Bitski-browser-extension',
    },
  },
});
