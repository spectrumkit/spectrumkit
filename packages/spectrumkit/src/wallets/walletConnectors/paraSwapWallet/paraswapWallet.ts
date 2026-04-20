import { createWallet } from '../../createWallet';

export const paraSwapWallet = createWallet({
  id: 'paraswap',
  name: 'ParaSwap Wallet',
  iconUrl: () => import('./paraSwapWallet.svg').then((m) => m.default),
  iconBackground: '#578CFC',
  downloadUrls: {
    ios: 'https://apps.apple.com/us/app/paraswap-multichain-wallet/id1584610690',
    mobile: 'https://paraswap.io',
    qrCode: 'https://paraswap.io',
  },
  mobileDeepLink: (uri) => `paraswap://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://paraswap.io' },
  },
});
