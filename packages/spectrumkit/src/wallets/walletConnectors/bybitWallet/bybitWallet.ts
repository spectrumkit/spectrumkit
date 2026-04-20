import { createWallet } from '../../createWallet';

export const bybitWallet = createWallet({
  id: 'bybit',
  name: 'Bybit Wallet',
  rdns: 'com.bybit',
  iconUrl: () => import('./bybitWallet.svg').then((m) => m.default),
  iconBackground: '#000000',
  detect: { namespace: 'bybitWallet' },
  downloadUrls: {
    chrome:
      'https://chromewebstore.google.com/detail/bybit-wallet/pdliaogehgdbhbnmkklieghmmjkpigpa',
    browserExtension: 'https://www.bybit.com/en/web3',
    android: 'https://play.google.com/store/apps/details?id=com.bybit.app',
    ios: 'https://apps.apple.com/us/app/bybit-buy-trade-crypto/id1488296980',
    mobile: 'https://www.bybit.com/en/web3',
    qrCode: 'https://www.bybit.com/en/web3',
  },
  mobileDeepLink: (uri) =>
    `bybitapp://open/route?targetUrl=by://web3/walletconnect/wc?uri=${encodeURIComponent(
      uri,
    )}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://www.bybit.com/en/web3' },
    extension: { learnMoreUrl: 'https://www.bybit.com/en/web3' },
  },
});
