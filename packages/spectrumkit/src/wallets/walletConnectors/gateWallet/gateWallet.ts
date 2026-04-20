import { isAndroid } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

export const gateWallet = createWallet({
  id: 'gate',
  name: 'Gate Wallet',
  rdns: 'io.gate.wallet',
  iconUrl: () => import('./gateWallet.svg').then((m) => m.default),
  iconAccent: '#fff',
  iconBackground: '#fff',
  detect: { namespace: 'gatewallet' },
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=com.gateio.gateio',
    ios: 'https://apps.apple.com/us/app/gate-io-buy-bitcoin-crypto/id1294998195',
    mobile: 'https://www.gate.io/mobileapp',
    qrCode: 'https://www.gate.io/web3',
    chrome:
      'https://chromewebstore.google.com/detail/gate-wallet/cpmkedoipcpimgecpmgpldfpohjplkpp',
    browserExtension: 'https://www.gate.io/web3',
  },
  mobileDeepLink: (uri) =>
    isAndroid() ? uri : `gtweb3wallet://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://www.gate.io/learn' },
    extension: { learnMoreUrl: 'https://www.gate.io/learn' },
  },
});
