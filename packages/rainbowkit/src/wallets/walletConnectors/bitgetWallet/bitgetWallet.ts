import { isAndroid } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

export const bitgetWallet = createWallet({
  id: 'bitget',
  name: 'Bitget Wallet',
  rdns: 'com.bitget.web3',
  iconUrl: () => import('./bitgetWallet.svg').then((m) => m.default),
  iconAccent: '#f6851a',
  iconBackground: '#fff',
  detect: { namespace: 'bitkeep.ethereum', flag: 'isBitKeep' },
  downloadUrls: {
    android: 'https://web3.bitget.com/en/wallet-download?type=0',
    ios: 'https://apps.apple.com/app/bitkeep/id1395301115',
    mobile: 'https://web3.bitget.com/en/wallet-download?type=2',
    qrCode: 'https://web3.bitget.com/en/wallet-download',
    chrome:
      'https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak',
    browserExtension: 'https://web3.bitget.com/en/wallet-download',
  },
  mobileDeepLink: (uri) =>
    isAndroid() ? uri : `bitkeep://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    extension: { learnMoreUrl: 'https://web3.bitget.com/en/academy' },
    qrCode: { learnMoreUrl: 'https://web3.bitget.com/en/academy' },
  },
});
