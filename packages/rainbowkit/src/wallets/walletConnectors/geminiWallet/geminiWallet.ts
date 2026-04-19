import type { Wallet } from '../../Wallet';
import {
  getInjectedConnector,
  hasInjectedProvider,
} from '../../getInjectedConnector';

export const geminiWallet = (): Wallet => {
  return {
    id: 'gemini',
    name: 'Gemini Wallet',
    shortName: 'Gemini',
    rdns: 'com.gemini.wallet',
    iconUrl: async () => (await import('./geminiWallet.svg')).default,
    iconAccent: '#1FC4DF',
    iconBackground: '#1FC4DF',
    installed: hasInjectedProvider({ flag: 'isGemini' }),
    downloadUrls: {
      browserExtension: 'https://keys.gemini.com',
      qrCode: 'https://keys.gemini.com',
    },
    mobile: {
      getUri: (uri: string) => uri,
    },
    qrCode: {
      getUri: (uri: string) => uri,
      instructions: {
        learnMoreUrl: 'https://keys.gemini.com',
        steps: [
          {
            description: 'wallet_connectors.gemini.qr_code.step1.description',
            step: 'install',
            title: 'wallet_connectors.gemini.qr_code.step1.title',
          },
          {
            description: 'wallet_connectors.gemini.qr_code.step2.description',
            step: 'create',
            title: 'wallet_connectors.gemini.qr_code.step2.title',
          },
          {
            description: 'wallet_connectors.gemini.qr_code.step3.description',
            step: 'scan',
            title: 'wallet_connectors.gemini.qr_code.step3.title',
          },
        ],
      },
    },
    extension: {
      instructions: {
        learnMoreUrl: 'https://keys.gemini.com',
        steps: [
          {
            description: 'wallet_connectors.gemini.extension.step1.description',
            step: 'install',
            title: 'wallet_connectors.gemini.extension.step1.title',
          },
          {
            description: 'wallet_connectors.gemini.extension.step2.description',
            step: 'create',
            title: 'wallet_connectors.gemini.extension.step2.title',
          },
          {
            description: 'wallet_connectors.gemini.extension.step3.description',
            step: 'refresh',
            title: 'wallet_connectors.gemini.extension.step3.title',
          },
        ],
      },
    },
    createConnector: getInjectedConnector({
      flag: 'isGemini',
      namespace: 'ethereum',
    }),
  };
};
