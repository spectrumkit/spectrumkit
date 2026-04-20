import { isMobile } from '../../../utils/isMobile';
import { createWallet } from '../../createWallet';

const getUri = (uri: string) =>
  isMobile() ? `tpoutside://wc?uri=${encodeURIComponent(uri)}` : uri;

export const tokenPocketWallet = createWallet({
  id: 'tokenPocket',
  i18nId: 'token_pocket',
  name: 'TokenPocket',
  rdns: 'pro.tokenpocket',
  iconUrl: () => import('./tokenPocketWallet.svg').then((m) => m.default),
  iconBackground: '#2980FE',
  detect: { flag: 'isTokenPocket' },
  downloadUrls: {
    chrome:
      'https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii',
    browserExtension: 'https://extension.tokenpocket.pro/',
    android: 'https://play.google.com/store/apps/details?id=vip.mytokenpocket',
    ios: 'https://apps.apple.com/us/app/tp-global-wallet/id6444625622',
    qrCode: 'https://tokenpocket.pro/en/download/app',
    mobile: 'https://tokenpocket.pro/en/download/app',
  },
  mobileDeepLink: getUri,
  qrUriTransform: getUri,
  instructions: {
    qrCode: { learnMoreUrl: 'https://help.tokenpocket.pro/en/' },
    extension: {
      learnMoreUrl:
        'https://help.tokenpocket.pro/en/extension-wallet/faq/installation-tutorial',
    },
  },
});
