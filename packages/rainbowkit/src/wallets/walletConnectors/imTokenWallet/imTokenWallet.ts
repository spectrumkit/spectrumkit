import { createWallet } from '../../createWallet';

const isChinese =
  typeof window !== 'undefined' && window.navigator.language.includes('zh');

export const imTokenWallet = createWallet({
  id: 'imToken',
  i18nId: 'im_token',
  name: 'imToken',
  iconUrl: () => import('./imTokenWallet.svg').then((m) => m.default),
  iconBackground: '#098de6',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=im.token.app',
    ios: 'https://itunes.apple.com/us/app/imtoken2/id1384798940',
    mobile: 'https://token.im/download',
    qrCode: 'https://token.im/download',
  },
  mobileDeepLink: (uri) => `imtokenv2://wc?uri=${encodeURIComponent(uri)}`,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: {
      learnMoreUrl: isChinese
        ? 'https://support.token.im/hc/zh-cn/categories/360000925393'
        : 'https://support.token.im/hc/en-us/categories/360000925393',
    },
  },
});
