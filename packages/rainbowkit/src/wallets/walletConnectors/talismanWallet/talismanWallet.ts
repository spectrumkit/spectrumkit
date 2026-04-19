import { createWallet } from '../../createWallet';

export const talismanWallet = createWallet({
  id: 'talisman',
  name: 'Talisman',
  rdns: 'xyz.talisman',
  iconUrl: () => import('./talismanWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { namespace: 'talismanEth', flag: 'isTalisman' },
  downloadUrls: {
    chrome:
      'https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
    firefox:
      'https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/',
    browserExtension: 'https://talisman.xyz/download',
  },
  instructions: {
    extension: { learnMoreUrl: 'https://talisman.xyz/' },
  },
});
