import { isAndroid } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

export const binanceWallet = createWallet({
  id: 'binance',
  name: 'Binance Wallet',
  rdns: 'com.binance.wallet',
  iconUrl: () => import('./binanceWallet.svg').then((m) => m.default),
  iconBackground: '#000000',
  detect: { namespace: 'binancew3w.isExtension', flag: 'isBinance' },
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=com.binance.dev',
    ios: 'https://apps.apple.com/us/app/id1436799971',
    mobile: 'https://www.binance.com/en/download',
    qrCode: 'https://www.binance.com/en/web3wallet',
    chrome:
      'https://chromewebstore.google.com/detail/cadiboklkpojfamcoggejbbdjcoiljjk',
  },
  mobileDeepLink: (uri) =>
    isAndroid()
      ? uri
      : `bnc://app.binance.com/cedefi/wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://www.binance.com/en/web3wallet' },
  },
});
