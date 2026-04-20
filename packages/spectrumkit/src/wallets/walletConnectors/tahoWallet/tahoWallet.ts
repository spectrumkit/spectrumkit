import { createWallet } from '../../createWallet';

export const tahoWallet = createWallet({
  id: 'taho',
  name: 'Taho',
  iconBackground: '#d08d57',
  iconUrl: () => import('./tahoWallet.svg').then((m) => m.default),
  detect: { namespace: 'tally', flag: 'isTally' },
  downloadUrls: {
    chrome:
      'https://chrome.google.com/webstore/detail/taho/eajafomhmkipbjmfmhebemolkcicgfmd',
    browserExtension: 'https://taho.xyz',
  },
  instructions: {
    extension: {
      learnMoreUrl:
        'https://tahowallet.notion.site/Taho-Knowledge-Base-4d95ed5439c64d6db3d3d27abf1fdae5',
    },
  },
});
