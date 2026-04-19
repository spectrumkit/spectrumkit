import { createWallet } from '../../createWallet';

export const novaWallet = createWallet({
  id: 'nova',
  name: 'Nova Wallet',
  rdns: 'io.novawallet',
  iconUrl: () => import('./novaWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  detect: { flag: 'isNovaWallet' },
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=io.novafoundation.nova.market',
    ios: 'https://apps.apple.com/us/app/nova-polkadot-wallet/id1597119355',
    mobile: 'https://nova-wallet.app.link',
    qrCode: 'https://nova-wallet.app.link',
  },
  mobileDeepLink: (uri) => `novawallet://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: {
      learnMoreUrl:
        'https://docs.novawallet.io/nova-wallet-wiki/dapps/using-walletconnect-for-dapps',
    },
  },
});
