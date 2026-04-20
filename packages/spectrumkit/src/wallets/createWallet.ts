import type {
  DefaultWalletOptions,
  InstructionStepName,
  Wallet,
} from './Wallet';
import {
  type InjectedConnectorOptions,
  getInjectedConnector,
  hasInjectedProvider,
} from './getInjectedConnector';
import { getWalletConnectConnector } from './getWalletConnectConnector';
import { isMobile } from '../utils/isMobile';

/**
 * A detect option can either be static (same on every platform) or platform-
 * split — some wallets set different injected-provider flags on mobile vs
 * desktop (Trust Wallet being the canonical example).
 */
export type DetectOption =
  | InjectedConnectorOptions
  | { mobile: InjectedConnectorOptions; desktop: InjectedConnectorOptions };

function resolveDetect(detect: DetectOption | undefined) {
  if (!detect) return undefined;
  if ('mobile' in detect && 'desktop' in detect) {
    return isMobile() ? detect.mobile : detect.desktop;
  }
  return detect;
}

/**
 * Default step sequences. Most wallets repeat the same 3 steps with i18n keys
 * derived from the wallet id. Callers can override by passing explicit `steps`.
 */
const DEFAULT_EXTENSION_STEPS: readonly InstructionStepName[] = [
  'install',
  'create',
  'refresh',
];
const DEFAULT_QR_STEPS: readonly InstructionStepName[] = [
  'install',
  'create',
  'scan',
];

type InstructionSection = 'extension' | 'qr_code' | 'desktop';

function buildSteps(
  walletId: string,
  section: InstructionSection,
  steps: readonly InstructionStepName[],
) {
  return steps.map((step, i) => {
    const base = `wallet_connectors.${walletId}.${section}.step${i + 1}`;
    return {
      step,
      title: `${base}.title`,
      description: `${base}.description`,
    };
  });
}

function buildInstructions(
  walletId: string,
  section: InstructionSection,
  input: InstructionsInput | undefined,
  defaultSteps: readonly InstructionStepName[],
) {
  if (!input) return undefined;
  return {
    learnMoreUrl: input.learnMoreUrl,
    steps: input.steps
      ? buildSteps(walletId, section, input.steps)
      : buildSteps(walletId, section, defaultSteps),
  };
}

export interface InstructionsInput {
  learnMoreUrl: string;
  /** Override the default step sequence. */
  steps?: readonly InstructionStepName[];
}

export interface CreateWalletConfig {
  id: string;
  name: string;
  rdns?: string;
  shortName?: string;
  iconUrl: () => Promise<string>;
  iconBackground: string;
  iconAccent?: string;
  downloadUrls?: Wallet['downloadUrls'];

  /**
   * Override for the i18n key segment used when deriving translation keys.
   * Defaults to `id`. Use this for legacy wallets whose translation keys
   * differ from the wallet id (e.g. id="onekey" but keys say "one_key").
   */
  i18nId?: string;

  /**
   * How to detect the injected provider for this wallet.
   * Accepts a platform-split object for wallets that use different flags
   * on mobile vs desktop (e.g. Trust: isTrust on mobile, isTrustWallet on
   * desktop).
   */
  detect?: DetectOption;

  /**
   * Optional injected connector options used when CONNECTING. Defaults to
   * whatever `detect` resolves to. Use this for wallets that detect on one
   * namespace but expose their EIP-1193 provider under another (CTRL detects
   * on `ctrl.ethereum` but injects under `xfi.ethereum`).
   */
  connect?: InjectedConnectorOptions;

  /**
   * Optional hidden predicate (e.g. hide non-iOS-only wallets on desktop).
   */
  hidden?: () => boolean;

  /**
   * Mobile-app deep-link template. Given a WC URI, returns the deep link to
   * open the wallet app. Only used when falling back to WalletConnect.
   */
  mobileDeepLink?: (uri: string) => string;

  /**
   * Desktop-app deep-link template, for wallets distributed as native desktop
   * apps (e.g. Bloom). Given a WC URI, returns a protocol URL that opens the
   * wallet's desktop binary.
   */
  desktopDeepLink?: (uri: string) => string;

  /** Optional transform applied to the WC URI shown in the QR code. */
  qrUriTransform?: (uri: string) => string;

  /**
   * Getting-started instructions shown in the connect modal. Any omitted
   * section simply won't appear.
   */
  instructions?: {
    extension?: InstructionsInput;
    qrCode?: InstructionsInput;
    desktop?: InstructionsInput;
  };
}

/**
 * Factory for the common wallet-connector shape: injected detection with an
 * optional WalletConnect fallback. Collapses ~80 lines of boilerplate per
 * wallet to a ~15-line config object.
 */
export function createWallet(config: CreateWalletConfig) {
  const {
    id,
    i18nId = id,
    detect,
    connect,
    mobileDeepLink,
    desktopDeepLink,
    qrUriTransform,
    instructions,
    hidden,
  } = config;

  const resolvedDetect = resolveDetect(detect);
  const resolvedConnect = connect ?? resolvedDetect;
  const isInjected = resolvedDetect
    ? hasInjectedProvider(resolvedDetect)
    : false;
  const supportsWalletConnect = Boolean(
    mobileDeepLink || desktopDeepLink || qrUriTransform,
  );
  const shouldUseWalletConnect = !isInjected && supportsWalletConnect;

  const extensionInstructions = buildInstructions(
    i18nId,
    'extension',
    instructions?.extension,
    DEFAULT_EXTENSION_STEPS,
  );
  const qrCodeInstructions = buildInstructions(
    i18nId,
    'qr_code',
    instructions?.qrCode,
    DEFAULT_QR_STEPS,
  );
  const desktopInstructions = buildInstructions(
    i18nId,
    'desktop',
    instructions?.desktop,
    DEFAULT_EXTENSION_STEPS,
  );

  return ({
    projectId,
    walletConnectParameters,
  }: DefaultWalletOptions): Wallet => ({
    id,
    name: config.name,
    rdns: config.rdns,
    shortName: config.shortName,
    iconUrl: config.iconUrl,
    iconBackground: config.iconBackground,
    iconAccent: config.iconAccent,
    hidden,
    // `installed` semantics (matches the legacy hand-rolled wallets):
    //   no detect → undefined (wallet is a pure WC/remote one)
    //   detected + injected path active → true
    //   detected + falling back to WC → undefined (let the UI treat it as
    //     "connectable via WC" rather than "not installed")
    installed:
      resolvedDetect && !shouldUseWalletConnect ? isInjected : undefined,
    downloadUrls: config.downloadUrls,
    mobile: mobileDeepLink
      ? { getUri: shouldUseWalletConnect ? mobileDeepLink : undefined }
      : undefined,
    qrCode:
      shouldUseWalletConnect && qrCodeInstructions
        ? {
            getUri: qrUriTransform ?? ((uri: string) => uri),
            instructions: qrCodeInstructions,
          }
        : undefined,
    extension: extensionInstructions
      ? { instructions: extensionInstructions }
      : undefined,
    desktop:
      desktopDeepLink || desktopInstructions
        ? {
            getUri:
              desktopDeepLink && shouldUseWalletConnect
                ? desktopDeepLink
                : undefined,
            instructions: desktopInstructions,
          }
        : undefined,
    createConnector: shouldUseWalletConnect
      ? getWalletConnectConnector({ projectId, walletConnectParameters })
      : resolvedConnect
        ? getInjectedConnector(resolvedConnect)
        : getWalletConnectConnector({ projectId, walletConnectParameters }),
  });
}
