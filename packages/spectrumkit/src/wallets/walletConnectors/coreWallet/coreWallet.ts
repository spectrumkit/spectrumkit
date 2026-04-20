import { createWallet } from '../../createWallet';

export const coreWallet = createWallet({
  id: 'core',
  name: 'Core',
  rdns: 'app.core.extension',
  iconUrl: () => import('./coreWallet.svg').then((m) => m.default),
  iconBackground: '#1A1A1C',
  detect: { namespace: 'avalanche', flag: 'isAvalanche' },
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=com.avaxwallet',
    ios: 'https://apps.apple.com/us/app/core-wallet/id6443685999',
    mobile: 'https://core.app/?downloadCoreMobile=1',
    qrCode: 'https://core.app/?downloadCoreMobile=1',
    chrome:
      'https://chrome.google.com/webstore/detail/core-crypto-wallet-nft-ex/agoakfejjabomempkjlepdflaleeobhb',
    browserExtension: 'https://extension.core.app/',
  },
  mobileDeepLink: (uri) => uri,
  qrUriTransform: (uri) => uri,
  instructions: {
    qrCode: {
      learnMoreUrl:
        'https://support.avax.network/en/articles/6115608-core-mobile-how-to-add-the-core-mobile-to-my-phone',
    },
    extension: { learnMoreUrl: 'https://extension.core.app/' },
  },
});
