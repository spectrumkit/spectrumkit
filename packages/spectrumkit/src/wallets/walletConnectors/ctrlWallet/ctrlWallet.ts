import { createWallet } from '../../createWallet';

export const ctrlWallet = createWallet({
  id: 'ctrl',
  name: 'CTRL Wallet',
  rdns: 'xyz.ctrl',
  iconUrl: () => import('./ctrlWallet.svg').then((m) => m.default),
  iconBackground: '#fff',
  // Detects on `ctrl.ethereum` (extension provider) but the wallet exposes
  // its EIP-1193 provider under `xfi.ethereum` once injected.
  detect: { namespace: 'ctrl.ethereum' },
  connect: { namespace: 'xfi.ethereum' },
  downloadUrls: {
    chrome:
      'https://chromewebstore.google.com/detail/ctrl-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
    browserExtension: 'https://ctrl.xyz',
  },
  instructions: {
    extension: { learnMoreUrl: 'https://ctrl.xyz' },
  },
});

/**
 * @deprecated Use `ctrlWallet` instead. This wallet connector will be removed in a future version.
 */
export const xdefiWallet = ctrlWallet;
