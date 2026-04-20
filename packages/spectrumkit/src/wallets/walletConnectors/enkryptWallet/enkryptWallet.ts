import { createWallet } from '../../createWallet';

export const enkryptWallet = createWallet({
  id: 'enkrypt',
  name: 'Enkrypt Wallet',
  rdns: 'com.enkrypt',
  iconUrl: () => import('./enkryptWallet.svg').then((m) => m.default),
  iconBackground: '#FFFFFF',
  detect: { namespace: 'enkrypt.providers.ethereum' },
  downloadUrls: {
    qrCode: 'https://www.enkrypt.com',
    chrome:
      'https://chrome.google.com/webstore/detail/enkrypt-ethereum-polkadot/kkpllkodjeloidieedojogacfhpaihoh',
    browserExtension: 'https://www.enkrypt.com/',
    edge: 'https://microsoftedge.microsoft.com/addons/detail/enkrypt-ethereum-polkad/gfenajajnjjmmdojhdjmnngomkhlnfjl',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/enkrypt/',
    opera: 'https://addons.opera.com/en/extensions/details/enkrypt/',
    safari: 'https://apps.apple.com/app/enkrypt-web3-wallet/id1640164309',
  },
  instructions: {
    extension: {
      learnMoreUrl: 'https://blog.enkrypt.com/what-is-a-web3-wallet/',
    },
  },
});
