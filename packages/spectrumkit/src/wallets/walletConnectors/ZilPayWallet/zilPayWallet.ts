import { createWallet } from '../../createWallet';

export const zilPayWallet = createWallet({
  id: 'zilpay',
  name: 'ZilPay',
  rdns: 'io.zilpay',
  iconUrl: () => import('./zilPayWallet.svg').then((m) => m.default),
  iconBackground: '#ffffff',
  detect: { flag: 'isZilPay' },
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=com.zilpaymobile',
    ios: 'https://apps.apple.com/ru/app/zilpay/id1547105860',
    mobile: 'https://zilpay.io/',
    qrCode: 'https://zilpay.io/',
  },
  mobileDeepLink: (uri) => `zilpay://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://zilpay.io' },
  },
});
