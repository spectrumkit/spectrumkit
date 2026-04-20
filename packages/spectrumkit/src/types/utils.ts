import type { EIP1193Provider } from 'viem';

/** Combines members of an intersection into a readable type. */
export type Evaluate<type> = { [key in keyof type]: type[key] } & unknown;

// window.ethereum types

export type WalletProviderFlags =
  | 'isApexWallet'
  | 'isAvalanche'
  | 'isBackpack'
  | 'isBifrost'
  | 'isBitKeep'
  | 'isBitski'
  | 'isBinance'
  | 'isBlockWallet'
  | 'isBraveWallet'
  | 'isCoinbaseWallet'
  | 'isDawn'
  | 'isEnkrypt'
  | 'isExodus'
  | 'isFrame'
  | 'isFrontier'
  | 'isGamestop'
  | 'isGemini'
  | 'isHyperPay'
  | 'isImToken'
  | 'isKuCoinWallet'
  | 'isMathWallet'
  | 'isMetaMask'
  | 'isNestWallet'
  | 'isOkxWallet'
  | 'isOKExWallet'
  | 'isOneInchAndroidWallet'
  | 'isOneInchIOSWallet'
  | 'isOpera'
  | 'isPhantom'
  | 'isZilPay'
  | 'isPortal'
  | 'isxPortal'
  | 'isRabby'
  | 'isRainbow'
  | 'isStatus'
  | 'isTally'
  | 'isTokenPocket'
  | 'isTokenary'
  | 'isTrust'
  | 'isTrustWallet'
  | 'isCTRL'
  | 'isZerion'
  | 'isTalisman'
  | 'isNovaWallet'
  | 'isZeal'
  | 'isCoin98'
  | 'isMEWwallet'
  | 'isSafeheron'
  | 'isSafePal'
  | 'isWigwam'
  | 'isMeCoWallet'
  | '__seif';

export type WalletProvider = Evaluate<
  EIP1193Provider & {
    [key in WalletProviderFlags]?: true | undefined;
  } & {
    providers?: any[] | undefined;
    /** Only exists in MetaMask as of 2022/04/03 */
    _events?: { connect?: (() => void) | undefined } | undefined;
    /** Only exists in MetaMask as of 2022/04/03 */
    _state?:
      | {
          accounts?: string[];
          initialized?: boolean;
          isConnected?: boolean;
          isPermanentlyDisconnected?: boolean;
          isUnlocked?: boolean;
        }
      | undefined;
  }
>;

export type WindowProvider = {
  ethereum?: WalletProvider | undefined;
  phantom?: { ethereum: WalletProvider } | undefined;
  providers?: any[] | undefined; // Adjust the type as needed
};
